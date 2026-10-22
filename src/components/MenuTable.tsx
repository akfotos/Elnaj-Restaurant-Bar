import Link from "next/link";
import Reveal from "@/components/Reveal";
import { money } from "@/lib/format";
import type { Product, ProductVariant } from "@prisma/client";

type MenuProduct = Product & { variants: Pick<ProductVariant, "id" | "name" | "price">[] };

export default function MenuTable({ products, categories }: {
  products: MenuProduct[];
  categories: { id: string; name: string }[];
}) {
  return (
    <div className="menu-tables">
      {categories.map((category) => {
        const dishes = products.filter((product) => product.categoryId === category.id);
        if (!dishes.length) return null;
        return (
          <Reveal as="section" key={category.id} className="menu-table-section">
            <h2>{category.name}</h2>
            <div className="menu-table-scroll" role="region" aria-label={`${category.name} menu`} tabIndex={0}>
              <table className="menu-table" role="table">
                <caption className="sr-only">{category.name} — dishes, contents and prices in Ghana cedis</caption>
                <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Dish</th><th scope="col" role="columnheader">Description &amp; contents</th><th scope="col" role="columnheader">Price (GHS)</th></tr></thead>
                <tbody role="rowgroup">{dishes.map((product) => (
                  <tr key={product.id} role="row">
                    <th scope="row" role="rowheader"><Link href={`/product/${product.slug}`}>{product.name} <span aria-hidden="true">↗</span></Link>{product.trackStock && product.stock <= 0 && <span className="menu-stock-note">Currently unavailable</span>}</th>
                    <td role="cell"><p>{product.description}</p>{(product.ingredients || product.allergens || product.dietaryLabels) && <details className="menu-dish-details"><summary>Ingredients &amp; dietary information</summary>{product.ingredients && <p className="menu-table-detail"><strong>Ingredients:</strong> {product.ingredients}</p>}{product.allergens && <p className="menu-table-detail"><strong>Allergen information:</strong> {product.allergens}</p>}{product.dietaryLabels && <p className="menu-table-labels">{product.dietaryLabels.split(",").filter(Boolean).join(" · ")}</p>}</details>}</td>
                    <td className="menu-table-price" role="cell"><span>{money(product.price)}</span><small>{product.unitLabel}</small>{product.variants.map((variant) => <small key={variant.id}>{variant.name}: {money(variant.price)}</small>)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
