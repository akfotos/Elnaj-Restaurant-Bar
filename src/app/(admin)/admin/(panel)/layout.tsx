import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import LogoutButton from "@/components/LogoutButton";

const NAV = [
  ["Overview", "/admin"],
  ["Orders", "/admin/orders"],
  ["Reservations", "/admin/reservations"],
  ["Products", "/admin/products"],
  ["Categories", "/admin/categories"],
  ["Coupons", "/admin/coupons"],
  ["Customers", "/admin/customers"],
  ["Delivery", "/admin/delivery"],
  ["Support", "/admin/support"],
  ["Audit Log", "/admin/audit"],
  ["Settings", "/admin/settings"],
];

// Internal operations workspace — deliberately dark/neutral and high-density,
// completely separate theme from the burgundy/white customer storefront.
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  if (!user) redirect("/admin/login");

  const pending = await db.order.count({ where: { status: { in: ["PENDING", "CONFIRMED"] } } });

  return (
    <div className="admin-dark min-h-screen bg-[#12100e] text-stone-200 flex flex-col lg:flex-row">
      <aside className="lg:w-52 shrink-0 lg:border-r border-b lg:border-b-0 border-white/10 bg-[#171412] lg:min-h-screen lg:sticky lg:top-0 self-start w-full">
        <div className="px-4 py-4 border-b border-white/10">
          <Link href="/admin" className="font-bold tracking-tight">
            <span className="text-brand-400">Elnaj</span> <span className="text-stone-400 font-medium">Staff</span>
          </Link>
        </div>
        <nav className="flex lg:flex-col gap-1 text-sm overflow-x-auto px-3 py-3 lg:py-4">
          {NAV.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-stone-400 hover:bg-white/5 hover:text-white transition"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:block px-4 py-4 border-t border-white/10 text-xs text-stone-500">
          {user.name} · {user.role.toLowerCase()}
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-[#171412]/90 backdrop-blur border-b border-white/10 px-4 sm:px-6 py-3 flex items-center gap-3">
          <p className="text-sm font-medium">
            {pending > 0 ? (
              <span className="inline-flex items-center gap-2 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {pending} order{pending === 1 ? "" : "s"} awaiting action
              </span>
            ) : (
              <span className="text-emerald-400">All orders clear</span>
            )}
          </p>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/" className="text-xs text-stone-500 hover:text-stone-300">View storefront</Link>
            <span className="text-xs text-stone-500 lg:hidden">{user.name.split(" ")[0]} · {user.role.toLowerCase()}</span>
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
