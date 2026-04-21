import { CheckCircle2, ArrowUpRight, Camera, UserCircle, Building2 } from "lucide-react";

export default function AccountCard({ account }) {
  const isContentCreator = account.persona === 'content_creator';

  return (
    <a 
      href={`/dashboard/automation/${account.id}`}
      className="bg-background border border-border rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full relative overflow-hidden"
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isContentCreator ? 'bg-sage/20' : 'bg-foreground/5'}`} />

      <div className="flex items-start justify-between mb-10 relative z-10">
        <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center border border-border group-hover:scale-110 transition-transform duration-300 shadow-sm ${isContentCreator ? 'bg-sage text-foreground' : 'bg-background text-foreground'}`}>
           <Camera size={30} />
        </div>
        <div className="p-2.5 bg-background rounded-full text-zinc-muted group-hover:bg-foreground group-hover:text-background transition-all duration-300 shadow-sm">
           <ArrowUpRight size={18} />
        </div>
      </div>

      <div className="mt-auto relative z-10">
        <div className="flex items-center gap-2 mb-3">
           <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1.5 border ${isContentCreator ? 'bg-sage/10 text-foreground border-sage/20' : 'bg-foreground/5 text-foreground border-border'}`}>
              {isContentCreator ? <UserCircle size={10} /> : <Building2 size={10} />}
              {isContentCreator ? 'Content Creator' : 'Business Owner'}
           </span>
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-4 group-hover:opacity-80 transition-opacity duration-300">
          {account.page_name || 'Business Account'}
        </h3>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-500/20">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Active
          </div>
        </div>
      </div>
    </a>
  );
}
