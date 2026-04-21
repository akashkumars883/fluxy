import { ChevronDown, Camera } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountSwitcher({ currentAccount, allAccounts }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();


  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-100 rounded-2xl transition-all border border-transparent hover:border-zinc-200"
      >
        <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-500">
          <Camera size={18} />
        </div>
        <span className="font-bold text-sm">{currentAccount?.page_name}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-zinc-200 rounded-2xl shadow-xl z-[60] overflow-hidden p-2 animate-in fade-in slide-in-from-top-1">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-2">Select Account</div>
          {allAccounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => {
                router.push(`/dashboard/automation/${acc.id}`);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left ${acc.id === currentAccount.id ? 'bg-zinc-50 text-black' : 'hover:bg-zinc-50 text-zinc-500'}`}
            >
              <div className="w-6 h-6 bg-zinc-100 rounded-md flex items-center justify-center">
                <Camera size={14} />
              </div>
              <span className="text-sm font-medium">{acc.page_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
