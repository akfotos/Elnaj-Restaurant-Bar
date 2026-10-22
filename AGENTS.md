# Elnaj Restaurant & Bar — food e-commerce platform

Next.js 15 (App Router) + TypeScript + Tailwind v4 + Prisma 6 + SQLite. Zustand for the client cart (persisted to localStorage).

## Design direction
- Keep Elnaj’s ivory-and-burgundy identity and editorial typography. Prefer spacious, minimalist layouts with generous gutters, restrained decoration, borderless product cards, and progressive disclosure for secondary controls.

- Keep food and drink listings, category browsing, prices and menu downloads on `/menu`. Other pages should link there instead of repeating menu previews or recommendations; individual product pages remain for details and purchasing.

- Give each customer page a short, purpose-specific introduction and relevant guidance without adding repeated banners or extra sections. Use `PageIntro` for functional pages and the existing heroes for editorial pages. Keep claims aligned with actual features: no automatic payment, booking confirmation, notifications, rewards or live tracking unless implemented.
- Order receipt and tracking wording is centralized in `src/lib/order-content.ts`; pending orders must not claim confirmation or readiness, and pickup progress should use collection wording.

- Motion should be subtle: one-time `Reveal` entrances, restrained hover effects, and full `prefers-reduced-motion` support. Reveal content must remain visible without JavaScript. The shared storefront includes `BackToTop`, which appears after 480px of scrolling and returns focus to the `#top` header.

## Hero media
- Homepage stock footage: “Chef cooking on a large grill” (Mixkit item 4678), https://mixkit.co/free-stock-video/chef-cooking-on-a-large-grill-4678/ — listed under the Mixkit Stock Video Free License for commercial/personal use: https://mixkit.co/license/#videoFree.
- The video is served from Mixkit’s CDN via `src/components/HeroVideo.tsx`. Keep a poster fallback, muted inline playback, a pause control, and reduced-motion handling when replacing it with Elnaj footage.

## Reservations
- `/reservation` collects staff-confirmed requests; `/admin/reservations` is the protected review queue. Submitted requests are PENDING, not guaranteed bookings. Times are Africa/Accra (GMT).
- Staff must contact guests manually before recording confirmation, decline or cancellation. No email/SMS provider is connected, and changing status sends no notification.
- Before enabling this feature, correct `DATABASE_URL` and apply the additive patch once: `npx prisma db execute --file prisma/reservations.sql --schema prisma/schema.prisma`. Then run `npx prisma generate`. The patch creates only the new enum/table/indexes and enables RLS; it has not been applied by the coding agent. Do not replace it with `db push`, which would omit the SQL-only RLS and party-size check.
- Reservation data is server-only. The backend connection must have access through the table-owning role; the SQL grants no public guest access. Keep database credentials off the client.
- Public submissions validate future calendar dates, contacts and whole party sizes (1–99 requests, not a statement of venue capacity), use idempotent request IDs, and limit requests per email. Status changes require staff authentication and write audit records.

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
