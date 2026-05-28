"use client";

import { createClient } from "@/lib/supabase";
import { AnimatePresence,motion } from "framer-motion";
import { ArrowRight,Check,Clock,Copy,CreditCard,ExternalLink,Plus,Tag,Trash2,TrendingUp,Users,X } from "lucide-react";
import { useEffect,useState } from "react";
import { createPortal } from "react-dom";

export default function PartnerDashboard({ currentPlan = "free" }) {
  const [appStatus, setAppStatus] = useState("approved"); // 'unapplied', 'pending', 'approved'
  
  const updateAppStatus = (status) => {
    setAppStatus(status);
    if (typeof window !== "undefined") {
      localStorage.setItem("partner_app_status", status);
      window.dispatchEvent(new Event("partner_status_updated"));
    }
  };

  const [copied, setCopied] = useState(false);

  // Real DB / Fallback State
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

  // Payout Modal State
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState("upi"); // 'upi' | 'bank_transfer'
  const [upiId, setUpiId] = useState("rohit@okaxis");
  const [bankAccountNo, setBankAccountNo] = useState("31920391203");
  const [bankIfsc, setBankIfsc] = useState("HDFC0001234");
  const [bankHolderName, setBankHolderName] = useState("Rohit Sharma");
  const [payoutSaveSuccess, setPayoutSaveSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const displayTrackingLink = typeof window !== "undefined"
    ? (partnerProfile?.master_tracking_link || "").replace(/https:\/\/(automixa\.in|automixa\.com)/, window.location.origin)
    : (partnerProfile?.master_tracking_link || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    async function loadRealData() {
      if (typeof window !== "undefined") {
        const savedStatus = localStorage.getItem("partner_app_status");
        if (savedStatus) {
          setTimeout(() => {
            setAppStatus(savedStatus);
          }, 0);
        }
      }
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          let { data: profile } = await supabase.from("partner_profiles").select("*").eq("id", user.id).single();
          
          if (!profile) {
            // Auto-initialize standard approved profile in database for instant active real-world usage
            const defaultLink = `https://automixa.in/?ref=partner_${user.id.slice(0, 6)}`;
            const { data: newProfile } = await supabase.from("partner_profiles").insert({
              id: user.id,
              application_status: "approved",
              master_tracking_link: defaultLink,
              active_tier: "silver",
              commission_rate: 0.15,
              total_referrals_count: 0,
              monthly_recurring_revenue: 0.00,
              payout_method: "upi",
              payout_address: "rohit@okaxis"
            }).select().single();
            
            if (newProfile) {
              profile = newProfile;
            }
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
            if (profile.payout_method) setPayoutMethod(profile.payout_method);
            if (profile.payout_address) {
              if (profile.payout_method === "upi") {
                setUpiId(profile.payout_address);
              } else {
                try {
                  const parsed = JSON.parse(profile.payout_address);
                  if (parsed.accountNo) setBankAccountNo(parsed.accountNo);
                  if (parsed.ifsc) setBankIfsc(parsed.ifsc);
                  if (parsed.holderName) setBankHolderName(parsed.holderName);
                } catch {
                  setBankAccountNo(profile.payout_address);
                }
              }
            }
          }

          const { data: codes } = await supabase.from("promo_codes").select("*").eq("partner_id", user.id).order("created_at", { ascending: false });
          if (codes) {
            setPromoCodes(codes.map(c => ({
              code: c.code,
              discount: `${c.customer_discount_percent || 10}% off`,
              split: c.split_config === "10_20" ? "10% Customer / 20% Commission" : c.split_config === "15_15" ? "15% Customer / 15% Commission" : "10% Customer / 15% Commission",
              active: c.status !== "inactive",
              clicks: c.clicks_count || 0,
              sales: c.sales_count || 0
            })));
          }

          const { data: dbPayouts } = await supabase.from("payout_disbursements").select("*").eq("partner_id", user.id).order("created_at", { ascending: false });
          if (dbPayouts) {
            setPayouts(dbPayouts.map(p => ({
              period_month: p.period_month,
              referrals_count: `${p.amount ? Math.floor(p.amount / 900) : 0} Users`,
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
    return () => clearTimeout(timer);
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
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(displayTrackingLink);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = displayTrackingLink;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("Failed to copy link via fallback", err);
      } finally {
        document.body.removeChild(textarea);
      }
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (code) => {
    setCopiedCode(code);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("Failed to copy code via fallback", err);
      } finally {
        document.body.removeChild(textarea);
      }
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
        status: 'active'
      });

      if (error) {
        if (error.code === "23505") {
          throw new Error("This promo code already exists. Please choose a unique name.");
        }
        throw error;
      }

      setPromoCodes(prev => [
        { 
          code: cleanCode, 
          discount: `${customerDiscount}% off`,
          split: newSplit === "10_20" ? "10% Customer / 20% Commission" : newSplit === "15_15" ? "15% Customer / 15% Commission" : "10% Customer / 15% Commission",
          active: true,
          clicks: 0,
          sales: 0
        },
        ...prev
      ]);
      setNewCodeInput("");
      setGenSuccess(true);
      setTimeout(() => setGenSuccess(false), 3000);
    } catch (err) {
      console.error("Error creating promo code in DB:", err);
      alert(err.message || "Failed to create promo code. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteCode = async (codeToDelete) => {
    if (!confirm(`Are you sure you want to delete promo code ${codeToDelete}?`)) return;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to delete promo codes.");

      const { error } = await supabase
        .from("promo_codes")
        .delete()
        .eq("partner_id", user.id)
        .eq("code", codeToDelete);

      if (error) throw error;
      setPromoCodes(prev => prev.filter(c => c.code !== codeToDelete));
    } catch (err) {
      console.error("Error deleting promo code:", err);
      alert(err.message || "Failed to delete promo code. Please try again.");
    }
  };

  const handleSavePayoutMethod = async (e) => {
    e.preventDefault();
    const finalAddress = payoutMethod === "upi" ? upiId : JSON.stringify({
      accountNo: bankAccountNo,
      ifsc: bankIfsc,
      holderName: bankHolderName
    });

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to save payout settings.");

      const { error } = await supabase.from("partner_profiles").update({
        payout_method: payoutMethod,
        payout_address: finalAddress
      }).eq("id", user.id);

      if (error) throw error;

      setIsPayoutModalOpen(false);
      setPayoutSaveSuccess(true);
      setTimeout(() => setPayoutSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Error updating payout method in DB:", err);
      alert(err.message || "Failed to save payout settings. Please try again.");
    }
  };

  const payoutOptions = [
    { id: "upi", title: "Instant UPI Transfer", desc: "Instantly receive monthly dispersals to your @okaxis / @ybl VPA ID." },
    { id: "bank_transfer", title: "Direct Bank Transfer", desc: "Automated NEFT / IMPS transfer directly to your bank account." }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500 w-full max-w-[1400px] mx-auto pb-8 relative">
      


      {/* STATE 1: UNAPPLIED */}
      {appStatus === "unapplied" && (
        <div className="bg-white border border-zinc-200/80 rounded-[32px] p-10 sm:p-16 shadow-xl shadow-zinc-200/20 text-center space-y-8 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1]/5 rounded-full -mr-32 -mt-32 pointer-events-none" />
          <div className="w-20 h-20 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center mx-auto border border-[#6366F1]/20 shadow-xl backdrop-blur-md relative z-10">
            <Users size={36} />
          </div>
          <div className="space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tighter leading-tight">Become an Exclusive Ambassador</h2>
            <p className="text-xs sm:text-base text-zinc-500 font-medium leading-relaxed max-w-xl mx-auto">
              Automixa partners earn up to 25% recurring commission on every subscriber. All applications are manually vetted to maintain top-tier ecosystem quality.
            </p>
          </div>
          <div className="pt-4 relative z-10">
            <button 
              onClick={handleApplyNow}
              className="px-10 py-5 bg-zinc-950 hover:bg-[#6366F1] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-2xl transition-all flex items-center justify-center gap-3 mx-auto hover:scale-105"
            >
              Apply Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STATE 2: PENDING APPROVAL */}
      {appStatus === "pending" && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-8 sm:p-12 shadow-xl shadow-amber-100/30 text-center space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20 shadow-sm">
            <Clock size={32} className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full uppercase tracking-wider">Application Under Review</span>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-950 tracking-tight mt-2">We are reviewing your profile!</h2>
            <p className="text-xs sm:text-sm text-amber-800/80 leading-relaxed max-w-lg mx-auto">
              Our growth team evaluates creator profiles within 24 hours. We are verifying your follower size and promotion guidelines.
            </p>
          </div>

          <div className="p-6 bg-white/80 rounded-xl border border-amber-200/60 max-w-md mx-auto text-left space-y-3 shadow-sm">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Application Summary</h4>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Platform:</span>
              <span className="font-semibold text-zinc-800 capitalize">Instagram Creator</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Audience Tier:</span>
              <span className="font-semibold text-zinc-800">10,000 - 50,000 Followers</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Estimated Commission:</span>
              <span className="font-semibold text-emerald-600">
                {currentPlan === "viral_scale" ? "25% VIP Commission (Platinum)" : "20% Monthly Recurring (Gold)"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: APPROVED & ACTIVE */}
      {appStatus === "approved" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 w-full">
          
          {/* BENTO CARD 1: Tracking Link (col-span-2) */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-[24px] p-5 sm:p-6 shadow-xl shadow-zinc-200/20 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#6366F1]/5 hover:border-[#6366F1]/20 transition-all duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1]/5 rounded-full -mr-32 -mt-32 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black text-[#6366F1] uppercase tracking-[0.3em]">Affiliate Portal</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tighter mt-1">Master Tracking Link</h3>
                  <p className="text-[11px] text-zinc-500 mt-1">Share in bio, stories, and posts to auto-attribute sales.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-full flex items-center gap-1 shadow-xs self-start sm:self-center">
                  <Check size={10} /> Active Cookie (60 Days)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-2 rounded-xl border border-zinc-200 shadow-sm mt-2">
                <a 
                  href={displayTrackingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl flex-1 text-xs font-semibold text-zinc-800 hover:text-[#6366F1] hover:bg-zinc-100/50 transition-all truncate select-all font-mono flex items-center justify-between gap-2 group/link"
                >
                  <span className="truncate">{displayTrackingLink}</span>
                  <ExternalLink size={12} className="text-zinc-400 group-hover/link:text-[#6366F1] transition-colors shrink-0" />
                </a>
                <button 
                  onClick={handleCopyLink}
                  className="px-6 py-3 bg-[#6366F1] hover:bg-[#5254D8] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "Link Copied!" : "Copy Link"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* BENTO CARD 2: Tier & Earnings (col-span-1) */}
          <div className="lg:col-span-1 bg-white border border-zinc-200/80 rounded-[24px] p-5 sm:p-6 shadow-xl shadow-zinc-200/20 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#6366F1]/5 hover:border-[#6366F1]/20 transition-all duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -mr-24 -mt-24 pointer-events-none group-hover:scale-110 transition-all duration-500" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-[#6366F1]" size={16} />
                  <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">Earnings Summary</h3>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[9px] font-bold uppercase tracking-wider">Active</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs font-semibold text-zinc-500">Monthly Recurring Revenue</span>
                <div className="text-3xl font-black text-emerald-600 tracking-tight">₹{partnerProfile.monthly_recurring_revenue.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-zinc-200/50 pt-4 mt-6">
              <div>
                <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block">Total Referrals</span>
                <span className="text-lg font-bold text-zinc-900 mt-0.5">{partnerProfile.total_referrals_count} Users</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block">Active Tier</span>
                <span className="text-lg font-bold text-[#6366F1] capitalize mt-0.5 flex items-center gap-1">
                  {partnerProfile.active_tier} <span className="text-[10px] text-zinc-400">({Math.round(partnerProfile.commission_rate * 100)}%)</span>
                </span>
              </div>
            </div>
          </div>

          {/* BENTO CARD 3: Custom Promo Codes (col-span-2) */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-[24px] p-5 sm:p-6 shadow-xl shadow-zinc-200/20 space-y-4 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#6366F1]/5 hover:border-[#6366F1]/20 transition-all duration-500 relative overflow-hidden group">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/50 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Tag className="text-[#6366F1]" size={16} />
                    <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">Custom Promo Codes</h3>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">Create memorable discount codes for your followers. Razorpay instantly attributes sales to you.</p>
                </div>
                {genSuccess && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 animate-in fade-in">
                    🎉 New Promo Code Synced to DB!
                  </span>
                )}
              </div>

              {/* Generator Form */}
              <form onSubmit={handleGenerateCode} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white/70 p-4 rounded-xl border border-zinc-200 shadow-xs">
                <div className="md:col-span-5 space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 block">Create Code Name</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-extrabold text-zinc-400">#</span>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. VIPROHIT30"
                      value={newCodeInput}
                      onChange={(e) => setNewCodeInput(e.target.value.replace(/\s+/g, ''))}
                      className="w-full pl-8 pr-4 py-2.5 bg-zinc-50/80 hover:bg-white border border-zinc-200 hover:border-zinc-300 rounded-[14px] text-[13px] font-medium text-zinc-900 outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 uppercase transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 block">Discount Split Option</label>
                  <select 
                    value={newSplit}
                    onChange={(e) => setNewSplit(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50/80 hover:bg-white border border-zinc-200 hover:border-zinc-300 rounded-[14px] text-[13px] font-medium text-zinc-900 outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 transition-all duration-300"
                  >
                    <option value="10_20">10% Customer Off / 20% Commission (Gold Standard)</option>
                    <option value="15_15">15% Customer Off / 15% Commission (Balanced Split)</option>
                    <option value="10_15">10% Customer Off / 15% Commission (Silver Standard)</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <button 
                    type="submit" 
                    disabled={generating}
                    className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 h-[42px]"
                  >
                    {generating ? "Syncing..." : "Generate Code"}
                    <Plus size={16} />
                  </button>
                </div>
              </form>

              {/* List of Created Promo Codes */}
              <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                {/* Desktop Table View */}
                <table className="hidden md:table w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4">Promo Code</th>
                      <th className="p-4">Discount Offered</th>
                      <th className="p-4 hidden sm:table-cell">Attribution Rule</th>
                      <th className="p-4 text-center">Clicks / Sales</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-800">
                    {promoCodes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-400 text-xs font-medium">
                          No custom promo codes generated yet. Use the form above to generate your first custom code!
                        </td>
                      </tr>
                    ) : (
                      promoCodes.map((item, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/50 transition-all">
                          <td className="p-4 font-black text-zinc-900 tracking-tight">
                            <span className="bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 px-3 py-1.5 rounded-xl font-mono">
                              {item.code}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-emerald-600">{item.discount}</td>
                          <td className="p-4 hidden sm:table-cell text-zinc-500 font-normal">{item.split}</td>
                          <td className="p-4 text-center">
                            <span className="font-bold text-zinc-900">{item.clicks}</span> / <span className="font-bold text-[#6366F1]">{item.sales}</span>
                          </td>
                          <td className="p-4 text-right flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleCopyCode(item.code)}
                              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-all inline-flex items-center gap-1 shadow-xs"
                            >
                              {copiedCode === item.code ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                              <span>{copiedCode === item.code ? "Copied" : "Copy"}</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteCode(item.code)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all border border-rose-100 shadow-xs"
                              title="Delete Code"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Mobile Card List View */}
                <div className="md:hidden divide-y divide-zinc-100 flex flex-col">
                  {promoCodes.length === 0 ? (
                    <div className="p-8 text-center text-zinc-400 text-xs font-medium">
                      No custom promo codes generated yet. Use the form above to generate your first custom code!
                    </div>
                  ) : (
                    promoCodes.map((item, idx) => (
                      <div key={idx} className="p-5 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <span className="bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 px-3 py-1.5 rounded-xl font-mono text-xs font-black">
                            {item.code}
                          </span>
                          <span className="font-bold text-emerald-600 text-xs">{item.discount}</span>
                        </div>
                        
                        <p className="text-[10px] text-zinc-500 font-semibold">{item.split}</p>

                        <div className="flex items-center justify-between gap-4 pt-1">
                          <div className="text-[11px] text-zinc-500 font-semibold">
                            Clicks / Sales: <span className="font-bold text-zinc-900">{item.clicks}</span> / <span className="font-bold text-[#6366F1]">{item.sales}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleCopyCode(item.code)}
                              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-all inline-flex items-center gap-1 shadow-xs text-[10px]"
                            >
                              {copiedCode === item.code ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                              <span>{copiedCode === item.code ? "Copied" : "Copy"}</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteCode(item.code)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all border border-rose-100 shadow-xs"
                              title="Delete Code"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* BENTO CARD 4: Payout Settings (col-span-1) */}
          <div className="lg:col-span-1 bg-white border border-zinc-200/80 rounded-[24px] p-5 sm:p-6 shadow-xl shadow-zinc-200/20 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#6366F1]/5 hover:border-[#6366F1]/20 transition-all duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 pointer-events-none group-hover:scale-110 transition-all duration-500" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-[#6366F1]" size={16} />
                  <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">Payout Settings</h3>
                </div>
                <button 
                  onClick={() => setIsPayoutModalOpen(true)}
                  className="px-3 py-1.5 bg-[#6366F1]/10 hover:bg-[#6366F1]/20 text-[#6366F1] font-bold text-[10px] rounded-xl transition-all"
                >
                  Edit Account
                </button>
              </div>

              {payoutSaveSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-xl border border-emerald-200 animate-in fade-in">
                  ✅ Payout account updated!
                </div>
              )}

              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center font-bold text-xs border border-zinc-200/60 shrink-0">
                    {payoutMethod === "upi" ? "UPI" : "BANK"}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider block">Connected Destination</span>
                    <span className="text-xs font-bold text-zinc-800 tracking-tight truncate block mt-0.5">
                      {payoutMethod === "upi" ? upiId : `${bankAccountNo} (${bankIfsc})`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-200/50 pt-4 mt-6 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500">
                <Clock size={12} className="text-[#6366F1]" />
                <span>Next Dispersal: June 5th</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-[9px] font-bold uppercase tracking-wider">
                Auto-Paid
              </span>
            </div>
          </div>

          {/* BENTO CARD 5: Recent Payouts Table (col-span-3) */}
          <div className="lg:col-span-3 bg-white border border-zinc-200/80 rounded-[24px] p-5 sm:p-6 shadow-xl shadow-zinc-200/20 space-y-4 hover:shadow-2xl hover:shadow-[#6366F1]/5 hover:border-[#6366F1]/20 transition-all duration-500 relative overflow-hidden group">
            <div className="border-b border-zinc-200/50 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">Recent Payouts</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Commissions are disbursed on the 5th of every month.</p>
              </div>
              <span className="text-xs font-bold text-zinc-700 bg-white px-3 py-1.5 rounded-xl border border-zinc-200 shadow-xs">
                Bank Transfer / UPI Connected
              </span>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
              {/* Desktop Table View */}
              <table className="hidden md:table w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-4">Period</th>
                    <th className="p-4">Referrals Active</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-800">
                  {payouts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-zinc-400 text-xs font-medium">
                        No recent payouts recorded yet. Payouts are generated automatically on the 5th of every month when commission is earned.
                      </td>
                    </tr>
                  ) : (
                    payouts.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-4">{item.period_month}</td>
                        <td className="p-4">{item.referrals_count}</td>
                        <td className="p-4 font-bold text-zinc-900">₹{item.amount.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-right">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold capitalize">{item.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Mobile Card List View */}
              <div className="md:hidden divide-y divide-zinc-100 flex flex-col">
                {payouts.length === 0 ? (
                  <div className="p-8 text-center text-zinc-400 text-xs font-medium">
                    No recent payouts recorded yet.
                  </div>
                ) : (
                  payouts.map((item, idx) => (
                    <div key={idx} className="p-5 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-black text-zinc-900 tracking-tight">{item.period_month}</span>
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                          {item.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-1 text-[11px]">
                        <div className="text-zinc-500 font-semibold">
                          Referrals: <span className="font-bold text-zinc-800">{item.referrals_count}</span>
                        </div>
                        <div className="font-bold text-zinc-900">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* DEDICATED PAYOUT SETUP MODAL USING REACT PORTAL TO BLUR ENTIRE WINDOW (NAVBAR + SIDEBAR) */}
      <AnimatePresence>
        {mounted && isPayoutModalOpen && typeof document !== "undefined" && createPortal(
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xl" 
              onClick={() => setIsPayoutModalOpen(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-zinc-200/60 rounded-[40px] shadow-2xl p-6 sm:p-10 flex flex-col gap-8 z-10"
            >
              
              <div className="flex items-center justify-between border-b border-zinc-100 pb-6 shrink-0">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tighter">Setup Payout Method</h2>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Connect account for automated payouts</p>
                </div>
                <button 
                  onClick={() => setIsPayoutModalOpen(false)} 
                  className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-400 hover:text-zinc-900 transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              {/* FORM BODY */}
              <form onSubmit={handleSavePayoutMethod} className="space-y-8">
                
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 block">Select Transfer Method</label>
                  <div className="grid grid-cols-1 gap-4">
                    {payoutOptions.map((t) => (
                      <div 
                        key={t.id} 
                        onClick={() => setPayoutMethod(t.id)} 
                        className={`cursor-pointer border rounded-xl p-5 flex items-center justify-between transition-all duration-300 ${payoutMethod === t.id ? 'border-[#6366F1] bg-[#6366F1]/5 shadow-lg shadow-[#6366F1]/5' : 'border-zinc-100 bg-zinc-50/50 hover:border-zinc-200'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${payoutMethod === t.id ? 'bg-[#6366F1] text-white shadow-xl shadow-[#6366F1]/20' : 'bg-white border border-zinc-100 text-zinc-400 shadow-sm'}`}>
                            <CreditCard size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-zinc-950 mb-0.5">{t.title}</h4>
                            <p className="text-[10px] font-medium text-zinc-500">{t.desc}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${payoutMethod === t.id ? 'bg-[#6366F1] border-[#6366F1]' : 'border-zinc-200'}`}>
                          {payoutMethod === t.id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              {/* FIELDS FOR UPI */}
              {payoutMethod === "upi" && (
                <div className="space-y-2 animate-in fade-in duration-300 pt-2">
                  <label className="text-xs font-semibold text-zinc-900 ml-1 block">UPI ID / VPA Address</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. rohit@okaxis or creator@ybl" 
                    value={upiId} 
                    onChange={(e) => setUpiId(e.target.value)} 
                    className="w-full bg-zinc-50/80 hover:bg-white border border-zinc-200 hover:border-zinc-300 rounded-[14px] px-4 py-2.5 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none"
                  />
                </div>
              )}

              {/* FIELDS FOR BANK TRANSFER */}
              {payoutMethod === "bank_transfer" && (
                <div className="space-y-6 animate-in fade-in duration-300 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-900 ml-1 block">Account Holder&apos;s Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Rohit Sharma" 
                      value={bankHolderName} 
                      onChange={(e) => setBankHolderName(e.target.value)} 
                      className="w-full bg-zinc-50/80 hover:bg-white border border-zinc-200 hover:border-zinc-300 rounded-[14px] px-4 py-2.5 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-900 ml-1 block">Account Number</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. 31920391203" 
                        value={bankAccountNo} 
                        onChange={(e) => setBankAccountNo(e.target.value)} 
                        className="w-full bg-zinc-50/80 hover:bg-white border border-zinc-200 hover:border-zinc-300 rounded-[14px] px-4 py-2.5 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-900 ml-1 block">IFSC Code</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. HDFC0001234" 
                        value={bankIfsc} 
                        onChange={(e) => setBankIfsc(e.target.value.toUpperCase())} 
                        className="w-full bg-zinc-50/80 hover:bg-white border border-zinc-200 hover:border-zinc-300 rounded-[14px] px-4 py-2.5 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:bg-white focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 outline-none uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 border-t border-zinc-100 pt-8 mt-2">
                <button type="button" onClick={() => setIsPayoutModalOpen(false)} className="px-6 py-4 rounded-xl text-[10px] font-black text-zinc-400 hover:text-zinc-600 transition-all uppercase tracking-widest">Cancel</button>
                <button 
                  type="submit"
                  className="flex-1 px-8 py-5 bg-zinc-950 hover:bg-[#6366F1] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Save Payout Details <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
        )}
      </AnimatePresence>
    </div>
  );
}
