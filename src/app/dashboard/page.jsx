"use client";

import { createClient } from "@/lib/supabase";
import {
  AlertCircle,
  BarChart2,
  CheckCircle2,
  Cpu,
  Download,
  HelpCircle,
  Home,
  Link2,
  Lock as LucideLock,
  Plus,
  Settings,
  Sparkles,
  Users,
  Package,
  Zap,
  Search,
  X,
  Clock,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import * as logger from "@/lib/logger";
import toast from "react-hot-toast";

import dynamic from 'next/dynamic';

// Heavy Components (Lazy Loaded)
const AccountSettingsModal = dynamic(() => import('@/components/dashboard/AccountSettingsModal'), { ssr: false });
const AnalyticsDashboard = dynamic(() => import('@/components/dashboard/AnalyticsDashboard'), { loading: () => <SkeletonDashboard /> });
const AudienceCRM = dynamic(() => import('@/components/dashboard/AudienceCRM'), { loading: () => <SkeletonDashboard /> });
const EditTriggerModal = dynamic(() => import('@/components/dashboard/EditTriggerModal'), { ssr: false });
const HelpSlider = dynamic(() => import('@/components/dashboard/HelpSlider'), { ssr: false });
const OnboardingModal = dynamic(() => import('@/components/dashboard/OnboardingModal'), { ssr: false });
const PartnerDashboard = dynamic(() => import('@/components/dashboard/PartnerDashboard'), { loading: () => <SkeletonDashboard /> });
const SettingsDashboard = dynamic(() => import('@/components/dashboard/SettingsDashboard'), { loading: () => <SkeletonDashboard /> });
const SmartBio = dynamic(() => import('@/components/dashboard/SmartBio'), { loading: () => <SkeletonDashboard /> });
const StoreManager = dynamic(() => import('@/components/dashboard/StoreManager'), { loading: () => <SkeletonDashboard /> });
const SubscriptionModal = dynamic(() => import('@/components/dashboard/SubscriptionModal'), { ssr: false });

const CampaignBuilderWorkspace = dynamic(() => import('@/components/dashboard/TriggerManager').then(mod => mod.CampaignBuilderWorkspace), { loading: () => <SkeletonDashboard /> });
const TriggerInputModal = dynamic(() => import('@/components/dashboard/TriggerManager').then(mod => mod.TriggerInputModal), { ssr: false });
const TriggerList = dynamic(() => import('@/components/dashboard/TriggerManager').then(mod => mod.TriggerList), { loading: () => <SkeletonDashboard /> });

// Core Components (Instantly Loaded)
import CreatorOverview from "@/components/dashboard/CreatorOverview";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import Loader from "@/components/ui/Loader";
import SkeletonDashboard from "@/components/ui/SkeletonDashboard";
import Button from "@/components/ui/Button";
import SystemBroadcast from "@/components/dashboard/SystemBroadcast";
import AppShell from "@/components/layout/AppShell";


// Context
import { useDashboard } from "@/context/DashboardContext";
import confetti from "canvas-confetti";

// Constants
const FREE_PLAN_TRIGGER_LIMIT = 5;

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

const PLAN_HIERARCHY = {
  "free": 0,
  "creator_pro": 1,
  "viral_scale": 2
};

const BASE_NAVIGATION_ITEMS = [
  { id: "home", label: "Home", icon: Home, reqPlan: "free" },
  { id: "automations", label: "Automations", icon: Cpu, reqPlan: "free" },
  { id: "audience", label: "Contacts", icon: Users, reqPlan: "free" },
  { id: "store", label: "Mini Store", icon: Package, reqPlan: "creator_pro" },
  { id: "smart_bio", label: "Smart Bio", icon: Link2, reqPlan: "free" },
  { id: "partner", label: "Partner Program", icon: Sparkles, reqPlan: "free" },
  { id: "settings", label: "Settings", icon: Settings, reqPlan: "free" },
];

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

  // --- CONFIG: SET TO false TO RE-ENABLE PAYWALLS ---
  const BYPASS_PLAN_LIMITS = false;
  const effectivePlan = BYPASS_PLAN_LIMITS ? "viral_scale" : currentPlan;

  const router = useRouter();
  const initialOnboardingState = useMemo(() => getInitialOnboardingState(), []);
  const [showOnboarding, setShowOnboarding] = useState(initialOnboardingState.showOnboarding);
  const [onboardingStep, setOnboardingStep] = useState(initialOnboardingState.onboardingStep);
  const [connectedAccount, setConnectedAccount] = useState(initialOnboardingState.connectedAccount);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);


  const [realtimeHistory, setRealtimeHistory] = useState([]);
  const [realtimeTriggers, setRealtimeTriggers] = useState([]);
  const [triggersList, setTriggersList] = useState([]);
  const [instagramMedia, setInstagramMedia] = useState([]);
  const [instagramStories, setInstagramStories] = useState([]);

  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [showGiveawayModal, setShowGiveawayModal] = useState(false);
  const [giveawayNumber, setGiveawayNumber] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState(null);
  const [builderActive, setBuilderActive] = useState(false);
  const [builderCampaignName, setBuilderCampaignName] = useState("");
  const [builderTemplateKey, setBuilderTemplateKey] = useState("custom");
  const [builderInitialStrategy, setBuilderInitialStrategy] = useState(null);
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
      home: "Home",
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
      // Check if this was a giveaway upgrade
      const isGiveaway = params.get("giveaway") === "true";
      const giveawayNum = params.get("giveaway_number");
      if (isGiveaway && giveawayNum) {
        setGiveawayNumber(parseInt(giveawayNum));
        setTimeout(() => setShowGiveawayModal(true), 1200);
      } else {
        toast.success("Instagram account connected successfully! 🔗");
      }
      shouldClean = true;
    } else if (successParam === "subscribed") {
      toast.success("Subscription upgraded successfully! Welcome to Business Pro!");
      shouldClean = true;
    }

    const errorParam = params.get("error");
    const reasonParam = params.get("reason");
    if (errorParam) {
      const decodedError = decodeURIComponent(errorParam).replace(/_/g, " ");
      const msg = reasonParam ? `${decodedError}: ${decodeURIComponent(reasonParam)}` : decodedError;
      toast.error(msg);
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
      let fetchDebounceTimeout;

      async function fetchMediaData() {
        if (!selectedAccount?.id) return;
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

      async function fetchCoreStats() {
        if (!selectedAccount?.id) return;
        try {
          const now = new Date();
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
          const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

          const results = await Promise.allSettled([
            // DM Sent = all SUCCESS records (since every success results in a DM)
            supabase.from("automation_history").select("*", { count: 'exact', head: true }).eq("automation_id", selectedAccount.id).eq("status", "SUCCESS"),
            // Auto Replies = COMMENT type that were successfully replied to
            supabase.from("automation_history").select("*", { count: 'exact', head: true }).eq("automation_id", selectedAccount.id).in("status", ["SUCCESS", "INTERACTED"]).eq("type", "COMMENT"),
            supabase.from("automation_history").select("*", { count: 'exact', head: true }).eq("automation_id", selectedAccount.id), // total attempts
            supabase.from("automation_history").select("*").eq("automation_id", selectedAccount.id).order("created_at", { ascending: false }).limit(200), // recent history for charts/campaigns
            supabase.from("triggers").select("*").eq("automation_id", selectedAccount.id).order("created_at", { ascending: false }),
            
            // For unique contacts
            supabase.from("automation_history").select("sender_id").eq("automation_id", selectedAccount.id),
            
            // For trends
            supabase.from("automation_history").select("*", { count: 'exact', head: true }).eq("automation_id", selectedAccount.id).eq("status", "SUCCESS").gte("created_at", sevenDaysAgo),
            supabase.from("automation_history").select("*", { count: 'exact', head: true }).eq("automation_id", selectedAccount.id).eq("status", "SUCCESS").gte("created_at", fourteenDaysAgo).lt("created_at", sevenDaysAgo),
          ]);

          const [dmRes, commentRes, totalAttemptsRes, historyRes, triggersRes, allContactsRes, currentWeekRes, prevWeekRes] = results;

          const dmCount = dmRes.status === 'fulfilled' ? dmRes.value.count : 0;
          const commentCount = commentRes.status === 'fulfilled' ? commentRes.value.count : 0;
          const totalAttempts = totalAttemptsRes.status === 'fulfilled' ? totalAttemptsRes.value.count : 0;
          const totalSuccess = dmCount; // dmCount already represents all SUCCESS records
          const historyData = historyRes.status === 'fulfilled' ? historyRes.value.data : [];
          const triggersData = triggersRes.status === 'fulfilled' ? triggersRes.value.data : [];
          
          const allContacts = allContactsRes.status === 'fulfilled' ? allContactsRes.value.data : [];
          const uniqueContacts = new Set(allContacts.filter(c => c.sender_id).map(c => c.sender_id)).size;

          const currentWeekSuccess = currentWeekRes.status === 'fulfilled' ? currentWeekRes.value.count : 0;
          const prevWeekSuccess = prevWeekRes.status === 'fulfilled' ? prevWeekRes.value.count : 0;
          
          // Calculate Trend %
          let trendNum = 0;
          if (prevWeekSuccess === 0) {
            trendNum = currentWeekSuccess > 0 ? 100 : 0;
          } else {
            trendNum = Math.round(((currentWeekSuccess - prevWeekSuccess) / prevWeekSuccess) * 100);
          }
          const trendLabel = trendNum >= 0 ? `+${trendNum}%` : `${trendNum}%`;

          // Calculate Success Rate
          const successRate = totalAttempts > 0 ? Math.round((totalSuccess / totalAttempts) * 100) : 0;
          
          // Calculate Conversion Rate (Contacts per Auto Reply)
          const conversionRate = commentCount > 0 ? Math.min(100, Math.round((uniqueContacts / commentCount) * 100)) : 0;

          setRealtimeStats({
            totalDms: dmCount || 0,
            autoReplies: commentCount || 0,
            uniqueContacts: uniqueContacts,
            successRate: `${successRate}%`,
            conversionRate: `${conversionRate}%`,
            trend: trendLabel,
            trendIsPositive: trendNum >= 0
          });

          if (historyData) setRealtimeHistory(historyData);
          if (triggersData) {
            setTriggersList(triggersData);
            // Campaign performance computation across all contacts instead of just recent 100
            const triggersWithCounts = triggersData.map(t => ({
              ...t,
              count: allContacts.filter(h => h.keyword === t.keyword || h.trigger_id === t.id).length
            })).sort((a, b) => b.count - a.count);
            setRealtimeTriggers(triggersWithCounts);
          }
        } catch (e) {
          logger.error("Dashboard: Data Sync Error ->", e?.message || e);
        }
      }

      // Initial concurrent fetch to reduce waterfall delay
      fetchCoreStats();
      fetchMediaData();

      const debouncedFetchCoreStats = () => {
        if (fetchDebounceTimeout) clearTimeout(fetchDebounceTimeout);
        fetchDebounceTimeout = setTimeout(() => {
          fetchCoreStats();
        }, 1500); // 1.5 seconds debounce
      };

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
            debouncedFetchCoreStats();
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
            debouncedFetchCoreStats();
          }
        })
        .subscribe((status) => {
          logger.log('Supabase Realtime subscription status:', status);
        });

      const handleSimulatedEvent = (e) => {
        logger.log('Simulated Event received in Dashboard');
        const { accountId } = e.detail;
        if (accountId === selectedAccount.id) {
          debouncedFetchCoreStats();
        }
      };
      window.addEventListener("automixa-simulated-event", handleSimulatedEvent);

      return () => {
        if (fetchDebounceTimeout) clearTimeout(fetchDebounceTimeout);
        supabase.removeChannel(historyChannel);
        window.removeEventListener("automixa-simulated-event", handleSimulatedEvent);
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
    if (effectivePlan === "free" && triggersList.length >= FREE_PLAN_TRIGGER_LIMIT) {
      setIsCreateModalOpen(false);
      setIsSubscriptionOpen(true);
      return;
    }
    setBuilderTemplateKey(templateId);
    setBuilderCampaignName(title);
    setIsCreateModalOpen(false);
    setBuilderActive(true);
  };

  const handleCreateFromTemplate = (strategy) => {
    if (effectivePlan === "free" && triggersList.length >= FREE_PLAN_TRIGGER_LIMIT) {
      setIsSubscriptionOpen(true);
      return;
    }
    const labelMap = {
      comment_dm: "Comment → DM",
      story_automator: "Story Reply",
      faq_assistant: "AI FAQ Bot",
      sales_closer: "AI Sales Agent"
    };
    setBuilderInitialStrategy(strategy);
    setBuilderTemplateKey("custom");
    setBuilderCampaignName(labelMap[strategy] || "New Campaign");
    setBuilderActive(true);
    setActiveTab("automations");
  };

  const handleAddTrigger = async (keyword, response, options = {}) => {
    if (effectivePlan === "free" && triggersList.length >= FREE_PLAN_TRIGGER_LIMIT) {
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

        // UX: Success Micro-interactions
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#EC4899', '#10B981']
        });
        if (typeof window !== "undefined" && navigator.vibrate) {
          navigator.vibrate(50);
        }
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

    // OPTIMISTIC UI UPDATE
    // Instantly flip the switch in the UI without waiting for the server
    const updatedTrigger = { ...trigger, metadata: updatedMetadata };

    setTriggersList(prev => prev.map(t => t.id === triggerId ? updatedTrigger : t));

    setRealtimeTriggers(prev => prev.map(t =>
      t.id === triggerId
        ? { ...t, metadata: updatedMetadata }
        : t
    ));

    // Background server sync
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("triggers")
        .update({ metadata: updatedMetadata })
        .eq("id", triggerId);

      if (error) throw error;
    } catch (err) {
      logger.error("Optimistic toggle failed:", err);
      toast.error("Network error: Failed to toggle trigger");
      // Revert the optimistic update on failure by re-fetching
      window.dispatchEvent(new Event("refresh_dashboard_data"));
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
    if (effectivePlan === "free" && accounts && accounts.length >= 2) {
      setUpgradeReason("multiple_accounts");
      setIsSubscriptionOpen(true);
      return;
    }
    setOnboardingStep(user?.user_metadata?.onboarding_completed ? 3 : 1);
    setShowOnboarding(true);
  };

  useEffect(() => {
    const isLocalDev = process.env.NODE_ENV === "development";

    if (!loading && !user && !isLocalDev) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <SkeletonDashboard />;

  const navigationItems = BASE_NAVIGATION_ITEMS.map(item => {
    // Agar account connected nahi hai, toh Home ke alawa sab lock
    if (!selectedAccount) {
      return {
        ...item,
        locked: item.id !== "home"
      };
    }

    const userPlanLevel = PLAN_HIERARCHY[effectivePlan] || 0;
    const reqPlanLevel = PLAN_HIERARCHY[item.reqPlan] || 0;

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
    ? "Home"
    : activeTab === "automations" ? "Automations"
      : activeTab === "audience" ? "Contacts"
        : activeTab === "store" ? "Mini Store"
          : activeTab === "smart_bio" ? "Smart Bio"
            : activeTab === "settings" ? "Settings"
              : activeTab === "partner" ? "Partner Program"
                : activeTab;

  return (
    <>
    <AppShell>
      <div className="h-screen flex flex-col bg-[#faf8f5] relative overflow-hidden selection:bg-indigo-500/10 selection:text-indigo-600">
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


        <div className="flex flex-1 overflow-hidden">
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
            className="flex-1 overflow-y-auto w-full flex flex-col relative"
          >
            {/* Early Access Static Banner */}
            <div className="bg-indigo-600 text-white px-3 sm:px-4 py-2 sm:py-1.5 text-center text-[10px] sm:text-xs font-medium sm:font-semibold flex items-start sm:items-center justify-center gap-1.5 sm:gap-2  shrink-0 z-30">
              <Sparkles size={12} className="animate-pulse shrink-0 mt-0.5 sm:mt-0" />
              <p className="leading-tight sm:leading-normal text-left sm:text-center">
                <strong className="block sm:inline font-bold mb-0.5 sm:mb-0">Early Access Beta:</strong> 
                <span className="opacity-90 sm:opacity-100"> All premium features and automations are currently 100% free!</span>
              </p>
            </div>

            {/* Global Page Header (Navbar elements + Actions on the right, Title on the left) */}
            <div className="flex flex-row items-center justify-between gap-2 p-3 sm:px-4 lg:px-6 border-b border-zinc-200/50 shrink-0 sticky top-0 z-20 bg-[#faf8f5]">
              {/* Left: Title + inline account badge */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0 flex flex-nowrap items-center gap-2 sm:gap-4">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-black leading-tight flex flex-nowrap items-center gap-2 min-w-0 truncate">
                    <span className={`truncate ${builderActive && activeTab === "automations" ? "inline sm:hidden" : "inline"}`}>
                      {builderActive && activeTab === "automations" ? "Campaign Builder" : tabTitle}
                    </span>
                    {activeTab === "automations" && builderActive && (
                      <>
                        <span className="text-zinc-300 font-medium select-none hidden sm:inline">/</span>
                        <span className="text-black opacity-80 text-base sm:text-lg font-semibold truncate max-w-[120px] xs:max-w-[150px] sm:max-w-xs">{builderCampaignName || "New Campaign"}</span>
                      </>
                    )}
                  </h1>
                  {selectedAccount && (
                    <div className="hidden sm:flex items-center gap-2 border-l border-zinc-200 pl-2 sm:pl-4">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${(selectedAccount.persona || "content_creator") === "content_creator"
                        ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                        : "bg-blue-50 text-blue-600 border-blue-200"
                        }`}>
                        {(selectedAccount.persona || "content_creator") === "content_creator" ? "Creator" : "Business"}
                      </span>
                      <p className="text-xs text-black opacity-60 font-medium truncate max-w-[150px]">
                        @{selectedAccount.ig_username || selectedAccount.name || selectedAccount.page_name || "automixa_user"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Navbar Elements + Contextual Actions */}
              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 flex-nowrap justify-end">
                {/* Search Icon Button */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-md text-black opacity-60 hover:text-[#6366F1] hover:bg-zinc-100/80 transition-all"
                  title="Search (⌘K)"
                >
                  <Search size={17} strokeWidth={1.5} />
                </button>

                {/* Help Button */}
                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-md text-black opacity-60 hover:text-black hover:bg-zinc-100/80 transition-all"
                  title="Help"
                >
                  <HelpCircle size={17} strokeWidth={1.5} />
                </button>

                {/* Notification Dropdown */}
                <NotificationDropdown accounts={accounts} />

                <div className="h-5 w-[1px] bg-zinc-200/60 hidden sm:block" />

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



                    {/* Contextual Actions (Removed Active Indicator) */}



                    {activeTab === "partner" && partnerAppStatus === "approved" && (
                      <span className="px-2 py-1 bg-zinc-950 text-white font-bold text-[9px] rounded-md uppercase tracking-wider border border-zinc-800">
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
              <div className="flex flex-col flex-1 min-h-0 space-y-2 sm:space-y-3 overflow-hidden px-0 sm:px-5 lg:px-6 pt-2 pb-1 sm:pt-4 sm:pb-4">
                {/* === DYNAMIC ERROR / WARNING BANNER === */}
                {
                  (!selectedAccount?.is_active || usedQuota >= maxQuota) && (
                    <div className="shrink-0 animate-in slide-in-from-top-4 duration-300">
                      {!selectedAccount?.is_active ? (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-amber-50 border border-amber-200/60 rounded-md text-amber-800">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
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
                            className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-semibold transition-all hover:scale-[1.02] shrink-0"
                          >
                            Activate Shield
                          </button>
                        </div>
                      ) : usedQuota >= maxQuota ? (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-rose-50 border border-rose-200/60 rounded-md text-rose-800">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-md bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
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
                            className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-semibold transition-all hover:scale-[1.02] shrink-0"
                          >
                            Early Access Active
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )
                }

                {
                  activeTab === "home" && (
                    <div

                      className="flex-1 min-h-0 overflow-y-auto sm:pr-1 no-scrollbar px-4 sm:px-6 lg:px-8 pt-4 pb-24 md:pb-8"
                    >
                      <CreatorOverview
                        stats={realtimeStats}
                        history={realtimeHistory}
                        topTriggers={realtimeTriggers}
                        automationId={selectedAccount?.id}
                        currentPlan={effectivePlan}
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
                        onCreateTemplate={handleCreateFromTemplate}
                      />
                    </div>
                  )
                }

                {
                  activeTab === "automations" && (
                    <div

                      className="flex-1 min-h-0 overflow-y-auto sm:pr-1 no-scrollbar flex flex-col px-4 sm:px-6 lg:px-8 pt-4 pb-24 md:pb-8"
                    >
                      {builderActive ? (
                        <CampaignBuilderWorkspace
                          stories={instagramStories}
                          automation={selectedAccount}
                          templateKey={builderTemplateKey}
                          campaignName={builderCampaignName}
                          currentPlan={effectivePlan}
                          onUpgradeClick={(reason) => {
                            setUpgradeReason(reason || "general");
                            setIsSubscriptionOpen(true);
                          }}
                          media={instagramMedia}
                          onPublish={handleAddTrigger}
                          onClose={() => {
                            setBuilderActive(false);
                            setBuilderInitialStrategy(null);
                          }}
                          initialStrategy={builderInitialStrategy}
                        />
                      ) : (
                        <TriggerList
                          triggers={triggersList}
                          isMasterActive={selectedAccount?.is_active}
                          currentPlan={effectivePlan}
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
                          onCreateFromTemplate={handleCreateFromTemplate}
                        />
                      )}
                    </div>
                  )
                }

                {
                  activeTab === "audience" && (
                    <div

                      className="flex-1 min-h-0 overflow-y-auto sm:pr-1 no-scrollbar px-4 sm:px-6 lg:px-8 pt-4 pb-24 md:pb-8"
                    >
                      <AudienceCRM
                        accountId={selectedAccount.id}
                        history={realtimeHistory}
                        currentPlan={effectivePlan}
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

                      className="flex-1 min-h-0 overflow-y-auto sm:pr-1 no-scrollbar px-4 sm:px-6 lg:px-8 pt-4 pb-24 md:pb-8"
                    >
                      <StoreManager accountId={selectedAccount.id} currentPlan={effectivePlan} onUpgradeClick={(reason) => {
                        setUpgradeReason(reason || "mini_store");
                        setIsSubscriptionOpen(true);
                      }} />
                    </div>
                  )
                }
                {
                  activeTab === "smart_bio" && (
                    <div

                      className="flex-1 min-h-0 overflow-y-auto sm:pr-1 no-scrollbar px-4 sm:px-6 lg:px-8 pt-4 pb-24 md:pb-8"
                    >
                      <SmartBio accountId={selectedAccount.id} account={selectedAccount} currentPlan={effectivePlan} onUpgradeClick={(reason) => {
                        setUpgradeReason(reason || "smart_bio");
                        setIsSubscriptionOpen(true);
                      }} />
                    </div>
                  )
                }
                {
                  activeTab === "settings" && (
                    <div

                      className="flex-1 min-h-0 overflow-y-auto sm:pr-1 no-scrollbar px-4 sm:px-6 lg:px-8 pt-4 pb-24 md:pb-8"
                    >
                      <SettingsDashboard account={selectedAccount} currentPlan={effectivePlan} realtimeStats={realtimeStats} onSubscriptionClick={() => {
                        setUpgradeReason("");
                        setIsSubscriptionOpen(true);
                      }} />
                    </div>
                  )
                }

                {
                  activeTab === "partner" && (
                    <div

                      className="flex-1 min-h-0 overflow-y-auto sm:pr-1 no-scrollbar px-4 sm:px-6 lg:px-8 pt-4 pb-24 md:pb-8"
                    >
                      <PartnerDashboard
                        currentPlan={effectivePlan}
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
              <div className="flex-1 flex flex-col min-h-0 relative overflow-y-auto no-scrollbar gap-6 px-4 sm:px-6 lg:px-8 pt-6 pb-6">
                {/* Mock Stats Cards (No blur, shown as blank dashboard) - Hidden on mobile so Connect is at the top */}
                <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4 pointer-events-none select-none">
                  {[
                    { label: "Total Replies", value: "1,245", trend: "+12.4%" },
                    { label: "DM Automations", value: "328", trend: "+8.2%" },
                    { label: "Engagement Rate", value: "4.8%", trend: "+1.2%" },
                    { label: "New Leads", value: "89", trend: "+14.6%" }
                  ].map((card, i) => (
                    <div key={i} className="p-4 rounded-md border border-zinc-200 bg-white">
                      <div className="text-[10px] font-bold text-black opacity-60 uppercase tracking-wider">{card.label}</div>
                      <div className="text-xl font-bold text-black mt-1">{card.value}</div>
                      <div className="text-[9px] font-bold text-emerald-600 mt-1">{card.trend} vs last week</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-start justify-center pb-10">
                  <div className="w-full bg-white border border-zinc-200 rounded-md p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative overflow-hidden group">
                    
                    {/* Left Side: Copy and Call to Action */}
                    <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full max-w-xl">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#6366F1]/10 text-[#6366F1] text-[10px] font-bold mb-4 border border-[#6366F1]/20 uppercase tracking-widest">
                        <Sparkles size={11} /> Connect Profile
                      </div>

                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-black tracking-tight leading-tight mb-3">
                        Unlock Your Marketing Workspace
                      </h2>

                      <p className="text-black opacity-80 text-sm md:text-base font-medium leading-relaxed mb-8 max-w-md">
                        Connect your Instagram Business account to view live analytics, manage automations, and track leads in real-time.
                      </p>

                      <button
                        onClick={handleConnectClick}
                        className="w-full md:w-auto px-8 py-3.5 bg-[#6366F1] hover:bg-[#5558e3] text-white rounded-md text-sm font-bold-[0_4px_20px_-4px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 hover:scale-[1.02]"
                      >
                        <Plus size={16} strokeWidth={2.5} /> Connect Instagram
                      </button>
                    </div>

                    {/* Right Side: Quick Onboarding Steps Checklist */}
                    <div className="w-full md:w-auto md:flex-1 max-w-md flex justify-center md:justify-end">
                      <div className="w-full text-left space-y-4 bg-zinc-50/50 border border-zinc-200/60 rounded-md p-6 sm:p-8">
                        <div className="text-[10px] font-bold text-black opacity-60 uppercase tracking-widest border-b border-zinc-200/50 pb-3 mb-4 flex items-center gap-2">
                          <Zap size={14} className="text-[#6366F1]" /> Getting Started
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-md bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold flex items-center justify-center shrink-0">1</div>
                          <span className="text-sm font-semibold text-black">Connect your Instagram profile</span>
                        </div>

                        <div className="flex items-center gap-3 opacity-60">
                          <div className="w-6 h-6 rounded-md bg-zinc-200 text-black opacity-80 text-xs font-bold flex items-center justify-center shrink-0">2</div>
                          <span className="text-sm font-medium text-black opacity-80">Set up comment auto-replies</span>
                        </div>

                        <div className="flex items-center gap-3 opacity-60">
                          <div className="w-6 h-6 rounded-md bg-zinc-200 text-black opacity-80 text-xs font-bold flex items-center justify-center shrink-0">3</div>
                          <span className="text-sm font-medium text-black opacity-80">Collect leads & grow audience</span>
                        </div>
                      </div>
                    </div>

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
          currentPlan={effectivePlan}
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
          currentPlan={effectivePlan}
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
          currentPlan={effectivePlan}
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
                className="relative w-full max-w-2xl bg-white rounded-md-[32px]-2xl border border-zinc-200/60 overflow-hidden"
              >
                <div className="p-6 border-b border-zinc-100 flex items-center gap-4">
                  <Search className="text-[#6366F1]" size={24} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search campaigns, users, or automation logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-black placeholder:text-black opacity-60"
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 hover:bg-zinc-100 rounded-md transition-colors text-black opacity-60"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {searchQuery.length === 0 ? (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-[10px] font-semibold text-black opacity-60 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {quickActions.map((action, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setActiveTab(action.tab);
                                setIsSearchOpen(false);
                              }}
                              className="flex items-center justify-between p-4 rounded-md-2xl bg-zinc-50 border border-zinc-100 hover:border-[#6366F1]/30 hover:bg-[#6366F1]/5 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md bg-white border border-zinc-200 flex items-center justify-center text-[#6366F1]">
                                  <action.icon size={18} />
                                </div>
                                <span className="text-sm font-semibold text-black group-hover:text-black">{action.name}</span>
                              </div>
                              <ArrowRight size={16} className="text-zinc-300 group-hover:text-[#6366F1] transition-colors" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[10px] font-semibold text-black opacity-60 mb-4">Recent Searches</h3>
                        <div className="space-y-2">
                          {recentSearches.map((search, i) => (
                            <button
                              key={i}
                              onClick={() => setSearchQuery(search)}
                              className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-zinc-50 transition-colors text-sm text-black opacity-90 group"
                            >
                              <Clock size={16} className="text-zinc-300 group-hover:text-black opacity-80" />
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
                          <h3 className="text-[10px] font-semibold text-black opacity-60 mb-4 px-2">Search Results</h3>
                          {filteredResults.map((result, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setActiveTab(result.url);
                                setIsSearchOpen(false);
                              }}
                              className="w-full flex items-center justify-between p-3 rounded-md hover:bg-zinc-50 transition-colors text-sm group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md bg-zinc-100 flex items-center justify-center text-black opacity-80">
                                  <result.icon size={18} />
                                </div>
                                <div className="text-left">
                                  <div className="font-semibold text-black">{result.title}</div>
                                  <div className="text-xs text-black opacity-80">{result.type}</div>
                                </div>
                              </div>
                              <ArrowRight size={16} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="py-12 text-center">
                          <div className="w-16 h-16 bg-zinc-50 rounded-md flex items-center justify-center mx-auto mb-4">
                            <Search className="text-zinc-300" size={32} />
                          </div>
                          <h3 className="text-black font-semibold mb-1">{`No results for "${searchQuery}"`}</h3>
                          <p className="text-sm text-black opacity-80">Try searching for campaigns, keywords, or account settings.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-black opacity-60">
                      <span className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded-md text-black opacity-80 font-bold">ESC</span>
                      <span>to close</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-black opacity-60">
                      <span className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded-md text-black opacity-80 font-bold">↵</span>
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

      {/* ── Giveaway Congratulations Modal ── */}
      {showGiveawayModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm" onClick={() => setShowGiveawayModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
            {/* Top gradient bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

            {/* Confetti-like decorative blobs */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-100/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative p-8 text-center">
              {/* Icon */}
              <div className="mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-200">
                <span className="text-4xl">🎉</span>
              </div>

              {/* Number Badge */}
              {giveawayNumber && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-4">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Early Adopter #{giveawayNumber}</span>
                </div>
              )}

              <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">
                Welcome to Business Pro!
              </h2>
              <p className="text-sm font-medium text-zinc-500 leading-relaxed mb-6">
                You connected Instagram as one of our <strong className="text-zinc-800">first 50 users</strong>, so we&apos;re giving you <strong className="text-indigo-600">Business Pro absolutely FREE</strong> for the next <strong className="text-zinc-800">2 months</strong> as a thank you! 🚀
              </p>

              {/* What you unlocked */}
              <div className="bg-indigo-50/60 border border-indigo-100/80 rounded-xl p-4 mb-6 text-left space-y-2.5">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">What you&apos;ve unlocked</p>
                {[
                  "15,000 AI Credits / month",
                  "Unlimited Automations",
                  "Story Mention Triggers",
                  "Mini Store & Smart Bio",
                  "Priority Support",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-sm font-medium text-zinc-700">
                    <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowGiveawayModal(false)}
                className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm rounded-xl transition-all shadow-lg active:scale-95"
              >
                Start Exploring 🚀
              </button>
              <p className="text-[10px] text-zinc-400 font-medium mt-3">No credit card needed. Auto-expires after 2 months.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
