import Link from "next/link";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, featured, bestsellers, seasonal] = await Promise.all([
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.product.findMany({ where: { isActive: true, isFeatured: true }, take: 4 }),
    db.product.findMany({ where: { isActive: true, isBestseller: true }, take: 4 }),
    db.product.findMany({ where: { isActive: true, isSeasonal: true }, take: 4 }),
  ]);
  const deals = await db.product.findMany({
    where: { isActive: true, compareAtPrice: { not: null } },
    take: 4,
  });

  return (
    <div>
      <section className="relative bg-gradient-to-br from-brand-50 via-ink-900 to-ink-800 border-b border-black/10">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <p className="animate-fade-up text-brand-500 font-semibold tracking-widest uppercase text-sm">Elnaj Restaurant &amp; Bar</p>
          <h1 className="animate-fade-up mt-3 text-4xl md:text-6xl font-bold max-w-2xl leading-tight" style={{ animationDelay: "80ms" }}>
            Bold flavors, delivered hot to your door.
          </h1>
          <p className="animate-fade-up mt-4 text-stone-500 max-w-xl" style={{ animationDelay: "160ms" }}>
            Grills, local favorites, small chops and signature cocktails — order for delivery or pickup in minutes.
          </p>
          <div className="animate-fade-up mt-8 flex gap-4" style={{ animationDelay: "240ms" }}>
            <Link href="/menu" className="btn-press bg-brand-500 text-ink-900 font-bold rounded-full px-6 py-3 hover:bg-brand-600">
              Order Now
            </Link>
            <Link href="/track" className="btn-press border border-black/20 rounded-full px-6 py-3 hover:border-brand-500">
              Track Order
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-12">
        <Reveal><h2 className="text-xl font-bold mb-4">Browse Categories</h2></Reveal>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={c.slug === "drinks" ? "/drinks" : `/food?category=${c.slug}`}
              className="whitespace-nowrap bg-ink-800 border border-black/10 rounded-full px-5 py-2.5 text-sm hover:border-brand-500 hover:text-brand-500"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {[
        { title: "Featured", items: featured },
        { title: "Bestsellers", items: bestsellers },
        { title: "Deals & Promotions", items: deals },
        { title: "Seasonal Specials", items: seasonal },
      ].map(
        (s) =>
          s.items.length > 0 && (
            <section key={s.title} className="max-w-6xl mx-auto px-4 mt-14">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{s.title}</h2>
                <Link href="/menu" className="text-sm text-brand-500 hover:underline">View all →</Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {s.items.map((p, i) => (
                  <Reveal key={p.id} delay={i * 60}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
              </div>
            </section>
          )
      )}
    </div>
  );
}
