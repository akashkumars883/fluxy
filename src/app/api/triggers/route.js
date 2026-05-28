import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const supabase = createClient();
    
    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { automation_id, keyword, response, type, metadata, variants } = body;

    if (!automation_id || !keyword || !response) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // 2. Fetch user's active plan
    const { data: subData, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("plan_id, plan")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1);

    const userPlan = subData?.[0]?.plan_id || subData?.[0]?.plan || "free";

    // 3. Enforce Free Plan Limits (Max 5 Automations)
    if (userPlan === "free") {
      const { count, error: countError } = await supabaseAdmin
        .from("triggers")
        .select("*", { count: "exact", head: true })
        .eq("automation_id", automation_id);

      if (countError) {
        console.error("Error fetching triggers count:", countError);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }

      if (count >= 5) {
        return NextResponse.json(
          { 
            error: "Limit Exceeded", 
            message: "Free plan allows a maximum of 5 automations. Please upgrade to create more." 
          }, 
          { status: 403 }
        );
      }
    }

    // 4. Insert the new trigger
    const triggerPayload = {
      automation_id,
      keyword,
      response,
      type: type || "COMMENT",
      metadata: metadata || {},
      variants: variants || {}
    };

    const { data: newTrigger, error: insertError } = await supabaseAdmin
      .from("triggers")
      .insert([triggerPayload])
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting trigger:", insertError);
      return NextResponse.json({ error: "Failed to create trigger" }, { status: 500 });
    }

    return NextResponse.json({ success: true, trigger: newTrigger });

  } catch (error) {
    console.error("Error in POST /api/triggers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
