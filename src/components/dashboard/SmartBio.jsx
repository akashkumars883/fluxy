"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, User, Globe, Play, AtSign, Users2, Link2, Copy, Check, Trash2, Sparkles, Image, Upload, X, ExternalLink, Palette, AlignLeft, GripVertical, MoreHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useDashboard } from "@/context/DashboardContext";

// ─── THEMES ─────────────────────────────────────────────────────────────────
const THEMES = [
  {
    id: "ivory",
    name: "Ivory",
    heroStyle: { background: "#D6CFC4" },
    heroPattern: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35) 0%, transparent 55%), radial-gradient(circle at 70% 80%, rgba(180,160,140,0.3) 0%, transparent 55%)",
    pageBg: "#FAFAF8",
    textPrimary: "#1A1A1A",
    textSub: "#777777",
    buttonBg: "#FFFFFF",
    buttonBorder: "#EBEBEB",
    buttonText: "#1A1A1A",
    socialBg: "#FFFFFF",
    socialText: "#1A1A1A",
    footerText: "rgba(0,0,0,0.3)",
  },
  {
    id: "midnight",
    name: "Midnight",
    heroStyle: { background: "#111111" },
    heroPattern: "radial-gradient(circle at 50% 0%, rgba(80,80,80,0.4) 0%, transparent 70%)",
    pageBg: "#0D0D0D",
    textPrimary: "#FFFFFF",
    textSub: "#888888",
    buttonBg: "#1C1C1C",
    buttonBorder: "#2E2E2E",
    buttonText: "#FFFFFF",
    socialBg: "#1C1C1C",
    socialText: "#FFFFFF",
    footerText: "rgba(255,255,255,0.25)",
  },
  {
    id: "forest",
    name: "Forest",
    heroStyle: { background: "#1B4332" },
    heroPattern: "radial-gradient(circle at 30% 30%, rgba(45,106,79,0.6) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(0,60,30,0.4) 0%, transparent 60%)",
    pageBg: "#F2FAF5",
    textPrimary: "#1B4332",
    textSub: "#40916C",
    buttonBg: "#FFFFFF",
    buttonBorder: "#D8EDDF",
    buttonText: "#1B4332",
    socialBg: "#FFFFFF",
    socialText: "#1B4332",
    footerText: "rgba(27,67,50,0.35)",
  },
  {
    id: "blush",
    name: "Blush",
    heroStyle: { background: "#C9637A" },
    heroPattern: "radial-gradient(circle at 40% 20%, rgba(255,182,193,0.5) 0%, transparent 55%), radial-gradient(circle at 60% 80%, rgba(180,60,80,0.3) 0%, transparent 55%)",
    pageBg: "#FFF5F7",
    textPrimary: "#6B1F34",
    textSub: "#BE4A6A",
    buttonBg: "#FFFFFF",
    buttonBorder: "#FBCFE8",
    buttonText: "#6B1F34",
    socialBg: "#FFFFFF",
    socialText: "#6B1F34",
    footerText: "rgba(107,31,52,0.3)",
  },
  {
    id: "navy",
    name: "Ocean",
    heroStyle: { background: "#1E3A5F" },
    heroPattern: "radial-gradient(circle at 30% 40%, rgba(56,120,180,0.5) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(10,30,60,0.4) 0%, transparent 60%)",
    pageBg: "#F0F5FB",
    textPrimary: "#1E3A5F",
    textSub: "#4A7AB5",
    buttonBg: "#FFFFFF",
    buttonBorder: "#BFDBFE",
    buttonText: "#1E3A5F",
    socialBg: "#FFFFFF",
    socialText: "#1E3A5F",
    footerText: "rgba(30,58,95,0.3)",
  },
  {
    id: "aurora",
    name: "Aurora",
    heroStyle: { background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)" },
    heroPattern: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)",
    pageBg: "#faf8ff",
    textPrimary: "#2d1b69",
    textSub: "#6d28d9",
    buttonBg: "#FFFFFF",
    buttonBorder: "#ede9fe",
    buttonText: "#4f46e5",
    socialBg: "#FFFFFF",
    socialText: "#4f46e5",
    footerText: "rgba(79,70,229,0.3)",
  },
  {
    id: "sunset",
    name: "Sunset",
    heroStyle: { background: "linear-gradient(135deg, #f97316 0%, #ef4444 50%, #dc2626 100%)" },
    heroPattern: "radial-gradient(circle at 70% 30%, rgba(255,220,180,0.3) 0%, transparent 60%)",
    pageBg: "#fff8f5",
    textPrimary: "#7c2d12",
    textSub: "#c2410c",
    buttonBg: "#FFFFFF",
    buttonBorder: "#fed7aa",
    buttonText: "#7c2d12",
    socialBg: "#FFFFFF",
    socialText: "#7c2d12",
    footerText: "rgba(124,45,18,0.3)",
  },
  {
    id: "cyber",
    name: "Cyber",
    heroStyle: { background: "#0ea5e9" },
    heroPattern: "radial-gradient(circle at 50% 50%, rgba(14,165,233,0.3) 0%, transparent 80%)",
    pageBg: "#0f172a",
    textPrimary: "#38bdf8",
    textSub: "#94a3b8",
    buttonBg: "#1e293b",
    buttonBorder: "#334155",
    buttonText: "#38bdf8",
    socialBg: "#1e293b",
    socialText: "#38bdf8",
    footerText: "rgba(56,189,248,0.4)",
  },
  {
    id: "rose",
    name: "Crimson",
    heroStyle: { background: "#e11d48" },
    heroPattern: "radial-gradient(circle at 20% 80%, rgba(225,29,72,0.4) 0%, transparent 70%)",
    pageBg: "#4c0519",
    textPrimary: "#fda4af",
    textSub: "#fb7185",
    buttonBg: "#881337",
    buttonBorder: "#9f1239",
    buttonText: "#fda4af",
    socialBg: "#881337",
    socialText: "#fda4af",
    footerText: "rgba(253,164,175,0.4)",
  },
];

