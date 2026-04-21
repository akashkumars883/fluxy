import LegalLayout from "@/components/marketing/LegalLayout";
import { ShieldCheck, Trash2 } from "lucide-react";

export default function DataDeletion() {
  return (
    <LegalLayout 
      title="Data Deletion Instructions" 
      subtitle="How to manage and delete your information on Automixa."
      lastUpdated="April 21, 2026"
    >
      <div className="space-y-12">
        <section className="p-8 bg-white border border-border rounded-[40px] shadow-sm">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
             <ShieldCheck size={24} />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-4 tracking-normal">Our Commitment to Your Privacy</h2>
          <p className="text-zinc-600 font-normal leading-relaxed tracking-normal">
            At Automixa, we take your data privacy seriously. According to Meta's Platform Terms and GDPR regulations, you have the right to request the deletion of your data that we have processed from the Instagram Graph API.
          </p>
        </section>

        <section className="space-y-6">
           <h2 className="text-2xl font-semibold text-foreground tracking-normal">How to Delete Your Data</h2>
           
           <div className="grid grid-cols-1 gap-6">
              <div className="flex gap-6 items-start text-sm">
                 <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 text-xs font-semibold">1</div>
                 <div className="space-y-2">
                    <h3 className="font-semibold text-foreground tracking-normal">Disconnect via Instagram</h3>
                    <p className="text-zinc-500 font-normal leading-relaxed tracking-normal">
                      Go to your Instagram Settings {">"} Apps and Websites. Find **Automixa** and click 'Remove'. This will immediately invalidate our access to your account.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 items-start text-sm">
                 <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 text-xs font-semibold">2</div>
                 <div className="space-y-2">
                    <h3 className="font-semibold text-foreground tracking-normal">In-App Deletion</h3>
                    <p className="text-zinc-500 font-normal leading-relaxed tracking-normal">
                      Log in to your Automixa dashboard, go to **Settings**, and click on **Disconnect Account**. This will delete all your automation rules and history from our database.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 items-start text-sm">
                 <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 text-xs font-semibold">3</div>
                 <div className="space-y-2">
                    <h3 className="font-semibold text-foreground tracking-normal">Manual Request</h3>
                    <p className="text-zinc-500 font-normal leading-relaxed tracking-normal">
                      Alternatively, you can email us at **support@automixa.ai** with the subject "Data Deletion Request" and your Instagram Username. We will process your request within 24-48 hours.
                    </p>
                 </div>
              </div>
           </div>
        </section>

        <div className="p-8 bg-zinc-950 text-white rounded-[40px] flex items-center justify-between">
           <div className="space-y-2">
              <h4 className="font-semibold tracking-normal">Ready to disconnect?</h4>
              <p className="text-white/50 text-xs font-normal tracking-normal">All your automation rules will be permanently erased.</p>
           </div>
           <button className="px-6 py-3 bg-red-500 text-white rounded-full text-xs font-semibold hover:bg-red-600 transition-all tracking-normal flex items-center gap-2">
              <Trash2 size={16} />
              Delete Data
           </button>
        </div>
      </div>
    </LegalLayout>
  );
}
