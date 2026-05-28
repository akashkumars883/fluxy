import React from 'react';
import { Link2 } from 'lucide-react';

export default function SmartBio({ accountId }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-[24px] border border-zinc-200/80 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 border border-indigo-100 shadow-sm">
          <Link2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-zinc-950 mb-3 tracking-tight">Smart Bio Builder</h2>
        <p className="text-sm text-zinc-500 mb-8 leading-relaxed font-medium">
          Create a beautiful, highly-converting link-in-bio page integrated directly with your automations. Coming very soon!
        </p>
        <button className="px-6 py-3 bg-[#6366F1] text-white font-bold text-sm rounded-xl hover:bg-[#4f46e5] transition-all shadow-[0_8px_30px_-8px_rgba(99,102,241,0.5)] hover:scale-[1.02]">
          Notify Me When Live
        </button>
      </div>
    </div>
  );
}
