export const metadata = { title: "Terms of Service" };

const Section = ({ n, title, children }: { n: string; title: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <h2 className="text-lg font-bold text-stone-800">{n}. {title}</h2>
    {children}
  </section>
);

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-stone-500 mb-10">Last updated: October 2025 · Elnaj Restaurant &amp; Bar</p>

      <div className="space-y-8 text-sm text-stone-600 leading-relaxed">
        <Section n="1" title="Agreement">
          <p>
            These Terms of Service ("Terms") govern your use of the Elnaj Restaurant &amp; Bar website and
            online ordering service (the "Service"), operated by Elnaj Restaurant &amp; Bar ("Elnaj", "we",
            "us"), located at 12 Osu Oxford Street, Accra, Ghana. By browsing the site, placing an order, or
            creating an account, you agree to these Terms and our{" "}
            <a href="/privacy" className="text-brand-500 hover:underline">Privacy &amp; Cookies Policy</a>.
            If you do not agree, please do not use the Service.
          </p>
        </Section>

        <Section n="2" title="The Service">
          <p>
            Elnaj provides an online platform to browse our menu, place orders for prepared food and
            beverages, and choose delivery to supported zones or pickup at our restaurant. We prepare and
            fulfil orders ourselves. Product images are representative; actual presentation may vary.
          </p>
        </Section>

        <Section n="3" title="Accounts">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>You may order as a guest or create an account. Account holders are responsible for keeping their credentials confidential and for all activity under their account.</li>
            <li>You must provide accurate information (name, contact details, delivery address). Notify us promptly of unauthorized account use.</li>
            <li>You may sign in with Google or Apple; doing so authorizes us to receive your name and email from that provider.</li>
            <li>We may suspend or terminate accounts that violate these Terms, are used fraudulently, or abuse staff, couriers, or promotions.</li>
          </ul>
        </Section>

        <Section n="4" title="Orders and acceptance">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Placing an order is an offer to purchase; a contract forms when we confirm the order (status "Confirmed"). We may decline or cancel orders, for example due to unavailability, suspected fraud, or address errors, and will notify you and refund any payment taken.</li>
            <li>All orders are subject to availability. If an item becomes unavailable after ordering, we will contact you to offer a substitution of similar value, remove the item, or refund it.</li>
            <li>Weight-based items (sold per kg/litre) are priced per unit; the charged total reflects the quantity you select. Minor variance in actual weight may occur.</li>
            <li>Please review your order carefully — modifications after confirmation cannot be guaranteed.</li>
          </ul>
        </Section>

        <Section n="5" title="Pricing, taxes, and fees">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Prices are shown in Ghana Cedis (GHS) and include applicable taxes unless stated otherwise.</li>
            <li>Delivery fees depend on your zone and are shown before checkout; minimum-order rules may apply per zone.</li>
            <li>Promo codes are subject to conditions (minimum spend, expiry, usage limits, delivery-fee-only) and cannot be combined unless stated. We may cancel codes obtained or used fraudulently.</li>
            <li>We may change prices at any time; confirmed orders are honoured at the confirmed price.</li>
          </ul>
        </Section>

        <Section n="6" title="Payment">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>We accept cash on delivery/pickup, Mobile Money, and card payment on arrival. Where online card payment is enabled, payments are processed by our payment provider; we never store full card details.</li>
            <li>By providing a payment method you confirm you are authorized to use it. If a payment fails or is reversed, we may cancel or suspend the order.</li>
            <li>A receipt is provided on the order confirmation page and via your account order history.</li>
          </ul>
        </Section>

        <Section n="7" title="Delivery and pickup">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Delivery is available within zones shown at checkout. Estimated times (typically 30–60 minutes) are good-faith estimates, not guarantees, and may be affected by traffic, weather, or order volume.</li>
            <li>Scheduled time slots are subject to capacity; we will contact you if a slot cannot be met.</li>
            <li>You (or someone at the address) must be available to receive the order. If delivery fails because the address was wrong or no one responded, we may charge for redelivery or treat the order as completed.</li>
            <li>Delivery instructions (gate codes, landmarks, "leave at door") are followed at your risk. Proof of delivery may be recorded where appropriate.</li>
            <li>Pickup orders are held for a reasonable window; uncollected orders may be discarded without refund after the pickup day ends.</li>
          </ul>
        </Section>

        <Section n="8" title="Age-restricted products">
          <p>
            Alcoholic beverages (e.g. palm wine, cocktails) are sold only to persons aged 18 or older. By
            ordering them you confirm you are of legal age. Our courier or staff will request valid photo ID
            on delivery or pickup and may refuse handover without it — in that case the restricted items are
            refunded and the rest of the order proceeds where possible.
          </p>
        </Section>

        <Section n="9" title="Food information, allergens, and dietary labels">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Ingredient lists, allergen warnings, and nutrition values are provided in good faith for guidance. Kitchens handle common allergens (nuts, gluten, dairy, fish, sesame, eggs) and cross-contamination cannot be fully excluded.</li>
            <li><strong>If you have a severe allergy, tell us in the order notes or contact us before ordering.</strong> Dietary labels (vegan, halal, gluten-free, etc.) describe the recipe, not a certified guarantee.</li>
            <li>Spice levels are subjective and provided as a guide only.</li>
            <li>Perishable items should be consumed promptly and stored per the storage notes on each product page.</li>
          </ul>
        </Section>

        <Section n="10" title="Cancellations, refunds, and complaints">
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>You may cancel</strong> free of charge while the order status is "Pending". Once preparation begins, cancellation may incur a charge up to the full order value.</li>
            <li><strong>Refund eligibility:</strong> undelivered orders, incorrect items, items not as described, or quality issues reported promptly (same day for food quality) are eligible for full or partial refund, replacement, or credit at our discretion.</li>
            <li><strong>Non-refundable:</strong> change of mind after preparation; issues caused by incorrect address/instructions you provided; perishables returned after acceptance except for quality issues.</li>
            <li>Approved refunds go to the original payment method within 5–10 business days (longer for Mobile Money depending on the operator). Refund requests are handled via the Support page — include your order number.</li>
          </ul>
        </Section>

        <Section n="11" title="Reviews and content you submit">
          <p>
            By posting reviews or messages you grant us a non-exclusive, royalty-free licence to display that
            content on the Service. Do not submit content that is unlawful, defamatory, or infringes others'
            rights. We may remove content at our discretion.
          </p>
        </Section>

        <Section n="12" title="Acceptable use">
          <p>You agree not to: misuse the Service; attempt unauthorized access; scrape or overload it; place fraudulent orders; resell the Service; or use it in violation of any law. Breach may result in suspension and, where appropriate, referral to authorities.</p>
        </Section>

        <Section n="13" title="Intellectual property">
          <p>
            All content on the Service — branding, text, menu descriptions, design, and software — is owned
            by or licensed to Elnaj and protected by law. You may not copy or reuse it without permission.
            Some product photographs are sourced from Wikimedia Commons under their respective licences.
          </p>
        </Section>

        <Section n="14" title="Liability">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>The Service is provided "as is". We do not warrant uninterrupted or error-free operation.</li>
            <li>Nothing in these Terms limits liability for death or personal injury caused by negligence, fraud, or any liability that cannot be excluded by law.</li>
            <li>Otherwise, our total liability for any claim relating to an order is limited to the amount you paid for that order. We are not liable for indirect or consequential losses.</li>
            <li>We are not responsible for failures caused by events beyond our reasonable control (force majeure): outages, strikes, severe weather, network/provider failures, or emergencies.</li>
          </ul>
        </Section>

        <Section n="15" title="Governing law and disputes">
          <p>
            These Terms are governed by the laws of the Republic of Ghana. We aim to resolve complaints
            informally first — contact us via the Support page. Unresolved disputes may be brought before the
            courts of Ghana, and nothing in these Terms removes statutory consumer rights you may have.
          </p>
        </Section>

        <Section n="16" title="Changes and general terms">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>We may update these Terms; the current version is always on this page. Material changes will be signposted in advance where practicable.</li>
            <li>If any provision is found unenforceable, the rest of the Terms remain in effect. Our failure to enforce a right is not a waiver.</li>
            <li>You may not transfer your account; we may assign these Terms in connection with a business transfer.</li>
          </ul>
          <p className="pt-2">Questions about these Terms: <a href="/support" className="text-brand-500 hover:underline">Contact us</a>.</p>
        </Section>
      </div>
    </div>
  );
}
