import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import MenuDownloadButton from "@/components/MenuDownloadButton";
import { photographedMenu, photographedMenuProducts } from "@/lib/photographed-menu";
import { menuPrice, requiresPriceConfirmation } from "@/lib/menu-pricing";

export const metadata = { title: "Menu", description: "Explore Elnaj’s menu, from salads and sauces to Thai rice, traditional meals and sides. All prices are in Ghana cedis." };

export default function MenuPage() {
  const products = photographedMenuProducts();

  return (
    <div className="dining-editorial">
      <div className="dining-container dining-catalog">
        <PageIntro eyebrow="The Elnaj kitchen" title="Our menu." description="From salads and sauces to traditional favourites and Sunday specials. Browse each section below; all prices are in Ghana cedis (GHS).">
          <div className="mt-6"><MenuDownloadButton /></div>
        </PageIntro>
        <nav className="catalog-collections" aria-label="Menu sections">
          {photographedMenu.map((section) => <a key={section.slug} href={`#${section.slug}`}>{section.name}</a>)}
        </nav>
        <div className="menu-tables">
          {photographedMenu.map((section) => (
            <section key={section.slug} id={section.slug} className="menu-table-section scroll-mt-32" aria-labelledby={`${section.slug}-heading`}>
              <h2 id={`${section.slug}-heading`}>{section.name}</h2>
              <div className="menu-table-scroll" role="region" aria-label={`${section.name} menu`} tabIndex={0}>
                <table className="menu-table" role="table">
                  <caption className="sr-only">{section.name} — dishes, descriptions and prices in Ghana cedis</caption>
                  <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Dish</th><th scope="col" role="columnheader">Description</th><th scope="col" role="columnheader">Price (GHS)</th></tr></thead>
                  <tbody role="rowgroup">
                    {products.filter((product) => product.categorySlug === section.slug).map((product) => (
                      <tr key={product.slug} role="row">
                        <th scope="row" role="rowheader">{product.name}</th>
                        <td role="cell">{product.description !== product.name ? product.description : null}</td>
                        <td className="menu-table-price" role="cell"><span>{menuPrice(product)}</span>{requiresPriceConfirmation(product) && <small>Confirm portion and final price with our team.</small>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
        <div className="catalog-note"><p>For availability, portion sizes or allergy information, <Link href="/support#enquiry" className="underline">contact our team</Link> before ordering.</p></div>
      </div>
    </div>
  );
}
