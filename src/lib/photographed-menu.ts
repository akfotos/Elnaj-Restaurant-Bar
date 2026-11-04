import { slugify } from "./format";

type MenuEntry = { name: string; price: number; description?: string; range?: string; slug?: string };
type MenuSection = { name: string; slug: string; entries: MenuEntry[] };

const sides = "All served with Fried Rice, Jollof, Potato Chips, Yam Chips, Spaghetti, and Plain Rice.";

export const photographedMenu: MenuSection[] = [
  { name: "Salad", slug: "salad", entries: [
    { name: "Tuna salad", price: 50 },
    { name: "Chicken salad", price: 50 },
    { name: "Vegetable salad", price: 45 },
    { name: "Chef’s special salad", price: 60 },
  ] },
  { name: "Sauces", slug: "sauces", entries: [
    { name: "Chicken", price: 95, description: sides },
    { name: "Beef sauce", price: 100, description: sides },
    { name: "Fish sauce", price: 100, description: sides },
    { name: "Shrimp sauce", price: 110, description: sides },
    { name: "Octopus sauce", price: 110, description: sides },
    { name: "Shrimps & Octopus", slug: "shrimps-octopus-sauce", price: 120, description: sides },
    { name: "Shrimp, Octopus & Fish", price: 130, description: sides },
    { name: "Chef’s Special", slug: "chefs-special-sauce", price: 110, description: `Shrimps or Octopus, Beef & Chicken. ${sides}` },
  ] },
  { name: "Continental", slug: "continental", entries: [
    { name: "Chicken in Chilli Tomato Sauce", price: 100, description: sides },
    { name: "Grilled or Fried Chicken", price: 95, description: sides },
    { name: "Boneless Chicken in Garlic Butter Sauce", price: 120, description: sides },
    { name: "Fillet Fish in Tomato Sauce", price: 110, description: sides },
    { name: "Red Snapper in Chilli Tomato Sauce", price: 100, description: sides },
    { name: "Plain Omelette", price: 40, description: sides },
    { name: "Spanish Omelette", price: 45, description: sides },
  ] },
  { name: "Thai Rice Dishes", slug: "thai-rice-dishes", entries: [
    { name: "Thai Rice Chicken", price: 120 },
    { name: "Thai Rice Beef", price: 130 },
    { name: "Thai Rice Assorted", price: 150 },
    { name: "Thai Rice Seafood", price: 200 },
  ] },
  { name: "Rice Dishes", slug: "rice-dishes", entries: [
    { name: "Octopus Mixed Fried Rice or Jollof", price: 120, description: sides },
    { name: "Shrimps Mixed Fried Rice or Jollof", price: 120, description: sides },
    { name: "Shrimps & Octopus Fried Rice or Jollof", price: 130, description: sides },
    { name: "Beef Mixed Fried Rice or Jollof", price: 110, description: sides },
    { name: "Chicken Mixed with Fried Rice or Jollof", slug: "chicken-mixed-fried-rice-or-jollof", price: 100, description: sides },
    { name: "Chicken & Beef Mixed Fried Rice or Jollof", price: 120, description: sides },
    { name: "Chef’s Special Assorted Rice or Jollof", price: 130, description: `Shrimps, Chicken, Beef and Sausages. ${sides}` },
  ] },
  { name: "Spaghetti Dishes", slug: "spaghetti-sauces", entries: [
    { name: "Vegetable Mixed Spaghetti", price: 60 },
    { name: "Beef Mixed Spaghetti", price: 100 },
    { name: "Chicken Mixed Spaghetti", price: 95 },
    { name: "Shrimps Mixed Spaghetti", price: 120 },
    { name: "Octopus Mixed Spaghetti", price: 110 },
    { name: "Chicken & Beef Mixed Spaghetti", price: 100 },
    { name: "Shrimps & Octopus Mixed Spaghetti", price: 110 },
    { name: "Chef’s Special Spaghetti", slug: "chef-s-special", price: 110, description: "Chicken, Beef, Shrimps, or Octopus." },
    { name: "Seafood Spaghetti", slug: "seafood", price: 130, description: "Shrimps, Octopus & Fish." },
  ] },
  { name: "Local Dishes & Traditional Meals", slug: "local", entries: [
    { name: "Red Snapper with Jollof or Fried Rice", price: 90 },
    { name: "Red Snapper with Banku", price: 80 },
    { name: "Tilapia with Banku", slug: "banku-tilapia", price: 120 },
    { name: "Banku and Okro", price: 80 },
    { name: "Palava Sauce with Yam", price: 85, description: "Weley, Crab, Intestines, Beef and Tuna." },
    { name: "Palava Sauce with Plain Rice", price: 90 },
    { name: "Egg Stew with Yam & Plain Rice", price: 90 },
    { name: "Egg Stew with Plain Rice", price: 100 },
    { name: "Egg Stew Only", price: 80 },
    { name: "Catfish", price: 180, range: "GHS 180–200" },
  ] },
  { name: "Sunday Special", slug: "sunday-special", entries: [
    { name: "Goat Meat", price: 40 },
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
  { name: "Extras & Sauces Only", slug: "extras", entries: [
    { name: "Beef Sauce Only", price: 85 },
    { name: "Chicken Sauce Only", price: 80 },
    { name: "Fish Sauce Only", price: 75 },
    { name: "Octopus Sauce Only", price: 90 },
    { name: "Shrimps Sauce Only", price: 90 },
    { name: "Shrimps & Octopus", price: 100 },
    { name: "Shrimps, Octopus & Fish Sauce", price: 110 },
    { name: "Chef’s Special Sauce Only", price: 100 },
    { name: "Okro Only", price: 80 },
    { name: "Palava Sauce Only", price: 70 },
  ] },
  { name: "Portions & Sides Only", slug: "portions-sides-only", entries: [
    { name: "Plain Rice Only", price: 30 },
    { name: "Fried Rice Only", price: 35 },
    { name: "Jollof Only", price: 40 },
    { name: "Potato Chips Only", price: 30 },
    { name: "Yam Chips Only", price: 25 },
    { name: "Boiled Yam Only", price: 25 },
    { name: "Chicken Only", price: 50 },
    { name: "Red Fish Only", price: 70 },
    { name: "Tilapia Only", price: 100 },
    { name: "Tossed Vegetables", price: 25 },
    { name: "Shito", price: 5 },
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
    unitLabel: entry.range ?? "each",
    description: [entry.description, section.slug === "sunday-special" ? "Sunday special." : "", entry.range ? "Confirm the final price and portion with our team before ordering." : ""].filter(Boolean).join(" ") || entry.name,
  })));
}
