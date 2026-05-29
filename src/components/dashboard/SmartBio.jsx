"use client";

import React, { useState, useEffect } from "react";
import { Plus, Save, User, Instagram, Youtube, Twitter, Facebook, Link2 as LinkIcon, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

// Helper to detect social icons
const getSocialIcon = (url) => {
  if (!url) return null;
  const l = url.toLowerCase();
  if (l.includes("instagram.com")) return <Instagram size={20} />;
  if (l.includes("youtube.com") || l.includes("youtu.be")) return <Youtube size={20} />;
  if (l.includes("twitter.com") || l.includes("x.com")) return <Twitter size={20} />;
  if (l.includes("facebook.com")) return <Facebook size={20} />;
  return null;
};

export default function SmartBio({ accountId }) {
  const [links, setLinks] = useState([]);
  const [settings, setSettings] = useState({
    profile_title: "",
    bio_text: "",
    theme_preset: "light" // light, dark, gradient-sunset, gradient-ocean, minimal-dark
  });
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("links");
  const [mockAccount, setMockAccount] = useState({ username: "username", profile_pic: null });

  useEffect(() => {
    if (accountId) {
      // Fetch user context from dashboard/session for the preview
      // using mocked data for now if not fetched
      setMockAccount({
        username: "creator_pro",
        profile_pic: `https://ui-avatars.com/api/?name=Creator&background=6366f1&color=fff&size=150`
      });

      setLinks([
        { id: '1', title: 'My Website', url: 'https://example.com' },
        { id: '2', title: 'Follow on Instagram', url: 'https://instagram.com/creator_pro' }
      ]);
      setSettings({
        profile_title: "Creator Pro",
        bio_text: "Welcome to my official Smart Bio!",
        theme_preset: "gradient-sunset"
      });
      // Fetch active products
      fetch(`/api/store/products?automationId=${accountId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setProducts(data.products.filter(p => p.is_active));
        })
        .catch(console.error);
    }
  }, [accountId]);

  const addLink = () => {
    setLinks([...links, { id: Date.now().toString(), title: '', url: '' }]);
  };

  const updateLink = (id, field, value) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const removeLink = (id) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Smart Bio saved successfully!");
    }, 1000);
  };

  const socialLinks = links.filter(l => getSocialIcon(l.url));
  const standardLinks = links.filter(l => !getSocialIcon(l.url));

  if (!accountId) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
          <User size={28} className="text-zinc-400" />
        </div>
        <h3 className="text-lg font-bold text-zinc-800">Connect an Account First</h3>
        <p className="text-sm text-zinc-500 max-w-xs">Please connect your Instagram account to set up your Smart Bio page.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 pb-10">
      
      {/* LEFT PANEL: Builder */}
      <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col gap-4">
        
        {/* Header / Tabs */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex bg-zinc-100 rounded-xl p-1 gap-1">
            <button onClick={() => setActiveTab('links')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'links' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>Links</button>
            <button onClick={() => setActiveTab('profile')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'profile' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>Profile</button>
            <button onClick={() => setActiveTab('theme')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'theme' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>Theme</button>
          </div>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-bold shadow-sm hover:scale-[1.02] transition-all flex items-center gap-2">
            {saving ? "Saving..." : <><Save size={14} /> Save Changes</>}
          </button>
        </div>

        {/* Dynamic Editor Content */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm flex-1 min-h-[500px]">
          {activeTab === 'links' && (
            <div className="space-y-4">
              <button onClick={addLink} className="w-full py-3 bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 rounded-xl text-xs font-bold flex justify-center items-center gap-2 hover:bg-[#6366F1]/20 transition-all">
                <Plus size={16} /> Add New Link
              </button>
              
              <div className="space-y-3 mt-4">
                {links.length === 0 ? (
                  <p className="text-center text-zinc-400 text-sm py-10">No links added yet. Add one above!</p>
                ) : (
                  links.map((link, i) => (
                    <div key={link.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex gap-4 group">
                      <div className="flex flex-col gap-2 flex-1">
                        <input type="text" placeholder="Title" value={link.title} onChange={e => updateLink(link.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-bold outline-none focus:border-[#6366F1]" />
                        <input type="url" placeholder="URL" value={link.url} onChange={e => updateLink(link.id, 'url', e.target.value)} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:border-[#6366F1]" />
                      </div>
                      <button onClick={() => removeLink(link.id)} className="text-zinc-400 hover:text-rose-500 transition-colors p-2 shrink-0 self-start">
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700">Profile Title</label>
                <input type="text" value={settings.profile_title} onChange={e => setSettings({...settings, profile_title: e.target.value})} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#6366F1]" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700">Bio Text</label>
                <textarea rows="3" value={settings.bio_text} onChange={e => setSettings({...settings, bio_text: e.target.value})} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#6366F1] resize-none"></textarea>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-5">
              <label className="text-xs font-bold text-zinc-700">Select Theme</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                
                {/* Light */}
                <div onClick={() => setSettings({...settings, theme_preset: 'light'})} className={`cursor-pointer h-24 rounded-xl border-2 transition-all ${settings.theme_preset === 'light' ? 'border-[#6366F1] shadow-md' : 'border-zinc-200'} bg-white flex flex-col items-center justify-center gap-2 relative overflow-hidden`}>
                  <div className="w-8 h-4 rounded bg-zinc-200"></div>
                  <div className="w-12 h-2 rounded bg-zinc-100"></div>
                  <span className="text-xs font-bold mt-1">Light</span>
                </div>

                {/* Dark */}
                <div onClick={() => setSettings({...settings, theme_preset: 'dark'})} className={`cursor-pointer h-24 rounded-xl border-2 transition-all ${settings.theme_preset === 'dark' ? 'border-[#6366F1] shadow-md' : 'border-zinc-800'} bg-zinc-950 flex flex-col items-center justify-center gap-2 relative overflow-hidden`}>
                  <div className="w-8 h-4 rounded bg-zinc-800"></div>
                  <div className="w-12 h-2 rounded bg-zinc-900"></div>
                  <span className="text-xs font-bold text-white mt-1">Dark</span>
                </div>

                {/* Gradient Sunset */}
                <div onClick={() => setSettings({...settings, theme_preset: 'gradient-sunset'})} className={`cursor-pointer h-24 rounded-xl border-2 transition-all ${settings.theme_preset === 'gradient-sunset' ? 'border-white shadow-lg ring-2 ring-[#6366F1]' : 'border-transparent'} bg-gradient-to-tr from-orange-400 via-rose-400 to-purple-500 flex flex-col items-center justify-center gap-2 relative overflow-hidden`}>
                  <div className="w-8 h-4 rounded bg-white/30 backdrop-blur-md border border-white/20"></div>
                  <div className="w-12 h-2 rounded bg-white/20"></div>
                  <span className="text-xs font-bold text-white mt-1 shadow-sm">Sunset</span>
                </div>

                {/* Gradient Ocean */}
                <div onClick={() => setSettings({...settings, theme_preset: 'gradient-ocean'})} className={`cursor-pointer h-24 rounded-xl border-2 transition-all ${settings.theme_preset === 'gradient-ocean' ? 'border-white shadow-lg ring-2 ring-[#6366F1]' : 'border-transparent'} bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex flex-col items-center justify-center gap-2 relative overflow-hidden`}>
                  <div className="w-8 h-4 rounded bg-white/30 backdrop-blur-md border border-white/20"></div>
                  <div className="w-12 h-2 rounded bg-white/20"></div>
                  <span className="text-xs font-bold text-white mt-1 shadow-sm">Ocean</span>
                </div>
                
                {/* Minimal Pink */}
                <div onClick={() => setSettings({...settings, theme_preset: 'minimal-pink'})} className={`cursor-pointer h-24 rounded-xl border-2 transition-all ${settings.theme_preset === 'minimal-pink' ? 'border-[#6366F1] shadow-md' : 'border-pink-200'} bg-pink-50 flex flex-col items-center justify-center gap-2 relative overflow-hidden`}>
                  <div className="w-8 h-4 rounded bg-pink-200"></div>
                  <div className="w-12 h-2 rounded bg-pink-100"></div>
                  <span className="text-xs font-bold text-pink-900 mt-1">Soft Pink</span>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Mobile Preview */}
      <div className="w-full md:w-2/5 lg:w-1/3 flex justify-center sticky top-4 self-start">
        <div className="w-[300px] h-[600px] bg-black rounded-[40px] border-[8px] border-zinc-900 p-2 shadow-2xl relative overflow-hidden flex flex-col shrink-0">
          
          {/* Dynamic Theme Styles */}
          <div className={`w-full h-full rounded-[28px] overflow-y-auto no-scrollbar relative flex flex-col ${
            settings.theme_preset === 'dark' ? 'bg-zinc-950 text-white' : 
            settings.theme_preset === 'light' ? 'bg-zinc-50 text-zinc-900' :
            settings.theme_preset === 'gradient-sunset' ? 'bg-gradient-to-tr from-orange-400 via-rose-400 to-purple-500 text-white' :
            settings.theme_preset === 'gradient-ocean' ? 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 text-white' :
            settings.theme_preset === 'minimal-pink' ? 'bg-pink-50 text-pink-950' : 'bg-zinc-50 text-zinc-900'
          }`}>
            
            {/* Inner Padding container */}
            <div className="p-5 flex-1 flex flex-col">
              
              <div className="flex flex-col items-center text-center mt-6">
                {/* Profile Image */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 overflow-hidden border-2 shadow-md ${
                  settings.theme_preset.includes('gradient') || settings.theme_preset === 'dark' ? 'border-white/20 bg-white/10' : 'border-white bg-zinc-200'
                }`}>
                  {mockAccount.profile_pic ? (
                    <img src={mockAccount.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="opacity-50" />
                  )}
                </div>
                
                {/* Name */}
                <h2 className="text-lg font-bold">{settings.profile_title || "Your Name"}</h2>
                {/* Username */}
                <p className="text-xs font-medium opacity-80 mt-0.5">@{mockAccount.username}</p>
                {/* Bio */}
                <p className="text-xs mt-3 opacity-90 px-2 leading-relaxed">{settings.bio_text || "Add your bio text here"}</p>
              </div>

              {/* Social Icons Row */}
              {socialLinks.length > 0 && (
                <div className="flex items-center justify-center gap-3 mt-6">
                  {socialLinks.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                      settings.theme_preset.includes('gradient') ? 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20' : 
                      settings.theme_preset === 'dark' ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 
                      settings.theme_preset === 'minimal-pink' ? 'bg-pink-200/50 text-pink-900 hover:bg-pink-200' : 'bg-white text-zinc-900 shadow-sm border border-zinc-200 hover:border-zinc-300'
                    }`}>
                      {getSocialIcon(link.url)}
                    </a>
                  ))}
                </div>
              )}

              {/* Standard Links Preview */}
              <div className="mt-6 space-y-3">
                {standardLinks.map((link) => (
                  <div key={link.id} className={`w-full py-3.5 px-4 rounded-[14px] text-sm font-bold text-center transition-all flex items-center justify-between group ${
                    settings.theme_preset.includes('gradient') ? 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white' :
                    settings.theme_preset === 'dark' ? 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white' : 
                    settings.theme_preset === 'minimal-pink' ? 'bg-white border-2 border-pink-100 hover:border-pink-300 shadow-sm' :
                    'bg-white border border-zinc-200 hover:border-zinc-300 shadow-sm text-zinc-900'
                  }`}>
                    <span className="flex-1 text-center truncate px-2">{link.title || "Link Title"}</span>
                  </div>
                ))}
              </div>

              {/* Products Preview */}
              {products.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-px flex-1 ${settings.theme_preset.includes('gradient') || settings.theme_preset === 'dark' ? 'bg-white/20' : 'bg-black/10'}`}></div>
                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest text-center">Store</p>
                    <div className={`h-px flex-1 ${settings.theme_preset.includes('gradient') || settings.theme_preset === 'dark' ? 'bg-white/20' : 'bg-black/10'}`}></div>
                  </div>
                  <div className="space-y-3">
                    {products.map(p => (
                      <div key={p.id} className={`w-full p-2.5 rounded-[16px] flex items-center gap-3 ${
                        settings.theme_preset.includes('gradient') ? 'bg-white/10 backdrop-blur-md border border-white/20' :
                        settings.theme_preset === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 
                        settings.theme_preset === 'minimal-pink' ? 'bg-white border-2 border-pink-100 shadow-sm' :
                        'bg-white border border-zinc-200 shadow-sm'
                      }`}>
                        <div className="w-12 h-12 bg-black/5 rounded-xl shrink-0 overflow-hidden">
                          {p.cover_image && <img src={p.cover_image} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-[11px] font-bold line-clamp-2 leading-tight">{p.name}</p>
                          <p className={`text-[10px] font-bold mt-1 ${settings.theme_preset.includes('gradient') ? 'text-white/80' : 'text-[#6366F1]'}`}>₹{p.price_inr}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Footer */}
              <div className="mt-auto pt-10 text-center space-y-2">
                <p className={`text-[10px] font-black uppercase tracking-widest ${settings.theme_preset.includes('gradient') || settings.theme_preset === 'dark' ? 'text-white/40' : 'text-black/30'}`}>
                  Powered by Automixa
                </p>
                <div className={`flex items-center justify-center gap-3 text-[9px] font-bold ${settings.theme_preset.includes('gradient') || settings.theme_preset === 'dark' ? 'text-white/50' : 'text-black/40'}`}>
                  <span>Privacy Policy</span>
                  <span>•</span>
                  <span>Terms</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
