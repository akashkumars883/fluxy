"use client";

import { Settings, Shield, Power, Trash2, AlertTriangle, ShieldCheck, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GeneralSettings({ automation, onUpdate, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Advanced Settings</h1>
        <p className="text-zinc-muted text-sm font-medium mt-1">Manage account connectivity and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Connection Status */}
        <div className="bg-white border border-border rounded-[32px] p-8 shadow-sm space-y-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-lg text-foreground">Automation Status</h3>
           </div>

           <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-2xl border border-border/40">
              <div className="space-y-1">
                <span className="text-sm font-bold text-foreground">Global Activation</span>
                <p className="text-[10px] text-zinc-muted font-bold">Turn off all triggers at once</p>
              </div>
              <button 
                onClick={() => onUpdate({ is_active: !automation?.is_active })}
                className={`w-14 h-7 rounded-full transition-all flex items-center px-1.5 ${automation?.is_active ? 'bg-emerald-500 justify-end' : 'bg-zinc-300 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
           </div>
        </div>

        {/* Security / Handover */}
        <div className="bg-white border border-border rounded-[32px] p-8 shadow-sm space-y-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Shield size={20} />
              </div>
              <h3 className="font-bold text-lg text-foreground">General Info</h3>
           </div>
           
           <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-muted font-bold">Instagram ID</span>
                <span className="text-foreground font-black">{automation?.page_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-muted font-bold">Connected On</span>
                <span className="text-foreground font-black">{new Date(automation?.created_at).toLocaleDateString()}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/30 border border-red-100 rounded-[32px] p-8 mt-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-red-800">Danger Zone</h3>
            <p className="text-[10px] text-red-700/60 font-bold">Irreversible actions for this account</p>
          </div>
        </div>

        {!confirmDelete ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-white border border-red-100 rounded-2xl">
            <div className="space-y-1">
              <span className="text-sm font-bold text-foreground">Disconnect Account</span>
              <p className="text-[11px] text-zinc-muted font-medium">This will stop all automations and delete your rules.</p>
            </div>
            <button 
              onClick={() => setConfirmDelete(true)}
              className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/10"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white border-2 border-red-200 rounded-2xl animate-in zoom-in-95">
             <h4 className="text-xl font-black text-red-800 mb-2">Are you absolutely sure?</h4>
             <p className="text-sm text-red-700/60 mb-8 font-medium">All keywords, responses, and metrics will be permanently deleted.</p>
             <div className="flex gap-4 w-full justify-center">
                <button 
                  onClick={() => setConfirmDelete(false)}
                  className="px-8 py-3 bg-zinc-100 text-zinc-600 rounded-xl font-bold text-sm hover:bg-zinc-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => onDelete(automation.id)}
                  className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 shadow-xl shadow-red-600/20"
                >
                  Yes, Delete everything
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
