"use client";

import { useDashboard } from "@/context/DashboardContext";
import { createClient } from "@/lib/supabase";
import {
  AlertCircle, Bell, Check, CheckCircle2, Globe, Loader2,
  LogOut, RefreshCcw, UserCheck, UserPlus, Users, Wallet, Zap, Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";
import * as logger from "@/lib/logger";

const NAV_ITEMS = [
  { id: "account", label: "Account", icon: UserCheck },
  { id: "payout", label: "Payout", icon: Wallet },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team", icon: Users },
  { id: "integrations", label: "Integrations", icon: Globe },
];

const Toggle = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer shrink-0">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
    <div className="w-9 h-5 bg-zinc-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6366F1]" />
  </label>
);

export default function SettingsDashboard({ account, currentPlan = "free", realtimeStats, onSubscriptionClick }) {
  const {
    selectedWorkspace, workspaceMembers, workspaceMembersLoading,
    inviteMember, removeMember, updateMemberRole,
    disconnectAccount, updateSelectedAccount
  } = useDashboard();

  const [activeSection, setActiveSection] = useState("account");

  // Quota
  const usedQuota = (realtimeStats?.totalDms || 0) + (realtimeStats?.autoReplies || 0);
  const maxQuota = currentPlan === "viral_scale" ? 50000 : currentPlan === "creator_pro" ? 15000 : 1000;
  const quotaPercent = Math.min((usedQuota / maxQuota) * 100, 100);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  // Account states
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Team
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [isInviting, setIsInviting] = useState(false);

  // Webhook
  const [webhookUrl, setWebhookUrl] = useState(account?.metadata?.webhook_url || "");
  const [webhookEnabled, setWebhookEnabled] = useState(account?.metadata?.webhook_enabled || false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testWebhookResult, setTestWebhookResult] = useState(null);
  const [testWebhookMessage, setTestWebhookMessage] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Payout
  const [payoutMethod, setPayoutMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankHolderName, setBankHolderName] = useState("");
  const [payoutSaving, setPayoutSaving] = useState(false);
  const [payoutSaved, setPayoutSaved] = useState(false);
  const [payoutError, setPayoutError] = useState("");

  // Sync account ref changes
  const [prevAccount, setPrevAccount] = useState(account);
  useEffect(() => {
    if (account !== prevAccount) {
      setPrevAccount(account);
      setWebhookUrl(account?.metadata?.webhook_url || "");
      setWebhookEnabled(account?.metadata?.webhook_enabled || false);
      setTestWebhookResult(null);
      setTestWebhookMessage("");
    }
  }, [account, prevAccount]);

  // Load payout details
  useEffect(() => {
    async function loadPayout() {
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
              const p = JSON.parse(data.payout_address);
              if (p.accountNo) setBankAccountNo(p.accountNo);
              if (p.ifsc) setBankIfsc(p.ifsc);
              if (p.holderName) setBankHolderName(p.holderName);
            } catch { setBankAccountNo(data.payout_address); }
          }
        }
      } catch (e) { logger.error("SettingsDashboard: Failed to load payout details:", e); }
    }
    loadPayout();
  }, []);

  // Handlers
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !selectedWorkspace) return;
    setIsInviting(true);
    try {
      await inviteMember(selectedWorkspace.id, inviteEmail.trim(), inviteRole);
      setInviteEmail(""); setInviteRole("viewer");
    } catch (err) { logger.error("SettingsDashboard: handleInviteSubmit error:", err); }
    finally { setIsInviting(false); }
  };

  const handleSave = async (url, enabled) => {
    setIsSaved(true);
    try {
      await updateSelectedAccount({ metadata: { ...(account?.metadata || {}), webhook_url: url, webhook_enabled: enabled } });
    } catch (e) { logger.error("SettingsDashboard: handleSave error:", e); }
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
    if (!webhookUrl.trim()) { setTestWebhookResult("error"); setTestWebhookMessage("Please enter a webhook URL first."); return; }
    setIsTestingWebhook(true); setTestWebhookResult(null); setTestWebhookMessage("");
    try {
      const res = await fetch("/api/webhooks/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ webhookUrl: webhookUrl.trim() }) });
      const data = await res.json();
      if (res.ok && data.success) { setTestWebhookResult("success"); setTestWebhookMessage("Connection test successful! A test payload was sent."); }
      else { setTestWebhookResult("error"); setTestWebhookMessage(data.error || "Failed to deliver payload. Check your URL."); }
    } catch { setTestWebhookResult("error"); setTestWebhookMessage("Network error. Please try again."); }
    finally { setIsTestingWebhook(false); }
  };

  const handleSavePayout = async (e) => {
    e.preventDefault();
    setPayoutSaving(true); setPayoutError(""); setPayoutSaved(false);
    try {
      const res = await fetch("/api/razorpay/link-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: payoutMethod,
          upiId: upiId.trim(),
          accountNo: bankAccountNo.trim(),
          ifsc: bankIfsc.trim().toUpperCase(),
          holderName: bankHolderName.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to link account");

      setPayoutSaved(true);
      setTimeout(() => setPayoutSaved(false), 3000);
    } catch (err) {
      setPayoutError(err.message || "Failed to save.");
    } finally {
      setPayoutSaving(false);
    }
  };

  useEffect(() => {
    const fn = () => handleSave(webhookUrl, webhookEnabled);
    window.addEventListener("save_settings", fn);
    return () => window.removeEventListener("save_settings", fn);
  }, [account, webhookUrl, webhookEnabled, updateSelectedAccount]);

  // ─── Section renderers ────────────────────────────────────────────────────

  const renderAccount = () => (
    <div className="space-y-4">
      {/* Connected account */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 sm:p-5 shadow-md shadow-zinc-200/5 space-y-2 sm:space-y-3">
        <h4 className="text-sm font-semibold text-zinc-900">Connected Instagram account</h4>
        <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
          <img
            src={account?.profile_pic || account?.profile_picture_url || account?.metadata?.profile_picture_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(account?.page_name || "User")}&background=6366f1&color=fff&size=80`}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover border border-zinc-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-900 truncate">@{account?.ig_username || account?.page_name || "account"}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Instagram Creator Account</p>
          </div>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold shrink-0">Connected</span>
        </div>
        <button
          onClick={async () => {
            if (!account) return;
            if (!confirm(`Disconnect @${account.ig_username || account.page_name}? This will remove all automation data.`)) return;
            setIsDisconnecting(true);
            try {
              const res = await disconnectAccount(account.id);
              if (res?.error) alert("Failed: " + res.error);
              else alert("Account disconnected successfully!");
            } catch { alert("Error disconnecting."); }
            finally { setIsDisconnecting(false); }
          }}
          disabled={isDisconnecting || !account}
          className="w-full py-2 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <LogOut size={12} /> {isDisconnecting ? "Disconnecting…" : "Disconnect account"}
        </button>
      </div>

      {/* API Quota */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-4 sm:p-5 shadow-md shadow-zinc-200/5 space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-zinc-900">API quota usage</h4>
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-bold">
            {currentPlan === "viral_scale" ? "Business Scale" : currentPlan === "creator_pro" ? "Business Pro" : "Free"}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Replies used</span>
            <span className="font-semibold text-zinc-900">{usedQuota.toLocaleString()} / {maxQuota.toLocaleString()}</span>
          </div>
          <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-[#6366F1] to-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${quotaPercent}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">Resets on your next billing cycle.</p>
            {onSubscriptionClick && (
              <button onClick={onSubscriptionClick} className="text-xs text-[#6366F1] font-semibold hover:underline underline-offset-2">Upgrade plan →</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayout = () => (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-4 sm:p-5 shadow-md shadow-zinc-200/5 space-y-3 sm:space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-zinc-900">Payout details</h4>
        <p className="text-xs text-zinc-400 mt-0.5">Your Mini Store sales and Partner Program commissions will be sent to this account.</p>
      </div>

      <form onSubmit={handleSavePayout} className="space-y-4 max-w-md">
        {/* Method toggle */}
        <div className="flex gap-2">
          {[{ id: "upi", label: "UPI" }, { id: "bank_transfer", label: "Bank Transfer" }].map((m) => (
            <button key={m.id} type="button" onClick={() => setPayoutMethod(m.id)}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${payoutMethod === m.id
                  ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                  : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300"
                }`}>
              {m.label}
            </button>
          ))}
        </div>

        {payoutMethod === "upi" && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">UPI ID</label>
            <input type="text" required placeholder="yourname@okaxis" value={upiId} onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors" />
          </div>
        )}

        {payoutMethod === "bank_transfer" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Account holder name</label>
              <input type="text" required placeholder="Full name as per bank" value={bankHolderName} onChange={(e) => setBankHolderName(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">Account number</label>
                <input type="text" required placeholder="012345678901" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">IFSC code</label>
                <input type="text" required placeholder="HDFC0001234" value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value.toUpperCase().replace(/\s+/g, ""))}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:bg-white transition-colors" />
              </div>
            </div>
          </div>
        )}

        {payoutError && <p className="text-xs text-rose-500 font-medium">{payoutError}</p>}

        <button type="submit" disabled={payoutSaving}
          className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-2 disabled:opacity-60">
          {payoutSaved ? <><Check size={14} /> Saved!</> : payoutSaving ? "Saving…" : "Save payout details"}
        </button>
      </form>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-4 sm:p-5 shadow-md shadow-zinc-200/5 space-y-2 sm:space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-zinc-900">Email notifications</h4>
        <p className="text-xs text-zinc-400 mt-0.5">Choose what updates you want to receive by email.</p>
      </div>
      <div className="space-y-2 max-w-md">
        {[
          { label: "Contact Alerts", desc: "Get notified when a new lead submits a form", state: emailAlerts, toggle: () => setEmailAlerts(!emailAlerts) },
          { label: "Weekly Summary", desc: "Growth & reply performance report every Monday", state: weeklyReport, toggle: () => setWeeklyReport(!weeklyReport) },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-100 rounded-xl">
            <div>
              <p className="text-xs font-semibold text-zinc-900">{item.label}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</p>
            </div>
            <Toggle checked={item.state} onChange={item.toggle} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-4 sm:p-5 shadow-md shadow-zinc-200/5 space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <div>
          <h4 className="text-sm font-semibold text-zinc-900">Team & Collaboration</h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Workspace: <span className="text-[#6366F1] font-semibold">{`"${selectedWorkspace?.name || "Personal Workspace"}"`}</span>
          </p>
        </div>
        <form onSubmit={handleInviteSubmit} className="flex gap-2 w-full sm:w-auto max-w-sm shrink-0">
          <input type="email" required placeholder="collaborator@email.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#6366F1] outline-none transition-colors min-w-0" />
          <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-xl px-2 py-2 text-xs font-medium text-zinc-900 focus:bg-white focus:border-[#6366F1] outline-none transition-colors shrink-0">
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" disabled={isInviting}
            className="px-3 py-2 bg-zinc-900 hover:bg-[#6366F1] disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1 shrink-0">
            {isInviting ? "…" : <><UserPlus size={13} /> Invite</>}
          </button>
        </form>
      </div>

      {workspaceMembersLoading ? (
        <div className="py-8 flex items-center justify-center gap-2 text-zinc-400 text-xs">
          <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" /> Loading…
        </div>
      ) : !workspaceMembers || workspaceMembers.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
          <Users size={28} className="mx-auto text-zinc-300 mb-2" />
          <p className="text-sm font-semibold text-zinc-700">No collaborators yet</p>
          <p className="text-xs text-zinc-400 mt-1">Invite team members above to get started.</p>
        </div>
      ) : (
        <div className="border border-zinc-100 rounded-xl overflow-x-auto">
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
                    <select value={member.role} onChange={(e) => updateMemberRole(selectedWorkspace?.id, member.id, e.target.value)}
                      className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-indigo-400 transition-all">
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md border ${member.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${member.status === "active" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { if (confirm(`Remove ${member.email}?`)) removeMember(selectedWorkspace?.id, member.id); }}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all">
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
  );

  const renderIntegrations = () => (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-4 sm:p-5 shadow-md shadow-zinc-200/5 space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div>
          <h4 className="text-sm font-semibold text-zinc-900">Outbound Webhooks</h4>
          <p className="text-xs text-zinc-400 mt-0.5">Send lead event payloads to Zapier, Make, or your custom endpoint in real-time.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md border ${webhookEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-zinc-50 text-zinc-500 border-zinc-200"
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${webhookEnabled ? "bg-emerald-500" : "bg-zinc-400"}`} />
            {webhookEnabled ? "Active" : "Disabled"}
          </span>
          <Toggle checked={webhookEnabled} onChange={(e) => setWebhookEnabled(e.target.checked)} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
        <input type="url" placeholder="https://hooks.zapier.com/hooks/catch/…" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)}
          className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#6366F1] outline-none transition-colors" />
        <button onClick={handleTestWebhook} disabled={isTestingWebhook || !webhookUrl}
          className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 disabled:opacity-50 text-zinc-700 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0">
          {isTestingWebhook ? <><Loader2 size={13} className="animate-spin" /> Testing…</> : <><RefreshCcw size={13} /> Test</>}
        </button>
        <button onClick={() => handleSave(webhookUrl, webhookEnabled)}
          className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0">
          {isSaved ? <><Check size={13} /> Saved</> : "Save"}
        </button>
      </div>

      {testWebhookResult && (
        <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs font-semibold max-w-xl animate-in slide-in-from-top-1 duration-300 ${testWebhookResult === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-rose-50 border-rose-100 text-rose-800"
          }`}>
          {testWebhookResult === "success" ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle size={14} className="text-rose-600 shrink-0 mt-0.5" />}
          {testWebhookMessage}
        </div>
      )}
    </div>
  );

  const sections = {
    account: renderAccount(),
    payout: renderPayout(),
    notifications: renderNotifications(),
    team: renderTeam(),
    integrations: renderIntegrations(),
  };

  return (
    <div className="w-full animate-in fade-in duration-500">

      {/* Premium Upgrade Banner Card (Visible for Free & Pro users) */}
      {currentPlan !== 'viral_scale' && (
        <div className="bg-gradient-to-r from-[#6366F1] to-indigo-700 text-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md relative overflow-hidden animate-in fade-in mb-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start sm:items-center gap-3.5 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold tracking-tight mb-0.5">
                {currentPlan === 'free' ? "Upgrade Automations with Business Pro" : "Upgrade to Business Scale"}
              </h4>
              <p className="text-[11px] text-indigo-100 font-medium leading-normal max-w-xl">
                {currentPlan === 'free' 
                  ? "Get unlimited automated replies, unlock the Mini Digital Store to sell directly inside DMs, and build premium Link-in-Bio landing pages."
                  : "Get up to 50,000 monthly automated replies, advanced CRM tracking, and full agency multi-workspace collaboration features."
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => onSubscriptionClick?.()}
            className="shrink-0 w-full sm:w-auto px-5 py-2 bg-white hover:bg-zinc-50 text-indigo-700 text-[11px] font-bold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Mobile: horizontal scroll tabs */}
      <div className="flex sm:hidden gap-1 overflow-x-auto no-scrollbar pb-3 mb-4 border-b border-zinc-100">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveSection(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${activeSection === id ? "bg-[#6366F1] text-white shadow-sm" : "bg-zinc-100 text-zinc-500 hover:text-zinc-900"
              }`}>
            <Icon size={12} /> {label}
          </button>
        ))}
      </div>

      {/* Desktop: left nav + right content */}
      <div className="hidden sm:flex gap-6 items-start">

        {/* Left Nav */}
        <nav className="w-44 shrink-0 sticky top-0">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = activeSection === id;
              return (
                <li key={id}>
                  <button
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left ${active
                        ? "bg-indigo-50 text-[#6366F1] font-semibold"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 font-medium"
                      }`}
                  >
                    <Icon size={14} className={active ? "text-[#6366F1]" : "text-zinc-400"} />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Subtle divider */}
        <div className="w-px bg-zinc-200/70 self-stretch shrink-0" />

        {/* Right Content */}
        <div className="flex-1 min-w-0">
          {sections[activeSection]}
        </div>
      </div>

      {/* Mobile content */}
      <div className="sm:hidden">
        {sections[activeSection]}
      </div>

    </div>
  );
}
