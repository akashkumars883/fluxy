/* src/lib/automation.js - THE ULTIMATE ORCHESTRATOR */

import { createAdminClient } from "./supabase.js";
import { MetaService } from "./meta.js";
import { decryptToken } from "./security.js";
import { getLinkPreview } from "./scraper.js";
import { matchIntent, generatePersonalizedResponse } from "./ai.js";
import { sendLimitExceededEmail } from "./resend.js";
import { SmartGuard } from "./smartguard.js";
import { validatePublicWebhookUrl } from "./webhook-url.js";

const supabaseAdmin = createAdminClient();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const SHIELD_ENTRY_DELAY_MIN_MS = 2000;
const SHIELD_ENTRY_DELAY_MAX_MS = 4500;
const SHIELD_PUBLIC_REPLY_DELAY_MIN_MS = 7000;
const SHIELD_PUBLIC_REPLY_DELAY_MAX_MS = 12000;
const SHIELD_SURGE_LOOKBACK_MS = 60 * 1000;
const SHIELD_SURGE_COOLDOWN_MS = 2 * 60 * 1000;
const SHIELD_SURGE_THRESHOLD_PER_MINUTE = 18;
const SHIELD_HEAVY_TRAFFIC_MESSAGE = "Your account is facing heavy traffic right now, so Automixa Shield has placed it in cooldown for account safety. Replies will resume automatically shortly.";

const getShieldDelay = (minMs, maxMs) => Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

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

const buildEventKey = ({ type, commentId, messageId, senderId, recipientId, payload, text }) => {
  if (commentId) return `comment:${commentId}`;
  if (messageId) return `message:${messageId}`;
  if (payload) return `postback:${recipientId}:${senderId}:${payload}`;
  return `event:${recipientId}:${senderId}:${type}:${(text || "").trim().toLowerCase().slice(0, 80)}`;
};

async function findExistingEvent(automationId, eventKey, commentId, messageId) {
  if (!automationId) return null;

  let query = supabaseAdmin
    .from("automation_history")
    .select("id,status,created_at,metadata")
    .eq("automation_id", automationId)
    .limit(1);

  if (eventKey) {
    query = query.eq("metadata->>event_key", eventKey);
  } else if (commentId) {
    query = query.eq("metadata->>comment_id", commentId);
  } else if (messageId) {
    query = query.eq("metadata->>message_id", messageId);
  } else {
    return null;
  }

  const { data, error } = await query;
  if (error) {
    console.error("🛡️ [Automixa Shield] Duplicate event check failed:", error.message);
    return null;
  }
  return data?.[0] || null;
}

async function logShieldEvent(automationId, senderId, senderName, keyword, status, metadata = {}) {
  await supabaseAdmin.from("automation_history").insert({
    automation_id: automationId,
    sender_id: senderId,
    sender_name: senderName || "Automixa Shield",
    type: "AUTOMIXA_SHIELD",
    keyword: keyword || "AUTOMIXA_SHIELD",
    status,
    metadata: {
      shield: "automixa_shield",
      ...metadata
    }
  }).catch((e) => console.error("🛡️ [Automixa Shield] Failed logging shield event:", e.message));
}

async function getActiveShieldCooldown(automationId) {
  const cooldownWindowStart = new Date(Date.now() - SHIELD_SURGE_COOLDOWN_MS).toISOString();
  const { data, error } = await supabaseAdmin
    .from("automation_history")
    .select("id,created_at,metadata")
    .eq("automation_id", automationId)
    .eq("type", "AUTOMIXA_SHIELD")
    .eq("status", "COOLDOWN_ACTIVE")
    .eq("metadata->>reason", "heavy_traffic_surge")
    .gt("created_at", cooldownWindowStart)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Automixa Shield cooldown check failed:", error.message);
    return null;
  }

  return data?.[0] || null;
}

async function getRecentAccountTrafficCount(automationId) {
  const surgeWindowStart = new Date(Date.now() - SHIELD_SURGE_LOOKBACK_MS).toISOString();
  const { count, error } = await supabaseAdmin
    .from("automation_history")
    .select("id", { count: "exact", head: true })
    .eq("automation_id", automationId)
    .neq("type", "AUTOMIXA_SHIELD")
    .gt("created_at", surgeWindowStart);

  if (error) {
    console.error("Automixa Shield traffic count failed:", error.message);
    return 0;
  }

  return count || 0;
}

