import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * AI function to generate 5 DM and 5 Public variations of a base message
 * Used to populate the 'variants' column in the triggers table.
 */
export async function generateTriggerVariants(baseMessage) {
    if (!baseMessage) return null;

    const systemPrompt = `
    You are a professional social media response architect.
    Your task is to take a BASE_MESSAGE and create:
    1. Five (5) high-energy variations for a Direct Message (DM).
    2. Five (5) witty and friendly variations for a Public Comment Reply (Public).

    STRICT RULES:
    1. Do NOT add any new links, prices, or factual information not present in the BASE_MESSAGE.
    2. Variations should only differ in Tone, Style, and Emoji usage.
    3. Keep the links/codes/CTAs exactly the same.
    4. Respond with valid JSON only.

    JSON STRUCTURE:
    {
      "dm": ["variant 1", "variant 2", "variant 3", "variant 4", "variant 5"],
      "public": ["reply 1", "reply 2", "reply 3", "reply 4", "reply 5"]
    }
    `;

    try {
        const res = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `BASE_MESSAGE: "${baseMessage}"` }
            ],
            temperature: 0.8,
            response_format: { type: "json_object" }
        });

        const content = res.choices[0]?.message?.content;
        if (!content) return null;
        
        const parsed = JSON.parse(content);
        
        // Final safety check to ensure we have arrays
        return {
            dm: Array.isArray(parsed.dm) ? parsed.dm : [],
            public: Array.isArray(parsed.public) ? parsed.public : []
        };
    } catch (err) {
        console.error("Variant Generation Error:", err);
        return null;
    }
}
