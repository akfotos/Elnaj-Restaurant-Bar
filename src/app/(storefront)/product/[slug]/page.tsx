import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import DiningInvitation from "@/components/DiningInvitation";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { money } from "@/lib/format";
import ProductPurchase from "@/components/ProductPurchase";
import ReviewForm from "@/components/ReviewForm";
import WishlistButton from "@/components/WishlistButton";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { variants: true, category: true, reviews: { include: { user: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!product || !product.isActive) notFound();
  const user = await getSessionUser();
  const nutrition = product.nutrition ? JSON.parse(product.nutrition) : null;
  const allergens = product.allergens?.split(",").filter(Boolean) ?? [];
  const labels = product.dietaryLabels?.split(",").filter(Boolean) ?? [];
  const avg = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : null;

  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
    take: 4,
  });

  return (
    <div className="dining-editorial">
      <div className="dining-container dining-product-detail">
      <nav aria-label="Breadcrumb" className="product-breadcrumb"><Link href="/menu">Our menu</Link><span aria-hidden="true">/</span><Link href={product.category.slug === "drinks" ? "/drinks" : `/food?category=${product.category.slug}`}>{product.category.name}</Link></nav>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="animate-fade-in relative aspect-square bg-ink-800 rounded-2xl overflow-hidden border border-black/10">
          {product.image ? (
            <Image src={product.image} alt={product.name} fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">🍽️</div>
          )}
        </div>
        <div>
          <p className="text-sm text-brand-500 font-medium">{product.category.name}</p>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
            {user && <WishlistButton productId={product.id} />}
          </div>
          {avg !== null && (
            <p className="text-sm text-stone-500 mt-1">★ {avg.toFixed(1)} ({product.reviews.length} reviews)</p>
          )}
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-brand-500">{money(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-stone-500 line-through">{money(product.compareAtPrice)}</span>
            )}
            <span className="text-sm text-stone-500">{product.unitLabel}</span>
          </div>
          {labels.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {labels.map((l) => (
                <span key={l} className="text-xs uppercase bg-stone-100 text-stone-600 border border-stone-200 rounded px-2 py-0.5">{l}</span>
              ))}
              {product.spicyLevel > 0 && (
                <span className="text-xs bg-red-50 text-red-600 border border-red-200 rounded px-2 py-0.5">
                  Spicy · level {product.spicyLevel}/3
                </span>
              )}
            </div>
          )}
          <p className="mt-5 text-stone-600 leading-relaxed">{product.description}</p>
          <p className="mt-2 text-sm text-stone-500">Prep time: ~{product.prepTimeMins} min</p>
          <ProductPurchase product={product} />

          <div className="mt-8 space-y-4 text-sm">
            {product.ingredients && (
              <section>
                <h3 className="font-semibold text-stone-800">Ingredients</h3>
                <p className="text-stone-500 mt-1">{product.ingredients}</p>
              </section>
            )}
            {allergens.length > 0 && (
              <section>
                <h3 className="font-semibold text-stone-800">Allergen warning</h3>
                <p className="text-amber-700 mt-1">Contains: {allergens.join(", ")}</p>
              </section>
            )}
            {nutrition && (
              <section>
                <h3 className="font-semibold text-stone-800">Nutrition (per serving)</h3>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {Object.entries(nutrition).map(([k, v]) => (
                    <div key={k} className="bg-ink-800 border border-black/10 rounded-lg p-2 text-center">
                      <p className="text-brand-500 font-semibold">{String(v)}</p>
                      <p className="text-xs text-stone-500 capitalize">{k}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {product.storageNotes && (
              <section>
                <h3 className="font-semibold text-stone-800">Storage</h3>
                <p className="text-stone-500 mt-1">{product.storageNotes}</p>
              </section>
            )}
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {product.reviews.length === 0 && <p className="text-stone-500 text-sm">No reviews yet.</p>}
            {product.reviews.map((r) => (
              <div key={r.id} className="bg-ink-800 border border-black/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{r.user.name}</p>
                  <p className="text-brand-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                </div>
                {r.comment && <p className="text-sm text-stone-500 mt-1">{r.comment}</p>}
              </div>
            ))}
          </div>
          {user ? <ReviewForm productId={product.id} /> : (
            <p className="text-sm text-stone-500">Sign in to leave a review.</p>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-4">You may also like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
      </div>
      <DiningInvitation />
    </div>
  );
}
