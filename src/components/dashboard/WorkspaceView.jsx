"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { AlertCircle, Zap, ArrowRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { TriggerList } from "@/components/dashboard/TriggerManager";
import AutomationSidebar from "@/components/dashboard/AutomationSidebar";
import CreatorOverview from "@/components/dashboard/CreatorOverview";
import FanEngagement from "@/components/dashboard/FanEngagement";
import BrandKit from "@/components/dashboard/BrandKit";
import GeneralSettings from "@/components/dashboard/GeneralSettings";
import PostPicker from "@/components/dashboard/PostPicker";
import CampaignWizard from "@/components/dashboard/CampaignWizard";
import AutomationPreview from "@/components/dashboard/AutomationPreview";
import EditTriggerModal from "@/components/dashboard/EditTriggerModal";
import HelpRequests from "@/components/dashboard/HelpRequests";
import Loader from "@/components/ui/Loader";

export default function WorkspaceView({ accountId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("list");
  const [automation, setAutomation] = useState(null);
  const [triggers, setTriggers] = useState([]);
  const [error, setError] = useState(null);
  const [triggersError, setTriggersError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState(null);
  const [selectedMediaIds, setSelectedMediaIds] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [response, setResponse] = useState("");
  const [type, setType] = useState("COMMENT");
  const [followerGate, setFollowerGate] = useState(false);
  const [publicReply, setPublicReply] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [media, setMedia] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [mediaError, setMediaError] = useState(null);
  const [dbStats, setDbStats] = useState({
    totalDms: 0, autoReplies: 0, storyReplies: 0,
    uniqueUsers: 0, engagementRate: "0%", recentLogs: [], topKeywords: []
  });

  const fetchData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const isDevBypass = ["localhost", "127.0.0.1"].includes(window.location.hostname);
      const currentUser = authUser || (isDevBypass ? { id: "dev-bypass", user_metadata: { full_name: "Dev User" } } : null);

      if (!currentUser) { onBack(); return; }

      let { data: auto, error: autoError } = await supabase
        .from("automations").select("*")
        .eq("id", accountId).eq("user_id", currentUser.id).maybeSingle();

      if (!auto || autoError) {
        setError(`Automation not found (ID: ${accountId}).`);
        setLoading(false);
        return;
      }

      let { data: trig, error: trigError } = await supabase
        .from("triggers").select("*").eq("automation_id", accountId)
        .order("created_at", { ascending: false });

      setAutomation({ ...auto, user: currentUser });
      setTriggers(trig || []);
      setTriggersError(trigError?.message || null);

      try {
        setLoadingMedia(true);
        const res = await fetch(`/api/media?automationId=${accountId}`);
        const data = await res.json();
        if (data.error || data.diagnostic) setMediaError(data.details || data.error);
        setMedia(data.media || []);
      } catch { setMediaError("API Connection Failed"); }
      finally { setLoadingMedia(false); }

      const { data: allLogs, count: totalHistory } = await supabase
        .from("automation_history")
        .select("keyword, type, sender_id", { count: "exact" })
        .eq("automation_id", accountId);

      const logsArray = allLogs || [];
      const totalCount = totalHistory || 0;
      const storyCount = logsArray.filter(l => l.type === "STORY_REPLY").length;
      const uniqueSenders = new Set(logsArray.map(l => l.sender_id)).size;

      const { data: latestLogs } = await supabase
        .from("automation_history").select("*").eq("automation_id", accountId)
        .order("created_at", { ascending: false }).limit(20);

      const keywordCounts = logsArray.reduce((acc, curr) => {
        if (curr.keyword && curr.keyword !== "UNMATCHED") acc[curr.keyword] = (acc[curr.keyword] || 0) + 1;
        return acc;
      }, {});
      const sortedKeywords = Object.entries(keywordCounts)
        .sort(([, a], [, b]) => b - a).slice(0, 5)
        .map(([keyword, count]) => ({ keyword, count, percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0 }));

      const followersFromGate = logsArray.filter(l => l.metadata?.funnel_complete).length;
      const calculatedRate = uniqueSenders > 0 ? Math.round((followersFromGate / uniqueSenders) * 100) : 0;

      setDbStats({
        totalDms: totalCount, autoReplies: totalCount, storyReplies: storyCount,
        uniqueUsers: uniqueSenders, engagementRate: `${calculatedRate}%`,
        followerGrowth: followersFromGate, recentLogs: latestLogs || [], topKeywords: sortedKeywords
      });

      setLoading(false);
    } catch (e) {
      console.error("WorkspaceView fetch error:", e);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  }, [accountId, onBack]);

  useEffect(() => {
    const initial = setTimeout(() => fetchData(), 0);
    const interval = setInterval(fetchData, 30000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [fetchData]);

  const handleUpdateAutomation = async (payload, refresh = true) => {
    const supabase = createClient();
    await supabase.from("automations").update(payload).eq("id", accountId);
    if (refresh) fetchData();
    else setAutomation(prev => ({ ...prev, ...payload }));
  };

  const handleDeleteAutomation = async (autoId) => {
    const supabase = createClient();
    await supabase.from("automations").delete().eq("id", autoId);
    onBack();
  };

  const handleTriggerAdd = async (keyword, response, metadata) => {
    const supabase = createClient();
    const { error } = await supabase.from("triggers").insert({
      automation_id: accountId, keyword, response,
      type: metadata.type || "DM",
      variants: { dm: [response], public: metadata.public_reply ? [metadata.public_reply] : [] },
      metadata: { follower_gate: metadata.follower_gate, button_text: metadata.button_text, button_link: metadata.button_link },
      target_media_ids: selectedMediaIds
    });
    if (error) alert("Failed to create rule: " + error.message);
    else { setViewMode("list"); fetchData(); }
  };

  const handleOpenEdit = (trigger) => {
    setEditingTrigger(trigger);
    setSelectedMediaIds(trigger.target_media_ids || []);
    setIsEditModalOpen(true);
  };

  const handleTriggerUpdate = async (triggerId, data) => {
    const supabase = createClient();
    const { error } = await supabase.from("triggers").update({
      keyword: data.keyword, response: data.response, type: data.type,
      metadata: data.metadata, variants: data.variants, target_media_ids: selectedMediaIds
    }).eq("id", triggerId);
    if (error) alert("Failed to update rule: " + error.message);
    else { setIsEditModalOpen(false); setEditingTrigger(null); fetchData(); }
  };

  const handleTriggerDelete = async (triggerId) => {
    const supabase = createClient();
    const { error } = await supabase.from("triggers").delete().eq("id", triggerId);
    if (error) alert("Failed to delete rule: " + error.message);
    else fetchData();
  };

  const startNewRule = () => {
    setKeyword(""); setResponse(""); setType("COMMENT");
    setFollowerGate(false); setPublicReply(""); setButtonText(""); setButtonLink("");
    setSelectedMediaIds([]); setViewMode("create");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <CreatorOverview stats={dbStats} history={dbStats.recentLogs} topTriggers={dbStats.topKeywords} automationId={accountId} />;

      case "automations":
        if (triggers.length === 0 && viewMode !== "create") {
          return (
            <div className="h-full flex items-center justify-center">
              <div onClick={startNewRule} className="group w-full max-w-xl bg-white border border-border rounded-[48px] p-12 text-center cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-foreground text-background rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:rotate-12 transition-transform duration-500">
                    <Zap size={36} fill="currentColor" />
                  </div>
                  <h2 className="text-3xl font-semibold text-foreground tracking-normal mb-4">Create Your First Automation</h2>
                  <p className="text-zinc-muted text-sm font-normal max-w-sm mx-auto leading-relaxed mb-10 opacity-70">
                    Set up keywords, auto-replies, and intelligent flows in seconds.
                  </p>
                  <div className="flex items-center gap-3 px-8 py-4 bg-zinc-50 border border-border rounded-full text-xs font-semibold text-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                    <span>Get Started</span><ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (viewMode === "create") {
          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white border border-border rounded-[32px] overflow-hidden shadow-sm">
                  <PostPicker automationId={accountId} media={media} loading={loadingMedia} error={mediaError} onSelect={setSelectedMediaIds} selectedPosts={selectedMediaIds} layout="horizontal" />
                </div>
                <CampaignWizard
                  onBack={() => setViewMode("list")}
                  values={{ keyword, response, type, followerGate, publicReply, buttonText, buttonLink }}
                  onChange={(newData) => {
                    if (newData.keyword !== undefined) setKeyword(newData.keyword);
                    if (newData.response !== undefined) setResponse(newData.response);
                    if (newData.type !== undefined) setType(newData.type);
                    if (newData.followerGate !== undefined) setFollowerGate(newData.followerGate);
                    if (newData.publicReply !== undefined) setPublicReply(newData.publicReply);
                    if (newData.buttonText !== undefined) setButtonText(newData.buttonText);
                    if (newData.buttonLink !== undefined) setButtonLink(newData.buttonLink);
                  }}
                  onPublish={handleTriggerAdd}
                />
              </div>
              <div className="lg:col-span-4 sticky top-24">
                <AutomationPreview keyword={keyword} response={response} type={type} buttonText={buttonText} buttonLink={buttonLink} publicReply={publicReply} postUrl={media.find(m => selectedMediaIds.includes(m.id))?.media_url} botName={automation?.page_name || "Automixa Bot"} />
              </div>
            </div>
          );
        }

        return (
          <div className="flex flex-col h-full gap-6">
            <div className="flex items-center justify-between px-4 py-6 bg-white border border-border rounded-[32px] shadow-sm">
              <div>
                <h2 className="text-2xl font-semibold text-foreground tracking-tight">Your Automations</h2>
                <p className="text-sm text-zinc-muted">You have {triggers.length} active auto replies</p>
              </div>
              <button onClick={startNewRule} className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full text-sm font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">
                <Plus size={18} /> Add New Reply
              </button>
            </div>
            <TriggerList triggers={triggers} media={media} onDelete={handleTriggerDelete} onEdit={handleOpenEdit} error={triggersError} />
          </div>
        );

      case "fan-engagement":
        return <FanEngagement stats={dbStats} history={dbStats.recentLogs} />;

      case "brand-kit":
        return <BrandKit automation={automation} onUpdate={handleUpdateAutomation} />;

      case "help-requests":
        return <HelpRequests automationId={accountId} />;

      case "settings":
        return <GeneralSettings automation={automation} onUpdate={handleUpdateAutomation} onDelete={handleDeleteAutomation} />;

      default:
        return <CreatorOverview stats={dbStats} history={dbStats.recentLogs} topTriggers={dbStats.topKeywords} />;
    }
  };

  if (loading) return <Loader fullScreen text="Loading Workspace..." />;

  if (error) {
    return (
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle size={48} className="text-red-500 mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Workspace Error</h1>
          <p className="text-zinc-muted mb-8 max-w-md">{error}</p>
          <button onClick={onBack} className="px-8 py-3 bg-foreground text-background rounded-2xl font-bold hover:scale-105 transition-all">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <AutomationSidebar
        accountId={accountId}
        persona={automation?.persona}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={onBack}
      />
      <main className="flex-1 bg-background h-[calc(100vh-72px)] overflow-y-auto no-scrollbar">
        <div className="max-w-7xl mx-auto p-6 md:p-8 h-full text-foreground relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + viewMode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <EditTriggerModal
        isOpen={isEditModalOpen}
        trigger={editingTrigger}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleTriggerUpdate}
      />
    </div>
  );
}
