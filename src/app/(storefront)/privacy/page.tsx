export const metadata = { title: "Privacy & Cookies Policy" };

const Section = ({ n, title, children }: { n: string; title: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <h2 className="text-lg font-bold text-stone-800">{n}. {title}</h2>
    {children}
  </section>
);

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Privacy &amp; Cookies Policy</h1>
      <p className="text-sm text-stone-500 mb-10">Last updated: October 2025 · Elnaj Restaurant &amp; Bar ("Elnaj", "we", "us", "our")</p>

      <div className="space-y-8 text-sm text-stone-600 leading-relaxed">
        <Section n="1" title="Who we are">
          <p>
            Elnaj Restaurant &amp; Bar operates this website and online ordering service from Accra, Ghana.
            For the purposes of the Ghana Data Protection Act, 2012 (Act 843) and other applicable data
            protection laws, Elnaj is the <strong>data controller</strong> of the personal data collected
            through this website.
          </p>
          <p>
            You can reach our team about anything in this policy via the Contact page or at
            privacy@elnaj.com.
          </p>
        </Section>

        <Section n="2" title="Information we collect">
          <p>We collect the following categories of personal data:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Account data:</strong> name, email address, phone number, and password (stored only as a salted cryptographic hash — we never store your plaintext password).</li>
            <li><strong>Order data:</strong> items ordered, order notes, delivery instructions, fulfillment choice (delivery or pickup), preferred time slot, payment method selected, and order status history.</li>
            <li><strong>Delivery data:</strong> delivery addresses you save or enter at checkout, including street address, city, and postal/area code.</li>
            <li><strong>Guest checkout data:</strong> name, email, phone, and address provided without creating an account.</li>
            <li><strong>Social login data:</strong> if you sign in with Google or Apple, we receive your name, email address, and a unique identifier from that provider. We do not receive your provider password.</li>
            <li><strong>Support data:</strong> messages, refund requests, and correspondence you send us.</li>
            <li><strong>Reviews and wishlists:</strong> product reviews, ratings, and items you save to your wishlist.</li>
            <li><strong>Technical data:</strong> standard server logs (IP address, browser type, pages visited, timestamps) used for security and debugging.</li>
          </ul>
        </Section>

        <Section n="3" title="How we use your information">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To take, prepare, deliver, or fulfil your orders, including contacting you about availability, substitutions, or delays.</li>
            <li>To process payments, apply discounts and promo codes, issue refunds, and provide receipts.</li>
            <li>To operate your account: order history, saved addresses, reordering, and wishlists.</li>
            <li>To send order status notifications (confirmation, preparation, dispatch, delivery, cancellation).</li>
            <li>To respond to support requests and resolve disputes.</li>
            <li>To maintain the security and integrity of the service (fraud prevention, abuse detection, audit logging of administrative actions).</li>
            <li>To analyse aggregate, non-identifying trends (e.g. popular dishes, delivery times) to improve our menu and service.</li>
            <li>To comply with legal, tax, and accounting obligations.</li>
          </ul>
          <p>We do <strong>not</strong> use your data for automated decision-making that produces legal or similarly significant effects, and we do not sell personal data to anyone.</p>
        </Section>

        <Section n="4" title="Lawful bases for processing">
          <p>We process personal data on the following bases:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Contract:</strong> processing necessary to fulfil your orders and operate your account.</li>
            <li><strong>Legitimate interests:</strong> service improvement, security, fraud prevention, and keeping records of business transactions.</li>
            <li><strong>Legal obligation:</strong> tax records, food safety requirements, and responses to lawful requests by authorities.</li>
            <li><strong>Consent:</strong> optional features such as marketing communications, where introduced — you may withdraw consent at any time.</li>
          </ul>
        </Section>

        <Section n="5" title="Cookies and local storage">
          <p>We use a minimal set of storage technologies:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-black/10 rounded-lg">
              <thead className="bg-ink-700 text-left">
                <tr><th className="p-2.5">Name</th><th className="p-2.5">Type</th><th className="p-2.5">Purpose</th><th className="p-2.5">Duration</th></tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                <tr><td className="p-2.5 font-mono">elnaj_session</td><td className="p-2.5">Cookie (httpOnly)</td><td className="p-2.5">Keeps you signed in. Strictly necessary.</td><td className="p-2.5">30 days</td></tr>
                <tr><td className="p-2.5 font-mono">oauth_state_*</td><td className="p-2.5">Cookie (httpOnly)</td><td className="p-2.5">CSRF protection during Google/Apple sign-in. Strictly necessary.</td><td className="p-2.5">10 minutes</td></tr>
                <tr><td className="p-2.5 font-mono">elnaj-cart</td><td className="p-2.5">Local storage</td><td className="p-2.5">Remembers your shopping cart between visits.</td><td className="p-2.5">Until cleared</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            We do <strong>not</strong> use advertising cookies, third-party analytics trackers, or cross-site
            tracking pixels. If we introduce optional analytics or marketing cookies in future, we will ask
            for your consent first and update this policy. You can clear site data at any time through your
            browser settings; clearing the session cookie signs you out and clearing local storage empties
            your cart.
          </p>
        </Section>

        <Section n="6" title="Who we share your data with">
          <p>We share personal data only as needed to run the service:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Delivery personnel:</strong> your name, phone, address, and delivery notes for orders you place.</li>
            <li><strong>Payment providers:</strong> where online payments are enabled (e.g. Stripe or Paystack), card details are sent directly to the provider and tokenized — we never see or store full card numbers.</li>
            <li><strong>Identity providers:</strong> Google or Apple, only if you choose to sign in with them.</li>
            <li><strong>Hosting and infrastructure providers:</strong> who process data on our behalf under contract.</li>
            <li><strong>Authorities:</strong> where disclosure is required by law, court order, or to protect rights, safety, and property.</li>
          </ul>
          <p>Mobile Money payments are processed by the relevant network operator under their own privacy policies.</p>
        </Section>

        <Section n="7" title="Data retention">
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Account data:</strong> kept while your account is active; deleted or anonymized within 90 days of account deletion, except where law requires longer retention.</li>
            <li><strong>Order and transaction records:</strong> retained for up to 7 years to satisfy tax, accounting, and dispute-resolution obligations.</li>
            <li><strong>Guest checkout data:</strong> retained only as long as needed to fulfil the order and handle any follow-up, typically 12 months.</li>
            <li><strong>Support messages:</strong> retained for up to 24 months.</li>
            <li><strong>Server logs:</strong> retained for up to 90 days.</li>
          </ul>
        </Section>

        <Section n="8" title="How we protect your data">
          <p>
            We apply appropriate technical and organizational measures including HTTPS encryption in transit,
            hashed password storage, role-based access controls for staff, httpOnly session cookies, audit
            logging of administrative changes, and restricting personal data access to staff who need it for
            their role. No system is perfectly secure; if a breach occurs that is likely to affect you, we
            will notify you and the relevant authority as required by law.
          </p>
        </Section>

        <Section n="9" title="Your rights">
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Access</strong> the personal data we hold about you.</li>
            <li><strong>Correct</strong> inaccurate or incomplete data (you can update most details yourself on the Account page).</li>
            <li><strong>Delete</strong> your account and personal data, subject to legal retention requirements.</li>
            <li><strong>Export</strong> your data in a portable, commonly used format.</li>
            <li><strong>Object</strong> to processing based on legitimate interests, or withdraw consent where processing is based on consent.</li>
            <li><strong>Complain</strong> to the Data Protection Commission of Ghana if you believe your rights have been infringed.</li>
          </ul>
          <p>To exercise any of these rights, contact us via the Support page. We respond within 30 days.</p>
        </Section>

        <Section n="10" title="Children">
          <p>
            Our service is not directed at children under 16, and we do not knowingly collect their personal
            data. Age-restricted products (alcoholic beverages) additionally require the purchaser to be 18
            or older with valid ID at the point of delivery or pickup. If you believe a child has provided us
            personal data, contact us and we will delete it.
          </p>
        </Section>

        <Section n="11" title="International transfers">
          <p>
            Your data is primarily processed in Ghana. Some service providers (hosting, payment processing,
            Google/Apple sign-in) may process data in other countries. Where this happens, we rely on the
            provider's contractual safeguards to protect your data to a standard consistent with this policy.
          </p>
        </Section>

        <Section n="12" title="Changes to this policy">
          <p>
            We may update this policy from time to time. Material changes will be announced on this page with
            an updated "last updated" date; significant changes may also be announced via the site banner or
            email. Continued use of the service after changes take effect constitutes acceptance.
          </p>
        </Section>

        <Section n="13" title="Contact">
          <p>
            Questions, requests, or complaints about this policy or your data: use the{" "}
            <a href="/support" className="text-brand-500 hover:underline">Contact page</a>, or write to
            Elnaj Restaurant &amp; Bar, 12 Osu Oxford Street, Accra, Ghana · privacy@elnaj.com.
          </p>
        </Section>
      </div>
    </div>
  );
}
