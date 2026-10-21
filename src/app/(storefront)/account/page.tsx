import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { money } from "@/lib/format";
import LogoutButton from "@/components/LogoutButton";
import ReorderButton from "@/components/ReorderButton";
import AddressForm from "@/components/AddressForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const [orders, addresses, wishlist] = await Promise.all([
    db.order.findMany({ where: { userId: user.id }, include: { items: true }, orderBy: { createdAt: "desc" } }),
    db.address.findMany({ where: { userId: user.id } }),
    db.wishlistItem.findMany({ where: { userId: user.id }, include: { product: true } }),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-stone-500">{user.email}{user.phone ? ` · ${user.phone}` : ""}</p>
        </div>
        <LogoutButton />
      </div>

      <section>
        <h2 className="text-lg font-bold mb-3">Order history</h2>
        {orders.length === 0 && <p className="text-sm text-stone-500">No orders yet. <Link href="/menu" className="text-brand-500">Browse the menu</Link>.</p>}
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="bg-ink-800 border border-black/10 rounded-xl p-4 flex flex-wrap items-center gap-4">
              <div>
                <Link href={`/track?order=${o.orderNumber}`} className="font-mono text-brand-500 font-semibold">{o.orderNumber}</Link>
                <p className="text-xs text-stone-500">{new Date(o.createdAt).toLocaleString()} · {o.fulfillment}</p>
              </div>
              <span className="text-xs bg-ink-700 border border-black/10 rounded-full px-3 py-1">{o.status.replace(/_/g, " ")}</span>
              <p className="text-sm text-stone-500">{o.items.length} item{o.items.length === 1 ? "" : "s"}</p>
              <p className="font-semibold ml-auto">{money(o.total)}</p>
              <ReorderButton items={o.items.map((i) => ({ productId: i.productId, variantName: i.variantName ?? undefined, quantity: i.quantity, unitPrice: i.unitPrice, name: i.nameSnapshot }))} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Saved addresses</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {addresses.map((a) => (
            <div key={a.id} className="bg-ink-800 border border-black/10 rounded-xl p-4 text-sm">
              <p className="font-medium">{a.label} {a.isDefault && <span className="text-xs text-brand-500">· default</span>}</p>
              <p className="text-stone-500">{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city} {a.postalCode}</p>
            </div>
          ))}
        </div>
        <AddressForm />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">Wishlist</h2>
        {wishlist.length === 0 && <p className="text-sm text-stone-500">Nothing saved yet.</p>}
        <div className="grid sm:grid-cols-3 gap-3">
          {wishlist.map((w) => (
            <Link key={w.id} href={`/product/${w.product.slug}`} className="bg-ink-800 border border-black/10 rounded-xl p-4 hover:border-brand-500">
              <p className="font-medium text-sm">{w.product.name}</p>
              <p className="text-brand-500 text-sm font-semibold mt-1">{money(w.product.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
