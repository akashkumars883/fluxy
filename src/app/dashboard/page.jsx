"use client";

import { createClient } from "@/lib/supabase";
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
  Package,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import * as logger from "@/lib/logger";
import toast from "react-hot-toast";

// Components
import AccountSettingsModal from "@/components/dashboard/AccountSettingsModal";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import AudienceCRM from "@/components/dashboard/AudienceCRM";
import CreatorOverview from "@/components/dashboard/CreatorOverview";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import WorkspaceSwitcher from "@/components/dashboard/WorkspaceSwitcher";
import { Zap, Search, X, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EditTriggerModal from "@/components/dashboard/EditTriggerModal";
import HelpSlider from "@/components/dashboard/HelpSlider";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import OnboardingModal from "@/components/dashboard/OnboardingModal";
import PartnerDashboard from "@/components/dashboard/PartnerDashboard";
import SettingsDashboard from "@/components/dashboard/SettingsDashboard";
import SmartBio from "@/components/dashboard/SmartBio";
import StoreManager from "@/components/dashboard/StoreManager";
import SubscriptionModal from "@/components/dashboard/SubscriptionModal";
import { CampaignBuilderWorkspace, TriggerInputModal, TriggerList } from "@/components/dashboard/TriggerManager";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import SystemBroadcast from "@/components/dashboard/SystemBroadcast";
import AppShell from "@/components/layout/AppShell";


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
        profilePictureUrl: params.get("profile_pic") || "",
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
  const initialOnboardingState = useMemo(() => getInitialOnboardingState(), []);
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

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
        return;
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  const recentSearches = [
    "Instagram Campaign 2024",
    "Story Auto-Reply Setup",
    "Lead Gen Analytics"
  ];

  const quickActions = [
    { name: "Create New Campaign", icon: Plus, tab: "automations" },
    { name: "View CRM", icon: Users, tab: "audience" },
    { name: "Settings", icon: Settings, tab: "settings" }
  ];

  const searchableItems = [
    { title: "Comment-to-DM Setup", type: "Automation", url: "automations", icon: Zap },
    { title: "Story Auto-Reply Setup", type: "Automation", url: "automations", icon: Zap },
    { title: "Instagram Campaign 2024", type: "Campaign", url: "automations", icon: Zap },
    { title: "Lead Gen Analytics", type: "Analytics", url: "analytics", icon: BarChart2 },
    { title: "Audience CRM", type: "Contacts", url: "audience", icon: Users },
    { title: "Account Settings", type: "Settings", url: "settings", icon: Settings },
  ];

  const filteredResults = searchQuery.length > 0
    ? searchableItems.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

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
      home: "Dashboard",
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
    
    const successParam = params.get("success");
    if (successParam === "instagram_connected") {
      toast.success("Instagram account connected successfully! 🔗");
      shouldClean = true;
    } else if (successParam === "subscribed") {
      toast.success("Subscription upgraded successfully! Welcome to Business Pro!");
      shouldClean = true;
    }

    const errorParam = params.get("error");
    if (errorParam) {
      toast.error(decodeURIComponent(errorParam));
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
              logger.warn("Dashboard: Media fetch failed ->", err?.message || err);
            }
          }
        } catch (e) {
          logger.error("Dashboard: Data Sync Error ->", e?.message || e);
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
          logger.log('Realtime History Update received');
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
          logger.log('Realtime Trigger Update received');
          const autoId = payload.new?.automation_id || payload.old?.automation_id;
          if (autoId === selectedAccount.id) {
            fetchAccountData(); // Refresh when triggers change
          }
        })
        .subscribe((status) => {
          logger.log('Supabase Realtime subscription status:', status);
        });

      return () => {
        supabase.removeChannel(historyChannel);
      };
    } else if (selectedAccount) {
      // Mock data injection for local testing on localhost
      setRealtimeStats({
        totalDms: 1245,
        autoReplies: 328,
        engagementRate: "4.8%",
        followerGrowth: 89,
      });

      const mockHistory = [
        { id: "h1", sender_id: "u1", sender_username: "john_doe", keyword: "START", response: "Here is your download link! 🔗", type: "COMMENT", status: "SUCCESS", created_at: new Date().toISOString() },
        { id: "h2", sender_id: "u2", sender_username: "alice_w", keyword: "PROMO", response: "Get 20% off with coupon code VIP20! 🏷️", type: "COMMENT", status: "SUCCESS", created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: "h3", sender_id: "u3", sender_username: "mike_s", keyword: "GUIDE", response: "Here is the free guide PDF! 📕", type: "COMMENT", status: "SUCCESS", created_at: new Date(Date.now() - 7200000).toISOString() }
      ];
      // Functional setter form — queued state transition, not a synchronous
      // write during render. Satisfies the cascading-render lint rule.
      setRealtimeHistory((prev) => (prev.length === 0 ? mockHistory : prev));

      const mockTriggers = [
        {
          id: "t1",
          keyword: "START",
          response: "Here is your download link! 🔗",
          type: "COMMENT",
          metadata: { campaign_name: "Start Campaign 🚀", is_active: true }
        },
        {
          id: "t2",
          keyword: "PROMO",
          response: "Get 20% off with coupon code VIP20! 🏷️",
          type: "COMMENT",
          metadata: { campaign_name: "Promo Discount 🏷️", is_active: true }
        },
        {
          id: "t3",
          keyword: "GUIDE",
          response: "Here is the free guide PDF! 📕",
          type: "COMMENT",
          metadata: { campaign_name: "Growth Guide 📕", is_active: false }
        }
      ];
      setTriggersList(mockTriggers);

      const triggersWithCounts = mockTriggers.map(t => ({
        ...t,
        count: mockHistory.filter(h => h.keyword === t.keyword).length
      })).sort((a, b) => b.count - a.count);
      setRealtimeTriggers(triggersWithCounts);

      setInstagramMedia([
        { id: "m1", media_type: "IMAGE", media_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&q=80", permalink: "#" },
        { id: "m2", media_type: "VIDEO", media_url: "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?w=300&q=80", permalink: "#" }
      ]);
      setInstagramStories([
        { id: "s1", media_type: "IMAGE", media_url: "https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=300&q=80" }
      ]);
    }
    // Listen for refresh events from TriggerInputModal Quick Setup
    const handleRefresh = () => {
      if (selectedAccount && UUID_REGEX.test(selectedAccount.id)) {
        const fetchTriggers = async () => {
          const supabase = createClient();
          const { data } = await supabase.from("triggers").select("*").eq("automation_id", selectedAccount.id).order("created_at", { ascending: false });
          if (data) setTriggersList(data);
        };
        fetchTriggers();
      }
    };
    window.addEventListener("refresh_dashboard_data", handleRefresh);
    return () => window.removeEventListener("refresh_dashboard_data", handleRefresh);
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
        follow_gate_message: options.follow_gate_message || "",
        intro_title: options.intro_title || "",
        intro_button_text: options.intro_button_text || "",
        cooldown_gate: options.cooldownGate || options.cooldown_gate || false,
        button_text: options.button_text || "",
        button_link: options.button_link || "",
        is_draft: options.is_draft || false,
        is_active: options.is_active !== false,
      },
      variants: {
        dm: [response.trim()],
        public: Array.isArray(options.public_reply)
          ? options.public_reply.map((r) => r.trim()).filter(Boolean)
          : options.public_reply
            ? [options.public_reply.trim()]
            : [],
      },
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
      logger.error("Error adding trigger:", err);
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
      logger.error("Error deleting trigger:", err);
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
      logger.error("Error updating trigger:", err);
      toast.error("Failed to update rule: " + err.message);
    }
  };

  const handleToggleTriggerActive = async (triggerId, currentIsActive) => {
    const trigger = triggersList.find(t => t.id === triggerId);
    if (!trigger) return;

    const updatedMetadata = {
      ...(trigger.metadata || {}),
      is_active: !currentIsActive,
      is_draft: !currentIsActive ? false : trigger.metadata?.is_draft
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
    if (currentPlan === "free" && accounts && accounts.length >= 1) {
      setUpgradeReason("multiple_accounts");
      setIsSubscriptionOpen(true);
      return;
    }
    setOnboardingStep(user?.user_metadata?.onboarding_completed ? 3 : 1);
    setShowOnboarding(true);
  };

  useEffect(() => {
    const isLocalDev = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    if (!loading && !user && !isLocalDev) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <Loader fullScreen text="Loading Dashboard..." />;

  const navigationItems = [
    { id: "home", label: "Dashboard", icon: Home, reqPlan: "free" },
    { id: "automations", label: "Automations", icon: Cpu, reqPlan: "free" },
    { id: "audience", label: "Audience", icon: Users, reqPlan: "free" },
    { id: "store", label: "Mini Store", icon: Package, reqPlan: "creator_pro" },
    { id: "smart_bio", label: "Smart Bio", icon: Link2, reqPlan: "free" },
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
  const usedQuota = (realtimeStats?.totalDms || 0) + (realtimeStats?.autoReplies || 0);
  const quotaPercent = Math.min(100, Math.round((usedQuota / maxQuota) * 100));

  const tabTitle = activeTab === "home"
    ? "Dashboard"
    : activeTab === "automations" ? "Automations"
      : activeTab === "audience" ? "Audience"
        : activeTab === "store" ? "Mini Store"
          : activeTab === "smart_bio" ? "Smart Bio"
            : activeTab === "settings" ? "Settings"
              : activeTab === "partner" ? "Partner Program"
                : activeTab;

  return (
    <AppShell>
      <div className="h-screen flex flex-col bg-background relative overflow-hidden selection:bg-sage/10 selection:text-sage">
        <SystemBroadcast />

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

        <MobileBottomNav onMenuClick={() => setIsMobileSidebarOpen(true)} />

        <div className="flex flex-1 relative overflow-hidden">
          <DashboardSidebar
            navigationItems={navigationItems}
            onHelpClick={() => setIsHelpOpen(true)}
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
            className="flex-1 p-3 sm:p-4 lg:p-5 w-full flex flex-col min-h-0 overflow-hidden pb-[88px] md:pb-6"
          >
            {/* Global Page Header (Navbar elements + Actions on the right, Title on the left) */}
            <div className="flex flex-row items-center justify-between gap-3 pb-4 border-b border-zinc-200/60 shrink-0 mb-4">
              {/* Left: Title + inline account badge */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 leading-tight flex items-center gap-2">
                    <span className={builderActive && activeTab === "automations" ? "inline sm:hidden" : "inline"}>
                      {builderActive && activeTab === "automations" ? "Campaign Builder" : tabTitle}
                    </span>
                    {activeTab === "automations" && builderActive && (
                      <>
                        <span className="text-zinc-300 font-medium select-none hidden sm:inline">/</span>
                        <span className="text-zinc-500 text-lg sm:text-xl font-semibold truncate max-w-37.5 sm:max-w-xs">{builderCampaignName || "New Campaign"}</span>
                      </>
                    )}
                  </h1>
                  {selectedAccount && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${(selectedAccount.persona || "content_creator") === "content_creator"
                        ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                        : "bg-blue-50 text-blue-600 border-blue-200"
                        } ${builderActive ? 'hidden sm:inline-block' : 'inline-block'}`}>
                        {(selectedAccount.persona || "content_creator") === "content_creator" ? "Creator" : "Business"}
                      </span>
                      <p className={`text-xs text-zinc-400 font-medium truncate ${builderActive ? 'hidden sm:block' : 'block'}`}>
                        @{selectedAccount.ig_username || selectedAccount.name || selectedAccount.page_name || "automixa_user"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Navbar Elements + Contextual Actions */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap justify-end">
                {/* Search Bar */}
                <div className="hidden lg:flex items-center w-48 xl:w-56">
                  <div className="relative w-full group cursor-pointer" onClick={() => setIsSearchOpen(true)}>
                    <div className="w-full bg-zinc-50/80 hover:bg-white backdrop-blur-xl border border-zinc-200 hover:border-zinc-300 rounded-xl pl-9 pr-10 py-1.5 text-[12px] font-medium text-zinc-400 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-sm flex items-center h-[34px] group-hover:ring-4 group-hover:ring-zinc-50">
                      Search...
                    </div>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none group-hover:text-[#6366F1] transition-colors z-10">
                      <Search size={13} strokeWidth={2} />
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center gap-0.5 px-1 py-0.5 rounded-[4px] bg-white border border-zinc-200 text-[8px] font-semibold text-zinc-500 pointer-events-none transition-all shadow-sm group-hover:bg-zinc-50">
                      <span>⌘</span>
                      <span>K</span>
                    </div>
                  </div>
                </div>

                {/* Workspace Switcher */}
                <div className="hidden md:block">
                  <WorkspaceSwitcher variant="minimal" onUpgradeClick={() => {
                    setUpgradeReason("");
                    setIsSubscriptionOpen(true);
                  }} />
                </div>

                {/* Notification Dropdown */}
                <NotificationDropdown accounts={accounts} />

                <div className="h-5 w-[1px] bg-zinc-200/60 hidden xs:block" />

                {/* Profile Dropdown */}
                <ProfileDropdown
                  user={user}
                  realtimeStats={realtimeStats}
                  setActiveTab={setActiveTab}
                  onAccountSettingsClick={() => setIsAccountSettingsOpen(true)}
                  onSubscriptionClick={(reason) => {
                    setUpgradeReason(typeof reason === 'string' ? reason : "");
                    setIsSubscriptionOpen(true);
                  }}
                />

                {/* Contextual Actions */}
                {selectedAccount && (
                  <div className="flex items-center gap-1.5 sm:gap-2 border-l border-zinc-200/60 pl-2 sm:pl-3">
                    {activeTab === "audience" && (
                      <Button
                        onClick={() => window.dispatchEvent(new Event("export_audience_csv"))}
                        variant={currentPlan === "free" ? "ghost" : "primary"}
                        disabled={currentPlan === "free"}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px]"
                      >
                        <Download size={12} />
                        <span>Export CSV</span>
                        {currentPlan === "free" && <LucideLock size={10} />}
                      </Button>
                    )}



                    {activeTab === "home" && (
                      <button
                        onClick={() => updateSelectedAccount({ is_active: !selectedAccount.is_active })}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${selectedAccount?.is_active ? "bg-emerald-50 border-emerald-200/80 text-emerald-700 hover:bg-emerald-100/30" : "bg-rose-50 border-rose-200/80 text-rose-600 hover:bg-rose-100/30"}`}
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedAccount?.is_active ? "bg-emerald-400" : "bg-rose-400"}`} />
                          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${selectedAccount?.is_active ? "bg-[#10B981]" : "bg-[#EF4444]"}`} />
                        </span>
                        {selectedAccount?.is_active ? "Active" : "Paused"}
                      </button>
                    )}



                    {activeTab === "partner" && partnerAppStatus === "approved" && (
                      <span className="px-2 py-1 bg-zinc-950 text-white font-bold text-[9px] rounded-lg uppercase tracking-wider border border-zinc-800">
                        {partnerActiveTier} · {partnerCommissionRate}%
                      </span>
                    )}

                    {activeTab === "settings" && (
                      <Button
                        onClick={() => window.dispatchEvent(new Event("save_settings"))}
                        variant="primary"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] shrink-0"
                      >
                        {settingsSaved && <CheckCircle2 size={12} className="text-emerald-400" />}
                        {settingsSaved ? "Saved!" : "Save"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {selectedAccount ? (
              <div className="flex flex-col flex-1 min-h-0 space-y-4 overflow-hidden">
                {/* === DYNAMIC ERROR / WARNING BANNER === */}
                {
                  (!selectedAccount?.is_active || usedQuota >= maxQuota) && (
                    <div className="shrink-0 animate-in slide-in-from-top-4 duration-300">
                      {!selectedAccount?.is_active ? (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-amber-50 border border-amber-200/60 rounded-xl shadow-sm text-amber-800">
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
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-rose-50 border border-rose-200/60 rounded-xl shadow-sm text-rose-800">
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
                  )
                }

                {
                  activeTab === "home" && (
                    <div
                      onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                      className="flex-1 min-h-0 overflow-y-auto sm:pr-1 no-scrollbar"
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
                  )
                }

                {
                  activeTab === "automations" && (
                    <div
                      onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                      className="flex-1 min-h-0 overflow-y-auto sm:pr-1 no-scrollbar"
                    >
                      <TriggerList
                        triggers={triggersList}
                        isMasterActive={selectedAccount?.is_active}
                        currentPlan={currentPlan}
                        onUpgradeClick={(reason) => {
                          setUpgradeReason(reason || "general");
                          setIsSubscriptionOpen(true);
                        }}
                        onCreateNew={() => setIsCreateModalOpen(true)}
                        onEdit={(t) => {
                          setEditingTrigger(t);
                          setIsEditModalOpen(true);
                        }}
                        onDelete={handleDeleteTrigger}
                        onToggleActive={handleToggleTriggerActive}
                      />
                    </div>
                  )
                }

                {
                  activeTab === "audience" && (
                    <div
                      onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                      className="flex-1 min-h-0 overflow-y-auto sm:pr-1 no-scrollbar"
                    >
                      <AudienceCRM 
                        accountId={selectedAccount.id} 
                        history={realtimeHistory} 
                        currentPlan={currentPlan} 
                        onUpgradeClick={(reason) => {
                          setUpgradeReason(reason || "general");
                          setIsSubscriptionOpen(true);
                        }}
                      />
                    </div>
                  )
                }
                {
                  activeTab === "store" && (
                    <div
                      onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                      className="flex-1 min-h-0 overflow-y-auto sm:pr-1 no-scrollbar"
                    >
                      <StoreManager accountId={selectedAccount.id} currentPlan={currentPlan} onUpgradeClick={(reason) => {
                        setUpgradeReason(reason || "mini_store");
                        setIsSubscriptionOpen(true);
                      }} />
                    </div>
                  )
                }
                {
                  activeTab === "smart_bio" && (
                    <div
                      onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                      className="flex-1 min-h-0 overflow-y-auto sm:pr-1 no-scrollbar"
                    >
                      <SmartBio accountId={selectedAccount.id} account={selectedAccount} currentPlan={currentPlan} onUpgradeClick={(reason) => {
                        setUpgradeReason(reason || "smart_bio");
                        setIsSubscriptionOpen(true);
                      }} />
                    </div>
                  )
                }
                {
                  activeTab === "settings" && (
                    <div
                      onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                      className="flex-1 min-h-0 overflow-y-auto sm:pr-1 no-scrollbar"
                    >
                      <SettingsDashboard account={selectedAccount} currentPlan={currentPlan} realtimeStats={realtimeStats} onSubscriptionClick={() => {
                        setUpgradeReason("");
                        setIsSubscriptionOpen(true);
                      }} />
                    </div>
                  )
                }

                {
                  activeTab === "partner" && (
                    <div
                      onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
                      className="flex-1 min-h-0 overflow-y-auto sm:pr-1 no-scrollbar"
                    >
                      <PartnerDashboard 
                        currentPlan={currentPlan} 
                        onUpgradeClick={(reason) => {
                          setUpgradeReason(reason || "general");
                          setIsSubscriptionOpen(true);
                        }}
                      />
                    </div>
                  )
                }
              </div >
            ) : (
              <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden rounded-xl border border-zinc-200/60 bg-white">
                {/* Background: Blurred Dashboard Preview Mockup */}
                <div className="absolute inset-0 z-0 p-6 overflow-hidden pointer-events-none select-none blur-[0.5px] opacity-[0.6] flex flex-col gap-6">
                  {/* Mock Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total Replies", value: "1,245", trend: "+12.4%" },
                      { label: "DM Automations", value: "328", trend: "+8.2%" },
                      { label: "Engagement Rate", value: "4.8%", trend: "+1.2%" },
                      { label: "New Leads", value: "89", trend: "+14.6%" }
                    ].map((card, i) => (
                      <div key={i} className="p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{card.label}</div>
                        <div className="text-xl font-bold text-zinc-900 mt-1">{card.value}</div>
                        <div className="text-[9px] font-bold text-emerald-600 mt-1">{card.trend} vs last week</div>
                      </div>
                    ))}
                  </div>

                  {/* Mock Charts Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
                    <div className="md:col-span-2 p-6 rounded-xl border border-zinc-200/80 bg-white flex flex-col gap-4">
                      <div className="font-bold text-zinc-800 text-sm">Reply Analytics</div>
                      <div className="flex-1 flex items-end gap-2 pt-4">
                        {[40, 60, 45, 90, 65, 85, 110, 80, 95, 130, 115, 140].map((h, idx) => (
                          <div key={idx} className="flex-1 bg-[#6366F1]/10 rounded-t-lg" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="p-6 rounded-xl border border-zinc-200/80 bg-white flex flex-col gap-4">
                      <div className="font-bold text-zinc-800 text-sm">Top Trigger Keywords</div>
                      <div className="space-y-3 pt-2">
                        {[
                          { keyword: "START", count: "482 replies" },
                          { keyword: "PROMO", count: "312 replies" },
                          { keyword: "GUIDE", count: "219 replies" }
                        ].map((row, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                            <span className="text-xs font-bold text-[#6366F1] bg-[#6366F1]/5 px-2 py-1 rounded-lg">#{row.keyword}</span>
                            <span className="text-xs font-semibold text-zinc-500">{row.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Foreground: Premium Onboarding Overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-white/30 via-white/70 to-white/95">
                  <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-zinc-200/50 rounded-xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">
                    {/* Glowing background gradient inside the card */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#6366F1]/5 rounded-full blur-3xl -z-10" />

                    {/* Animated Connection Icon */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-[3px] border-[#6366F1] shadow-[0_0_0_6px_rgba(99,102,241,0.03)] flex items-center justify-center mb-5 relative transition-transform duration-500 group-hover:scale-105">
                      <div className="absolute inset-0 rounded-full border border-dashed border-[#6366F1]/30 animate-[spin_12s_linear_infinite]" />
                      <Link2 size={20} className="text-[#6366F1] relative z-10" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-[10px] font-bold mb-3 border border-[#6366F1]/20 uppercase tracking-widest">
                      <Sparkles size={11} /> Connect Profile
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-2">
                      Unlock Your Marketing Workspace
                    </h2>

                    <p className="text-zinc-500 text-[12px] sm:text-[13px] font-medium leading-relaxed mb-6 max-w-sm">
                      Connect your Instagram Business account to view live analytics, manage automations, and track leads in real-time.
                    </p>

                    {/* Quick Onboarding Steps Checklist */}
                    <div className="w-full text-left space-y-3 mb-6 bg-zinc-50/50 border border-zinc-200/40 rounded-xl p-4">
                      <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-200/50 pb-2 mb-2">Getting Started</div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-[10px] font-bold flex items-center justify-center shrink-0">1</div>
                        <span className="text-xs font-semibold text-zinc-700">Connect your Instagram profile</span>
                      </div>

                      <div className="flex items-center gap-2.5 opacity-60">
                        <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-500 text-[10px] font-bold flex items-center justify-center shrink-0">2</div>
                        <span className="text-xs font-medium text-zinc-500">Set up comment auto-replies</span>
                      </div>

                      <div className="flex items-center gap-2.5 opacity-60">
                        <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-500 text-[10px] font-bold flex items-center justify-center shrink-0">3</div>
                        <span className="text-xs font-medium text-zinc-500">Collect leads & grow audience</span>
                      </div>
                    </div>

                    <button
                      onClick={handleConnectClick}
                      className="w-full px-6 py-2.5 bg-[#6366F1] hover:bg-[#5558e3] text-white rounded-xl text-xs font-bold shadow-[0_4px_20px_-4px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 hover:scale-[1.01]"
                    >
                      <Plus size={14} strokeWidth={2.5} /> Connect Instagram
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Modals and HelpSlider */}
        <HelpSlider isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

        <TriggerInputModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSelect={handleCreateTriggerStart}
          currentPlan={currentPlan}
          triggersCount={triggersList.length}
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

        {/* Full-Screen Focused Campaign Builder Workspace */}
        <AnimatePresence>
          {builderActive && (
            <motion.div
              initial={{ y: "100%", opacity: 0.95 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.95 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed inset-0 z-50 bg-white w-screen h-screen overflow-hidden flex flex-col"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Search Modal */}
        <AnimatePresence>
          {isSearchOpen && (
            <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[10vh] px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSearchOpen(false)}
                className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-zinc-200/60 overflow-hidden"
              >
                <div className="p-6 border-b border-zinc-100 flex items-center gap-4">
                  <Search className="text-[#6366F1]" size={24} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search campaigns, users, or automation logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-zinc-900 placeholder:text-zinc-400"
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {searchQuery.length === 0 ? (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-[10px] font-semibold text-zinc-400 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {quickActions.map((action, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setActiveTab(action.tab);
                                setIsSearchOpen(false);
                              }}
                              className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-[#6366F1]/30 hover:bg-[#6366F1]/5 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[#6366F1]">
                                  <action.icon size={18} />
                                </div>
                                <span className="text-sm font-semibold text-zinc-700 group-hover:text-zinc-900">{action.name}</span>
                              </div>
                              <ArrowRight size={16} className="text-zinc-300 group-hover:text-[#6366F1] transition-colors" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[10px] font-semibold text-zinc-400 mb-4">Recent Searches</h3>
                        <div className="space-y-2">
                          {recentSearches.map((search, i) => (
                            <button
                              key={i}
                              onClick={() => setSearchQuery(search)}
                              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors text-sm text-zinc-600 group"
                            >
                              <Clock size={16} className="text-zinc-300 group-hover:text-zinc-500" />
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredResults.length > 0 ? (
                        <>
                          <h3 className="text-[10px] font-semibold text-zinc-400 mb-4 px-2">Search Results</h3>
                          {filteredResults.map((result, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setActiveTab(result.url);
                                setIsSearchOpen(false);
                              }}
                              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors text-sm group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500">
                                  <result.icon size={18} />
                                </div>
                                <div className="text-left">
                                  <div className="font-semibold text-zinc-900">{result.title}</div>
                                  <div className="text-xs text-zinc-500">{result.type}</div>
                                </div>
                              </div>
                              <ArrowRight size={16} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="py-12 text-center">
                          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-zinc-300" size={32} />
                          </div>
                          <h3 className="text-zinc-900 font-semibold mb-1">{`No results for "${searchQuery}"`}</h3>
                          <p className="text-sm text-zinc-500">Try searching for campaigns, keywords, or account settings.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                      <span className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded shadow-sm text-zinc-500 font-bold">ESC</span>
                      <span>to close</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                      <span className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded shadow-sm text-zinc-500 font-bold">↵</span>
                      <span>to select</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-300">Automixa Search v1.0</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
