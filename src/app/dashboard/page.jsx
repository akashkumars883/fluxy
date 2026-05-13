"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  Bell,
  Plus,
  Camera,
  Home,
  Cpu,
  Users,
  BarChart2,
  Settings,
  Lock,
  ChevronRight,
  Sparkles,
  MessageSquare,
  ArrowUpRight
} from "lucide-react";
import AccountCard from "@/components/dashboard/AccountCard";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import OnboardingModal from "@/components/dashboard/OnboardingModal";
import Loader from "@/components/ui/Loader";

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
  const router = useRouter();
  const initialOnboardingState = getInitialOnboardingState();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(initialOnboardingState.showOnboarding);
  const [onboardingStep, setOnboardingStep] = useState(initialOnboardingState.onboardingStep);
  const [connectedAccount] = useState(initialOnboardingState.connectedAccount);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const currentParams = new URLSearchParams(window.location.search);
      const { data: { user: authUser } } = await supabase.auth.getUser();

      const isDevBypass = ["localhost", "127.0.0.1"].includes(window.location.hostname);

      if (!authUser && !isDevBypass) {
        router.push("/login");
        return;
      }

      const currentUser = authUser || { id: "dev-bypass", user_metadata: { full_name: "Dev User" } };
      setUser(currentUser);

      let loadedAccounts = [];
      if (authUser) {
        const { data: accountsRaw } = await supabase.from("automations").select("*").eq("user_id", authUser.id);
        if (accountsRaw) loadedAccounts = accountsRaw;
      } else {
        const { data: accountsRaw } = await supabase.from("automations").select("*").eq("user_id", "dev-bypass");
        if (accountsRaw) loadedAccounts = accountsRaw;
      }

      setAccounts(loadedAccounts);

      if (loadedAccounts.length === 0 && currentParams.get("success") !== "instagram_connected") {
        setShowOnboarding(true);
        setOnboardingStep(1);
      }

      setLoading(false);
    };

    fetchData();

    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "instagram_connected" || params.get("start") === "onboarding") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [router]);

  const handleConnectClick = () => {
    setOnboardingStep(1);
    setShowOnboarding(true);
  };

  if (loading) return <Loader fullScreen text="Loading Dashboard..." />;

  const isNoAccounts = accounts.length === 0;

  const navigationItems = [
    { id: "home", label: "Home", icon: Home, locked: false },
    { id: "automations", label: "Automations", icon: Cpu, locked: isNoAccounts },
    { id: "audience", label: "Audience", icon: Users, locked: isNoAccounts },
    { id: "analytics", label: "Analytics", icon: BarChart2, locked: isNoAccounts },
    { id: "settings", label: "Settings", icon: Settings, locked: false },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col text-foreground">
      <OnboardingModal
        key={onboardingStep}
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        initialStep={onboardingStep}
        connectedAccount={connectedAccount}
      />

      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-zinc-200/80 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Automixa Logo" className="w-8 h-8 object-contain" />
          <h2
            onClick={() => window.location.href = '/dashboard'}
            className="text-xl font-extrabold tracking-tight text-foreground cursor-pointer"
          >
            automixa
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-zinc-500 hover:text-foreground hover:bg-zinc-100 rounded-full transition-all">
            <Bell size={18} />
          </button>
          <div className="h-6 w-[1px] bg-zinc-200" />
          <ProfileDropdown user={user} />
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex flex-1 relative">

        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-zinc-200/80 p-6 hidden md:flex flex-col gap-8 select-none">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase px-3 mb-2">Main Menu</p>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  disabled={item.locked}
                  onClick={() => !item.locked && setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-2xl font-bold text-sm transition-all ${
                    isActive
                      ? "bg-sage/10 text-sage"
                      : item.locked
                        ? "text-zinc-300 cursor-not-allowed"
                        : "text-zinc-500 hover:text-foreground hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.locked && <Lock size={12} className="text-zinc-300" />}
                </button>
              );
            })}
          </div>

          {/* Quick Help Box */}
          <div className="mt-auto bg-zinc-50 border border-zinc-200/60 rounded-3xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-sage/5 rounded-full -mr-8 -mt-8" />
            <Sparkles size={20} className="text-sage mb-3" />
            <h4 className="text-xs font-bold text-foreground mb-1">Need help setting up?</h4>
            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed mb-3">Check out our guided tutorial or read documentation.</p>
            <a href="#" className="text-xs font-bold text-sage hover:underline flex items-center gap-1">
              Read Docs <ArrowUpRight size={12} />
            </a>
          </div>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto w-full overflow-y-auto">

          {isNoAccounts ? (
            /* --- EMPTY STATE --- */
            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/50 pb-8">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-zinc-900">
                    Welcome to Automixa
                  </h1>
                  <p className="text-zinc-400 text-sm sm:text-base font-semibold">
                    Connect your Instagram account to activate premium automation features.
                  </p>
                </div>
                <button
                  onClick={handleConnectClick}
                  className="bg-sage text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 hover:shadow-lg hover:shadow-sage/20 transition-all flex items-center gap-2 self-start"
                >
                  <Plus size={16} /> Connect Instagram
                </button>
              </div>

              <div className="bg-sage/5 border border-sage/20 rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-sage/10 flex items-center justify-center text-sage shadow-sm shrink-0">
                    <Camera size={26} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-1">No Accounts Connected</h3>
                    <p className="text-xs text-zinc-400 font-semibold max-w-md leading-relaxed">
                      To start sending automated comment replies and direct messages, connect your Instagram account via Meta.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleConnectClick}
                  className="bg-white border border-zinc-200/80 text-foreground font-bold text-xs px-5 py-3 rounded-2xl hover:border-foreground hover:shadow-sm transition-all flex items-center gap-1 shrink-0"
                >
                  Configure Now <ChevronRight size={14} />
                </button>
              </div>

              {/* Templates */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-zinc-900">Explore Pre-built Templates</h2>
                  <span className="text-xs font-bold text-sage bg-sage/10 px-3 py-1.5 rounded-full">3 Ready-to-use</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: MessageSquare, color: "purple", title: "Comment-to-DM AutoReply", desc: "Instantly send a custom DM when a user comments a specific keyword on your post." },
                    { icon: Sparkles, color: "emerald", title: "Story Mention Responder", desc: "Boost loyalty by instantly replying with a personalized DM whenever a follower mentions you." },
                    { icon: Cpu, color: "blue", title: "24/7 FAQ Chatbot", desc: "Instantly resolve typical user questions regarding pricing, shipping, or hours in Instagram DMs." },
                  ].map(({ icon: Icon, color, title, desc }) => (
                    <div key={title} className={`bg-white border border-zinc-200/80 rounded-[32px] p-6 flex flex-col justify-between hover:shadow-xl transition-all group hover:border-${color}-200`}>
                      <div>
                        <div className={`w-12 h-12 bg-${color}-50 text-${color}-600 border border-${color}-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-all`}>
                          <Icon size={22} />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-2 leading-snug">{title}</h3>
                        <p className="text-xs text-zinc-400 font-semibold leading-relaxed mb-6">{desc}</p>
                      </div>
                      <button
                        onClick={handleConnectClick}
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-400 font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1 group-hover:bg-sage group-hover:text-white group-hover:border-sage transition-all"
                      >
                        <Lock size={12} /> Connect to Use
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* --- ACCOUNTS CONNECTED STATE --- */
            <div className="space-y-10">
              <header className="mb-10 text-left border-b border-zinc-200/50 pb-8">
                <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-zinc-900">
                  Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}
                </h1>
                <p className="text-zinc-400 text-sm sm:text-base font-semibold">Select an Instagram account to manage automations.</p>
              </header>

              {/* Account Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {accounts.map((acc) => (
                  <AccountCard key={acc.id} account={acc} onSelect={(acc) => {
                    // TODO: workspace will be built here
                    alert(`Selected: @${acc.metadata?.username || acc.page_name} — Workspace coming soon!`);
                  }} />
                ))}

                {/* Add Another Account */}
                <button
                  onClick={handleConnectClick}
                  className="border-2 border-dashed border-zinc-200 hover:border-sage hover:bg-sage/5 transition-all rounded-[32px] p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[220px]"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 hover:scale-105 transition-transform">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">Add Another Profile</h4>
                    <p className="text-xs text-zinc-400 font-medium mt-1">Connect another Instagram Business Page.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
