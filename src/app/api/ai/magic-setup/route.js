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
    const handleLower = ig_handle.toLowerCase().trim();

    const simulatedIgData = {
      bio: `Business messaging workspace mapped to @${ig_handle}`,
      recentCaptions: [
        "Check out our latest collection. Comment INFO to receive product details.",
        "New customer guide is live. DM us or comment GUIDE for the workbook link.",
        "Support slots are open this week. Comment HELP to receive the booking page."
      ]
    };

    if (isKeyConfigured) {
      console.log(`Auto-Profile Magic Scanner: Processing @${ig_handle} using Groq LLM`);
      const groq = new Groq({ apiKey });

      const systemPrompt = `
      You are a customer messaging workflow analyst.
      Analyze the connected Instagram handle, bio, and recent post captions.
      Generate a brand voice persona and a safe starting set of customer reply workflows.

      CONNECTED PROFILE DATA:
      Handle: @${ig_handle}
      Suggested Brand Name: ${brand_name || "Automixa Workspace"}
      Simulated IG Profile Bio: "${simulatedIgData.bio}"
      Recent IG Post Captions: ${JSON.stringify(simulatedIgData.recentCaptions)}

      STRICT JSON OUTPUT FORMAT:
      {
        "brand_name": "string",
        "tone": "Friendly" | "Professional" | "Witty" | "Luxury" | "Helpful",
        "business_description": "string (1-2 sentences for AI memory)",
        "templates": {
          "intro_title": "string (helpful private message starting prompt, e.g. Hey {name}! Thanks for reaching out...)",
          "follow_gate_title": "string (access condition title, e.g. One more step before we send this resource.)"
        },
        "suggested_faqs": [
          {
            "keyword": "string (single uppercase word, e.g. INFO, GUIDE, SHOP)",
            "response": "string (helpful reply message under 200 chars, no raw links inside)",
            "button_text": "string (button label under 15 chars)",
            "button_link": "string (relevant placeholder link based on context)",
            "type": "DM" or "COMMENT",
            "campaign_name": "string"
          },
          {
            "keyword": "string",
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
      2. Do not promise audience expansion, boosted metrics, unusual reach, platform penalty avoidance, or guaranteed conversions.
      3. Keep all copy focused on customer support, product information, booking links, approved resources, and lead capture.
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

    console.log("Auto-Profile Magic Scanner: Fallback heuristics activated");

    const fallbackResult = {
      brand_name: brand_name || "My Brand Studio",
      tone: "Helpful",
      business_description: "We help customers find the right information, resources, and support links through structured Instagram messaging workflows.",
      templates: {
        intro_title: "Hey {name}! Thanks for reaching out. Tap below to get the details.",
        follow_gate_title: "One more step before we send this resource."
      },
      suggested_faqs: [
        {
          keyword: "INFO",
          response: "Hi {name}! Here are the details you requested. Tap below to open the information page.",
          button_text: "Open Info",
          button_link: "https://automixa.in/info",
          type: "DM",
          campaign_name: "Information Request"
        },
        {
          keyword: "GUIDE",
          response: "Hey {name}! Tap below to download the guide and review the next steps.",
          button_text: "Open Guide",
          button_link: "https://automixa.in/guide",
          type: "DM",
          campaign_name: "Guide Delivery"
        }
      ]
    };

    if (handleLower.includes("shop") || handleLower.includes("wear") || handleLower.includes("store") || handleLower.includes("brand")) {
      fallbackResult.brand_name = brand_name || "Store Workspace";
      fallbackResult.tone = "Professional";
      fallbackResult.business_description = "Retail workspace for answering product questions, sending catalog links, and collecting interested customer details.";
      fallbackResult.suggested_faqs = [
        {
          keyword: "SHOP",
          response: "Hey {name}! Tap below to view the product catalog and current availability.",
          button_text: "View Catalog",
          button_link: "https://automixa.in/shop",
          type: "DM",
          campaign_name: "Catalog Request"
        },
        {
          keyword: "PRICE",
          response: "Hi {name}! Here are the pricing details and order options.",
          button_text: "See Pricing",
          button_link: "https://automixa.in/pricing",
          type: "DM",
          campaign_name: "Pricing Inquiry"
        }
      ];
    } else if (handleLower.includes("coach") || handleLower.includes("consult") || handleLower.includes("agency") || handleLower.includes("service")) {
      fallbackResult.brand_name = brand_name || "Service Workspace";
      fallbackResult.tone = "Helpful";
      fallbackResult.business_description = "Service workflow for sending booking links, guides, and support resources to interested customers.";
      fallbackResult.suggested_faqs = [
        {
          keyword: "BOOK",
          response: "Hi {name}! Tap below to view available booking slots.",
          button_text: "Book Slot",
          button_link: "https://automixa.in/book",
          type: "DM",
          campaign_name: "Booking Request"
        },
        {
          keyword: "HELP",
          response: "Hey {name}! Here is the support page with the next steps.",
          button_text: "Get Help",
          button_link: "https://automixa.in/help",
          type: "DM",
          campaign_name: "Support Request"
        }
      ];
    }

    return NextResponse.json({ success: true, source: "fallback-heuristics", ...fallbackResult });
  } catch (err) {
    console.error("Magic Profile Setup API Error:", err);
    return NextResponse.json({ error: err.message || "Failed to process magic scan" }, { status: 500 });
  }
}
