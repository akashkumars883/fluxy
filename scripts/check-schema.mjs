import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase.js";

async function schema() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc('inspect_table', { table_name: 'automations' });
  
  if (error) {
     // fallback if no RPC
     const { data: cols } = await supabase.from('automations').select().limit(1);
     console.log("Columns found via select:", Object.keys(cols[0] || {}));
  } else {
     console.table(data);
  }
}

schema().catch(console.error);
