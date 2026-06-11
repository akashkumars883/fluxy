import React from "react";
import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, description, actionText, onAction }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-300 rounded-2xl bg-zinc-50/50"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-indigo-500" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-lg font-bold text-zinc-900 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-md mb-6">{description}</p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="active-scale flex items-center gap-2 px-5 py-2.5 rounded-sm bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-all shadow-sm hover:shadow premium-card-hover"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
}