async function enforceAutomixaShieldTrafficGate(automation, senderId, senderName, keyword, type) {
  const activeCooldown = await getActiveShieldCooldown(automation.id);
  if (activeCooldown) {
    await logShieldEvent(automation.id, senderId, senderName, keyword, "COOLDOWN_ACTIVE", {
      reason: "heavy_traffic_cooldown",
      source: type || "UNKNOWN",
      user_message: SHIELD_HEAVY_TRAFFIC_MESSAGE,
      active_cooldown_id: activeCooldown.id
    });
    return false;
  }

  const recentTrafficCount = await getRecentAccountTrafficCount(automation.id);
  if (recentTrafficCount >= SHIELD_SURGE_THRESHOLD_PER_MINUTE) {
    await logShieldEvent(automation.id, senderId, senderName, keyword, "COOLDOWN_ACTIVE", {
      reason: "heavy_traffic_surge",
      source: type || "UNKNOWN",
      user_message: SHIELD_HEAVY_TRAFFIC_MESSAGE,
      traffic_window_seconds: SHIELD_SURGE_LOOKBACK_MS / 1000,
      traffic_count: recentTrafficCount,
      threshold: SHIELD_SURGE_THRESHOLD_PER_MINUTE,
      cooldown_seconds: SHIELD_SURGE_COOLDOWN_MS / 1000
    });
    return false;
  }

  return true;
}

/**
 * Main Engine Orchestrator
 */
