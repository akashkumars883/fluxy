"use client";

import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
  AlertCircle,
  BarChart2,
  CheckCircle2,
  Cpu,
  Download,
  Home,
  Link2,
  Lock as LucideLock,
  Plus,
  Settings,
  Sparkles,
  Users,
  Package
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Components
import AccountSettingsModal from "@/components/dashboard/AccountSettingsModal";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import AudienceCRM from "@/components/dashboard/AudienceCRM";
import BottomNav from "@/components/dashboard/BottomNav";
import CreatorOverview from "@/components/dashboard/CreatorOverview";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import EditTriggerModal from "@/components/dashboard/EditTriggerModal";
import HelpSlider from "@/components/dashboard/HelpSlider";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import OnboardingModal from "@/components/dashboard/OnboardingModal";
import PartnerDashboard from "@/components/dashboard/PartnerDashboard";
import PwaInstallBanner from "@/components/dashboard/PwaInstallBanner";
import SettingsDashboard from "@/components/dashboard/SettingsDashboard";
import SmartBio from "@/components/dashboard/SmartBio";
import StoreManager from "@/components/dashboard/StoreManager";
import SubscriptionModal from "@/components/dashboard/SubscriptionModal";
import { CampaignBuilderWorkspace,TriggerInputModal,TriggerList } from "@/components/dashboard/TriggerManager";
import Loader from "@/components/ui/Loader";


// Context
import { useDashboard } from "@/context/DashboardContext";

function getInitialOnboardingState() {
  if (typeof window === "undefined") {
    return { showOnboarding: false, onboardingStep: 1, connectedAccount: null };
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get("success") === "instagram_connected") {
    return {
      showOnboarding: true,
      onboardingStep: 4,
      connectedAccount: {
        username: params.get("account") || "instagram",
        igBusinessId: params.get("ig") || "",
      },
    };
  }
  return {
    showOnboarding: params.get("start") === "onboarding",
    onboardingStep: 1,
    connectedAccount: null,
  };
}

