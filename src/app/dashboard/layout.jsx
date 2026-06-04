import { createClient } from "@/lib/supabase";
import DashboardClientLayout from "./DashboardClientLayout";

export default async function DashboardLayout({ children }) {
  const supabase = createClient();
  let initialData = {
    session: null,
    workspaces: [],
    accounts: [],
    currentPlan: "free"
  };

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      initialData.session = session;

      // Parallel data fetching for workspaces, automations, and subscription plan
      const [workspacesRes, automationsRes, subscriptionRes] = await Promise.allSettled([
        supabase.from("workspaces").select("*").eq("user_id", session.user.id),
        supabase.from("automations").select("*").eq("user_id", session.user.id),
        supabase.from("subscriptions").select("plan_id").eq("user_id", session.user.id).single()
      ]);

      if (workspacesRes.status === "fulfilled" && workspacesRes.value.data) {
        initialData.workspaces = workspacesRes.value.data;
      }

      if (automationsRes.status === "fulfilled" && automationsRes.value.data) {
        initialData.accounts = automationsRes.value.data;
      }

      if (subscriptionRes.status === "fulfilled" && subscriptionRes.value.data) {
        initialData.currentPlan = subscriptionRes.value.data.plan_id;
      }
    }
  } catch (e) {
    // Graceful fallback if database read or session retrieval fails server-side
    console.error("DashboardLayout Server Hydration Error:", e);
  }

  return (
    <DashboardClientLayout initialData={initialData}>
      {children}
    </DashboardClientLayout>
  );
}
