import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { User, Link2, Download, ExternalLink } from 'lucide-react';

// Force dynamic rendering since subdomains route here dynamically
export const dynamic = 'force-dynamic';

export default async function BioPage({ params }) {
  const { username } = params;

  if (!username) {
    return notFound();
  }

  // 1. Fetch the user's account by IG username
  // For MVP, we look up the automation account where ig_username matches the subdomain
  const supabase = createClient();
  const { data: account, error: accountError } = await supabase
    .from('automations')
    .select('id, name, ig_username, profile_picture_url')
    .eq('ig_username', username)
    .single();

  // For testing, if account is not found, we can mock it
  // In production, we'd return notFound() if !account
  const mockAccount = account || {
    id: 'mock-id',
    name: 'Creator ' + username,
    ig_username: username,
    profile_picture_url: null
  };

  // 2. Fetch Smart Bio Settings (fallback to defaults if none)
  const { data: settings } = await supabase
    .from('smart_bio_settings')
    .select('*')
    .eq('automation_id', mockAccount.id)
    .single();

  const themePreset = settings?.theme_preset || 'light';
  const profileTitle = settings?.profile_title || mockAccount.name;
  const bioText = settings?.bio_text || "Check out my links and products below!";

  // 3. Fetch Bio Links
  const { data: linksData } = await supabase
    .from('smart_bio_links')
    .select('*')
    .eq('automation_id', mockAccount.id)
    .order('sort_order', { ascending: true });
  
  const links = linksData || [
    { id: 1, title: 'Follow me on Instagram', url: `https://instagram.com/${username}` }
  ];

  // 4. Fetch Active Products
  const { data: productsData } = await supabase
    .from('store_products')
    .select('id, name, price_inr, cover_image, type')
    .eq('automation_id', mockAccount.id)
    .eq('is_active', true);
  
  const products = productsData || [];

  const isDark = themePreset === 'dark';

  return (
    <div className={`min-h-screen w-full flex justify-center py-10 px-4 sm:px-6 transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      <div className="w-full max-w-md flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mt-6 mb-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-5 overflow-hidden border-2 shadow-sm ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            {mockAccount.profile_picture_url ? (
              <img src={mockAccount.profile_picture_url} alt={profileTitle} className="w-full h-full object-cover" />
            ) : (
              <User size={40} className={isDark ? 'text-zinc-600' : 'text-zinc-300'} />
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{profileTitle}</h1>
          <p className={`text-sm mt-3 font-medium px-4 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {bioText}
          </p>
        </div>

        {/* Links Section */}
        {links.length > 0 && (
          <div className="w-full space-y-3 mb-10">
            {links.map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-full py-4 px-5 rounded-2xl flex items-center justify-between transition-all group ${
                  isDark 
                    ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800' 
                    : 'bg-white hover:border-zinc-300 border border-zinc-200 shadow-sm hover:shadow-md'
                }`}
              >
                <span className="font-bold text-sm">{link.title}</span>
                <ExternalLink size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-zinc-400' : 'text-zinc-400'}`} />
              </a>
            ))}
          </div>
        )}

        {/* Products Section */}
        {products.length > 0 && (
          <div className="w-full">
            <div className="flex items-center gap-4 mb-5">
              <div className={`h-px flex-1 ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
              <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Store</span>
              <div className={`h-px flex-1 ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
            </div>
            
            <div className="space-y-4">
              {products.map(p => (
                <a 
                  key={p.id} 
                  href={`/pay/${p.id}`} 
                  className={`w-full p-3 rounded-2xl flex items-center gap-4 group transition-all ${
                    isDark 
                      ? 'bg-zinc-900 border border-zinc-800 hover:border-[#6366F1]/50' 
                      : 'bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-[#6366F1]/30'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-xl shrink-0 overflow-hidden flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                    {p.cover_image ? (
                      <img src={p.cover_image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Download size={24} className={isDark ? 'text-zinc-600' : 'text-zinc-300'} />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-bold text-sm line-clamp-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{p.name}</p>
                    <p className="text-sm text-[#6366F1] font-bold mt-1">₹{p.price_inr}</p>
                  </div>
                  <div className="shrink-0 px-4">
                    <div className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                      <Link2 size={14} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Powered by Automixa
          </p>
        </div>

      </div>
    </div>
  );
}
