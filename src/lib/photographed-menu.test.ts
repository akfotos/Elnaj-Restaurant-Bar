import { test } from "node:test";
import assert from "node:assert/strict";
import { arrangeMenuProducts, photographedMenuCategories, photographedMenu, photographedMenuProducts } from "./photographed-menu";
import { menuPrice, requiresPriceConfirmation } from "./menu-pricing";
import { createMenuPdf } from "./menu-pdf";

test("only PDF dishes appear, with PDF names and order regardless of database names and categories", () => {
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

test("PDF sections, names, prices and sequence replace the old photographed menu", () => {
  assert.deepEqual(photographedMenuCategories().map((category) => category.name), ["Salad", "Sauces", "Continental", "Thai Rice Dishes", "Rice Dishes", "Spaghetti Dishes", "Local Dishes & Traditional Meals", "Sunday Special", "Extras & Sauces Only", "Portions & Sides Only"]);
  assert.deepEqual(photographedMenu.map((section) => section.entries.map(({ name, price }) => [name, price])), [
    [["Tuna salad", 50], ["Chicken salad", 50], ["Vegetable salad", 45], ["Chef’s special salad", 60]],
    [["Chicken", 95], ["Beef sauce", 100], ["Fish sauce", 100], ["Shrimp sauce", 110], ["Octopus sauce", 110], ["Shrimps & Octopus", 120], ["Shrimp, Octopus & Fish", 130], ["Chef’s Special", 110]],
    [["Chicken in Chilli Tomato Sauce", 100], ["Grilled or Fried Chicken", 95], ["Boneless Chicken in Garlic Butter Sauce", 120], ["Fillet Fish in Tomato Sauce", 110], ["Red Snapper in Chilli Tomato Sauce", 100], ["Plain Omelette", 40], ["Spanish Omelette", 45]],
    [["Thai Rice Chicken", 120], ["Thai Rice Beef", 130], ["Thai Rice Assorted", 150], ["Thai Rice Seafood", 200]],
    [["Octopus Mixed Fried Rice or Jollof", 120], ["Shrimps Mixed Fried Rice or Jollof", 120], ["Shrimps & Octopus Fried Rice or Jollof", 130], ["Beef Mixed Fried Rice or Jollof", 110], ["Chicken Mixed with Fried Rice or Jollof", 100], ["Chicken & Beef Mixed Fried Rice or Jollof", 120], ["Chef’s Special Assorted Rice or Jollof", 130]],
    [["Vegetable Mixed Spaghetti", 60], ["Beef Mixed Spaghetti", 100], ["Chicken Mixed Spaghetti", 95], ["Shrimps Mixed Spaghetti", 120], ["Octopus Mixed Spaghetti", 110], ["Chicken & Beef Mixed Spaghetti", 100], ["Shrimps & Octopus Mixed Spaghetti", 110], ["Chef’s Special Spaghetti", 110], ["Seafood Spaghetti", 130]],
    [["Red Snapper with Jollof or Fried Rice", 90], ["Red Snapper with Banku", 80], ["Tilapia with Banku", 120], ["Banku and Okro", 80], ["Palava Sauce with Yam", 85], ["Palava Sauce with Plain Rice", 90], ["Egg Stew with Yam & Plain Rice", 90], ["Egg Stew with Plain Rice", 100], ["Egg Stew Only", 80], ["Catfish", 180]],
    [["Goat Meat", 40], ["Cow Meat", 30], ["Cow Intestine", 20], ["Goat Intestine", 30], ["Tuna", 20], ["Salmon", 20], ["Chicken Wings", 25], ["Fresh Tilapia", 50], ["Boiled Egg", 5], ["Fufu", 20], ["Omo Tuo", 5]],
    [["Beef Sauce Only", 85], ["Chicken Sauce Only", 80], ["Fish Sauce Only", 75], ["Octopus Sauce Only", 90], ["Shrimps Sauce Only", 90], ["Shrimps & Octopus", 100], ["Shrimps, Octopus & Fish Sauce", 110], ["Chef’s Special Sauce Only", 100], ["Okro Only", 80], ["Palava Sauce Only", 70]],
    [["Plain Rice Only", 30], ["Fried Rice Only", 35], ["Jollof Only", 40], ["Potato Chips Only", 30], ["Yam Chips Only", 25], ["Boiled Yam Only", 25], ["Chicken Only", 50], ["Red Fish Only", 70], ["Tilapia Only", 100], ["Tossed Vegetables", 25], ["Shito", 5], ["Banku Only", 5]],
  ]);
});

test("PDF dishes have unique stable slugs, including similarly named sauces and extras", () => {
  const products = photographedMenuProducts();
  assert.equal(products.length, 82);
  assert.equal(new Set(products.map((product) => product.slug)).size, products.length);
  assert.ok(products.every((product) => Number.isFinite(product.price) && product.price > 0));
  for (const [name, slug] of [["Tilapia with Banku", "banku-tilapia"], ["Chef’s Special Spaghetti", "chef-s-special"], ["Seafood Spaghetti", "seafood"], ["Chicken Mixed with Fried Rice or Jollof", "chicken-mixed-fried-rice-or-jollof"], ["Goat Meat", "goat-meat"], ["Potato Chips Only", "potato-chips-only"]]) {
    assert.equal(products.find((product) => product.name === name)?.slug, slug);
  }
  assert.deepEqual(products.filter((product) => product.name === "Shrimps & Octopus").map(({ price, categorySlug }) => [price, categorySlug]), [[120, "sauces"], [100, "extras"]]);
  assert.ok(products.every((product) => !product.unitLabel.includes("Provisional")));
});

test("only the two PDF price ranges require confirmation instead of fixed-price checkout", () => {
  const products = photographedMenuProducts();
  assert.deepEqual(products.filter(requiresPriceConfirmation).map((product) => [product.name, menuPrice(product)]), [["Catfish", "GHS 180–200"], ["Fufu", "GHS 20–30"]]);
  assert.equal(menuPrice({ price: 30, unitLabel: "each" }), "GHS 30.00");
  assert.equal(requiresPriceConfirmation({ unitLabel: "per kg" }), false);
});

test("the replacement menu generates a PDF with all 82 items", async () => {
  const products = photographedMenuProducts();
  const pdf = await createMenuPdf(photographedMenu.map((section) => ({ name: section.name, products: products.filter((product) => product.categorySlug === section.slug).map((product) => ({ ...product, ingredients: null, allergens: null, dietaryLabels: null, trackStock: false, stock: 0, variants: [] })) })), "Menu");
  assert.ok(pdf.length > 1000);
});
