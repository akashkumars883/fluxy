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
      title: "Auto-Deliver Coupon Codes",
      tagline: "Increase Conversion Rates",
      description: "Encourage Reels viewers to comment a specific keyword like 'DEAL' or 'DISCOUNT' and instantly send them a checkout coupon code in their DMs. Boost direct sales automatically.",
      bullets: [
        "Works seamlessly with Shopify & WooCommerce",
        "Triggers checkout redirects in 1-click",
        "Increase Reels sales conversions by up to 4.2X"
      ],
      icon: DollarSign,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
      color: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "Instant Product Discovery",
      tagline: "Zero Comment Friction",
      description: "Stop wasting hours copy-pasting links manually. Automatically detect customer inquiries like 'price' or 'link' on your posts and send the exact checkout page link via DMs instantly.",
      bullets: [
        "Official Meta approved safe API response rules",
        "Integrates directly with Shopify product catalog URLs",
        "Real-time CTR tracking metrics inside your dashboard"
      ],
      icon: Target,
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop",
      color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Automate Customer FAQs",
      tagline: "24/7 E-commerce Assistant",
      description: "Build automated responses for customer inquiries (e.g. shipping times, refund policies, order tracking) inside Instagram DMs. Keep your support team relaxed while sales grow.",
      bullets: [
        "Answer shipping questions in under 2 seconds",
        "Auto-qualify leads before human agent handoff",
        "Runs on the cloud 24/7 even when you sleep"
      ],
      icon: Zap,
      image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=1200&auto=format&fit=crop",
      color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
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
    <main className="min-h-screen text-foreground bg-[#FBFBFD] overflow-hidden relative font-sans pt-32 pb-16 selection:bg-rose-500/20">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <PageTransition>
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          
          {/* HERO SECTION */}
          <div className="flex flex-col lg:flex-row items-center gap-16 py-12 md:py-20 mb-8">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-1/2 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-widest border border-rose-500/20">
                <ShoppingBag size={14} />
                For Brands & E-commerce
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                Turn Followers Into <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 font-bold">Customers.</span>
              </h1>
              <p className="text-zinc-600 text-base sm:text-lg leading-relaxed max-w-lg">
                Automate your Instagram sales funnel. Reply to Reels comments with discount codes, send product links via DMs instantly, and skyrocket your store conversion rates with the best <strong className="text-zinc-900 font-semibold">Instagram automation tool</strong>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login" className="px-8 py-4.5 bg-zinc-950 text-white font-bold rounded-full hover:bg-rose-600 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-rose-100 flex items-center justify-center gap-2 group text-sm">
                  Automate Sales Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#features-list" className="px-8 py-4.5 bg-white border border-zinc-200 text-zinc-800 font-bold rounded-full hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 text-sm shadow-sm">
                  <Play size={18} className="text-rose-500 fill-rose-500" />
                  See How It Works
                </Link>
              </div>
              
              <div className="flex items-center gap-6 pt-6 border-t border-zinc-200/50 max-w-md">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Brand" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
                  ))}
                </div>
                <div className="text-xs text-zinc-500 font-medium leading-tight">
                  <span className="font-bold text-zinc-800 text-sm block">1,500+ Brands</span>
                  already boosting ROI.
                </div>
              </div>
            </motion.div>
            
            {/* Right Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-white bg-white/40 p-3 backdrop-blur-md">
                <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] bg-zinc-950 border border-zinc-800">
                  <img 
                    src="https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop" 
                    alt="E-commerce store owner" 
                    className="w-full h-full object-cover opacity-85"
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
              </div>
            </motion.div>
          </div>

          {/* DYNAMIC ALTERNATING BENEFITS SECTION */}
          <div id="features-list" className="py-16 md:py-24 border-t border-zinc-200/60 scroll-mt-20">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-rose-500 font-bold uppercase tracking-widest text-xs">Brand Automation</span>
              <h2 className="text-3xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
                Your 24/7 automated sales assistant
              </h2>
            </div>

            <div className="space-y-24 md:space-y-32">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                const isEven = idx % 2 !== 0;
                
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex flex-col gap-12 lg:gap-16 items-center ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                  >
                    {/* Left content text */}
                    <div className="w-full lg:w-1/2 space-y-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 border shadow-sm ${benefit.color}`}>
                        <Icon size={26} />
                      </div>
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">{benefit.tagline}</span>
                      <h3 className="text-2xl sm:text-4xl font-bold text-zinc-900 leading-tight tracking-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-zinc-500 text-base sm:text-lg leading-relaxed font-normal">
                        {benefit.description}
                      </p>
                      <ul className="space-y-3 pt-2">
                        {benefit.bullets.map((bullet, bulletIdx) => (
                          <li key={bulletIdx} className="flex items-start gap-3 text-zinc-700 font-medium text-sm">
                            <CheckCircle2 size={18} className="text-rose-500 mt-0.5 shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Right content image */}
                    <div className="w-full lg:w-1/2">
                      <div className="rounded-[40px] overflow-hidden bg-white/40 p-3 border border-white shadow-2xl relative group">
                        <div className="rounded-[32px] overflow-hidden aspect-[4/3] relative">
                          <img 
                            src={benefit.image} 
                            alt={benefit.title} 
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                          />
                        </div>
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
      
      <CTA />
    </main>
  );
}
