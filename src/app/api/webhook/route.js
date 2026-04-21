import { NextResponse } from "next/server";
import { processAutomation } from "@/lib/automation";
import crypto from "crypto";

function safeEqual(a, b) {
  const aBuf = Buffer.from(a || "", "utf8");
  const bBuf = Buffer.from(b || "", "utf8");
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken =
    process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || process.env.VERIFY_TOKEN;

  if (mode === "subscribe" && verifyToken && token === verifyToken) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req) {
  let rawBody = "";
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  if (appSecret) {
    const signature = req.headers.get("x-hub-signature-256") || "";
    const expected =
      "sha256=" +
      crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");

    if (!signature || !safeEqual(signature, expected)) {
      console.error("❌ Webhook Signature Mismatch!");
      console.log("Expected Token Hint:", expected.substring(0, 8) + "...");
      console.log("Received Signature:", signature);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let body;
  try {
    body = JSON.parse(rawBody || "{}");
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.object === "instagram") {
    for (const entry of body.entry || []) {
      for (const messagingItem of entry.messaging || []) {
        const senderId = messagingItem.sender?.id;
        const recipientId = messagingItem.recipient?.id;
        const message = messagingItem.message;
        const postback = messagingItem.postback;

        // 1. Handle Postback (Follow-Gate Verification Click)
        if (senderId && recipientId && postback) {
          const payload = postback.payload;
          // type "DM" is used for processing these structured interactions
          await processAutomation(senderId, "POSTBACK_CLICKED", "DM", recipientId, null, null, null, payload);
          continue;
        }

        if (message) {
          const text = message.text || "";
          const mid = message.mid;
          const quickReplyPayload = message.quick_reply?.payload;
          let type = "DM";
          
          // --- STORY LOGIC ---
          const isStoryReply = message.reply_to?.item_type === "story";
          const isStoryMention = message.story_mention;

          if (isStoryMention) {
             type = "STORY_MENTION";
             console.log(`Story Mention from ${senderId}`);
          } else if (isStoryReply) {
             type = "STORY_REPLY";
             console.log(`Story Reply from ${senderId}: ${text}`);
          }

          if (senderId && recipientId) {
            await processAutomation(senderId, text, type, recipientId, null, null, mid, quickReplyPayload);
          }
        }
      }

      // 2. Handle Comments
      for (const change of entry.changes || []) {
        if (change.field === "comments") {
          const commentId = change.value?.id;
          const text = change.value?.text || "";
          const senderId = change.value?.from?.id;
          const recipientId = entry.id; 
          const mediaId = change.value?.media?.id;

          if (senderId && recipientId && commentId && mediaId) {
            await processAutomation(senderId, text, "COMMENT", recipientId, commentId, mediaId);
          }
        }
      }
    }
    return NextResponse.json({ status: "ok" });
  }

  return NextResponse.json({ status: "not found" }, { status: 404 });
}
