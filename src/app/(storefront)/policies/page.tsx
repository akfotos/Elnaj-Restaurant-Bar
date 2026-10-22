import Link from "next/link";
import DiningHero from "@/components/DiningHero";
import DiningInvitation from "@/components/DiningInvitation";

export const metadata = { title: "Guest Guide & Policies" };

export default function PoliciesPage() {
  return (
    <div className="dining-editorial">
      <DiningHero eyebrow="Guest guide & policies" title="Plan with confidence." accent="Know where to look." description="A simple guide to Elnaj’s ordering information, table requests, dietary guidance and website policies." image="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=85" imageAlt="Grilled dishes served with fresh accompaniments" />
      <section className="dining-container policies-content"><p className="dining-eyebrow">Our guidance, clearly explained</p><h2>Find the right information.</h2><p className="dining-copy">Use the FAQs for everyday questions, our terms for ordering conditions, and the privacy policy for how personal information is handled. If your plans need a personal answer, speak to our team before ordering or visiting.</p><div className="policy-grid">
        {[
          { title: "Ordering & visiting", text: "How delivery and pickup work, how to request a table, and what to check before placing an order.", href: "/faq", label: "Read the FAQs" },
          { title: "Ingredients & dietary needs", text: "Review each dish’s ingredients and allergen information. For an allergy question, contact our team before ordering.", href: "/support", label: "Ask about a dish" },
          { title: "Orders, payments & refunds", text: "Read the terms that apply to placing an order, payment, cancellations and refund requests.", href: "/terms", label: "Terms of service" },
          { title: "Your privacy", text: "Understand how personal information is handled when you use the website.", href: "/privacy", label: "Privacy & cookies" },
        ].map((item, index) => <Link href={item.href} key={item.href} className="policy-card"><span className="journey-number">0{index + 1}</span><h3>{item.title}</h3><p className="dining-copy">{item.text}</p><span className="dining-text-link">{item.label} <span aria-hidden="true">↗</span></span></Link>)}
      </div></section>
      <DiningInvitation />
    </div>
  );
}
