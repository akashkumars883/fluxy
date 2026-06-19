const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

const secret = process.env.FACEBOOK_APP_SECRET || process.env.INSTAGRAM_APP_SECRET || "dummy";

async function sendWebhook(payloadName, bodyObj) {
  const payload = JSON.stringify(bodyObj);
  let signature = "";
  
  if (process.env.FACEBOOK_APP_SECRET || process.env.INSTAGRAM_APP_SECRET) {
      signature = "sha256=" + crypto.createHmac("sha256", secret).update(payload, 'utf8').digest("hex");
  }

  console.log(`\n======================================`);
  console.log(`🚀 TEST TRIGGERED: ${payloadName}`);
  console.log(`======================================`);
  
  try {
    const res = await fetch("https://automixa.in/api/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hub-signature-256": signature
      },
      redirect: "manual",
      body: payload
    });
    
    console.log(`✅ Webhook Accepted! Status: ${res.status}`);
    const text = await res.text();
    console.log(`Server Response: ${text}\n`);
  } catch (err) {
    console.error("❌ Request Failed:", err.message);
  }
}

async function runTests() {
  console.log("Starting Webhook Simulation...\n");
  
  // 1. Comment Webhook
  await sendWebhook("COMMENT ON POST", {
    object: "instagram",
    entry: [{
      id: "10000_TEST_ACCOUNT_ID",
      time: Date.now(),
      changes: [{
        field: "comments",
        value: {
          id: "COMMENT_ID_123",
          text: "What is the PRICE?",
          from: { id: "USER_ID_123", username: "test_user" },
          media: { id: "MEDIA_ID_123" }
        }
      }]
    }]
  });

  // 2. Standard DM
  await sendWebhook("DIRECT MESSAGE (DM)", {
    object: "instagram",
    entry: [{
      id: "10000_TEST_ACCOUNT_ID",
      time: Date.now(),
      messaging: [{
        sender: { id: "USER_ID_123" },
        recipient: { id: "10000_TEST_ACCOUNT_ID" },
        message: {
          mid: "MID_123",
          text: "Hello, I want to buy this."
        }
      }]
    }]
  });

  // 3. Story Mention
  await sendWebhook("STORY MENTION", {
    object: "instagram",
    entry: [{
      id: "10000_TEST_ACCOUNT_ID",
      time: Date.now(),
      messaging: [{
        sender: { id: "USER_ID_123" },
        recipient: { id: "10000_TEST_ACCOUNT_ID" },
        message: {
          mid: "MID_456",
          text: "",
          story_mention: {
            link: "http://instagram.com/...",
            id: "STORY_ID_123"
          }
        }
      }]
    }]
  });
  
  // 4. Story Reply
  await sendWebhook("STORY REPLY", {
    object: "instagram",
    entry: [{
      id: "10000_TEST_ACCOUNT_ID",
      time: Date.now(),
      messaging: [{
        sender: { id: "USER_ID_123" },
        recipient: { id: "10000_TEST_ACCOUNT_ID" },
        message: {
          mid: "MID_789",
          text: "Wow!",
          reply_to: {
             mid: "STORY_MID_111",
             item_type: "story"
          }
        }
      }]
    }]
  });

  console.log("All Simulated Webhook Requests Sent!");
}

runTests();
