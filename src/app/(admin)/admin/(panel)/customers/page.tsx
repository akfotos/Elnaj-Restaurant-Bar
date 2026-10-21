import { db } from "@/lib/db";
import { money } from "@/lib/format";
import RoleSelect from "@/components/admin/RoleSelect";

export const dynamic = "force-dynamic";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const { q = "" } = await searchParams;
  const users = await db.user.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : {},
    include: { _count: { select: { orders: true } }, orders: { select: { total: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers &amp; staff</h1>
      <form className="mb-6">
        <input name="q" defaultValue={q} placeholder="Search name or email…" className="bg-ink-800 border border-black/10 rounded-lg px-3 py-2 text-sm w-72" />
      </form>
      <div className="bg-ink-800 border border-black/10 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-stone-500 border-b border-black/10">
            <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Orders</th><th className="p-3 text-right">Lifetime value</th><th className="p-3">Role</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-black/5 last:border-0">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-stone-500">{u.email}</td>
                <td className="p-3">{u._count.orders}</td>
                <td className="p-3 text-right">{money(u.orders.reduce((s, o) => s + o.total, 0))}</td>
                <td className="p-3"><RoleSelect userId={u.id} role={u.role} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
