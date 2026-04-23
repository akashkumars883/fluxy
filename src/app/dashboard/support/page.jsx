"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  LifeBuoy
} from "lucide-react";

export default function SupportPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock Tickets
  const [tickets] = useState([
    { 
      id: "TKT-8902", 
      subject: "Automation not triggering on Reels", 
      status: "open", 
      priority: "high", 
      created_at: "2 hours ago",
      description: "My 'price' keyword automation is working on normal posts but not on my latest Reel."
    },
    { 
      id: "TKT-8841", 
      subject: "Query about Follow-Gate logic", 
      status: "resolved", 
      priority: "medium", 
      created_at: "1 day ago",
      description: "Can I customize the follow-gate title for each automation?"
    },
    { 
      id: "TKT-8712", 
      subject: "How to connect multiple accounts?", 
      status: "pending", 
      priority: "low", 
      created_at: "3 days ago",
      description: "I have 3 business accounts but only 1 is showing in my dashboard."
    }
  ]);

  const stats = [
    { label: "Active Tickets", value: 1, icon: MessageCircle, color: "text-indigo-500" },
    { label: "Resolved", value: 42, icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Support Hours", value: "24/7", icon: Clock, color: "text-amber-500" }
  ];

  const statusStyles = {
    open: "bg-indigo-50 text-indigo-600 border-indigo-100",
    resolved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background p-6 md:p-12 lg:p-16"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-zinc-muted hover:text-foreground transition-all mb-4 text-sm font-semibold"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-4">
              Support Center <LifeBuoy className="text-indigo-500" />
            </h1>
            <p className="text-zinc-muted text-lg mt-2">Need help? Browse tickets or start a new conversation with us.</p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-bold shadow-xl shadow-foreground/10 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={20} /> Create New Ticket
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="bg-white border border-border p-6 rounded-[32px] shadow-sm flex items-center gap-5">
              <div className={`p-4 bg-zinc-50 rounded-2xl ${s.color}`}>
                <s.icon size={24} />
              </div>
              <div>
                <p className="text-zinc-muted text-xs font-bold uppercase tracking-wider">{s.label}</p>
                <h3 className="text-2xl font-bold text-foreground">{s.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Tickets Section */}
        <div className="bg-white border border-border rounded-[40px] shadow-sm overflow-hidden">
          
          {/* Filters & Search */}
          <div className="p-8 border-b border-border flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 bg-zinc-50 p-1.5 rounded-2xl border border-border/50">
              {['all', 'open', 'pending', 'resolved'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    activeFilter === tab 
                      ? "bg-white text-foreground shadow-sm border border-border/50" 
                      : "text-zinc-muted hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search tickets..." 
                className="w-full pl-12 pr-6 py-3.5 bg-zinc-50 border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-foreground/5 transition-all"
              />
            </div>
          </div>

          {/* Ticket List */}
          <div className="divide-y divide-border">
            {tickets.map((t, i) => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 hover:bg-zinc-50 transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-5">
                  <div className={`mt-1 p-2 rounded-lg border ${statusStyles[t.status]}`}>
                    {t.status === 'resolved' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black text-zinc-muted uppercase tracking-widest">{t.id}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        t.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {t.priority} priority
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-foreground group-hover:text-indigo-600 transition-colors">{t.subject}</h4>
                    <p className="text-zinc-muted text-sm mt-1 line-clamp-1">{t.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between">
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground capitalize">{t.status}</p>
                    <p className="text-xs text-zinc-muted">{t.created_at}</p>
                  </div>
                  <ChevronRight className="text-zinc-300 group-hover:text-foreground transition-all" size={20} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State Footer */}
          <div className="p-8 bg-zinc-50/50 text-center border-t border-border">
            <p className="text-zinc-muted text-xs font-medium">
              Don't see what you're looking for? <span className="text-foreground underline cursor-pointer">Visit Documentation</span>
            </p>
          </div>
        </div>

      </div>

      {/* NEW TICKET MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white border border-border p-10 rounded-[48px] shadow-2xl z-[70]"
            >
              <h2 className="text-3xl font-bold text-foreground mb-2">How can we help?</h2>
              <p className="text-zinc-muted mb-8">Our team usually responds within 2-4 hours.</p>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 block">Subject</label>
                  <input type="text" placeholder="Briefly describe the issue" className="w-full px-6 py-4 bg-zinc-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground/5" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 block">Description</label>
                  <textarea rows={4} placeholder="Tell us exactly what happened..." className="w-full px-6 py-4 bg-zinc-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground/5" />
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <button type="submit" className="flex-1 py-4 bg-foreground text-background rounded-full font-bold shadow-lg shadow-foreground/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Submit Request
                  </button>
                  <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-zinc-muted font-bold hover:text-foreground">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
