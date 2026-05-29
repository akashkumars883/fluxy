"use client";

import { CheckCircle,Star } from "lucide-react";

export default function Testimonials() {
  const row1 = [
    {
      name: "Ishaan Mehta",
      handle: "@ishaan_vlogs",
      avatarBg: "bg-indigo-100 text-indigo-600",
      initials: "IM",
      quote: "Automixa completely changed how I run my Reels. Set up a keyword 'GUIDE' on my last reel, got over 1.2k comments, and every single one got a safe DM instantly! Follower-gate got me 350+ new followers too. Simply unreal."
    },
    {
      name: "Riya Sen",
      handle: "@riya_style_co",
      avatarBg: "bg-emerald-100 text-emerald-600",
      initials: "RS",
      quote: "Unbelievable tool! I used to sit for hours copying and pasting links to people's comments. Now, it runs on autopilot. 100% safe, official API, and my engagement rate is up by 180% in just two weeks."
    },
    {
      name: "Kabir Malhotra",
      handle: "@kabir.creates",
      avatarBg: "bg-amber-100 text-amber-600",
      initials: "KM",
      quote: "The setup is what blew me away. Hooked up my Meta profile in under a minute, set an AI response sequence, and saw conversion on my e-book double in the first week. Highly recommended for creators."
    },
    {
      name: "Ananya Gupta",
      handle: "@ananya.social",
      avatarBg: "bg-pink-100 text-pink-600",
      initials: "AG",
      quote: "As a social media agency head, this is a lifesaver. Running client campaigns with custom keyword triggers has increased our average lead capture rate by 4x. Clean dashboard and great support!"
    }
  ];

  const row2 = [
    {
      name: "Vikram Rathore",
      handle: "@vikram_clicks",
      avatarBg: "bg-sky-100 text-sky-600",
      initials: "VR",
      quote: "I was skeptical about shadowbans, but since Automixa uses official Meta Graph APIs, it's 100% compliant. My account health remains perfectly green, and my audience loves the instant delivery of links."
    },
    {
      name: "Priya Sharma",
      handle: "@priya_designs",
      avatarBg: "bg-purple-100 text-purple-600",
      initials: "PS",
      quote: "Follower-Gate is literally a cheat code for organic growth. People actually follow to unlock the Canva templates, and it's all automated. If you're a creator in India, you need this right now!"
    },
    {
      name: "Rohan Das",
      handle: "@rohan_tech_tips",
      avatarBg: "bg-teal-100 text-teal-600",
      initials: "RD",
      quote: "Highly premium glass interface! The custom quotas and ease of keyword matching makes other automation platforms look ancient. Saves me at least 10 hours a week answering comments."
    },
    {
      name: "Meera Iyer",
      handle: "@meera_wellness",
      avatarBg: "bg-rose-100 text-rose-600",
      initials: "MI",
      quote: "The pricing in INR is extremely fair. Compared to international tools charging $100s, Automixa is tailor-made for Indian creators and works flawlessly. Simple, clean, and highly effective."
    }
  ];

  return (
    <section id="testimonials" className="py-10 md:py-12 bg-transparent relative overflow-hidden">
      {/* Custom Styles for Infinite Marquee scrolling (Self-contained & Hover Pause enabled) */}
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marqueeLeft 60s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marqueeRight 60s linear infinite;
        }
        .animate-marquee-left:hover, .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Background Ambient Lights */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[130px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative z-10 mb-10 sm:mb-14">
        {/* Header Title Block (Symmetrical with HowItWorks, Features and Pricing) */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] mb-2 block">
              Testimonials
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold text-foreground tracking-normal leading-[1.1]">
              Loved by modern <span className="text-sage font-normal">creators.</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-base sm:text-lg max-w-md font-normal leading-relaxed">
            See how creators and brands are scaling their engagement and automating workflows with Automixa.
          </p>
        </div>
      </div>

      {/* Tickers Wrapper with Left-Right Blur Overlays */}
      <div className="flex flex-col gap-6 relative w-full overflow-hidden py-2">
        {/* Left Blur Fade Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 lg:w-48 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
        
        {/* Right Blur Fade Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 lg:w-48 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

        {/* Row 1: Left Moving Ticker */}
        <div className="w-full overflow-hidden flex py-2 mask-gradient-x">
          <div className="animate-marquee-left gap-6">
            {/* Duplicated thrice to guarantee seamless overflow coverage regardless of screen size */}
            {[...row1, ...row1, ...row1].map((item, index) => (
              <div 
                key={index}
                className="w-[300px] sm:w-[360px] shrink-0 p-6 sm:p-8 rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/60 hover:border-indigo-500/20 hover:bg-white/60 transition-all duration-300 flex flex-col justify-between whitespace-normal select-none shadow-sm hover:shadow-md"
              >
                {/* Rating & Platform */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} size={14} fill="currentColor" stroke="none" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Instagram
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Profile Header Row */}
                <div className="flex items-center gap-3 border-t border-zinc-100/60 pt-4">
                  <div className={`w-10 h-10 rounded-full ${item.avatarBg} flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-zinc-800 truncate">{item.name}</span>
                      <CheckCircle size={12} className="text-indigo-500 fill-indigo-50 shrink-0" />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium block">{item.handle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Right Moving Ticker */}
        <div className="w-full overflow-hidden flex py-2 mask-gradient-x">
          <div className="animate-marquee-right gap-6">
            {/* Duplicated thrice to guarantee seamless overflow coverage regardless of screen size */}
            {[...row2, ...row2, ...row2].map((item, index) => (
              <div 
                key={index}
                className="w-[300px] sm:w-[360px] shrink-0 p-6 sm:p-8 rounded-[28px] bg-white/40 backdrop-blur-xl border border-white/60 hover:border-indigo-500/20 hover:bg-white/60 transition-all duration-300 flex flex-col justify-between whitespace-normal select-none shadow-sm hover:shadow-md"
              >
                {/* Rating & Platform */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} size={14} fill="currentColor" stroke="none" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Instagram
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Profile Header Row */}
                <div className="flex items-center gap-3 border-t border-zinc-100/60 pt-4">
                  <div className={`w-10 h-10 rounded-full ${item.avatarBg} flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-zinc-800 truncate">{item.name}</span>
                      <CheckCircle size={12} className="text-indigo-500 fill-indigo-50 shrink-0" />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium block">{item.handle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
