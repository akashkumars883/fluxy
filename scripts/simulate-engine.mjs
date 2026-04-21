/* scripts/simulate-engine.mjs - The Automixa Simulator */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// STEP 1: SET ENVIRONMENT VARIABLES FIRST
process.env.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || "dummy_key";

async function runTests() {
  console.log("--- STARTING AUTOMIXA SIMULATOR ---\n");

  // STEP 2: DYNAMICALLY IMPORT MODULES
  const { MetaService } = await import("../src/lib/meta.js");
  
  // Override MetaService for stubbing
  MetaService.sendDM = async (id, text) => { console.log(`[STUB: DM to ${id}] -> "${text}"`); return { success: true }; };
  MetaService.sendPrivateReply = async (id, text) => { console.log(`[STUB: Private Reply to ${id}] -> "${text}"`); return { success: true }; };
  MetaService.sendCommentReply = async (id, text) => { console.log(`[STUB: Public Reply to ${id}] -> "${text}"`); return { success: true }; };
  MetaService.sendReaction = async (id, mid, emoji) => { console.log(`[STUB: React ${emoji} to ${mid}]`); return { success: true }; };
  MetaService.getUserProfile = async () => ({ success: true, data: { name: "Test User" } });
  MetaService.checkFollowStatus = async () => ({ success: true, isFollowing: true });
  MetaService.getMediaContext = async (id) => ({ 
      success: true, 
      caption: id === "PROD_POST" ? "This limited edition 4k Watch is ONLY $99. Rare find!" : "Just a casual day at the beach." 
  });

  const { processAutomation } = await import("../src/lib/automation.js");

  // --- SCENARIO 1: INFLUENCER ---
  console.log("TEST 1: Influencer (Basic Info Req)");
  await processAutomation("USER_123", "Send link", "COMMENT", "PAGE_456", "COMMENT_789", "NORMAL_POST");
  console.log("\n------------------\n");

  // --- SCENARIO 2: SALES INTENT ---
  console.log("TEST 2: Sales (Buying Intent on Product Post)");
  await processAutomation("USER_SALES", "How much?? I want this.", "COMMENT", "PAGE_456", "COMMENT_SALES", "PROD_POST");
  console.log("\n------------------\n");

  // --- SCENARIO 3: STORY ---
  console.log("TEST 3: Story Mention (React + Smart Appreciation)");
  await processAutomation("USER_STORY", "OMG!", "STORY_MENTION", "PAGE_456", null, null, "MID_STORY");
  console.log("\n------------------\n");

  // --- SCENARIO 4: MEMORY ---
  console.log("TEST 4: Memory Recall (Returning User)");
  await processAutomation("USER_MEMORY", "Hey again!", "DM", "PAGE_456");

  console.log("\n--- SIMULATION COMPLETE ---");
}

runTests().catch(console.error);
