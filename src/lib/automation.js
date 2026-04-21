/* src/lib/automation.js - THE ULTIMATE ORCHESTRATOR */

import { createAdminClient } from "./supabase.js";
import { MetaService } from "./meta.js";
import { decryptToken } from "./security.js";
import { matchIntent, generatePersonalizedResponse } from "./ai.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export async function processAutomation(senderId, text, type, recipientId, commentId = null, mediaId = null, messageId = null) {
  const supabase = createAdminClient();
  
  try {
    let automationRows;
    let authError;

    ({ data: automationRows, error: authError } = await supabase
      .from("automations")
      .select("id, access_token, is_active, ai_enabled, brand_name, page_id, ig_business_id")
      .or(`page_id.eq.${recipientId},ig_business_id.eq.${recipientId}`)
      .limit(1));

    // Backwards-compat if schema is older (missing columns)
    if (authError?.message && /column .*ai_enabled|column .*brand_name/i.test(authError.message)) {
      ({ data: automationRows, error: authError } = await supabase
        .from("automations")
        .select("id, access_token, is_active")
        .eq("page_id", recipientId)
        .limit(1));
    }

    if (authError || !automationRows?.length) {
      console.error(`❌ Auth Error for ${recipientId}:`, authError?.message || "Not found");
      return { success: false };
    }
    
    const automation = automationRows[0];
    
    // Defaults if schema/rows are missing optional fields
    if (typeof automation.ai_enabled !== "boolean") automation.ai_enabled = true;
    if (!automation.brand_name) automation.brand_name = "Automixa Demo";
    if (!automation?.is_active) {
      console.warn(`⚠️ Automation not active for ${recipientId}`);
      return { success: false };
    }

    console.log(`✅ Automation Found: ${automation.brand_name} (AI: ${automation.ai_enabled})`);
    const pageAccessToken = decryptToken(automation.access_token);

    // --- USER PROFILE & PERMISSIONS (Early Fetch for Personalization) ---
    const profileResult = await MetaService.getUserProfile(senderId, pageAccessToken);
    const userName = profileResult.success ? profileResult.data.name : "there";
    const profilePic = profileResult.success ? profileResult.data.profile_pic : null;

    let { data: triggers } = await supabase
      .from("triggers")
      .select("*")
      .eq("automation_id", automation.id)
      .eq("type", type);

    // Backwards-compat: if DB only supports DM triggers, reuse them for other event types.
    if (!triggers?.length && type !== "DM") {
      ({ data: triggers } = await supabase
        .from("triggers")
        .select("*")
        .eq("automation_id", automation.id)
        .eq("type", "DM"));
    }

    console.log(`🎯 Triggers Found Total: ${triggers?.length || 0}`);

    // --- TARGETED POST FILTERING ---
    if (mediaId && triggers?.length > 0) {
      const targetedTriggers = triggers.filter(t => 
        t.target_media_ids && Array.isArray(t.target_media_ids) && t.target_media_ids.includes(mediaId)
      );
      
      const globalTriggers = triggers.filter(t => 
        !t.target_media_ids || (Array.isArray(t.target_media_ids) && t.target_media_ids.length === 0)
      );

      // If we have targeted matches for this specific post, use only those.
      // Else, fallback to global triggers.
      if (targetedTriggers.length > 0) {
        triggers = targetedTriggers;
        console.log(`📍 Using ${triggers.length} targeted triggers for media: ${mediaId}`);
      } else {
        triggers = globalTriggers;
        console.log(`🌐 Falling back to ${triggers.length} global triggers for media: ${mediaId}`);
      }
    }

    // --- LONG-TERM MEMORY ---
    let userMemory = "";
    const { data: history } = await supabase
      .from("automation_history")
      .select("keyword, response, created_at")
      .eq("sender_id", senderId)
      .order("created_at", { ascending: false })
      .limit(3);

    if (history?.length > 0) {
      userMemory = history.map(h => 
        `User asked: ${h.keyword}, Bot: ${h.response.substring(0, 30)}...`
      ).join(" | ");
    }

    let match;
    let mood = (type === "STORY_REPLY" || type === "STORY_MENTION") ? "STORY" : "BASIC";
    let postContext = "";

    // --- STORY REACTION SEQUENCE ---
    if (messageId && (type === "STORY_REPLY" || type === "STORY_MENTION")) {
        await MetaService.sendReaction(senderId, messageId, "love", pageAccessToken);
        await delay(3000); 
    }

    if (automation.ai_enabled) {
      if (text === "RE_VERIFY_FOLLOW") {
         const { data: lastHistory } = await supabase
            .from("automation_history")
            .select("keyword")
            .eq("sender_id", senderId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
         match = triggers.find(t => t.keyword === (lastHistory?.keyword || "*"));
      } else {
        if (mediaId && type !== "STORY_MENTION") {
          const contextResult = await MetaService.getMediaContext(mediaId, pageAccessToken);
          if (contextResult.success) postContext = contextResult.caption;
        }

        const intentResult = await matchIntent(text, triggers, postContext, userMemory);
        match = triggers.find(t => t.id === intentResult.triggerId);
        if (type !== "STORY_REPLY" && type !== "STORY_MENTION") {
            mood = intentResult.mood;
        }
      }
    } else {
      const lowerMsg = text.toLowerCase();
      // Special Handling for 'Zero Confusion' Quick Reply Tap
      if (text === "Send me the access 🔗") {
        // Find the trigger that originally started this (usually matches 'access' or is default)
        match = triggers.find(t => t.keyword.toLowerCase().includes("access") || t.keyword === "*");
      } else {
        match = triggers.find(t => lowerMsg.includes(t.keyword.toLowerCase()));
      }
    }
    
    // 2b. 'Zero Confusion' First-Engagement Branch for Comments
    if (type === "COMMENT" && commentId && text !== "Send me the access 🔗") {
       const initialIntro = {
         text: `Hey ${userName}! 👋 I've got the link you requested ready for you. Just tap the button below!`,
         quick_replies: [
           {
             content_type: "text",
             title: "Send me the access 🔗",
             payload: "GET_ACCESS_PAYLOAD"
           }
         ]
       };

       await MetaService.sendPrivateReply(commentId, initialIntro, pageAccessToken);
       console.log(`✉️ Fixed Intro DM sent to ${userName}`);

       // Delayed Public Reply
       await delay(Math.floor(Math.random() * 3000) + 5000);
       const publicReply = (match?.variants?.public?.length > 0) ? getRandom(match.variants.public) : "Details sent to your DM! 🚀";
       await MetaService.sendCommentReply(commentId, publicReply, pageAccessToken);
       
       return { success: true, phase: "INTRO" };
    }

    if (!match) {
      match = triggers.find(t => t.keyword === "*" || t.keyword === "DEFAULT");
      if (!match && type !== "STORY_MENTION") {
        await supabase.from("automation_history").insert({
          automation_id: automation.id,
          sender_id: senderId,
          type: type,
          keyword: "UNMATCHED",
          metadata: { needs_handover: true }
        });
        return { success: false, handover: true };
      }
    }

    // 3. Follow-Gate Check (Only if enabled for this specific trigger/rule)
    const needsFollowing = match?.metadata?.follower_gate === true;
    if (needsFollowing && type !== "STORY_MENTION") {
      const followData = await MetaService.checkFollowStatus(senderId, recipientId, pageAccessToken);
      if (followData.success && !followData.isFollowing) {
        if (type === "COMMENT" && commentId) {
            // Meta Restriction: First DM from a comment MUST be plain text (Private Reply)
            const gatedText = `Hey ${userName}! To unlock your exclusive link, please follow @${automation.brand_name || 'us'} first. 🎁 Once you follow, reply back here!`;
            await MetaService.sendPrivateReply(commentId, gatedText, pageAccessToken);
        } else {
            await MetaService.sendFollowGateCard(senderId, automation.brand_name, pageAccessToken, automation.ig_business_id);
        }

        if (type === "COMMENT" && commentId) {
            await delay(8000);
            const publicGatedReply = (match?.variants?.public?.length > 0) ? match.variants.public[0] : "Check your DM to unlock! 🎁";
            await MetaService.sendCommentReply(commentId, publicGatedReply, pageAccessToken);
        }
        return { success: true, gated: true };
      }
    }

    // --- LEAD CAPTURE ---
    try {
      await supabase.from("leads").upsert({
        automation_id: automation.id,
        sender_id: senderId,
        name: userName,
        profile_pic: profilePic,
        last_interacted_at: new Date().toISOString()
      }, { onConflict: "sender_id, automation_id" });
    } catch (leadError) {
      console.warn("⚠️ Lead Capture skipped:", leadError.message);
    }

    // 4. Smart Response Branching
    let finalResponse;
    if (automation.ai_enabled) {
      finalResponse = await generatePersonalizedResponse(text, match?.response || "Thanks for the support! ❤️", userName, mood, userMemory);
    } else {
      finalResponse = (match?.variants?.dm?.length > 0) 
         ? getRandom(match.variants.dm).replace("{{name}}", userName)
         : (match?.response || "Thanks!").replace("{{name}}", userName);
    }

    // 5. Send Responses (Hybrid Button Logic)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const foundUrls = finalResponse.match(urlRegex);
    const buttonLabel = match?.metadata?.button_text;

    if (type === "COMMENT" && commentId) {
       // This branch is now handled by the early exit '2b' block above.
       // It remains here only as a fallback for unexpected flow.
       return { success: true };
    } else {
      // 5c. Direct DM or Story Reply (Supports Meta Cards!)
      if (foundUrls && foundUrls.length > 0 && buttonLabel) {
        const link = foundUrls[0];
        const textWithoutUrl = finalResponse.replace(link, "").trim();
        
        // Use Generic Card Template
        await MetaService.sendGenericCard(
          senderId, 
          automation.brand_name || "Exclusive Access! 🎁", 
          textWithoutUrl || "Click below to get started.", 
          buttonLabel, 
          link, 
          pageAccessToken
        );
      } else {
        await MetaService.sendDM(senderId, finalResponse, pageAccessToken);
      }
    }

    // 6. Log
    await supabase.from("automation_history").insert({
      automation_id: automation.id,
      sender_id: senderId,
      sender_name: userName,
      type: type,
      keyword: match?.keyword || "STORY_REACTION",
      response: finalResponse,
      metadata: { ai: automation.ai_enabled, mood: mood, catch_all: (match?.keyword === "*") }
    });

    return { success: true };

  } catch (error) {
    console.error("Critical Engine Error:", error);
    return { success: false, error: error.message };
  }
}
