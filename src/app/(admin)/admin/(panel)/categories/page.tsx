import { db } from "@/lib/db";
import { upsertCategory } from "@/lib/admin-actions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await db.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { sortOrder: "asc" } });
  const input = "bg-ink-800 border border-black/10 rounded-lg px-3 py-2 text-sm";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <form
        action={async (fd) => {
          "use server";
          await upsertCategory({ name: String(fd.get("name")), description: String(fd.get("description") ?? ""), sortOrder: +(fd.get("sortOrder") ?? 0) });
          revalidatePath("/admin/categories");
        }}
        className="flex gap-3 mb-6"
      >
        <input name="name" required placeholder="New category name" className={input} />
        <input name="description" placeholder="Description" className={`${input} flex-1`} />
        <input name="sortOrder" type="number" defaultValue={0} className={`${input} w-20`} />
        <button className="bg-brand-500 text-ink-900 text-sm font-semibold rounded-lg px-4">Add</button>
      </form>
      <div className="bg-ink-800 border border-black/10 rounded-xl">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-4 p-4 border-b border-black/5 last:border-0 text-sm">
            <p className="font-medium">{c.name}</p>
            <p className="text-stone-500 flex-1">{c.description}</p>
            <p className="text-stone-500">{c._count.products} products · order {c.sortOrder}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