export default function Dashboard() {
  const {
    user,
    accounts,
    selectedAccount,
    loading,
    activeTab,
    setActiveTab,
    currentPlan,
    realtimeStats,
    setRealtimeStats,
    updateSelectedAccount,
    upgradeReason,
    setUpgradeReason,
  } = useDashboard();

  const router = useRouter();
  const initialOnboardingState = getInitialOnboardingState();
  const [showOnboarding, setShowOnboarding] = useState(initialOnboardingState.showOnboarding);
  const [onboardingStep, setOnboardingStep] = useState(initialOnboardingState.onboardingStep);
  const [connectedAccount, setConnectedAccount] = useState(initialOnboardingState.connectedAccount);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [realtimeHistory, setRealtimeHistory] = useState([]);
  const [realtimeTriggers, setRealtimeTriggers] = useState([]);
  const [triggersList, setTriggersList] = useState([]);
  const [instagramMedia, setInstagramMedia] = useState([]);
  const [instagramStories, setInstagramStories] = useState([]);

  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState(null);
  const [builderActive, setBuilderActive] = useState(false);
  const [builderCampaignName, setBuilderCampaignName] = useState("");
  const [builderTemplateKey, setBuilderTemplateKey] = useState("custom");
  const [timeRange, setTimeRange] = useState("all");
  const [partnerAppStatus, setPartnerAppStatus] = useState("approved");
  const [partnerActiveTier, setPartnerActiveTier] = useState("silver");
  const [partnerCommissionRate, setPartnerCommissionRate] = useState("15");
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    const syncStatus = () => {
      const savedStatus = localStorage.getItem("partner_app_status");
      if (savedStatus) {
        setPartnerAppStatus(savedStatus);
      }
      const savedTier = localStorage.getItem("partner_active_tier");
      if (savedTier) {
        setPartnerActiveTier(savedTier);
      }
      const savedRate = localStorage.getItem("partner_commission_rate");
      if (savedRate) {
        setPartnerCommissionRate(savedRate);
      }
    };
    syncStatus();
    window.addEventListener("partner_status_updated", syncStatus);
    window.addEventListener("storage", syncStatus);
    return () => {
      window.removeEventListener("partner_status_updated", syncStatus);
      window.removeEventListener("storage", syncStatus);
    };
  }, [activeTab]);

  useEffect(() => {
    const syncSaved = () => {
      setSettingsSaved(localStorage.getItem("settings_saved") === "true");
    };
    syncSaved();
    window.addEventListener("settings_saved_updated", syncSaved);
    return () => {
      window.removeEventListener("settings_saved_updated", syncSaved);
    };
  }, []);

  // Sync initial onboarding state on URL parameter changes
  useEffect(() => {
    if (initialOnboardingState.connectedAccount) {
      setTimeout(() => setConnectedAccount(initialOnboardingState.connectedAccount), 0);
    }
    if (initialOnboardingState.showOnboarding) {
      setTimeout(() => {
        setShowOnboarding(true);
        setOnboardingStep(initialOnboardingState.onboardingStep);
      }, 0);
    }
  }, [initialOnboardingState.connectedAccount, initialOnboardingState.showOnboarding, initialOnboardingState.onboardingStep]);

  // Set dynamic document title based on active tab
  useEffect(() => {
    const tabLabels = {
      home: selectedAccount ? "Overview" : "Home",
      automations: "Automations",
      audience: "Audience",
      analytics: "Analytics",
      partner: "Partner Program",
      settings: "Settings"
    };
    const tabName = tabLabels[activeTab] || activeTab;
    document.title = `${tabName} | Automixa Dashboard`;
  }, [activeTab, selectedAccount]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let shouldClean = false;

    const tabParam = params.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
      shouldClean = true;
    }

    if (params.get("upgrade")) {
      setTimeout(() => setIsSubscriptionOpen(true), 0);
      shouldClean = true;
    }
    if (params.get("success") === "instagram_connected") {
      shouldClean = true;
    }
    if (shouldClean) {
      // Clean up the URL completely to prevent repeat alerts/modals on refresh
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [setActiveTab]);

  useEffect(() => {
    const supabase = createClient();
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (selectedAccount && UUID_REGEX.test(selectedAccount.id)) {
      async function fetchAccountData() {
        try {
          const results = await Promise.allSettled([
            supabase.from("automation_history").select("*", { count: 'exact', head: true }).eq("automation_id", selectedAccount.id).eq("status", "SUCCESS"),
            supabase.from("automation_history").select("*", { count: 'exact', head: true }).eq("automation_id", selectedAccount.id).eq("type", "COMMENT"),
            supabase.from("automation_history").select("*", { count: 'exact', head: true }).eq("automation_id", selectedAccount.id),
            supabase.from("automation_history").select("*").eq("automation_id", selectedAccount.id).order("created_at", { ascending: false }).limit(100),
            supabase.from("triggers").select("*").eq("automation_id", selectedAccount.id).order("created_at", { ascending: false })
          ]);

          const [dmRes, commentRes, totalRes, historyRes, triggersRes] = results;

          const dmCount = dmRes.status === 'fulfilled' ? dmRes.value.count : 0;
          const commentCount = commentRes.status === 'fulfilled' ? commentRes.value.count : 0;
          const triggerCount = totalRes.status === 'fulfilled' ? totalRes.value.count : 0;
          const historyData = historyRes.status === 'fulfilled' ? historyRes.value.data : [];
          const triggersData = triggersRes.status === 'fulfilled' ? triggersRes.value.data : [];

          setRealtimeStats({
            totalDms: dmCount || 0,
            autoReplies: commentCount || 0,
            engagementRate: triggerCount > 0 ? "100%" : "0%",
            followerGrowth: triggerCount || 0,
          });

          if (historyData) setRealtimeHistory(historyData);
          if (triggersData) {
            setTriggersList(triggersData);
            const triggersWithCounts = triggersData.map(t => ({
              ...t,
              count: (historyData || []).filter(h => h.keyword === t.keyword || h.trigger_id === t.id).length
            })).sort((a, b) => b.count - a.count);
            setRealtimeTriggers(triggersWithCounts);
          }

          if (selectedAccount.id) {
             try {
               const res = await fetch(`/api/media?automationId=${selectedAccount.id}`);
               const mediaRes = await res.json();
               if (mediaRes) {
                  if (mediaRes.media) setInstagramMedia(mediaRes.media);
                  if (mediaRes.stories) setInstagramStories(mediaRes.stories);
                }
             } catch (err) {
               console.warn("Dashboard: Media fetch failed ->", err.message);
             }
          }
        } catch (e) {
          console.error("Dashboard: Data Sync Error ->", e.message);
        }
      }
      fetchAccountData();

    // Set up real-time listeners for updates
    const historyChannel = supabase
      .channel('realtime-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'automation_history'
      }, (payload) => {
        console.log('Realtime History Update:', payload);
        const autoId = payload.new?.automation_id || payload.old?.automation_id;
        if (autoId === selectedAccount.id) {
          fetchAccountData(); // Refresh everything when history changes
        }
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'triggers'
      }, (payload) => {
        console.log('Realtime Trigger Update:', payload);
        const autoId = payload.new?.automation_id || payload.old?.automation_id;
        if (autoId === selectedAccount.id) {
          fetchAccountData(); // Refresh when triggers change
        }
      })
      .subscribe((status) => {
        console.log('Supabase Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(historyChannel);
    };
    }
  }, [selectedAccount, setRealtimeStats]);

  const handleCreateTriggerStart = (templateId = "custom", title = "New Campaign") => {
    if (currentPlan === "free" && triggersList.length >= 5) {
      setIsCreateModalOpen(false);
      setIsSubscriptionOpen(true);
      return;
    }
    setBuilderTemplateKey(templateId);
    setBuilderCampaignName(title);
    setIsCreateModalOpen(false);
    setBuilderActive(true);
  };

  const handleAddTrigger = async (keyword, response, options = {}) => {
    if (currentPlan === "free" && triggersList.length >= 5) {
      setIsSubscriptionOpen(true);
      return;
    }

    const triggerPayload = {
      automation_id: selectedAccount.id,
      keyword: keyword.trim().toUpperCase(),
      response: response.trim(),
      type: options.type || "COMMENT",
      metadata: { 
        campaign_name: options.campaign_name || "Custom Flow ⚡",
        follower_gate: options.follower_gate || false,
        cooldown_gate: options.cooldownGate || options.cooldown_gate || false,
        button_text: options.button_text || "",
        button_link: options.button_link || ""
      },
      variants: {
        dm: [response.trim()],
        public: options.public_reply ? [options.public_reply.trim()] : []
      }
    };

    try {
      const res = await fetch("/api/triggers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(triggerPayload)
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          setIsSubscriptionOpen(true);
          return;
        }
        throw new Error(result.error || result.message || "Failed to create trigger");
      }

      if (result.success && result.trigger) {
        setTriggersList(prev => [result.trigger, ...prev]);
        setBuilderActive(false);
      }
    } catch (err) {
      console.error("Error adding trigger:", err);
      toast.error(err.message || "Failed to save trigger. Please try again.");
    }
  };

  const handleDeleteTrigger = async (id) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("triggers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setTriggersList(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Error deleting trigger:", err);
    }
  };

  const handleSaveTrigger = async (id, updatedFields) => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("triggers")
        .update(updatedFields)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setTriggersList(prev => prev.map(t => t.id === id ? data : t));
        setIsEditModalOpen(false);
        // Refresh account data to sync counts and lists
        window.dispatchEvent(new Event("refresh_dashboard_data"));
      }
    } catch (err) {
      console.error("Error updating trigger:", err);
      toast.error("Failed to update rule: " + err.message);
    }
  };

  const handleToggleTriggerActive = async (triggerId, currentIsActive) => {
    const trigger = triggersList.find(t => t.id === triggerId);
    if (!trigger) return;
    
    const updatedMetadata = {
      ...(trigger.metadata || {}),
      is_active: !currentIsActive
    };
    
    await handleSaveTrigger(triggerId, { metadata: updatedMetadata });
  };


  const handleExportAnalytics = () => {
    const campaigns = (triggersList || []).map(trigger => {
      const triggerHistory = (realtimeHistory || []).filter(h => h.keyword === trigger.keyword || h.trigger_id === trigger.id);
      const sentCount = triggerHistory.length;
      const triggerContacts = new Set(triggerHistory.map(h => h.sender_id)).size;
      
      return {
        name: trigger.metadata?.campaign_name || trigger.name || "Custom Flow ⚡",
        keyword: trigger.keyword,
        sent: sentCount.toLocaleString(),
        contacts: triggerContacts.toLocaleString()
      };
    });

    const headers = "Campaign Name,KeywordTriggered,MessagesSent,ContactsCaptured\n";
    const content = campaigns.map(c => `"${c.name}",${c.keyword},"${c.sent}","${c.contacts}"`).join("\n");
    const blob = new Blob([headers + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `automixa_overview_${timeRange}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConnectClick = () => {
    if (currentPlan === "free" && allAccounts.length >= 1) {
      setUpgradeReason("multiple_accounts");
      setIsSubscriptionOpen(true);
      return;
    }
    setOnboardingStep(user?.user_metadata?.onboarding_completed ? 3 : 1);
    setShowOnboarding(true);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <Loader fullScreen text="Loading Dashboard..." />;

  const navigationItems = [
    { id: "home", label: selectedAccount ? "Overview" : "Home", icon: Home, reqPlan: "free" },
    { id: "automations", label: "Automations", icon: Cpu, reqPlan: "free" },
    { id: "audience", label: "Audience", icon: Users, reqPlan: "free" },
    { id: "store", label: "Mini Store", icon: Package, reqPlan: "creator_pro" },
    { id: "smart_bio", label: "Smart Bio", icon: Link2, reqPlan: "creator_pro" },
    { id: "analytics", label: "Analytics", icon: BarChart2, reqPlan: "free" },
    { id: "partner", label: "Partner Program", icon: Sparkles, reqPlan: "free" },
    { id: "settings", label: "Settings", icon: Settings, reqPlan: "free" },
  ].map(item => {
    // Agar account connected nahi hai, toh Home ke alawa sab lock
    if (!selectedAccount) {
      return {
        ...item,
        locked: item.id !== "home"
      };
    }
    
    const planHierarchy = {
      "free": 0,
      "creator_pro": 1,
      "viral_scale": 2
    };
    
    const userPlanLevel = planHierarchy[currentPlan] || 0;
    const reqPlanLevel = planHierarchy[item.reqPlan] || 0;
    
    const isLockedByPlan = userPlanLevel < reqPlanLevel;
    
    return {
      ...item,
      locked: isLockedByPlan
    };
  });

  const maxQuota = currentPlan === "viral_scale" ? 50000 : currentPlan === "creator_pro" ? 15000 : 1000;
  const usedQuota = realtimeStats?.autoReplies || 0;
  const quotaPercent = Math.min(100, Math.round((usedQuota / maxQuota) * 100));

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F7] relative overflow-hidden selection:bg-[#6366F1]/10 selection:text-[#6366F1]">
      <DashboardNavbar 
        isScrolled={isScrolled}
        onHelpClick={() => setIsHelpOpen(true)} 
        accounts={accounts} 
        realtimeStats={realtimeStats}
        onAccountSettingsClick={() => setIsAccountSettingsOpen(true)}
        onSubscriptionClick={(reason) => {
          setUpgradeReason(typeof reason === 'string' ? reason : "");
          setIsSubscriptionOpen(true);
        }}
      />

      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
        navigationItems={navigationItems}
        onPricingClick={(reason) => {
          setUpgradeReason(typeof reason === 'string' ? reason : "");
          setIsSubscriptionOpen(true);
        }}
        onConnectClick={handleConnectClick}
        quotaPercent={quotaPercent}
        usedQuota={usedQuota}
        maxQuota={maxQuota}
      />

      <div className="flex flex-1 relative overflow-hidden">
        <DashboardSidebar 
          navigationItems={navigationItems}
          onPricingClick={(reason) => {
            setUpgradeReason(typeof reason === 'string' ? reason : "");
            setIsSubscriptionOpen(true);
          }}
          onConnectClick={handleConnectClick}
          quotaPercent={quotaPercent}
          usedQuota={usedQuota}
          maxQuota={maxQuota}
        />

        <main 
          onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
          className="flex-1 p-2 sm:p-4 lg:p-5 max-w-8xl mx-auto w-full flex flex-col min-h-0 overflow-hidden pb-24 md:pb-10"
        >
          {selectedAccount ? (
            <div className="flex flex-col flex-1 min-h-0 space-y-4 overflow-hidden">
              {/* === COMPACT PAGE HEADER === */}
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-200/60 shrink-0">
                
                {/* Left: Title + inline account badge */}
                <div className="flex items-center gap-3 min-w-0">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
                        {activeTab === "home" ? "Overview"
                          : activeTab === "automations" ? "Automations"
                          : activeTab === "audience" ? "Audience"
                          : activeTab === "store" ? "Mini Store"
                          : activeTab === "smart_bio" ? "Smart Bio"
                          : activeTab === "crm" ? "CRM"
                          : activeTab === "analytics" ? "Analytics"
                          : activeTab === "settings" ? "Settings"
                          : activeTab === "partner" ? "Partner Program"
                          : activeTab}
                      </h1>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                        (selectedAccount.persona || "content_creator") === "content_creator"
                          ? "bg-purple-50 text-purple-600 border-purple-200"
                          : "bg-blue-50 text-blue-600 border-blue-200"
                      }`}>
                        {(selectedAccount.persona || "content_creator") === "content_creator" ? "Creator" : "Business"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5 truncate">
                      @{selectedAccount.ig_username || selectedAccount.name || selectedAccount.page_name || "automixa_user"}
                    </p>
                  </div>
                </div>

                {/* Right: Contextual Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {(activeTab === "audience" || activeTab === "crm") && (
                    <button
                      onClick={() => window.dispatchEvent(new Event("export_audience_csv"))}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${currentPlan === "free" ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed" : "bg-[#6366F1] hover:bg-[#4f46e5] text-white border-transparent shadow-sm hover:scale-[1.02] shadow-[#6366F1]/10"}`}
                    >
                      <Download size={13} />
                      <span>Export CSV</span>
                      {currentPlan === "free" && <LucideLock size={11} />}
                    </button>
                  )}

                  {activeTab === "analytics" && (
                    <div className="flex items-center gap-2">
                      <div className="bg-white border border-zinc-200 rounded-xl p-1 flex items-center shadow-sm">
                        {[
                          { id: "7d", label: "7d" },
                          { id: "30d", label: "30d" },
                          { id: "all", label: "All" }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setTimeRange(t.id)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
                              timeRange === t.id ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-800"
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={handleExportAnalytics}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#6366F1] hover:bg-[#4f46e5] text-white text-xs font-semibold rounded-xl shadow-sm transition-all hover:scale-[1.02] shadow-[#6366F1]/10 shrink-0"
                      >
                        <Download size={13} /> Export
                      </button>
                    </div>
                  )}

                  {activeTab === "home" && (
                    <button
                      onClick={() => updateSelectedAccount({ is_active: !selectedAccount.is_active })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${selectedAccount?.is_active ? "bg-emerald-50 border-emerald-200/80 text-emerald-700 hover:bg-emerald-100/30" : "bg-rose-50 border-rose-200/80 text-rose-600 hover:bg-rose-100/30"}`}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedAccount?.is_active ? "bg-emerald-400" : "bg-rose-400"}`} />
                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${selectedAccount?.is_active ? "bg-emerald-600" : "bg-rose-600"}`} />
                      </span>
                      {selectedAccount?.is_active ? "Shield Active" : "System Paused"}
                    </button>
                  )}

                  {activeTab === "automations" && !builderActive && (
                    <>
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#6366F1] hover:bg-[#4f46e5] text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] shadow-[#6366F1]/10"
                      >
                        <Plus size={14} strokeWidth={2.5} /> New Campaign
                      </button>
                    </>
                  )}

                  {activeTab === "partner" && partnerAppStatus === "approved" && (
                    <span className="px-3 py-1.5 bg-zinc-950 text-white font-bold text-[10px] rounded-xl uppercase tracking-wider border border-zinc-800">
                      {partnerActiveTier} · {partnerCommissionRate}% Commission
                    </span>
                  )}

                  {activeTab === "settings" && (
                    <button
                      onClick={() => window.dispatchEvent(new Event("save_settings"))}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#6366F1] hover:bg-[#4f46e5] text-white text-xs font-semibold rounded-xl shadow-sm transition-all hover:scale-[1.02] shadow-[#6366F1]/10 shrink-0"
                    >
                      {settingsSaved && <CheckCircle2 size={13} className="text-emerald-400" />}
                      {settingsSaved ? "Saved!" : "Save Changes"}
                    </button>
                  )}
                </div>
              </div>

              {/* === DYNAMIC ERROR / WARNING BANNER === */}
              {(!selectedAccount?.is_active || usedQuota >= maxQuota) && (
                <div className="shrink-0 animate-in slide-in-from-top-4 duration-300">
                  {!selectedAccount?.is_active ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-amber-50 border border-amber-200/60 rounded-2xl shadow-sm text-amber-800">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                          <AlertCircle size={18} className="animate-pulse" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold leading-snug">System Paused</p>
                          <p className="text-[11px] sm:text-xs text-amber-600/90 mt-0.5 font-medium leading-relaxed">
                            Your automation shield is currently paused. No auto-replies or direct messages are being processed.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateSelectedAccount({ is_active: true })}
                        className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all hover:scale-[1.02] shrink-0"
                      >
                        Activate Shield
                      </button>
                    </div>
                  ) : usedQuota >= maxQuota ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-rose-50 border border-rose-200/60 rounded-2xl shadow-sm text-rose-800">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                          <AlertCircle size={18} className="animate-pulse" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold leading-snug">Quota Limit Exceeded</p>
                          <p className="text-[11px] sm:text-xs text-rose-600/90 mt-0.5 font-medium leading-relaxed">
                            You have reached your Free plan limit of {maxQuota.toLocaleString()} monthly replies. Automations will remain blocked until you upgrade.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setUpgradeReason("automation_limit");
                          setIsSubscriptionOpen(true);
                        }}
                        className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all hover:scale-[1.02] shrink-0"
                      >
                        Upgrade Now
                      </button>
                    </div>
                  ) : null}
                </div>
              )}

              {activeTab === "home" && (
                <div 
                  onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                  className="flex-1 min-h-0 overflow-y-auto pr-1"
                >
                  <CreatorOverview 
                    stats={realtimeStats} 
                    history={realtimeHistory} 
                    topTriggers={realtimeTriggers} 
                    automationId={selectedAccount?.id}
                    currentPlan={currentPlan}
                    onUpgradeClick={(reason) => {
                      setUpgradeReason(reason || "general");
                      setIsSubscriptionOpen(true);
                    }}
                    isActive={selectedAccount?.is_active}
                    onToggleTriggerActive={handleToggleTriggerActive}
                    onViewAudience={() => setActiveTab("audience")}
                    onCreateAutoReply={() => {
                      setActiveTab("automations");
                      setIsCreateModalOpen(true);
                    }}
                  />
                </div>
              )}
              
              {activeTab === "automations" && (
                <div 
                  onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                  className="flex-1 min-h-0 overflow-y-auto pr-1"
                >
                  {builderActive ? (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                      <CampaignBuilderWorkspace 
                        stories={instagramStories}
                        automation={selectedAccount}
                        templateKey={builderTemplateKey} 
                        campaignName={builderCampaignName}
                        currentPlan={currentPlan}
                        onUpgradeClick={(reason) => {
                          setUpgradeReason(reason || "general");
                          setIsSubscriptionOpen(true);
                        }}
                        media={instagramMedia}
                        onPublish={handleAddTrigger} 
                        onClose={() => setBuilderActive(false)} 
                      />
                    </div>
                  ) : (
                    <TriggerList 
                      triggers={triggersList} 
                      isMasterActive={selectedAccount?.is_active}
                      onCreateNew={() => setIsCreateModalOpen(true)} 
                      onEdit={(t) => {
                        setEditingTrigger(t);
                        setIsEditModalOpen(true);
                      }}
                      onDelete={handleDeleteTrigger}
                      onToggleActive={handleToggleTriggerActive}
                    />
                  )}
                </div>
              )}

              {activeTab === "audience" && (
                <div 
                  onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                  className="flex-1 min-h-0 overflow-y-auto pr-1"
                >
                  <AudienceCRM accountId={selectedAccount.id} history={realtimeHistory} currentPlan={currentPlan} />
                </div>
              )}
              {activeTab === "store" && (
                <div 
                  onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                  className="flex-1 min-h-0 overflow-y-auto pr-1"
                >
                  <StoreManager accountId={selectedAccount.id} currentPlan={currentPlan} onUpgradeClick={() => {
                    setUpgradeReason("mini_store");
                    setIsSubscriptionOpen(true);
                  }} />
                </div>
              )}
              {activeTab === "smart_bio" && (
                <div 
                  onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                  className="flex-1 min-h-0 overflow-y-auto pr-1"
                >
                  <SmartBio accountId={selectedAccount.id} account={selectedAccount} currentPlan={currentPlan} onUpgradeClick={() => {
                    setUpgradeReason("smart_bio");
                    setIsSubscriptionOpen(true);
                  }} />
                </div>
              )}
              {activeTab === "crm" && (
                <div 
                  onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                  className="flex-1 min-h-0 overflow-y-auto pr-1"
                >
                  <AudienceCRM accountId={selectedAccount.id} history={realtimeHistory} currentPlan={currentPlan} />
                </div>
              )}
              {activeTab === "analytics" && (
                <div 
                  onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                  className="flex-1 min-h-0 overflow-y-auto pr-1"
                >
                  <AnalyticsDashboard account={selectedAccount} realtimeStats={realtimeStats} history={realtimeHistory} triggers={triggersList} />
                </div>
              )}
              {activeTab === "settings" && (
                <div 
                  onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                  className="flex-1 min-h-0 overflow-y-auto pr-1"
                >
                  <SettingsDashboard account={selectedAccount} currentPlan={currentPlan} realtimeStats={realtimeStats} onSubscriptionClick={() => {
                    setUpgradeReason("");
                    setIsSubscriptionOpen(true);
                  }} />
                </div>
              )}

              {activeTab === "partner" && (
                <div 
                  onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                  className="flex-1 min-h-0 overflow-y-auto pr-1"
                >
                  <PartnerDashboard currentPlan={currentPlan} />
                </div>
              )}
            </div>
          ) : (
            <div 
              onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
              className="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] overflow-y-auto"
            >
              {(!currentPlan || currentPlan === "free" || currentPlan?.name?.toLowerCase() === "free") && (
                <div className="relative rounded-2xl p-4 sm:p-5 text-white shadow-xl mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 overflow-hidden group">
                  <div className="absolute inset-0 z-0">
                    <img src="/images/upgrade_banner_bg.png" alt="Premium Background" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1]/80 via-purple-900/40 to-transparent mix-blend-overlay" />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm"><Sparkles size={20} /></div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold leading-tight drop-shadow-md">Upgrade to Automixa Pro</h3>
                      <p className="text-white/90 text-xs sm:text-sm mt-0.5 font-medium drop-shadow-sm">Unlock unlimited automations and advanced features.</p>
                    </div>
                  </div>
                  <button onClick={() => {
                    setUpgradeReason("");
                    setIsSubscriptionOpen(true);
                  }} className="w-full sm:w-auto px-6 py-2.5 bg-white text-[#6366F1] text-sm font-bold rounded-xl shadow-[0_8px_30px_-8px_rgba(0,0,0,0.5)] hover:scale-105 transition-all relative z-10">
                    Upgrade Now
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/50 pb-4 sm:pb-6 shrink-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2 text-zinc-950">
                    Welcome to Automixa
                  </h1>
                  <p className="text-zinc-500 text-xs sm:text-sm font-normal">
                    Connect your Facebook or Instagram account to activate features.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={handleConnectClick}
                    className="w-full sm:w-auto px-6 py-3 bg-[#6366F1] text-white rounded-xl text-sm font-bold shadow-[0_8px_30px_-8px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <Plus size={16} strokeWidth={2.5} /> Connect Account
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center min-h-0 pt-4 sm:pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                  {[
                    { image: "comment-to-dm", title: "Comment-to-DM", desc: "Auto-reply to comments with custom DMs.", color: "indigo" },
                    { image: "story-mentions", title: "Story Mentions", desc: "Instantly DM followers when they mention you.", color: "pink" },
                    { image: "faq-chatbot", title: "Smart Chatbot", desc: "Resolve common user questions automatically 24/7.", color: "emerald" },
                    { image: "smart-bio", title: "Smart Bio", desc: "Create a beautiful page to aggregate all your links.", color: "amber" },
                  ].map(({ image, title, desc }) => (
                    <div key={title} className="bg-white border border-zinc-200/80 rounded-[24px] overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 group h-full">
                      <div className="p-5 pb-0 relative z-10">
                        <h3 className="text-[15px] sm:text-base font-bold text-zinc-900 mb-1 leading-snug tracking-tight">{title}</h3>
                        <p className="text-[11px] sm:text-xs text-zinc-500 font-normal leading-relaxed line-clamp-2">{desc}</p>
                      </div>
                      
                      <div className="flex-1 w-full h-24 sm:h-[110px] lg:h-[120px] mt-2 bg-white flex items-end justify-center overflow-hidden shrink-0">
                        <img 
                          src={`/images/features/${image}.png`} 
                          alt={title} 
                          className="w-[95%] h-[95%] object-contain object-bottom mix-blend-multiply mb-1" 
                        />
                      </div>
                      
                      <div className="px-4 pb-4 pt-1 bg-white relative z-10">
                        <div className="pt-2 border-t border-zinc-100">
                          <button
                            onClick={handleConnectClick}
                            className="w-full text-zinc-400 font-semibold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 group-hover:text-[#6366F1] group-hover:bg-indigo-50/50 transition-all duration-300"
                          >
                            <LucideLock size={12} /> Connect to Unlock
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <BottomNav 
        onMoreClick={() => setIsMobileSidebarOpen(true)}
        onCreateClick={() => {
          if (!selectedAccount) {
            handleConnectClick();
          } else {
            setActiveTab("automations");
            setIsCreateModalOpen(true);
          }
        }} 
      />

      <PwaInstallBanner />

      {/* Modals and HelpSlider */}
      <HelpSlider isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      
      <TriggerInputModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSelect={handleCreateTriggerStart} 
        currentPlan={currentPlan}
        onUpgradeClick={(reason) => {
          setUpgradeReason(reason || "general");
          setIsSubscriptionOpen(true);
        }}
      />

      <EditTriggerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTrigger(null);
        }}
        trigger={editingTrigger}
        onSave={handleSaveTrigger}
        onDelete={handleDeleteTrigger}
        currentPlan={currentPlan}
        onUpgradeClick={(reason) => {
          setUpgradeReason(reason || "general");
          setIsSubscriptionOpen(true);
        }}
      />
      
      <AccountSettingsModal 
        isOpen={isAccountSettingsOpen} 
        onClose={() => setIsAccountSettingsOpen(false)} 
        user={user}
      />
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => {
          setIsSubscriptionOpen(false);
          setUpgradeReason("");
        }}
        currentPlan={currentPlan}
        realtimeStats={realtimeStats}
        upgradeReason={upgradeReason}
      />
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        initialStep={onboardingStep}
        connectedAccount={connectedAccount}
        user={user}
      />
    </div>
  );
}
