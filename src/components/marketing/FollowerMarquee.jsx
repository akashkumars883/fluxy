"use client";

import { motion } from "framer-motion";

const DUMMY_FOLLOWERS = [
  { id: 1, username: "@rahul_creates", image: "https://randomuser.me/api/portraits/men/43.jpg" },
  { id: 2, username: "@priya.marketing", image: "https://randomuser.me/api/portraits/women/32.jpg" },
  { id: 3, username: "@theindiancreator", image: "https://randomuser.me/api/portraits/men/68.jpg" },
  { id: 4, username: "@designby_neha", image: "https://randomuser.me/api/portraits/women/12.jpg" },
  { id: 5, username: "@tech_vikas", image: "https://randomuser.me/api/portraits/men/45.jpg" },
  { id: 6, username: "@amit.edits", image: "https://randomuser.me/api/portraits/men/22.jpg" },
  { id: 7, username: "@sneha.social", image: "https://randomuser.me/api/portraits/women/31.jpg" },
  { id: 8, username: "@rohit.agency", image: "https://randomuser.me/api/portraits/men/11.jpg" },
  { id: 9, username: "@growth_karan", image: "https://randomuser.me/api/portraits/men/8.jpg" },
  { id: 10, username: "@anjali_designs", image: "https://randomuser.me/api/portraits/women/55.jpg" }
];

export default function FollowerMarquee() {
  // Duplicate arrays 3 times for perfectly seamless infinite loops
  const row1Items = [...DUMMY_FOLLOWERS, ...DUMMY_FOLLOWERS, ...DUMMY_FOLLOWERS];

  // Reverse the array for the second row so the profiles don't align identically
  const row2Data = [...DUMMY_FOLLOWERS].reverse();
  const row2Items = [...row2Data, ...row2Data, ...row2Data];

  return (
    <div className="w-full mt-24 mb-6 overflow-hidden relative opacity-0 animate-[fadeIn_1s_ease-in-out_0.8s_forwards]">
      {/* Gradient Fades for edges to make it look premium */}
      <div className="absolute top-0 left-0 w-20 md:w-40 h-full bg-gradient-to-r from-[#fdfcfb] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-20 md:w-40 h-full bg-gradient-to-l from-[#fdfcfb] to-transparent z-10 pointer-events-none"></div>

      <p className="text-center text-[13px] sm:text-sm font-normal font-mono uppercase tracking-wider text-zinc-400 mb-8 relative z-20">
        Trusted by 10,000+ Forward-Thinking Creators
      </p>

      {/* Row 1: Scrolls Right to Left */}
      <motion.div
        className="flex w-max mb-6"
        animate={{ x: [0, "-33.3333%"] }}
        transition={{ ease: "linear", duration: 100, repeat: Infinity }}
      >
        {row1Items.map((follower, index) => (
          <div
            key={`row1-${follower.id}-${index}`}
            className="flex items-center gap-2 px-3 mx-4 shrink-0 cursor-default hover:scale-105 transition-transform"
          >
            {/* Instagram Style Avatar with Story Ring */}
            <div className="relative w-8 h-8 rounded-full flex items-center justify-center p-[2px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
              <div className="w-full h-full bg-[#fdfcfb] rounded-full p-[2px] flex items-center justify-center">
                <img
                  src={follower.image}
                  alt={follower.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="font-medium text-[14px] text-zinc-700 tracking-tight">
              {follower.username}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Row 2: Scrolls Left to Right */}
      <motion.div
        className="flex w-max"
        animate={{ x: ["-33.3333%", 0] }}
        transition={{ ease: "linear", duration: 100, repeat: Infinity }}
      >
        {row2Items.map((follower, index) => (
          <div
            key={`row2-${follower.id}-${index}`}
            className="flex items-center gap-2 px-3 mx-4 shrink-0 cursor-default hover:scale-105 transition-transform"
          >
            {/* Instagram Style Avatar with Story Ring */}
            <div className="relative w-8 h-8 rounded-full flex items-center justify-center p-[2px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
              <div className="w-full h-full bg-[#fdfcfb] rounded-full p-[2px] flex items-center justify-center">
                <img
                  src={follower.image}
                  alt={follower.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="font-medium text-[14px] text-zinc-700 tracking-tight">
              {follower.username}
            </span>
          </div>
        ))}
      </motion.div>

    </div>
  );
}
