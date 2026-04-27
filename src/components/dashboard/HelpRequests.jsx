"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { LifeBuoy, User, Clock, MessageSquare, ExternalLink } from "lucide-react";
import Loader from "@/components/ui/Loader";

export default function HelpRequests({ automationId }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('automation_history')
                .select('*')
                .or('type.eq.HELP_REQUESTED,status.eq.HANDOVER')
                .eq('automation_id', automationId)
                .order('created_at', { ascending: false });

            if (!error) {
                setRequests(data || []);
            }
            setLoading(false);
        };

        fetchRequests();
    }, [automationId]);

    if (loading) return <div className="h-64 flex items-center justify-center"><Loader text="Fetching requests..." /></div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between px-4 py-8 bg-background border border-border rounded-[32px] shadow-sm">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight">Help Requests</h2>
                    <p className="text-sm text-zinc-muted">Users waiting for human assistance.</p>
                </div>
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <LifeBuoy size={24} />
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="p-20 text-center bg-background border border-dashed border-border rounded-[48px]">
                    <div className="w-16 h-16 bg-zinc-50 text-zinc-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">No pending requests</h3>
                    <p className="text-zinc-400 text-sm max-w-xs mx-auto">Tohra bot is doing great! No one has asked for human help yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {requests.map((req) => (
                        <div key={req.id} className="p-6 bg-background border border-border rounded-[32px] hover:border-zinc-400 transition-all group">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground flex items-center gap-2">
                                            {req.sender_name || "Anonymous User"}
                                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase font-black">Waiting</span>
                                        </h4>
                                        <p className="text-sm text-zinc-500 flex items-center gap-2 mt-1">
                                            <Clock size={12} />
                                            {new Date(req.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 bg-foreground text-background text-xs font-bold rounded-full flex items-center gap-2 hover:scale-105 transition-all">
                                        Open in Instagram
                                        <ExternalLink size={14} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mt-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <p className="text-sm text-foreground leading-relaxed italic">
                                    &quot;{req.metadata?.text || "No message content captured."}&quot;
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
