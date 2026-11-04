import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getSetting } from "@/lib/settings";
import CartButton from "@/components/CartButton";
import MobileMenu from "@/components/MobileMenu";
import HeaderNav from "@/components/HeaderNav";

export default async function Header() {
  const user = await getSessionUser().catch(() => null);
  const announcement = await getSetting("announcement").catch(() => "");
  return (
    <header id="top" tabIndex={-1} className="site-header">
      {announcement && <div className="site-header-announcement">{announcement}</div>}
      <div className="site-header-inner">
        <Link href="/" className="site-wordmark" aria-label="Elnaj Restaurant & Bar — home">
          <span className="site-wordmark-name">elnaj<span aria-hidden="true">.</span></span>
          <span className="site-wordmark-caption">Restaurant &amp; Bar</span>
        </Link>
        <HeaderNav />
        <div className="site-header-actions">
          <Link href="/menu" className="site-header-menu-link">Menu</Link>
          <CartButton />
          <div className="site-header-account">
            {user && user.role !== "CUSTOMER" && <Link href="/admin">Admin</Link>}
            <Link href={user ? "/account" : "/login"}>{user ? "My account" : "Sign in"}</Link>
          </div>
          <Link href="/reservation" className="site-header-booking">Book a table <span aria-hidden="true">↗</span></Link>
          <MobileMenu signedIn={!!user} isAdmin={!!user && user.role !== "CUSTOMER"} name={user?.name.split(" ")[0]} />
        </div>
      </div>
    </header>
  );
}
