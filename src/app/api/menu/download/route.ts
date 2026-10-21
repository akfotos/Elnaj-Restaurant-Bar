import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createMenuPdf } from "@/lib/menu-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const scope = request.nextUrl.searchParams.get("scope") ?? "all";
  if (!["all", "food", "drinks"].includes(scope)) return NextResponse.json({ error: "Invalid menu scope" }, { status: 400 });
  try {
    const categories = await db.category.findMany({
      where: scope === "drinks" ? { slug: "drinks" } : scope === "food" ? { slug: { not: "drinks" } } : {},
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        name: true,
        products: {
          where: { isActive: true },
          orderBy: { name: "asc" },
          select: { name: true, description: true, ingredients: true, allergens: true, dietaryLabels: true, price: true, unitLabel: true, trackStock: true, stock: true, variants: { select: { name: true, price: true }, orderBy: { price: "asc" } } },
        },
      },
    });
    const pdf = await createMenuPdf(categories, scope === "all" ? "Food & Drinks Menu" : scope === "food" ? "Food Menu" : "Drinks Menu");
    return new NextResponse(new Uint8Array(pdf), {
      headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="elnaj-${scope === "all" ? "full" : scope}-menu.pdf"`, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return NextResponse.json({ error: "The menu download is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}