export async function processAutomation(senderId, text, type, recipientId, commentId = null, mediaId = null, messageId = null, payload = null, senderUsername = null) {
  const eventKey = buildEventKey({ type, commentId, messageId, senderId, recipientId, payload, text });
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
      .or(`page_id.eq.${recipientId},ig_business_id.eq.${recipientId},metadata->>facebook_page_id.eq.${recipientId}`)
      .limit(1));

    if (authError || !automationRows?.length) {
      console.error(`❌ Automation Auth Failed for ${recipientId}`);
      return { success: false };
    }

    const automation = automationRows[0];
    if (!automation.is_active) return { success: false };

    const existingEvent = await findExistingEvent(automation.id, eventKey, commentId, messageId);
    if (existingEvent) {
      console.log(`🛡️ [Automixa Shield] Duplicate webhook event skipped: ${eventKey}`);
      return { success: false, reason: "duplicate_event" };
    }

    let userPlan = "free";

    // --- PLAN QUOTA LIMITS ENFORCEMENT & WARNING EMAIL ALERTS ---
    try {
      const { count: consumedCount } = await supabaseAdmin
        .from("automation_history")
        .select("*", { count: "exact", head: true })
        .eq("automation_id", automation.id)
        .eq("status", "SUCCESS");

      const { data: subData } = await supabaseAdmin
        .from("subscriptions")
        .select("plan_id, plan")
        .eq("user_id", automation.user_id)
        .eq("status", "active")
        .limit(1);

      userPlan = subData?.[0]?.plan_id || subData?.[0]?.plan || "free";
      const planLimits = {
        free: 1000,
        creator_pro: 15000,
        viral_scale: 50000
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
              planName: userPlan === "free" ? "Free" : userPlan === "creator_pro" ? "Business Pro" : "Agency Scale",
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

    // --- PLAN FEATURE RESTRICTIONS: STORY MENTIONS (Premium Only) ---
    if (type && type.startsWith("STORY") && userPlan === "free") {
      console.log(`🚫 [PLAN RESTRICTION] Story Trigger type ${type} blocked for Free Plan user ID: ${automation.user_id}`);
      
      try {
        await supabaseAdmin.from("automation_history").insert({
          automation_id: automation.id,
          sender_id: senderId,
          sender_name: senderUsername || "Plan Check",
          type: type,
          keyword: "STORY_TRIGGER_BLOCKED",
          status: "LIMIT_EXCEEDED",
          metadata: { error: "Story mention responder is a Premium feature. Please upgrade to Business Pro.", plan: userPlan }
        });
      } catch (e) {
        console.error("❌ Failed logging story plan restriction:", e.message);
      }

      return { success: false, reason: "premium_feature_story_mentions" };
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

    let isFollowing = null;
    try {
      const followData = await MetaService.checkFollowStatus(senderId, pageAccessToken);
      if (followData.success) {
        isFollowing = followData.isFollowing === true;
      }
    } catch (followErr) {
      console.error("⚠️ Follow status check failed in orchestrator:", followErr.message);
    }

    // --- AUTOMIXA SHIELD: ACCOUNT-WIDE DELAY + HEAVY TRAFFIC COOLDOWN ---
    const shieldKeyword = text ? text.substring(0, 100) : (payload || type || "AUTOMIXA_SHIELD");
    const shieldCanContinue = await enforceAutomixaShieldTrafficGate(automation, senderId, userName, shieldKeyword, type);
    if (!shieldCanContinue) {
      console.warn(`Automixa Shield cooldown active for automation ${automation.id}. Event paused for account safety.`);
      return { success: false, reason: "automixa_shield_cooldown" };
    }
    await delay(getShieldDelay(SHIELD_ENTRY_DELAY_MIN_MS, SHIELD_ENTRY_DELAY_MAX_MS));

    // --- SMARTGUARD: ANTI-SPAM CIRCUIT BREAKER ---
    const isSpam = await SmartGuard.checkSpamAttack(senderId, automation.id);
    if (isSpam) {
      console.warn(`🛡️ [SmartGuard] Blocked abusive spamming by sender: ${senderId}`);
      await logShieldEvent(automation.id, senderId, userName, text ? text.substring(0, 100) : "SPAM_ABUSE", "BLOCKED", {
        reason: "repetitive_sender_spam",
        source: type || "UNKNOWN",
        error: "Automixa Shield isolated abusive repetitive triggers."
      });
      return { success: false, reason: "smartguard_spam_blocked" };
    }

    // 2. Resolve Triggers for this automation
    let { data: rawTriggers } = await supabaseAdmin
      .from("triggers")
      .select("*")
      .eq("automation_id", automation.id);

    const triggers = (rawTriggers || []).filter(t => t.metadata?.is_active !== false);

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
        // If it's a STORY event, allow STORY triggers and universal COMMENT/DM triggers
        if (type && type.startsWith("STORY")) {
          return t.type === "STORY" || t.type === "STORY_REPLY" || t.type === "STORY_MENTION" || t.type === "COMMENT" || t.type === "DM";
        }
        // If it's a DM or COMMENT, allow COMMENT (which acts as Comment & DM) and specific types
        return t.type === type || t.type === "COMMENT" || (!t.type && type === "DM") || t.type === "STORY_REPLY";
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
    if (!match) {
      try {
        await supabaseAdmin.from("automation_history").insert({
          automation_id: automation.id,
          sender_id: senderId,
          sender_name: userName || "there",
          type: type || "COMMENT",
          keyword: text ? text.substring(0, 100) : "NO_MATCH",
          status: "NO_MATCH",
          metadata: { error: "No matching trigger rules found.", text: text, comment_id: commentId, media_id: mediaId }
        });
      } catch (e) {
        console.error("❌ Failed logging no_match event:", e.message);
      }

      return { success: false, reason: "no_trigger_match" };
    }

    // --- STORY/CAMPAIGN COOLDOWN CHECK (24-Hour Cooldown) ---
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: recentHistoryCount } = await supabaseAdmin
        .from("automation_history")
        .select("id", { count: "exact", head: true })
        .eq("automation_id", automation.id)
        .eq("sender_id", senderId)
        .eq("keyword", match.keyword)
        .eq("status", "SUCCESS")
        .gt("created_at", oneDayAgo);

      if (recentHistoryCount && recentHistoryCount > 0) {
        console.log(`⏳ [COOLDOWN GATE] Blocked trigger for sender ${senderId} - Cooldown active (last message sent within 24h).`);
        
        try {
          await supabaseAdmin.from("automation_history").insert({
            automation_id: automation.id,
            sender_id: senderId,
            sender_name: userName || "cooldown_gate",
            type: type,
            keyword: match.keyword,
            status: "COOLDOWN_ACTIVE",
            metadata: { error: "User is in 24-hour cooldown period.", limit: "1 reply/24 hours" }
          });
        } catch (e) {
          console.error("❌ Failed logging cooldown block:", e.message);
        }

        return { success: false, reason: "cooldown_active" };
      }
    } catch (cooldownCheckErr) {
      console.error("⚠️ [COOLDOWN CHECK FAILED] Skipping cooldown check to avoid user block:", cooldownCheckErr.message);
    }

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
        metadata: { funnel_complete: false, event_key: eventKey, comment_id: commentId, message_id: messageId, media_id: mediaId, is_following: isFollowing }
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
        match.metadata?.intro_title || templates.intro_title || "Hey {name}! 👋 Thanks for the comment! Tap the button below and I'll send you the access right away. ⚡",
        userName,
        automation.brand_name
      );

      const introCardPayload = {
        text: introTitle || "Welcome! Tap below for access.",
        quick_replies: [{
          content_type: "text",
          title: match.metadata?.intro_button_text || "Send me the access",
          payload: match.id
        }]
      };
      const privateReplyResult = await MetaService.sendPrivateReply(commentId, introCardPayload, pageAccessToken);
      if (!privateReplyResult.success) {
        const requiresMessageAccess =
          privateReplyResult.error?.includes("disabled access to Instagram Direct messages");
        if (logData?.id) {
          const { error: updateError } = await supabaseAdmin.from("automation_history")
            .update({
              status: requiresMessageAccess ? "ACTION_REQUIRED" : "FAILED",
              metadata: {
                funnel_complete: false,
                event_key: eventKey,
                comment_id: commentId,
                message_id: messageId,
                media_id: mediaId,
                error: privateReplyResult.error,
                action_required: requiresMessageAccess ? "enable_instagram_message_access" : null
              }
            })
            .eq("id", logData.id);
          if (updateError) {
            console.error("❌ Failed updating private reply error:", updateError.message);
          }
        }
      }

      // B. Public Comment Reply with Automixa Shield delay for every plan.
      const publicReplyDelay = getShieldDelay(SHIELD_PUBLIC_REPLY_DELAY_MIN_MS, SHIELD_PUBLIC_REPLY_DELAY_MAX_MS);
      console.log(`Automixa Shield: applying public reply safety delay (${publicReplyDelay}ms) for ${userPlan || "free"} plan.`);
      await delay(publicReplyDelay);
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
      
      // LOGIC: Only lock if we are POSITIVE they are not following.
      // We use the pre-fetched isFollowing status
      const shouldLock = isFollowing === false;

      if (shouldLock) {
        console.log(`🚫 User ${userName} is NOT following. Showing Gate.`);
        // Not Following -> Show Gate Card (Delayed 2s)
        await delay(2000);
        
        const templates = automation.metadata?.templates || {};
        const gateTitle = interpolate(
          match.metadata?.follow_gate_message || templates.follow_gate_title || "One final step to unlock! 🎁", 
          userName, 
          automation.brand_name
        );
        await MetaService.sendFollowGateCard(
          senderId, 
          automation.brand_name || "us", 
          pageAccessToken, 
          automation.metadata?.username || automation.page_name || automation.ig_business_id,
          `VERIFY_FOLLOW:${match.id}`,
          gateTitle,
          "" // Remove subtitle as requested
        );
        return { success: true, status: "gated" };
      }
      console.log(`✅ Follow check passed or skipped (Reason: ${isFollowing === true ? 'Followed' : 'API Missing Field/Error'}).`);
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
          metadata: { funnel_complete: true, scraped: true, event_key: eventKey, comment_id: commentId, message_id: messageId, media_id: mediaId, is_following: isFollowing } 
        })
        .eq("automation_id", automation.id)
        .eq("sender_id", senderId)
        .order('created_at', { ascending: false })
        .limit(1);
    } else {
      // Check if there is an existing 'INTERACTED' log for this sender to update
      const { data: existingLogs } = await supabaseAdmin.from("automation_history")
        .select("id, status, metadata")
        .eq("automation_id", automation.id)
        .eq("sender_id", senderId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (existingLogs && existingLogs.length > 0 && existingLogs[0].status === "INTERACTED") {
        await supabaseAdmin.from("automation_history")
          .update({ 
            status: "SUCCESS", 
            metadata: { 
              ...(existingLogs[0].metadata || {}),
              funnel_complete: true, 
              scraped: true, 
              event_key: eventKey, 
              comment_id: commentId, 
              message_id: messageId, 
              media_id: mediaId,
              is_following: isFollowing
            } 
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
          metadata: { funnel_complete: true, scraped: true, event_key: eventKey, comment_id: commentId, message_id: messageId, media_id: mediaId, is_following: isFollowing }
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
      const validatedWebhook = await validatePublicWebhookUrl(webhookUrlStr);
      if (!validatedWebhook.ok) {
        console.warn(`[Outbound Webhook] Blocked invalid URL: ${validatedWebhook.error}`);
      } else {
        console.log(`[Outbound Webhook] Dispatching payload to: ${validatedWebhook.url}`);
        fetch(validatedWebhook.url, {
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
    }

    return { success: true };

  } catch (error) {
    console.error("🔥 Funnel Execution Error:", error);
    return { success: false, error: error.message };
  }
}
