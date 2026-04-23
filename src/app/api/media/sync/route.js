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

    // 1. Call Insights (Triggers: instagram_business_manage_insights)
    const insightsUrl = `https://graph.facebook.com/v21.0/${instagramId}/insights?metric=impressions,reach&period=day&access_token=${decryptedToken}`;
    const insightsRes = await fetch(insightsUrl);
    const insightsData = await insightsRes.json();
    console.log("✅ Insights Call Response:", insightsData.error ? "FAILED" : "SUCCESS");

    // 2. Call Comments (Triggers: instagram_business_manage_comments)
    // First we need at least one media entry
    const mediaResult = await MetaService.getMediaList(instagramId, decryptedToken);
    if (mediaResult.success && mediaResult.data.length > 0) {
      const mediaId = mediaResult.data[0].id;
      const commentsUrl = `https://graph.facebook.com/v21.0/${mediaId}/comments?access_token=${decryptedToken}`;
      const commentsRes = await fetch(commentsUrl);
      const commentsData = await commentsRes.json();
      console.log("✅ Comments Call Response:", commentsData.error ? "FAILED" : "SUCCESS");
    }

    return NextResponse.json({ 
        success: true, 
        message: "Meta API calls triggered successfully. Refresh your Meta Dashboard in a few minutes.",
        diagnostics: {
            insights: insightsData.error ? insightsData.error.message : "OK",
            media_found: mediaResult.data?.length || 0
        }
    });

  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
