/* src/lib/ai.js - Dual Intelligence with Long-Term Memory */

import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

function keywordMatch(message, triggers) {
    const lowerMsg = message.toLowerCase();
    for (const t of triggers) {
        if (lowerMsg.includes(t.keyword.toLowerCase())) {
            return t.id;
        }
    }
    return null;
}

/**
 * SMART LAYER: Mood, Context & Memory Assessment
 */
async function llmMatch(userMessage, triggers, postContext = "", userMemory = "") {
    const triggerContext = triggers.map(t => ({
        id: t.id,
        keyword: t.keyword
    }));

    const systemPrompt = `
    Analyze Message, Post Context & User History.
    
    USER_HISTORY (Last 3 interactions): "${userMemory}"
    POST_CONTEXT: "${postContext}"
    TRIGGERS: ${JSON.stringify(triggerContext)}
    
    DECISION RULES:
    1. Assess POST_CONTEXT: Selling something? (YES/NO)
    2. Assess USER_MESSAGE: Buying intent/Objections? (YES/NO)
    3. MOOD: SALES if both are YES. Else BASIC.
    4. MATCHING: Match to trigger ID. Use USER_HISTORY to clarify if the user says "Same", "That one", etc.

    Return JSON strictly:
    { "triggerId": "id or null", "confidence": 0-1, "mood": "BASIC" | "SALES" }
    `;

    try {
        const res = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `User: "${userMessage}"` }
            ],
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const data = JSON.parse(res.choices[0]?.message?.content || "{}");
        return { 
            triggerId: data.confidence > 0.6 ? data.triggerId : null,
            mood: data.mood || "BASIC"
        };
    } catch {
        return { triggerId: null, mood: "BASIC" };
    }
}

export async function matchIntent(userMessage, triggers, postContext = "", userMemory = "") {
    if (!triggers?.length) return { triggerId: null, mood: "BASIC" };
    const quickId = keywordMatch(userMessage, triggers);
    if (quickId) return { triggerId: quickId, mood: "BASIC" };
    return await llmMatch(userMessage, triggers, postContext, userMemory);
}

/**
 * AI Voice Mirroring with Persona & Memory
 */
export async function generatePersonalizedResponse(userMessage, baseResponse, userName, mood = "BASIC", userMemory = "") {
  if (!baseResponse) return null;

  // Static/Prompt Guard
  const isPrompt = baseResponse.trim().startsWith("[STATIC]") || 
                   baseResponse.trim().startsWith("/imagine") || 
                   baseResponse.includes("--v") || 
                   baseResponse.includes("4k,");
  
  if (isPrompt) return baseResponse.replace("[STATIC]", "").trim();

  const systemPrompt = mood === "STORY"
    ? `PERSONA: Extremely Warm & Appreciative Friend. 
       The user just tagged you or replied to your story. 
       Make them feel special and loved. Use short, punchy, and super casual English. 
       Mention the support or the vibe. Use hearts and fire emojis.`
    : (mood === "SALES" 
    ? `PERSONA: World-Class Sales Closer. User History: "${userMemory}".
       If there is history, acknowledge it warmly (e.g. "Good to see you again! Last time we talked about...").
       Be persuasive, overcome objections, stack value, and use professional, energetic English. Use emojis.`
    : `PERSONA: Friendly Assistant. User History: "${userMemory}".
       Acknowledge if they have been here before naturally.
       Deliver info clearly and energetically in professional English.`) ;

  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User: ${userName}, MSG: "${userMessage}", Base: "${baseResponse}"` }
      ],
      temperature: 0.7,
    });
    return res.choices[0]?.message?.content?.trim() || baseResponse;
  } catch { return baseResponse; }
}
