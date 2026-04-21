/* scripts/seed-variants.mjs */
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";

dotenv.config({ path: ".env.local" });

// Initialize Supabase Admin
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function generateTriggerVariants(baseMessage) {
    if (!baseMessage) return null;

    const systemPrompt = `
    Create 5 DM and 5 Public Comment variations of this message.
    Keep all LINKS/PRICES/CODES the same. 
    Tone: Friendly & Energetic Influencer. 
    Respond with JSON: { "dm": [], "public": [] }
    `;

    try {
        const res = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: baseMessage }
            ],
            temperature: 0.8,
            response_format: { type: "json_object" }
        });

        return JSON.parse(res.choices[0]?.message?.content || "{}");
    } catch (err) {
        console.error("Error generating for message:", baseMessage, err.message);
        return null;
    }
}

async function startSeeding() {
    console.log("🚀 Starting AI Variant Seeding...");

    // 1. Fetch triggers that don't have variants or have empty variants
    const { data: triggers, error } = await supabase
        .from('triggers')
        .select('*');
        // Filter in JS for safety/simplicity with JSONB
        
    if (error) {
        console.error("Error fetching triggers:", error);
        return;
    }

    const pendingTriggers = triggers.filter(t => !t.variants || !t.variants.dm || t.variants.dm.length === 0);
    
    console.log(`Found ${pendingTriggers.length} triggers needing variants.`);

    for (const trigger of pendingTriggers) {
        console.log(`Generating for keyword: "${trigger.keyword}"...`);
        
        const variants = await generateTriggerVariants(trigger.response);
        
        if (variants) {
            const { error: updateError } = await supabase
                .from('triggers')
                .update({ variants: variants })
                .eq('id', trigger.id);
            
            if (updateError) {
                console.error(`Failed to update ${trigger.id}:`, updateError.message);
            } else {
                console.log(`✅ Success for "${trigger.keyword}"`);
            }
        }
        
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 500));
    }

    console.log("✨ Seeding Complete!");
}

startSeeding();
