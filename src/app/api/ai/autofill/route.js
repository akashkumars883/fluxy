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
      console.log(`Real AI Copilot: Calling Groq LLM with prompt: "${prompt}"`);
      const groq = new Groq({ apiKey });

      const systemPrompt = `
      You are a world-class customer messaging and marketing operations copywriter.
      Your task is to take a USER_PROMPT describing an Instagram business messaging workflow and generate clear, compliant configuration values.

      STRICT JSON OUTPUT FORMAT:
      {
        "keyword": "string (single short word, e.g. INFO, OFFER, GUIDE, LENS, all caps is preferred, no spaces)",
        "response": "string (helpful Private DM under 120 characters, extremely concise, warm and clear. Do NOT include any HTTP links in the text itself)",
        "publicReply": "string (clear public comment reply, e.g. Just sent the details to your DMs.)",
        "buttonText": "string (CTA label under 15 characters, e.g. Get Offer, Open Guide)",
        "buttonLink": "string (a relevant placeholder URL based on context, e.g. https://yoursite.com/discount)",
        "campaignStrategy": "comment_dm" or "lead_capture",
        "followerGate": true or false (set to true only if the prompt clearly asks for an access condition or member-only delivery)
      }

      RULES:
      1. Return STRICTLY valid JSON. No markdown backticks, no wrap text, no explanations.
      2. The "response" text should be clear, helpful, and sound human. DO NOT include any raw link in the response text, as the clickable button will handle the link.
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
        const sanitizedContent = rawContent.replace(/^\s*```json\s*/i, '').replace(/\s*```\s*$/i, '').trim();
        const parsed = JSON.parse(sanitizedContent);
        return NextResponse.json({ success: true, source: "groq-llm", ...parsed });
      }
    }

    console.log("Real AI Copilot: Using smart fallback rules (key missing or placeholder)");
    const lower = prompt.toLowerCase();

    const result = {
      keyword: "GET",
      response: "Hey {name}! Thanks for reaching out. Here are the details you requested.",
      publicReply: "Just sent the details to your DMs.",
      buttonText: "Open Access",
      buttonLink: "https://automixa.com/access",
      campaignStrategy: "comment_dm",
      followerGate: false
    };

    if (lower.includes("discount") || lower.includes("offer") || lower.includes("coupon") || lower.includes("sale") || lower.includes("price")) {
      result.keyword = "OFFER";
      result.response = "Hey {name}! Use code SAVE20 at checkout to get 20% off your order.";
      result.publicReply = "Just sent the discount details to your DMs.";
      result.buttonText = "Claim Code";
      result.buttonLink = "https://automixa.com/sale";
      if (lower.includes("member") || lower.includes("access condition") || lower.includes("locked")) {
        result.followerGate = true;
      }
    } else if (lower.includes("guide") || lower.includes("lead") || lower.includes("book") || lower.includes("pdf") || lower.includes("checklist")) {
      result.keyword = "GUIDE";
      result.response = "Hey {name}! Thanks for your interest. Tap below to download the guide.";
      result.publicReply = "Sent the guide details to your DMs.";
      result.buttonText = "Download PDF";
      result.buttonLink = "https://automixa.com/guide.pdf";
      result.campaignStrategy = "lead_capture";
    } else if (lower.includes("giveaway") || lower.includes("contest") || lower.includes("win")) {
      result.keyword = "ENTRY";
      result.response = "Hey {name}! Tap below to register your entry and review the campaign details.";
      result.publicReply = "Sent the registration details to your DMs.";
      result.buttonText = "Register";
      result.buttonLink = "https://automixa.com/giveaway";
    } else if (lower.includes("waitlist") || lower.includes("early") || lower.includes("launch")) {
      result.keyword = "WAITLIST";
      result.response = "Hey {name}! Tap below to join the waitlist and receive product updates.";
      result.publicReply = "Sent the waitlist link to your DMs.";
      result.buttonText = "Join Waitlist";
      result.buttonLink = "https://automixa.com/waitlist";
    }

    return NextResponse.json({ success: true, source: "fallback-engine", ...result });
  } catch (err) {
    console.error("AI Autofill API Error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate campaign" }, { status: 500 });
  }
}
