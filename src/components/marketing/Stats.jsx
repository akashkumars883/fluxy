"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users, Globe, Zap } from "lucide-react";

const stats = [
  { value: "12,400+", label: "Businesses Trust Automixa", icon: Users, color: "text-indigo-600 bg-indigo-50" },
  { value: "50M+", label: "Messages Automated", icon: MessageSquare, color: "text-rose-600 bg-rose-50" },
  { value: "4.9/5", label: "Customer Rating", icon: Zap, color: "text-amber-600 bg-amber-50" },
  { value: "99.9%", label: "Uptime Guarantee", icon: Globe, color: "text-emerald-600 bg-emerald-50" },
];

export default function Stats() {
  return (
    <section className="py-12 md:py-16 bg-transparent">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border border-zinc-200/80 hover:border-indigo-300 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  <Icon size={18} />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-none mb-1.5">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-zinc-500 font-medium leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
