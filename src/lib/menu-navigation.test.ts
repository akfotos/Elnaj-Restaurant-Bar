import { test } from "node:test";
import assert from "node:assert/strict";
import FoodPage from "../app/(storefront)/food/page";
import DrinksPage from "../app/(storefront)/drinks/page";

const redirectsTo = (destination: string) => (error: unknown) => {
  assert.ok(error instanceof Error && "digest" in error);
  assert.ok(String(error.digest).includes(`;${destination};307;`));
  return true;
};

test("old food URL redirects to the single menu page", async () => {
  await assert.rejects(FoodPage({ searchParams: Promise.resolve({}) }), redirectsTo("/menu"));
});

test("food redirects preserve searches, display preference and repeated parameters", async () => {
  await assert.rejects(FoodPage({ searchParams: Promise.resolve({ q: "rice & chicken", view: "cards", tag: ["vegan", "halal"] }) }), redirectsTo("/menu?q=rice+%26+chicken&view=cards&tag=vegan&tag=halal"));
});

test("old drinks URL selects drinks on the menu page while keeping other filters", async () => {
  await assert.rejects(DrinksPage({ searchParams: Promise.resolve({ category: "grills", q: "cooler", view: "table" }) }), redirectsTo("/menu?category=drinks&q=cooler&view=table"));
});
