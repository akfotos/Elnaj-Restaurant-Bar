import { test } from "node:test";
import assert from "node:assert/strict";
import { arrangeMenuProducts, photographedMenuCategories, photographedMenu, photographedMenuProducts } from "./photographed-menu";
import { menuPrice, requiresPriceConfirmation } from "./menu-pricing";
import { createMenuPdf } from "./menu-pdf";

test("only photographed dishes appear, with sheet names and order regardless of database names and categories", () => {
  const categories = photographedMenuCategories();
  assert.deepEqual(categories.map((category) => category.name), ["Continental", "Rice Dishes", "Continental", "Sauces", "Local", "Sunday Special", "Extras"]);
  const products = photographedMenuProducts();
  const databaseProducts = products.map((product) => ({ ...product, name: "Old name", categoryId: "old-category", id: product.slug, stock: 7 }));
  const drink = { ...databaseProducts[0], slug: "water", name: "Water" };
  const unrelatedDish = { ...databaseProducts[0], slug: "burger", name: "Burger" };
  const input = [drink, ...[...databaseProducts].reverse(), unrelatedDish];
  const arranged = arrangeMenuProducts(input);
  assert.deepEqual(arranged.map(({ name, slug, categoryId }) => ({ name, slug, categoryId })), products.map(({ name, slug, categorySlug }) => ({ name, slug, categoryId: categorySlug })));
  assert.ok(arranged.every((product) => product.stock === 7 && product.id === product.slug));
  assert.equal(input[0].name, "Water");
  assert.deepEqual(arrangeMenuProducts([]), []);
  assert.deepEqual(arrangeMenuProducts([drink, unrelatedDish]), []);
  assert.deepEqual(arrangeMenuProducts([databaseProducts[1], databaseProducts[0]]).map((product) => product.slug), products.slice(0, 2).map((product) => product.slug));
});

test("section contents retain the sheet sequence, including the repeated Continental heading and continuation of Extras", () => {
  assert.deepEqual(photographedMenu.map((section) => section.entries.map((entry) => entry.name)), [
    ["Chicken in Chilli Tomato Sauce", "Grilled or Fried Chicken", "Boneless Chicken in Garlic Butter Sauce", "Fillet Fish in Tomato Sauce", "Red Snapper in Chilli Tomato Sauce", "Thai Rice Chicken", "Thai Rice Beef", "Thai Rice Assorted", "Thai Rice Seafood"],
    ["Octopus Mixed Fried Rice or Jollof", "Shrimps Mixed Fried Rice or Jollof", "Shrimps & Octopus Fried Rice or Jollof", "Beef Mixed Fried Rice or Jollof", "Chicken mixed with Fried Rice or Jollof", "Chicken & Beef Mixed Fried Rice or Jollof", "Chef’s Special Assorted Rice or Jollof"],
    ["Plain Omelette", "Spanish Omelette"],
    ["Vegetable Mixed Spaghetti", "Beef Mixed Spaghetti", "Chicken Mixed Spaghetti", "Shrimps Mixed Spaghetti", "Octopus Mixed Spaghetti", "Chicken & Beef Mixed Spaghetti", "Shrimps & Octopus Mixed Spaghetti", "Chef’s Special", "Seafood (Shrimps Octopus & Fish)"],
    ["Red Snapper with Jollof or Fried Rice", "Red Snapper with Banku", "Tilapia with Banku", "Banku and Okro", "Palava Sauce with Yam", "Palava Sauce with Plain Rice", "Egg Stew with Yam & Plain Rice", "Egg Stew with Plain Rice", "Egg Stew Only", "Catfish"],
    ["Goat Neat", "Cow Meat", "Cow Intestine", "Goat Intestine", "Tuna", "Salmon", "Chicken Wings", "Fresh Tilapia", "Boiled Egg", "Fufu", "Omo Tuo"],
    ["Beef Sauce Only", "Chicken Sauce Only", "Fish Sauce Only", "Octopus Sauce Only", "Shrimps Sauce Only", "Shrimps & Octopus", "Shrimps, Octopus & Fish Sauce", "Chef’s Special Sauce Only", "Chicken Only", "Fried Rice Only", "Jollof Only", "Totato Chips Only", "Yam Chips Only", "Plain Rice Only", "Shito", "Red Fish Only", "Tilapia Only", "Boiled Yam Only", "Tossed Vegetables", "Okro Only", "Palava Sauce Only", "Banku Only"],
  ]);
});

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
