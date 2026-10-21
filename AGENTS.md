# Elnaj Restaurant & Bar — food e-commerce platform

Next.js 15 (App Router) + TypeScript + Tailwind v4 + Prisma 6 + SQLite. Zustand for the client cart (persisted to localStorage).

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npx prisma db push` — sync schema to SQLite (`prisma/dev.db`)
- `npx tsx prisma/seed.ts` — seed admin user, categories, products, zones, coupons
- `npx tsc --noEmit` — typecheck

## Credentials (dev)
- Admin: `admin@elnaj.com` / `admin1234` → `/admin`
- Coupons: `WELCOME10` (10% off ≥ GHS 50), `FREEDEL` (free delivery ≥ GHS 200)

## Notes
- Auth = custom session cookie (HMAC-signed token, in-memory session map in `src/lib/auth.ts`). Sessions reset on server restart — swap for a DB session table or NextAuth for production.
- Prices are resolved server-side in `src/app/api/orders/route.ts` (never trust client prices); stock decrements + coupon usage happen in a transaction.
- Admin writes use Server Actions in `src/app/admin/actions.ts` guarded by `requireAdmin()`; every action writes an `AuditLog` row.
- The project directory name has a **trailing space** — `next.config.ts` and tsconfig `paths` alias detection fail because of it. The `@` alias is set via `next.config.mjs` webpack config instead. Consider renaming the folder to `elnaj-restaurant` and deleting the webpack override.
- Online payments (Stripe/Paystack) are not wired up — checkout records method only. Env keys expected: `STRIPE_SECRET_KEY`, `PAYSTACK_SECRET_KEY`.
