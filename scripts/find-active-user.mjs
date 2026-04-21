import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase.js";

async function find() {
  const supabase = createAdminClient();
  
  // Try to find any automation history entries to see which IDs are active
  const { data: logs } = await supabase.from('automation_history').select('automation_id').order('created_at', { ascending: false }).limit(5);
  
  if (logs && logs.length > 0) {
     const autoIds = [...new Set(logs.map(l => l.automation_id))];
     const { data: autos } = await supabase.from('automations').select('user_id, id').in('id', autoIds);
     console.log("--- RECENT ACTIVE USERS FROM LOGS ---");
     console.table(autos);
  } else {
     // Fallback: list all users in automations table
     const { data: autos } = await supabase.from('automations').select('user_id, id, persona');
     console.log("--- ALL AUTOMATIONS ---");
     console.table(autos);
  }
}

find().catch(console.error);
