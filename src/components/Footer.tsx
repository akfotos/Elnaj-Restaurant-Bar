import Link from "next/link";
import { getSetting } from "@/lib/settings";

export default async function Footer() {
  const address = await getSetting("pickupAddress");
  return (
    <footer className="elnaj-footer footer-simple">
      <div className="dining-container footer-grid">
        <div><Link href="/" className="footer-wordmark">Elnaj<span>Restaurant &amp; Bar</span></Link>{address && <p className="footer-address">{address}</p>}</div>
        <div><h2>Explore</h2><ul><li><Link href="/menu">The menu</Link></li><li><Link href="/about">About Elnaj</Link></li></ul></div>
        <div><h2>Here to help</h2><ul><li><Link href="/support">Contact us</Link></li><li><Link href="/track">Track an order</Link></li><li><Link href="/faq">Delivery &amp; pickup</Link></li><li><Link href="/policies">Guest guide</Link></li></ul></div>
      </div>
      <div className="dining-container footer-bottom"><p>© {new Date().getFullYear()} Elnaj Restaurant &amp; Bar</p><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
    </footer>
  );
}
