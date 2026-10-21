import Link from "next/link";
import DiningHero from "@/components/DiningHero";
import DiningInvitation from "@/components/DiningInvitation";

export const metadata = { title: "FAQ & Delivery Info" };

const FAQS = [
  { q: "Where do you deliver?", a: "We deliver within the zones listed at checkout. Enter your postal/area code to see fees and estimated times." },
  { q: "How long does delivery take?", a: "Typically 30–60 minutes depending on your zone and order size. You can also choose a scheduled time slot." },
  { q: "Can I pick up my order?", a: "Yes — choose Pickup at checkout and collect from our restaurant. We'll notify you when it's ready." },
  { q: "What payment methods do you accept?", a: "Cash on delivery/pickup, Mobile Money, and card payments. Online card payments via Stripe/Paystack coming soon." },
  { q: "How do I report a problem with my order?", a: "Use the Contact page with your order number, or request a refund — our team responds within 24 hours." },
  { q: "Do you cater for allergies and dietary needs?", a: "Each dish lists ingredients, allergen warnings and dietary labels (vegan, halal, gluten-free etc.). Add a note at checkout for special requests." },
];

export default function FaqPage() {
  return (
    <div className="dining-editorial">
      <DiningHero eyebrow="Good to know" title="A few little details." accent="A smoother experience." description="Your guide to ordering, delivery, pickup and dietary questions at Elnaj." image="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=85" imageAlt="A spread of grilled food ready to share" />
      <div className="dining-container faq-layout">
      <aside><p className="dining-eyebrow">Before your first bite</p><h2>Good questions.<br /><em>Helpful answers.</em></h2><p className="dining-copy">A little planning makes a good meal even better. Find the essentials here, or ask our team.</p><Link href="/support" className="dining-text-link">Ask a question <span aria-hidden="true">↗</span></Link></aside>
      <div className="dining-faq-list">
        {FAQS.map((f) => (
          <details key={f.q} className="bg-ink-800 border border-black/10 rounded-xl p-4 group">
            <summary className="font-medium cursor-pointer group-open:text-brand-500">{f.q}</summary>
            <p className="text-sm text-stone-500 mt-2">{f.a}</p>
          </details>
        ))}
      </div>
      </div>
      <DiningInvitation />
    </div>
  );
}
