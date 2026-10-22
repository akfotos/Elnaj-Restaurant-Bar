import Link from "next/link";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import MenuFilters from "@/components/MenuFilters";
import MenuTable from "@/components/MenuTable";
import MenuDownloadButton from "@/components/MenuDownloadButton";
import Reveal from "@/components/Reveal";
import type { Prisma } from "@prisma/client";

type SP = Record<string, string | string[] | undefined>;

export default async function Catalog({ searchParams, title }: {
  searchParams: Promise<SP>;
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
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
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

  const [products, categories] = await Promise.all([
    db.product.findMany({ where, orderBy, include: { reviews: { select: { rating: true } }, variants: { orderBy: { price: "asc" } } } }),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const filtered = minRating
    ? products.filter((p) => {
        if (p.reviews.length === 0) return false;
        return p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length >= minRating;
      })
    : products;

  const basePath = "/menu";
  const view = sp.view === "cards" ? "cards" : "table";
  const viewHref = (nextView: string) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) if (typeof value === "string") params.set(key, value);
    params.set("view", nextView);
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="dining-editorial">
      <div className="dining-container dining-catalog">
      <header className="catalog-page-heading"><h1>{title}</h1><p>Food, drinks and something sweet. Everything in one place.</p></header>
      <nav className="catalog-collections" aria-label="Menu collections"><Link href={basePath} aria-current={!category ? "page" : undefined}>Full menu</Link>{categories.map((item) => <Link key={item.id} href={`${basePath}?category=${item.slug}`} aria-current={category === item.slug ? "page" : undefined}>{item.name}</Link>)}</nav>
      <MenuFilters categories={categories} current={{ q, category, tag, sort, minPrice, maxPrice, inStock, minRating }} basePath={basePath} />
      <div className="menu-toolbar"><div className="menu-view-switch" role="group" aria-label="Menu display"><Link href={viewHref("table")} aria-current={view === "table" ? "true" : undefined}>Menu table</Link><Link href={viewHref("cards")} aria-current={view === "cards" ? "true" : undefined}>Photo cards</Link></div><MenuDownloadButton /></div>
      <p className="text-xs text-stone-500 mt-4">{filtered.length} item{filtered.length === 1 ? "" : "s"}</p>
      {view === "table" ? <MenuTable products={filtered} categories={categories} /> : <div className="dining-product-grid mt-8">
        {filtered.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i * 50, 400)}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>}
      {filtered.length === 0 && (
        <div className="catalog-empty"><h3>A different flavour awaits.</h3><p>No items match these filters. Try another category or start fresh.</p><Link href={basePath} className="dining-text-link">Reset filters <span aria-hidden="true">↗</span></Link></div>
      )}
      <div className="catalog-note"><p>Have an allergy? <Link href="/support" className="underline">Contact our team</Link> before ordering. Expand a dish’s dietary information for ingredients and allergens.</p></div>
      </div>
    </div>
  );
}
