"use client";

import React from "react";

export default function Button({ children, onClick, variant = "primary", className = "", disabled = false, type = "button" }) {
    const base = "inline-flex items-center justify-center rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variants = {
        primary: `bg-indigo-accent text-white hover:opacity-95 focus:ring-indigo-accent`,
        ghost: `bg-white border border-border text-foreground hover:bg-zinc-50`,
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant] || variants.primary} ${className}`}
            style={{ boxShadow: "0 6px 20px rgba(99,102,241,0.08)" }}
        >
            {children}
        </button>
    );
}
