/* src/lib/automation.js - THE ULTIMATE ORCHESTRATOR */

import { createAdminClient } from "./supabase.js";
import { MetaService } from "./meta.js";
import { decryptToken } from "./security.js";
import { matchIntent, generatePersonalizedResponse } from "./ai.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Main Engine Orchestrator
 */
export async function processAutomation(senderId, text, type, recipientId, commentId = null, mediaId = null, messageId = null, payload = null) {
  const supabase = createAdminClient();
  
  // --- ANTI-LOOP & SELF-REPLY GUARD ---
  if (senderId === recipientId) {
    console.log(`🤖 Self-reply/Loop detected for ${senderId}. Skipping.`);
    return { success: false, reason: "anti_loop" };
  }

  try {
    let automationRows;
    let authError;

    // 1. Authenticate the Automation Account
    ({ data: automationRows, error: authError } = await supabase
      .from("automations")
      .select("*")
      .or(`page_id.eq.${recipientId},ig_business_id.eq.${recipientId}`)
      .limit(1));

    if (authError || !automationRows?.length) {
      console.error(`❌ Automation Auth Failed for ${recipientId}`);
      return { success: false };
    }
    
    const automation = automationRows[0];
    if (!automation.is_active) return { success: false };

    const pageAccessToken = decryptToken(automation.access_token);
    const profileResult = await MetaService.getUserProfile(senderId, pageAccessToken);
    const userName = profileResult.success ? profileResult.data.name : "there";

    // 2. Resolve Triggers for this automation
    let { data: triggers } = await supabase
      .from("triggers")
      .select("*")
      .eq("automation_id", automation.id);

    let match = null;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    // --- PAYLOAD-BASED RESOLUTION (Interactive Buttons) ---
    if (payload && isUuid.test(payload)) {
      match = triggers.find(t => t.id === payload);
    } else if (payload && payload.includes("VERIFY_FOLLOW:")) {
      const targetId = payload.split(":")[1];
      match = triggers.find(t => t.id === targetId);
    }

    // --- KEYWORD-BASED RESOLUTION (Incoming Text/Comments) ---
    if (!match) {
      const lowerText = (text || "").toLowerCase().trim();
      const eventTriggers = triggers.filter(t => t.type === type || (!t.type && type === "DM"));
      
      let activePool = eventTriggers;
      if (mediaId && type === "COMMENT") {
        const targeted = eventTriggers.filter(t => t.target_media_ids?.includes(mediaId));
        if (targeted.length > 0) activePool = targeted;
      }

      match = activePool.find(t => lowerText.includes((t.keyword || "").toLowerCase()));
      
      if (!match) {
        match = triggers.find(t => t.keyword === "*" || t.keyword === "DEFAULT");
      }
    }

    if (!match) return { success: false, reason: "no_trigger_match" };

    // --- PHASE 1: INITIAL COMMENT ENTRY ---
    if (type === "COMMENT" && commentId && !payload) {
      console.log(`🏃 Phase 1: Handling Comment from ${userName}`);
      
      // A. Intro DM with Delay (3-5s)
      await delay(Math.floor(Math.random() * 2000) + 3000);
      const introPayload = {
        text: `Hey ${userName}! 👋 I've got your link ready. Just tap the button below to get access!`,
        quick_replies: [
          {
            content_type: "text",
            title: "Send me the access 🔗",
            payload: match.id 
          }
        ]
      };
      await MetaService.sendPrivateReply(commentId, introPayload, pageAccessToken);

      // B. Public Comment Reply with Delay (7-10s)
      await delay(Math.floor(Math.random() * 3000) + 7000);
      const publicOptions = match.variants?.public || [];
      const chosenPublic = publicOptions.length > 0 ? getRandom(publicOptions) : "Check your DM for the link! 🚀";
      await MetaService.sendCommentReply(commentId, chosenPublic, pageAccessToken);
      
      return { success: true, phase: 1 };
    }

    // --- PHASE 2/3: FOLLOW GATE & VERIFICATION ---
    const needsFollow = match.metadata?.follower_gate === true;
    const isVerificationStep = payload && (isUuid.test(payload) || payload.includes("VERIFY_FOLLOW:"));

    if (isVerificationStep && needsFollow) {
      console.log(`🛡️ Phase 2/3: Checking Follow Gate for ${userName}`);
      const followData = await MetaService.checkFollowStatus(senderId, recipientId, pageAccessToken);
      
      if (followData.success && !followData.isFollowing) {
        // Not Following -> Show Gate Card (Delayed 2s)
        await delay(2000);
        await MetaService.sendFollowGateCard(
          senderId, 
          automation.brand_name || "us", 
          pageAccessToken, 
          automation.ig_business_id,
          `VERIFY_FOLLOW:${match.id}` 
        );
        return { success: true, status: "gated" };
      }
      console.log("✅ Follow check passed or not applicable.");
    }

    // --- PHASE 4: FINAL FULFILLMENT ---
    console.log(`🏁 Phase 4: Delivering Final Response to ${userName}`);
    await delay(Math.floor(Math.random() * 1000) + 2000); // 2-3s delay

    const finalDmOptions = match.variants?.dm || [match.response || "Here is your access!"];
    let finalDm = getRandom(finalDmOptions).replace("{{name}}", userName);

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const foundUrls = finalDm.match(urlRegex);
    const buttonLabel = match.metadata?.button_text || "Get Access 🔗";

    if (foundUrls && foundUrls.length > 0) {
      const link = foundUrls[0];
      const textWithoutUrl = finalDm.replace(link, "").trim();
      await MetaService.sendGenericCard(
        senderId,
        match.keyword?.toUpperCase() || "SUCCESS",
        textWithoutUrl || "Tap below to open your link.",
        buttonLabel,
        link,
        pageAccessToken
      );
    } else {
      await MetaService.sendDM(senderId, finalDm, pageAccessToken);
    }

    // Record History
    await supabase.from("automation_history").insert({
      automation_id: automation.id,
      sender_id: senderId,
      sender_name: userName,
      type: type,
      keyword: match.keyword,
      response: "CARD_OR_FULL_MESSAGE",
      metadata: { funnel_complete: true }
    });

    return { success: true };

  } catch (error) {
    console.error("🔥 Automation Execution Error:", error);
    return { success: false, error: error.message };
  }
}
