import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createMenuPdf } from "@/lib/menu-pdf";
import { arrangeMenuProducts, photographedMenuCategories, photographedMenuProducts } from "@/lib/photographed-menu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const scope = request.nextUrl.searchParams.get("scope") ?? "all";
  if (!["all", "food", "drinks"].includes(scope)) return NextResponse.json({ error: "Invalid menu scope" }, { status: 400 });
  if (scope === "drinks") return NextResponse.json({ error: "No drinks are included in the photographed menu." }, { status: 404 });
  try {
    const queriedProducts = await db.product.findMany({
      where: { isActive: true, slug: { in: photographedMenuProducts().map((product) => product.slug) } },
      select: { slug: true, name: true, description: true, ingredients: true, allergens: true, dietaryLabels: true, price: true, unitLabel: true, trackStock: true, stock: true, variants: { select: { name: true, price: true }, orderBy: { price: "asc" } } },
    });
    const products = arrangeMenuProducts(queriedProducts);
    const categories = photographedMenuCategories().map((category) => ({ ...category, products: products.filter((product) => product.categoryId === category.id) })).filter((category) => category.products.length);
    const pdf = await createMenuPdf(categories, "Menu");
    return new NextResponse(new Uint8Array(pdf), {
      headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="elnaj-${scope === "all" ? "full" : scope}-menu.pdf"`, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return NextResponse.json({ error: "The menu download is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}
