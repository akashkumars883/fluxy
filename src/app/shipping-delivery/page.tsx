import LegalLayout from "@/components/marketing/LegalLayout";

export const metadata = {
  title: "Shipping & Digital Delivery Policy | Automixa",
  description: "Read Automixa's shipping and digital delivery policy for SaaS subscriptions, digital products, invoices, and account access.",
  alternates: {
    canonical: "https://automixa.in/shipping-delivery",
  },
};

export default function ShippingDeliveryPolicy() {
  return (
    <LegalLayout title="Shipping & Digital Delivery Policy" lastUpdated="June 5, 2026">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">1. Digital-Only Services</h2>
        <p>
          Automixa primarily provides digital SaaS subscriptions and online software tools. No physical goods are shipped for standard Automixa subscriptions.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">2. Subscription Activation</h2>
        <p>
          Paid subscription access is normally activated automatically after successful payment verification. In most cases, access appears in the Automixa dashboard immediately or within a few minutes.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">3. Digital Product Delivery</h2>
        <p>
          If a customer purchases a digital item through an Automixa-powered checkout page, delivery may happen by email, dashboard access, or a configured download link after payment confirmation.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground tracking-normal">4. Delivery Issues</h2>
        <p>
          If your subscription or digital delivery is not available after a successful payment, contact support@automixa.in with your registered email and payment ID. We will investigate and help restore access or process the request according to our refund policy.
        </p>
      </section>
    </LegalLayout>
  );
}
