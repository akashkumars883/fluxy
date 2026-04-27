import LegalLayout from "@/components/marketing/LegalLayout";

export default function TermsOfService() {
  return (
    <LegalLayout 
      title="Terms of Service" 
      lastUpdated="April 21, 2026"
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">1. Terms</h2>
        <p>
          By accessing Automixa, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">2. Use License</h2>
        <p>
          Permission is granted to use Automixa for the purpose of automating Instagram account engagement. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
          <ul className="list-disc pl-5 space-y-2 font-normal">
            <li>Attempt to decompile or reverse engineer any software contained on Automixa&apos;s website.</li>
            <li>Use the platform for any illegal activities or spamming that violates Meta&apos;s Platform Terms.</li>
            <li>Remove any copyright or other proprietary notations from the materials.</li>
          </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">3. Disclaimer</h2>
          <p>
            The materials on Automixa are provided on an &apos;as is&apos; basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties or conditions of merchantability or fitness for a particular purpose.
          </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">4. Limitations</h2>
        <p>
          In no event shall Automixa or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Automixa.
        </p>
      </section>

      <section className="space-y-4">
         <h2 className="text-xl font-semibold text-foreground tracking-normal">5. Meta Compliance</h2>
         <p>Automixa uses Meta APIs. You must comply with Meta&apos;s Community Standards and Platform Terms at all times. Failure to do so may result in termination of your access to Automixa.</p>
      </section>
    </LegalLayout>
  );
}
