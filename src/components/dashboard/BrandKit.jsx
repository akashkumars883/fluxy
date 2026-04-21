"use client";

import { Palette, Sparkles, MessageSquare, ShieldCheck, Save, Brain } from "lucide-react";
import { useState } from "react";

export default function BrandKit({ automation, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand_name: automation?.brand_name || "",
    tone: automation?.metadata?.tone || "Friendly",
    templates: automation?.metadata?.templates || {
      intro_title: "Hey {name}! Thanks for the comment. Tap below and i'll send you the access in just a moment",
      follow_gate_title: "One final step to unlock! 🎁",
      follow_gate_subtitle: "Please follow @{brand} to get your link immediately."
    },
    ig_handle: automation?.metadata?.ig_handle || ""
  });

  const tones = ["Friendly", "Professional", "Witty", "Aggressive", "Luxury", "Helpful"];

  const handleSave = async () => {
    setLoading(true);
    await onUpdate({
      brand_name: formData.brand_name,
      metadata: { 
        ...automation?.metadata, 
        tone: formData.tone,
        templates: formData.templates,
        ig_handle: formData.ig_handle
      }
    });
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Brand Kit</h1>
          <p className="text-zinc-muted text-sm font-medium mt-1">Define your digital persona and voice.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
        >
          {loading ? <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" /> : <Save size={18} />}
          <span>Save Kit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Identity Card */}
        <div className="bg-white border border-border rounded-[32px] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-sage text-foreground rounded-xl flex items-center justify-center shadow-lg shadow-sage/10">
              <Palette size={20} />
            </div>
            <h3 className="font-bold text-lg text-foreground">Visual Identity</h3>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-zinc-muted uppercase tracking-wider ml-1">Brand Name / Display Name</label>
            <input 
              type="text"
              value={formData.brand_name}
              onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
              className="w-full px-5 py-4 bg-zinc-50 border-2 border-border/60 rounded-2xl outline-none focus:border-foreground focus:bg-white font-bold text-sm transition-all text-foreground"
              placeholder="e.g. Automixa"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-zinc-muted uppercase tracking-wider ml-1">Instagram Handle (@)</label>
            <input 
              type="text"
              value={formData.ig_handle}
              onChange={(e) => setFormData({ ...formData, ig_handle: e.target.value.replace('@', '') })}
              className="w-full px-5 py-4 bg-zinc-50 border-2 border-border/60 rounded-2xl outline-none focus:border-foreground focus:bg-white font-bold text-sm transition-all text-foreground"
              placeholder="e.g. redtitch.official"
            />
          </div>
        </div>

        {/* Voice Card */}
        <div className="bg-white border border-border rounded-[32px] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-foreground text-background rounded-xl flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <h3 className="font-bold text-lg text-foreground">Tone of Voice</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {tones.map((t) => (
              <button
                key={t}
                onClick={() => setFormData({ ...formData, tone: t })}
                className={`px-4 py-3 rounded-2xl text-[11px] font-bold transition-all border-2 ${
                  formData.tone === t 
                    ? "bg-foreground text-background border-foreground shadow-lg" 
                    : "bg-background text-zinc-muted border-border/60 hover:border-foreground/20"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message Templates Card */}
      <div className="bg-white border border-border rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Automation Templates</h3>
            <p className="text-[10px] text-zinc-muted font-bold uppercase tracking-wider">Customize what your fans see in DMs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phase 1: Intro */}
          <div className="space-y-3">
             <label className="text-[11px] font-bold text-zinc-muted uppercase tracking-wider ml-1">Intro Card Title (Phase 1)</label>
             <textarea 
               value={formData.templates?.intro_title || ""}
               onChange={(e) => setFormData({ 
                 ...formData, 
                 templates: { ...formData.templates, intro_title: e.target.value } 
               })}
               className="w-full h-24 px-5 py-4 bg-zinc-50 border-2 border-border/60 rounded-2xl outline-none focus:border-foreground focus:bg-white font-semibold text-sm transition-all text-foreground resize-none"
               placeholder="Hey {name}! Thanks for the comment..."
             />
          </div>

          {/* Phase 2: Follow Gate */}
          <div className="space-y-3">
             <label className="text-[11px] font-bold text-zinc-muted uppercase tracking-wider ml-1">Follow Gate Title (Phase 2)</label>
             <input 
               type="text"
               value={formData.templates?.follow_gate_title || ""}
               onChange={(e) => setFormData({ 
                 ...formData, 
                 templates: { ...formData.templates, follow_gate_title: e.target.value } 
               })}
               className="w-full px-5 py-4 bg-zinc-50 border-2 border-border/60 rounded-2xl outline-none focus:border-foreground focus:bg-white font-semibold text-sm transition-all text-foreground"
               placeholder="One final step to unlock! 🎁"
             />
          </div>
        </div>

        <div className="mt-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
           <p className="text-[11px] text-indigo-600 font-bold leading-relaxed">
             💡 Pro Tip: Use <code className="bg-indigo-100 px-1 rounded">{'{name}'}</code> to address the fan by name, and <code className="bg-indigo-100 px-1 rounded">{'{brand}'}</code> for your brand name.
           </p>
        </div>
      </div>

      {/* AI Context Card */}
      <div className="bg-white border border-border rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <Brain size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">AI Personality Context</h3>
            <p className="text-[10px] text-zinc-muted font-bold">This helps AI understand how to reply</p>
          </div>
        </div>

        <div className="p-6 bg-zinc-50 rounded-[24px] border border-dashed border-border/60">
           <p className="text-sm text-zinc-muted italic">
             "Our AI uses the brand name **{formData.brand_name || '...'}** and adapts a **{formData.tone}** tone when generating personalized responses for your fans. This ensures every DM feels like it's coming directly from you."
           </p>
        </div>
      </div>
    </div>
  );
}
