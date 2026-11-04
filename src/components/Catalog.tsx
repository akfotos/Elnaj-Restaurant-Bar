import Link from "next/link";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import MenuFilters from "@/components/MenuFilters";
import MenuTable from "@/components/MenuTable";
import MenuDownloadButton from "@/components/MenuDownloadButton";
import Reveal from "@/components/Reveal";
import PageIntro from "@/components/PageIntro";
import type { Prisma } from "@prisma/client";
import { arrangeMenuProducts, photographedMenuCategories, photographedMenuProducts } from "@/lib/photographed-menu";

type SP = Record<string, string | string[] | undefined>;

export default async function Catalog({ searchParams, title }: {
  searchParams: Promise<SP>;
  title: string;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "";
  const tag = typeof sp.tag === "string" ? sp.tag : "";
  const sort = "menu";
  const minPrice = Number(sp.minPrice ?? "") || undefined;
  const maxPrice = Number(sp.maxPrice ?? "") || undefined;
  const inStock = sp.inStock === "1";
  const minRating = Number(sp.minRating ?? "") || 0;

  const menuEntries = photographedMenuProducts().filter((entry) => (!category || entry.categorySlug === category) && (!q || `${entry.name} ${entry.description}`.toLowerCase().includes(q.toLowerCase())));
  const where: Prisma.ProductWhereInput = { isActive: true, slug: { in: menuEntries.map((entry) => entry.slug) } };
  if (tag) where.dietaryLabels = { contains: tag };
  if (minPrice !== undefined || maxPrice !== undefined)
    where.price = { gte: minPrice, lte: maxPrice };
  if (inStock) where.OR = [{ trackStock: false }, { stock: { gt: 0 } }];

  const queriedProducts = await db.product.findMany({ where, include: { reviews: { select: { rating: true } }, variants: { orderBy: { price: "asc" } } } });
  const categories = photographedMenuCategories();
  const products = arrangeMenuProducts(queriedProducts);
  const filtered = minRating
    ? products.filter((p) => {
        if (p.reviews.length === 0) return false;
        return p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length >= minRating;
      })
    : products;

  const selectedCategory = categories.find((item) => item.slug === category);
  const introduction = selectedCategory ? `Explore ${selectedCategory.name.toLowerCase()}, compare current prices and open a dish for its options. Ingredients and dietary information are available below each description.` : "Browse Elnaj’s menu by section, from salads and sauces to traditional meals and sides. Compare prices, open a dish for its details or keep a PDF for later.";
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
      <PageIntro eyebrow={selectedCategory?.name ?? "The Elnaj kitchen & bar"} title={`${title}.`} description={introduction} />
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
