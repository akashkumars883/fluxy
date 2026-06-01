"use client";

import { createClient } from "@/lib/supabase";
import { ArrowRight, Check, Clock, Copy, ExternalLink, Trash2, Users, Link as LinkIcon, DollarSign, Award, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function PartnerDashboard({ currentPlan = "free" }) {
  const [appStatus, setAppStatus] = useState("approved");

  const updateAppStatus = (status) => {
    setAppStatus(status);
    if (typeof window !== "undefined") {
      localStorage.setItem("partner_app_status", status);
      window.dispatchEvent(new Event("partner_status_updated"));
    }
  };

  const [copied, setCopied] = useState(false);

  const [partnerProfile, setPartnerProfile] = useState({
    active_tier: "silver",
    commission_rate: 0.15,
    total_referrals_count: 0,
    monthly_recurring_revenue: 0.00,
    master_tracking_link: "https://automixa.in/?ref=partner_link"
  });

  const [promoCodes, setPromoCodes] = useState([]);
  const [payouts, setPayouts] = useState([]);

  // Promo Code Form State
  const [newCodeInput, setNewCodeInput] = useState("");
  const [newSplit, setNewSplit] = useState("10_20");
  const [generating, setGenerating] = useState(false);
  const [genSuccess, setGenSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const displayTrackingLink = typeof window !== "undefined"
    ? (partnerProfile?.master_tracking_link || "").replace(/https:\/\/(automixa\.in|automixa\.com)/, window.location.origin)
    : (partnerProfile?.master_tracking_link || "");

  useEffect(() => {
    async function loadRealData() {
      if (typeof window !== "undefined") {
        const savedStatus = localStorage.getItem("partner_app_status");
        if (savedStatus) setAppStatus(savedStatus);
      }
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          let { data: profile } = await supabase.from("partner_profiles").select("*").eq("id", user.id).single();

          if (!profile) {
            const defaultLink = `https://automixa.in/?ref=partner_${user.id.slice(0, 6)}`;
            const { data: newProfile } = await supabase.from("partner_profiles").insert({
              id: user.id,
              application_status: "approved",
              master_tracking_link: defaultLink,
              active_tier: "silver",
              commission_rate: 0.15,
              total_referrals_count: 0,
              monthly_recurring_revenue: 0.00,
            }).select().single();
            if (newProfile) profile = newProfile;
          }

          if (profile) {
            if (profile.application_status) {
              setAppStatus(profile.application_status);
              if (typeof window !== "undefined") {
                localStorage.setItem("partner_app_status", profile.application_status);
                localStorage.setItem("partner_active_tier", profile.active_tier ?? "silver");
                localStorage.setItem("partner_commission_rate", String(Math.round((Number(profile.commission_rate) ?? 0.15) * 100)));
                window.dispatchEvent(new Event("partner_status_updated"));
              }
            }
            setPartnerProfile({
              active_tier: profile.active_tier ?? "silver",
              commission_rate: Number(profile.commission_rate) ?? 0.15,
              total_referrals_count: profile.total_referrals_count ?? 0,
              monthly_recurring_revenue: Number(profile.monthly_recurring_revenue) ?? 0.00,
              master_tracking_link: profile.master_tracking_link ?? `https://automixa.in/?ref=partner_${user.id.slice(0, 6)}`
            });
          }

          const { data: codes } = await supabase.from("promo_codes").select("*").eq("partner_id", user.id).order("created_at", { ascending: false });
          if (codes) {
            setPromoCodes(codes.map(c => ({
              code: c.code,
              discount: `${c.customer_discount_percent || 10}% off`,
              split: c.split_config === "10_20" ? "10% Off / 20% Commission" : c.split_config === "15_15" ? "15% Off / 15% Commission" : "10% Off / 15% Commission",
              active: c.status !== "inactive",
              clicks: c.clicks_count || 0,
              sales: c.sales_count || 0
            })));
          }

          const { data: dbPayouts } = await supabase.from("payout_disbursements").select("*").eq("partner_id", user.id).order("created_at", { ascending: false });
          if (dbPayouts) {
            setPayouts(dbPayouts.map(p => ({
              period_month: p.period_month,
              amount: Number(p.amount) || 0,
              status: p.status
            })));
          }
        }
      } catch (e) {
        console.error("Supabase sync fallback active:", e);
      }
    }
    loadRealData();
  }, []);

  const handleApplyNow = async () => {
    updateAppStatus("pending");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("partner_profiles").upsert({
          id: user.id,
          application_status: "pending",
          primary_platform: "instagram",
          audience_tier: "10k-50k",
          master_tracking_link: `https://automixa.com/?ref=partner_${user.id.slice(0, 6)}`
        });
      }
    } catch (e) {
      console.error("Error submitting application:", e);
    }
  };

  const handleCopyLink = () => {
    setCopied(true);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(displayTrackingLink);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = displayTrackingLink;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try { document.execCommand("copy"); } catch (err) { console.error("Failed to copy", err); } finally { document.body.removeChild(textarea); }
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (code) => {
    setCopiedCode(code);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try { document.execCommand("copy"); } catch (err) { console.error("Failed to copy", err); } finally { document.body.removeChild(textarea); }
    }
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleGenerateCode = async (e) => {
    e.preventDefault();
    const cleanCode = newCodeInput.toUpperCase().trim();
    if (!cleanCode) return;
    setGenerating(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to generate promo codes.");

      const customerDiscount = newSplit === "15_15" ? 15 : 10;
      const partnerCommission = newSplit === "10_20" ? 20 : 15;

      const { error } = await supabase.from("promo_codes").insert({
        partner_id: user.id,
        code: cleanCode,
        customer_discount_percent: customerDiscount,
        partner_commission_percent: partnerCommission,
        split_config: newSplit,
        status: "active"
      });

      if (error) {
        if (error.code === "23505") throw new Error("This promo code already exists. Please choose a unique name.");
        throw error;
      }

      setPromoCodes(prev => [
        {
          code: cleanCode,
          discount: `${customerDiscount}% off`,
          split: newSplit === "10_20" ? "10% Off / 20% Commission" : newSplit === "15_15" ? "15% Off / 15% Commission" : "10% Off / 15% Commission",
          active: true, clicks: 0, sales: 0
        },
        ...prev
      ]);
      setNewCodeInput("");
      setGenSuccess(true);
      setTimeout(() => setGenSuccess(false), 3000);
    } catch (err) {
      console.error("Error creating promo code:", err);
      alert(err.message || "Failed to create promo code. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteCode = async (codeToDelete) => {
    if (!confirm(`Delete promo code ${codeToDelete}?`)) return;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in.");

      const { error } = await supabase.from("promo_codes").delete().eq("partner_id", user.id).eq("code", codeToDelete);
      if (error) throw error;
      setPromoCodes(prev => prev.filter(c => c.code !== codeToDelete));
    } catch (err) {
      console.error("Error deleting promo code:", err);
      alert(err.message || "Failed to delete promo code.");
    }
  };

  const tierColors = {
    silver: "bg-zinc-100 text-zinc-700 border-zinc-200",
    gold: "bg-amber-50 text-amber-700 border-amber-200",
    platinum: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-500">

      {/* STATE 1: UNAPPLIED */}
      {appStatus === "unapplied" && (
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-10 shadow-sm text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
            <Users size={26} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">Become an ambassador</h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-md mx-auto">
              Automixa partners earn up to 25% recurring commission on every subscriber. All applications are manually vetted to maintain top-tier ecosystem quality.
            </p>
          </div>
          <button
            onClick={handleApplyNow}
            className="mt-2 px-7 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all inline-flex items-center gap-2"
          >
            Apply now <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* STATE 2: PENDING */}
      {appStatus === "pending" && (
        <div className="bg-white border border-amber-200/80 rounded-2xl p-8 shadow-sm text-center space-y-4 max-w-xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-400" />
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
            <Clock size={26} className="animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-zinc-900">Application under review</h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto">
              Our growth team evaluates creator profiles within 24 hours. We&apos;ll notify you once approved.
            </p>
          </div>
        </div>
      )}

      {/* STATE 3: APPROVED */}
      {appStatus === "approved" && (
        <div className="space-y-4">

          {/* Hero Banner */}
          <div className="relative rounded-[20px] sm:rounded-[24px] p-4 sm:p-8 text-white shadow-md flex flex-col justify-center overflow-hidden group mb-2">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] via-indigo-800 to-purple-900" />
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                  <Sparkles size={28} className="text-white drop-shadow-sm" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight drop-shadow-md">
                    Automixa Partner Program
                  </h2>
                  <p className="text-white/90 text-sm mt-1 font-medium drop-shadow-sm max-w-md">
                    Earn up to 25% recurring commission on every user you refer to our platform.
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold tracking-wide">Active Partner</span>
              </div>
            </div>
          </div>

          {/* Metrics Row (Overview Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 flex flex-col justify-between shadow-lg shadow-zinc-200/20 hover:shadow-xl transition-all duration-300 group cursor-default relative overflow-hidden hover:-translate-y-0.5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-emerald-200 shadow-sm transition-all duration-500 group-hover:scale-110 text-emerald-600 bg-emerald-50">
                  <DollarSign size={18} />
                </div>
              </div>
              <div className="space-y-1 relative z-10">
                <span className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tighter leading-none block group-hover:text-emerald-600 transition-colors duration-300">
                  ₹{partnerProfile.monthly_recurring_revenue.toLocaleString("en-IN")}
                </span>
                <span className="text-[12px] font-semibold text-zinc-500 tracking-wide block mt-1">
                  Monthly Revenue
                </span>
              </div>
            </div>

            <div className="bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 flex flex-col justify-between shadow-lg shadow-zinc-200/20 hover:shadow-xl transition-all duration-300 group cursor-default relative overflow-hidden hover:-translate-y-0.5">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-blue-200 shadow-sm transition-all duration-500 group-hover:scale-110 text-blue-600 bg-blue-50">
                  <Users size={18} />
                </div>
              </div>
              <div className="space-y-1 relative z-10">
                <span className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tighter leading-none block group-hover:text-blue-600 transition-colors duration-300">
                  {partnerProfile.total_referrals_count}
                </span>
                <span className="text-[12px] font-semibold text-zinc-500 tracking-wide block mt-1">
                  Total Referrals
                </span>
              </div>
            </div>
          </div>

          {/* Main Grouped Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-stretch">
            
            {/* Left Card: Promotion & Links */}
            <div className="bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 shadow-lg shadow-zinc-200/20 hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-transparent">
              <h3 className="font-bold text-xl text-zinc-950 tracking-tight flex items-center gap-2 mb-6 border-b border-zinc-100 pb-4">
                <LinkIcon size={20} className="text-[#6366F1]" /> Promotion & Links
              </h3>
              
              <div className="space-y-6 flex-1 flex flex-col">
                {/* Tracking Link */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-zinc-900">Master tracking link</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 flex items-center justify-between overflow-hidden min-w-0">
                      <span className="text-sm text-zinc-700 truncate">{displayTrackingLink}</span>
                      <a href={displayTrackingLink} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-indigo-600 transition-colors shrink-0 ml-2">
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Promo Codes */}
                <div className="flex-1 flex flex-col">
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-zinc-900">Custom promo codes</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">Create unique codes to share with your audience.</p>
                  </div>

                  <form onSubmit={handleGenerateCode} className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">#</span>
                      <input
                        type="text"
                        required
                        placeholder="code name"
                        value={newCodeInput}
                        onChange={(e) => setNewCodeInput(e.target.value.replace(/\s+/g, "").toLowerCase())}
                        className="w-full pl-7 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                      />
                    </div>
                    <select
                      value={newSplit}
                      onChange={(e) => setNewSplit(e.target.value)}
                      className="w-24 sm:w-auto px-2 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors appearance-none"
                    >
                      <option value="10_20">10% Off / 20% Comm.</option>
                      <option value="15_15">15% Off / 15% Comm.</option>
                      <option value="10_15">10% Off / 15% Comm.</option>
                    </select>
                    <button
                      type="submit"
                      disabled={generating}
                      className="px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all whitespace-nowrap disabled:opacity-60"
                    >
                      {generating ? "Adding…" : "Add code"}
                    </button>
                  </form>

                  {genSuccess && (
                    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 mb-4">
                      <Check size={13} /> Promo code created successfully.
                    </div>
                  )}

                  <div className="border border-zinc-100 rounded-xl overflow-x-auto flex-1">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 text-xs font-medium">
                          <th className="px-3 py-2.5">Code</th>
                          <th className="px-3 py-2.5 hidden sm:table-cell">Split</th>
                          <th className="px-3 py-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {promoCodes.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-3 py-6 text-center text-zinc-400 text-sm">No promo codes yet.</td>
                          </tr>
                        ) : (
                          promoCodes.map((item, idx) => (
                            <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                              <td className="px-3 py-2.5">
                                <span className="font-semibold text-zinc-900 uppercase text-sm">{item.code}</span>
                                <div className="text-xs text-zinc-500 sm:hidden mt-0.5">{item.discount}</div>
                              </td>
                              <td className="px-3 py-2.5 hidden sm:table-cell text-xs text-zinc-500">{item.split}</td>
                              <td className="px-3 py-2.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleCopyCode(item.code)}
                                    className="p-1.5 text-zinc-400 hover:text-indigo-600 bg-white border border-zinc-200 hover:border-indigo-200 rounded-lg transition-colors shadow-sm"
                                  >
                                    {copiedCode === item.code ? <Check size={13} /> : <Copy size={13} />}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCode(item.code)}
                                    className="p-1.5 text-zinc-400 hover:text-rose-600 bg-white border border-zinc-200 hover:border-rose-200 rounded-lg transition-colors shadow-sm"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Earnings & Tiers */}
            <div className="bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 shadow-lg shadow-zinc-200/20 hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-transparent">
              <h3 className="font-bold text-xl text-zinc-950 tracking-tight flex items-center justify-between gap-2 mb-6 border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-2">
                  <Award size={20} className="text-emerald-500" /> Earnings & Tiers
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border ${tierColors[partnerProfile.active_tier] || tierColors.silver}`}>
                  {partnerProfile.active_tier} Tier
                </span>
              </h3>

              <div className="space-y-6 flex-1 flex flex-col">
                {/* Commission tiers */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 mb-3">Commission tiers</h4>
                  <div className="space-y-2">
                    {[
                      { tier: "Silver", range: "0–9 referrals", rate: "15%", active: partnerProfile.active_tier === "silver" },
                      { tier: "Gold", range: "10–49 referrals", rate: "20%", active: partnerProfile.active_tier === "gold" },
                      { tier: "Platinum", range: "50+ referrals", rate: "25%", active: partnerProfile.active_tier === "platinum" },
                    ].map((t) => (
                      <div
                        key={t.tier}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 border text-sm transition-all shadow-sm ${
                          t.active
                            ? "bg-indigo-50 border-indigo-200 text-indigo-900 scale-[1.02]"
                            : "bg-white border-zinc-100 text-zinc-500"
                        }`}
                      >
                        <div>
                          <span className={`font-semibold ${t.active ? "text-indigo-700" : "text-zinc-700"}`}>{t.tier}</span>
                          <span className="text-xs ml-2 opacity-70">{t.range}</span>
                        </div>
                        <span className={`text-sm font-bold ${t.active ? "text-indigo-600" : "text-zinc-400"}`}>{t.rate}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Payouts */}
                <div className="flex-1 flex flex-col">
                  <h4 className="text-sm font-semibold text-zinc-900 mb-3">Recent payouts</h4>
                  <div className="space-y-2 flex-1 border border-zinc-100 rounded-xl p-4 bg-zinc-50/50">
                    {payouts.length === 0 ? (
                      <p className="text-xs text-zinc-400 text-center py-6">No payouts yet.</p>
                    ) : (
                      payouts.slice(0, 6).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-zinc-900">{item.period_month}</p>
                            <p className="text-xs text-zinc-500 capitalize">{item.status}</p>
                          </div>
                          <p className="text-sm font-bold text-zinc-900">₹{item.amount.toLocaleString("en-IN")}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
