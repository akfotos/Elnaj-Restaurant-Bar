import Link from "next/link";
import DiningHero from "@/components/DiningHero";
import DiningInvitation from "@/components/DiningInvitation";
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

  const basePath = scope === "drinks" ? "/drinks" : scope === "food" ? "/food" : "/menu";
  const isBar = scope === "drinks";

  return (
    <div className="dining-editorial">
      <DiningHero eyebrow={title} title={isBar ? "Raise a glass." : "Follow your appetite."} accent={isBar ? "Find your favourite sip." : "Find your Elnaj favourite."} description={isBar ? "Refreshing coolers, signature cocktails and something to complement every dish." : "From the first small bite to the last sweet spoonful. Explore our kitchen, your way."} image={isBar ? "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1600&q=85" : "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=85"} imageAlt={isBar ? "Colourful cocktails garnished with citrus" : "Freshly grilled food with colourful accompaniments"} />
      <div className="dining-container dining-catalog">
      <div className="dining-section-heading"><div><p className="dining-eyebrow">{isBar ? "The Elnaj bar" : "Fresh from our kitchen"}</p><h2>{title}</h2></div><Link href={isBar ? "/food" : "/drinks"} className="dining-text-link">{isBar ? "Find a dish to match" : "Add something to sip"} <span aria-hidden="true">↗</span></Link></div>
      <nav className="catalog-collections" aria-label="Menu collections"><Link href={basePath} aria-current={!category ? "page" : undefined}>All {isBar ? "drinks" : "dishes"}</Link>{categories.map((item) => <Link key={item.id} href={`${basePath}?category=${item.slug}`} aria-current={category === item.slug ? "page" : undefined}>{item.name}</Link>)}</nav>
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
        <div className="catalog-empty"><h3>A different flavour awaits.</h3><p>No items match these filters. Try another category or start fresh.</p><Link href={basePath} className="dining-text-link">Reset filters <span aria-hidden="true">↗</span></Link></div>
      )}
      <div className="catalog-note"><p className="dining-eyebrow">A note before you order</p><p>Ingredients, allergens and dietary labels are listed on each dish. If you have an allergy, contact us before ordering. Product photography is illustrative; presentation may vary.</p><Link href="/support" className="dining-text-link">Ask our team <span aria-hidden="true">↗</span></Link></div>
      </div>
      <DiningInvitation />
    </div>
  );
}
