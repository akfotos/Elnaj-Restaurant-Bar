# Elnaj Restaurant & Bar

Full-stack food e-commerce platform — Next.js 15 (App Router), TypeScript, Tailwind CSS, Prisma + SQLite.

## Setup

```bash
npm install
cp .env.example .env          # fill in SESSION_SECRET (required)
npx prisma db push            # create database
npx tsx prisma/seed.ts        # seed menu, zones, coupons, admin user
npm run dev                   # http://localhost:3000
```

**Seeded credentials** — admin: `admin@elnaj.com` / `admin1234`. Coupons: `WELCOME10`, `FREEDEL`.

## Architecture

Route groups separate the customer storefront from the staff dashboard:

```
src/app/
├── (storefront)/     # public pages — burgundy/white theme, light/dark adaptive
├── (admin)/admin/
│   ├── login/        # standalone staff sign-in
│   └── (panel)/      # sidebar workspace: orders, products, delivery, settings, audit
├── api/              # auth (email + Google/Apple OAuth), orders, reviews, wishlist…
└── middleware.ts     # /admin/* protection — signed session cookie, role check
```

- **Sessions:** signed httpOnly cookie carrying `{uid, role}`; in-memory session map (dev) — swap for durable storage in production.
- **Cart:** Zustand persisted to localStorage; per-product variants and priced add-ons.
- **Orders:** prices/extras validated server-side; coupons, delivery zones, time slots, COD/card-on-arrival stubs.
- **Payments:** online payment providers are stubbed — wire Stripe/Paystack via env keys in `.env.example`.

## Env

See `.env.example`. `SESSION_SECRET` is required; OAuth keys only needed to enable social sign-in.

## Production checklist

- Durable session store (Redis/DB), Apple ID-token signature verification
- Real payment provider + webhooks, legal pages reviewed by counsel
- See `AGENTS.md` for full notes and `supabase/migrations/` for optional Supabase RLS
