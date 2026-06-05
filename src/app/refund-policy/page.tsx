import LegalLayout from "@/components/marketing/LegalLayout";

export const metadata = {
  title: "Refund & Cancellation Policy | Automixa",
  description: "Read Automixa's refund, cancellation, billing, and subscription policy for SaaS plans and digital services.",
  alternates: {
    canonical: "https://automixa.in/refund-policy",
  },
};

export default function RefundPolicy() {
  return (
    <LegalLayout title="Refund & Cancellation Policy" lastUpdated="June 5, 2026">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">1. Overview</h2>
        <p>
          Automixa is a software-as-a-service platform. Paid plans provide access to hosted software features, message workflow limits, CRM tools, smart bio tools, and related digital services. This policy explains when refunds, cancellations, and plan changes may apply.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">2. Free Plan and Trial Use</h2>
        <p>
          Automixa offers a free plan so customers can evaluate the product before purchasing a paid subscription. We recommend testing account connection, dashboard access, and workflow setup before upgrading.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">3. Subscription Cancellations</h2>
        <p>
          You may request cancellation of a paid subscription at any time by contacting support@automixa.in. Cancellation stops future renewals but does not automatically refund fees already paid for the current billing period.
        </p>
        <p>
          After cancellation, your paid features may remain active until the end of the current billing cycle unless we are required to restrict access for policy, security, or payment reasons.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">4. Refund Eligibility</h2>
        <p>
          Refund requests are reviewed case by case. A refund may be considered if:
        </p>
        <ul className="list-disc pl-5 space-y-2 font-normal">
          <li>You were charged twice for the same plan and billing period.</li>
          <li>A payment succeeded but paid access was not activated within a reasonable time after support review.</li>
          <li>A technical issue caused by Automixa prevented use of core paid features and we could not resolve it within 7 business days.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">5. Non-Refundable Cases</h2>
        <p>
          Refunds are generally not provided for:
        </p>
        <ul className="list-disc pl-5 space-y-2 font-normal">
          <li>Change of mind after purchasing a paid plan.</li>
          <li>Failure to use the service during an active billing period.</li>
          <li>Issues caused by missing Meta permissions, unsupported account type, revoked access, or third-party platform restrictions.</li>
          <li>Suspension or termination caused by misuse, spam, prohibited content, or violation of our Terms of Service.</li>
          <li>Custom setup, consultation, onboarding, or implementation services that have already been delivered.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">6. Refund Request Window</h2>
        <p>
          Refund requests must be raised within 7 calendar days of the relevant payment date. Requests submitted after this period may be declined unless required by applicable law.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">7. Processing Timeline</h2>
        <p>
          Approved refunds are initiated to the original payment method within 7 business days. The final credit timeline depends on the payment gateway, bank, UPI provider, or card issuer.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">8. Contact</h2>
        <p>
          For cancellation, billing, or refund requests, contact support@automixa.in with your registered email, invoice or payment ID, plan name, payment date, and a short explanation of the issue.
        </p>
      </section>
    </LegalLayout>
  );
}
