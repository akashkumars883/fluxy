"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  Home,
  Cpu,
  Users,
  BarChart2,
  Settings,
  Sparkles,
  ChevronRight,
  Camera,
  MessageSquare,
  Plus,
  Lock as LucideLock,
  Palette,
  Download,
  CheckCircle2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Components
import OnboardingModal from "@/components/dashboard/OnboardingModal";
import Loader from "@/components/ui/Loader";
import CreatorOverview from "@/components/dashboard/CreatorOverview";
import { TriggerInputModal, CampaignBuilderWorkspace, TriggerList, INSTAGRAM_POSTS_MOCK } from "@/components/dashboard/TriggerManager";
import EditTriggerModal from "@/components/dashboard/EditTriggerModal";
import AudienceCRM from "@/components/dashboard/AudienceCRM";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import SettingsDashboard from "@/components/dashboard/SettingsDashboard";
import HelpSlider from "@/components/dashboard/HelpSlider";
import PartnerDashboard from "@/components/dashboard/PartnerDashboard";
import Pricing from "@/components/marketing/Pricing";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import AccountSettingsModal from "@/components/dashboard/AccountSettingsModal";
import SubscriptionModal from "@/components/dashboard/SubscriptionModal";
import BottomNav from "@/components/dashboard/BottomNav";
import PwaInstallBanner from "@/components/dashboard/PwaInstallBanner";


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
    setAccounts,
    selectedAccount,
    setSelectedAccount,
    loading,
    setLoading,
    activeTab,
    setActiveTab,
    currentPlan,
    setCurrentPlan,
    realtimeStats,
    setRealtimeStats,
    updateSelectedAccount,
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
  const [triggerError, setTriggerError] = useState(null);
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let shouldClean = false;
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
  }, []);

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
    // TEMP: Allowing free users more than 5 triggers for promotion
    if (currentPlan === "free" && triggersList.length >= 100) {
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
    // TEMP: Allowing free users more than 5 triggers
    if (currentPlan === "free" && triggersList.length >= 100) {
      setIsSubscriptionOpen(true);
      return;
    }

    const supabase = createClient();
    
    // Prepare the trigger data
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
      const { data, error } = await supabase
        .from("triggers")
        .insert([triggerPayload])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setTriggersList(prev => [data, ...prev]);
        setBuilderActive(false);
      }
    } catch (err) {
      console.error("Error adding trigger:", err);
      setTriggerError("Failed to save trigger. Please try again.");
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
      alert("Failed to update rule: " + err.message);
    }
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
    { id: "analytics", label: "Analytics", icon: BarChart2, reqPlan: "free" },
    { id: "partner", label: "Partner Program", icon: Sparkles, reqPlan: "creator_pro" },
    { id: "settings", label: "Settings", icon: Settings, reqPlan: "free" },
  ].map(item => {
    // Agar account connected nahi hai, toh Home ke alawa sab lock
    if (!selectedAccount) {
      return {
        ...item,
        locked: item.id !== "home"
      };
    }
    
    // TEMP UNLOCK: Everything is available for promotion
    const isLockedByPlan = false; 
    
    return {
      ...item,
      locked: isLockedByPlan
    };
  });

  const maxQuota = currentPlan === "viral_scale" ? 2000000 : currentPlan === "creator_pro" ? 250000 : 25000;
  const usedQuota = realtimeStats?.autoReplies || 1420;
  const quotaPercent = Math.min(100, Math.round((usedQuota / maxQuota) * 100));

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F7] relative overflow-hidden selection:bg-[#6366F1]/10 selection:text-[#6366F1]">
      <DashboardNavbar 
        isScrolled={isScrolled}
        onHelpClick={() => setIsHelpOpen(true)} 
        accounts={accounts} 
        realtimeStats={realtimeStats}
        onAccountSettingsClick={() => setIsAccountSettingsOpen(true)}
        onSubscriptionClick={() => setIsSubscriptionOpen(true)}
      />

      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
        navigationItems={navigationItems}
        onPricingClick={() => setIsSubscriptionOpen(true)}
        onConnectClick={handleConnectClick}
        quotaPercent={quotaPercent}
        usedQuota={usedQuota}
        maxQuota={maxQuota}
      />

      <div className="flex flex-1 relative overflow-hidden">
        <DashboardSidebar 
          navigationItems={navigationItems}
          onPricingClick={() => setIsSubscriptionOpen(true)}
          onConnectClick={handleConnectClick}
          quotaPercent={quotaPercent}
          usedQuota={usedQuota}
          maxQuota={maxQuota}
        />

        <main 
          onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-8xl mx-auto w-full overflow-y-auto pb-24 md:pb-10"
        >
          {selectedAccount ? (
            <div className="space-y-6">
              {/* Header logic and Tab rendering (Simplified) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/50 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[12px] font-bold text-zinc-500">
                      @{selectedAccount.ig_username || selectedAccount.name || selectedAccount.page_name || 'automixa_user'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-sm ${
                      (selectedAccount.persona || "content_creator") === "content_creator" 
                        ? "bg-purple-50 text-purple-700 border-purple-200" 
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                      {(selectedAccount.persona || "content_creator") === "content_creator" ? "Creator Account" : "Business Account"}
                    </span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-zinc-950 leading-[0.9] mb-2">
                    {activeTab === "home" ? (
                      <span className="flex items-center gap-4">
                        Overview
                      </span>
                    ) : (
                      <span className="capitalize">{activeTab}</span>
                    )}
                  </h1>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 self-start">
                  {(activeTab === "audience" || activeTab === "crm") && (
                    <button 
                      onClick={() => window.dispatchEvent(new Event("export_audience_csv"))}
                      className={`px-6 py-4 ${currentPlan === "free" ? 'bg-zinc-200 text-zinc-500' : 'bg-zinc-950 hover:bg-[#6366F1] text-white hover:scale-[1.02]'} font-semibold text-[12px] rounded-xl shadow-2xl transition-all flex items-center gap-2 self-start sm:self-center`}
                    >
                      <Download size={14} className={currentPlan === "free" ? "text-zinc-400" : "text-[#6366F1]"} /> <span>Export Contacts (.CSV)</span>
                      {currentPlan === "free" && <LucideLock size={12} />}
                    </button>
                  )}
                  {activeTab === "analytics" && (
                    <div className="flex items-center gap-3">
                      <div className="bg-white/80 p-1 border border-zinc-200/80 rounded-xl flex items-center shadow-sm">
                        {[
                          { id: "7d", label: "7d" },
                          { id: "30d", label: "30d" },
                          { id: "all", label: "All Time" }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setTimeRange(t.id)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                              timeRange === t.id ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-950"
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={handleExportAnalytics}
                        className="px-4 py-2 bg-zinc-950 hover:bg-[#6366F1] text-white font-bold text-[11px] uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-1.5 hover:scale-[1.02] shrink-0"
                      >
                        <Download size={14} className="text-white" /> <span>Export Report</span>
                      </button>
                    </div>
                  )}

                  {activeTab === "home" && (
                    <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border transition-all duration-500 ${selectedAccount?.is_active ? 'bg-emerald-50/50 border-emerald-500/20 text-emerald-700 shadow-sm' : 'bg-rose-50/50 border-rose-500/20 text-rose-700'}`}>
                      <div className="relative flex h-2 w-2 shrink-0">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedAccount?.is_active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${selectedAccount?.is_active ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {selectedAccount?.is_active ? 'Shield Active' : 'System Paused'}
                      </span>
                    </div>
                  )}

                  {activeTab === "automations" && !builderActive && (
                    <>
                      {/* Compact Master Switch */}
                      <button 
                        onClick={() => updateSelectedAccount({ is_active: !selectedAccount.is_active })}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-300 ${
                          selectedAccount.is_active 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700 shadow-sm" 
                            : "bg-zinc-50 border-zinc-200 text-zinc-500"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${selectedAccount.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-zinc-300'}`} />
                        <span className="text-xs font-bold uppercase tracking-tight">
                          {selectedAccount.is_active ? 'Active' : 'Paused'}
                        </span>
                        <div className={`w-8 h-4 rounded-full flex items-center px-0.5 ml-1 transition-all duration-300 ${selectedAccount.is_active ? 'bg-emerald-500 justify-end' : 'bg-zinc-300 justify-start'}`}>
                          <motion.div layout className="w-3 h-3 bg-white rounded-full shadow-sm" />
                        </div>
                      </button>

                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-12 py-4 bg-zinc-950 text-white rounded-xl text-[12px] font-semibold shadow-2xl hover:bg-[#6366F1] transition-all flex items-center gap-2"
                      >
                        <Plus size={16} strokeWidth={2} /> Create New Campaign
                      </button>
                    </>
                  )}
                  {activeTab === "partner" && partnerAppStatus === "approved" && (
                    <div className="flex items-center gap-2">
                      <span className="px-5 py-3 bg-zinc-950 text-white font-black text-[10px] rounded-xl shadow-xl uppercase tracking-widest border border-zinc-800">
                        Tier: {partnerActiveTier} ({partnerCommissionRate}%)
                      </span>
                    </div>
                  )}
                  {activeTab === "settings" && (
                    <button 
                      onClick={() => window.dispatchEvent(new Event("save_settings"))}
                      className="px-6 py-3 bg-zinc-950 hover:bg-[#6366F1] text-white font-bold text-[11px] rounded-xl shadow-lg transition-all flex items-center gap-1.5 hover:scale-105 shrink-0"
                    >
                      {settingsSaved && <CheckCircle2 size={14} className="text-emerald-400" />}
                      <span>{settingsSaved ? "Saved!" : "Save Changes"}</span>
                    </button>
                  )}
                </div>
              </div>

              {activeTab === "home" && (
                <CreatorOverview 
                  stats={realtimeStats} 
                  history={realtimeHistory} 
                  topTriggers={realtimeTriggers} 
                  automationId={selectedAccount?.id}
                  isActive={selectedAccount?.is_active}
                  onViewAudience={() => setActiveTab("audience")}
                  onCreateAutoReply={() => {
                    setActiveTab("automations");
                    setIsCreateModalOpen(true);
                  }}
                />
              )}
              
              {activeTab === "automations" && (
                builderActive ? (
                  <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <CampaignBuilderWorkspace 
                      stories={instagramStories}
                      automation={selectedAccount}
                      templateKey={builderTemplateKey} 
                      campaignName={builderCampaignName}
                      currentPlan={currentPlan}
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
                  />
                )
              )}

              {activeTab === "audience" && <AudienceCRM accountId={selectedAccount.id} history={realtimeHistory} currentPlan={currentPlan} />}
              {activeTab === "crm" && <AudienceCRM accountId={selectedAccount.id} history={realtimeHistory} currentPlan={currentPlan} />}
              {activeTab === "analytics" && <AnalyticsDashboard account={selectedAccount} realtimeStats={realtimeStats} history={realtimeHistory} triggers={triggersList} />}
              {activeTab === "settings" && <SettingsDashboard account={selectedAccount} currentPlan={currentPlan} realtimeStats={realtimeStats} onSubscriptionClick={() => setIsSubscriptionOpen(true)} />}

              {activeTab === "partner" && <PartnerDashboard currentPlan={currentPlan} />}
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/50 pb-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2 text-zinc-950">
                    Welcome to Automixa
                  </h1>
                  <p className="text-zinc-600 text-sm sm:text-base font-normal">
                    Connect your Instagram account to activate premium automation features.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleConnectClick}
                    className="px-12 py-4 bg-[#6366F1] text-white rounded-xl text-[12px] font-semibold shadow-2xl transition-all flex items-center gap-2 hover:scale-[1.02]"
                  >
                    <Plus size={16} strokeWidth={2} /> Connect Instagram
                  </button>
                </div>
              </div>

              <div className="bg-white/40 backdrop-blur-xl border border-zinc-200/80 rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-zinc-100/40 transition-all duration-500">
                <div className="space-y-4 max-w-xl">
                  <div className="flex items-center gap-2 text-[#6366F1]">
                    <LucideLock size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Premium Feature Locked</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight leading-tight">
                    Start automating your Instagram profile today.
                  </h2>
                  <p className="text-zinc-500 text-xs sm:text-sm font-normal leading-relaxed">
                    Connect your account to enable keyword-based auto-replies for comments and DMs. Grow your leads while you sleep.
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                   <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                      <Cpu size={24} />
                   </div>
                   <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-100">
                      <Sparkles size={24} />
                   </div>
                   <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                      <MessageSquare size={24} />
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">Explore Pre-built Templates</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: MessageSquare, title: "Comment-to-DM AutoReply", desc: "Instantly send a custom DM when a user comments a specific keyword on your post." },
                    { icon: Sparkles, title: "Story Mention Responder", desc: "Boost loyalty by instantly replying with a personalized DM whenever a follower mentions you." },
                    { icon: Cpu, title: "24/7 FAQ Chatbot", desc: "Instantly resolve typical user questions regarding pricing, shipping, or hours in Instagram DMs." },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="bg-white/40 backdrop-blur-xl border border-zinc-200/80 rounded-[32px] p-6 lg:p-8 flex flex-col justify-between shadow-xl shadow-zinc-100/40 hover:shadow-2xl transition-all duration-500 group">
                      <div>
                        <div className="w-14 h-14 bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-all shadow-sm">
                          <Icon size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-zinc-900 mb-2 leading-snug tracking-tight">{title}</h3>
                        <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed mb-8">{desc}</p>
                      </div>
                      <button
                        onClick={handleConnectClick}
                        className="w-full bg-white border border-zinc-200/80 text-zinc-700 font-semibold text-xs sm:text-sm py-3.5 rounded-2xl flex items-center justify-center gap-1.5 group-hover:bg-[#6366F1] group-hover:text-white group-hover:border-[#6366F1] shadow-sm transition-all duration-300"
                      >
                        <LucideLock size={14} /> Connect to Use
                      </button>
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
      />
      
      <AccountSettingsModal 
        isOpen={isAccountSettingsOpen} 
        onClose={() => setIsAccountSettingsOpen(false)} 
        user={user}
      />
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        currentPlan={currentPlan}
        realtimeStats={realtimeStats}
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
