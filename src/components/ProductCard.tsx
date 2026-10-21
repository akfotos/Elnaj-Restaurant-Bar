import Link from "next/link";
import Image from "next/image";
import { money } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@prisma/client";

export default function ProductCard({ product }: { product: Product }) {
  const labels = product.dietaryLabels?.split(",").filter(Boolean) ?? [];
  const out = product.trackStock && product.stock <= 0;
  return (
    <div className="card-lift bg-ink-800 rounded-xl border border-black/10 overflow-hidden flex flex-col h-full">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/3] bg-ink-700 overflow-hidden">
        {product.image ? (
          <Image src={product.image} alt={product.name} fill className="img-zoom object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
        )}
        {product.compareAtPrice && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">SALE</span>
        )}
        <div className="img-overlay" />
        <span className="img-cta bg-ink-800/95 text-brand-500 text-xs font-semibold rounded-full px-3 py-1.5 shadow">
          View dish →
        </span>
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${product.slug}`} className="font-semibold leading-tight hover:text-brand-500">
            {product.name}
          </Link>
          {product.spicyLevel > 0 && (
            <span className="text-[10px] uppercase tracking-wide bg-red-50 text-red-600 border border-red-200 rounded px-1.5 py-0.5" title={`Spicy level ${product.spicyLevel}`}>
              Spicy
            </span>
          )}
        </div>
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {labels.map((l) => (
              <span key={l} className="text-[10px] uppercase tracking-wide bg-stone-100 text-stone-600 border border-stone-200 rounded px-1.5 py-0.5">
                {l}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <span className="font-bold text-brand-500">{money(product.price)}</span>
            {product.compareAtPrice && (
              <span className="ml-2 text-sm text-stone-500 line-through">{money(product.compareAtPrice)}</span>
            )}
            {product.weightBased && <span className="block text-xs text-stone-500">{product.unitLabel}</span>}
          </div>
          <AddToCartButton
            disabled={out}
            item={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.image,
              unitPrice: product.price,
              quantity: 1,
              weightBased: product.weightBased,
              unitLabel: product.unitLabel,
            }}
          />
        </div>
        {out && <p className="text-xs text-red-400">Out of stock</p>}
      </div>
    </div>
  );
}
