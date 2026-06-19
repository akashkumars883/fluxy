/* src/app/api/ai/suggest/route.js - Copywriting Suggestion Engine */

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req) {
  try {
    const { text, type, campaignName, keyword } = await req.json();
    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Base text is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const isKeyConfigured = apiKey && apiKey !== "gsk_your_key_goes_here";

    if (isKeyConfigured) {
      console.log(`🤖 AI Suggest: Generating suggestions for type: ${type || 'dm'}`);
      const groq = new Groq({ apiKey });

      const maxLength = type === "public_reply" ? 80 : 120;
      const context = campaignName ? `Campaign: "${campaignName}"` : "";
      const keywordContext = keyword ? `Trigger keyword: "${keyword}"` : "";

      const systemPrompt = `
      You are an expert Instagram marketing copywriter.
      Your task is to rewrite the following base text into exactly 3 highly engaging, high-converting alternative versions.
      
      CONTEXT:
      Type: ${type === "public_reply" ? "Public Comment Reply" : "Private DM Message"}
      ${context}
      ${keywordContext}
      Max length per suggestion: ${maxLength} characters

      RULES:
      1. Return STRICTLY a valid JSON object. Do NOT wrap in markdown backticks.
      2. Suggestions must be warm, authentic, punchy, and include natural emojis.
      3. Do NOT include HTTP URLs inside the generated text.
      4. Avoid repetitive patterns between the suggestions.

      STRICT JSON OUTPUT FORMAT:
      {
        "suggestions": [
          "Variation 1...",
          "Variation 2...",
          "Variation 3..."
        ]
      }
      `;

      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Base Text to rewrite: "${text}"` }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      });

      const rawContent = response.choices[0]?.message?.content;
      if (rawContent) {
        const sanitizedContent = rawContent.replace(/^\s*```json\s*/i, '').replace(/\s*```\s*$/i, '').trim();
        const parsed = JSON.parse(sanitizedContent);
        if (parsed.suggestions && parsed.suggestions.length === 3) {
          return NextResponse.json({ success: true, source: "groq-llm", suggestions: parsed.suggestions });
        }
      }
    }

    // --- HEURISTIC FALLBACK (0 credits) ---
    console.log(`ℹ️ AI Suggest: Using smart fallback suggestions`);
    
    let fallbackSuggestions = [];
    if (type === "public_reply") {
      fallbackSuggestions = [
        `Sent! Check your DMs 📬✨`,
        `Just messaged you! Let me know if you got it 🙌`,
        `Done! Check your message requests right away ⚡`
      ];
    } else {
      fallbackSuggestions = [
        `Hey there! ⚡ Here is the exclusive link you requested. Click below to get instant access!`,
        `Woohoo! 🎉 Thanks for reaching out. Tap the button below to grab your private access link!`,
        `Got you covered! 😊 Click below to access the details right away.`
      ];
    }

    return NextResponse.json({ success: true, source: "fallback-engine", suggestions: fallbackSuggestions });

  } catch (err) {
    console.error("AI Suggest API Error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate suggestions" }, { status: 500 });
  }
}
