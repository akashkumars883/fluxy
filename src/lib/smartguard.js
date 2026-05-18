// src/lib/smartguard.js
import { createAdminClient } from "./supabase.js";

const supabase = createAdminClient();

export const SmartGuard = {
  /**
   * 1. Spam Attack Circuit Breaker
   * Detects if the same user is repeatedly triggering keyword messages to crash or ban the account.
   */
  async checkSpamAttack(senderId, automationId) {
    if (!senderId || !automationId) return false;
    
    try {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      
      const { count, error } = await supabase
        .from("automation_history")
        .select("id", { count: "exact", head: true })
        .eq("sender_id", senderId)
        .eq("automation_id", automationId)
        .gt("created_at", twoMinutesAgo);

      if (error) {
        console.error("⚠️ [SmartGuard DB Error] Failed spam count check:", error.message);
        return false;
      }

      // If more than 4 requests in 2 minutes, isolate the attacker
      if (count && count >= 4) {
        console.warn(`🚨 [SmartGuard Block] Sender ${senderId} flagged for rapid spam trigger abuse. Request isolated.`);
        return true; 
      }
    } catch (err) {
      console.error("⚠️ [SmartGuard Error] checkSpamAttack failed:", err);
    }
    return false;
  },

  /**
   * 2. Adaptive Surge Queue & Dynamic Delay Calculator
   * Dynamically adjusts delays based on live server traffic in the last 60 seconds.
   */
  async getAdaptiveDelay(automationId) {
    if (!automationId) return Math.floor(Math.random() * 1000) + 2000;
    
    try {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
      
      const { count, error } = await supabase
        .from("automation_history")
        .select("id", { count: "exact", head: true })
        .eq("automation_id", automationId)
        .eq("status", "SUCCESS")
        .gt("created_at", oneMinuteAgo);

      if (error) {
        console.error("⚠️ [SmartGuard DB Error] Failed adaptive delay traffic count:", error.message);
        return Math.floor(Math.random() * 1000) + 2000;
      }

      const activeCount = count || 0;

      if (activeCount > 25) {
        // High Traffic Surge Mode -> Force a 8-12 second safety queue spread
        console.log(`⚠️ [SmartGuard Surge Mode] Throttling active (${activeCount} active replies/min). 8-12s delay.`);
        return Math.floor(Math.random() * 4000) + 8000;
      } else if (activeCount > 10) {
        // Medium Traffic Mode -> Force a 5-7 second human delay
        console.log(`ℹ️ [SmartGuard Medium Mode] Traffic scaling (${activeCount} replies/min). 5-7s delay.`);
        return Math.floor(Math.random() * 2000) + 5000;
      }
    } catch (err) {
      console.error("⚠️ [SmartGuard Error] getAdaptiveDelay failed:", err);
    }

    // Standard safe baseline human delay (2 to 4 seconds)
    return Math.floor(Math.random() * 2000) + 2000;
  },

  /**
   * 3. Dynamic Text Spintax Variant Rephraser
   * Variations to avoid exact duplicate message filtering by Meta Graph API.
   */
  applySpintax(baseText, name = "") {
    if (!baseText) return "";

    const greetings = ["Hey", "Hi", "Hello", "Great to connect,", "Hey there"];
    const intros = [
      "Just sent the details to your DMs!",
      "Check your inbox, I have sent you the link.",
      "Direct Message sent your way!",
      "DM incoming! Check it out."
    ];
    
    const randomGreet = greetings[Math.floor(Math.random() * greetings.length)];
    const randomIntro = intros[Math.floor(Math.random() * intros.length)];
    
    // Extract url to preserve link structures
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = baseText.match(urlRegex);
    const link = urls ? urls[0] : "";
    const cleanText = baseText.replace(link, "").trim();

    const formattedName = name ? ` ${name}` : "";

    // If there is an external link, structure a beautiful generic card context or custom text
    if (link) {
      // 30% chance to return clean structured spintax, 70% keep customized text but vary greetings
      if (Math.random() > 0.7) {
        return `${randomGreet}${formattedName}! ${randomIntro}\n\n👉 Access Link: ${link}`;
      } else {
        return `${randomGreet}${formattedName}! ${cleanText}\n\n${link}`;
      }
    }
    
    return `${randomGreet}${formattedName}! ${cleanText}`;
  }
};
