# Elnaj Restaurant & Bar — food e-commerce platform

Next.js 15 (App Router) + TypeScript + Tailwind v4 + Prisma 6 + SQLite. Zustand for the client cart (persisted to localStorage).

## Design direction
- Keep Elnaj’s ivory-and-burgundy identity and editorial typography. Prefer spacious, minimalist layouts with generous gutters, restrained decoration, borderless product cards, and progressive disclosure for secondary controls.

- Keep food and drink listings, category browsing, prices and menu downloads on `/menu`. Other pages should link there instead of repeating menu previews or recommendations; individual product pages remain for details and purchasing.

## Hero media
- Homepage stock footage: “Chef cooking on a large grill” (Mixkit item 4678), https://mixkit.co/free-stock-video/chef-cooking-on-a-large-grill-4678/ — listed under the Mixkit Stock Video Free License for commercial/personal use: https://mixkit.co/license/#videoFree.
- The video is served from Mixkit’s CDN via `src/components/HeroVideo.tsx`. Keep a poster fallback, muted inline playback, a pause control, and reduced-motion handling when replacing it with Elnaj footage.

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npx prisma db push` — sync schema to SQLite (`prisma/dev.db`)
- `npx tsx prisma/seed.ts` — seed admin user, categories, products, zones, coupons
- `npx tsc --noEmit` — typecheck
- `npx tsx --test src/lib/*.test.ts` — verify PDF generation, pagination, special characters and legacy menu redirects

## Credentials (dev)
- Admin: `admin@elnaj.com` / `admin1234` → `/admin`
- Coupons: `WELCOME10` (10% off ≥ GHS 50), `FREEDEL` (free delivery ≥ GHS 200)

## Notes
- Auth = custom session cookie (HMAC-signed token, in-memory session map in `src/lib/auth.ts`). Sessions reset on server restart — swap for a DB session table or NextAuth for production.
- Prices are resolved server-side in `src/app/api/orders/route.ts` (never trust client prices); stock decrements + coupon usage happen in a transaction.
- Admin writes use Server Actions in `src/app/admin/actions.ts` guarded by `requireAdmin()`; every action writes an `AuditLog` row.
- The project directory name has a **trailing space** — `next.config.ts` and tsconfig `paths` alias detection fail because of it. The `@` alias is set via `next.config.mjs` webpack config instead. Consider renaming the folder to `elnaj-restaurant` and deleting the webpack override.
- Online payments (Stripe/Paystack) are not wired up — checkout records method only. Env keys expected: `STRIPE_SECRET_KEY`, `PAYSTACK_SECRET_KEY`.
