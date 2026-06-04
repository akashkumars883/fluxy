import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { createAdminClient, createClient } from "@/lib/supabase";
import { MetaService } from "@/lib/meta";
import { decryptToken } from "@/lib/security";

/**
 * GET /api/media/profile-pic?automationId=...&senderId=...
 * Fetches the real-time profile picture of a given commenter/sender.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const automationId = searchParams.get("automationId");
  const senderId = searchParams.get("senderId");

  if (!automationId || !senderId) {
    return NextResponse.json({ error: "Missing automationId or senderId" }, { status: 400 });
  }

  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    let currentUser = user;
    if ((authError || !currentUser) && ["localhost", "127.0.0.1"].includes(new URL(req.url).hostname)) {
      currentUser = { id: "dev-bypass" };
    }

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createAdminClient();

    // Fetch the access token from the automation record
    const { data: automation, error: automationError } = await supabaseAdmin
      .from("automations")
      .select("access_token")
      .eq("id", automationId)
      .eq("user_id", currentUser.id)
      .maybeSingle();

    if (!automation || automationError) {
      return NextResponse.json({ error: "Automation not found" }, { status: 404 });
    }

    const decryptedToken = decryptToken(automation.access_token);
    if (!decryptedToken) {
      return NextResponse.json({ error: "Missing access_token" }, { status: 400 });
    }

    const profileResult = await MetaService.getUserProfile(senderId, decryptedToken);
    
    if (!profileResult.success || !profileResult.data) {
      return NextResponse.json({ error: profileResult.error || "Failed to fetch user profile" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      profilePic: profileResult.data.profile_pic || null,
      name: profileResult.data.name || null
    });
  } catch (error) {
    console.error("API /api/media/profile-pic Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
