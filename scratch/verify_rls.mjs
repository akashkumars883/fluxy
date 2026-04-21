import { createAdminClient } from '../src/lib/supabase.js';

const supabaseAdmin = createAdminClient();

async function verifyRLS() {
  const targetId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
  console.log(`🛡️ Testing RLS Bypass with Admin Client for ${targetId}...`);
  
  // 1. Try to INSERT (Bot Simulation)
  const { data, error } = await supabaseAdmin.from('automation_history').insert({
    automation_id: targetId,
    sender_id: 'rls_test_user',
    sender_name: 'RLS_Tester',
    type: 'COMMENT',
    keyword: 'RLS_CHECK',
    status: 'INTERACTED',
    metadata: { rls_test: true }
  }).select().single();

  if (error) {
    console.error("❌ RLS BLOCKED THE BOT:", error.message);
    console.log("👉 Tip: You might need to add a policy for 'service_role' or check for table-level restrictions.");
  } else {
    console.log("✅ RLS BYPASS SUCCESSFUL! Bot can still write logs.");
    
    // 2. Try to READ (as Admin)
    console.log("🔍 Verifying if history is searchable...");
    const { data: fetchResult, error: fetchError } = await supabaseAdmin
        .from('automation_history')
        .select('*')
        .eq('id', data.id)
        .single();
    
    if (fetchError) {
        console.error("❌ FETCH FAILED:", fetchError.message);
    } else {
        console.log("✅ FETCH SUCCESSFUL! Record found.");
    }

    // Cleanup
    await supabaseAdmin.from('automation_history').delete().eq('id', data.id);
    console.log("🧹 Test record cleaned up.");
  }
}

verifyRLS();
