import { NextRequest, NextResponse } from "next/server";
import { createMenuPdf } from "@/lib/menu-pdf";
import { photographedMenuCategories, photographedMenuProducts } from "@/lib/photographed-menu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const scope = request.nextUrl.searchParams.get("scope") ?? "all";
  if (!["all", "food", "drinks"].includes(scope)) return NextResponse.json({ error: "Invalid menu scope" }, { status: 400 });
  if (scope === "drinks") return NextResponse.json({ error: "No drinks are included in the current menu." }, { status: 404 });
  try {
    const products = photographedMenuProducts().map((product) => ({ ...product, ingredients: null, allergens: null, dietaryLabels: null, trackStock: false, stock: 0, variants: [] }));
    const categories = photographedMenuCategories().map((category) => ({ ...category, products: products.filter((product) => product.categorySlug === category.slug) }));
    const pdf = await createMenuPdf(categories, "Menu");
    return new NextResponse(new Uint8Array(pdf), {
      headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="elnaj-${scope === "all" ? "full" : scope}-menu.pdf"`, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return NextResponse.json({ error: "The menu download is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}
