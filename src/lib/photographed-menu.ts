import { slugify } from "./format";

type MenuEntry = { name: string; price: number; description?: string; range?: string; provisional?: boolean; slug?: string };
type MenuSection = { name: string; slug: string; entries: MenuEntry[] };

const sides = "Served with a choice of fried rice, jollof, potato chips, yam chips, spaghetti or plain rice.";

export const photographedMenu: MenuSection[] = [
  { name: "Continental", slug: "continental", entries: [
    { name: "Chicken in Chilli Tomato Sauce", price: 100, description: sides },
    { name: "Grilled or Fried Chicken", price: 95, description: sides },
    { name: "Boneless Chicken in Garlic Butter Sauce", price: 120, description: sides },
    { name: "Fillet Fish in Tomato Sauce", price: 110, description: sides },
    { name: "Red Snapper in Chilli Tomato Sauce", price: 100, description: sides },
    { name: "Thai Rice Chicken", price: 120 },
    { name: "Thai Rice Beef", price: 130 },
    { name: "Thai Rice Assorted", price: 150 },
    { name: "Thai Rice Seafood", price: 200 },
  ] },
  { name: "Rice Dishes", slug: "rice-dishes", entries: [
    { name: "Octopus Mixed Fried Rice or Jollof", price: 120 },
    { name: "Shrimps Mixed Fried Rice or Jollof", price: 120 },
    { name: "Shrimps & Octopus Fried Rice or Jollof", price: 130 },
    { name: "Beef Mixed Fried Rice or Jollof", price: 110 },
    { name: "Chicken mixed with Fried Rice or Jollof", slug: "chicken-mixed-fried-rice-or-jollof", price: 100 },
    { name: "Chicken & Beef Mixed Fried Rice or Jollof", price: 120 },
    { name: "Chef’s Special Assorted Rice or Jollof", price: 130, description: "Shrimps, chicken, beef and sausages." },
  ] },
  { name: "Continental", slug: "continental-omelettes", entries: [
    { name: "Plain Omelette", price: 40 },
    { name: "Spanish Omelette", price: 45 },
  ] },
  { name: "Sauces", slug: "spaghetti-sauces", entries: [
    { name: "Vegetable Mixed Spaghetti", price: 60 },
    { name: "Beef Mixed Spaghetti", price: 100 },
    { name: "Chicken Mixed Spaghetti", price: 95 },
    { name: "Shrimps Mixed Spaghetti", price: 100, provisional: true },
    { name: "Octopus Mixed Spaghetti", price: 100, provisional: true },
    { name: "Chicken & Beef Mixed Spaghetti", price: 100, provisional: true },
    { name: "Shrimps & Octopus Mixed Spaghetti", price: 110, provisional: true },
    { name: "Chef’s Special", price: 110, description: "Chicken, beef, shrimps or octopus.", provisional: true },
    { name: "Seafood (Shrimps Octopus & Fish)", slug: "seafood", price: 130, description: "Shrimps, octopus and fish.", provisional: true },
  ] },
  { name: "Local", slug: "local", entries: [
    { name: "Red Snapper with Jollof or Fried Rice", price: 90, provisional: true },
    { name: "Red Snapper with Banku", price: 80, provisional: true },
    { name: "Tilapia with Banku", slug: "banku-tilapia", price: 120, provisional: true },
    { name: "Banku and Okro", price: 80, provisional: true },
    { name: "Palava Sauce with Yam", price: 85 },
    { name: "Palava Sauce with Plain Rice", price: 90 },
    { name: "Egg Stew with Yam & Plain Rice", price: 90 },
    { name: "Egg Stew with Plain Rice", price: 100 },
    { name: "Egg Stew Only", price: 80 },
    { name: "Catfish", price: 180, range: "GHS 180–200" },
  ] },
  { name: "Sunday Special", slug: "sunday-special", entries: [
    { name: "Goat Neat", slug: "goat-meat", price: 40 },
    { name: "Cow Meat", price: 30 },
    { name: "Cow Intestine", price: 20 },
    { name: "Goat Intestine", price: 30 },
    { name: "Tuna", price: 20 },
    { name: "Salmon", price: 20 },
    { name: "Chicken Wings", price: 25 },
    { name: "Fresh Tilapia", price: 50 },
    { name: "Boiled Egg", price: 5 },
    { name: "Fufu", price: 20, range: "GHS 20–30" },
    { name: "Omo Tuo", price: 5 },
  ] },
  { name: "Extras", slug: "extras", entries: [
    { name: "Beef Sauce Only", price: 85 },
    { name: "Chicken Sauce Only", price: 80 },
    { name: "Fish Sauce Only", price: 75 },
    { name: "Octopus Sauce Only", price: 90 },
    { name: "Shrimps Sauce Only", price: 90 },
    { name: "Shrimps & Octopus", price: 100 },
    { name: "Shrimps, Octopus & Fish Sauce", price: 110 },
    { name: "Chef’s Special Sauce Only", price: 100 },
    { name: "Chicken Only", price: 50 },
    { name: "Fried Rice Only", price: 35, provisional: true },
    { name: "Jollof Only", price: 40 },
    { name: "Totato Chips Only", slug: "potato-chips-only", price: 30 },
    { name: "Yam Chips Only", price: 25 },
    { name: "Plain Rice Only", price: 30 },
    { name: "Shito", price: 5 },
    { name: "Red Fish Only", price: 70 },
    { name: "Tilapia Only", price: 100 },
    { name: "Boiled Yam Only", price: 25 },
    { name: "Tossed Vegetables", price: 25 },
    { name: "Okro Only", price: 80 },
    { name: "Palava Sauce Only", price: 70 },
    { name: "Banku Only", price: 5 },
  ] },
];

export function photographedMenuCategories() {
  return photographedMenu.map(({ name, slug }) => ({ id: slug, name, slug }));
}

export function arrangeMenuProducts<T extends { slug: string }>(products: T[]) {
  const entries = photographedMenuProducts();
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  return entries.flatMap((entry) => {
    const product = bySlug.get(entry.slug);
    return product ? [{ ...product, name: entry.name, categoryId: entry.categorySlug }] : [];
  });
}

export function photographedMenuProducts() {
  return photographedMenu.flatMap((section) => section.entries.map((entry) => ({
    name: entry.name,
    slug: entry.slug ?? slugify(entry.name),
    categorySlug: section.slug,
    price: entry.price,
    unitLabel: entry.range ?? (entry.provisional ? `Provisional: GHS ${entry.price.toFixed(2)}` : "each"),
    description: [entry.description, section.slug === "sunday-special" ? "Sunday special." : "", entry.range ? "Confirm the final price and portion with our team before ordering." : "", entry.provisional ? "Provisional price: please confirm with our team; the updated price is cropped or unclear in the supplied menu." : ""].filter(Boolean).join(" ") || entry.name,
    provisional: entry.provisional ?? false,
  })));
}
