"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import * as logger from "@/lib/logger";

const DashboardContext = createContext();

export function DashboardProvider({ children, initialData = null }) {
  const [user, setUser] = useState(initialData?.session?.user || null);
  const [allAccounts, setAllAccounts] = useState(initialData?.accounts || []);
  const [loading, setLoading] = useState(initialData?.session ? false : true);
  const [activeTab, setActiveTab] = useState("home");
  const [smartBioTab, setSmartBioTab] = useState("links");
  const [settingsTab, setSettingsTab] = useState("account");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(initialData?.currentPlan || "free");
  const [upgradeReason, setUpgradeReason] = useState("");

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [realtimeStats, setRealtimeStats] = useState({
    totalDms: 0,
    autoReplies: 0,
    engagementRate: "0%",
    followerGrowth: 0,
  });

  const accounts = allAccounts.filter(acc => acc != null && typeof acc === "object" && acc.id);

  useEffect(() => {
    logger.log("DashboardContext: Effect Started");
    const supabaseClient = createClient();

    const loadData = async (session) => {
      const isLocalDev = process.env.NODE_ENV === "development";

      if (isLocalDev && !session) {
        logger.log("DashboardContext: Injecting DEV Mock Data");
        setUser({ id: "dev-user-123", email: "admin@automixa.com", user_metadata: { full_name: "Admin" } });
        setAllAccounts([
          {
            id: "mock-account-1",
            user_id: "dev-user-123",
            ig_username: "automixa_hq",
            page_name: "Automixa Hub",
            profile_pic: "https://ui-avatars.com/api/?name=Automixa&background=6366f1&color=fff",
            is_active: true,
            persona: "business"
          }
        ]);
        setCurrentPlan("free");
        setLoading(false);
        return;
      }

      if (!session) {
        setLoading(false);
        return;
      }

      setUser(session.user);
      try {
        logger.log("DashboardContext: Fetching data for", session.user.id);

        const [accRes, subRes] = await Promise.allSettled([
          supabaseClient.from("automations").select("*").eq("user_id", session.user.id),
          supabaseClient.from("subscriptions").select("plan_id").eq("user_id", session.user.id).maybeSingle()
        ]);

        if (accRes.status === 'fulfilled' && accRes.value.data) {
          const accountsData = accRes.value.data;
          if (accountsData.length > 0) {
            setAllAccounts(accountsData);
          } else {
            setAllAccounts([]);
          }
        }

        if (subRes.status === 'fulfilled' && subRes.value.data) {
          setCurrentPlan(subRes.value.data.plan_id);
        } else {
          setCurrentPlan("free");
        }
      } catch (err) {
        logger.error("DashboardContext: Unexpected Fetch Error ->", err);
      } finally {
        setLoading(false);
      }
    };

    if (initialData?.session) {
      logger.log("DashboardContext: Hydrated using Server-side hydration data");
    } else {
      supabaseClient.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          logger.log("DashboardContext: Initial User Found");
          loadData({ user });
        } else {
          logger.log("DashboardContext: No Initial User. Checking Dev Bypass.");
          loadData(null); // Call loadData to allow dev mock injection
        }
      });
    }

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      logger.log("DashboardContext: Auth Event ->", event);
      if (session) {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          loadData(session);
        } else {
          setUser(session.user);
        }
      } else {
        const isLocalDev = process.env.NODE_ENV === "development";
        if (!isLocalDev) {
          setUser(null);
          setAllAccounts([]);
          setSelectedAccount(null);
          setLoading(false);
        }
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [initialData]);

  // Set selected account
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    } else if (accounts.length === 0 && selectedAccount !== null) {
      setSelectedAccount(null);
    }
  }, [allAccounts]);

  const value = {
    user,
    setUser,
    allAccounts,
    setAllAccounts,
    accounts,
    selectedAccount,
    setSelectedAccount,
    loading,
    setLoading,
    activeTab,
    setActiveTab,
    smartBioTab,
    setSmartBioTab,
    settingsTab,
    setSettingsTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    currentPlan,
    setCurrentPlan,
    upgradeReason,
    setUpgradeReason,
    realtimeStats,
    setRealtimeStats,

    updateSelectedAccount: async (updates) => {
      if (!selectedAccount) return;

      const previousAccount = { ...selectedAccount };
      const updatedAccount = { ...selectedAccount, ...updates };

      setSelectedAccount(updatedAccount);
      setAllAccounts(prev => prev.map(acc => acc.id === selectedAccount.id ? updatedAccount : acc));

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("automations")
          .update(updates)
          .eq("id", selectedAccount.id)
          .select()
          .single();

        if (error) {
          setSelectedAccount(previousAccount);
          setAllAccounts(prev => prev.map(acc => acc.id === selectedAccount.id ? previousAccount : acc));
          return { error };
        }

        if (data) {
          setSelectedAccount(data);
          setAllAccounts(prev => prev.map(acc => acc.id === data.id ? data : acc));
          return { data };
        }
      } catch (err) {
        setSelectedAccount(previousAccount);
        setAllAccounts(prev => prev.map(acc => acc.id === selectedAccount.id ? previousAccount : acc));
        return { error: err };
      }
    },

    disconnectAccount: async (accountId) => {
      if (!accountId) return { error: "No account selected" };
      try {
        const supabase = createClient();

        await supabase.from("triggers").delete().eq("automation_id", accountId);

        const { error } = await supabase.from("automations").delete().eq("id", accountId);

        if (error) return { error };

        setAllAccounts(prev => prev.filter(acc => acc.id !== accountId));
        setSelectedAccount(prev => prev?.id === accountId ? null : prev);

        return { success: true };
      } catch (err) {
        return { error: err };
      }
    }
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
}