"use client";

import React, { useState, useEffect } from "react";
import { Plus, User, Globe, Play, AtSign, Users2, Link2, Copy, Check, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";

// ─── THEMES ────────────────────────────────────────────────────────────────
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
];

// ─── SOCIAL ICON HELPER ────────────────────────────────────────────────────
const getSocialMeta = (url) => {
  if (!url) return null;
  const l = url.toLowerCase();
  if (l.includes("instagram.com")) return { icon: <AtSign size={18} />, label: "Instagram" };
  if (l.includes("youtube.com") || l.includes("youtu.be")) return { icon: <Play size={18} />, label: "YouTube" };
  if (l.includes("twitter.com") || l.includes("x.com")) return { icon: <Globe size={18} />, label: "X" };
  if (l.includes("facebook.com")) return { icon: <Users2 size={18} />, label: "Facebook" };
  if (l.includes("linkedin.com")) return { icon: <Link2 size={18} />, label: "LinkedIn" };
  return null;
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function SmartBio({ accountId, account, currentPlan = "free", onUpgradeClick }) {
  const [activeTab, setActiveTab] = useState("links");
  const [links, setLinks] = useState([]);
  const [profileTitle, setProfileTitle] = useState("");
  const [bioText, setBioText] = useState("");
  const [themeId, setThemeId] = useState("ivory");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishedLink, setPublishedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const igUsername = account?.ig_username || account?.name || account?.page_name || "username";
  const profilePic = account?.profile_picture_url || account?.profile_pic || account?.metadata?.profile_picture_url || account?.metadata?.profile_pic || null;
  const displayName = profileTitle || account?.page_name || account?.name || igUsername;

  // Load saved settings from Supabase
  useEffect(() => {
    if (!accountId) return;
    async function loadSavedBio() {
      try {
        const supabase = createClient();
        const [settingsRes, linksRes] = await Promise.all([
          supabase.from("smart_bio_settings").select("*").eq("automation_id", accountId).single(),
          supabase.from("smart_bio_links").select("*").eq("automation_id", accountId).order("sort_order", { ascending: true })
        ]);
        if (settingsRes.data) {
          setProfileTitle(settingsRes.data.profile_title || "");
          setBioText(settingsRes.data.bio_text || "");
          setThemeId(settingsRes.data.theme_preset || "ivory");
          if (settingsRes.data.is_published) {
            setPublished(true);
            const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
            setPublishedLink(isLocal ? `${window.location.origin}/bio/${igUsername}` : `https://${igUsername}.automixa.in`);
          }
        } else {
          // Pre-fill from account
          setProfileTitle(account?.page_name || account?.name || "");
        }
        if (linksRes.data && linksRes.data.length > 0) {
          setLinks(linksRes.data.map(l => ({ id: l.id, title: l.title, url: l.url })));
        }
      } catch (err) {
        // Tables may not exist yet — silently start fresh
        setProfileTitle(account?.page_name || account?.name || "");
      } finally {
        setLoaded(true);
      }
    }
    loadSavedBio();
  }, [accountId]);

  const addLink = () => setLinks([...links, { id: `new_${Date.now()}`, title: "", url: "" }]);
  const updateLink = (id, field, value) => setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  const removeLink = (id) => setLinks(links.filter(l => l.id !== id));

  const handlePublish = async () => {
    if (!accountId) return;
    setPublishing(true);
    try {
      const supabase = createClient();

      // Upsert settings
      await supabase.from("smart_bio_settings").upsert({
        automation_id: accountId,
        profile_title: profileTitle,
        bio_text: bioText,
        theme_preset: themeId,
        is_published: true,
        updated_at: new Date().toISOString()
      }, { onConflict: "automation_id" });

      // Delete old links and re-insert
      await supabase.from("smart_bio_links").delete().eq("automation_id", accountId);
      const validLinks = links.filter(l => l.title && l.url);
      if (validLinks.length > 0) {
        await supabase.from("smart_bio_links").insert(
          validLinks.map((l, i) => ({ automation_id: accountId, title: l.title, url: l.url, sort_order: i }))
        );
      }

      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const link = isLocal ? `${window.location.origin}/bio/${igUsername}` : `https://${igUsername}.automixa.in`;
      setPublishedLink(link);
      setPublished(true);
      toast.success("Smart Bio published successfully!");
    } catch (err) {
      toast.error("Failed to publish. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(publishedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = links.filter(l => getSocialMeta(l.url));
  const standardLinks = links.filter(l => !getSocialMeta(l.url));

  if (currentPlan === "free") {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 rounded-3xl bg-[#6366F1]/10 flex items-center justify-center border border-[#6366F1]/20 shadow-xl shadow-[#6366F1]/5 relative">
          <Globe size={32} className="text-[#6366F1]" />
          <span className="absolute -top-2 -right-2 text-2xl">👑</span>
        </div>
        <div>
          <h3 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">Unlock Smart Bio with Creator Pro</h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Create stunning, high-converting link-in-bio pages directly from Automixa and supercharge your traffic.
          </p>
        </div>
        <button onClick={() => onUpgradeClick?.("smart_bio")} className="mt-4 px-8 py-3.5 bg-zinc-950 hover:bg-[#6366F1] text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
          Upgrade Plan
        </button>
      </div>
    );
  }

  const isComingSoon = true;

  if (!accountId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
          <User size={28} className="text-zinc-400" />
        </div>
        <h3 className="text-lg font-bold text-zinc-800">Connect an Account First</h3>
        <p className="text-sm text-zinc-500 max-w-xs">Please connect your Instagram account to set up your Smart Bio page.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-5 animate-in fade-in duration-500 pb-10">

      {/* ── LEFT: BUILDER ── */}
      <div className="w-full md:w-[55%] flex flex-col gap-4">

        {/* Header */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
          <div className="flex bg-zinc-100 rounded-xl p-1 gap-1">
            {["links", "profile", "theme"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${activeTab === tab ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            disabled={true}
            className="px-5 py-2 bg-zinc-200 text-zinc-500 rounded-xl text-xs font-bold shadow-sm cursor-not-allowed flex items-center gap-2"
          >
            Coming Soon
          </button>
        </div>

        {/* Published Link Banner */}
        {published && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 animate-in slide-in-from-top-2">
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-700 mb-0.5">🎉 Your Smart Bio is Live!</p>
              <p className="text-xs text-emerald-600 truncate font-medium">{publishedLink}</p>
            </div>
            <button onClick={copyLink} className="shrink-0 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition-all">
              {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Link</>}
            </button>
          </div>
        )}

        {/* Editor Area */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm flex-1">

          {/* LINKS TAB */}
          {activeTab === "links" && (
            <div className="space-y-4">
              <button
                onClick={addLink}
                className="w-full py-3 border-2 border-dashed border-zinc-200 text-zinc-500 rounded-xl text-xs font-bold flex justify-center items-center gap-2 hover:border-zinc-400 hover:text-zinc-700 transition-all"
              >
                <Plus size={15} /> Add New Link
              </button>
              {links.length === 0 ? (
                <p className="text-center text-zinc-400 text-sm py-8">No links yet. Click above to add your first link!</p>
              ) : (
                <div className="space-y-2.5">
                  {links.map((link) => (
                    <div key={link.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex gap-3 items-start group">
                      <div className="flex flex-col gap-2 flex-1">
                        <input
                          type="text"
                          placeholder="Button Title (e.g. Book a Workshop)"
                          value={link.title}
                          onChange={e => updateLink(link.id, "title", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-semibold outline-none focus:border-zinc-950 transition-colors"
                        />
                        <input
                          type="url"
                          placeholder="URL (https://...)"
                          value={link.url}
                          onChange={e => updateLink(link.id, "url", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-500 outline-none focus:border-zinc-950 transition-colors"
                        />
                      </div>
                      <button onClick={() => removeLink(link.id)} className="text-zinc-300 hover:text-rose-500 transition-colors p-1 mt-1 shrink-0">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-200 shrink-0 border-2 border-white shadow">
                  {profilePic
                    ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><User size={24} className="text-zinc-400" /></div>
                  }
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">{displayName}</p>
                  <p className="text-xs text-zinc-500">@{igUsername}</p>
                  <p className="text-[10px] text-zinc-400 mt-1 font-medium">Profile picture & username pulled from your connected Instagram account.</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700">Display Name</label>
                <input
                  type="text"
                  value={profileTitle}
                  onChange={e => setProfileTitle(e.target.value)}
                  placeholder="Your name or brand"
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-semibold outline-none focus:border-zinc-950 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700">Bio / Tagline</label>
                <textarea
                  rows={3}
                  value={bioText}
                  onChange={e => setBioText(e.target.value)}
                  placeholder="Life coach & nutritionist. Helping you live better."
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-zinc-950 transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* THEME TAB */}
          {activeTab === "theme" && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Select a Theme</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {THEMES.map(t => {
                  const isSelected = themeId === t.id;
                  const heroIsDark = ["midnight", "forest", "navy"].includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => setThemeId(t.id)}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all ${isSelected ? "border-zinc-950 shadow-lg" : "border-transparent hover:border-zinc-300"}`}
                    >
                      {/* Hero preview */}
                      <div className="h-14 relative" style={{ ...t.heroStyle }}>
                        <div className="absolute inset-0" style={{ backgroundImage: t.heroPattern }} />
                        {/* Fake profile dot */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-white shadow" />
                      </div>
                      {/* Page preview */}
                      <div className="pt-5 pb-3 px-3 flex flex-col items-center gap-1.5" style={{ background: t.pageBg }}>
                        <div className="w-10 h-1.5 rounded-full" style={{ background: t.textPrimary, opacity: 0.7 }} />
                        <div className="w-7 h-1 rounded-full" style={{ background: t.textSub, opacity: 0.5 }} />
                        <div className="w-full h-5 mt-1 rounded-lg border" style={{ background: t.buttonBg, borderColor: t.buttonBorder }} />
                      </div>
                      <div className="py-1 text-center" style={{ background: t.pageBg }}>
                        <span className="text-[10px] font-bold" style={{ color: t.textPrimary }}>{t.name}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-zinc-950 flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: PHONE PREVIEW ── */}
      <div className="w-full md:w-[45%] flex justify-center items-start sticky top-4 self-start">
        <div className="w-[290px] h-[620px] bg-zinc-900 rounded-[42px] border-[8px] border-zinc-900 shadow-2xl relative overflow-hidden shrink-0">
          {/* Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-zinc-900 rounded-full z-20" />

          {/* Screen */}
          <div className="w-full h-full rounded-[34px] overflow-y-auto overflow-x-hidden relative" style={{ background: theme.pageBg }}>

            {/* HERO SECTION */}
            <div className="relative h-36 w-full shrink-0" style={{ ...theme.heroStyle }}>
              <div className="absolute inset-0" style={{ backgroundImage: theme.heroPattern }} />
              {/* Wave bottom */}
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 290 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={`M0 24 L0 10 Q72.5 0 145 10 Q217.5 20 290 10 L290 24 Z`} fill={theme.pageBg} />
              </svg>
              {/* Profile pic overlapping */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full border-[3px] border-white shadow-lg overflow-hidden z-10" style={{ background: "#e5e7eb" }}>
                {profilePic
                  ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><User size={28} className="text-zinc-400" /></div>
                }
              </div>
            </div>

            {/* Content */}
            <div className="pt-12 pb-6 px-5 flex flex-col items-center">
              {/* Name + username */}
              <h2 className="text-[17px] font-extrabold tracking-tight mt-1 text-center" style={{ color: theme.textPrimary }}>
                {displayName || "Your Name"}
              </h2>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mt-0.5 text-center" style={{ color: theme.textSub }}>
                @{igUsername}
              </p>
              {/* Bio */}
              {bioText && (
                <p className="text-[11px] text-center mt-3 leading-relaxed px-2" style={{ color: theme.textSub }}>
                  {bioText}
                </p>
              )}

              {/* Social Icons */}
              {socialLinks.length > 0 && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  {socialLinks.map(link => {
                    const meta = getSocialMeta(link.url);
                    return (
                      <div key={link.id} className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm border" style={{ background: theme.socialBg, borderColor: theme.buttonBorder, color: theme.socialText }}>
                        {meta?.icon}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Links */}
              <div className="w-full mt-5 space-y-2.5">
                {standardLinks.length === 0 && (
                  <div className="py-3 text-center text-[10px] font-medium opacity-40" style={{ color: theme.textPrimary }}>
                    Add links to see them here
                  </div>
                )}
                {standardLinks.map(link => (
                  <div
                    key={link.id}
                    className="w-full py-3 px-4 rounded-2xl border text-center text-[12px] font-bold transition-all"
                    style={{ background: theme.buttonBg, borderColor: theme.buttonBorder, color: theme.buttonText }}
                  >
                    {link.title || "Link Title"}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-auto pt-10 text-center space-y-1.5">
                <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.footerText }}>
                  Powered by Automixa
                </p>
                <div className="flex items-center justify-center gap-2 text-[8px] font-bold" style={{ color: theme.footerText }}>
                  <span>Privacy Policy</span>
                  <span>•</span>
                  <span>Terms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
