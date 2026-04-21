"use client";

import { Zap, Settings, ArrowLeft, Heart, Palette, LayoutDashboard, Users, Briefcase } from "lucide-react";
import Link from "next/link";

export default function AutomationSidebar({ accountId, persona = null, activeTab, onTabChange }) {
    const isCreator = persona === 'content_creator';

    // Sidebar items with unique IDs instead of paths
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
        <aside className="w-64 border-r border-border h-[calc(100vh-72px)] sticky top-[72px] bg-background hidden md:flex flex-col p-6 shadow-sm">
            <div className="space-y-1 flex flex-col mb-8 px-2">
                <span className="text-[11px] font-semibold text-zinc-muted/60 leading-relaxed">
                    {isCreator ? 'Content Creator' : 'Business Owner'} Hub
                </span>
            </div>

            <div className="space-y-2 flex-1">
                {menuItems.map((item) => {
                    // Yahan active state handle ho rahi hai
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)} // Tab switch karne ke liye
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold tracking-normal transition-all duration-200 group ${isActive
                                ? "bg-foreground text-background shadow-lg shadow-foreground/5"
                                : "text-zinc-muted hover:text-foreground hover:bg-foreground/5"
                                }`}
                        >
                            <item.icon size={18} className={`${isActive ? "text-background" : "text-zinc-muted group-hover:text-foreground"}`} />
                            {item.name}
                        </button>
                    );
                })}
            </div>

            <div className="pt-6 border-t border-border">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-zinc-muted hover:text-foreground hover:bg-foreground/5 tracking-normal transition-all"
                >
                    <ArrowLeft size={18} />
                    Back to Accounts
                </Link>
            </div>
        </aside>
    );
}
