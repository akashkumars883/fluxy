import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase.js";

async function list() {
  const supabase = createAdminClient();
  const { data: autos } = await supabase.from('automations').select('*');
  console.log("--- ALL AUTOMATIONS (NO FILTER) ---");
  console.table(autos.map(a => ({ id: a.id, user_id: a.user_id, persona: a.persona, page_id: a.page_id })));
}

list().catch(console.error);
