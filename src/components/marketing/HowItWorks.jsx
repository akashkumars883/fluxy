"use client";

import { UserPlus, Settings2, PlayCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <UserPlus className="text-indigo-500" />,
      title: "Connect Instagram",
      desc: "Connect your professional account securely via Meta's official OAuth flow. It takes less than 30 seconds."
    },
    {
      number: "02",
      icon: <Settings2 className="text-sage" />,
      title: "Set Your Rules",
      desc: "Define keywords or specific posts you want to automate. Configure AI personality and response sequences."
    },
    {
      number: "03",
      icon: <PlayCircle className="text-emerald" />,
      title: "Go Live & Grow",
      desc: "Watch as Automixa handles every comment and DM instantly. Scale your engagement while you sleep."
    }
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
           <div className="max-w-2xl">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em] mb-4 block">Process Flow</span>
              <h2 className="text-4xl md:text-6xl font-semibold text-foreground tracking-normal leading-[1.1]">
                Simple setup. <br />
                <span className="text-zinc-400">Scalable results.</span>
              </h2>
           </div>
           <p className="text-zinc-500 text-lg max-w-sm font-normal tracking-normal pb-2">
              We&apos;ve simplified the complex world of automation into three effortless steps.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((s, i) => (
            <div key={i} className="relative group">
              <div className="flex flex-col gap-8">
                 <div className="flex items-center justify-between">
                    <div className="w-16 h-16 bg-background/80 border border-border rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-sm backdrop-blur-sm">
                       {s.icon}
                    </div>
                    <span className="text-5xl font-black text-foreground/5 tracking-tighter group-hover:text-indigo-500/10 transition-colors uppercase select-none">
                       {s.number}
                    </span>
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 tracking-normal">{s.title}</h3>
                    <p className="text-zinc-500 text-base leading-relaxed font-normal tracking-normal">{s.desc}</p>
                 </div>
              </div>
              
              {i < 2 && (
                <div className="hidden lg:block absolute top-8 -right-6 w-12 h-[1px] bg-border/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
