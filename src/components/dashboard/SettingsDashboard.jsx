"use client";

import { useState, useEffect } from "react";
import { Settings, Shield, Bell, Sparkles, CheckCircle2, UserCheck, Zap, Mail, LogOut, Users, UserPlus, Globe, RefreshCcw, AlertCircle, Loader2 } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

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
  const maxQuota = currentPlan === "viral_scale" ? 100000 : currentPlan === "creator_pro" ? 25000 : 1000;
  const quotaPercent = Math.min((usedQuota / maxQuota) * 100, 100);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [isInviting, setIsInviting] = useState(false);

  // Webhook States
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testWebhookResult, setTestWebhookResult] = useState(null);
  const [testWebhookMessage, setTestWebhookMessage] = useState("");

  // Sync webhook settings when account changes
  useEffect(() => {
    if (account) {
      setWebhookUrl(account.metadata?.webhook_url || "");
      setWebhookEnabled(account.metadata?.webhook_enabled || false);
      setTestWebhookResult(null);
      setTestWebhookMessage("");
    }
  }, [account]);

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
      console.error("Failed to save webhook settings to DB:", e);
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

  useEffect(() => {
    const handleGlobalSave = () => {
      handleSave(webhookUrl, webhookEnabled);
    };
    window.addEventListener("save_settings", handleGlobalSave);
    return () => {
      window.removeEventListener("save_settings", handleGlobalSave);
    };
  }, [account, webhookUrl, webhookEnabled, updateSelectedAccount]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full max-w-[1400px] mx-auto pb-12">

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* BENTO CARD 1: Connected Instagram Account */}
        <div className="md:col-span-1 bg-white/40 backdrop-blur-xl border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-zinc-100/30 flex flex-col justify-between hover:border-[#6366F1]/20 transition-all duration-300 relative overflow-hidden group min-h-[220px]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -mr-24 -mt-24 pointer-events-none group-hover:scale-110 transition-all duration-500" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="text-emerald-500" size={16} />
                <h3 className="text-base font-semibold text-zinc-900 tracking-tight">Instagram Account</h3>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">Connected</span>
            </div>
            
            <div className="flex items-center gap-4 bg-white/60 p-4 rounded-xl border border-zinc-200 shadow-xs">
              <img 
                src={account?.profile_pic || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&q=80"} 
                alt="Instagram Profile" 
                className="w-10 h-10 rounded-full object-cover border border-zinc-200 shadow-sm shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-zinc-900 truncate">
                  @{account?.ig_username || account?.page_name || "connected_account"}
                </h4>
                <span className="text-xs text-zinc-400 font-semibold block mt-0.5">IG Creator Account</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              onClick={async () => {
                if (!account) return;
                const confirmDisconnect = confirm(`Are you sure you want to disconnect @${account.ig_username || account.page_name || 'this account'}? This will delete all its automation settings and history.`);
                if (!confirmDisconnect) return;
                
                setIsDisconnecting(true);
                try {
                  const res = await disconnectAccount(account.id);
                  if (res && res.error) {
                    alert("Failed to disconnect: " + res.error);
                  } else {
                    alert("Account successfully disconnected!");
                  }
                } catch (e) {
                  console.error(e);
                  alert("An error occurred while disconnecting the account.");
                } finally {
                  setIsDisconnecting(false);
                }
              }}
              disabled={isDisconnecting || !account}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <LogOut size={12} /> <span>{isDisconnecting ? "Disconnecting..." : "Disconnect Account"}</span>
            </button>
          </div>
        </div>

        {/* BENTO CARD 2: API Usage Quota */}
        <div className="md:col-span-1 bg-white/40 backdrop-blur-xl border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-zinc-100/30 flex flex-col justify-between hover:border-[#6366F1]/20 transition-all duration-300 relative overflow-hidden group min-h-[220px]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#6366F1]/5 rounded-full -mr-24 -mt-24 pointer-events-none group-hover:scale-110 transition-all duration-500" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="text-[#6366F1]" size={16} />
                <h3 className="text-base font-semibold text-zinc-900 tracking-tight">API Quota Usage</h3>
              </div>
              <span className="px-2.5 py-1 bg-[#6366F1]/10 text-[#6366F1] rounded-full text-xs font-bold uppercase tracking-wider">
                {currentPlan === "viral_scale" ? "Platinum" : currentPlan === "creator_pro" ? "Pro" : "Free"} Plan
              </span>
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider block">Replies Used</span>
                <span className="text-sm font-bold text-zinc-800 tracking-tight">
                  {usedQuota.toLocaleString()} / {maxQuota.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-zinc-200/60 rounded-full h-2.5 overflow-hidden border border-zinc-100 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-[#6366F1] to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
              <p className="text-xs text-zinc-400 font-semibold mt-1">
                Quota resets on your next billing cycle.
              </p>
            </div>
          </div>
        </div>

        {/* BENTO CARD 3: Email Notifications */}
        <div className="md:col-span-1 bg-white/40 backdrop-blur-xl border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-zinc-100/30 flex flex-col justify-between hover:border-[#6366F1]/20 transition-all duration-300 relative overflow-hidden group min-h-[220px]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 pointer-events-none group-hover:scale-110 transition-all duration-500" />
          
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="text-[#6366F1]" size={16} />
                <h3 className="text-base font-semibold text-zinc-900 tracking-tight">Notifications</h3>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-white border border-zinc-200 rounded-xl flex items-center justify-between shadow-xs">
                <div className="min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-zinc-900 tracking-tight">Contact Alerts</h4>
                  <p className="text-xs text-zinc-400 font-semibold truncate block mt-0.5">Email on submission</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer scale-75 origin-right shrink-0">
                  <input type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6366F1]"></div>
                </label>
              </div>

              <div className="p-3 bg-white border border-zinc-200 rounded-xl flex items-center justify-between shadow-xs">
                <div className="min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-zinc-900 tracking-tight">Weekly Summary</h4>
                  <p className="text-xs text-zinc-400 font-semibold truncate block mt-0.5">Growth & reply stats mail</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer scale-75 origin-right shrink-0">
                  <input type="checkbox" checked={weeklyReport} onChange={() => setWeeklyReport(!weeklyReport)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6366F1]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* BENTO CARD 4: Team Collaboration (col-span-3) */}
        <div className="md:col-span-3 bg-white/40 backdrop-blur-xl border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-zinc-100/40 space-y-6 hover:border-[#6366F1]/20 transition-all duration-300 relative overflow-hidden group">
          <div className="border-b border-zinc-200/50 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="text-[#6366F1]" size={16} />
                <h3 className="text-base font-semibold text-zinc-900 tracking-tight">Team & Collaboration</h3>
              </div>
              <p className="text-xs font-semibold text-zinc-400 mt-1">
                Active Workspace: <span className="text-[#6366F1] font-bold">{`"${selectedWorkspace?.name || 'Personal Workspace'}"`}</span>
              </p>
            </div>
            
            {/* Invite Inline Form */}
            <form onSubmit={handleInviteSubmit} className="flex gap-2 w-full md:w-auto max-w-md shrink-0">
              <input
                type="email"
                required
                placeholder="collaborator@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#6366F1] transition-all min-w-[180px]"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-700 focus:outline-none focus:border-[#6366F1] transition-all cursor-pointer"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                disabled={isInviting}
                className="px-5 py-2.5 bg-zinc-950 hover:bg-[#6366F1] disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shrink-0 flex items-center gap-1.5 hover:scale-105 h-[38px]"
              >
                {isInviting ? "Inviting..." : "Invite"}
                <UserPlus size={14} />
              </button>
            </form>
          </div>

          {/* Collaborator Grid / Table */}
          <div className="relative z-10">
            {workspaceMembersLoading ? (
              <div className="py-12 flex items-center justify-center gap-2 text-zinc-400 text-xs italic">
                <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                <span>Loading team members...</span>
              </div>
            ) : !workspaceMembers || workspaceMembers.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-zinc-200 rounded-xl bg-white/50">
                <Users size={32} className="mx-auto text-zinc-300 mb-2" />
                <h4 className="text-sm font-bold text-zinc-800">No collaborators yet</h4>
                <p className="text-xs text-zinc-400 mt-1">Invite team members to work together on this workspace.</p>
              </div>
            ) : (
              <div className="overflow-hidden border border-zinc-200/80 rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/50 border-b border-zinc-200/80 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        <th className="py-4 px-6">Collaborator</th>
                        <th className="py-4 px-6">Role</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {workspaceMembers.map((member) => (
                        <tr key={member.id} className="group hover:bg-zinc-50/30 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#6366F1]/10 text-[#6366F1] font-bold text-xs flex items-center justify-center border border-[#6366F1]/15">
                                {member.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-zinc-800">{member.email}</p>
                                <p className="text-xs text-zinc-400 font-semibold mt-0.5">Collaborator</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <select
                              value={member.role}
                              onChange={(e) => updateMemberRole(selectedWorkspace?.id, member.id, e.target.value)}
                              className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-zinc-700 focus:outline-none cursor-pointer focus:border-[#6366F1] transition-all"
                            >
                              <option value="viewer">Viewer</option>
                              <option value="editor">Editor</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                              member.status === "active" 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${member.status === "active" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                              {member.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                  if (confirm(`Remove ${member.email} from this workspace?`)) {
                                    removeMember(selectedWorkspace?.id, member.id);
                                  }
                              }}
                              className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all"
                            >
                              Revoke Access
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BENTO CARD 5: Outbound Webhooks Integration */}
        <div className="md:col-span-3 bg-white/40 backdrop-blur-xl border border-zinc-200/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-zinc-100/40 space-y-6 hover:border-[#6366F1]/20 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 pointer-events-none group-hover:scale-110 transition-all duration-500" />
          
          <div className="border-b border-zinc-200/50 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Globe className="text-[#6366F1]" size={16} />
                <h3 className="text-base font-semibold text-zinc-900 tracking-tight">Outbound Webhooks</h3>
              </div>
              <p className="text-xs font-semibold text-zinc-400 mt-1">
                Send lead event payloads to Zapier, Make, or your custom URL in real-time.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                webhookEnabled 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                  : "bg-zinc-50 text-zinc-500 border-zinc-200"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${webhookEnabled ? "bg-emerald-500" : "bg-zinc-400"}`} />
                {webhookEnabled ? "Active" : "Disabled"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer scale-75 origin-right shrink-0">
                <input 
                  type="checkbox" 
                  checked={webhookEnabled} 
                  onChange={(e) => setWebhookEnabled(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6366F1]"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="url"
                placeholder="https://hooks.zapier.com/hooks/catch/12345/abcde/"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#6366F1] transition-all min-w-[280px]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleTestWebhook}
                  disabled={isTestingWebhook || !webhookUrl}
                  className="px-5 py-2.5 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 disabled:opacity-50 text-zinc-700 rounded-xl text-sm font-semibold transition-all shrink-0 flex items-center gap-1.5"
                >
                  {isTestingWebhook ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCcw size={14} />
                      <span>Test Connection</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {testWebhookResult && (
              <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 animate-in slide-in-from-top-1 duration-300 text-xs font-semibold ${
                testWebhookResult === "success" 
                  ? "bg-emerald-50/50 border-emerald-100 text-emerald-800" 
                  : "bg-rose-50/50 border-rose-100 text-rose-800"
              }`}>
                {testWebhookResult === "success" ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{testWebhookMessage}</span>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
