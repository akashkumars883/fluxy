import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase.js";

async function check() {
  const supabase = createAdminClient();
  const testUuid = "ffffffff-ffff-ffff-ffff-ffffffffffff";
  
  const { data: triggerCount } = await supabase.from('triggers').select('*', { count: 'exact', head: true }).eq('automation_id', testUuid);
  console.log("Trigger count for UUID:", triggerCount);
  
  const { data: allTriggers } = await supabase.from('triggers').select('*');
  console.log("All triggers in DB:");
  console.table(allTriggers.map(t => ({ id: t.id, auto_id: t.automation_id, keyword: t.keyword })));
}

check().catch(console.error);
