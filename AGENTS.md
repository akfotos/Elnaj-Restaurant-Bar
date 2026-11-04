# Elnaj Restaurant & Bar — food e-commerce platform

Next.js 15 (App Router) + TypeScript + Tailwind v4 + Prisma 6 + SQLite. Zustand for the client cart (persisted to localStorage).

## Design direction
- Keep Elnaj’s ivory-and-burgundy identity and editorial typography. Prefer spacious, minimalist layouts with generous gutters, restrained decoration, borderless product cards, and progressive disclosure for secondary controls.
- Storefront navigation uses the full-width ivory `.site-header`, a burgundy editorial wordmark, underlined active desktop tabs, and a dedicated booking action. Desktop navigation begins at 1280px; smaller screens retain a direct Menu link and an accessible disclosure panel that closes on Escape or outside click. Header styles use explicit brand colors so system dark mode does not reduce contrast.

- Customer-facing typography is slightly enlarged; scope general text increases to `.storefront-main > :not(.menu-page)` so admin styling stays unchanged. On `/menu`, enlarge only page/section/column headings; keep dish names, descriptions, prices and secondary text at their existing sizes.
- Keep food and drink listings, category browsing, prices and menu downloads on `/menu`. Other pages should link there instead of repeating menu previews or recommendations; individual product pages remain for details and purchasing.

- Give each customer page a short, purpose-specific introduction and relevant guidance without adding repeated banners or extra sections. Use `PageIntro` for functional pages and the existing heroes for editorial pages. Keep claims aligned with actual features: no automatic payment, booking confirmation, notifications, rewards or live tracking unless implemented.
- Order receipt and tracking wording is centralized in `src/lib/order-content.ts`; pending orders must not claim confirmation or readiness, and pickup progress should use collection wording.

- Motion should be subtle: one-time `Reveal` entrances, restrained hover effects, and full `prefers-reduced-motion` support. Reveal content must remain visible without JavaScript. The shared storefront includes `BackToTop`, which appears after 480px of scrolling and returns focus to the `#top` header.

## Hero media
- Homepage hero footage is the user-supplied `6506380_Seafood_Bbq_1280x720.mp4`, served locally as `public/seafood-bbq.mp4` via `src/components/HeroVideo.tsx`. Its matching poster is extracted from the footage at one second: `public/seafood-bbq-poster.jpg`.
- Keep the poster fallback, muted looping inline autoplay on fresh visits, and reduced-motion/data-saver handling. The visible pause/play control was removed at the user’s request. The new footage replaces the old Mixkit CDN video; no external video host is required. At desktop widths (1024px and above), the hero fills at least the viewport height without the former 820px cap; mobile sizing remains separate.

## Reservations
- `/reservation` collects staff-confirmed requests; `/admin/reservations` is the protected review queue. Submitted requests are PENDING, not guaranteed bookings. Times are Africa/Accra (GMT).
- Staff must contact guests manually before recording confirmation, decline or cancellation. No email/SMS provider is connected, and changing status sends no notification.
- Before enabling this feature, correct `DATABASE_URL` and apply the additive patch once: `npx prisma db execute --file prisma/reservations.sql --schema prisma/schema.prisma`. Then run `npx prisma generate`. The patch creates only the new enum/table/indexes and enables RLS; it has not been applied by the coding agent. Do not replace it with `db push`, which would omit the SQL-only RLS and party-size check.
- Reservation data is server-only. The backend connection must have access through the table-owning role; the SQL grants no public guest access. Keep database credentials off the client.
- Public submissions validate future calendar dates, contacts and whole party sizes (1–99 requests, not a statement of venue capacity), use idempotent request IDs, and limit requests per email. Status changes require staff authentication and write audit records.

## Menu updates
- `src/lib/photographed-menu.ts` now contains the 82 items from the supplied `Honest Chef Menu.pdf`, replacing the earlier photographed sheets. Match its names, current (not struck-through) prices, descriptions and 10-section sequence: Salad, Sauces, Continental, Thai Rice Dishes, Rice Dishes, Spaghetti Dishes, Local Dishes & Traditional Meals, Sunday Special, Extras & Sauces Only, Portions & Sides Only. Only these dishes appear in public menu browsing, product details and PDF downloads; checkout rejects unlisted products, including stale-cart entries. Drinks and unrelated dishes remain in the database for history/admin use, but are not listed. Preserve stable product slugs when changing display names; similarly named sauces and extras are separate products.
- Preview with `npx tsx prisma/update-menu.ts`; apply with `npx tsx prisma/update-menu.ts --apply` after PostgreSQL connectivity is working. This transactional, repeatable importer upserts categories/products without deleting data or fabricating stock. Do not rerun the demo seed to update menu prices.
- Catfish and Fufu retain human-readable `unitLabel` price ranges (`GHS 180–200`, `GHS 20–30`); all other PDF prices are fixed, with no provisional labels. `src/lib/menu-pricing.ts` formats ranges consistently and requires staff confirmation instead of allowing fixed-price checkout. To approve a fixed price, update the product price and set its unit label to `each` in admin.
- Database application failed locally; these menu data changes have not been applied to database records. The public `/menu` page and `/api/menu/download` render directly from the PDF-transcribed source without database queries or purchase buttons; publishing this read-only menu does not require the importer. Header/footer optional settings fall back to empty values when unavailable so the menu remains readable. The Menu tab is visible directly in the mobile header as well as desktop navigation. Tests cover the complete menu PDF and ranged-price checkout eligibility.

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npx prisma db push` — sync schema to SQLite (`prisma/dev.db`)
- `npx tsx prisma/seed.ts` — seed admin user, categories, products, zones, coupons
- `npx tsc --noEmit` — typecheck
- `npx tsx --test src/lib/*.test.ts` — verify PDF generation, legacy menu redirects and reservation validation/API guards

## Credentials (dev)
- Admin: `admin@elnaj.com` / `admin1234` → `/admin`
- Coupons: `WELCOME10` (10% off ≥ GHS 50), `FREEDEL` (free delivery ≥ GHS 200)

## Notes
- Auth = custom session cookie (HMAC-signed token, in-memory session map in `src/lib/auth.ts`). Sessions reset on server restart — swap for a DB session table or NextAuth for production.
- Prices are resolved server-side in `src/app/api/orders/route.ts` (never trust client prices); stock decrements + coupon usage happen in a transaction.
- Admin writes use Server Actions in `src/app/admin/actions.ts` guarded by `requireAdmin()`; every action writes an `AuditLog` row.
- The project directory name has a **trailing space** — `next.config.ts` and tsconfig `paths` alias detection fail because of it. The `@` alias is set via `next.config.mjs` webpack config instead. Consider renaming the folder to `elnaj-restaurant` and deleting the webpack override.
- Online payments (Stripe/Paystack) are not wired up — checkout records method only. Env keys expected: `STRIPE_SECRET_KEY`, `PAYSTACK_SECRET_KEY`.
