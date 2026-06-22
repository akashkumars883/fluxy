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
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json({ error: "Missing accountId" }, { status: 400 });
    }

    // 2. Verify ownership of the automation
    const { data: userAutomation, error: verifyError } = await supabase
      .from("automations")
      .select("id")
      .eq("id", accountId)
      .eq("user_id", user.id)
      .single();

    if (verifyError || !userAutomation) {
      return NextResponse.json({ error: "Forbidden: You do not own this automation." }, { status: 403 });
    }

    const supabaseAdmin = createAdminClient();

    // 3. Delete triggers associated with the automation
    const { error: triggersDeleteError } = await supabaseAdmin
      .from("triggers")
      .delete()
      .eq("automation_id", accountId);

    if (triggersDeleteError) {
      console.error("Error deleting triggers:", triggersDeleteError);
      return NextResponse.json({ error: "Failed to delete associated triggers" }, { status: 500 });
    }

    // 4. Delete the automation record
    const { error: automationDeleteError } = await supabaseAdmin
      .from("automations")
      .delete()
      .eq("id", accountId);

    if (automationDeleteError) {
      console.error("Error deleting automation:", automationDeleteError);
      return NextResponse.json({ error: "Failed to delete automation" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error in POST /api/automations/delete:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
