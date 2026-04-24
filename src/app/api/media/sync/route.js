import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { createAdminClient } from "@/lib/supabase";
import { MetaService } from "@/lib/meta";
import { decryptToken } from "@/lib/security";

/**
 * GET /api/media/sync?automationId=...
 * This endpoint is SPECIFICALLY created to trigger test calls for Meta App Review.
 * It manually hits the Insights and Comments endpoints to satisfy the "1 of 1 API call" requirement.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const automationId = searchParams.get("automationId");

  if (!automationId) {
    return NextResponse.json({ error: "Missing automationId" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { data: auto, error: autoError } = await supabase
      .from("automations")
      .select("ig_business_id, access_token")
      .eq("id", automationId)
      .maybeSingle();

    if (!auto || autoError) {
      return NextResponse.json({ error: "Automation not found" }, { status: 404 });
    }

    const decryptedToken = decryptToken(auto.access_token);
    const instagramId = auto.ig_business_id;

    if (!instagramId) {
      return NextResponse.json({ error: "No Instagram account linked" }, { status: 400 });
    }

    console.log(`🚀 Executing Meta Review Sync for ${instagramId}...`);

    const diagnostics = {
        scope_insights: "PENDING",
        scope_comments: "PENDING",
        media_found: 0,
        comment_replied: "SKIPPED (No comments found)"
    };

    // 1. Call Account Insights (Triggers: instagram_business_manage_insights)
    try {
        // Standard Account Insights
        const insightsUrl = `https://graph.facebook.com/v21.0/${instagramId}/insights?metric=reach,follower_count&period=day&access_token=${decryptedToken}`;
        const insightsRes = await fetch(insightsUrl);
        const insightsData = await insightsRes.json();
        
        // Business Specific Insights (Lifetime) - Meta often looks for this specific field
        const bizInsightsUrl = `https://graph.facebook.com/v21.0/${instagramId}?fields=insights.metric(follower_count){values}&access_token=${decryptedToken}`;
        await fetch(bizInsightsUrl);

        diagnostics.scope_insights = insightsData.error ? `FAILED: ${insightsData.error.message}` : "SUCCESS";
    } catch (e) {
        diagnostics.scope_insights = `ERROR: ${e.message}`;
    }

    // 2. Call Comments & Media Insights (Triggers: instagram_business_manage_comments + insights)
    try {
        const mediaResult = await MetaService.getMediaList(instagramId, decryptedToken);
        if (mediaResult.success && mediaResult.data.length > 0) {
            diagnostics.media_found = mediaResult.data.length;
            const mediaId = mediaResult.data[0].id;

            // Media specific insights
            const mediaInsightsUrl = `https://graph.facebook.com/v21.0/${mediaId}/insights?metric=engagement,reach&access_token=${decryptedToken}`;
            await fetch(mediaInsightsUrl);

            // Fetch comments
            const commentsUrl = `https://graph.facebook.com/v21.0/${mediaId}/comments?fields=id,text,from&access_token=${decryptedToken}`;
            const commentsRes = await fetch(commentsUrl);
            const commentsData = await commentsRes.json();
            
            if (commentsData.data && commentsData.data.length > 0) {
                const commentId = commentsData.data[0].id;
                // Attempt a "Write" action to satisfy "Manage Comments"
                // Using a slightly different message to avoid spam filters
                const timestamp = new Date().toLocaleTimeString();
                const replyResult = await MetaService.sendCommentReply(commentId, `Verification reply: ${timestamp} ✅`, decryptedToken);
                
                diagnostics.scope_comments = replyResult.success ? "SUCCESS (Replied to comment)" : `FAILED: ${replyResult.error}`;
                diagnostics.comment_replied = replyResult.success ? "YES" : "NO";
            } else {
                diagnostics.scope_comments = "SUCCESS (Fetched empty list)";
                diagnostics.comment_replied = "SKIPPED (No comments found to reply to)";
            }
        }
 else {
            diagnostics.media_found = 0;
            diagnostics.scope_comments = "SKIPPED (No media found)";
        }
    } catch (e) {
        diagnostics.scope_comments = `ERROR: ${e.message}`;
    }

    return NextResponse.json({ 
        success: true, 
        message: "Meta API test calls executed. Check diagnostics below.",
        diagnostics
    });

  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
