import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase.js";
import { encryptToken } from "../src/lib/security.js";

async function persist() {
  const supabase = createAdminClient();
  const userId = "5de676f1-ea54-414f-93fd-cb7cdd678cc6";
  const automationId = "ffffffff-ffff-ffff-ffff-ffffffffffff";

  console.log("Persisting Test Account to Database...");

  const payload = {
    id: automationId,
    user_id: userId,
    page_id: "test_page",
    page_name: "Fluxy Test Account",
    ig_business_id: "test_ig",
    access_token: encryptToken("dummy_token"),
    is_active: true,
    ai_enabled: true,
    brand_name: "Fluxy Creator",
    persona: "content_creator",
    metadata: { tone: "Friendly" }
  };

  const { error } = await supabase.from("automations").upsert(payload);

  if (error) {
    console.error("Upsert Error:", error);
    return;
  }

  console.log("Success! Test account is now in the database.");
}

persist().catch(console.error);
