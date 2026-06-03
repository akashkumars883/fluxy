"use client";

import React from "react";

export default function AppShell({ children, className = "" }) {
    return (
        <div className={`min-h-screen bg-background text-foreground ${className}`}>
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}
