/* scripts/verify-all.mjs */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Forced initialization (dev/test)
process.env.ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY ||
  "0000000000000000000000000000000000000000000000000000000000000000";

async function run() {
  // Dynamic imports to ensure env is set first
  const { createAdminClient } = await import("../src/lib/supabase.js");
  const { encryptToken } = await import("../src/lib/security.js");
  const { MetaService } = await import("../src/lib/meta.js");
  const { processAutomation } = await import("../src/lib/automation.js");

  const supabase = createAdminClient();

  // Guarantee uniqueness & UUID compliance
  const userId = "5de676f1-ea54-414f-93fd-cb7cdd678cc6";
  const uniqueNum = Date.now().toString().slice(-8);
  const automationId = `00000000-0000-0000-0000-${uniqueNum.padStart(12, "0")}`;
  const pageId = `DEMO_PAGE_${uniqueNum}`;

  // Seeding
  const automationPayload = {
    id: automationId,
    user_id: userId,
    page_id: pageId,
    name: "Automixa Demo",
    is_active: true,
    ai_enabled: true,
    brand_name: "Automixa Demo",
    access_token: encryptToken("test_token"),
  };

  let autoError;
  ({ error: autoError } = await supabase.from("automations").upsert(automationPayload));
  if (autoError?.message && /Could not find the 'brand_name' column|Could not find the 'ai_enabled' column/i.test(autoError.message)) {
    const legacyPayload = { ...automationPayload };
    delete legacyPayload.ai_enabled;
    delete legacyPayload.brand_name;
    ({ error: autoError } = await supabase.from("automations").upsert(legacyPayload));
  }

  if (autoError) {
    console.error("ERROR SEEDING AUTOMATION:", autoError.message);
    return;
  }

  const { error: trigError } = await supabase.from("triggers").upsert([
    {
      automation_id: automationId,
      keyword: "SALE",
      type: "DM",
      response: "Limited time 20% OFF! Use code DEMO20 at checkout.",
    },
    {
      automation_id: automationId,
      keyword: "*",
      type: "DM",
      response: "Thanks for your interest! Check your DM.",
    },
    {
      automation_id: automationId,
      keyword: "DEFAULT",
      type: "DM",
      response: "Thanks for the tag! You rock!",
    },
  ]);

  if (trigError) {
    console.error("ERROR SEEDING TRIGGERS:", trigError.message);
    return;
  }

  // Mocking Meta APIs
  MetaService.sendDM = async (id, text) => {
    console.log(`[SENT DM TO ${id}] "${text}"`);
    return { success: true };
  };
  MetaService.sendPrivateReply = async (id, text) => {
    console.log(`[SENT PRIVATE REPLY TO ${id}] "${text}"`);
    return { success: true };
  };
  MetaService.sendCommentReply = async (id) => {
    console.log(`[SENT PUBLIC REPLY TO ${id}]`);
    return { success: true };
  };
  MetaService.sendReaction = async (_id, mid, emoji) => {
    console.log(`[REACTED ${emoji} TO STORY ${mid}]`);
    return { success: true };
  };
  MetaService.getUserProfile = async () => ({ success: true, data: { name: "Akash" } });
  MetaService.checkFollowStatus = async () => ({ success: true, isFollowing: true });
  MetaService.getMediaContext = async (id) => ({
    success: true,
    caption:
      id === "P1"
        ? "This limited Luxury Watch is normally $500, but now $299 for early birds!"
        : "Casual morning coffee.",
  });

  console.log("--- STARTING SIMULATION ---");

  console.log("[CASE 1: SALES INTENT DETECTED]");
  await processAutomation("U1", "Is this still available? Price?", "COMMENT", pageId, "C1", "P1");

  console.log("[CASE 2: INFLUENCER MODE]");
  await processAutomation("U2", "Wow amazing!", "COMMENT", pageId, "C2", "P2");

  console.log("[CASE 3: STORY MENTION]");
  await processAutomation("U3", "Love this product!", "STORY_MENTION", pageId, null, null, "MID_999");

  console.log("[CASE 4: RETURNING USER (MEMORY)]");
  await processAutomation("U1", "Hey man, can I get it for cheaper?", "DM", pageId);

  console.log("VERIFICATION COMPLETE");
}

run().catch((err) => {
  console.error("CRITICAL ERROR IN VERIFICATION:");
  console.error(err);
});
