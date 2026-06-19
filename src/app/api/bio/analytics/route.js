import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key to insert analytics without needing to be authenticated
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { automationId, type } = await req.json();

    if (!automationId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type !== 'view') {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("smart_bio_analytics")
      .insert({
        automation_id: automationId,
        event_type: 'view',
      });

    if (error) {
      console.error("Bio Analytics Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bio Analytics Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