// ─── BG PRESETS for wallpaper-style backgrounds ──────────────────────────────
const IMAGE_WALLPAPERS = [
  { id: "none", label: "None", src: null },
  { id: "wallpaper1", label: "Purple Leaves", src: "/wallpapers/purple-leaves.jpg" },
];

// ─── SOCIAL ICON HELPER ──────────────────────────────────────────────────────
const getSocialMeta = (url) => {
  if (!url) return null;
  const l = url.toLowerCase();
  if (l.includes("instagram.com")) return { icon: <AtSign size={18} />, label: "Instagram" };
  // Only classify as social icon if it's a channel/profile, not a specific video
  if (l.includes("youtube.com") && !l.includes("watch?v=") && !l.includes("embed/")) return { icon: <Play size={18} />, label: "YouTube" };
  if (l.includes("twitter.com") || l.includes("x.com")) return { icon: <Globe size={18} />, label: "X" };
  if (l.includes("facebook.com")) return { icon: <Users2 size={18} />, label: "Facebook" };
  if (l.includes("linkedin.com")) return { icon: <Link2 size={18} />, label: "LinkedIn" };
  return null;
};

const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const ensureAbsoluteUrl = (url) => {
  if (!url) return "";
  let trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function SmartBio({ accountId, account, currentPlan = "free", onUpgradeClick }) {
  const { smartBioTab, setSmartBioTab } = useDashboard();
  const [links, setLinks] = useState([]);
  const [profileTitle, setProfileTitle] = useState("");
  const [bioText, setBioText] = useState("");
  const [themeId, setThemeId] = useState("ivory");
  const [bgPresetId, setBgPresetId] = useState("none");
  const [bgImageUrl, setBgImageUrl] = useState(""); // custom URL or base64
  const [bgImageMode, setBgImageMode] = useState("url"); // "url" | "upload"
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [enableEmailCapture, setEnableEmailCapture] = useState(false);
  const [emailCaptureTitle, setEmailCaptureTitle] = useState("Join my newsletter");
  const [emailCaptureButtonText, setEmailCaptureButtonText] = useState("Subscribe");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishedLink, setPublishedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const [activeLinkId, setActiveLinkId] = useState(null); // For uploading link thumbnail

  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const igUsername = account?.ig_username || account?.name || account?.page_name || "username";
  const profilePic = account?.profile_picture_url || account?.profile_pic || account?.metadata?.profile_picture_url || account?.metadata?.profile_pic || null;
  const displayName = profileTitle || account?.page_name || account?.name || igUsername;

  // Compute the actual background for the page
  const activeBgPreset = null;

  const getPublishedBg = () => {
    if (bgImageUrl) return `url("${bgImageUrl}")`;
    return theme.pageBg;
  };

  useEffect(() => {
    if (!accountId) return;
    async function loadSavedBio() {
      try {
        const supabase = createClient();
        const [settingsRes, linksRes] = await Promise.all([
          supabase.from("smart_bio_settings").select("*").eq("automation_id", accountId).single(),
          supabase.from("smart_bio_links").select("*").eq("automation_id", accountId).order("sort_order", { ascending: true }),
        ]);
        if (settingsRes.data) {
          setProfileTitle(settingsRes.data.profile_title || "");
          setBioText(settingsRes.data.bio_text || "");
          setThemeId(settingsRes.data.theme_preset || "ivory");
          setBgPresetId(settingsRes.data.bg_preset_id || "none");
          const preset = IMAGE_WALLPAPERS.find(w => w.id === settingsRes.data.bg_preset_id);
          setBgImageUrl(preset ? preset.src : "");
          setEnableEmailCapture(settingsRes.data.enable_email_capture || false);
          setEmailCaptureTitle(settingsRes.data.email_capture_title || "Join my newsletter");
          setEmailCaptureButtonText(settingsRes.data.email_capture_button_text || "Subscribe");
          setPublished(true);
          const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
          setPublishedLink(isLocal ? `${window.location.origin}/${igUsername}` : `https://automixa.in/${igUsername}`);
        } else {
          setProfileTitle(account?.page_name || account?.name || "");
        }
        if (linksRes.data && linksRes.data.length > 0) {
          setLinks(linksRes.data.map((l) => ({ id: l.id, title: l.title, url: l.url, thumbnail: l.thumbnail || "" })));
        }
      } catch (err) {
        setProfileTitle(account?.page_name || account?.name || "");
      } finally {
        setLoaded(true);
      }
    }
    loadSavedBio();
  }, [accountId]);

  const addLink = () => setLinks([...links, { id: `new_${Date.now()}`, title: "", url: "", thumbnail: "" }]);
  const updateLink = (id, field, value) => setLinks(links.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  const removeLink = (id) => setLinks(links.filter((l) => l.id !== id));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { toast.error("Image too large. Max 3MB allowed."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { setBgImageUrl(ev.target.result); setBgPresetId("none"); };
    reader.readAsDataURL(file);
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeLinkId) return;
    if (file.size > 1 * 1024 * 1024) { toast.error("Thumbnail too large. Max 1MB allowed."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateLink(activeLinkId, "thumbnail", ev.target.result);
      setActiveLinkId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // reset input
  };

  const handlePublish = async () => {
    if (!accountId) return;
    setPublishing(true);
    try {
      const supabase = createClient();
      const { error: settingsError } = await supabase.from("smart_bio_settings").upsert({
        automation_id: accountId,
        profile_title: profileTitle,
        bio_text: bioText,
        theme_preset: themeId,
        bg_preset_id: bgPresetId,
        enable_email_capture: enableEmailCapture,
        email_capture_title: emailCaptureTitle,
        email_capture_button_text: emailCaptureButtonText,
        updated_at: new Date().toISOString(),
      }, { onConflict: "automation_id" });
      if (settingsError) throw new Error(settingsError.message);

      const { error: deleteError } = await supabase.from("smart_bio_links").delete().eq("automation_id", accountId);
      if (deleteError) throw new Error(deleteError.message);

      const validLinks = links.filter((l) => l.title && l.url);
      if (validLinks.length > 0) {
        const { error: insertError } = await supabase.from("smart_bio_links").insert(
          validLinks.map((l, i) => ({ automation_id: accountId, title: l.title, url: l.url, thumbnail: l.thumbnail, sort_order: i }))
        );
        if (insertError) throw new Error(insertError.message);
      }

      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const link = isLocal ? `${window.location.origin}/${igUsername}` : `https://automixa.in/${igUsername}`;
      setPublishedLink(link);
      setPublished(true);
      toast.success("Smart Bio published successfully!");
    } catch (err) {
      console.error("Publishing failed:", err);
      toast.error(`Failed to publish: ${err.message || "Please check console logs."}`);
    } finally {
      setPublishing(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(publishedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = links.filter((l) => getSocialMeta(l.url));
  const standardLinks = links.filter((l) => !getSocialMeta(l.url));

  if (!accountId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
          <User size={26} className="text-zinc-400" />
        </div>
        <h3 className="text-base font-bold text-zinc-800">Connect an Account First</h3>
        <p className="text-sm text-zinc-400 max-w-xs">Please connect your Instagram account to set up your Smart Bio page.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-500 pb-8">

      {/* ── Upgrade Banner ── */}
      {currentPlan !== "viral_scale" && (
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold mb-0.5">{currentPlan === "free" ? "Upgrade to Business Pro" : "Upgrade to Viral Scale"}</h4>
              <p className="text-[10px] text-indigo-200 font-medium leading-normal max-w-md">
                {currentPlan === "free" ? "Unlimited replies, Mini Store, custom Smart Bio & priority support." : "50,000 monthly replies, advanced CRM & agency workspace."}
              </p>
            </div>
          </div>
          <button
            onClick={() => onUpgradeClick?.(currentPlan === "free" ? "creator_pro" : "viral_scale")}
            className="shrink-0 w-full sm:w-auto px-5 py-2 bg-white hover:bg-zinc-50 text-indigo-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* ── Published Banner ── */}
      {published && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-emerald-700">🎉 Your Smart Bio is Live!</p>
            <p className="text-xs text-emerald-600 truncate font-medium mt-0.5">{publishedLink}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyLink}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition-all"
            >
              {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
            </button>
            <a
              href={publishedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-xl hover:bg-emerald-200 transition-all"
            >
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      )}

      {/* ── Main Layout ── */}
      <div className="w-full flex flex-col md:flex-row gap-4">

        {/* LEFT: BUILDER */}
        <div className="w-full md:w-[55%] flex flex-col gap-6 pt-2">

          {/* Header & Publish Button */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight capitalize">
              {smartBioTab === "analytics" ? "Analytics" : smartBioTab}
            </h1>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 shrink-0 cursor-pointer shadow-lg shadow-zinc-900/20"
            >
              {publishing ? "Publishing..." : "Publish to Web"}
            </button>
          </div>

          {/* Mobile Tab Navigation (Hidden on Desktop) */}
          <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-transparent">
            {[
              { id: "analytics", label: "Analytics" },
              { id: "links", label: "Links" },
              { id: "profile", label: "Profile" },
              { id: "theme", label: "Theme" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSmartBioTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                  smartBioTab === tab.id
                    ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                    : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Editor Space Container */}
          <div className="bg-white rounded-[24px] border border-zinc-200 p-6 md:p-8 flex-1 flex flex-col shadow-sm">

            {/* ANALYTICS TAB */}
            {smartBioTab === "analytics" && (
              <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 border border-zinc-200 rounded-2xl flex flex-col justify-between">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      Views Today <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </p>
                    <p className="text-4xl font-black text-zinc-900 tracking-tight">1,248</p>
                    <p className="text-[11px] font-bold text-emerald-500 mt-2">
                      +14.5% <span className="text-zinc-400 font-medium">vs yesterday</span>
                    </p>
                  </div>
                  <div className="p-5 border border-zinc-200 rounded-2xl flex flex-col justify-between">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Total Clicks</p>
                    <p className="text-4xl font-black text-indigo-600 tracking-tight">342</p>
                    <p className="text-[11px] font-bold text-emerald-500 mt-2">
                      +5.2% <span className="text-zinc-400 font-medium">vs yesterday</span>
                    </p>
                  </div>
                </div>

                <div className="p-5 border border-zinc-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Avg. Click-Through Rate</p>
                    <p className="text-2xl font-black text-zinc-900 tracking-tight">27.4%</p>
                  </div>
                  <div className="w-full h-3 bg-zinc-100 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[27.4%] rounded-full relative overflow-hidden" />
                  </div>
                </div>

                <div className="p-5 border border-zinc-200 rounded-2xl">
                  <h4 className="text-sm font-bold text-zinc-800 mb-4 tracking-tight">Top Performing Links</h4>
                  <div className="space-y-3">
                    {links.length > 0 ? (
                      links.slice(0, 3).map((link, i) => (
                        <div key={link.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-zinc-50 text-zinc-400 flex items-center justify-center text-[11px] font-black shrink-0 ring-1 ring-zinc-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:ring-indigo-200 transition-all">
                              {i + 1}
                            </div>
                            <span className="text-[13px] font-bold text-zinc-800 truncate">{link.title || "Untitled Link"}</span>
                          </div>
                          <span className="text-[11px] font-bold text-zinc-500 shrink-0 bg-zinc-50 px-2.5 py-1.5 rounded-lg">
                            {(i * 17) % 100 + 20} clicks
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs font-semibold text-zinc-400 text-center py-6">
                        Add links to see their performance here.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* LINKS TAB */}
            {smartBioTab === "links" && (
              <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                <button
                  onClick={addLink}
                  className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[13px] font-bold tracking-wide flex justify-center items-center gap-2 transition-all"
                >
                  <Plus size={16} strokeWidth={2.5} /> Add New Link
                </button>

                {links.length === 0 ? (
                  <div className="p-8 border border-zinc-200 border-dashed rounded-2xl flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center">
                      <Link2 size={24} className="text-zinc-300" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-zinc-800">No links added</p>
                      <p className="text-[11px] font-medium text-zinc-500 mt-0.5">Your bio is looking a little empty.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {links.map((link) => (
                      <div key={link.id} className="border border-zinc-200 rounded-2xl p-4 flex gap-3 group relative bg-white transition-all hover:border-zinc-300">
                        {/* Drag Handle */}
                        <div className="flex items-center text-zinc-300 cursor-grab active:cursor-grabbing hover:text-zinc-600 transition-colors">
                          <GripVertical size={18} />
                        </div>
                        
                        <div className="flex flex-col gap-3 flex-1">
                          <div className="flex gap-3">
                            {/* Thumbnail Upload/Preview */}
                            <button
                              onClick={() => {
                                setActiveLinkId(link.id);
                                thumbnailInputRef.current?.click();
                              }}
                              className="w-12 h-12 shrink-0 rounded-[14px] bg-zinc-50 ring-1 ring-zinc-200/60 flex flex-col items-center justify-center overflow-hidden hover:ring-indigo-300 hover:bg-indigo-50 transition-all group/thumb relative"
                              title={link.thumbnail ? "Change thumbnail" : "Add thumbnail"}
                            >
                              {link.thumbnail ? (
                                <>
                                  <img src={link.thumbnail} alt="" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-all">
                                    <Image size={14} className="text-white" />
                                  </div>
                                </>
                              ) : (
                                <Image size={16} className="text-zinc-400 group-hover/thumb:text-indigo-500" />
                              )}
                            </button>
                            
                            <div className="flex-1 flex flex-col justify-center">
                              <input
                                type="text"
                                placeholder="Button Title (e.g. Book a Workshop)"
                                value={link.title}
                                onChange={(e) => updateLink(link.id, "title", e.target.value)}
                                className="w-full bg-transparent border-none text-[13px] font-extrabold text-zinc-900 placeholder:text-zinc-300 outline-none focus:ring-0 p-0"
                              />
                              <input
                                type="url"
                                placeholder="URL (https://...)"
                                value={link.url}
                                onChange={(e) => updateLink(link.id, "url", e.target.value)}
                                className="w-full bg-transparent border-none text-[11px] font-medium text-zinc-500 placeholder:text-zinc-300 outline-none focus:ring-0 p-0 mt-0.5"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <button onClick={() => removeLink(link.id)} className="absolute top-4 right-4 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Hidden Thumbnail Input */}
                <input ref={thumbnailInputRef} type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />

                {/* Email Capture Card */}
                <div className="border border-zinc-200 rounded-2xl p-5 mt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-extrabold text-zinc-900">Email Capture Form</p>
                      <p className="text-[11px] font-medium text-zinc-400 mt-0.5">Collect emails directly from your bio.</p>
                    </div>
                    <button
                      onClick={() => setEnableEmailCapture(!enableEmailCapture)}
                      className={`w-11 h-6 rounded-full transition-all relative ${enableEmailCapture ? "bg-indigo-500" : "bg-zinc-200"}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${enableEmailCapture ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                  
                  {enableEmailCapture && (
                    <div className="mt-4 pt-4 border-t border-zinc-100 flex gap-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Form Title</label>
                        <input
                          type="text"
                          value={emailCaptureTitle}
                          onChange={(e) => setEmailCaptureTitle(e.target.value)}
                          placeholder="Join my newsletter"
                          className="w-full px-3 py-2 bg-zinc-50 border-none ring-1 ring-zinc-200 rounded-xl text-xs font-bold text-zinc-800 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Button Text</label>
                        <input
                          type="text"
                          value={emailCaptureButtonText}
                          onChange={(e) => setEmailCaptureButtonText(e.target.value)}
                          placeholder="Subscribe"
                          className="w-full px-3 py-2 bg-zinc-50 border-none ring-1 ring-zinc-200 rounded-xl text-xs font-bold text-zinc-800 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {smartBioTab === "profile" && (
              <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                <div className="border border-zinc-200 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-100 ring-4 ring-white shadow-xl shadow-zinc-200/50 flex items-center justify-center relative">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-zinc-300" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                        <Upload size={18} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[15px] font-extrabold text-zinc-900 tracking-tight">{displayName}</p>
                    <p className="text-[12px] font-medium text-zinc-500">@{igUsername}</p>
                  </div>
                </div>

                <div className="border border-zinc-200 rounded-2xl p-6 space-y-5">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Display Name</label>
                    <input
                      type="text"
                      value={profileTitle}
                      onChange={(e) => setProfileTitle(e.target.value)}
                      placeholder="Your name or brand"
                      className="w-full px-4 py-3 bg-zinc-50 border-none ring-1 ring-zinc-200/80 rounded-xl text-[13px] font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:font-medium placeholder:text-zinc-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Bio / Tagline</label>
                    <textarea
                      rows={3}
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      placeholder="Life coach & nutritionist. Helping you live better."
                      className="w-full px-4 py-3 bg-zinc-50 border-none ring-1 ring-zinc-200/80 rounded-xl text-[13px] font-medium text-zinc-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none placeholder:text-zinc-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* THEME & BACKGROUND TAB */}
            {smartBioTab === "theme" && (
              <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                <div className="border border-zinc-200 rounded-2xl p-6">
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Select a Theme</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {THEMES.map((t) => {
                      const isSelected = themeId === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setThemeId(t.id)}
                          className={`relative rounded-xl overflow-hidden ring-1 transition-all group ${isSelected ? "ring-2 ring-indigo-500 shadow-md shadow-indigo-100" : "ring-zinc-200 hover:ring-zinc-300"}`}
                        >
                          <div className="h-14 w-full" style={t.heroStyle}>
                            <div className="w-full h-full" style={{ backgroundImage: t.heroPattern, opacity: 0.8 }} />
                          </div>
                          <div className="pt-4 pb-2.5 px-2 flex flex-col items-center gap-1" style={{ background: t.pageBg }}>
                            <div className="w-8 h-1 rounded-full" style={{ background: t.textPrimary, opacity: 0.7 }} />
                            <div className="w-full h-4 mt-1 rounded-[6px]" style={{ background: t.buttonBg, border: `1px solid ${t.buttonBorder}` }} />
                          </div>
                          <div className="py-1.5 text-center border-t border-black/5" style={{ background: t.pageBg }}>
                            <span className="text-[10px] font-bold" style={{ color: t.textPrimary }}>{t.name}</span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm">
                              <Check size={10} className="text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border border-zinc-200 rounded-2xl p-6 space-y-6">
                  <div>
                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Premium Wallpapers</p>
                    <div className="grid grid-cols-2 gap-4">
                      {IMAGE_WALLPAPERS.map((preset) => {
                        const isSelected = bgImageUrl === preset.src || (preset.id === "none" && !bgImageUrl);
                        return (
                          <button
                            key={preset.id}
                            onClick={() => {
                              if (preset.id === "none") {
                                setBgImageUrl("");
                                setBgPresetId("none");
                              } else {
                                setBgImageUrl(preset.src);
                                setBgPresetId(preset.id);
                              }
                            }}
                            className={`relative h-28 rounded-[14px] overflow-hidden border-2 transition-all group ${isSelected ? "border-indigo-500 shadow-md shadow-indigo-100" : "border-zinc-200 hover:border-zinc-300"}`}
                          >
                            {preset.id === "none" ? (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                                <X size={24} className="text-zinc-300" />
                              </div>
                            ) : (
                              <img src={preset.src} alt={preset.label} className="w-full h-full object-cover" />
                            )}
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm">
                                <Check size={12} className="text-white stroke-[3]" />
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 py-1.5 text-center backdrop-blur-md bg-black/40">
                              <span className="text-[10px] font-bold text-white tracking-wide px-2">{preset.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: PHONE PREVIEW */}
        <div 
          className={
            isMobilePreviewOpen 
              ? "fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200 p-4 pt-16"
              : "hidden md:flex w-full md:w-[45%] justify-center items-center sticky top-4 h-[calc(100vh-120px)] self-start"
          }
        >
          {isMobilePreviewOpen && (
            <button 
              onClick={() => setIsMobilePreviewOpen(false)}
              className="absolute top-4 right-4 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/20 z-[120] transition-colors shadow-xl"
            >
              <X size={24} />
            </button>
          )}
          
          <div className="w-full max-w-[300px] h-[640px] max-h-[80vh] bg-zinc-900 rounded-[40px] sm:rounded-[48px] border-[6px] sm:border-[8px] border-zinc-800 relative overflow-hidden shrink-0 shadow-2xl shadow-black/50 flex flex-col">
            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-zinc-900 rounded-full z-20" />

            {/* Screen */}
            <div
              className="w-full h-full rounded-[34px] overflow-y-auto overflow-x-hidden relative no-scrollbar"
              style={{
                background: bgImageUrl ? undefined : theme.pageBg,
                ...(bgImageUrl ? { backgroundImage: `url("${bgImageUrl}")`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
              }}
            >
              {/* Frosted overlay when bg image is set */}
              {bgImageUrl && (
                <div className="absolute inset-0 pointer-events-none z-0" style={{ background: "rgba(255,255,255,0.08)" }} />
              )}

              <div className="relative h-32 w-full shrink-0 z-10" style={
                bgImageUrl 
                  ? { background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)" }
                  : theme.heroStyle
              }>
                {!bgImageUrl && <div className="absolute inset-0" style={{ backgroundImage: theme.heroPattern }} />}
                <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 290 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d={`M0 20 L0 8 Q72.5 0 145 8 Q217.5 16 290 8 L290 20 Z`}
                    fill={bgImageUrl ? "transparent" : theme.pageBg}
                  />
                </svg>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-18 h-18 rounded-full border-[3px] border-white overflow-hidden z-10 shadow-sm" style={{ width: 72, height: 72, background: "#e5e7eb" }}>
                  {profilePic ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><User size={26} className="text-zinc-400" /></div>}
                </div>
              </div>

              <div className="pt-11 pb-6 px-5 flex flex-col items-center relative z-10">
                {(() => {
                  const hasWallpaper = !!bgImageUrl;
                  return (
                    <>
                      <h2 className="text-[15px] font-extrabold tracking-tight mt-1 text-center drop-shadow-sm" style={{ color: hasWallpaper ? "#fff" : theme.textPrimary }}>
                        {displayName || "Your Name"}
                      </h2>
                      <p className="text-[10px] font-semibold lowercase tracking-widest mt-0.5 text-center drop-shadow-sm" style={{ color: hasWallpaper ? "rgba(255,255,255,0.7)" : theme.textSub }}>
                        @{igUsername?.toLowerCase()}
                      </p>
                      {bioText && (
                        <p className="text-[10px] text-center mt-2.5 leading-relaxed px-2 drop-shadow-sm" style={{ color: hasWallpaper ? "rgba(255,255,255,0.8)" : theme.textSub }}>
                          {bioText}
                        </p>
                      )}

                      {socialLinks.length > 0 && (
                        <div className="flex items-center justify-center gap-2.5 mt-4">
                          {socialLinks.map((link) => {
                            const meta = getSocialMeta(link.url);
                            return (
                              <div key={link.id} className="w-8 h-8 rounded-full flex items-center justify-center border shadow-sm"
                                style={{ 
                                  background: hasWallpaper ? "rgba(255,255,255,0.15)" : theme.socialBg, 
                                  borderColor: hasWallpaper ? "rgba(255,255,255,0.3)" : theme.buttonBorder, 
                                  color: hasWallpaper ? "#fff" : theme.socialText,
                                  backdropFilter: hasWallpaper ? "blur(12px)" : "none"
                                }}>
                                {meta?.icon}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Links */}
                      <div className="w-full mt-4 space-y-3">
                        {standardLinks.length === 0 && (
                          <div className="py-2.5 text-center text-[10px] font-medium opacity-40" style={{ color: hasWallpaper ? "#fff" : theme.textPrimary }}>
                            Add links to see them here
                          </div>
                        )}
                  {standardLinks.map((link) => {
                    const ytUrl = getYoutubeEmbedUrl(link.url);
                    if (ytUrl) {
                      return (
                        <div key={link.id} className="w-full rounded-xl overflow-hidden border border-zinc-200/40 shadow-sm relative pt-[56.25%] bg-black">
                          <iframe
                            src={ytUrl}
                            className="absolute top-0 left-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      );
                    }

                    // Auto-extract favicon if no custom thumbnail
                    let iconUrl = link.thumbnail;
                    if (!iconUrl && link.url) {
                      try {
                        const domain = new URL(link.url).hostname;
                        iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                      } catch (e) {
                        // invalid url
                      }
                    }

                    return (
                      <div
                        key={link.id}
                        className="w-full py-2 px-3 rounded-md border flex items-center justify-between relative transition-transform hover:scale-[1.02] group"
                              style={{
                                boxShadow: "none",
                                background: hasWallpaper ? "rgba(255,255,255,0.15)" : theme.buttonBg,
                                borderColor: hasWallpaper ? "rgba(255,255,255,0.3)" : theme.buttonBorder,
                                color: hasWallpaper ? "#fff" : theme.buttonText,
                                backdropFilter: hasWallpaper ? "blur(12px)" : "none",
                              }}
                      >
                        {iconUrl ? (
                          <div className="w-8 h-8 shrink-0 overflow-hidden bg-white/10 flex items-center justify-center p-1.5" style={{ borderRadius: "6px" }}>
                            <img src={iconUrl} alt="" className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-8 shrink-0" />
                        )}
                        
                        <span className="flex-1 text-center text-[11px] font-bold px-2 truncate">
                          {link.title || "Link Title"}
                        </span>
                        
                        <button className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors" title="Share link">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                      {/* Email Capture Block */}
                      {enableEmailCapture && (
                        <div 
                          className="w-full mt-4 p-4 rounded-xl border flex flex-col gap-3 relative"
                          style={{
                            background: hasWallpaper ? "rgba(255,255,255,0.15)" : theme.buttonBg,
                            borderColor: hasWallpaper ? "rgba(255,255,255,0.3)" : theme.buttonBorder,
                            backdropFilter: hasWallpaper ? "blur(12px)" : "none",
                          }}
                        >
                          <h3 className="text-[12px] font-bold text-center" style={{ color: hasWallpaper ? "#fff" : theme.textPrimary }}>
                            {emailCaptureTitle || "Join my newsletter"}
                          </h3>
                          <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="w-full px-3 py-2 text-[10px] border rounded-lg outline-none"
                            style={{
                              background: hasWallpaper ? "rgba(255,255,255,0.1)" : "#fff",
                              borderColor: hasWallpaper ? "rgba(255,255,255,0.2)" : "#e5e7eb",
                              color: hasWallpaper ? "#fff" : "#111"
                            }}
                          />
                          <button 
                            className="w-full py-2 rounded-lg text-[10px] font-bold transition-all"
                            style={{ 
                              background: hasWallpaper ? "#fff" : theme.textPrimary, 
                              color: hasWallpaper ? "#000" : theme.buttonBg 
                            }}
                          >
                            {emailCaptureButtonText || "Subscribe"}
                          </button>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-auto pt-8 text-center opacity-70">
                        <p className="text-[10px] font-bold tracking-wide drop-shadow-md" style={{ color: hasWallpaper ? "#fff" : theme.footerText }}>
                          Powered by Automixa
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating "Live Preview" Button */}
      <div className="md:hidden fixed bottom-24 right-6 z-40">
        <button
          onClick={() => setIsMobilePreviewOpen(true)}
          className="flex items-center gap-2 px-5 py-3.5 bg-zinc-900 text-white rounded-full shadow-2xl shadow-zinc-900/40 hover:scale-105 active:scale-95 transition-transform border border-zinc-700"
        >
          <Play size={16} className="text-emerald-400 fill-emerald-400" />
          <span className="text-[13px] font-bold tracking-wide">Live Preview</span>
        </button>
      </div>
    </div>
  );
}
