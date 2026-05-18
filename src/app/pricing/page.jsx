"use client";

import { useState, useEffect } from "react";
import Pricing from "@/components/marketing/Pricing";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";
import { Check, X, Sparkles, HelpCircle } from "lucide-react";

export default function PricingPage() {
  const [isIndia, setIsIndia] = useState(true);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") {
        setIsIndia(true);
      } else {
        setIsIndia(false);
      }
    } catch (e) {}
  }, []);
  const comparisonRows = [
    { feature: "AI Credits per Month", free: "25,000 Credits", pro: "250,000 Credits (10X)", viral: "2,000,000 Credits (100X)", agency: "Custom Quota", desc: "Monthly quota for smart AI conversational responses" },
    { feature: "Active Automations Limit", free: "5 Automations", pro: "Unlimited", viral: "Unlimited", agency: "Unlimited", desc: "Number of active comment/DM trigger campaigns" },
    { feature: "Auto DMs Quota", free: "1,000 DMs/mo", pro: "Unlimited DMs & Replies", viral: "Unlimited DMs & Replies", agency: "Unlimited DMs & Replies", desc: "Volume of outbound automated Instagram DMs sent" },
    { feature: "AI Human Mimicry Mode", free: false, pro: true, viral: true, agency: true, desc: "Add natural randomized delays to mimic real human chat" },
    { feature: "Follow before DM Gate", free: true, pro: true, viral: true, agency: true, desc: "Require users to follow your Instagram page before DM delivery" },
    { feature: "Story Mention Responder", free: false, pro: true, viral: true, agency: true, desc: "Instantly reply when followers tag you in stories" },
    { feature: "CRM Unlimited & CSV Export", free: "100 Contacts", pro: true, viral: true, agency: true, desc: "Export captured leads, phone numbers, and email contacts" },
    { feature: "Ambassador Promo Codes", free: false, pro: true, viral: true, agency: true, desc: "Generate custom discount codes for your followers" },
    { feature: "Razorpay Split Share", free: false, pro: "20% Commission", viral: "25% VIP Commission", agency: "Custom Terms", desc: "Earn recurring affiliate income via RazorpayX Split" },
    { feature: "Priority Support SLA", free: "Community FAQ", pro: "24/7 Email Support", viral: "WhatsApp Founder SLA", agency: "Personal Growth Manager", desc: "Expected response time for technical assistance" },
  ];

  return (
    <main className="min-h-screen pt-24 bg-background overflow-hidden selection:bg-[#6366F1]/20">
      <div className="pt-10">
        <Pricing />
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 py-20 border-t border-zinc-100 mt-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles size={14} /> Full Breakdown
          </span>
          <h3 className="text-3xl sm:text-5xl font-semibold text-zinc-900 tracking-tight mb-4">Compare all features</h3>
          <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-normal">
            Need a detailed breakdown? All plans include core Instagram automation, but Creator Pro and Viral Scale unlock huge AI credit multipliers and CRM export.
          </p>
        </div>

        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] shadow-xl shadow-zinc-100/40 p-6 sm:p-10 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-200/50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-4 pl-4 w-1/3">Core Feature</th>
                <th className="py-4 text-center w-1/6">Free Plan ({isIndia ? "₹0" : "$0"})</th>
                <th className="py-4 text-center w-1/6 bg-[#6366F1]/5 text-[#6366F1] rounded-t-2xl">Creator Pro ({isIndia ? "₹899" : "$14"})</th>
                <th className="py-4 text-center w-1/6">Viral Scale ({isIndia ? "₹1,999" : "$29"})</th>
                <th className="py-4 text-center w-1/6">Custom / Agency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/30 text-xs sm:text-sm font-semibold text-zinc-800">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/60 transition-all group">
                  <td className="py-5 pl-4 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-zinc-900 font-bold">
                      {row.feature}
                    </div>
                    <p className="text-[10px] sm:text-xs text-zinc-500 font-normal">{row.desc}</p>
                  </td>
                  
                  {/* Free Column */}
                  <td className="py-5 text-center font-bold text-zinc-700">
                    {typeof row.free === "boolean" ? (
                      row.free ? <Check size={18} className="text-emerald-600 mx-auto" /> : <X size={18} className="text-zinc-300 mx-auto" />
                    ) : (
                      row.free
                    )}
                  </td>

                  {/* Pro Column */}
                  <td className="py-5 text-center font-bold text-[#6366F1] bg-[#6366F1]/5">
                    {typeof row.pro === "boolean" ? (
                      row.pro ? <Check size={18} className="text-[#6366F1] mx-auto" /> : <X size={18} className="text-zinc-300 mx-auto" />
                    ) : (
                      row.pro
                    )}
                  </td>

                  {/* Viral Column */}
                  <td className="py-5 text-center font-bold text-zinc-900">
                    {typeof row.viral === "boolean" ? (
                      row.viral ? <Check size={18} className="text-emerald-600 mx-auto" /> : <X size={18} className="text-zinc-300 mx-auto" />
                    ) : (
                      row.viral
                    )}
                  </td>

                  {/* Agency Column */}
                  <td className="py-5 text-center font-bold text-zinc-900">
                    {typeof row.agency === "boolean" ? (
                      row.agency ? <Check size={18} className="text-emerald-600 mx-auto" /> : <X size={18} className="text-zinc-300 mx-auto" />
                    ) : (
                      row.agency
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FAQ />
      
      <div className="mt-10">
        <CTA />
      </div>
    </main>
  );
}
