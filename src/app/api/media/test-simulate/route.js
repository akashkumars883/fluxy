import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { createAdminClient, createClient } from "@/lib/supabase";

export async function POST(req) {
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

    const { automationId, type } = await req.json();

    if (!automationId || !type) {
      return NextResponse.json({ error: "Missing automationId or type" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    const randomNames = ["amit_kumar", "neha_sharma", "karan_singh", "pooja_patel", "rohit_sharma", "simran_kaur", "rahul_singh", "riya_varmas"];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const randomKeywords = ["price", "join", "collab", "promo"];
    const randomKeyword = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];

    const { data, error } = await supabaseAdmin
      .from("automation_history")
      .insert({
        automation_id: automationId,
        sender_id: "dev-simulated-" + Math.floor(Math.random() * 10000),
        sender_name: randomName,
        type: type, // "COMMENT" or "DM"
        keyword: randomKeyword,
        status: "SUCCESS",
        metadata: { simulated: true }
      })
      .select()
      .single();

    if (error) {
      console.error("DB Insert Error inside simulation route:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Simulation Route Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
