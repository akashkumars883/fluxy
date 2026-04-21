"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Bell, AlertCircle, Zap, ArrowRight, ArrowLeft, Plus, X } from "lucide-react";

// Components
import AiSettingsCard from "@/components/dashboard/AiSettingsCard";
import { TriggerList } from "@/components/dashboard/TriggerManager";
import AutomationSidebar from "@/components/dashboard/AutomationSidebar";
import CreatorOverview from "@/components/dashboard/CreatorOverview";
import FanEngagement from "@/components/dashboard/FanEngagement";
import BrandKit from "@/components/dashboard/BrandKit";
import GeneralSettings from "@/components/dashboard/GeneralSettings";
import PostPicker from '@/components/dashboard/PostPicker';
import CampaignWizard from '@/components/dashboard/CampaignWizard';
import AutomationPreview from '@/components/dashboard/AutomationPreview';
import EditTriggerModal from "@/components/dashboard/EditTriggerModal";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import Loader from "@/components/ui/Loader";

export default function AutomationEditor() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'create'
  const [automation, setAutomation] = useState(null);
  const [triggers, setTriggers] = useState([]);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);
  const [triggersError, setTriggersError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState(null);
  const [selectedMediaIds, setSelectedMediaIds] = useState([]);
  
  // Studio States (Lifted Up for Preview)
  const [keyword, setKeyword] = useState("");
  const [response, setResponse] = useState("");
  const [type, setType] = useState("COMMENT");
  const [followerGate, setFollowerGate] = useState(false);
  const [publicReply, setPublicReply] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  
  // Media State for PostPicker and Rule Thumbnails
  const [media, setMedia] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [mediaError, setMediaError] = useState(null);
  
  // Real-time Dashboard Stats
  const [dbStats, setDbStats] = useState({
    totalDms: 0,
    autoReplies: 0,
    storyReplies: 0,
    uniqueUsers: 0,
    engagementRate: "0%",
    recentLogs: [],
    topKeywords: []
  });

  // SMART RESOLUTION for legacy/UUID mapping
  const targetId = id === "test-id-123" ? "ffffffff-ffff-ffff-ffff-ffffffffffff" : id;

  const fetchData = async () => {
    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/login");
        return;
      }

      let { data: auto, error: autoError } = await supabase
        .from("automations")
        .select("*")
        .eq("id", targetId)
        .maybeSingle();
      
      if (!auto || autoError) {
        setError(`Automation Record Not Found (Searched ID: ${targetId}). Please re-connect your account from the dashboard.`);
        setLoading(false);
        return;
      }

      let { data: trig, error: trigError } = await supabase.from("triggers").select("*").eq("automation_id", targetId).order('created_at', { ascending: false });
      
      setAutomation({ ...auto, user: authUser });
      setTriggers(trig || []);
      setTriggersError(trigError?.message || null);

      // Fetch Media for the whole page
      try {
        setLoadingMedia(true);
        setMediaError(null);
        const res = await fetch(`/api/media?automationId=${targetId}`);
        const data = await res.json();
        
        if (data.error || data.diagnostic) {
          setMediaError(data.details || data.diagnostic || data.error);
        }
        
        setMedia(data.media || []);
      } catch (err) {
        console.error("Failed to fetch media:", err);
        setMediaError("API Connection Failed");
      } finally {
        setLoadingMedia(false);
      }

      const { data: allLogs, count: totalHistory } = await supabase
        .from('automation_history').select('keyword, type, sender_id', { count: 'exact' }).eq('automation_id', targetId);

      const logsArray = allLogs || [];
      const totalCount = totalHistory || 0;
      const storyCount = logsArray.filter(l => l.type === 'STORY_REPLY').length;
      const uniqueSenders = new Set(logsArray.map(l => l.sender_id)).size;
      const calculatedRate = uniqueSenders > 0 ? Math.min(Math.round((totalCount / uniqueSenders) * 20), 100) : 0;

      const { data: latestLogs } = await supabase.from('automation_history').select('*').eq('automation_id', targetId).order('created_at', { ascending: false }).limit(20);

      const keywordCounts = logsArray.reduce((acc, curr) => {
        if (curr.keyword && curr.keyword !== 'UNMATCHED') {
          acc[curr.keyword] = (acc[curr.keyword] || 0) + 1;
        }
        return acc;
      }, {});

      const sortedKeywords = Object.entries(keywordCounts).sort(([, a], [, b]) => b - a).slice(0, 5).map(([keyword, count]) => ({
        keyword, count, percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
      }));

      setDbStats({
        totalDms: totalCount, autoReplies: totalCount, storyReplies: storyCount,
        uniqueUsers: uniqueSenders, engagementRate: `${calculatedRate}%`,
        recentLogs: latestLogs || [], topKeywords: sortedKeywords
      });

      setLoading(false);
    } catch (e) {
      console.error("Fetch error:", e);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleUpdateAutomation = async (payload, refresh = true) => {
    const supabase = createClient();
    const { error: updateError } = await supabase.from("automations").update(payload).eq("id", targetId);
    if (!updateError && refresh) {
      fetchData();
    } else {
      setAutomation(prev => ({ ...prev, ...payload }));
    }
  };

  const handleDeleteAutomation = async (autoId) => {
    const supabase = createClient();
    await supabase.from("automations").delete().eq("id", autoId);
    router.push('/dashboard?success=account_disconnected');
  };

  const handleTriggerAdd = async (keyword, response, metadata) => {
    const supabase = createClient();
    const payload = {
      automation_id: targetId,
      keyword: keyword,
      response: response,
      type: metadata.type || "DM",
      variants: { 
        dm: [response], 
        public: metadata.public_reply ? [metadata.public_reply] : [] 
      },
      metadata: { 
        follower_gate: metadata.follower_gate, 
        button_text: metadata.button_text,
        button_link: metadata.button_link 
      },
      target_media_ids: selectedMediaIds
    };
    const { error } = await supabase.from("triggers").insert(payload);
    if (error) {
      console.error("Insert Error:", error);
      alert("Failed to create rule: " + error.message);
    } else {
      setViewMode('list');
      fetchData();
    }
  };

  const handleOpenEdit = (trigger) => {
    setEditingTrigger(trigger);
    setSelectedMediaIds(trigger.target_media_ids || []);
    setIsEditModalOpen(true);
  };

  const handleTriggerUpdate = async (triggerId, data) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("triggers")
      .update({
        keyword: data.keyword,
        response: data.response,
        type: data.type,
        metadata: data.metadata,
        variants: data.variants,
        target_media_ids: selectedMediaIds
      })
      .eq("id", triggerId);

    if (error) {
      console.error("Update Error:", error);
      alert("Failed to update rule: " + error.message);
    } else {
      setIsEditModalOpen(false);
      setEditingTrigger(null);
      fetchData();
    }
  };

  const handleTriggerDelete = async (triggerId) => {
    const supabase = createClient();
    const { error } = await supabase.from("triggers").delete().eq("id", triggerId);
    if (error) {
      alert("Failed to delete rule: " + error.message);
    } else {
      fetchData();
    }
  };

  const startNewRule = () => {
    setKeyword("");
    setResponse("");
    setType("COMMENT");
    setFollowerGate(false);
    setPublicReply("");
    setButtonText("");
    setButtonLink("");
    setSelectedMediaIds([]);
    setViewMode('create');
  };

  if (loading) return <Loader fullScreen text="Loading Workspace..." />;

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle size={48} className="text-red-500 mb-6" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Workspace Error</h1>
        <p className="text-zinc-muted mb-8 max-w-md">{error}</p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="px-8 py-3 bg-foreground text-background rounded-2xl font-bold hover:scale-105 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const renderContent = () => {
    // FORCE NO SCROLL IN STUDIO MODE
    const isStudio = viewMode === 'create';
    
    switch (activeTab) {
      case 'overview':
        return <CreatorOverview stats={dbStats} history={dbStats.recentLogs} topTriggers={dbStats.topKeywords} />;
      
      case 'automations':
        // 1. ZERO STATE
        if (triggers.length === 0 && viewMode !== 'create' && !isStarting) {
          return (
            <div className="h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
               <div 
                 onClick={startNewRule}
                 className="group w-full max-w-xl bg-white border border-border rounded-[48px] p-12 text-center cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -ml-16 -mb-16" />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-foreground text-background rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-foreground/20 group-hover:rotate-12 transition-transform duration-500">
                       <Zap size={36} fill="currentColor" />
                    </div>
                    <h2 className="text-3xl font-semibold text-foreground tracking-normal mb-4">Create Your First Automation</h2>
                    <p className="text-zinc-muted text-sm font-normal tracking-normal max-w-sm mx-auto leading-relaxed mb-10 opacity-70">
                      Start automating your Instagram interactions. Set up keywords, auto-replies, and intelligent flows in seconds.
                    </p>
                    <div className="flex items-center gap-3 px-8 py-4 bg-zinc-50 border border-border rounded-full text-xs font-semibold text-foreground tracking-normal group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                       <span>Get Started</span>
                       <ArrowRight size={16} />
                    </div>
                  </div>
               </div>
            </div>
          );
        }

        // 2. CREATION MODE: Studio Layout (Left: Selection + Form | Right: Mockup)
        if (viewMode === 'create') {
          return (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN: Selection & Configuration (PostPicker + Form) */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-6">
                  {/* UPPER: SELECTION */}
                  <div className="bg-white border border-border rounded-[32px] overflow-hidden shadow-sm">
                    <PostPicker 
                      automationId={targetId} 
                      media={media}
                      loading={loadingMedia}
                      error={mediaError}
                      onSelect={setSelectedMediaIds} 
                      selectedPosts={selectedMediaIds}
                      layout="horizontal"
                    />
                  </div>

                  {/* LOWER: THE FORM */}
                  <CampaignWizard 
                    onBack={() => setViewMode('list')}
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
                
                {/* RIGHT COLUMN: THE MOCKUP */}
                <div className="lg:col-span-12 xl:col-span-4 sticky top-24">
                  <AutomationPreview 
                    keyword={keyword}
                    response={response}
                    type={type}
                    buttonText={buttonText}
                    buttonLink={buttonLink}
                    publicReply={publicReply}
                    postUrl={media.find(m => selectedMediaIds.includes(m.id))?.media_url}
                    botName={automation?.page_name || "Automixa Bot"}
                  />
                </div>
              </div>
            </div>
          );
        }

        // 3. LIST VIEW: Your Automations (Default if triggers exist)
        return (
          <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-left-8 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex items-center justify-between px-4 py-6 bg-white border border-border rounded-[32px] shadow-sm">
               <div>
                  <h2 className="text-2xl font-semibold text-foreground tracking-tight">Your Automations</h2>
                  <p className="text-sm text-zinc-muted">You have {triggers.length} active auto replies</p>
               </div>
               <button 
                 onClick={startNewRule}
                 className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full text-sm font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
               >
                 <Plus size={18} /> Add New Reply
               </button>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
               <TriggerList 
                 triggers={triggers} 
                 media={media}
                 onDelete={handleTriggerDelete} 
                 onEdit={handleOpenEdit}
                 error={triggersError} 
               />
            </div>
          </div>
        );

      case 'fan-engagement':
        return <FanEngagement stats={dbStats} history={dbStats.recentLogs} />;

      case 'brand-kit':
        return <BrandKit automation={automation} onUpdate={handleUpdateAutomation} />;

      case 'settings':
        return <GeneralSettings automation={automation} onUpdate={handleUpdateAutomation} onDelete={handleDeleteAutomation} />;

      default:
        return <CreatorOverview stats={dbStats} history={dbStats.recentLogs} topTriggers={dbStats.topKeywords} />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
           <h2 onClick={() => router.push('/dashboard')} className="text-xl font-semibold tracking-normal text-foreground cursor-pointer">automixa</h2>
           <div className="h-5 w-[1px] bg-border"></div>
           <div className="flex items-center gap-2 text-foreground text-sm font-semibold">{automation?.page_name}</div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-zinc-muted hover:text-foreground hover:bg-background/50 rounded-full transition-all">
            <Bell size={20} />
          </button>
          <ProfileDropdown user={automation?.user} />
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <AutomationSidebar 
          accountId={targetId} 
          persona={automation?.persona} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <main className="flex-1 bg-background h-[calc(100vh-72px)] overflow-y-auto no-scrollbar">
          <div className="max-w-7xl mx-auto p-6 md:p-8 h-full text-foreground relative z-10">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <EditTriggerModal 
        isOpen={isEditModalOpen} 
        trigger={editingTrigger}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleTriggerUpdate}
      />
    </div>
  );
}
