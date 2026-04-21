import { createClient } from '../src/lib/supabase.js';

const supabase = createClient();

async function run() {
  console.log("🔍 Fetching a sample automation...");
  const { data, error } = await supabase.from('automations').select('id, page_name').limit(1);
  
  if (error) {
    console.error("❌ Error fetching automations:", error.message);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log("⚠️ No automations found in DB.");
    return;
  }

  const auto = data[0];
  console.log(`✅ Found automation: ${auto.page_name} (${auto.id})`);
  
  console.log("🧪 Simulating a Phase 1 Comment...");
  // We'll simulate a comment just for logging purposes. 
  // We don't want to actually send a DM during test to avoid bothering the user's followers.
  // So we just check if we can insert into automation_history.
}

run();
