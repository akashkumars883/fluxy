"use client";

import React from "react";

export default function AppShell({ children, className = "" }) {
    return (
        <div className={`min-h-screen bg-background text-foreground ${className}`}>
            <div className="max-w-8xl mx-auto w-full px-3 sm:px-4 lg:px-6">
                {children}
            </div>
        </div>
    );
}
