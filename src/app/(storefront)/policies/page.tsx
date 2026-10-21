import Link from "next/link";
import DiningHero from "@/components/DiningHero";
import DiningInvitation from "@/components/DiningInvitation";

export const metadata = { title: "Guest Guide & Policies | Elnaj" };

export default function PoliciesPage() {
  return (
    <div className="dining-editorial">
      <DiningHero eyebrow="Guest guide & policies" title="The little details." accent="For peace of mind." description="Find the information you need before ordering, all in one place." image="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=85" imageAlt="Grilled dishes served with fresh accompaniments" />
      <section className="dining-container policies-content"><p className="dining-eyebrow">Our guidance, clearly explained</p><h2>A thoughtful meal starts<br /><em>with the right information.</em></h2><p className="dining-copy">These links take you to Elnaj’s ordering information and existing policies. For a question about your circumstances, speak to our team before placing an order.</p><div className="policy-grid">
        {[
          { title: "Delivery & pickup", text: "Check delivery zones, collection options and ordering information.", href: "/faq", label: "Read the FAQs" },
          { title: "Ingredients & dietary needs", text: "Review each dish’s ingredients and allergen information. For an allergy question, contact our team before ordering.", href: "/support", label: "Ask about a dish" },
          { title: "Orders, payments & refunds", text: "Read the terms that apply to placing an order, payment, cancellations and refund requests.", href: "/terms", label: "Terms of service" },
          { title: "Your privacy", text: "Understand how personal information is handled when you use the website.", href: "/privacy", label: "Privacy & cookies" },
        ].map((item, index) => <Link href={item.href} key={item.href} className="policy-card"><span className="journey-number">0{index + 1}</span><h3>{item.title}</h3><p className="dining-copy">{item.text}</p><span className="dining-text-link">{item.label} <span aria-hidden="true">↗</span></span></Link>)}
      </div></section>
      <DiningInvitation />
    </div>
  );
}
