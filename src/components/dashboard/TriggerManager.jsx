"use client";

import { AnimatePresence,motion } from "framer-motion";
import { AlertCircle,ArrowRight,Brain,Calendar,Camera,Check,CircleChevronLeft,Clock,Edit2,Gift,Globe,Loader2,MessageSquare,MousePointer2,Plus,Rocket,Send,Sparkles,Star,Trash2,Users,Video,X,Zap } from "lucide-react";
import { useEffect,useState } from "react";
import AutomationPreview from "./AutomationPreview";
import CampaignWizard from "./CampaignWizard";

export default function TriggerManager({ initialTriggers, media = [] }) {
  return (
    <div className="p-6 bg-white/40 backdrop-blur-3xl border border-zinc-200/80 rounded-xl shadow-xl w-full max-w-[1400px] mx-auto">
      <h2 className="text-xl font-black text-[#6366F1] tracking-tight">Trigger Manager</h2>
    </div>
  );
}

export function TriggerInputModal({ isOpen, onClose, onSelect, currentPlan = "free", onUpgradeClick }) {
  const [campaignName, setCampaignName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("comment_dm");

  if (!isOpen) return null;
  const handleCreate = () => {
    if (!campaignName.trim()) return;
    onSelect(selectedTemplate, campaignName.trim());
  };

  const strategies = [
    { 
      id: "comment_dm", 
      title: "Comment & DM Automator", 
      desc: "Send a DM and reply to comments when someone uses a keyword.",
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
      isPremium: false
    },
    { 
      id: "faq_assistant", 
      title: "AI FAQ Assistant", 
      desc: "Let AI automatically answer common questions about your products.",
      icon: Sparkles,
      color: "text-purple-600",
      bg: "bg-purple-50",
      isPremium: true,
      isAI: true
    },
    { 
      id: "sales_closer", 
      title: "AI Sales Closer", 
      desc: "Advanced AI that understands intent and works to close deals for you.",
      icon: Rocket,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      isPremium: true,
      isAI: true
    },
    { 
      id: "story_automator", 
      title: "Story Automator", 
      desc: "Auto-reply to Story mentions & replies with keywords or AI.",
      icon: Camera,
      color: "text-orange-600",
      bg: "bg-orange-50",
      isPremium: true
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xl" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white border border-zinc-200/60 rounded-[20px] sm:rounded-[28px] shadow-2xl p-4 sm:p-8 flex flex-col gap-4 sm:gap-6"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 shrink-0">
              <div>
                <h2 className="text-2xl sm:text-3xl font-medium text-zinc-950 tracking-tighter">Create New Campaign</h2>
                <p className="text-xs font-semibold text-zinc-400 mt-1">Set up automated reply rules</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2.5 rounded-xl text-zinc-400 hover:text-zinc-950 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="py-1 flex-1 space-y-4">
              <div className="space-y-2 sm:space-y-3">
                <label className="text-[12px] font-medium text-zinc-400 ml-1">Campaign Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Summer Giveaway Campaign" 
                  value={campaignName} 
                  onChange={(e) => setCampaignName(e.target.value)} 
                  className="w-full bg-zinc-50/80 hover:bg-white border border-zinc-200 hover:border-zinc-300 rounded-[14px] px-4 py-2.5 sm:px-5 sm:py-3 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none"
                />
              </div>

              <div className="space-y-2 sm:space-y-4">
                <label className="text-[12px] font-bold text-zinc-400 ml-1">Select Your Goal</label>
                <div className="flex flex-col gap-2 sm:gap-2.5">
                  {strategies.map((t) => {
                    const isLocked = t.isPremium && currentPlan === "free";
                    
                    return (
                      <div 
                        key={t.id} 
                        onClick={() => {
                          if (isLocked) {
                            onUpgradeClick?.(t.id);
                            return;
                          }
                          setSelectedTemplate(t.id);
                          if (!campaignName.trim()) {
                            setCampaignName(t.title);
                          }
                        }} 
                        className={`group border rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 sm:gap-4 transition-all duration-200 cursor-pointer overflow-visible ${
                          selectedTemplate === t.id 
                            ? 'border-[#6366F1] bg-[#6366F1]/5 shadow-sm shadow-[#6366F1]/10 ring-1 ring-[#6366F1]' 
                            : 'border-zinc-200/80 bg-white hover:border-zinc-300'
                        }`}
                      >
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                          selectedTemplate === t.id ? 'bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/20' : `${t.bg} ${t.color}`
                        }`}>
                          <t.icon size={20} className="sm:w-[22px] sm:h-[22px]" />
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-[13px] sm:text-sm font-bold tracking-tight transition-colors ${selectedTemplate === t.id ? 'text-[#6366F1]' : 'text-zinc-900 group-hover:text-[#6366F1]'}`}>
                              {t.title}
                            </h4>
                            {t.isAI && (
                              <span className="px-1.5 py-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-[9px] font-semibold rounded-md shadow-sm">
                                AI
                              </span>
                            )}
                            {isLocked && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded-md uppercase tracking-wider">
                                Pro
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] sm:text-xs font-medium text-zinc-500 leading-snug mt-0.5 sm:mt-1 pr-1">
                            {t.desc}
                          </p>
                        </div>

                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${
                          selectedTemplate === t.id 
                            ? 'bg-[#6366F1] border-[#6366F1]' 
                            : 'bg-zinc-100 border-zinc-200 group-hover:border-zinc-300'
                        }`}>
                          {selectedTemplate === t.id && <Check size={10} strokeWidth={3} className="text-white w-2 h-2 sm:w-2.5 sm:h-2.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:gap-4 border-t border-zinc-100 pt-4 sm:pt-5 mt-1 sm:mt-2 shrink-0">
              <button onClick={onClose} className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-all cursor-pointer">Cancel</button>
                <button 
                  onClick={handleCreate} 
                  disabled={!campaignName.trim()} 
                  className="w-full sm:flex-1 px-12 py-3.5 sm:py-4 bg-zinc-950 text-white rounded-xl text-[12px] font-semibold shadow-xl hover:shadow-2xl hover:bg-[#6366F1] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue to Editor <ArrowRight size={18} />
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


export function CampaignBuilderWorkspace({ automation, campaignName, templateKey, accountId, onClose, onPublish, currentPlan = "free", onUpgradeClick, media = [], stories = [] }) {
  const [scanningProfile, setScanningProfile] = useState(false);
  const [suggestedCampaigns, setSuggestedCampaigns] = useState(null);
  const [showSuggestionsDrawer, setShowSuggestionsDrawer] = useState(false);

  const [wizardValues, setWizardValues] = useState({
    keyword: "",
    response: "",
    type: templateKey === "story_mention" ? "STORY_REPLY" : "COMMENT",
    followerGate: false,
    publicReply: "",
    buttonText: "",
    buttonLink: "",
    syncStory: templateKey === "story_mention",
    faqEnabled: false,
    faqs: [
      { q: "What's the price?", a: "Our premium plan starts at $49/mo." },
      { q: "How to get started?", a: "Just click the link in my bio to sign up!" }
    ],
    leadCaptureEnabled: false,
    delaySetting: "instantly",
    campaignStrategy: templateKey || "comment_dm",
    storyCondition: "ANY",
    storyTriggerType: "MENTION"
  });

  // Sync templateKey to campaignStrategy if it changes
  useEffect(() => {
    if (templateKey) {
      const timer = setTimeout(() => {
        setWizardValues(prev => ({ ...prev, campaignStrategy: templateKey }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [templateKey]);

  const [activeStep, setActiveStep] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [activePreset, setActivePreset] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const activePostItem = media.find(m => selectedPosts.includes(m.id)) || media[0];
  const activePost = activePostItem ? ((activePostItem.media_type === "VIDEO" || activePostItem.media_product_type === "REELS") ? (activePostItem.thumbnail_url || activePostItem.media_url) : activePostItem.media_url) : null;

  const handleWizardChange = (newVals) => {
    setWizardValues(prev => ({ ...prev, ...newVals }));
    // Reset active preset if user manually changes something
    setActivePreset(null);
  };

  const handleAiAutofillSubmit = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt.trim() })
      });
      const data = await res.json();
      
      if (data.success) {
        setWizardValues(prev => ({
          ...prev,
          keyword: data.keyword || prev.keyword,
          response: data.response || prev.response,
          publicReply: data.publicReply || prev.publicReply,
          campaignStrategy: data.campaignStrategy || prev.campaignStrategy,
          type: data.campaignStrategy === "story_mention" ? "STORY_REPLY" : "COMMENT",
          buttonText: data.buttonText || prev.buttonText,
          buttonLink: data.buttonLink || prev.buttonLink,
          followerGate: data.followerGate !== undefined ? data.followerGate : prev.followerGate,
          leadCaptureEnabled: data.campaignStrategy === "lead_capture",
          syncStory: false
        }));
        
        // Jump to Step 3 so the user sees everything magically filled!
        setActiveStep(3);
        setAiPrompt("");
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScanProfileSuggestions = async () => {
    const handle = automation?.metadata?.ig_handle || automation?.page_name || "";
    if (!handle) {
      alert("Please ensure your connected account has a valid Instagram handle in settings/brand kit first!");
      return;
    }
    
    setScanningProfile(true);
    try {
      const res = await fetch("/api/ai/magic-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ig_handle: handle,
          brand_name: automation?.brand_name || "" 
        })
      });
      const data = await res.json();
      if (data.success && data.suggested_faqs?.length > 0) {
        setSuggestedCampaigns(data.suggested_faqs);
        setShowSuggestionsDrawer(true);
      } else {
        alert("Could not generate custom suggestions. Try using the AI prompt bar instead!");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating suggestions.");
    } finally {
      setScanningProfile(false);
    }
  };

  const applySuggestedCampaign = (faq) => {
    setWizardValues(prev => ({
      ...prev,
      keyword: faq.keyword || prev.keyword,
      response: faq.response || prev.response,
      campaignStrategy: "comment_dm",
      type: faq.type || "COMMENT",
      buttonText: faq.button_text || "Get Now 🔗",
      buttonLink: faq.button_link || "https://automixa.in",
      syncStory: false
    }));
    
    // Jump to Step 3 so the user sees everything magically filled!
    setActiveStep(3);
    setShowSuggestionsDrawer(false);
  };

  const applyQuickPreset = (preset) => {
    if (preset === "auto_reply") {
      setWizardValues(prev => ({ ...prev, keyword: "price", response: "Hey! Check your DMs for the full pricing guide and brochure link 📦", publicReply: "Just sent you our complete pricing guide in DMs! 📬", campaignStrategy: "comment_dm", buttonText: "View Pricing", buttonLink: "https://automixa.com/pricing", faqEnabled: true, syncStory: true }));
    } else if (preset === "lead_capture") {
      setWizardValues(prev => ({ ...prev, keyword: "guide", response: "Here is your free e-book download link! Happy reading 📖", publicReply: "Check your DMs for the instant download link! 📚", campaignStrategy: "lead_capture", buttonText: "Download PDF", buttonLink: "https://automixa.com/guide", leadCaptureEnabled: true, syncStory: true }));
    } else if (preset === "discount") {
      setWizardValues(prev => ({ ...prev, keyword: "offer", response: "Use code VIP25 for 25% off your next order! 🎉 Valid for 48 hours.", publicReply: "Sent you the VIP discount code via DM! 🎁", campaignStrategy: "comment_dm", buttonText: "Shop Sale", buttonLink: "https://automixa.com/sale", syncStory: true }));
    } else if (preset === "welcome_dm") {
      setWizardValues(prev => ({ ...prev, keyword: "hello", response: "Thanks for tagging us! Welcome to our VIP community ✨", publicReply: "Thanks for the mention! Sent you a welcome surprise in DMs 🎉", campaignStrategy: "story_mention", buttonText: "VIP Lounge", buttonLink: "https://automixa.com/vip", syncStory: true }));
    } else if (preset === "faq") {
      setWizardValues(prev => ({ 
        ...prev, 
        keyword: "help", 
        response: "I'm your AI assistant! ✨ I can help with pricing, services, and support. What would you like to know?", 
        publicReply: "Sure! Just sent you a DM to help you out. 📬", 
        campaignStrategy: "faq_assistant", 
        buttonText: "View FAQs", 
        buttonLink: "https://automixa.com/faq",
        faqEnabled: true,
        syncStory: true
      }));
    } else if (preset === "giveaway") {
      setWizardValues(prev => ({ ...prev, keyword: "win", response: "You're entered! 🎁 Check your DMs for your entry confirmation and extra bonus tasks to increase your chances!", publicReply: "Good luck! 🍀 Just sent you the entry confirmation in DMs!", campaignStrategy: "comment_dm", buttonText: "Entry Status", buttonLink: "https://automixa.com/giveaway", syncStory: true }));
    } else if (preset === "appointment") {
      setWizardValues(prev => ({ ...prev, keyword: "book", response: "I'd love to help you get started! 📅 Tap the link below to pick a time that works for you.", publicReply: "Perfect! 🗓️ Sent you my booking calendar link in DMs!", campaignStrategy: "comment_dm", buttonText: "Schedule Now", buttonLink: "https://calendly.com/automixa", syncStory: true }));
    } else if (preset === "waitlist") {
      setWizardValues(prev => ({ ...prev, keyword: "join", response: "You're on the list! 🚀 We'll notify you the moment we launch. Check your DMs for your queue position.", publicReply: "Welcome to the inner circle! 💎 Sent you the waitlist details!", campaignStrategy: "lead_capture", buttonText: "View Position", buttonLink: "https://automixa.com/waitlist", leadCaptureEnabled: true, syncStory: true }));
    } else if (preset === "webinar") {
      setWizardValues(prev => ({ ...prev, keyword: "training", response: "Awesome! 🎬 You're registered for our live training. I've sent the access link to your DMs.", publicReply: "See you there! 🍿 Sent the private training link to your DMs!", campaignStrategy: "comment_dm", buttonText: "Access Link", buttonLink: "https://automixa.com/webinar", syncStory: true }));
    } else if (preset === "review") {
      setWizardValues(prev => ({ ...prev, keyword: "love", response: "So glad you're enjoying it! ❤️ Would you mind leaving a quick review? It helps us a ton!", publicReply: "Thank you for the love! 🙏 Sent you a quick link to share your feedback!", campaignStrategy: "comment_dm", buttonText: "Leave Review", buttonLink: "https://automixa.com/reviews", syncStory: true }));
    }
    
    setActivePreset(preset);
    // Jump to Step 3 (Response) so the user sees everything magically filled!
    setActiveStep(3);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-2 pb-4">
      
      <div className="p-3 sm:p-4 space-y-3">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={onClose} className="p-2.5 cursor-pointer text-zinc-500 hover:text-zinc-950 transition-all shrink-0">
              <CircleChevronLeft size={20} />
            </button>
            <h1 className="text-lg font-bold text-zinc-950 truncate">
              {campaignName || "Create"}
            </h1>
          </div>

          {wizardValues.campaignStrategy !== "faq_bot" && wizardValues.campaignStrategy !== "sales_closer" && (
            <form onSubmit={handleAiAutofillSubmit} className="flex items-center max-w-xl w-full justify-end">
              <div className="relative flex-1 max-w-[420px] group">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    disabled={isGenerating}
                    placeholder={isGenerating ? "AI is copywriting your campaign... ✨" : "Describe your automation goal..."}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className={`w-full bg-zinc-50/80 hover:bg-white border border-zinc-200 hover:border-zinc-300 rounded-[14px] px-4 py-2.5 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none ${isGenerating ? 'opacity-85 animate-pulse bg-indigo-50/20 border-[#6366F1]/20' : ''}`}
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="absolute right-1.5 w-16 h-9 bg-[#6366F1] hover:bg-[#5255e0] text-white rounded-xl shadow-lg shadow-[#6366F1]/30 transition-all flex items-center justify-center group/btn disabled:opacity-40"
                  >
                    {isGenerating ? (
                      <Loader2 size={16} className="animate-spin text-white" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {wizardValues.campaignStrategy !== "faq_assistant" && wizardValues.campaignStrategy !== "sales_closer" && wizardValues.campaignStrategy !== "story_automator" && (
          <div className="flex items-center gap-2 flex-wrap pt-2">
              <button
                type="button"
                onClick={handleScanProfileSuggestions}
                disabled={scanningProfile}
                className="px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5255e0] hover:to-[#7c4df2] text-white rounded-full text-[12px] font-normal shadow-md hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
              >
                {scanningProfile ? (
                  <>
                    <Loader2 size={12} className="animate-spin text-white" />
                    <span>Scanning Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={12} className="animate-pulse" />
                    <span>AI Suggest from Profile</span>
                  </>
                )}
              </button>

              {[
                { id: "auto_reply", label: "Auto Reply", icon: Zap },
                { id: "lead_capture", label: "Lead Capture", icon: Users },
                { id: "discount", label: "Discount", icon: Rocket },
                { id: "giveaway", label: "Giveaway", icon: Gift },
                { id: "appointment", label: "Booking", icon: Calendar },
                { id: "waitlist", label: "Waitlist", icon: Clock },
                { id: "webinar", label: "Webinar", icon: Video },
                { id: "review", label: "Reviews", icon: Star },
                { id: "welcome_dm", label: "Welcome", icon: MessageSquare },
                { id: "faq", label: "AI FAQ", icon: Brain, isPremium: true }
              ].map((chip) => {
                const isLocked = chip.isPremium && currentPlan === "free";
                
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => {
                      if (isLocked) {
                        alert("The AI FAQ preset is a Pro feature. Please upgrade.");
                        return;
                      }
                      applyQuickPreset(chip.id);
                    }}
                    className={`px-4 py-2 border rounded-full text-[12px] font-normal transition-all flex items-center gap-2 group/chip ${
                      activePreset === chip.id 
                        ? 'bg-[#6366F1] border-[#6366F1] text-white shadow-[#6366F1]/20 -translate-y-0.5' 
                        : 'bg-white border-zinc-200/60 hover:border-[#6366F1]/30 hover:bg-[#6366F1]/5 text-zinc-500 hover:text-[#6366F1] hover:-translate-y-0.5'
                    }`}
                  >
                    <chip.icon size={12} className={`${activePreset === chip.id ? 'text-white' : 'text-zinc-400 group-hover/chip:text-[#6366F1]'} transition-colors`} />
                    {chip.label}
                    {isLocked && <span className="ml-1 text-[8px] bg-amber-100 text-amber-700 px-1 py-0.5 rounded font-bold uppercase tracking-widest">Pro</span>}
                  </button>
                );
              })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sticky Sidebar Column */}
        <div className="lg:col-span-4 lg:sticky lg:top-4 self-start z-20 h-fit">
          <div className="bg-white border border-zinc-200/60 rounded-xl p-4 shadow-xl shadow-zinc-200/20">
            <AutomationPreview 
              keyword={wizardValues.keyword}
              response={wizardValues.response}
              type={wizardValues.type}
              buttonText={wizardValues.buttonText}
              buttonLink={wizardValues.buttonLink}
              publicReply={wizardValues.publicReply}
              postUrl={wizardValues.type === "COMMENT" ? activePost : null}
              aiName={campaignName || "Automixa AI"}
              strategy={wizardValues.campaignStrategy}
              faqs={wizardValues.faqs}
              aiPersona={wizardValues.aiPersona}
              aiUseEmojis={wizardValues.aiUseEmojis}
              aiGoal={wizardValues.aiGoal}
              aiKnowledge={wizardValues.aiKnowledge}
            />
            

          </div>
        </div>

        <div className="lg:col-span-8">
          <CampaignWizard 
            step={activeStep}
            onStepChange={setActiveStep}
            values={wizardValues}
            onChange={handleWizardChange}
            onBack={onClose}
            media={media}
            stories={stories && stories.length > 0 
              ? stories.map(s => ({
                  id: s.id,
                  media_url: s.media_url || s.thumbnail_url,
                  timestamp: s.timestamp 
                    ? new Date(s.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                    : 'Active'
                }))
              : INSTAGRAM_STORIES_MOCK}
            selectedPosts={selectedPosts}
            onSelectPosts={(selection) => setSelectedPosts(selection)}
            currentPlan={currentPlan}
            onUpgradeClick={onUpgradeClick}
            onPublish={(keyword, response, opts) => {
              onPublish(keyword, response, {
                ...opts,
                target_media_ids: selectedPosts.length > 0 ? selectedPosts : null,
                campaign_name: campaignName
              });
            }}
          />
        </div>
      </div>

      {showSuggestionsDrawer && suggestedCampaigns && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xl" onClick={() => setShowSuggestionsDrawer(false)} />
          
          <div className="relative w-full max-w-2xl bg-white border border-zinc-200/60 rounded-[20px] sm:rounded-xl shadow-2xl p-4 sm:p-10 flex flex-col gap-6 z-10 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <Sparkles size={20} className="text-[#6366F1] animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-zinc-950">AI Profile Suggestions</h2>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    Select a ready-to-use campaign generated from your IG profile
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowSuggestionsDrawer(false)} 
                className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-900 transition-all shadow-sm cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suggestedCampaigns.map((faq, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => applySuggestedCampaign(faq)}
                    className="p-5 bg-zinc-50 hover:bg-[#6366F1]/5 hover:border-[#6366F1]/40 border border-zinc-200/60 rounded-xl space-y-3 cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-0.5 bg-indigo-100/80 text-[#6366F1] font-black text-[9px] rounded uppercase tracking-wider">
                        Keyword: {faq.keyword}
                      </span>
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                        {faq.type || 'DM'} Campaign
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-900 group-hover:text-[#6366F1] transition-colors">
                      {faq.campaign_name}
                    </h4>

                    <p className="text-xs text-zinc-500 font-medium leading-relaxed bg-white border border-zinc-100 p-3 rounded-2xl group-hover:bg-white/60">
                      &ldquo;{faq.response}&rdquo;
                    </p>

                    <div className="flex items-center justify-between border-t border-zinc-200/50 pt-2 text-[10px] font-bold text-zinc-400">
                      <span>CTA Button:</span>
                      <span className="text-[#6366F1] bg-white border border-zinc-200/60 px-2 py-0.5 rounded-lg group-hover:bg-white">
                        {faq.button_text || "Get Now 🔗"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t border-zinc-100 pt-5">
               <button 
                 onClick={() => setShowSuggestionsDrawer(false)}
                 className="px-6 py-3.5 bg-zinc-950 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
               >
                 Close Drawer
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TriggerList({ triggers, media, onDelete, onEdit, onCreateNew, isMasterActive = true, error = null, onToggleActive }) {
  if (error) {
    return (
      <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-8 text-center text-rose-800 font-semibold text-xs sm:text-sm">
        <AlertCircle className="mx-auto mb-2" size={32} />
        <p>{error}</p>
      </div>
    );
  }

  if (!triggers || triggers.length === 0) {
    return (
      <div className="bg-white border border-zinc-200/60 rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
        <div className="w-14 h-14 bg-[#6366F1]/10 text-[#6366F1] rounded-xl flex items-center justify-center border border-[#6366F1]/20 shadow-sm">
          <Rocket size={24} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-1 tracking-tight">No Auto-Reply Rules Yet</h3>
          <p className="text-xs sm:text-sm font-normal text-zinc-500 max-w-md mx-auto leading-relaxed">
            You haven&apos;t set up any keywords to auto-reply to comments or DMs yet. Create one now to get started!
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-12 py-4 bg-[#6366F1] text-white rounded-xl text-[12px] font-semibold shadow-2xl transition-all flex items-center gap-2 hover:scale-[1.02]"
        >
          <Plus size={18} strokeWidth={2.5} /> <span>Create Auto-Reply</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tighter">Active Rules</h3>
          <p className="text-[13px] font-medium text-zinc-500 mt-1">Manage your auto-reply keywords and messages</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-[12px] font-bold px-4 py-2 rounded-xl shadow-sm border ${isMasterActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
            {triggers.length} Rules {isMasterActive ? 'Active' : 'Paused'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {triggers.map((t) => (
          <div 
            key={t.id} 
            className="bg-white border border-zinc-200 hover:border-[#6366F1]/30 rounded-[18px] p-4 sm:p-5 shadow-sm hover:shadow-md hover:shadow-[#6366F1]/5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group relative"
          >
            <div className="space-y-2 flex-1 min-w-0 relative z-10">
              {/* Top Row: Keyword and Badges */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="bg-[#6366F1]/10 text-[#6366F1] font-mono text-[13px] font-bold px-3 py-1 rounded-lg border border-[#6366F1]/20">
                  {t.keyword}
                </span>
                <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 border border-zinc-200">
                  {t.type === "COMMENT" ? "Comment" : t.type === "DM" ? "DM" : "Story"}
                </span>
                {t.metadata?.campaign_name && (
                  <span className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-500 max-w-[150px] truncate shrink-0">
                    📁 {t.metadata.campaign_name}
                  </span>
                )}
              </div>

              {/* Response Text Preview */}
              <div className="text-[14px] text-zinc-700 font-medium flex items-start gap-2">
                <span className="text-zinc-400 shrink-0 select-none">↳</span>
                <p className="line-clamp-1 italic">&ldquo;{t.response}&rdquo;</p>
              </div>

              {/* Public reply & Buttons */}
              {(t.variants?.public?.[0] || t.metadata?.button_link) && (
                <div className="flex items-center gap-3 flex-wrap text-[11px] pt-1">
                  {t.variants?.public?.[0] && (
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Globe size={12} className="text-[#6366F1]" />
                      <span className="font-medium truncate max-w-[200px]">Public: &ldquo;{t.variants.public[0]}&rdquo;</span>
                    </div>
                  )}

                  {t.metadata?.button_link && (
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <MousePointer2 size={12} className="text-[#6366F1]" />
                      <span className="font-medium">Button: {t.metadata.button_text || "Link"}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status & Actions Column */}
            <div className="flex items-center justify-between md:justify-end gap-4 self-stretch md:self-center shrink-0 border-t border-zinc-100 md:border-t-0 pt-3 md:pt-0 relative z-10">
              <div className="flex items-center gap-2.5 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-100">
                <span className="text-[11px] font-bold text-zinc-500">Active</span>
                <div 
                  onClick={() => onToggleActive && onToggleActive(t.id, t.metadata?.is_active !== false)}
                  className={`w-9 h-5 rounded-full relative cursor-pointer shadow-inner hover:opacity-90 transition-all duration-300 ${
                    t.metadata?.is_active !== false ? "bg-[#6366F1]" : "bg-zinc-300"
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${
                    t.metadata?.is_active !== false ? "right-0.5" : "left-0.5"
                  }`} />
                </div>
              </div>
              <div className="hidden md:block h-8 w-[1px] bg-zinc-200" />
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit(t)} 
                  className="w-9 h-9 bg-white border border-zinc-200 hover:border-[#6366F1]/50 rounded-xl text-zinc-500 hover:text-[#6366F1] hover:bg-[#6366F1]/5 transition-all flex items-center justify-center shadow-sm"
                  title="Edit Rule"
                >
                  <Edit2 size={15} />
                </button>
                <button 
                  onClick={() => onDelete(t.id)} 
                  className="w-9 h-9 bg-white border border-zinc-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 rounded-xl text-zinc-400 transition-all flex items-center justify-center shadow-sm"
                  title="Delete Rule"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const INSTAGRAM_POSTS_MOCK = [
  { id: "post_1", media_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80", caption: "New collection dropping tomorrow! 🚀 Comment 'PRICE' for early access link." },
  { id: "post_2", media_url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80", caption: "Free e-book giveaway! 📚 Comment 'GUIDE' to get the instant download link in your DMs." },
  { id: "post_3", media_url: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80", caption: "Limited time offer! 🎁 Tag a friend and comment 'OFFER' for a 20% discount code." }
];

export const INSTAGRAM_STORIES_MOCK = [
  { id: "story_1", media_url: "https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=800&q=80", timestamp: "2h ago" },
  { id: "story_2", media_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80", timestamp: "5h ago" },
  { id: "story_3", media_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80", timestamp: "12h ago" }
];
