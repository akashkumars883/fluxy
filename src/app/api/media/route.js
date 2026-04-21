import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
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

  // 1. SMART MOCK FOR TEST ACCOUNT (Bypass DB for demo)
  if (automationId === "ffffffff-ffff-ffff-ffff-ffffffffffff") {
    const demoMedia = [
      { id: "demo_1", media_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop", caption: "Launching our new Minimalist Hub! 🚀 #productivity", permalink: "#" },
      { id: "demo_2", media_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop", caption: "Code, Coffee, repeat. ☕️💻", permalink: "#" },
      { id: "demo_3", media_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop", caption: "Analytics that actually make sense. 📈", permalink: "#" },
      { id: "demo_4", media_url: "https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=1000&auto=format&fit=crop", caption: "Growth mode: ON. ⚡️", permalink: "#" },
      { id: "demo_5", media_url: "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=1000&auto=format&fit=crop", caption: "The setup of your dreams. ✨", permalink: "#" },
    ];
    return NextResponse.json({ media: demoMedia });
  }

  try {
    const supabase = createAdminClient();
    
    // 2. Get the automation records to retrieve the token and IG ID
    const { data: auto, error: autoError } = await supabase
      .from("automations")
      .select("ig_business_id, access_token, page_token")
      .eq("id", automationId)
      .maybeSingle();

    if (!auto || autoError) {
      return NextResponse.json({ error: "Automation not found" }, { status: 404 });
    }

    // 3. Decrypt the token
    const decryptedToken = decryptToken(auto.access_token);

    // 4. Fetch media list from Meta
    const result = await MetaService.getMediaList(auto.ig_business_id, decryptedToken);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ media: result.data });
  } catch (error) {
    console.error("API /api/media Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
