"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const postsColumn1 = [
  {
    likes: "2,491",
    caption: "3 Secrets to lose belly fat fast (No cardio) 🤫",
    gradient: "from-amber-600 via-rose-600 to-indigo-900",
  },
  {
    likes: "1,830",
    caption: "How I got 10k followers in 14 days using reels",
    gradient: "from-indigo-600 via-purple-600 to-pink-600",
  },
  {
    likes: "942",
    caption: "Top 5 VS Code Extensions for Web Devs in 2026",
    gradient: "from-teal-600 via-cyan-600 to-blue-700",
  },
  {
    likes: "3,115",
    caption: "Eggless Chocolate Cake Recipe under 10 minutes 🍰",
    gradient: "from-orange-500 via-red-500 to-pink-600",
  }
];

const postsColumn2 = [
  {
    likes: "4,190",
    caption: "5 AI tools that will save you 20+ hours every week",
    gradient: "from-violet-600 via-purple-700 to-indigo-900",
  },
  {
    likes: "892",
    caption: "Small room makeover ideas under ₹5,000",
    gradient: "from-yellow-600 via-orange-500 to-red-700",
  },
  {
    likes: "5,302",
    caption: "My personal strategy for mutual funds in 2026",
    gradient: "from-emerald-500 via-teal-600 to-blue-800",
  },
  {
    likes: "1,520",
    caption: "Unexplored hill stations near Delhi (Full Itinerary)",
    gradient: "from-pink-500 via-rose-500 to-amber-500",
  }
];

const postsColumn3 = [
  {
    likes: "8,340",
    caption: "Stop saying 'Very Nice' - Use these 10 words instead",
    gradient: "from-blue-600 via-indigo-600 to-purple-800",
  },
  {
    likes: "2,204",
    caption: "Top sneaker releases of this month & where to buy",
    gradient: "from-gray-900 via-zinc-800 to-slate-900",
  },
  {
    likes: "1,675",
    caption: "My daily glowing makeup routine in 5 steps 💄",
    gradient: "from-pink-400 via-rose-400 to-amber-300",
  },
  {
    likes: "6,890",
    caption: "This one Excel shortcut will save you hours of work",
    gradient: "from-green-600 via-emerald-600 to-teal-800",
  }
];

function InstagramPostCard({ post }) {
  return (
    <div className="w-64 md:w-72 h-[400px] md:h-[450px] shrink-0 rounded-[32px] overflow-hidden relative flex flex-col justify-between p-6 text-white shadow-xl select-none group">
      {/* Background Gradient representing the media thumbnail */}
      <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-80 group-hover:opacity-95 transition-opacity duration-300`} />
      
      {/* Reels label */}
      <div className="relative z-10 flex justify-between items-center w-full">
        <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[9px] font-black tracking-widest uppercase">REEL</span>
        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6.5px] border-l-white ml-0.5" />
        </div>
      </div>

      {/* Caption Content */}
      <div className="relative z-10 my-auto text-center px-2">
        <p className="text-base sm:text-lg font-black tracking-tight leading-snug drop-shadow-md">
          {post.caption}
        </p>
      </div>

      {/* Engagement Metric */}
      <div className="relative z-10 flex items-center justify-between text-xs font-bold text-white/90">
        <div className="flex items-center gap-1.5">
          <Heart size={12} className="fill-white" />
          <span>{post.likes}</span>
        </div>
        <span className="px-2.5 py-1 bg-emerald-500/90 text-white rounded-lg text-[8px] font-black tracking-wider uppercase">
          Shield Active
        </span>
      </div>
    </div>
  );
}

export default function InstagramMarquee() {
  const allPosts = [...postsColumn1, ...postsColumn2, ...postsColumn3];
  const duplicatedPosts = [...allPosts, ...allPosts];

  return (
    <section className="py-12 bg-transparent overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-10">
        
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.3em] mb-4 block">
            Social Proof
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold text-zinc-950 tracking-tight mb-4">
            See automixa in action.
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm max-w-lg leading-relaxed font-normal">
            Real Instagram reels automated and secured 24/7 with zero account warnings.
          </p>
        </div>

        {/* Horizontal Marquee Container */}
        <div className="relative w-full overflow-hidden py-2">
          {/* Smooth Fade gradients at left and right edges */}
          <div className="absolute left-0 inset-y-0 w-20 bg-gradient-to-r from-[#FBFBFD] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-20 bg-gradient-to-l from-[#FBFBFD] to-transparent z-20 pointer-events-none" />

          {/* Scrolling Row */}
          <div className="flex w-full">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                ease: "linear",
                duration: 70,
                repeat: Infinity
              }}
              className="flex gap-5 pr-5 shrink-0"
            >
              {duplicatedPosts.map((post, idx) => (
                <InstagramPostCard key={idx} post={post} />
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
