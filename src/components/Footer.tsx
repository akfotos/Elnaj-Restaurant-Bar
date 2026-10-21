import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-ink-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm text-stone-500">
        <div>
          <p className="text-lg font-bold text-stone-900"><span className="text-brand-500">Elnaj</span> Restaurant &amp; Bar</p>
          <p className="mt-2">Fresh dishes, grills and drinks delivered to your door or ready for pickup.</p>
        </div>
        <div>
          <p className="font-semibold text-stone-800 mb-2">Order</p>
          <ul className="space-y-1">
            <li><Link href="/menu" className="hover:text-brand-500">Menu</Link></li>
            <li><Link href="/track" className="hover:text-brand-500">Track order</Link></li>
            <li><Link href="/cart" className="hover:text-brand-500">Cart</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-stone-800 mb-2">Help</p>
          <ul className="space-y-1">
            <li><Link href="/support" className="hover:text-brand-500">Contact us</Link></li>
            <li><Link href="/faq" className="hover:text-brand-500">FAQ &amp; delivery info</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-stone-800 mb-2">Legal</p>
          <ul className="space-y-1">
            <li><Link href="/privacy" className="hover:text-brand-500">Privacy &amp; cookies</Link></li>
            <li><Link href="/terms" className="hover:text-brand-500">Terms</Link></li>
          </ul>
        </div>
      </div>
      <p className="text-center text-xs text-stone-500 pb-6">© {new Date().getFullYear()} Elnaj Restaurant &amp; Bar</p>
    </footer>
  );
}
