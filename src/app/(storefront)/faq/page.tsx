import Link from "next/link";
import DiningHero from "@/components/DiningHero";
import DiningInvitation from "@/components/DiningInvitation";

export const metadata = { title: "FAQ & Delivery Info" };

const FAQS = [
  { q: "How do I book a table?", a: "Use Book a table to submit your preferred date, time and party size. This sends a request for staff review, not a confirmed booking. Please wait for our team to contact you and confirm availability. Reservation times are in Accra local time (GMT)." },
  { q: "Where do you deliver?", a: "We deliver within the zones listed at checkout. Enter your postal/area code to see fees and estimated times." },
  { q: "How long does delivery take?", a: "Delivery estimates depend on your zone, order and restaurant activity. Check the zone estimate shown at checkout and use order tracking for the latest recorded progress. Preferred times are requests, not guaranteed arrival times." },
  { q: "Can I pick up my order?", a: "Choose Pickup when it is available at checkout. The collection address is shown there. Check your order status and collect only once the team marks it ready; submitting an order does not mean it is ready immediately." },
  { q: "How do payments work?", a: "Choose one of the methods shown at checkout. This website records your selection but does not collect an online payment. Arrange payment with the restaurant using your selected method, and contact us if you are unsure." },
  { q: "How do I report a problem with my order?", a: "Use the Contact page, include your order number and explain what needs attention. For a change or refund request, provide the relevant details so staff can review it. Sending a message does not automatically cancel or refund an order." },
  { q: "What should I do about allergies or dietary needs?", a: "Expand a dish’s ingredients and dietary information on the Menu page, or open its details. Labels describe the recipe, not a certified guarantee against cross-contact. Contact the team before ordering if you have an allergy or a requirement that needs confirmation." },
  { q: "Can I download the menu?", a: "Yes. Choose Download full menu (PDF) on the Menu page. The PDF includes the complete active food and drinks menu, not just your filtered results. Prices and availability can change, so check the website again before ordering." },
];

export default function FaqPage() {
  return (
    <div className="dining-editorial">
      <DiningHero eyebrow="Frequently asked questions" title="Before you order." accent="The useful details." description="Find answers about table requests, delivery, pickup, payments, dietary needs and using the Elnaj website." image="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=85" imageAlt="A spread of grilled food ready to share" />
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
