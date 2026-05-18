/* src/app/api/ai/magic-setup/route.js - Auto-Profile Intelligence AI Engine */

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req) {
  try {
    const { ig_handle, brand_name } = await req.json();
    if (!ig_handle) {
      return NextResponse.json({ error: "Instagram handle is required for profile scanning" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const isKeyConfigured = apiKey && apiKey !== "gsk_your_key_goes_here";

    // Prepare simulated IG Bio & caption dataset based on handle to simulate Meta Graph API scrapers
    const handleLower = ig_handle.toLowerCase().trim();
    let simulatedIgData = {
      bio: `Premium brand workspace mapped to @${ig_handle}`,
      recentCaptions: [
        "Check out our latest collections. Click the link to grab exclusive entry access!",
        "Level up your workflow with our smart setups. DM for waitlist access ⚡",
        "Full tutorial launching this Friday! Drop a comment to get the private workbook link sent directly."
      ]
    };

    if (handleLower.includes("fit") || handleLower.includes("coach") || handleLower.includes("gym") || handleLower.includes("train")) {
      simulatedIgData.bio = "💪 Fitness Coach & CRO Specialist | Helping you build lean muscle & high performance. 🏋️‍♂️ Custom 1:1 Coaching open below!";
      simulatedIgData.recentCaptions = [
        "Want my complete 4-week fat loss checklist for free? Comment 'SHRED' and I will DM you the PDF checklist immediately! 🔥",
        "Stop making these 3 posture mistakes on bench press. Full coaching slots open for next month. Link in bio!",
        "Double tap if you're hitting legs today! 🦵 Drop a comment to join my private community group."
      ];
    } else if (handleLower.includes("shop") || handleLower.includes("wear") || handleLower.includes("store") || handleLower.includes("brand") || handleLower.includes("stitch")) {
      simulatedIgData.bio = "✨ Premium Streetwear & Minimalist Fits. 🌿 100% heavy-weight organic cotton. Crafted for comfort. Ships worldwide.";
      simulatedIgData.recentCaptions = [
        "Our highly anticipated oversized hoodies drop tonight! Comment 'DROP' to get an exclusive early bird 20% discount code! 🛍️✨",
        "Behind the scenes at our tailoring studio. Quality you can feel. Tap shop link below.",
        "What color should we drop next? Comment your choice and win a free tee!"
      ];
    } else if (handleLower.includes("agency") || handleLower.includes("dev") || handleLower.includes("design") || handleLower.includes("growth")) {
      simulatedIgData.bio = "🚀 Growth & Development Agency. We build high-converting SaaS apps and modern UI/UX landing designs. Let's scale!";
      simulatedIgData.recentCaptions = [
        "How we scaled our client's CRM conversion by 420% in 30 days. Comment 'SCALE' to get the full case study workbook! 📊📚",
        "Is your landing page leaking money? Book a free audit slot. Link below.",
        "Tips for hiring high-performing engineers in 2026. Bookmark this thread!"
      ];
    }

    if (isKeyConfigured) {
      console.log(`🔮 Auto-Profile Magic Scanner: Processing @${ig_handle} using Groq LLM...`);
      const groq = new Groq({ apiKey });

      const systemPrompt = `
      You are a world-class Social Media Profile Intelligence analyst.
      Your task is to analyze a connected Instagram handle, simulated Bio, and recent published Post Captions.
      Based on this data, auto-configure their brand voice persona and generate a hyper-targeted starting set of automation triggers.

      CONNECTED PROFILE DATA:
      Handle: @${ig_handle}
      Suggested Brand Name: ${brand_name || "Automixa Workspace"}
      Simulated IG Profile Bio: "${simulatedIgData.bio}"
      Recent IG Post Captions: ${JSON.stringify(simulatedIgData.recentCaptions)}

      STRICT JSON OUTPUT FORMAT:
      {
        "brand_name": "string (perfect polished name, e.g. Red Stitch, Gym Elite)",
        "tone": "Friendly" | "Professional" | "Witty" | "Luxury" | "Helpful" (pick the absolute best fit),
        "business_description": "string (1-2 sentences of highly professional brand description for AI memory)",
        "templates": {
          "intro_title": "string (highly personalized dynamic private message starting prompt, e.g. Hey {name}! Thanks for the love on my post...)",
          "follow_gate_title": "string (personalized lock gate title, e.g. Hold on, {name}! 🎁)"
        },
        "suggested_faqs": [
          {
            "keyword": "string (single uppercase word, e.g. SHRED, SCALE, VIP, SHOP)",
            "response": "string (creative dynamic reply message under 200 chars, no raw links inside)",
            "button_text": "string (dynamic button label, under 15 chars, e.g. Get Code 🎁, Get Checklist 📖)",
            "button_link": "string (relevant dynamic placeholder link based on context)",
            "type": "DM" or "COMMENT",
            "campaign_name": "string (friendly name, e.g. Early Bird Drop, Free Shred Guide)"
          },
          {
            "keyword": "string (second trigger keyword)",
            "response": "string",
            "button_text": "string",
            "button_link": "string",
            "type": "DM" or "COMMENT",
            "campaign_name": "string"
          }
        ]
      }

      RULES:
      1. Return STRICTLY valid JSON only. No markdown formatting, no descriptions.
      2. Choose the suggested tone and description to perfectly match the IG profile theme.
      `;

      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Perform Magic Scan Profile Setup." }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const rawContent = response.choices[0]?.message?.content;
      if (rawContent) {
        const parsed = JSON.parse(rawContent);
        return NextResponse.json({ success: true, source: "groq-intelligence", ...parsed });
      }
    }

    // --- HEURISTIC FALLBACK (Out-of-the-box standard fallback) ---
    console.log(`🔮 Auto-Profile Magic Scanner: Fallback heuristics activated`);
    
    let fallbackResult = {
      brand_name: brand_name || "My Brand Studio",
      tone: "Friendly",
      business_description: "We help customers automate workflows and engage their target audience beautifully.",
      templates: {
        intro_title: "Hey {name}! ⚡ Thanks for your awesome comment. Tap below to get your private access!",
        follow_gate_title: "Unlock your gift card! 🎁"
      },
      suggested_faqs: [
        {
          keyword: "ACCESS",
          response: "Hi {name}! Click below to claim your immediate early access workbook code!",
          button_text: "Get Workbook ⚡",
          button_link: "https://automixa.in/access",
          type: "DM",
          campaign_name: "Instant Access Lead"
        },
        {
          keyword: "SPECIAL",
          response: "Hey {name}! You've unlocked our community prize package. Register below!",
          button_text: "Claim Spot 🎁",
          button_link: "https://automixa.in/special",
          type: "DM",
          campaign_name: "Community Offer"
        }
      ]
    };

    if (handleLower.includes("fit") || handleLower.includes("coach") || handleLower.includes("gym") || handleLower.includes("train")) {
      fallbackResult.brand_name = brand_name || "FitPro Coach";
      fallbackResult.tone = "Helpful";
      fallbackResult.business_description = "Online physical training academy delivering actionable fat-loss checklists and coaching.";
      fallbackResult.templates.intro_title = "Hey {name}! 💪 Awesome effort hitting my posts. I've compiled your custom guides below!";
      fallbackResult.suggested_faqs = [
        {
          keyword: "SHRED",
          response: "Boom {name}! 🏋️‍♂️ Here is my premium 4-week fat-loss and tracking guide checklist. Let's build!",
          button_text: "Download PDF 📚",
          button_link: "https://automixa.in/shred-guide.pdf",
          type: "DM",
          campaign_name: "Fat-Loss Checklist"
        },
        {
          keyword: "COACH",
          response: "Hey {name}! Ready to take it to the next level? Apply to my 1-on-1 coaching team below!",
          button_text: "Apply Now 🏋️‍♂️",
          button_link: "https://automixa.in/apply",
          type: "DM",
          campaign_name: "Coaching Application"
        }
      ];
    } else if (handleLower.includes("shop") || handleLower.includes("wear") || handleLower.includes("store") || handleLower.includes("brand") || handleLower.includes("stitch")) {
      fallbackResult.brand_name = brand_name || "Stitch Couture";
      fallbackResult.tone = "Luxury";
      fallbackResult.business_description = "High-fidelity, sustainable minimalist apparel and tailor-made streetwear fits.";
      fallbackResult.templates.intro_title = "Welcome to the family, {name}. ✨ Your custom early-bird code is compiled below.";
      fallbackResult.suggested_faqs = [
        {
          keyword: "DROP",
          response: "Hey {name}! 🛍️ Enjoy an exclusive 20% discount on our entire organic heavyweight collection drop!",
          button_text: "Save 20% 🎁",
          button_link: "https://automixa.in/shop",
          type: "DM",
          campaign_name: "Early-Bird Promo"
        },
        {
          keyword: "STYLE",
          response: "Hey {name}! Check out our seasonal lookbook guide to see our tailor-made Oversized Fits in action!",
          button_text: "Open Lookbook 🌿",
          button_link: "https://automixa.in/lookbook",
          type: "DM",
          campaign_name: "Seasonal Lookbook"
        }
      ];
    }

    return NextResponse.json({ success: true, source: "fallback-heuristics", ...fallbackResult });

  } catch (err) {
    console.error("Magic Profile Setup API Error:", err);
    return NextResponse.json({ error: err.message || "Failed to process magic scan" }, { status: 500 });
  }
}
