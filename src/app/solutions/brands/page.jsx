"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Zap, DollarSign, Target, Play, CheckCircle2, TrendingUp } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function BrandsSolutionPage() {
  const benefits = [
    {
      title: "Send Coupons Automatically",
      description: "Encourage users to comment a word like 'DISCOUNT' and instantly send them a checkout code in their DMs.",
      icon: DollarSign,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Drive Sales 24/7",
      description: "Convert your Instagram followers into paying customers even when your store team is asleep. Never miss a potential sale.",
      icon: Target,
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Streamline Product Discovery",
      description: "Stop answering 'How much is this?' in the comments. Automatically send the exact product link to anyone who asks.",
      icon: Zap,
      image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=1200&auto=format&fit=crop",
    }
  ];

  const faqs = [
    {
      q: "How can e-commerce brands use Automixa?",
      a: "Brands use Automixa to instantly send product links and discount codes via DM when followers comment on their posts. This removes friction and drives immediate sales."
    },
    {
      q: "Can I automate customer support FAQs?",
      a: "Yes! You can set up keyword triggers in DMs. If a customer messages 'Shipping' or 'Returns', Automixa will instantly reply with your policy."
    },
    {
      q: "Does it integrate with Shopify or WooCommerce?",
      a: "You can simply drop any checkout link, Shopify product URL, or WooCommerce link into the Automixa reply message. When the user clicks it in their DM, they are taken directly to checkout."
    },
    {
      q: "Is it safe for my brand's Instagram account?",
      a: "100% safe. We only use Meta's official API for Business accounts. There is zero risk of being banned, unlike unauthorized scraper bots."
    }
  ];

  return (
    <main className="min-h-screen text-foreground overflow-hidden relative font-sans pt-24 pb-6 selection:bg-rose-500/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <PageTransition>
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          
          {/* HERO SECTION */}
          <div className="flex flex-col lg:flex-row items-center gap-10 mb-16 pt-4">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-widest border border-rose-500/20">
                <ShoppingBag size={14} />
                For Brands & E-commerce
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                Turn Followers Into <span className="text-rose-500 font-normal">Customers</span>.
              </h1>
              <p className="text-zinc-500 text-lg sm:text-xl leading-relaxed max-w-lg">
                Automate your Instagram sales funnel. Reply to comments with discount codes, send product links, and skyrocket your conversion rates.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login" className="px-8 py-4 bg-foreground text-background font-bold rounded-full hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 group">
                  Automate Sales Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#how-it-works" className="px-8 py-4 bg-white/40 backdrop-blur-md border border-zinc-200/60 text-zinc-800 font-bold rounded-full hover:bg-white transition-all flex items-center justify-center gap-2">
                  <Play size={18} className="text-rose-500" />
                  See It In Action
                </Link>
              </div>
              
              <div className="flex items-center gap-6 pt-6 border-t border-zinc-200/50">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Brand" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
                  ))}
                </div>
                <div className="text-xs text-zinc-500 font-medium leading-tight">
                  <span className="font-bold text-zinc-800 text-sm block">1,500+ Brands</span>
                  already boosting ROI
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl aspect-[4/3] border border-zinc-200/40 bg-zinc-100">
                <img 
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop" 
                  alt="E-commerce store owner" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-lg border border-white flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                    <TrendingUp className="text-rose-500" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">Sale Completed</h4>
                    <p className="text-xs text-zinc-500">Automixa sent a 15% OFF code via DM.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* HOW IT HELPS SECTION */}
          <div id="how-it-works" className="py-12 scroll-mt-12">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
              <span className="text-rose-500 font-bold uppercase tracking-widest text-xs">Brand Automation</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                Your 24/7 automated <br className="hidden sm:block" /> sales assistant.
              </h2>
            </div>

            <div className="space-y-16">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                const isEven = idx % 2 !== 0;
                
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className={`flex flex-col gap-8 items-center ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                  >
                    <div className="w-full lg:w-1/2 space-y-4">
                      <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/20">
                        <Icon className="text-rose-500" size={28} />
                      </div>
                      <h3 className="text-2xl sm:text-4xl font-bold text-zinc-900 leading-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-zinc-500 text-lg leading-relaxed">
                        {benefit.description}
                      </p>
                      <ul className="space-y-3 pt-2">
                        {[1, 2, 3].map((_, i) => (
                          <li key={i} className="flex items-center gap-3 text-zinc-700 font-medium">
                            <CheckCircle2 size={18} className="text-rose-500" />
                            {i === 0 ? "Works perfectly with Shopify" : i === 1 ? "Instant auto-reply without delays" : "Detailed ROI analytics"}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="w-full lg:w-1/2">
                      <div className="rounded-[32px] overflow-hidden aspect-[4/3] shadow-xl border border-zinc-200/50 relative group">
                        <img 
                          src={benefit.image} 
                          alt={benefit.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
        </div>
      </PageTransition>

      <FAQ customFaqs={faqs} />
      <div className="mt-16">
        <CTA />
      </div>
    </main>
  );
}
