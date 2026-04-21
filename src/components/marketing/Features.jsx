"use client";

import { Zap, MessageSquare, Target } from "lucide-react";

export default function Features() {
  const featureList = [
    {
      icon: <Zap className="text-amber-500" />,
      title: "Instant DM Replies",
      desc: "Reply to every incoming DM instantly based on keywords, ensuring no lead is ever left hanging."
    },
    {
      icon: <MessageSquare className="text-indigo-500" />,
      title: "Comment Automation",
      desc: "Automate public replies and private DMs to users who comment specific keywords on your posts."
    },
    {
      icon: <Target className="text-emerald-500" />,
      title: "Targeted Campaigns",
      desc: "Set up rules that only trigger on specific reels or posts, giving you granular control over your strategy."
    }
  ];

  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 tracking-normal">Built for the Creator Economy</h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-normal tracking-normal">Powerful features designed to convert followers into fans without lifting a finger.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureList.map((f, i) => (
            <div key={i} className="p-10 bg-white border border-border rounded-[40px] hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4 tracking-normal">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-normal tracking-normal">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
