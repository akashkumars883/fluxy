import { createAdminClient } from '../src/lib/supabase.js';

const supabaseAdmin = createAdminClient();

async function testInsert() {
  const targetId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
  console.log(`🚀 Attempting TEST INSERT to automation_history for ${targetId}...`);
  
  const { data, error } = await supabaseAdmin.from('automation_history').insert({
    automation_id: targetId,
    sender_id: 'test_user_678',
    sender_name: 'AutoTester',
    type: 'COMMENT',
    keyword: 'TEST',
    status: 'INTERACTED',
    metadata: { funnel_complete: false, test: true }
  }).select().single();

  if (error) {
    console.error("❌ TEST INSERT FAILED:", error.message);
    if (error.message.includes("column")) {
      console.log("👉 Tip: Your table is missing a column. Run the SQL script I gave you!");
    }
  } else {
    console.log("✅ TEST INSERT SUCCESSFUL! History entry created:", data.id);
    
    // Now Cleanup
    console.log("🧹 Cleaning up test record...");
    await supabaseAdmin.from('automation_history').delete().eq('id', data.id);
    console.log("✅ Cleanup complete.");
  }
}

testInsert();
