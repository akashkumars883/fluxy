import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase";
import { MetaService } from "@/lib/meta";
import { decryptToken } from "@/lib/security";

/**
 * GET /api/media/sync?automationId=...
 * Trigger "real" Meta Graph calls for App Review (insights + comments).
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const automationId = searchParams.get("automationId");

  if (!automationId) {
    return NextResponse.json({ error: "Missing automationId" }, { status: 400 });
  }

  const diagnostics = {
    required_permissions: {
      insights: "instagram_manage_insights",
      comments: "instagram_manage_comments",
    },
    token_scopes: null,
    token_granular_scopes: null,
    scope_insights: "PENDING",
    scope_comments: "PENDING",
    media_found: 0,
    comment_replied: "SKIPPED",
    errors: [],
  };

  try {
    const supabase = createAdminClient();
    const { data: automation, error: automationError } = await supabase
      .from("automations")
      .select("page_id, ig_business_id, access_token")
      .eq("id", automationId)
      .maybeSingle();

    if (!automation || automationError) {
      return NextResponse.json({ error: "Automation not found" }, { status: 404 });
    }

    const decryptedToken = decryptToken(automation.access_token);
    if (!decryptedToken) {
      return NextResponse.json(
        { error: "Missing access_token for this automation" },
        { status: 400 }
      );
    }
    let instagramId = automation.ig_business_id;

    // Auto-repair: fetch IG business id from the Page if missing
    if (!instagramId && automation.page_id) {
      const idResult = await MetaService.getInstagramBusinessIdFromPage(
        automation.page_id,
        decryptedToken
      );
      if (idResult.success && idResult.instagramBusinessId) {
        instagramId = idResult.instagramBusinessId;
        await supabase
          .from("automations")
          .update({ ig_business_id: instagramId })
          .eq("id", automationId);
      }
    }

    if (!instagramId) {
      return NextResponse.json(
        { error: "No Instagram account linked (missing ig_business_id)" },
        { status: 400 }
      );
    }

    // Helpful review diagnostics: what permissions does this token actually have?
    const debug = await MetaService.debugToken(decryptedToken);
    if (debug.success) {
      diagnostics.token_scopes = debug.data?.scopes || null;
      diagnostics.token_granular_scopes = debug.data?.granular_scopes || null;
    } else {
      diagnostics.errors.push(`debug_token: ${debug.error}`);
    }

    console.log(`Meta review sync: ig_business_id=${instagramId}`);

    // 1) Account insights (instagram_manage_insights)
    try {
      const insightsUrl =
        `https://graph.facebook.com/v21.0/${instagramId}/insights` +
        `?metric=reach,follower_count&period=day&access_token=${decryptedToken}`;

      const res = await fetch(insightsUrl);
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        diagnostics.scope_insights = `FAILED: ${data?.error?.message || `HTTP ${res.status}`}`;
      } else {
        diagnostics.scope_insights = "SUCCESS";
      }
    } catch (e) {
      diagnostics.scope_insights = `ERROR: ${e.message}`;
    }

    // 2) Comments + Media insights (instagram_manage_comments + instagram_manage_insights)
    try {
      const mediaResult = await MetaService.getMediaList(instagramId, decryptedToken, {
        limit: 5,
      });

      if (!mediaResult.success) {
        diagnostics.scope_comments = `FAILED: ${mediaResult.error}`;
        diagnostics.errors.push(`getMediaList: ${mediaResult.error}`);
      } else if (!mediaResult.data || mediaResult.data.length === 0) {
        diagnostics.media_found = 0;
        diagnostics.scope_comments = "SKIPPED: No media found";
      } else {
        diagnostics.media_found = mediaResult.data.length;
        const mediaId = mediaResult.data[0].id;

        // Optional: a media insights call to strengthen the review story
        const mediaInsightsUrl =
          `https://graph.facebook.com/v21.0/${mediaId}/insights` +
          `?metric=impressions,reach,engagement&access_token=${decryptedToken}`;
        await fetch(mediaInsightsUrl).catch(() => null);

        // Fetch comments
        const commentsUrl =
          `https://graph.facebook.com/v21.0/${mediaId}/comments` +
          `?fields=id,text,from&limit=5&access_token=${decryptedToken}`;
        const commentsRes = await fetch(commentsUrl);
        const commentsData = await commentsRes.json().catch(() => null);

        if (!commentsRes.ok) {
          diagnostics.scope_comments = `FAILED: ${
            commentsData?.error?.message || `HTTP ${commentsRes.status}`
          }`;
        } else if (commentsData?.data?.length > 0) {
          const commentId = commentsData.data[0].id;
          const timestamp = new Date().toISOString();
          const reply = await MetaService.sendCommentReply(
            commentId,
            `Verification reply: ${timestamp}`,
            decryptedToken
          );

          diagnostics.scope_comments = reply.success
            ? "SUCCESS: Replied to comment"
            : `FAILED: ${reply.error || "Reply failed"}`;
          diagnostics.comment_replied = reply.success ? "YES" : "NO";
        } else {
          diagnostics.scope_comments = "SUCCESS: Fetched empty comment list";
          diagnostics.comment_replied = "SKIPPED: No comments to reply";
        }
      }
    } catch (e) {
      diagnostics.scope_comments = `ERROR: ${e.message}`;
    }

    return NextResponse.json({
      success: true,
      message: "Meta API review calls executed. See diagnostics.",
      diagnostics,
    });
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
