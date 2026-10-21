import Link from "next/link";

export default function DiningInvitation() {
  return (
    <section className="dining-invitation">
      <div><p className="dining-eyebrow">A little help from our team</p><h2>Let’s make it <em>your kind of meal.</em></h2><p>Questions about a dish, dietary needs or an existing order? Start a conversation with Elnaj.</p></div>
      <Link href="/support" className="dining-button dining-button-outline">Get in touch <span aria-hidden="true">↗</span></Link>
    </section>
  );
}
