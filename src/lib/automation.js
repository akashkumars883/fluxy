/* src/lib/automation.js - THE ULTIMATE ORCHESTRATOR */

import { createAdminClient } from "./supabase.js";
import { MetaService } from "./meta.js";
import { decryptToken } from "./security.js";
import { getLinkPreview } from "./scraper.js";
import { matchIntent, generatePersonalizedResponse } from "./ai.js";
import { sendLimitExceededEmail } from "./resend.js";
import { SmartGuard } from "./smartguard.js";

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
export async function processAutomation(senderId, text, type, recipientId, commentId = null, mediaId = null, messageId = null, payload = null, senderUsername = null) {
  // --- ANTI-LOOP & SELF-REPLY GUARD ---
  if (senderId === recipientId) {
    console.log(`🤖 Self-reply/Loop detected for ${senderId}. Skipping.`);
    return { success: false, reason: "anti_loop" };
  }

  // --- HUMAN HANDOVER & OPT-OUT (Compliance) ---
  const humanKeywords = ["human", "help", "agent", "stop", "unsubscribe", "person", "सहायता", "मदद"];
  const lowerIncomingText = (text || "").toLowerCase().trim();
  if (humanKeywords.some(key => lowerIncomingText.includes(key))) {
    console.log(`👤 Human Handover requested by ${senderId}. Pausing bot.`);
    await supabaseAdmin.from("automation_history").insert({
      automation_id: recipientId, // Best effort fallback if no row found yet
      sender_id: senderId,
      type: "HELP_REQUESTED",
      status: "HANDOVER",
      metadata: { text: text, message_id: messageId }
    }).catch(() => {});
    return { success: false, reason: "human_handover" };
  }

  try {
    let automationRows;
    let authError;

    // 1. Authenticate the Automation Account
    ({ data: automationRows, error: authError } = await supabaseAdmin
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

    // --- PLAN QUOTA LIMITS ENFORCEMENT & WARNING EMAIL ALERTS ---
    try {
      const { count: consumedCount } = await supabaseAdmin
        .from("automation_history")
        .select("*", { count: "exact", head: true })
        .eq("automation_id", automation.id)
        .eq("status", "SUCCESS");

      const { data: subData } = await supabaseAdmin
        .from("subscriptions")
        .select("plan")
        .eq("user_id", automation.user_id)
        .eq("status", "active")
        .limit(1);

      const userPlan = subData?.[0]?.plan || "free";
      const planLimits = {
        free: 1000,
        creator_pro: 100000,
        agency_scale: 1000000
      };
      const maxReplies = planLimits[userPlan] || 1000;

      if ((consumedCount || 0) >= maxReplies) {
        console.log(`🚫 [PLAN LIMIT EXCEEDED] Quota limit of ${maxReplies} hit for user ID: ${automation.user_id}. Auto-reply blocked.`);
        
        // Log limit breach event in DB history
        await supabaseAdmin.from("automation_history").insert({
          automation_id: automation.id,
          sender_id: senderId,
          sender_name: "Limit Check",
          type: type,
          keyword: "PLAN_LIMIT_CHECK",
          status: "LIMIT_EXCEEDED",
          metadata: { error: "Plan quota limit hit. Please upgrade.", plan: userPlan, consumed: consumedCount, limit: maxReplies }
        }).catch((e) => console.error("❌ Failed logging limit breach:", e.message));

        // Fetch user profile email to notify them
        try {
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(automation.user_id);
          if (userData?.user?.email) {
            const userEmail = userData.user.email;
            const userDisplayName = userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || "Automixa Customer";
            
            await sendLimitExceededEmail({
              email: userEmail,
              name: userDisplayName,
              planName: userPlan === "free" ? "Free" : userPlan === "creator_pro" ? "Creator Pro" : "Agency Scale",
              limitAmount: maxReplies
            });
            console.log(`✉️ [LIMIT EMAIL SENT] Quota limit email sent successfully to: ${userEmail}`);
          }
        } catch (emailErr) {
          console.error("❌ Failed sending limit exceeded alert email:", emailErr.message);
        }

        return { success: false, reason: "limit_exceeded" };
      }
    } catch (limitCheckErr) {
      console.error("⚠️ [LIMIT CHECK FAILED] Skipping limits guard to avoid user block:", limitCheckErr.message);
    }

    const pageAccessToken = decryptToken(automation.access_token);
    
    let userName = senderUsername;
    if (!userName && type === "COMMENT" && commentId) {
      console.log(`🔍 Commenter username missing. Fetching username from comment ID ${commentId}...`);
      const commentSenderRes = await MetaService.getCommentSenderUsername(commentId, pageAccessToken);
      if (commentSenderRes.success && commentSenderRes.username) {
        userName = commentSenderRes.username;
      }
    }

    if (!userName) {
      const profileResult = await MetaService.getUserProfile(senderId, pageAccessToken);
      userName = profileResult.success ? (profileResult.data.username || profileResult.data.name) : "there";
    }

    // --- SMARTGUARD: ANTI-SPAM CIRCUIT BREAKER ---
    const isSpam = await SmartGuard.checkSpamAttack(senderId, automation.id);
    if (isSpam) {
      console.warn(`🛡️ [SmartGuard] Blocked abusive spamming by sender: ${senderId}`);
      await supabaseAdmin.from("automation_history").insert({
        automation_id: automation.id,
        sender_id: senderId,
        sender_name: userName,
        type: type,
        keyword: text ? text.substring(0, 100) : "SPAM_ABUSE",
        status: "BLOCKED",
        metadata: { error: "SmartGuard isolated abusive repetitive triggers." }
      }).catch(() => {});
      return { success: false, reason: "smartguard_spam_blocked" };
    }

    // 2. Resolve Triggers for this automation
    let { data: triggers } = await supabaseAdmin
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

    // --- KEYWORD-BASED & AI INTENT RESOLUTION (Incoming Text/Comments) ---
    if (!match) {
      const lowerText = (text || "").toLowerCase().trim();
      const eventTriggers = triggers.filter(t => {
        if (type && type.startsWith("STORY")) {
          return t.type === "STORY" || t.type === "STORY_REPLY" || t.type === "STORY_MENTION";
        }
        return t.type === type || (!t.type && type === "DM");
      });

      let activePool = eventTriggers;
      if (mediaId && type === "COMMENT") {
        activePool = eventTriggers.filter(t => 
          !t.target_media_ids || 
          t.target_media_ids.length === 0 || 
          t.target_media_ids.includes(mediaId)
        );
      }

      // 1. Try exact keyword matching first
      match = activePool.find(t => lowerText.includes((t.keyword || "").toLowerCase()));

      // 2. Fallback to Advanced AI Semantic Intent Recognition
      if (!match && text) {
        console.log(`🤖 [AI INTENT] Keyword mismatch for "${text}". Launching Advanced AI Intent Analysis...`);
        try {
          // Fetch last 3 history logs for contextual memory
          let userMemory = "";
          const { data: historyLogs } = await supabaseAdmin
            .from("automation_history")
            .select("keyword, type, status")
            .eq("automation_id", automation.id)
            .eq("sender_id", senderId)
            .order("created_at", { ascending: false })
            .limit(3);

          if (historyLogs?.length) {
            userMemory = historyLogs
              .map(log => `${log.type} trigger "${log.keyword}" status: ${log.status}`)
              .join(", ");
          }

          const brandContext = `Brand: ${automation.brand_name || "Automixa"}. Context: ${automation.metadata?.business_description || "Instagram automation & marketing"}`;
          const aiResult = await matchIntent(text, activePool, brandContext, userMemory);

          if (aiResult?.triggerId) {
            match = activePool.find(t => t.id === aiResult.triggerId);
            if (match) {
              console.log(`🎯 [AI INTENT SUCCESS] Semantically matched "${text}" to Trigger: "${match.keyword}"`);
              match._detectedMood = aiResult.mood;
              match._userMemory = userMemory;
            }
          }
        } catch (aiErr) {
          console.error("❌ [AI INTENT ERROR] Semantic matching failed:", aiErr.message);
        }
      }

      // 3. Fallback to default wildcard trigger
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

      // --- SMARTGUARD: ADAPTIVE SURGE THROTTLING ---
      const adaptiveDelayPhase1 = await SmartGuard.getAdaptiveDelay(automation.id);
      await delay(adaptiveDelayPhase1);

      // Always send Intro Greeting Card first
      console.log(`🎁 Sending Intro Card to ${userName}`);
      const templates = automation.metadata?.templates || {};
      const introTitle = interpolate(
        templates.intro_title || "Hey {name}! 👋 Thanks for the comment! Tap the button below and I'll send you the access right away. ⚡",
        userName,
        automation.brand_name
      );

      const introCardPayload = {
        text: introTitle || "Welcome! Tap below for access.",
        quick_replies: [{
          content_type: "text",
          title: "Send me the access",
          payload: match.id
        }]
      };
      await MetaService.sendPrivateReply(commentId, introCardPayload, pageAccessToken);

      // B. Public Comment Reply with Delay (7-10s)
      await delay(Math.floor(Math.random() * 3000) + 7000);
      const publicOptions = match.variants?.public || [];
      const rawPublic = publicOptions.length > 0 ? getRandom(publicOptions) : "Check your DM for the link! 🚀";
      const chosenPublic = SmartGuard.applyCommentSpintax(rawPublic);
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
    // --- SMARTGUARD: ADAPTIVE SURGE THROTTLING ---
    const adaptiveDelayPhase4 = await SmartGuard.getAdaptiveDelay(automation.id);
    await delay(adaptiveDelayPhase4);

    const dmVariants = (Array.isArray(match.variants?.dm) && match.variants.dm.length > 0) 
      ? match.variants.dm 
      : [match.response || "Here is your access!"];
    const rawDm = (getRandom(dmVariants) || "Here is your access!").replace("{{name}}", userName).replace("{name}", userName);
    // --- SMARTGUARD: DYNAMIC SPINTAX REPHRASING ---
    let finalDm = SmartGuard.applySpintax(rawDm, userName);

    // 🧠 AI Voice Mirroring & Persona Customization
    if (text && (match.metadata?.ai_driven || automation.metadata?.ai_driven || match._detectedMood)) {
      console.log(`🧠 [AI VOICE MIRRORING] Personalizing Final DM for ${userName}...`);
      try {
        const aiResponse = await generatePersonalizedResponse(
          text, 
          finalDm, 
          userName, 
          match._detectedMood || "BASIC", 
          match._userMemory || ""
        );
        if (aiResponse) {
          finalDm = aiResponse;
          console.log(`✅ [AI VOICE SUCCESS] Personalized DM: "${finalDm}"`);
        }
      } catch (aiVoiceErr) {
        console.error("❌ [AI VOICE ERROR] Fallback to standard DM:", aiVoiceErr.message);
      }
    }

    // Prioritize explicit button_link from metadata, fallback to regex scraping
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const scrapedUrls = (finalDm || "").match(urlRegex);
    const link = match.metadata?.button_link || (scrapedUrls && scrapedUrls[0]);
    const buttonLabel = match.metadata?.button_text || "Get Access 🔗";

    let finalSentOk = false;
    if (link) {
      try {
        new URL(link); // Validate URL structure
        const textWithoutUrl = match.metadata?.button_link ? finalDm : finalDm.replace(link, "").trim();

        // AUTO-SCRAPER logic for the card image
        console.log(`🔍 Scraping preview image for: ${link}`);
        const scrapedImage = await getLinkPreview(link);

        const cardRes = await MetaService.sendGenericCard(
          senderId,
          (textWithoutUrl || "Exclusive Access! 🎁").substring(0, 80), // Strictly truncated to 80 chars
          "", // User requested NO brand name/extra text here
          buttonLabel,
          link,
          pageAccessToken,
          scrapedImage
        );
        if (cardRes.success) {
          finalSentOk = true;
        } else {
          console.warn("⚠️ sendGenericCard failed, falling back to DM text:", cardRes.error);
        }
      } catch (urlErr) {
        console.warn("⚠️ Invalid URL for sendGenericCard, falling back to DM text:", urlErr.message);
      }
    }

    if (!finalSentOk) {
      await MetaService.sendDM(senderId, finalDm, pageAccessToken);
    }

    // Update Log to SUCCESS or insert a new one if it wasn't pre-created
    if (type === "COMMENT" && commentId) {
      await supabaseAdmin.from("automation_history")
        .update({ 
          status: "SUCCESS", 
          metadata: { funnel_complete: true, scraped: true } 
        })
        .eq("automation_id", automation.id)
        .eq("sender_id", senderId)
        .order('created_at', { ascending: false })
        .limit(1);
    } else {
      // Check if there is an existing 'INTERACTED' log for this sender to update
      const { data: existingLogs } = await supabaseAdmin.from("automation_history")
        .select("id, status")
        .eq("automation_id", automation.id)
        .eq("sender_id", senderId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (existingLogs && existingLogs.length > 0 && existingLogs[0].status === "INTERACTED") {
        await supabaseAdmin.from("automation_history")
          .update({ 
            status: "SUCCESS", 
            metadata: { funnel_complete: true, scraped: true } 
          })
          .eq("id", existingLogs[0].id);
      } else {
        await supabaseAdmin.from("automation_history").insert({
          automation_id: automation.id,
          sender_id: senderId,
          sender_name: userName || "there",
          type: type || "DM",
          keyword: match.keyword,
          status: "SUCCESS",
          metadata: { funnel_complete: true, scraped: true }
        });
      }
    }

    // --- OUTBOUND WEBHOOK DISPATCH (Asynchronous, Non-blocking) ---
    if (automation.metadata?.webhook_enabled === true && automation.metadata?.webhook_url) {
      const webhookUrlStr = automation.metadata.webhook_url.trim();
      const webhookPayload = {
        event: "lead_captured",
        campaign_name: match.metadata?.campaign_name || "Custom Flow ⚡",
        keyword: match.keyword,
        instagram_username: userName || "there",
        instagram_user_id: senderId,
        delivered_link: link || null,
        timestamp: new Date().toISOString()
      };

      console.log(`📡 [Outbound Webhook] Dispatching payload to: ${webhookUrlStr}`);
      fetch(webhookUrlStr, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookPayload)
      }).then(res => {
        if (!res.ok) {
          console.warn(`⚠️ [Outbound Webhook] Received error status: ${res.status}`);
        } else {
          console.log(`✅ [Outbound Webhook] Delivered successfully to: ${webhookUrlStr}`);
        }
      }).catch(fetchErr => {
        console.error(`❌ [Outbound Webhook] Failed to deliver payload:`, fetchErr.message);
      });
    }

    return { success: true };

  } catch (error) {
    console.error("🔥 Funnel Execution Error:", error);
    return { success: false, error: error.message };
  }
}
