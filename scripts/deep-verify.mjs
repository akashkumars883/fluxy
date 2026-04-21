import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase.js";

async function verify() {
  const supabase = createAdminClient();
  const testId = "ffffffff-ffff-ffff-ffff-ffffffffffff";
  
  const { data: auto } = await supabase.from('automations').select('id, page_name').eq('id', testId).maybeSingle();
  const { data: trigs } = await supabase.from('triggers').select('*').eq('automation_id', testId);
  
  console.log("Automation found:", auto);
  console.log("Triggers found for this automation:", trigs?.length || 0);
  console.table(trigs?.map(t => ({ id: t.id, auto_id: t.automation_id, keyword: t.keyword })));
  
  // Check triggers WITHOUT filter to see if IDs match
  const { data: allTrigs } = await supabase.from('triggers').select('automation_id').limit(5);
  console.log("Sample automation_ids in triggers table:", allTrigs);
}

verify().catch(console.error);
