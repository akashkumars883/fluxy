import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { User, Download, ExternalLink, Instagram, Youtube, Twitter, Facebook } from 'lucide-react';

export const dynamic = 'force-dynamic';

const getSocialIcon = (url) => {
  if (!url) return null;
  const l = url.toLowerCase();
  if (l.includes("instagram.com")) return <Instagram size={20} />;
  if (l.includes("youtube.com") || l.includes("youtu.be")) return <Youtube size={20} />;
  if (l.includes("twitter.com") || l.includes("x.com")) return <Twitter size={20} />;
  if (l.includes("facebook.com")) return <Facebook size={20} />;
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
    .select('id, name, ig_username, profile_picture_url')
    .eq('ig_username', username)
    .single();

  const mockAccount = account || {
    id: 'mock-id',
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

  const themePreset = settings?.theme_preset || 'light';
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

  const isDark = themePreset === 'dark';
  const isGradient = themePreset.includes('gradient');
  const isMinimalPink = themePreset === 'minimal-pink';

  // Dynamic Theme Classes
  const bgClass = 
    themePreset === 'dark' ? 'bg-zinc-950 text-white' : 
    themePreset === 'light' ? 'bg-zinc-50 text-zinc-900' :
    themePreset === 'gradient-sunset' ? 'bg-gradient-to-tr from-orange-400 via-rose-400 to-purple-500 text-white' :
    themePreset === 'gradient-ocean' ? 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 text-white' :
    themePreset === 'minimal-pink' ? 'bg-pink-50 text-pink-950' : 'bg-zinc-50 text-zinc-900';

  const avatarClass = 
    isGradient || isDark ? 'border-white/20 bg-white/10' : 'border-white bg-zinc-200 shadow-md';

  const linkClass = 
    isGradient ? 'bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white' :
    isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-white' : 
    isMinimalPink ? 'bg-white border-pink-100 hover:border-pink-300 shadow-sm border-2' :
    'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm border';

  const socialIconClass = 
    isGradient ? 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20' : 
    isDark ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 
    isMinimalPink ? 'bg-pink-200/50 text-pink-900 hover:bg-pink-200' : 'bg-white text-zinc-900 shadow-sm border border-zinc-200 hover:border-zinc-300';

  return (
    <div className={`min-h-screen w-full flex justify-center py-12 px-4 sm:px-6 transition-colors duration-500 ${bgClass}`}>
      <div className="w-full max-w-lg flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 relative z-10">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mt-6 mb-8">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-5 overflow-hidden border-[3px] shadow-lg ${avatarClass}`}>
            {mockAccount.profile_picture_url ? (
              <img src={mockAccount.profile_picture_url} alt={profileTitle} className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="opacity-50" />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{profileTitle}</h1>
          <p className="text-sm font-medium opacity-80 mt-1">@{mockAccount.ig_username}</p>
          <p className="text-[15px] mt-4 font-medium px-4 leading-relaxed opacity-90 max-w-sm">
            {bioText}
          </p>
        </div>

        {/* Social Icons Row */}
        {socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-4 mb-8">
            {socialLinks.map(link => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noreferrer" 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${socialIconClass}`}
              >
                {getSocialIcon(link.url)}
              </a>
            ))}
          </div>
        )}

        {/* Standard Links Section */}
        {standardLinks.length > 0 && (
          <div className="w-full space-y-4 mb-10">
            {standardLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-full py-4 px-5 rounded-[18px] flex items-center justify-center transition-all group hover:-translate-y-1 hover:shadow-xl ${linkClass}`}
              >
                <span className="font-bold text-[15px] truncate">{link.title}</span>
              </a>
            ))}
          </div>
        )}

        {/* Products Section */}
        {products.length > 0 && (
          <div className="w-full mb-10">
            <div className="flex items-center gap-4 mb-5">
              <div className={`h-px flex-1 ${isGradient || isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>
              <span className={`text-xs font-bold uppercase tracking-widest ${isGradient || isDark ? 'text-white/60' : 'text-black/40'}`}>Store</span>
              <div className={`h-px flex-1 ${isGradient || isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>
            </div>
            
            <div className="space-y-4">
              {products.map(p => (
                <a 
                  key={p.id} 
                  href={`/pay/${p.id}`} 
                  className={`w-full p-3 sm:p-4 rounded-[20px] flex items-center gap-4 group transition-all hover:-translate-y-1 hover:shadow-xl ${linkClass}`}
                >
                  <div className={`w-16 h-16 rounded-[14px] shrink-0 overflow-hidden flex items-center justify-center ${isGradient || isDark ? 'bg-black/20' : 'bg-black/5'}`}>
                    {p.cover_image ? (
                      <img src={p.cover_image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Download size={24} className="opacity-50" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0 pr-2">
                    <p className={`font-bold text-[15px] line-clamp-2 leading-tight ${isGradient ? 'text-white' : ''}`}>{p.name}</p>
                    <p className={`text-sm font-bold mt-1 ${isGradient ? 'text-white/80' : 'text-[#6366F1]'}`}>₹{p.price_inr}</p>
                  </div>
                  <div className="shrink-0 px-2 sm:px-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#6366F1] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                      <ExternalLink size={16} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-10 pb-6 text-center space-y-3">
          <p className={`text-[11px] font-black uppercase tracking-widest ${isGradient || isDark ? 'text-white/40' : 'text-black/30'}`}>
            Powered by Automixa
          </p>
          <div className={`flex items-center justify-center gap-4 text-[10px] font-bold ${isGradient || isDark ? 'text-white/50' : 'text-black/40'}`}>
            <a href="#" className="hover:underline underline-offset-4">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:underline underline-offset-4">Terms of Service</a>
          </div>
        </div>

      </div>
    </div>
  );
}
