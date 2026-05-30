"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const DashboardContext = createContext();

const THEME_COLORS = {
  "bg-indigo-600": {
    primary: "#6366F1",
    50: "#e0e7ff",
    100: "#c7d2fe",
    200: "#a5b4fc",
    300: "#818cf8",
    400: "#6366f1",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81"
  },
  "bg-rose-500": {
    primary: "#F43F5E",
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337"
  },
  "bg-emerald-500": {
    primary: "#10B981",
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b"
  },
  "bg-amber-500": {
    primary: "#F59E0B",
    50: "#fef3c7",
    100: "#fde68a",
    200: "#fcd34d",
    300: "#fbbf24",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f"
  },
  "bg-purple-600": {
    primary: "#9333EA",
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87"
  },
  "bg-sky-500": {
    primary: "#0EA5E9",
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e"
  }
};

export function DashboardProvider({ children }) {
  const [user, setUser] = useState(null);
  const [allAccounts, setAllAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [upgradeReason, setUpgradeReason] = useState("");
  
  // Workspaces State
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  
  // Collaboration / Team members state
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [workspaceMembersLoading, setWorkspaceMembersLoading] = useState(false);

  
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [realtimeStats, setRealtimeStats] = useState({
    totalDms: 0,
    autoReplies: 0,
    engagementRate: "0%",
    followerGrowth: 0,
  });

  // Derived filtered accounts based on active workspace
  const getAccountWorkspaceId = (account) => {
    if (account.workspace_id) return account.workspace_id;
    if (typeof window !== "undefined") {
      const localMappings = JSON.parse(localStorage.getItem("automixa_account_workspace_mappings") || "{}");
      return localMappings[account.id] || "personal";
    }
    return "personal";
  };

  const accounts = allAccounts.filter(acc => getAccountWorkspaceId(acc) === selectedWorkspace?.id);

  // Initialize and load workspaces & accounts
  useEffect(() => {
    console.log("DashboardContext: Effect Started");
    const supabaseClient = createClient();

    const loadData = async (session) => {
      if (!session) {
        setLoading(false);
        return;
      }

      setUser(session.user);
      try {
        console.log("DashboardContext: Fetching data for", session.user.id);
        
        // 0. Auto-accept pending workspace invites matching this user's email
        if (session.user.email) {
          try {
            const pendingRes = await supabaseClient
              .from("workspace_members")
              .select("*")
              .eq("email", session.user.email.trim().toLowerCase())
              .eq("status", "pending");

            if (pendingRes.data && pendingRes.data.length > 0) {
              console.log("DashboardContext: Accepting pending invites:", pendingRes.data.length);
              await Promise.all(
                pendingRes.data.map(invite =>
                  supabaseClient
                    .from("workspace_members")
                    .update({ status: "active", user_id: session.user.id })
                    .eq("id", invite.id)
                )
              );
            }
          } catch (e) {
            console.warn("DB Auto-accept invite check failed:", e);
          }
        }
        
        // 1. Fetch workspaces from DB (Owned and Shared/Collaborated)
        let workspacesData = [];
        try {
          // Fetch owned workspaces
          const wsRes = await supabaseClient.from("workspaces").select("*").eq("user_id", session.user.id);
          if (wsRes.data && wsRes.data.length > 0) {
            workspacesData = wsRes.data;
          }
          
          // Fetch shared workspaces
          const collabRes = await supabaseClient
            .from("workspace_members")
            .select("workspace_id")
            .eq("user_id", session.user.id)
            .eq("status", "active");

          if (collabRes.data && collabRes.data.length > 0) {
            const sharedIds = collabRes.data.map(c => c.workspace_id);
            const sharedRes = await supabaseClient
              .from("workspaces")
              .select("*")
              .in("id", sharedIds);

            if (sharedRes.data && sharedRes.data.length > 0) {
              const sharedWorkspaces = sharedRes.data.map(w => ({ ...w, is_shared: true }));
              workspacesData = [...workspacesData, ...sharedWorkspaces];
            }
          }
        } catch (e) {
          console.warn("DB Workspace fetch error, falling back to LocalStorage:", e);
        }


        // Local storage workspace fallback/sync
        if (workspacesData.length === 0) {
          const localWs = JSON.parse(localStorage.getItem("automixa_workspaces") || "[]");
          if (localWs.length === 0) {
            const defaultWs = [
              { id: "personal", name: "Personal Workspace", avatar_color: "bg-indigo-600", created_at: new Date().toISOString() }
            ];
            localStorage.setItem("automixa_workspaces", JSON.stringify(defaultWs));
            workspacesData = defaultWs;
          } else {
            workspacesData = localWs;
          }
        }
        
        setWorkspaces(workspacesData);

        // Active Workspace selection
        const activeWsId = localStorage.getItem("automixa_active_workspace_id");
        const foundWs = workspacesData.find(w => w.id === activeWsId) || workspacesData[0];
        setSelectedWorkspace(foundWs);
        if (foundWs) {
          localStorage.setItem("automixa_active_workspace_id", foundWs.id);
        }

        // 2. Fetch accounts and subscriptions separately
        const [accRes, subRes] = await Promise.allSettled([
          supabaseClient.from("automations").select("*").eq("user_id", session.user.id),
          supabaseClient.from("subscriptions").select("plan_id").eq("user_id", session.user.id).single()
        ]);

        if (accRes.status === 'fulfilled' && accRes.value.data) {
          const accountsData = accRes.value.data;
          setAllAccounts(accountsData);
        }

        if (subRes.status === 'fulfilled' && subRes.value.data) {
          setCurrentPlan(subRes.value.data.plan_id);
        } else {
          setCurrentPlan("free");
        }
      } catch (err) {
        console.error("DashboardContext: Unexpected Fetch Error ->", err);
      } finally {
        setLoading(false);
      }
    };

    // 1. Initial Session Check (Immediate)
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log("DashboardContext: Initial Session Found");
        loadData(session);
      } else {
        setTimeout(() => setLoading(false), 3000);
      }
    });

    // 2. Auth State Change Listener
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log("DashboardContext: Auth Event ->", event);
      if (session) {
        loadData(session);
      } else {
        setUser(null);
        setAllAccounts([]);
        setSelectedAccount(null);
        setWorkspaces([]);
        setSelectedWorkspace(null);
        setLoading(false);
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Update selected account when selectedWorkspace or allAccounts change
  useEffect(() => {
    let timer;
    if (selectedWorkspace) {
      const workspaceAccounts = allAccounts.filter(acc => getAccountWorkspaceId(acc) === selectedWorkspace.id);
      
      // If selectedAccount doesn't belong to the active workspace, switch to first account or null
      if (!selectedAccount || !workspaceAccounts.some(acc => acc.id === selectedAccount.id)) {
        timer = setTimeout(() => {
          setSelectedAccount(workspaceAccounts.length > 0 ? workspaceAccounts[0] : null);
        }, 0);
      }
    } else {
      if (selectedAccount !== null) {
        timer = setTimeout(() => {
          setSelectedAccount(null);
        }, 0);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [selectedWorkspace, allAccounts, selectedAccount]);

  // Apply dynamic color theme based on active workspace's selected color
  useEffect(() => {
    if (!selectedWorkspace || typeof window === "undefined") return;
    
    const colorKey = selectedWorkspace.avatar_color || "bg-indigo-600";
    const theme = THEME_COLORS[colorKey] || THEME_COLORS["bg-indigo-600"];
    const root = document.documentElement;

    // 1. Update the base indigo accent property used in custom CSS
    root.style.setProperty("--indigo-accent", theme.primary);

    // 2. Update Tailwind CSS v4 custom theme properties (instantly transforms all bg-indigo-*, text-indigo-* classes)
    root.style.setProperty("--color-indigo-50", theme[50]);
    root.style.setProperty("--color-indigo-100", theme[100]);
    root.style.setProperty("--color-indigo-200", theme[200]);
    root.style.setProperty("--color-indigo-300", theme[300]);
    root.style.setProperty("--color-indigo-400", theme[400]);
    root.style.setProperty("--color-indigo-500", theme[500]);
    root.style.setProperty("--color-indigo-600", theme[600]);
    root.style.setProperty("--color-indigo-700", theme[700]);
    root.style.setProperty("--color-indigo-800", theme[800]);
    root.style.setProperty("--color-indigo-900", theme[900]);

  }, [selectedWorkspace]);

  // Fetch workspace members when selectedWorkspace changes
  useEffect(() => {
    const loadMembers = async () => {
      if (!selectedWorkspace) {
        setWorkspaceMembers([]);
        return;
      }

      setWorkspaceMembersLoading(true);
      
      // Load local storage members first as fallback
      const localMembers = JSON.parse(localStorage.getItem("automixa_workspace_members") || "[]");
      const filteredLocal = localMembers.filter(m => m.workspace_id === selectedWorkspace.id);
      
      // If the workspace ID is a virtual string (like "personal") and not a valid UUID, do NOT query the database
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!UUID_REGEX.test(selectedWorkspace.id)) {
        setWorkspaceMembers([]);
        setWorkspaceMembersLoading(false);
        return;
      }

      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("workspace_members")
          .select("*")
          .eq("workspace_id", selectedWorkspace.id);

        if (data && !error) {
          setWorkspaceMembers(data);
          // Sync back to local storage
          const otherLocal = localMembers.filter(m => m.workspace_id !== selectedWorkspace.id);
          localStorage.setItem("automixa_workspace_members", JSON.stringify([...otherLocal, ...data]));
        } else {
          setWorkspaceMembers(filteredLocal);
        }
      } catch (err) {
        console.warn("DB load members failed, using local fallback:", err);
        setWorkspaceMembers(filteredLocal);
      } finally {
        setWorkspaceMembersLoading(false);
      }
    };

    loadMembers();
  }, [selectedWorkspace]);

  const inviteMember = async (workspaceId, email, role = "viewer") => {
    // 1. Local fallback
    const tempId = "mem_" + Math.random().toString(36).substring(2, 9);
    const newMember = {
      id: tempId,
      workspace_id: workspaceId,
      email: email.trim().toLowerCase(),
      role,
      status: "pending",
      created_at: new Date().toISOString()
    };

    setWorkspaceMembers(prev => [...prev, newMember]);
    
    const localMembers = JSON.parse(localStorage.getItem("automixa_workspace_members") || "[]");
    localStorage.setItem("automixa_workspace_members", JSON.stringify([...localMembers, newMember]));

    // 2. Trigger the server-side email invitation via Resend API
    fetch("/api/workspaces/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        workspaceName: workspaces.find(w => w.id === workspaceId)?.name || "a Workspace",
        invitedByEmail: user?.email || "Someone"
      })
    }).catch(err => console.warn("Failed to trigger server-side invite email:", err));

    // 3. DB Persistence
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_REGEX.test(workspaceId)) {
      console.warn("Bypassing DB persistence for virtual workspace invite");
      return { data: newMember };
    }

    const supabase = createClient();
    try {
      const { data, error } = await supabase.from("workspace_members").insert({
        workspace_id: workspaceId,
        email: email.trim().toLowerCase(),
        role,
        status: "pending",
        invited_by: user?.id
      }).select().single();

      if (data && !error) {
        setWorkspaceMembers(prev => prev.map(m => m.id === tempId ? data : m));
        const updatedLocal = JSON.parse(localStorage.getItem("automixa_workspace_members") || "[]")
          .map(m => m.id === tempId ? data : m);
        localStorage.setItem("automixa_workspace_members", JSON.stringify(updatedLocal));
        return { data };
      }
      return { error };
    } catch (err) {
      console.warn("DB Invite failed, relying on local fallback:", err);
      return { data: newMember };
    }
  };

  const removeMember = async (workspaceId, memberId) => {
    // 1. Local update
    setWorkspaceMembers(prev => prev.filter(m => m.id !== memberId));
    const localMembers = JSON.parse(localStorage.getItem("automixa_workspace_members") || "[]");
    localStorage.setItem("automixa_workspace_members", JSON.stringify(localMembers.filter(m => m.id !== memberId)));

    // 2. DB Update
    const supabase = createClient();
    try {
      await supabase.from("workspace_members").delete().eq("id", memberId);
    } catch (err) {
      console.warn("DB remove collaborator failed:", err);
    }
  };

  const updateMemberRole = async (workspaceId, memberId, newRole) => {
    // 1. Local update
    setWorkspaceMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    const localMembers = JSON.parse(localStorage.getItem("automixa_workspace_members") || "[]");
    localStorage.setItem("automixa_workspace_members", JSON.stringify(
      localMembers.map(m => m.id === memberId ? { ...m, role: newRole } : m)
    ));

    // 2. DB Update
    const supabase = createClient();
    try {
      await supabase.from("workspace_members").update({ role: newRole }).eq("id", memberId);
    } catch (err) {
      console.warn("DB role update failed:", err);
    }
  };

  const value = {
    user,
    setUser,
    allAccounts,
    setAllAccounts,
    workspaceMembers,
    workspaceMembersLoading,
    inviteMember,
    removeMember,
    updateMemberRole,

    accounts,
    selectedAccount,
    setSelectedAccount,
    loading,
    setLoading,
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    currentPlan,
    setCurrentPlan,
    upgradeReason,
    setUpgradeReason,
    realtimeStats,
    setRealtimeStats,
    
    // Workspaces
    workspaces,
    setWorkspaces,
    selectedWorkspace,
    setSelectedWorkspace: (ws) => {
      setSelectedWorkspace(ws);
      if (ws) localStorage.setItem("automixa_active_workspace_id", ws.id);
    },
    
    createWorkspace: async (name, color) => {
      const tempId = Math.random().toString(36).substring(2, 11);
      const newWs = {
        id: tempId,
        name,
        avatar_color: color || "bg-indigo-600",
        created_at: new Date().toISOString()
      };

      // 1. Optimistic Update (Local)
      const updated = [...workspaces, newWs];
      setWorkspaces(updated);
      localStorage.setItem("automixa_workspaces", JSON.stringify(updated));
      setSelectedWorkspace(newWs);
      localStorage.setItem("automixa_active_workspace_id", newWs.id);

      // 2. DB Persistence (Async)
      const supabase = createClient();
      if (user) {
        try {
          const { data, error } = await supabase.from("workspaces").insert({
            name,
            user_id: user.id,
            avatar_color: newWs.avatar_color
          }).select().single();
          
          if (data && !error) {
            setWorkspaces(prev => prev.map(w => w.id === tempId ? data : w));
            const currentLocal = JSON.parse(localStorage.getItem("automixa_workspaces") || "[]");
            const replacedLocal = currentLocal.map(w => w.id === tempId ? data : w);
            localStorage.setItem("automixa_workspaces", JSON.stringify(replacedLocal));
            setSelectedWorkspace(data);
            localStorage.setItem("automixa_active_workspace_id", data.id);
            return data;
          }
        } catch (e) {
          console.warn("DB Workspace save failed (using local fallback):", e);
        }
      }
      return newWs;
    },
    
    renameWorkspace: async (id, newName) => {
      setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, name: newName } : w));
      const current = JSON.parse(localStorage.getItem("automixa_workspaces") || "[]");
      const updated = current.map(w => w.id === id ? { ...w, name: newName } : w);
      localStorage.setItem("automixa_workspaces", JSON.stringify(updated));
      if (selectedWorkspace?.id === id) {
        setSelectedWorkspace(prev => ({ ...prev, name: newName }));
      }

      const supabase = createClient();
      try {
        await supabase.from("workspaces").update({ name: newName }).eq("id", id);
      } catch (e) {
        console.warn("DB Workspace rename failed:", e);
      }
    },
    
    deleteWorkspace: async (id) => {
      if (id === "personal") return;
      
      const newWorkspaces = workspaces.filter(w => w.id !== id);
      setWorkspaces(newWorkspaces);
      localStorage.setItem("automixa_workspaces", JSON.stringify(newWorkspaces));

      if (selectedWorkspace?.id === id) {
        const personalWs = workspaces.find(w => w.id === "personal") || workspaces[0];
        setSelectedWorkspace(personalWs);
        localStorage.setItem("automixa_active_workspace_id", personalWs?.id || "");
      }

      // Re-map accounts belonging to deleted workspace back to personal workspace
      allAccounts.forEach(acc => {
        if (getAccountWorkspaceId(acc) === id) {
          const localMappings = JSON.parse(localStorage.getItem("automixa_account_workspace_mappings") || "{}");
          localMappings[acc.id] = "personal";
          localStorage.setItem("automixa_account_workspace_mappings", JSON.stringify(localMappings));
        }
      });
      setAllAccounts(prev => prev.map(acc => getAccountWorkspaceId(acc) === id ? { ...acc, workspace_id: "personal" } : acc));

      const supabase = createClient();
      try {
        await supabase.from("workspaces").delete().eq("id", id);
      } catch (e) {
        console.warn("DB Workspace delete failed:", e);
      }
    },

    linkAccountToWorkspace: async (accountId, workspaceId) => {
      const localMappings = JSON.parse(localStorage.getItem("automixa_account_workspace_mappings") || "{}");
      localMappings[accountId] = workspaceId;
      localStorage.setItem("automixa_account_workspace_mappings", JSON.stringify(localMappings));

      setAllAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, workspace_id: workspaceId } : acc));

      const supabase = createClient();
      try {
        const dbWorkspaceId = workspaceId === "personal" ? null : workspaceId;
        const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (dbWorkspaceId === null || UUID_REGEX.test(dbWorkspaceId)) {
          await supabase.from("automations").update({ workspace_id: dbWorkspaceId }).eq("id", accountId);
        }
      } catch (e) {
        console.warn("DB Account Workspace link failed:", e);
      }
    },

    updateSelectedAccount: async (updates) => {
      if (!selectedAccount) return;
      
      // 1. Optimistic Update
      const previousAccount = { ...selectedAccount };
      const updatedAccount = { ...selectedAccount, ...updates };
      
      setSelectedAccount(updatedAccount);
      setAllAccounts(prev => prev.map(acc => acc.id === selectedAccount.id ? updatedAccount : acc));

      try {
        console.log("DashboardContext: Updating account", selectedAccount.id, updates);
        const supabase = createClient();

        const { data, error } = await supabase
          .from("automations")
          .update(updates)
          .eq("id", selectedAccount.id)
          .select()
          .single();

        if (error) {
          console.error("DashboardContext: Update Error ->", error.message);
          setSelectedAccount(previousAccount);
          setAllAccounts(prev => prev.map(acc => acc.id === selectedAccount.id ? previousAccount : acc));
          return { error };
        }

        if (data) {
          console.log("DashboardContext: Update Success ->", data.is_active);
          setSelectedAccount(data);
          setAllAccounts(prev => prev.map(acc => acc.id === data.id ? data : acc));
          return { data };
        }
      } catch (err) {
        console.error("DashboardContext: Unexpected Update Error ->", err);
        setSelectedAccount(previousAccount);
        setAllAccounts(prev => prev.map(acc => acc.id === selectedAccount.id ? previousAccount : acc));
        return { error: err };
      }
    },

    disconnectAccount: async (accountId) => {
      if (!accountId) return { error: "No account selected" };
      try {
        console.log("DashboardContext: Disconnecting account", accountId);
        const supabase = createClient();
        const { error } = await supabase
          .from("automations")
          .delete()
          .eq("id", accountId);

        if (error) {
          console.error("DashboardContext: Disconnect Error ->", error.message);
          return { error };
        }

        // Update local list of accounts
        setAllAccounts(prev => prev.filter(acc => acc.id !== accountId));
        return { success: true };
      } catch (err) {
        console.error("DashboardContext: Unexpected Disconnect Error ->", err);
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
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
