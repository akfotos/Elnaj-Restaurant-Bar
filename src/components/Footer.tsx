import Link from "next/link";
import { getSetting } from "@/lib/settings";

export default async function Footer() {
  const address = await getSetting("pickupAddress");
  return (
    <footer className="elnaj-footer">
      <div className="dining-container footer-top"><div><p className="dining-eyebrow">Good food. Great company.</p><Link href="/" className="footer-wordmark">Elnaj<span>Restaurant &amp; Bar</span></Link><p>Local favourites, bold grills and something worth sipping. Enjoy a little Elnaj, your way.</p></div><Link href="/menu" className="dining-button dining-button-outline">Discover the menu <span aria-hidden="true">↗</span></Link></div>
      <div className="dining-container footer-grid">
        <div><h2>Explore</h2><ul><li><Link href="/about">About Elnaj</Link></li><li><Link href="/food">Food menu</Link></li><li><Link href="/drinks">Drinks &amp; bar</Link></li><li><Link href="/food?category=desserts">Something sweet</Link></li></ul></div>
        <div><h2>Your order</h2><ul><li><Link href="/cart">Your basket</Link></li><li><Link href="/track">Track an order</Link></li><li><Link href="/account">Your account</Link></li><li><Link href="/faq">Delivery &amp; pickup</Link></li></ul></div>
        <div><h2>Let’s talk</h2><ul><li><Link href="/support">Contact &amp; enquiries</Link></li><li><Link href="/policies">Guest guide &amp; policies</Link></li></ul>{address && <div className="footer-address"><h2>Pickup address</h2><p>{address}</p></div>}</div>
        <div><h2>A little guidance</h2><p>Have a dietary question or a special request? Contact our team before ordering.</p><Link href="/support" className="footer-contact-link">Start a conversation <span aria-hidden="true">↗</span></Link></div>
      </div>
      <div className="dining-container footer-bottom"><p>© {new Date().getFullYear()} Elnaj Restaurant &amp; Bar</p><div><Link href="/privacy">Privacy &amp; cookies</Link><Link href="/terms">Terms of service</Link><a href="#top">Back to top ↑</a></div></div>
    </footer>
  );
}
