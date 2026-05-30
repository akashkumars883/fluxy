import React, { useState, useEffect } from "react";
import { Plus, Package, Link2, DollarSign, Download, Image as ImageIcon, Trash2, Edit2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

export default function StoreManager({ accountId, currentPlan, onUpgradeClick }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Product State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("digital");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (accountId) fetchProducts();
  }, [accountId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/store/products?automationId=${accountId}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) return toast.error("Name and price are required");
    
    setSaving(true);
    try {
      const res = await fetch("/api/store/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          automationId: accountId,
          name,
          price: Number(price),
          type,
          description,
          fileUrl,
          coverImage
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success("Product created successfully!");
      setIsModalOpen(false);
      setName(""); setPrice(""); setDescription(""); setFileUrl(""); setCoverImage("");
      fetchProducts();
    } catch (err) {
      toast.error(err.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  if (currentPlan === "free") {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 rounded-3xl bg-[#6366F1]/10 flex items-center justify-center border border-[#6366F1]/20 shadow-xl shadow-[#6366F1]/5 relative">
          <ShoppingBag size={32} className="text-[#6366F1]" />
          <span className="absolute -top-2 -right-2 text-2xl">👑</span>
        </div>
        <div>
          <h3 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">Unlock Mini Store with Creator Pro</h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Sell digital products directly through Instagram DMs automatically. Upgrade to start monetizing!
          </p>
        </div>
        <button onClick={() => onUpgradeClick?.("mini_store")} className="mt-4 px-8 py-3.5 bg-zinc-950 hover:bg-[#6366F1] text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
          Upgrade Plan
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-500">
      
      {/* Header Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500">Total Revenue</p>
            <p className="text-2xl font-bold text-zinc-900 mt-1">₹0</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={20} />
          </div>
        </div>
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500">Sales</p>
            <p className="text-2xl font-bold text-zinc-900 mt-1">0</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag size={20} />
          </div>
        </div>
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500">Active Products</p>
            <p className="text-2xl font-bold text-zinc-900 mt-1">{products.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Package size={20} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-lg font-bold text-zinc-900">Your Products</h3>
            <p className="text-xs font-medium text-zinc-500 mt-0.5">Manage digital and physical items for your store.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#6366F1] hover:bg-[#4f46e5] text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] flex items-center gap-1.5"
          >
            <Plus size={14} strokeWidth={2.5} /> New Product
          </button>
        </div>

        {loading ? (
          <div className="py-10 flex justify-center text-zinc-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
            <Package size={32} className="mx-auto text-zinc-300 mb-3" />
            <p className="text-sm font-bold text-zinc-700">No products yet</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">Create your first digital download, course, or physical merch to start selling via DM automations.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product.id} className="border border-zinc-200/80 rounded-2xl p-4 flex flex-col hover:border-indigo-200 transition-colors bg-zinc-50/30">
                <div className="w-full aspect-video bg-zinc-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden border border-zinc-200/50">
                  {product.cover_image ? (
                    <img src={product.cover_image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={24} className="text-zinc-300" />
                  )}
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-zinc-500 mt-0.5 capitalize">{product.type} Product</p>
                  </div>
                  <span className="font-bold text-[#6366F1] text-sm shrink-0">₹{product.price_inr}</span>
                </div>
                
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-zinc-100">
                  <p className="text-[11px] font-semibold text-zinc-400">{product.sales_count} Sales</p>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/pay/${product.id}`);
                        toast.success("Checkout link copied!");
                      }}
                      className="p-1.5 text-zinc-400 hover:text-indigo-600 bg-white border border-zinc-200 hover:border-indigo-200 rounded-lg transition-colors" title="Copy Checkout Link">
                      <Link2 size={13} />
                    </button>
                    <button className="p-1.5 text-zinc-400 hover:text-zinc-900 bg-white border border-zinc-200 hover:border-zinc-300 rounded-lg transition-colors" title="Edit">
                      <Edit2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-zinc-50/50">
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Package size={18} className="text-[#6366F1]" /> Add New Product
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="productForm" onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-zinc-700">Product Name <span className="text-rose-500">*</span></label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Instagram Growth Guide" className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#6366F1] focus:bg-white transition-colors" />
                  </div>
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-zinc-700">Price (INR) <span className="text-rose-500">*</span></label>
                    <input type="number" required min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 499" className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#6366F1] focus:bg-white transition-colors" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Product Type</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setType('digital')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${type === 'digital' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'}`}>Digital Download</button>
                    <button type="button" onClick={() => setType('physical')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${type === 'physical' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'}`}>Physical Item</button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Description</label>
                  <textarea rows="2" value={description} onChange={e => setDescription(e.target.value)} placeholder="Briefly describe what they are buying..." className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#6366F1] focus:bg-white transition-colors resize-none"></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Cover Image URL</label>
                  <input type="url" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://..." className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#6366F1] focus:bg-white transition-colors" />
                </div>

                {type === 'digital' && (
                  <div className="space-y-1.5 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                    <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5"><Download size={14}/> Downloadable File URL</label>
                    <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">Enter the direct link to your PDF, Course, or Zip file. This will be automatically sent to the buyer after successful payment.</p>
                    <input type="url" required value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="https://drive.google.com/..." className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:border-[#6366F1] transition-colors" />
                  </div>
                )}
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-2 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors">Cancel</button>
              <button form="productForm" type="submit" disabled={saving} className="px-6 py-2.5 bg-[#6366F1] hover:bg-[#4f46e5] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2">
                {saving ? "Saving..." : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
