import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase.js";

async function list() {
  const supabase = createAdminClient();
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Error listing users:", error);
    return;
  }
  console.log("--- AUTH USERS ---");
  console.table(users.map(u => ({ id: u.id, email: u.email })));
}

list().catch(console.error);
