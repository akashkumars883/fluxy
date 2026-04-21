import { Brain, Sparkles } from "lucide-react";

export default function AiSettingsCard({ automation, onUpdate }) {
  return (
    <section className="bg-white border border-border rounded-[28px] p-6 shadow-sm group">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-foreground text-background rounded-xl flex items-center justify-center shadow-lg shadow-foreground/5">
          <Brain size={20} />
        </div>
        <div>
          <h2 className="font-bold text-lg text-foreground">AI Configuration</h2>
          <p className="text-[11px] text-zinc-muted font-semibold mt-0.5">automixa</p>
        </div>
      </div>
      
      <div className="space-y-5">
         {/* Toggle Container */}
         <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl border border-border/40">
            <div className="space-y-0.5">
              <span className="font-bold text-sm block text-foreground">Smart Reply Mode</span>
              <span className="text-[11px] text-zinc-muted font-bold tracking-tight">AI generated responses</span>
            </div>
            <button 
              onClick={() => onUpdate({ ai_enabled: !automation?.ai_enabled })}
              className={`w-12 h-6 rounded-full transition-all flex items-center px-1.5 ${automation?.ai_enabled ? 'bg-foreground justify-end' : 'bg-zinc-muted/20 justify-start'}`}
            >
              <div className="w-3.5 h-3.5 bg-background rounded-full shadow-sm"></div>
            </button>
         </div>
         
         <div className="space-y-2 px-1">
            <label className="text-[11px] font-bold text-zinc-muted">Brand Identity</label>
            <input 
              type="text" 
              value={automation?.brand_name || ""}
              onChange={(e) => onUpdate({ brand_name: e.target.value }, false)}
              onBlur={(e) => onUpdate({ brand_name: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:bg-background focus:border-foreground outline-none transition-all font-semibold text-sm text-foreground shadow-sm"
              placeholder="e.g. Automixa Store"
            />
         </div>
      </div>
    </section>
  );
}
