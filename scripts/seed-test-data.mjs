/* scripts/seed-test-data.mjs */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Setup vars before imports
process.env.ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY ||
  "0000000000000000000000000000000000000000000000000000000000000000";

import { createAdminClient } from "../src/lib/supabase.js";
import { encryptToken } from "../src/lib/security.js";

async function seed() {
  const supabase = createAdminClient();
  const pageId = "PAGE_456";
  const automationId = "00ec7dea-42d5-4983-8ce9-402bbf79b2d4";

  console.log("Seeding Test Data for Simulation...");

  const payload = {
    id: automationId,
    page_id: pageId,
    name: "Automixa Demo",
    is_active: true,
    ai_enabled: true,
    brand_name: "Automixa Demo",
    access_token: encryptToken("dummy_token"),
  };

  let { error: autoError } = await supabase.from("automations").upsert(payload);

  if (
    autoError?.message &&
    /Could not find the 'brand_name' column|Could not find the 'ai_enabled' column/i.test(
      autoError.message
    )
  ) {
    const legacyPayload = { ...payload };
    delete legacyPayload.ai_enabled;
    delete legacyPayload.brand_name;
    ({ error: autoError } = await supabase.from("automations").upsert(legacyPayload));
  }

  if (autoError) console.error("Auto Error:", autoError);

  // Keep types compatible with older DB constraints (fallback to DM triggers in the engine)
  const triggers = [
    {
      automation_id: automationId,
      keyword: "SALE",
      type: "DM",
      response: "Use code SIMULATOR20 for 20% off! Link: https://automixa.io/buy",
    },
    {
      automation_id: automationId,
      keyword: "hello",
      type: "DM",
      response: "Hey there! How can I help you today?",
    },
    {
      automation_id: automationId,
      keyword: "*",
      type: "DM",
      response: "Thanks for commenting! Check your DM for more info.",
    },
    {
      automation_id: automationId,
      keyword: "DEFAULT",
      type: "DM",
      response: "You're awesome! Thanks for the tag! ❤️",
    },
  ];

  const { error: trigError } = await supabase.from("triggers").upsert(triggers);
  if (trigError) console.error("Trig Error:", trigError);

  console.log("Seeding Complete. Ready for simulator.");
}

seed().catch(console.error);

