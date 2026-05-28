"use client";

import { useDashboard } from "@/context/DashboardContext";
import { createClient } from "@/lib/supabase";
import {
  AlertCircle, Bell, Check, CheckCircle2, Globe, Loader2,
  LogOut, RefreshCcw, UserCheck, UserPlus, Users, Wallet, Zap
} from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsDashboard({ account, currentPlan = "free", realtimeStats }) {
  const {
    selectedWorkspace,
    workspaceMembers,
    workspaceMembersLoading,
    inviteMember,
    removeMember,
    updateMemberRole,
    disconnectAccount,
    updateSelectedAccount
  } = useDashboard();

  const usedQuota = realtimeStats?.totalDms + realtimeStats?.autoReplies || 0;
  const maxQuota = currentPlan === "viral_scale" ? 2000000 : currentPlan === "creator_pro" ? 250000 : 25000;
  const quotaPercent = Math.min((usedQuota / maxQuota) * 100, 100);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [isInviting, setIsInviting] = useState(false);

  // Webhook States
  const [webhookUrl, setWebhookUrl] = useState(account?.metadata?.webhook_url || "");
  const [webhookEnabled, setWebhookEnabled] = useState(account?.metadata?.webhook_enabled || false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testWebhookResult, setTestWebhookResult] = useState(null);
  const [testWebhookMessage, setTestWebhookMessage] = useState("");

  // Payout States
  const [payoutMethod, setPayoutMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankHolderName, setBankHolderName] = useState("");
  const [payoutSaving, setPayoutSaving] = useState(false);
  const [payoutSaved, setPayoutSaved] = useState(false);
  const [payoutError, setPayoutError] = useState("");

  const [prevAccount, setPrevAccount] = useState(account);
  if (account !== prevAccount) {
    setPrevAccount(account);
    setWebhookUrl(account?.metadata?.webhook_url || "");
    setWebhookEnabled(account?.metadata?.webhook_enabled || false);
    setTestWebhookResult(null);
    setTestWebhookMessage("");
  }

  // Load existing payout details from Supabase
  useEffect(() => {
    async function loadPayoutDetails() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("partner_profiles")
          .select("payout_method, payout_address")
          .eq("id", user.id)
          .maybeSingle();
        if (data?.payout_method) setPayoutMethod(data.payout_method);
        if (data?.payout_address) {
          if (data.payout_method === "upi") {
            setUpiId(data.payout_address);
          } else {
            try {
              const parsed = JSON.parse(data.payout_address);
              if (parsed.accountNo) setBankAccountNo(parsed.accountNo);
              if (parsed.ifsc) setBankIfsc(parsed.ifsc);
              if (parsed.holderName) setBankHolderName(parsed.holderName);
            } catch {
              setBankAccountNo(data.payout_address);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load payout details:", e);
      }
    }
    loadPayoutDetails();
  }, []);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !selectedWorkspace) return;
    setIsInviting(true);
    try {
      await inviteMember(selectedWorkspace.id, inviteEmail.trim(), inviteRole);
      setInviteEmail("");
      setInviteRole("viewer");
    } catch (err) {
      console.error(err);
    } finally {
      setIsInviting(false);
    }
  };

  const handleSave = async (currentUrl, currentEnabled) => {
    setIsSaved(true);
    try {
      await updateSelectedAccount({
        metadata: {
          ...(account?.metadata || {}),
          webhook_url: currentUrl,
          webhook_enabled: currentEnabled
        }
      });
    } catch (e) {
      console.error("Failed to save webhook settings:", e);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("settings_saved", "true");
      window.dispatchEvent(new Event("settings_saved_updated"));
    }
    setTimeout(() => {
      setIsSaved(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("settings_saved");
        window.dispatchEvent(new Event("settings_saved_updated"));
      }
    }, 2000);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      setTestWebhookResult("error");
      setTestWebhookMessage("Please enter a webhook URL first.");
      return;
    }
    setIsTestingWebhook(true);
    setTestWebhookResult(null);
    setTestWebhookMessage("");
    try {
      const res = await fetch("/api/webhooks/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl: webhookUrl.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestWebhookResult("success");
        setTestWebhookMessage("Connection test successful! A test payload was sent.");
      } else {
        setTestWebhookResult("error");
        setTestWebhookMessage(data.error || "Failed to deliver payload. Check your URL.");
      }
    } catch (e) {
      setTestWebhookResult("error");
      setTestWebhookMessage("Network error. Please try again.");
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleSavePayoutDetails = async (e) => {
    e.preventDefault();
    setPayoutSaving(true);
    setPayoutError("");
    setPayoutSaved(false);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in.");

      const finalAddress = payoutMethod === "upi"
        ? upiId.trim()
        : JSON.stringify({ accountNo: bankAccountNo.trim(), ifsc: bankIfsc.trim().toUpperCase(), holderName: bankHolderName.trim() });

      if (!finalAddress || (payoutMethod === "upi" && !upiId.trim())) {
        throw new Error("Please fill in all payout details.");
      }

      const { error } = await supabase.from("partner_profiles").upsert({
        id: user.id,
        payout_method: payoutMethod,
        payout_address: finalAddress
      }, { onConflict: "id" });

      if (error) throw error;
      setPayoutSaved(true);
      setTimeout(() => setPayoutSaved(false), 3000);
    } catch (err) {
      console.error("Error saving payout details:", err);
      setPayoutError(err.message || "Failed to save payout details.");
    } finally {
      setPayoutSaving(false);
    }
  };

  useEffect(() => {
    const handleGlobalSave = () => handleSave(webhookUrl, webhookEnabled);
    window.addEventListener("save_settings", handleGlobalSave);
    return () => window.removeEventListener("save_settings", handleGlobalSave);
  }, [account, webhookUrl, webhookEnabled, updateSelectedAccount]);

  const Toggle = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-9 h-5 bg-zinc-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6366F1]" />
    </label>
  );

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-500">

      {/* Row 1: 3 compact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Card: Connected Account */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <UserCheck size={15} className="text-emerald-500" />
            <h3 className="text-sm font-semibold text-zinc-900">Instagram Account</h3>
            <span className="ml-auto px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">Connected</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <img
              src={account?.profile_pic || account?.profile_picture_url || account?.metadata?.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(account?.page_name || "User")}&background=6366f1&color=fff&size=80`}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border border-zinc-200 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-900 truncate">@{account?.ig_username || account?.page_name || "account"}</p>
              <p className="text-xs text-zinc-400 mt-0.5">IG Creator Account</p>
            </div>
          </div>
          <button
            onClick={async () => {
              if (!account) return;
              if (!confirm(`Disconnect @${account.ig_username || account.page_name}? This will remove all its automation data.`)) return;
              setIsDisconnecting(true);
              try {
                const res = await disconnectAccount(account.id);
                if (res?.error) alert("Failed to disconnect: " + res.error);
                else alert("Account disconnected successfully!");
              } catch (e) { alert("Error disconnecting account."); }
              finally { setIsDisconnecting(false); }
            }}
            disabled={isDisconnecting || !account}
            className="mt-auto w-full py-2 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <LogOut size={12} />
            {isDisconnecting ? "Disconnecting…" : "Disconnect Account"}
          </button>
        </div>

        {/* Card: API Quota */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-[#6366F1]" />
            <h3 className="text-sm font-semibold text-zinc-900">API Quota</h3>
            <span className="ml-auto px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-bold">
              {currentPlan === "viral_scale" ? "Viral Scale" : currentPlan === "creator_pro" ? "Creator Pro" : "Free"}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500">Replies used</span>
              <span className="text-xs font-semibold text-zinc-900">{usedQuota.toLocaleString()} / {maxQuota.toLocaleString()}</span>
            </div>
            <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#6366F1] to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
            <p className="text-xs text-zinc-400">Resets on your next billing cycle.</p>
          </div>
        </div>

        {/* Card: Notifications */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-[#6366F1]" />
            <h3 className="text-sm font-semibold text-zinc-900">Notifications</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: "Contact Alerts", desc: "Email on new submission", state: emailAlerts, toggle: () => setEmailAlerts(!emailAlerts) },
              { label: "Weekly Summary", desc: "Growth & reply stats", state: weeklyReport, toggle: () => setWeeklyReport(!weeklyReport) },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl">
                <div>
                  <p className="text-xs font-semibold text-zinc-900">{item.label}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</p>
                </div>
                <Toggle checked={item.state} onChange={item.toggle} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Payout Details — full width */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Wallet size={15} className="text-[#6366F1]" />
          <h3 className="text-sm font-semibold text-zinc-900">Payout Details</h3>
          <p className="text-xs text-zinc-400 ml-1">— Used to pay your partner program commissions</p>
        </div>

        <form onSubmit={handleSavePayoutDetails} className="space-y-4 max-w-xl">
          {/* Method Toggle */}
          <div className="flex gap-2">
            {[
              { id: "upi", label: "UPI" },
              { id: "bank_transfer", label: "Bank Transfer" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPayoutMethod(m.id)}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  payoutMethod === m.id
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                    : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* UPI Fields */}
          {payoutMethod === "upi" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">UPI ID</label>
              <input
                type="text"
                required
                placeholder="yourname@okaxis"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
              />
            </div>
          )}

          {/* Bank Transfer Fields */}
          {payoutMethod === "bank_transfer" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-700">Account holder name</label>
                <input
                  type="text"
                  required
                  placeholder="Full name as per bank"
                  value={bankHolderName}
                  onChange={(e) => setBankHolderName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">Account number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 012345678901"
                  value={bankAccountNo}
                  onChange={(e) => setBankAccountNo(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">IFSC code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC0001234"
                  value={bankIfsc}
                  onChange={(e) => setBankIfsc(e.target.value.toUpperCase().replace(/\s+/g, ""))}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {payoutError && (
            <p className="text-xs text-rose-500 font-medium">{payoutError}</p>
          )}

          <button
            type="submit"
            disabled={payoutSaving}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {payoutSaved ? <><Check size={14} /> Saved!</> : payoutSaving ? "Saving…" : "Save payout details"}
          </button>
        </form>
      </div>

      {/* Row 3: Team Collaboration — full width */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <Users size={15} className="text-[#6366F1]" />
              <h3 className="text-sm font-semibold text-zinc-900">Team & Collaboration</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Workspace: <span className="text-[#6366F1] font-semibold">{`"${selectedWorkspace?.name || "Personal Workspace"}"`}</span>
            </p>
          </div>
          <form onSubmit={handleInviteSubmit} className="flex gap-2 w-full sm:w-auto max-w-md shrink-0">
            <input
              type="email"
              required
              placeholder="collaborator@email.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 transition-colors focus:bg-white focus:border-[#6366F1] outline-none min-w-[160px]"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-2 text-xs font-medium text-zinc-900 transition-colors focus:bg-white focus:border-[#6366F1] outline-none"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={isInviting}
              className="px-4 py-2 bg-zinc-900 hover:bg-[#6366F1] disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
            >
              {isInviting ? "Inviting…" : "Invite"} <UserPlus size={13} />
            </button>
          </form>
        </div>

        {workspaceMembersLoading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-zinc-400 text-xs">
            <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
            Loading team members…
          </div>
        ) : !workspaceMembers || workspaceMembers.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
            <Users size={28} className="mx-auto text-zinc-300 mb-2" />
            <p className="text-sm font-semibold text-zinc-700">No collaborators yet</p>
            <p className="text-xs text-zinc-400 mt-1">Invite team members to work on this workspace.</p>
          </div>
        ) : (
          <div className="border border-zinc-100 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 text-xs font-medium">
                  <th className="px-4 py-2.5">Collaborator</th>
                  <th className="px-4 py-2.5">Role</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {workspaceMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-50 text-[#6366F1] font-bold text-xs flex items-center justify-center border border-indigo-100 shrink-0">
                          {member.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{member.email}</p>
                          <p className="text-xs text-zinc-400">Collaborator</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={member.role}
                        onChange={(e) => updateMemberRole(selectedWorkspace?.id, member.id, e.target.value)}
                        className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-indigo-400 transition-all"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md border ${
                        member.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === "active" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                        {member.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${member.email} from this workspace?`)) {
                            removeMember(selectedWorkspace?.id, member.id);
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Row 4: Outbound Webhooks — full width */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <Globe size={15} className="text-[#6366F1]" />
              <h3 className="text-sm font-semibold text-zinc-900">Outbound Webhooks</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">Send lead event payloads to Zapier, Make, or your custom URL in real-time.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md border ${
              webhookEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-zinc-50 text-zinc-500 border-zinc-200"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${webhookEnabled ? "bg-emerald-500" : "bg-zinc-400"}`} />
              {webhookEnabled ? "Active" : "Disabled"}
            </span>
            <Toggle checked={webhookEnabled} onChange={(e) => setWebhookEnabled(e.target.checked)} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
          <input
            type="url"
            placeholder="https://hooks.zapier.com/hooks/catch/12345/abcde/"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 transition-colors focus:bg-white focus:border-[#6366F1] outline-none"
          />
          <button
            onClick={handleTestWebhook}
            disabled={isTestingWebhook || !webhookUrl}
            className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 disabled:opacity-50 text-zinc-700 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0"
          >
            {isTestingWebhook ? <><Loader2 size={13} className="animate-spin" /> Testing…</> : <><RefreshCcw size={13} /> Test Connection</>}
          </button>
        </div>

        {testWebhookResult && (
          <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs font-semibold max-w-2xl animate-in slide-in-from-top-1 duration-300 ${
            testWebhookResult === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-800"
              : "bg-rose-50 border-rose-100 text-rose-800"
          }`}>
            {testWebhookResult === "success"
              ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
              : <AlertCircle size={14} className="text-rose-600 shrink-0 mt-0.5" />
            }
            {testWebhookMessage}
          </div>
        )}
      </div>

    </div>
  );
}
