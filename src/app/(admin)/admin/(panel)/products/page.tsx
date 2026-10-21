import Link from "next/link";
import { db } from "@/lib/db";
import { money } from "@/lib/format";
import StockAdjuster from "@/components/admin/StockAdjuster";

export const dynamic = "force-dynamic";

export default async function AdminProducts({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const { q = "", category = "" } = await searchParams;
  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: { isActive: true, ...(q ? { name: { contains: q } } : {}), ...(category ? { category: { slug: category } } : {}) },
      include: { category: true, variants: true },
      orderBy: { name: "asc" },
    }),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="bg-brand-500 text-ink-900 text-sm font-bold rounded-full px-5 py-2">+ New product</Link>
      </div>
      <form className="flex gap-3 mb-6">
        <input name="q" defaultValue={q} placeholder="Search…" className="bg-ink-800 border border-black/10 rounded-lg px-3 py-2 text-sm w-64" />
        <select name="category" defaultValue={category} className="bg-ink-800 border border-black/10 rounded-lg px-3 py-2 text-sm">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <button className="bg-ink-700 text-sm rounded-lg px-4 border border-black/15">Filter</button>
      </form>
      <div className="bg-ink-800 border border-black/10 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-stone-500 border-b border-black/10">
            <tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3 text-right">Price</th><th className="p-3 text-right">Stock</th><th className="p-3">Flags</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0">
                <td className="p-3 font-medium"><Link href={`/admin/products/${p.id}`} className="hover:text-brand-500">{p.name}</Link></td>
                <td className="p-3 text-stone-500">{p.category.name}</td>
                <td className="p-3 text-right">{money(p.price)}</td>
                <td className="p-3 text-right">
                  {p.trackStock ? (
                    <span className={p.stock <= 5 ? "text-amber-600" : ""}>{p.stock}</span>
                  ) : <span className="text-stone-500">∞</span>}
                  <StockAdjuster productId={p.id} />
                </td>
                <td className="p-3 text-xs text-stone-500">{[p.isFeatured && "featured", p.isBestseller && "bestseller", p.isSeasonal && "seasonal", p.compareAtPrice && "sale"].filter(Boolean).join(" · ")}</td>
                <td className="p-3"><Link href={`/admin/products/${p.id}`} className="text-brand-500 text-xs">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
