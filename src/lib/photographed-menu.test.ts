import { test } from "node:test";
import assert from "node:assert/strict";
import { photographedMenu, photographedMenuProducts } from "./photographed-menu";
import { menuPrice, requiresPriceConfirmation } from "./menu-pricing";
import { createMenuPdf } from "./menu-pdf";

test("photographed dishes have unique stable slugs and positive prices", () => {
  const products = photographedMenuProducts();
  assert.equal(products.length, 70);
  assert.equal(new Set(products.map((product) => product.slug)).size, products.length);
  assert.ok(products.every((product) => Number.isFinite(product.price) && product.price > 0));
  assert.equal(products.find((product) => product.name === "Tilapia with Banku")?.slug, "banku-tilapia");
});

test("handwritten corrections and authorised provisional prices are retained", () => {
  const products = photographedMenuProducts();
  for (const [name, expected] of [["Chicken in Chilli Tomato Sauce", 100], ["Grilled or Fried Chicken", 95], ["Beef Sauce Only", 85], ["Chicken Sauce Only", 80], ["Okro Only", 80], ["Palava Sauce Only", 70], ["Goat Intestine", 30], ["Tilapia with Banku", 120], ["Banku and Okro", 80]] as const) {
    assert.equal(products.find((product) => product.name === name)?.price, expected, name);
  }
});

test("price ranges remain ranges and cannot be treated as fixed checkout prices", () => {
  const products = photographedMenuProducts();
  for (const [name, expected] of [["Catfish", "GHS 180–200"], ["Fufu", "GHS 20–30"]]) {
    const product = products.find((item) => item.name === name)!;
    assert.equal(menuPrice(product), expected);
    assert.ok(requiresPriceConfirmation(product));
  }
  for (const product of products.filter((item) => item.provisional)) assert.ok(requiresPriceConfirmation(product));
  assert.equal(menuPrice({ price: 30, unitLabel: "each" }), "GHS 30.00");
  assert.equal(requiresPriceConfirmation({ unitLabel: "per kg" }), false);
});

test("the complete photographed menu generates a PDF including ranged and provisional prices", async () => {
  const products = photographedMenuProducts();
  const pdf = await createMenuPdf(photographedMenu.map((section) => ({ name: section.name, products: products.filter((product) => product.categorySlug === section.slug).map((product) => ({ ...product, ingredients: null, allergens: null, dietaryLabels: null, trackStock: false, stock: 0, variants: [] })) })), "Food Menu");
  assert.ok(pdf.length > 1000);
});
