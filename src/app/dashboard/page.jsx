"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Bell, Plus, Camera } from "lucide-react";
import AccountCard from "@/components/dashboard/AccountCard";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import IdentitySelection from "@/components/dashboard/IdentitySelection";
import Loader from "@/components/ui/Loader";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIdentitySelect, setShowIdentitySelect] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      // DEBUG BYPASS: Use mock user if not logged in
      const finalUser = authUser || { 
        id: 'debug-user-id', 
        user_metadata: { full_name: 'Debug User' },
        email: 'debug@automixa.test'
      };
      
      setUser(finalUser);

      if (finalUser) {
        let query = supabase.from("automations").select("*");
        
        // Only filter by user_id if we actually have a real authenticated user
        if (authUser) {
          query = query.eq("user_id", authUser.id);
        }

        let { data: accountsRaw } = await query;

        if (accountsRaw) {
          setAccounts(accountsRaw);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleConnectClick = () => {
    setShowIdentitySelect(true);
  };

  const handlePersonaSelect = (persona) => {
    setIsConnecting(true);
    setTimeout(() => {
      window.location.href = `/api/auth/connect?role=${persona}`;
    }, 800);
  };

  if (loading) return <Loader fullScreen text="Loading Dashboard..." />;

  return (
    <section className="min-h-screen bg-background font-sans flex flex-col relative overflow-x-hidden text-foreground">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <h2 
             onClick={() => window.location.href = '/dashboard'}
             className="text-xl font-bold tracking-tight text-foreground cursor-pointer"
           >
             automixa
           </h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 text-zinc-muted hover:text-foreground hover:bg-background/50 rounded-full transition-all">
            <Bell size={20} />
          </button>
          <ProfileDropdown user={user} />
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-8 md:p-16 flex flex-col">
        
        {isConnecting ? (
          <Loader text="Redirecting to Instagram..." fullScreen />
        ) : showIdentitySelect ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
             <button 
               onClick={() => setShowIdentitySelect(false)}
               className="mb-8 text-xs font-bold text-zinc-muted hover:text-foreground transition-all flex items-center gap-2"
             >
               <span className="text-lg">←</span> Back to Dashboard
             </button>
             <IdentitySelection onSelect={handlePersonaSelect} />
          </div>
        ) : (
          <>
            <header className="mb-10 sm:mb-16 text-left">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 text-foreground">
                Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}
              </h1>
              <p className="text-zinc-muted text-base sm:text-lg font-medium">Select an Instagram account to manage automations.</p>
            </header>

            {/* Account Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {accounts.map((acc) => (
                <AccountCard key={acc.id} account={acc} />
              ))}
            </div>

            {/* Connect Banner */}
            <button 
              onClick={handleConnectClick}
              className="w-full bg-background border border-border rounded-[32px] p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-foreground/20 hover:shadow-xl transition-all group relative overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-foreground/5 rounded-full -mr-40 -mt-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 relative z-10 transition-transform md:group-hover:translate-x-1 duration-300">
                <div className="p-4 sm:p-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-[28px] text-white shadow-lg group-hover:scale-105 transition-all">
                  <Camera size={32} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">Connect Instagram</h3>
                  <p className="text-zinc-muted text-sm sm:text-base font-medium">Add another business profile.</p>
                </div>
              </div>

              <div className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-bold text-sm relative z-10 hover:scale-105 transition-all shadow-md">
                <Plus size={20} /> Get Started
              </div>
            </button>
          </>
        )}

      </main>
    </section>
  );
}