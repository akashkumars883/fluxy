import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase.js";

async function check() {
  const supabase = createAdminClient();
  const { data: cols } = await supabase.from('triggers').select().limit(1);
  console.log("Current triggers columns:", Object.keys(cols[0] || {}));
}

check().catch(console.error);
