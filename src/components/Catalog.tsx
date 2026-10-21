import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import MenuFilters from "@/components/MenuFilters";
import Reveal from "@/components/Reveal";
import type { Prisma } from "@prisma/client";

type SP = Record<string, string | string[] | undefined>;

export default async function Catalog({ searchParams, scope, title }: {
  searchParams: Promise<SP>;
  scope?: "food" | "drinks";
  title: string;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "";
  const tag = typeof sp.tag === "string" ? sp.tag : "";
  const sort = typeof sp.sort === "string" ? sp.sort : "popular";
  const minPrice = Number(sp.minPrice ?? "") || undefined;
  const maxPrice = Number(sp.maxPrice ?? "") || undefined;
  const inStock = sp.inStock === "1";
  const minRating = Number(sp.minRating ?? "") || 0;

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (scope === "drinks") where.category = { slug: "drinks" };
  if (scope === "food") where.category = { slug: { not: "drinks" } };
  if (q) where.OR = [{ name: { contains: q } }, { description: { contains: q } }];
  if (category) where.category = { slug: category };
  if (tag) where.dietaryLabels = { contains: tag };
  if (minPrice !== undefined || maxPrice !== undefined)
    where.price = { gte: minPrice, lte: maxPrice };
  if (inStock) where.OR = [{ trackStock: false }, { stock: { gt: 0 } }];

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc" ? { price: "asc" } :
    sort === "price-desc" ? { price: "desc" } :
    sort === "name" ? { name: "asc" } :
    { isBestseller: "desc" };

  const categoryWhere: Prisma.CategoryWhereInput =
    scope === "drinks" ? { slug: "drinks" } : scope === "food" ? { slug: { not: "drinks" } } : {};

  const [products, categories] = await Promise.all([
    db.product.findMany({ where, orderBy, include: { reviews: { select: { rating: true } } } }),
    db.category.findMany({ where: categoryWhere, orderBy: { sortOrder: "asc" } }),
  ]);

  const filtered = minRating
    ? products.filter((p) => {
        if (p.reviews.length === 0) return false;
        return p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length >= minRating;
      })
    : products;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">{title}</h1>
      <MenuFilters categories={categories} current={{ q, category, tag, sort, minPrice, maxPrice, inStock, minRating }} basePath={scope === "drinks" ? "/drinks" : scope === "food" ? "/food" : "/menu"} />
      <p className="text-sm text-stone-500 mt-4">{filtered.length} item{filtered.length === 1 ? "" : "s"}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i * 50, 400)}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-stone-500 py-16 text-center">No items match your filters.</p>
      )}
    </div>
  );
}
