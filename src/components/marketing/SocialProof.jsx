"use client";

import { motion } from "framer-motion";
import { 
  Layers, Cloud, Shield, Activity, Globe, 
  Zap, MessageSquare, Target, Camera, 
  Smartphone, Cpu, Heart
} from "lucide-react";

export default function SocialProof() {
  const icons = [
    <Layers key="1" size={32} />,
    <Cloud key="2" size={32} />,
    <Shield key="3" size={32} />,
    <Activity key="4" size={32} />,
    <Globe key="5" size={32} />,
    <Zap key="6" size={32} />,
    <MessageSquare key="7" size={32} />,
    <Target key="8" size={32} />,
    <Camera key="9" size={32} />,
    <Heart key="10" size={32} />,
    <Smartphone key="11" size={32} />,
    <Cpu key="12" size={32} />,
  ];

  // Double the icons for a seamless loop
  const duplicatedIcons = [...icons, ...icons];

  return (
    <section className="py-24 border-y border-border/50 bg-background/50 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="max-w-7xl mx-auto px-6 mb-12 text-center text-zinc-400">
         <p className="text-[10px] font-bold uppercase tracking-[0.3em]">
           Trusted by 10,000+ scaling accounts
         </p>
      </div>

      <div className="flex relative overflow-hidden">
        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex items-center gap-16 md:gap-32 px-10 grayscale opacity-25 hover:opacity-100 hover:grayscale-0 transition-all duration-700"
        >
          {duplicatedIcons.map((icon, index) => (
            <div key={index} className="flex-shrink-0 text-foreground bg-white/50 p-6 rounded-xl border border-border/50">
              {icon}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
