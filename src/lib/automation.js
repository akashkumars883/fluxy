/* src/lib/automation.js - THE ULTIMATE ORCHESTRATOR */

import { createClient, createAdminClient } from "./supabase.js";
import { MetaService } from "./meta.js";
import { decryptToken } from "./security.js";
import { matchIntent, generatePersonalizedResponse } from "./ai.js";
import { getLinkPreview } from "./scraper.js";

const supabase = createClient();
const supabaseAdmin = createAdminClient();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getRandom = (arr) => {
  if (Array.isArray(arr) && arr.length > 0) return arr[Math.floor(Math.random() * arr.length)];
  if (typeof arr === 'string' && arr.length > 0) return arr;
  return null;
};

/**
 * String Interpolation Helper
 */
const interpolate = (text, name, brand) => {
  if (!text) return "";
  return text
    .replace(/{name}/g, name)
    .replace(/{brand}/g, brand || "us");
};

/**
 * Main Engine Orchestrator
 */
export async function processAutomation(senderId, text, type, recipientId, commentId = null, mediaId = null, messageId = null, payload = null) {
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

    // --- PHASE 1: INITIAL COMMENT ENTRY (Premium Card Style) ---
    if (type === "COMMENT" && commentId && !payload) {
      console.log(`🏃 Phase 1: Handling Comment from ${userName}`);
      
      // Log interaction immediately to DB using Admin Client (Bypasses RLS for writing)
      const { data: logData, error: logError } = await supabaseAdmin.from("automation_history").insert({
        automation_id: automation.id,
        sender_id: senderId,
        sender_name: userName,
        type: type,
        keyword: match.keyword,
        status: "INTERACTED",
        metadata: { funnel_complete: false }
      }).select().single();

      if (logError) {
        console.error("❌ [DB ERROR] History Logging Failed:", logError.message);
        console.error("❌ [DB ERROR] Potential Cause: Table schema mismatch or missing columns.");
      } else {
        console.log("✅ [DB SUCCESS] History entry created:", logData.id);
      }

      // A. Smart Funnel Decision: Card vs Link?
      const needsFollow = match.metadata?.follower_gate === true;
      let followFound = false;

      if (needsFollow) {
        console.log(`🛡️ Checking follow status early for ${userName}...`);
        const followData = await MetaService.checkFollowStatus(senderId, pageAccessToken);
        followFound = followData.success && followData.isFollowing;
      }

      await delay(Math.floor(Math.random() * 2000) + 3000); // 3-5s delay

      if (needsFollow && !followFound) {
        // CASE A: NEW FAN / NOT FOLLOWING -> Show Intro Card
        console.log(`🎁 Sending Intro Card to NEW fan ${userName}`);
        const templates = automation.metadata?.templates || {};
        const introTitle = interpolate(
          templates.intro_title || "Hey {name}! Thanks for the comment. Tap below and i'll send you the access in just a moment",
          userName,
          automation.brand_name
        );

        const introCardPayload = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [{
                title: introTitle || "Welcome! Tap below for access.",
                buttons: [{
                  type: "postback",
                  title: "Send me the access",
                  payload: match.id
                }]
              }]
            }
          }
        };
        await MetaService.sendPrivateReply(commentId, introCardPayload, pageAccessToken);
      } else {
        // CASE B: OLD FAN / ALREADY FOLLOWING -> Send Product Link Directly as Private Reply
        console.log(`⚡ Sending Product Link DIRECTLY to existing fan ${userName}`);
        
        const dmVariants = Array.isArray(match.variants?.dm) ? match.variants.dm : [match.response || "Here is your access!"];
        let finalDm = (getRandom(dmVariants) || "Here is your access!").replace("{{name}}", userName).replace("{name}", userName);

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const scrapedUrls = (finalDm || "").match(urlRegex);
        const link = match.metadata?.button_link || (scrapedUrls && scrapedUrls[0]);
        const buttonLabel = match.metadata?.button_text || "Get Access 🔗";

        if (link) {
          const textWithoutUrl = match.metadata?.button_link ? finalDm : finalDm.replace(link, "").trim();
          const scrapedImage = await getLinkPreview(link);

          const productCardPayload = {
            attachment: {
              type: "template",
              payload: {
                template_type: "generic",
                elements: [{
                  title: textWithoutUrl || "Exclusive Access! 🎁",
                  image_url: scrapedImage,
                  buttons: [{
                    type: "web_url",
                    url: link,
                    title: buttonLabel
                  }]
                }]
              }
            }
          };
          await MetaService.sendPrivateReply(commentId, productCardPayload, pageAccessToken);
          
          // Update Log to SUCCESS immediately
          await supabaseAdmin.from("automation_history")
            .update({ status: "SUCCESS", metadata: { funnel_complete: true } })
            .eq("id", logData.id);

        } else {
          await MetaService.sendPrivateReply(commentId, { text: finalDm }, pageAccessToken);
        }
      }

      // B. Public Comment Reply with Delay (7-10s)
      await delay(Math.floor(Math.random() * 3000) + 7000);
      const publicOptions = match.variants?.public || [];
      const chosenPublic = publicOptions.length > 0 ? getRandom(publicOptions) : "Check your DM for the link! 🚀";
      await MetaService.sendCommentReply(commentId, chosenPublic, pageAccessToken);

      return { success: true, phase: 1 };
    }

    // --- PHASE 2/3: FOLLOW GATE & VERIFICATION (Premium Card Style) ---
    const needsFollow = match.metadata?.follower_gate === true;
    const isVerificationStep = payload && (isUuid.test(payload) || payload.includes("VERIFY_FOLLOW:"));

    if (isVerificationStep && needsFollow) {
      console.log(`🛡️ Phase 2/3: Checking Follow Gate for ${userName}`);
      const followData = await MetaService.checkFollowStatus(senderId, pageAccessToken);
      
      // LOGIC: Only lock if we are POSITIVE they are not following.
      // If the API fails or doesn't return the field, we let them through to avoid a broken funnel.
      const shouldLock = followData.success && followData.exists && followData.isFollowing === false;

      if (shouldLock) {
        console.log(`🚫 User ${userName} is NOT following. Showing Gate.`);
        // Not Following -> Show Gate Card (Delayed 2s)
        await delay(2000);
        
        const templates = automation.metadata?.templates || {};
        const gateTitle = interpolate(templates.follow_gate_title || "One final step to unlock! 🎁", userName, automation.brand_name);
        const gateSubtitle = interpolate(templates.follow_gate_subtitle || "Please follow @{brand} to get your link immediately.", userName, automation.brand_name);

        await MetaService.sendFollowGateCard(
          senderId, 
          automation.brand_name || "us", 
          pageAccessToken, 
          automation.metadata?.ig_handle || automation.ig_business_id, 
          `VERIFY_FOLLOW:${match.id}`,
          gateTitle,
          "" // Remove subtitle as requested
        );
        return { success: true, status: "gated" };
      }
      console.log(`✅ Follow check passed or skipped (Reason: ${followData.exists ? 'Followed' : 'API Missing Field/Error'}).`);
    }

    // --- PHASE 4: FINAL FULFILLMENT (Automated Product Card) ---
    console.log(`🏁 Phase 4: Delivering Final Product Card to ${userName}`);
    await delay(Math.floor(Math.random() * 1000) + 2000); // 2-3s delay

    const dmVariants = Array.isArray(match.variants?.dm) ? match.variants.dm : [match.response || "Here is your access!"];
    let finalDm = (getRandom(dmVariants) || "Here is your access!").replace("{{name}}", userName).replace("{name}", userName);

    // Prioritize explicit button_link from metadata, fallback to regex scraping
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const scrapedUrls = (finalDm || "").match(urlRegex);
    const link = match.metadata?.button_link || (scrapedUrls && scrapedUrls[0]);
    const buttonLabel = match.metadata?.button_text || "Get Access 🔗";

    if (link) {
      const textWithoutUrl = match.metadata?.button_link ? finalDm : finalDm.replace(link, "").trim();

      // AUTO-SCRAPER logic for the card image
      console.log(`🔍 Scraping preview image for: ${link}`);
      const scrapedImage = await getLinkPreview(link);

      await MetaService.sendGenericCard(
        senderId,
        textWithoutUrl || "Exclusive Access! 🎁", // User message as TITLE (Bold)
        "", // User requested NO brand name/extra text here
        buttonLabel,
        link,
        pageAccessToken,
        scrapedImage
      );
    } else {
      await MetaService.sendDM(senderId, finalDm, pageAccessToken);
    }

    // Update Log to SUCCESS
    await supabaseAdmin.from("automation_history")
      .update({ 
        status: "SUCCESS", 
        metadata: { funnel_complete: true, scraped: true } 
      })
      .eq("automation_id", automation.id)
      .eq("sender_id", senderId)
      .order('created_at', { ascending: false })
      .limit(1);

    return { success: true };

  } catch (error) {
    console.error("🔥 Funnel Execution Error:", error);
    return { success: false, error: error.message };
  }
}
