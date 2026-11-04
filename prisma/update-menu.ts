import { PrismaClient } from "@prisma/client";
import { loadEnvConfig } from "@next/env";
import { photographedMenu, photographedMenuProducts } from "../src/lib/photographed-menu";

async function main() {
  const products = photographedMenuProducts();
  if (new Set(products.map((product) => product.slug)).size !== products.length) throw new Error("Duplicate menu slugs");
  console.table(products.map(({ name, price, unitLabel, provisional }) => ({ name, price, unitLabel, provisional })));
  if (!process.argv.includes("--apply")) {
    console.log(`Preview only: ${products.length} dishes. Run npx tsx prisma/update-menu.ts --apply to upsert this menu. Existing drinks, unrelated dishes, orders and stock are preserved.`);
    return;
  }
  loadEnvConfig(process.cwd());
  const db = new PrismaClient();
  try {
    await db.$transaction(async (tx) => {
      for (const [index, section] of photographedMenu.entries()) {
        const category = await tx.category.upsert({
          where: { slug: section.slug },
          update: { name: section.name },
          create: { name: section.name, slug: section.slug, sortOrder: index + 10 },
        });
        for (const product of products.filter((item) => item.categorySlug === section.slug)) {
          const data = { name: product.name, description: product.description, price: product.price, unitLabel: product.unitLabel, categoryId: category.id, compareAtPrice: null, isActive: true };
          await tx.product.upsert({ where: { slug: product.slug }, update: data, create: { ...data, slug: product.slug, trackStock: false } });
        }
      }
    }, { timeout: 60000 });
    console.log(`Updated ${products.length} menu dishes. No products or orders were deleted.`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  const invalidProtocol = error instanceof Error && /must start with the protocol/i.test(error.message);
  console.error(invalidProtocol ? "Menu update blocked: DATABASE_URL must use postgresql:// or postgres://. Correct it locally; do not share credentials." : "Menu update failed. Check PostgreSQL connectivity and schema setup locally; do not share database credentials.");
  console.error("No partial menu changes were committed.");
  process.exitCode = 1;
});
