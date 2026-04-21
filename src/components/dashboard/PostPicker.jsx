"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Check, CheckCircle2, LayoutGrid, Calendar, AlertCircle } from "lucide-react";
import Loader from "@/components/ui/Loader";

/**
 * POST PICKER COMPONENT
 * Fetches and displays Instagram media for selection.
 */
export default function PostPicker({ automationId, media, loading, error: fetchError, onSelect, selectedPosts }) {
  const [selection, setSelection] = useState(selectedPosts || []);

  const togglePost = (postId) => {
    setSelection(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId) 
        : [...prev, postId]
    );
  };

  useEffect(() => {
    onSelect(selection);
  }, [selection]);

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center bg-white border border-border rounded-[32px]">
      <Loader text="Fetching your posts..." />
    </div>
  );

  if (fetchError) return (
    <div className="h-64 flex flex-col items-center justify-center bg-white border border-border rounded-[32px] p-8 text-center">
      <AlertCircle size={32} className="text-red-500 mb-4" />
      <p className="text-sm font-bold text-foreground">Failed to load posts</p>
      <p className="text-xs text-zinc-muted mt-1">{fetchError}</p>
    </div>
  );

  return (
    <section className="bg-white border border-border rounded-[32px] shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-border/40 bg-zinc-50/50 flex items-center justify-between shrink-0">
        <div>
           <h2 className="font-semibold text-lg text-foreground tracking-normal">Select Content</h2>
           <p className="text-[11px] text-zinc-muted font-normal opacity-60">Pick what to automate</p>
        </div>
        <div className="px-3 py-1 bg-foreground/5 border border-border rounded-full text-[9px] font-semibold text-zinc-muted tracking-normal">
           Selection Required
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-2 md:p-6 no-scrollbar h-[550px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3">
          {media.map((post) => {
            const isSelected = selection.includes(post.id);
            return (
              <div 
                key={post.id} 
                onClick={() => togglePost(post.id)}
                className={`relative aspect-40/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group ${
                  isSelected ? 'ring-4 ring-foreground ring-offset-2' : 'hover:scale-[1.02]'
                }`}
              >
                <img 
                  src={post.media_url} 
                  alt={post.caption || "Instagram Post"} 
                  className={`w-full h-full object-cover transition-all duration-500 ${isSelected ? 'brightness-50' : 'group-hover:brightness-90'}`}
                />
                
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="text-white" size={32} strokeWidth={4} />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[8px] text-white font-medium line-clamp-1 truncate">{post.caption || "No caption"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-zinc-50 border-t border-border/40 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-zinc-muted tracking-normal">Selection: <span className="text-foreground">{selection.length} Posts</span></span>
          {selection.length > 0 ? (
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded tracking-normal">Targeted rules ready ✨</span>
          ) : (
            <span className="text-[10px] font-semibold text-amber-600 italic tracking-normal">Select at least 1 post to continue</span>
          )}
      </div>
    </section>
  );
}
