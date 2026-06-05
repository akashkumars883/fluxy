import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { User, Download, ExternalLink, AtSign, Play, Globe, Users2, Link2 } from 'lucide-react';
import ShareButton from '@/components/bio/ShareButton';

export const dynamic = 'force-dynamic';

const ensureAbsoluteUrl = (url) => {
  if (!url) return '';
  let trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

const THEMES = [
  {
    id: "ivory",
    name: "Ivory",
    heroStyle: { background: "#D6CFC4" },
    heroPattern: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35) 0%, transparent 55%), radial-gradient(circle at 70% 80%, rgba(180,160,140,0.3) 0%, transparent 55%)",
    pageBg: "#FAFAF8",
    textPrimary: "#1A1A1A",
    textSub: "#777777",
    buttonBg: "#FFFFFF",
    buttonBorder: "#EBEBEB",
    buttonText: "#1A1A1A",
    socialBg: "#FFFFFF",
    socialText: "#1A1A1A",
    footerText: "rgba(0,0,0,0.3)",
  },
  {
    id: "midnight",
    name: "Midnight",
    heroStyle: { background: "#111111" },
    heroPattern: "radial-gradient(circle at 50% 0%, rgba(80,80,80,0.4) 0%, transparent 70%)",
    pageBg: "#0D0D0D",
    textPrimary: "#FFFFFF",
    textSub: "#888888",
    buttonBg: "#1C1C1C",
    buttonBorder: "#2E2E2E",
    buttonText: "#FFFFFF",
    socialBg: "#1C1C1C",
    socialText: "#FFFFFF",
    footerText: "rgba(255,255,255,0.25)",
  },
  {
    id: "forest",
    name: "Forest",
    heroStyle: { background: "#1B4332" },
    heroPattern: "radial-gradient(circle at 30% 30%, rgba(45,106,79,0.6) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(0,60,30,0.4) 0%, transparent 60%)",
    pageBg: "#F2FAF5",
    textPrimary: "#1B4332",
    textSub: "#40916C",
    buttonBg: "#FFFFFF",
    buttonBorder: "#D8EDDF",
    buttonText: "#1B4332",
    socialBg: "#FFFFFF",
    socialText: "#1B4332",
    footerText: "rgba(27,67,50,0.35)",
  },
  {
    id: "blush",
    name: "Blush",
    heroStyle: { background: "#C9637A" },
    heroPattern: "radial-gradient(circle at 40% 20%, rgba(255,182,193,0.5) 0%, transparent 55%), radial-gradient(circle at 60% 80%, rgba(180,60,80,0.3) 0%, transparent 55%)",
    pageBg: "#FFF5F7",
    textPrimary: "#6B1F34",
    textSub: "#BE4A6A",
    buttonBg: "#FFFFFF",
    buttonBorder: "#FBCFE8",
    buttonText: "#6B1F34",
    socialBg: "#FFFFFF",
    socialText: "#6B1F34",
    footerText: "rgba(107,31,52,0.3)",
  },
  {
    id: "navy",
    name: "Ocean",
    heroStyle: { background: "#1E3A5F" },
    heroPattern: "radial-gradient(circle at 30% 40%, rgba(56,120,180,0.5) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(10,30,60,0.4) 0%, transparent 60%)",
    pageBg: "#F0F5FB",
    textPrimary: "#1E3A5F",
    textSub: "#4A7AB5",
    buttonBg: "#FFFFFF",
    buttonBorder: "#BFDBFE",
    buttonText: "#1E3A5F",
    socialBg: "#FFFFFF",
    socialText: "#1E3A5F",
    footerText: "rgba(30,58,95,0.3)",
  },
];

