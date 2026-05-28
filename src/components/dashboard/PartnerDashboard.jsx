"use client";

import { createClient } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Clock, Copy, CreditCard, ExternalLink, Plus, Tag, Trash2, TrendingUp, Users, X, Link as LinkIcon, Download } from "lucide-react";
import { useEffect, useState } from "react";
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
          split: newSplit === "10_20" ? "10% Off / 20% Commission" : newSplit === "15_15" ? "15% Off / 15% Commission" : "10% Off / 15% Commission",
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
    { id: "upi", title: "Instant UPI transfer", desc: "Receive monthly dispersals to your VPA ID." },
    { id: "bank_transfer", title: "Direct bank transfer", desc: "Automated NEFT/IMPS to your bank account." }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full max-w-[1200px] mx-auto pb-8 relative">
      
      {/* STATE 1: UNAPPLIED */}
      {appStatus === "unapplied" && (
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-10 sm:p-14 shadow-sm text-center space-y-6 max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100 shadow-sm">
            <Users size={28} />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">Become an ambassador</h2>
            <p className="text-sm text-zinc-500 font-normal leading-relaxed max-w-lg mx-auto">
              Automixa partners earn up to 25% recurring commission on every subscriber. All applications are manually vetted to maintain top-tier ecosystem quality.
            </p>
          </div>
          <button 
            onClick={handleApplyNow}
            className="mt-6 px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all inline-flex items-center justify-center gap-2"
          >
            Apply now <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* STATE 2: PENDING APPROVAL */}
      {appStatus === "pending" && (
        <div className="bg-white border border-amber-200/80 rounded-2xl p-8 sm:p-12 shadow-sm text-center space-y-6 max-w-2xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-400" />
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
            <Clock size={28} className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">Application under review</h2>
            <p className="text-sm text-zinc-500 font-normal leading-relaxed max-w-md mx-auto">
              Our growth team evaluates creator profiles within 24 hours. We'll notify you once approved.
            </p>
          </div>
        </div>
      )}

      {/* STATE 3: APPROVED & ACTIVE */}
      {appStatus === "approved" && (
        <div className="space-y-6">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <span className="text-sm font-medium text-zinc-500">Monthly recurring revenue</span>
              <div className="text-3xl font-semibold text-zinc-900 tracking-tight mt-2">
                ₹{partnerProfile.monthly_recurring_revenue.toLocaleString('en-IN')}
              </div>
            </div>
            
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <span className="text-sm font-medium text-zinc-500">Total referrals</span>
              <div className="text-3xl font-semibold text-zinc-900 tracking-tight mt-2">
                {partnerProfile.total_referrals_count}
              </div>
            </div>
            
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between items-start">
              <span className="text-sm font-medium text-zinc-500">Active tier</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-3xl font-semibold text-indigo-600 tracking-tight capitalize">
                  {partnerProfile.active_tier}
                </span>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg">
                  {Math.round(partnerProfile.commission_rate * 100)}% cut
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Content (Left, 2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Tracking Link */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <LinkIcon size={18} className="text-zinc-400" />
                  <h3 className="text-base font-semibold text-zinc-900">Master tracking link</h3>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex items-center justify-between group overflow-hidden">
                    <span className="text-sm font-medium text-zinc-700 truncate">{displayTrackingLink}</span>
                    <a href={displayTrackingLink} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-indigo-600 transition-colors shrink-0 ml-2">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                  <button 
                    onClick={handleCopyLink}
                    className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Promo Codes */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900">Custom promo codes</h3>
                  <p className="text-sm text-zinc-500 mt-1">Create unique codes to share with your audience.</p>
                </div>

                <form onSubmit={handleGenerateCode} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-medium text-sm">#</span>
                    <input 
                      type="text" 
                      required
                      placeholder="code name"
                      value={newCodeInput}
                      onChange={(e) => setNewCodeInput(e.target.value.replace(/\s+/g, '').toLowerCase())}
                      className="w-full pl-7 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                    />
                  </div>
                  <select 
                    value={newSplit}
                    onChange={(e) => setNewSplit(e.target.value)}
                    className="sm:w-64 p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors appearance-none"
                  >
                    <option value="10_20">10% Off / 20% Commission</option>
                    <option value="15_15">15% Off / 15% Commission</option>
                    <option value="10_15">10% Off / 15% Commission</option>
                  </select>
                  <button 
                    type="submit" 
                    disabled={generating}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all whitespace-nowrap"
                  >
                    {generating ? "Adding..." : "Add code"}
                  </button>
                </form>

                <div className="border border-zinc-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-zinc-50/50 border-b border-zinc-100 text-zinc-500 text-xs font-medium">
                        <th className="px-4 py-3 font-medium">Code</th>
                        <th className="px-4 py-3 font-medium hidden sm:table-cell">Discount</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {promoCodes.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-8 text-center text-zinc-400 text-sm">No promo codes active.</td>
                        </tr>
                      ) : (
                        promoCodes.map((item, idx) => (
                          <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <span className="font-semibold text-zinc-900 uppercase">{item.code}</span>
                              <div className="text-xs text-zinc-500 sm:hidden mt-0.5">{item.discount}</div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell text-sm text-zinc-600">{item.discount}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleCopyCode(item.code)}
                                  className="p-2 text-zinc-400 hover:text-indigo-600 bg-zinc-50 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                  {copiedCode === item.code ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                                <button 
                                  onClick={() => handleDeleteCode(item.code)}
                                  className="p-2 text-zinc-400 hover:text-rose-600 bg-zinc-50 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={14} />
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

            {/* Side Content (Right, 1 col) */}
            <div className="space-y-6">
              
              {/* Payout Settings */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-zinc-900">Payout method</h3>
                  <button 
                    onClick={() => setIsPayoutModalOpen(true)}
                    className="text-sm text-indigo-600 font-semibold hover:text-indigo-700"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="w-10 h-10 bg-white border border-zinc-200 rounded-lg flex items-center justify-center text-zinc-600 font-semibold text-xs shrink-0 uppercase">
                    {payoutMethod === "upi" ? "upi" : "bank"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-500 font-medium">Connected account</p>
                    <p className="text-sm font-semibold text-zinc-900 truncate mt-0.5">
                      {payoutMethod === "upi" ? upiId : bankAccountNo}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Payouts */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-semibold text-zinc-900 mb-4">Recent payouts</h3>
                <div className="space-y-4">
                  {payouts.length === 0 ? (
                    <p className="text-sm text-zinc-400 text-center py-4">No payouts yet.</p>
                  ) : (
                    payouts.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{item.period_month}</p>
                          <p className="text-xs text-zinc-500 capitalize">{item.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-zinc-900">₹{item.amount.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}

      {/* PAYOUT MODAL */}
      <AnimatePresence>
        {mounted && isPayoutModalOpen && typeof document !== "undefined" && createPortal(
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm" 
              onClick={() => setIsPayoutModalOpen(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white border border-zinc-200/80 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-6 z-10"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-900">Payout method</h2>
                <button 
                  onClick={() => setIsPayoutModalOpen(false)} 
                  className="p-2 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSavePayoutMethod} className="space-y-6">
                <div className="space-y-3">
                  {payoutOptions.map((t) => (
                    <div 
                      key={t.id} 
                      onClick={() => setPayoutMethod(t.id)} 
                      className={`cursor-pointer border rounded-xl p-4 flex items-center justify-between transition-all ${payoutMethod === t.id ? 'border-indigo-400 bg-indigo-50/50' : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${payoutMethod === t.id ? 'border-indigo-600' : 'border-zinc-300'}`}>
                          {payoutMethod === t.id && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{t.title}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{t.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {payoutMethod === "upi" ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">UPI ID</label>
                    <input 
                      type="text" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                      placeholder="e.g. yourname@okaxis"
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Account holder name</label>
                      <input 
                        type="text" 
                        value={bankHolderName}
                        onChange={(e) => setBankHolderName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Account number</label>
                      <input 
                        type="text" 
                        value={bankAccountNo}
                        onChange={(e) => setBankAccountNo(e.target.value.replace(/\D/g, ''))}
                        required
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">IFSC code</label>
                      <input 
                        type="text" 
                        value={bankIfsc}
                        onChange={(e) => setBankIfsc(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                        required
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm rounded-xl transition-all"
                >
                  Save settings
                </button>
              </form>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
}
