import LegalLayout from "@/components/marketing/LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout 
      title="Privacy Policy" 
      lastUpdated="April 21, 2026"
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">1. Introduction</h2>
        <p>
          Automixa ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our Instagram automation platform. By using our service, you agree to the collection and use of information in accordance with this policy.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">2. Information We Collect</h2>
        <p>
          To provide our services, we collect information through the Instagram Graph API, including but not limited to:
        </p>
        <ul className="list-disc pl-5 space-y-2 font-normal">
          <li>Account Information: Your Instagram user ID and public profile information.</li>
          <li>Interaction Data: Messages sent to your account and comments posted on your media for the purpose of triggering automations.</li>
          <li>Access Tokens: We store secure tokens awarded by Meta to act on your behalf as configured by your automation rules.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">3. How We Use Your Information</h2>
        <p>
          We use the collected data to:
        </p>
        <ul className="list-disc pl-5 space-y-2 font-normal">
          <li>Automate replies to direct messages and comments.</li>
          <li>Provide analytics and engagement metrics in your dashboard.</li>
          <li>Improve our AI response mapping and service stability.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">4. Data Sharing and Disclosure</h2>
        <p>
          We do not sell your personal data. We only share information with third-party services (like Supabase for our database or Meta for API functionality) necessary to operate the platform.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">5. Security</h2>
        <p>
          The security of your data is important to us. We use industry-standard encryption and security practices to protect your information and API tokens.
        </p>
      </section>

      <section className="space-y-4">
         <h2 className="text-xl font-semibold text-foreground tracking-normal">6. Contact Us</h2>
         <p>If you have any questions about this Privacy Policy, please contact us at support@automixa.ai.</p>
      </section>
    </LegalLayout>
  );
}
