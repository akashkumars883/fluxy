import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

import { decryptToken } from "../src/lib/security.js";
import { MetaService } from "../src/lib/meta.js";

dotenv.config({ path: ".env.local" });

const automationId = process.argv[2];
if (!automationId) {
  console.error("Usage: node scratch/meta_check.mjs <automationId>");
  process.exit(2);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(2);
}

const supabase = createClient(supabaseUrl, serviceKey);

const { data: automation, error: automationError } = await supabase
  .from("automations")
  .select("id,page_id,ig_business_id,access_token,page_name")
  .eq("id", automationId)
  .maybeSingle();

if (automationError || !automation) {
  console.error("Automation fetch failed:", automationError?.message || "Not found");
  process.exit(1);
}

const token = decryptToken(automation.access_token);
if (!token) {
  console.error("Missing access_token for this automation");
  process.exit(1);
}

console.log("automationId:", automation.id);
console.log("page_name:", automation.page_name);
console.log("page_id:", automation.page_id);
console.log("ig_business_id:", automation.ig_business_id);

const debug = await MetaService.debugToken(token);
if (debug.success) {
  console.log("token scopes:", debug.data?.scopes || null);
  console.log("token granular_scopes:", debug.data?.granular_scopes || null);
} else {
  console.log("debug_token failed:", debug.error);
}

const ig = automation.ig_business_id;
if (!ig) {
  console.error("Missing ig_business_id on this automation.");
  process.exit(1);
}

const insightsUrl =
  `https://graph.facebook.com/v21.0/${ig}/insights` +
  `?metric=reach,follower_count&period=day&access_token=${encodeURIComponent(token)}`;
const insightsRes = await fetch(insightsUrl);
const insightsJson = await insightsRes.json().catch(() => null);
console.log("insights:", insightsRes.status, insightsJson?.error?.message || "OK");

const media = await MetaService.getMediaList(ig, token, { limit: 5 });
console.log("media:", media.success ? "OK" : "FAILED", media.data?.length || 0, media.error || "");

if (media.success && (media.data?.length || 0) > 0) {
  const mediaId = media.data[0].id;
  const commentsUrl =
    `https://graph.facebook.com/v21.0/${mediaId}/comments` +
    `?fields=id,text,from&limit=5&access_token=${encodeURIComponent(token)}`;
  const cRes = await fetch(commentsUrl);
  const cJson = await cRes.json().catch(() => null);
  console.log("comments:", cRes.status, cJson?.error?.message || `items ${cJson?.data?.length || 0}`);
}
