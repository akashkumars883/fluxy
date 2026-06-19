import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const automationId = searchParams.get("automationId");
    const linkId = searchParams.get("linkId"); // Optional

    if (!url || !automationId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fire and forget analytics tracking
    supabaseAdmin
      .from("smart_bio_analytics")
      .insert({
        automation_id: automationId,
        event_type: 'click',
        link_id: linkId || null,
      })
      .then(({ error }) => {
        if (error) console.error("Bio Analytics Click Insert Error:", error);
      });

    // Redirect user immediately
    return NextResponse.redirect(url, { status: 302 });
  } catch (error) {
    console.error("Bio Redirect Error:", error);
    // If something fails, still try to redirect them
    const fallbackUrl = new URL(req.url).searchParams.get("url");
    if (fallbackUrl) {
      return NextResponse.redirect(fallbackUrl, { status: 302 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
