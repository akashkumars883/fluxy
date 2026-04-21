"use client";

import { useState } from "react";
import { Zap, Settings, ArrowLeft, Heart, Palette, LayoutDashboard, Menu, X } from "lucide-react";
import Link from "next/link";

export default function AutomationSidebar({ accountId, persona = null, activeTab, onTabChange }) {
    const isCreator = persona === 'content_creator';
    const [isExpanded, setIsExpanded] = useState(false);

    const businessItems = [
        { id: 'overview', name: "Overview", icon: LayoutDashboard },
        { id: 'automations', name: "Automations", icon: Zap },
        { id: 'settings', name: "Settings", icon: Settings },
    ];

    const creatorItems = [
        { id: 'overview', name: "Overview", icon: LayoutDashboard },
        { id: 'automations', name: "Automations", icon: Zap },
        { id: 'fan-engagement', name: "Fan Engagement", icon: Heart },
        { id: 'brand-kit', name: "Brand Kit", icon: Palette },
        { id: 'settings', name: "Settings", icon: Settings },
    ];

    const menuItems = isCreator ? creatorItems : businessItems;

    return (
        <aside className={`${isExpanded ? 'w-64 p-6' : 'w-[82px] p-4 px-3'} border-r border-border h-[calc(100vh-72px)] sticky top-[72px] bg-background hidden md:flex flex-col shadow-sm transition-all duration-300 ease-in-out z-40 overflow-hidden`}>
            
            {/* TOGGLE ICON AT THE TOP */}
            <div className="flex items-center justify-start mb-8 overflow-hidden pl-1">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-zinc-100 rounded-xl transition-all text-zinc-400 hover:text-foreground"
                  title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    {isExpanded ? <X size={20} /> : <Menu size={20} />}
                </button>
                {isExpanded && (
                  <span className="ml-3 text-[11px] font-bold text-zinc-muted/60 leading-relaxed whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                    {isCreator ? 'CREATOR' : 'BUSINESS'} HUB
                  </span>
                )}
            </div>

            <div className="space-y-2 flex-1 pt-2">
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center transition-all duration-300 group ${isExpanded ? 'gap-4 px-4 py-3' : 'gap-0 px-4 py-3'} rounded-2xl text-sm font-semibold tracking-normal ${isActive
                                ? "bg-foreground text-background shadow-lg shadow-foreground/5"
                                : "text-zinc-muted hover:text-foreground hover:bg-foreground/5"
                                }`}
                        >
                            <div className="flex-shrink-0 w-5 flex justify-center">
                                <item.icon size={18} className={`${isActive ? "text-background" : "text-zinc-muted group-hover:text-foreground"}`} />
                            </div>
                            {isExpanded && (
                              <span className="whitespace-nowrap overflow-hidden transition-all duration-300 opacity-100 max-w-full animate-in fade-in slide-in-from-left-2">
                                  {item.name}
                              </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="pt-6 border-t border-border overflow-hidden">
                <Link
                    href="/dashboard"
                    className={`flex items-center transition-all duration-300 ${isExpanded ? 'gap-4 px-4 py-3' : 'gap-0 px-4 py-3'} rounded-2xl text-sm font-semibold text-zinc-muted hover:text-foreground hover:bg-foreground/5 tracking-normal`}
                >
                    <div className="flex-shrink-0 w-5 flex justify-center">
                        <ArrowLeft size={18} />
                    </div>
                    {isExpanded && (
                      <span className="whitespace-nowrap overflow-hidden transition-all duration-300 opacity-100 max-w-full animate-in fade-in slide-in-from-left-2">
                          Back to Accounts
                      </span>
                    )}
                </Link>
            </div>
        </aside>
    );
}