const getSocialIcon = (url) => {
  if (!url) return null;
  const l = url.toLowerCase();
  if (l.includes("instagram.com")) return <AtSign size={20} />;
  if (l.includes("youtube.com") || l.includes("youtu.be")) return <Play size={20} />;
  if (l.includes("twitter.com") || l.includes("x.com")) return <Globe size={20} />;
  if (l.includes("facebook.com")) return <Users2 size={20} />;
  if (l.includes("linkedin.com")) return <Link2 size={20} />;
  return null;
};

export default async function BioPage({ params }) {
  const { username } = await params;

  if (!username) {
    return notFound();
  }

  // Fetch the user's account by IG username
  const supabase = createClient();
  const { data: account, error: accountError } = await supabase
    .from('automations')
    .select('id, page_name, metadata')
    .ilike('page_name', username)
    .single();

  if (!account) {
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev) {
      return notFound();
    }
  }

  const mockAccount = account ? {
    id: account.id,
    name: account.metadata?.username || account.page_name,
    ig_username: account.page_name,
    profile_picture_url: account.metadata?.profile_picture_url || null
  } : {
    id: 'mock-account-uuid-12345',
    name: 'Creator ' + username,
    ig_username: username,
    profile_picture_url: null
  };

  // Fetch Smart Bio Settings
  const { data: settings } = await supabase
    .from('smart_bio_settings')
    .select('*')
    .eq('automation_id', mockAccount.id)
    .single();

  const themePreset = settings?.theme_preset || 'ivory';
  const theme = THEMES.find(t => t.id === themePreset) || THEMES[0];
  const profileTitle = settings?.profile_title || mockAccount.name;
  const bioText = settings?.bio_text || "Check out my links and products below!";

  // Fetch Bio Links
  const { data: linksData } = await supabase
    .from('smart_bio_links')
    .select('*')
    .eq('automation_id', mockAccount.id)
    .order('sort_order', { ascending: true });
  
  const allLinks = linksData || [
    { id: 1, title: 'Follow me on Instagram', url: `https://instagram.com/${username}` }
  ];

  // Separate links
  const socialLinks = allLinks.filter(l => getSocialIcon(l.url));
  const standardLinks = allLinks.filter(l => !getSocialIcon(l.url));

  // Fetch Active Products
  const { data: productsData } = await supabase
    .from('store_products')
    .select('id, name, price_inr, cover_image, type')
    .eq('automation_id', mockAccount.id)
    .eq('is_active', true);
  
  const products = productsData || [];

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center py-0 sm:py-8 transition-colors duration-500 overflow-x-hidden"
      style={{ backgroundColor: theme.pageBg }}
    >
      <div 
        className="w-full max-w-md flex flex-col min-h-screen sm:min-h-0 sm:h-[85vh] sm:rounded-xl sm:shadow-2xl border-0 sm:border animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 relative overflow-y-auto overflow-x-hidden"
        style={{ 
          backgroundColor: theme.pageBg,
          borderColor: theme.buttonBorder,
        }}
      >
        
        {/* Floating Header Actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <a 
            href="https://automixa.in"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-105 shadow-sm"
            title="Powered by Automixa"
          >
            <img src="/logo.png" alt="Automixa Logo" className="w-4.5 h-4.5 object-contain brightness-0 invert" />
          </a>
          <ShareButton />
        </div>

        {/* Cover Image / Hero Section */}
        <div 
          className="relative h-44 w-full shrink-0" 
          style={{ ...theme.heroStyle }}
        >
          <div 
            className="absolute inset-0" 
            style={{ backgroundImage: theme.heroPattern }} 
          />
          {/* Wave SVG divider at the bottom */}
          <svg 
            className="absolute bottom-0 left-0 w-full" 
            viewBox="0 0 290 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: 'scale(1.01)' }}
          >
            <path 
              d="M0 24 L0 10 Q72.5 0 145 10 Q217.5 20 290 10 L290 24 Z" 
              fill={theme.pageBg} 
            />
          </svg>
          
          {/* Overlapping Profile Picture */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full border-[4px] shadow-lg overflow-hidden flex items-center justify-center z-10"
            style={{ 
              borderColor: theme.buttonBg, 
              backgroundColor: theme.buttonBg 
            }}
          >
            {mockAccount.profile_picture_url ? (
              <img 
                src={mockAccount.profile_picture_url} 
                alt={profileTitle} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <User size={36} style={{ color: theme.textSub }} />
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="pt-16 pb-6 px-6 flex flex-col items-center text-center">
          <h1 
            className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1"
            style={{ color: theme.textPrimary }}
          >
            {profileTitle}
          </h1>
          <p 
            className="text-xs font-bold lowercase tracking-[0.12em] mt-1"
            style={{ color: theme.textSub }}
          >
            @{mockAccount.ig_username?.toLowerCase()}
          </p>
          {bioText && (
            <p 
              className="text-sm text-center mt-4 leading-relaxed max-w-sm"
              style={{ color: theme.textSub }}
            >
              {bioText}
            </p>
          )}
        </div>

        {/* Social Icons Row */}
        {socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-3 mb-6 px-6">
            {socialLinks.map(link => (
              <a 
                key={link.id} 
                href={ensureAbsoluteUrl(link.url)} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm border transition-transform hover:scale-110"
                style={{ 
                  backgroundColor: theme.socialBg, 
                  borderColor: theme.buttonBorder, 
                  color: theme.socialText 
                }}
              >
                {getSocialIcon(link.url)}
              </a>
            ))}
          </div>
        )}

        {/* Standard Links Section */}
        {standardLinks.length > 0 && (
          <div className="w-full space-y-3 px-6 mb-8">
            {standardLinks.map((link) => (
              <a 
                key={link.id} 
                href={ensureAbsoluteUrl(link.url)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5 hover:shadow-md border"
                style={{ 
                  backgroundColor: theme.buttonBg, 
                  borderColor: theme.buttonBorder, 
                  color: theme.buttonText 
                }}
              >
                <span className="font-bold text-[14px] truncate">{link.title}</span>
              </a>
            ))}
          </div>
        )}

        {/* Products Section */}
        {products.length > 0 && (
          <div className="w-full px-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1" style={{ backgroundColor: theme.buttonBorder }}></div>
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textSub }}>Store</span>
              <div className="h-px flex-1" style={{ backgroundColor: theme.buttonBorder }}></div>
            </div>
            
            <div className="space-y-3">
              {products.map(p => (
                <a 
                  key={p.id} 
                  href={`/pay/${p.id}`} 
                  className="w-full p-3 rounded-xl flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md border"
                  style={{ 
                    backgroundColor: theme.buttonBg, 
                    borderColor: theme.buttonBorder, 
                    color: theme.buttonText 
                  }}
                >
                  <div 
                    className="w-14 h-14 rounded-lg shrink-0 overflow-hidden flex items-center justify-center border"
                    style={{ 
                      backgroundColor: theme.pageBg,
                      borderColor: theme.buttonBorder 
                    }}
                  >
                    {p.cover_image ? (
                      <img src={p.cover_image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Download size={20} style={{ color: theme.textSub }} />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0 pr-2">
                    <p className="font-bold text-[14px] line-clamp-2 leading-tight" style={{ color: theme.textPrimary }}>{p.name}</p>
                    <p className="text-xs font-extrabold mt-1 text-[#6366F1]">₹{p.price_inr}</p>
                  </div>
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform">
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-8 pb-4 text-center space-y-3 px-6">
          <p className="text-[9px] font-black lowercase tracking-widest" style={{ color: theme.footerText }}>
            powered by automixa
          </p>
          <div className="flex items-center justify-center gap-4 text-[9px] font-bold" style={{ color: theme.footerText }}>
            <a href="#" className="hover:underline underline-offset-4">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:underline underline-offset-4">Terms of Service</a>
          </div>
        </div>

      </div>
    </div>
  );
}
