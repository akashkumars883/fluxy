import React, { useState, useEffect } from "react";
import { Link2, Smartphone, Plus, Save, User, Layout, Package } from "lucide-react";
import toast from "react-hot-toast";

export default function SmartBio({ accountId }) {
  const [links, setLinks] = useState([]);
  const [settings, setSettings] = useState({
    profile_title: "",
    bio_text: "",
    theme_preset: "light"
  });
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("links"); // links, profile, theme

  useEffect(() => {
    if (accountId) {
      // Mock fetch for now until API is built
      setLinks([
        { id: '1', title: 'My Website', url: 'https://example.com' }
      ]);
      setSettings({
        profile_title: "My Awesome Profile",
        bio_text: "Welcome to my Smart Bio!",
        theme_preset: "light"
      });
      // Fetch active products to show in bio
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
    // TODO: Connect to actual Supabase table /api/smart_bio
    setTimeout(() => {
      setSaving(false);
      toast.success("Smart Bio saved successfully!");
    }, 1000);
  };

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
                <div onClick={() => setSettings({...settings, theme_preset: 'light'})} className={`cursor-pointer h-24 rounded-xl border-2 transition-all ${settings.theme_preset === 'light' ? 'border-[#6366F1] shadow-md' : 'border-zinc-200'} bg-white flex flex-col items-center justify-center gap-2`}>
                  <div className="w-8 h-4 rounded bg-zinc-200"></div>
                  <div className="w-12 h-2 rounded bg-zinc-100"></div>
                  <span className="text-xs font-bold mt-1">Light Minimal</span>
                </div>
                <div onClick={() => setSettings({...settings, theme_preset: 'dark'})} className={`cursor-pointer h-24 rounded-xl border-2 transition-all ${settings.theme_preset === 'dark' ? 'border-[#6366F1] shadow-md' : 'border-zinc-800'} bg-zinc-950 flex flex-col items-center justify-center gap-2`}>
                  <div className="w-8 h-4 rounded bg-zinc-800"></div>
                  <div className="w-12 h-2 rounded bg-zinc-900"></div>
                  <span className="text-xs font-bold text-white mt-1">Dark Glass</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Mobile Preview */}
      <div className="w-full md:w-2/5 lg:w-1/3 flex justify-center sticky top-4 self-start">
        <div className="w-[300px] h-[600px] bg-black rounded-[40px] border-[8px] border-zinc-900 p-2 shadow-2xl relative overflow-hidden flex flex-col shrink-0">
          {/* Dynamic Theme Content */}
          <div className={`w-full h-full rounded-[28px] p-5 overflow-y-auto ${settings.theme_preset === 'dark' ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}>
            <div className="flex flex-col items-center text-center mt-6">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4 overflow-hidden border border-zinc-200">
                <User size={32} className="text-indigo-400" />
              </div>
              <h2 className="text-lg font-bold">{settings.profile_title || "@username"}</h2>
              <p className="text-xs mt-2 opacity-70 px-4">{settings.bio_text || "Add your bio text here"}</p>
            </div>

            {/* Links Preview */}
            <div className="mt-8 space-y-3">
              {links.map((link) => (
                <div key={link.id} className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold text-center transition-all ${settings.theme_preset === 'dark' ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white border border-zinc-200 hover:border-zinc-300 shadow-sm'}`}>
                  {link.title || "Link Title"}
                </div>
              ))}
            </div>

            {/* Products Preview */}
            {products.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-bold opacity-50 uppercase tracking-widest mb-3 text-center">Store</p>
                <div className="space-y-3">
                  {products.map(p => (
                    <div key={p.id} className={`w-full p-3 rounded-xl flex items-center gap-3 ${settings.theme_preset === 'dark' ? 'bg-zinc-900' : 'bg-white border border-zinc-200 shadow-sm'}`}>
                      <div className="w-12 h-12 bg-zinc-200 rounded-lg shrink-0 overflow-hidden">
                        {p.cover_image && <img src={p.cover_image} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-bold line-clamp-1">{p.name}</p>
                        <p className="text-xs text-indigo-500 font-bold mt-0.5">₹{p.price_inr}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
