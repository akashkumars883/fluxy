import { NextResponse } from "next/server";
import { processAutomation } from "@/lib/automation";
import crypto from "crypto";

function safeEqual(a, b) {
  const aBuf = Buffer.from(a || "", "utf8");
  const bBuf = Buffer.from(b || "", "utf8");
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function getWebhookAppSecrets() {
  return [
    process.env.FACEBOOK_APP_SECRET,
    process.env.INSTAGRAM_APP_SECRET,
  ]
    .map((secret) => secret?.trim())
    .filter(Boolean);
}

function verifyWebhookSignature(signature, rawBodyBuffer) {
  const appSecrets = getWebhookAppSecrets();
  if (appSecrets.length === 0) return { ok: true, expectedHint: null };
  if (!signature) return { ok: false, expectedHint: "missing signature" };

  for (const appSecret of appSecrets) {
    const expected =
      "sha256=" +
      crypto.createHmac("sha256", appSecret).update(rawBodyBuffer).digest("hex");

    if (safeEqual(signature, expected)) {
      return { ok: true, expectedHint: null };
    }
  }

  const expected =
    "sha256=" +
    crypto.createHmac("sha256", appSecrets[0]).update(rawBodyBuffer).digest("hex");
  return { ok: false, expectedHint: `${expected.substring(0, 12)}...` };
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
  console.log("📥 [Incoming Webhook] Received POST request at /api/webhook");

  let rawBodyBuffer;
  try {
    rawBodyBuffer = Buffer.from(await req.arrayBuffer());
    console.log("📥 [Incoming Webhook] Payload:", rawBodyBuffer.toString("utf8"));
  } catch (err) {
    console.error("❌ [Incoming Webhook] Failed to read body:", err.message);
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const signature = req.headers.get("x-hub-signature-256") || "";
  const signatureCheck = verifyWebhookSignature(signature, rawBodyBuffer);
  if (!signatureCheck.ok) {
    console.error("❌ Webhook Signature Mismatch!");
    console.log("Expected Token Hint:", signatureCheck.expectedHint);
    console.log("Received Signature:", signature || "missing signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body;
  try {
    const rawBody = rawBodyBuffer.toString("utf8");
    const sanitizedBody = rawBody.replace(/(:\s*)(\d{15,})/g, '$1"$2"');
    body = JSON.parse(sanitizedBody || "{}");
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // FIX: Previously only "instagram" object was handled, which broke the
  // Facebook Login flow where events come through with object === "page".
  // We now support both "instagram" and "page" object types.
  const SUPPORTED_OBJECTS = new Set(["instagram", "page"]);

  if (!SUPPORTED_OBJECTS.has(body.object)) {
    return NextResponse.json({ status: "not found" }, { status: 404 });
  }

  for (const entry of body.entry || []) {
    // 1. Handle Direct Messages (Instagram + Facebook Page Messenger)
    for (const messagingItem of entry.messaging || []) {
      const senderId = messagingItem.sender?.id;
      const recipientId = messagingItem.recipient?.id;
      const message = messagingItem.message;
      const postback = messagingItem.postback;

      // Postback (Follow-Gate Verification Click)
      if (senderId && recipientId && postback) {
        const payload = postback.payload;
        await processAutomation(senderId, "POSTBACK_CLICKED", "DM", recipientId, null, null, null, payload);
        continue;
      }

      if (message) {
        if (message.is_echo) {
          continue;
        }
        let text = message.text || "";

        // Detect shared reel/post (e.g. "Send this reel in DM to get the link")
        if (message.attachments && message.attachments.length > 0) {
          const attachment = message.attachments[0];
          if (attachment.type === "share" && attachment.payload?.url) {
            text = (text + " " + attachment.payload.url).trim();
          }
        }

        const mid = message.mid;
        const quickReplyPayload = message.quick_reply?.payload;
        let type = "DM";

        // --- STORY LOGIC (Instagram only) ---
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

    // 2. Handle Comments (Instagram only — Facebook Page posts don't auto-trigger here)
    if (body.object === "instagram") {
      for (const change of entry.changes || []) {
        if (change.field === "comments") {
          const commentId = change.value?.id;
          const text = change.value?.text || "";
          const senderId = change.value?.from?.id;
          const senderUsername = change.value?.from?.username;
          const recipientId = entry.id;
          const mediaId = change.value?.media?.id;

          if (senderId && recipientId && commentId && mediaId) {
            await processAutomation(senderId, text, "COMMENT", recipientId, commentId, mediaId, null, null, senderUsername);
          }
        }
      }
    }
  }
  return NextResponse.json({ status: "ok" });
}
