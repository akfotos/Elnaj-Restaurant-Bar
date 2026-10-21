import { test } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { createMenuPdf } from "./menu-pdf";
import type { MenuPdfCategory } from "./menu-pdf";

const dish: MenuPdfCategory["products"][number] = {
  name: "Jollof Rice",
  description: "Smoky rice served with grilled chicken.",
  ingredients: "Rice, tomato, chicken",
  allergens: "none listed",
  dietaryLabels: "spicy",
  price: 65,
  unitLabel: "each",
  trackStock: true,
  stock: 10,
  variants: [{ name: "Large", price: 85 }],
};

test("creates a readable PDF with menu metadata and A4 pages", async () => {
  const bytes = await createMenuPdf([{ name: "Local favourites", products: [dish] }], "Food Menu");
  assert.equal(Buffer.from(bytes.subarray(0, 5)).toString(), "%PDF-");
  const pdf = await PDFDocument.load(bytes);
  assert.equal(pdf.getTitle(), "Elnaj Food Menu");
  assert.equal(pdf.getAuthor(), "Elnaj Restaurant & Bar");
  assert.equal(pdf.getPageCount(), 1);
  assert.equal(pdf.getPage(0).getHeight(), 841.89);
});

test("creates a valid empty menu", async () => {
  const pdf = await PDFDocument.load(await createMenuPdf([], "Food Menu"));
  assert.equal(pdf.getPageCount(), 1);
});

test("paginates long menus, long words and descriptions without failing on unsupported characters", async () => {
  const products = Array.from({ length: 30 }, (_, index) => ({
    ...dish,
    name: `Café ${index} — ${"ExtraLongDishName".repeat(12)} 料理`,
    description: "A generous dish with fresh ingredients. ".repeat(25),
    stock: 0,
    ingredients: null,
    allergens: null,
    dietaryLabels: null,
    variants: [],
  }));
  const pdf = await PDFDocument.load(await createMenuPdf([{ name: "Chef’s specials", products }], "Full Menu"));
  assert.ok(pdf.getPageCount() > 5);
  for (const page of pdf.getPages()) assert.equal(page.getHeight(), 841.89);
});
