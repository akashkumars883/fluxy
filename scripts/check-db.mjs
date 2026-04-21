/* scripts/check-db.mjs */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase.js";

async function check() {
  const supabase = createAdminClient();
  const { data: users } = await supabase.from("users").select("id, email").limit(1);
  console.log("--- USERS ---");
  console.table(users);

  const { data: automations } = await supabase.from("automations").select("id, page_id, is_active, user_id, persona, brand_name");
  console.log("--- AUTOMATIONS (WITH USER_ID) ---");
  console.table(automations);

  const { data: triggers } = await supabase.from("triggers").select("id, keyword, type, automation_id");
  console.log("--- TRIGGERS ---");
  console.table(triggers);
}

check().catch(console.error);
