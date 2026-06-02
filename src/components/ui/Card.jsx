"use client";

import React from "react";

export default function Card({ children, className = "" }) {
    return (
        <div className={`bg-white border rounded-[20px] p-4 shadow-sm border-border ${className}`}>
            {children}
        </div>
    );
}
