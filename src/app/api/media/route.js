import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase";
import { MetaService } from "@/lib/meta";
import { decryptToken } from "@/lib/security";

/**
 * GET /api/media?automationId=...
 * Fetches recent Instagram media for a given automation.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const automationId = searchParams.get("automationId");

  if (!automationId) {
    return NextResponse.json({ error: "Missing automationId" }, { status: 400 });
  }

  // Smart mock for a demo automation id
  if (automationId === "ffffffff-ffff-ffff-ffff-ffffffffffff") {
    const demoMedia = [
      {
        id: "demo_1",
        media_url:
          "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
        caption: "Launching our new Minimalist Hub! #productivity",
        permalink: "#",
      },
      {
        id: "demo_2",
        media_url:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop",
        caption: "Code, coffee, repeat.",
        permalink: "#",
      },
      {
        id: "demo_3",
        media_url:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
        caption: "Analytics that actually make sense.",
        permalink: "#",
      },
      {
        id: "demo_4",
        media_url:
          "https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=1000&auto=format&fit=crop",
        caption: "Growth mode: ON.",
        permalink: "#",
      },
      {
        id: "demo_5",
        media_url:
          "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=1000&auto=format&fit=crop",
        caption: "The setup of your dreams.",
        permalink: "#",
      },
    ];
    return NextResponse.json({ media: demoMedia });
  }

  try {
    const supabase = createAdminClient();

    const { data: automation, error: automationError } = await supabase
      .from("automations")
      .select("page_id, ig_business_id, access_token")
      .eq("id", automationId)
      .maybeSingle();

    if (!automation || automationError) {
      return NextResponse.json(
        {
          error: "Automation not found",
          details:
            automationError?.message ||
            `No record found for ID: ${automationId}. Ensure this ID exists in your active Supabase database.`,
        },
        { status: 404 }
      );
    }

    const decryptedToken = decryptToken(automation.access_token);
    if (!decryptedToken) {
      return NextResponse.json(
        { error: "Missing access_token for this automation", media: [] },
        { status: 400 }
      );
    }
    let instagramId = automation.ig_business_id;

    // Auto-repair: if IG business id is missing, fetch from Page using its page token
    if (!instagramId && automation.page_id) {
      console.log(
        `Auto-Repair: ig_business_id missing for page_id=${automation.page_id}. Fetching...`
      );
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
        console.log(`Auto-Repair: saved ig_business_id=${instagramId}`);
      }
    }

    if (!instagramId) {
      return NextResponse.json({
        error: "Instagram account not linked to this page",
        media: [],
      });
    }

    const result = await MetaService.getMediaList(instagramId, decryptedToken);
    if (!result.success) {
      console.error(`Meta media fetch failed for ig_business_id=${instagramId}:`, result.error);
      return NextResponse.json({
        media: [],
        error: result.error,
        diagnostic:
          "Meta API returned an error. Check if 'instagram_basic' permission is granted (Advanced Access) and the token is valid.",
      });
    }

    return NextResponse.json({
      media: result.data || [],
      count: result.data?.length || 0,
    });
  } catch (error) {
    console.error("API /api/media Error:", error);
    return NextResponse.json({ error: "Internal Server Error", media: [] }, { status: 500 });
  }
}
