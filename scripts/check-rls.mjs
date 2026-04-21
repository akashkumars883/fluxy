import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase.js";

async function check() {
  const supabase = createAdminClient();
  
  const { data: rlsStatus, error } = await supabase.rpc('inspect_rls', { table_name: 'triggers' });
  if (error) {
     // use raw query fallback
     const { data: policies } = await supabase.from('pg_policies').select('*').eq('tablename', 'triggers');
     console.log("Policies for triggers:", policies);
  } else {
     console.table(rlsStatus);
  }
}

check().catch(console.error);
