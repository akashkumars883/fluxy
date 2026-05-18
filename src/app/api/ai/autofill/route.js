/* src/app/api/ai/autofill/route.js - Real-time Campaign Copilot API */

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const isKeyConfigured = apiKey && apiKey !== "gsk_your_key_goes_here";

    if (isKeyConfigured) {
      console.log(`🤖 Real AI Copilot: Calling Groq LLM with prompt: "${prompt}"`);
      const groq = new Groq({ apiKey });

      const systemPrompt = `
      You are a world-class Instagram marketing copywriter and conversion rate optimization (CRO) specialist.
      Your task is to take a USER_PROMPT describing an Instagram automation campaign goal and generate a perfect, highly engaging set of configuration values.

      STRICT JSON OUTPUT FORMAT:
      {
        "keyword": "string (single short word, e.g. WIN, OFFER, GUIDE, LENS, all caps is preferred, no spaces)",
        "response": "string (engaging Private DM under 300 characters, warm and exciting, use emojis. Do NOT include any HTTP links in the text itself)",
        "publicReply": "string (fun and high-energy public comment reply, e.g. Just sent the info to your DMs! check it out 📬✨)",
        "buttonText": "string (extremely punchy CTA label under 15 characters, e.g. Get 20% Off 🎁, Grab Guide 📚)",
        "buttonLink": "string (a relevant placeholder URL based on context, e.g. https://yoursite.com/discount)",
        "campaignStrategy": "comment_dm" or "lead_capture",
        "followerGate": true or false (set to true if the prompt mentions followers, lock, gate, or if restricting to followers is highly strategic)
      }

      RULES:
      1. Return STRICTLY valid JSON. No markdown backticks, no wrap text, no explanations.
      2. The "response" text should be creative, punchy, and sound human. DO NOT include any raw link in the response text, as the clickable button will handle the link!
      3. For PDFs, ebooks, webinars, or lead magnets, set "campaignStrategy" to "lead_capture".
      `;

      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `USER_PROMPT: "${prompt}"` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const rawContent = response.choices[0]?.message?.content;
      if (rawContent) {
        const parsed = JSON.parse(rawContent);
        return NextResponse.json({ success: true, source: "groq-llm", ...parsed });
      }
    }

    // --- SMART FALLBACK / RULE-BASED ENGINE ---
    // This runs if the Groq API key is not yet set by the user, providing a premium experience out-of-the-box.
    console.log(`ℹ️ Real AI Copilot: Using smart fallback rules (Key missing or placeholder)`);
    const lower = prompt.toLowerCase();
    
    // Default fallback values
    let result = {
      keyword: "GET",
      response: "Hey {name}! 🚀 Thanks for reaching out. Here is the exclusive access link you requested!",
      publicReply: "Just DMed you the access details! Check it out 📬✨",
      buttonText: "Open Access 🔗",
      buttonLink: "https://automixa.com/access",
      campaignStrategy: "comment_dm",
      followerGate: false
    };

    if (lower.includes("discount") || lower.includes("offer") || lower.includes("coupon") || lower.includes("sale") || lower.includes("price")) {
      result.keyword = "OFFER";
      result.response = "Hey {name}! 🎁 Use code VIP20 at checkout to get an extra 20% off your entire order. Happy shopping!";
      result.publicReply = "Just DMed you the secret 20% discount code! Enjoy 🛍️🎉";
      result.buttonText = "Claim Code 🎁";
      result.buttonLink = "https://automixa.com/sale";
      if (lower.includes("follower") || lower.includes("fan")) {
        result.followerGate = true;
      }
    } else if (lower.includes("guide") || lower.includes("lead") || lower.includes("book") || lower.includes("pdf") || lower.includes("checklist")) {
      result.keyword = "GUIDE";
      result.response = "Hey {name}! 📖 Super thrilled you want to level up. Click below to grab your free copy of our ultimate guide checklist!";
      result.publicReply = "Sent the ultimate checklist guide straight to your DMs! 📚✨";
      result.buttonText = "Download PDF 📚";
      result.buttonLink = "https://automixa.com/guide.pdf";
      result.campaignStrategy = "lead_capture";
      result.followerGate = true; // Strategy: E-books should always capture followers
    } else if (lower.includes("giveaway") || lower.includes("contest") || lower.includes("win")) {
      result.keyword = "WIN";
      result.response = "Woohoo {name}! 🥳 You have successfully entered our exclusive VIP giveaway. Tap below to register your spot and claim double entries!";
      result.publicReply = "Sent your official entry ticket link to your DMs! Good luck 🍀📦";
      result.buttonText = "Enter Giveaway 🎟️";
      result.buttonLink = "https://automixa.com/giveaway";
      result.followerGate = true; // Direct giveaways require follow check
    } else if (lower.includes("waitlist") || lower.includes("early") || lower.includes("launch")) {
      result.keyword = "WAITLIST";
      result.response = "Hey {name}! ⚡ Welcome to the early access squad. Tap below to secure your spot on the waitlist and unlock priority updates!";
      result.publicReply = "DMed you the waitlist link! Priority access unlocked 🔓🔥";
      result.buttonText = "Join Waitlist ⏳";
      result.buttonLink = "https://automixa.com/waitlist";
    }

    return NextResponse.json({ success: true, source: "fallback-engine", ...result });

  } catch (err) {
    console.error("AI Autofill API Error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate campaign" }, { status: 500 });
  }
}
