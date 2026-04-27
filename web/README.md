This is the WIPER web MVP: a bilingual Qatar mobile car wash website with
customer booking, admin operations, worker queue, and backend scaffolding for
orders, subscriptions, assignments, Stripe checkout, and email.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Routes

- `/` landing page
- `/book` customer booking flow
- `/admin` admin dashboard
- `/worker` worker queue
- `/api/checkout` Stripe checkout placeholder
- `/api/orders` order list/create placeholder
- `/api/subscriptions` subscription create placeholder
- `/api/assignments` worker assignment placeholder

## Production setup (Vercel + Railway + MongoDB)

This app uses **MongoDB** for orders and subscriptions (`MONGODB_URI`). The database
name defaults to `wiper` (override with `MONGODB_DB`).

### MongoDB Atlas

1. Create a cluster and database user.
2. Add **Network Access** entries for **0.0.0.0/0** (or restrict to Vercel/Railway egress if you prefer).
3. Copy the SRV connection string into `MONGODB_URI` on each host that runs the API.

### Railway (Node backend)

Railway runs `next start` and should own the **API + Mongo** in the recommended split.

1. New **Railway** service from this repo.
2. Set **Root Directory** to `web` (same folder as `package.json` and `railway.toml`).
3. Variables: `MONGODB_URI` (required), `NODE_ENV=production`, `NEXT_PUBLIC_APP_URL` (your Vercel URL).
4. Deploy; open the public URL and check `GET /api/health` — expect `{ "ok": true, "mongo": "connected" }`.

`railway.toml` configures a healthcheck on `/api/health`.

### Vercel (frontend + proxied API)

1. Import the repo; set **Root Directory** to `web`.
2. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain.
3. Set **`API_UPSTREAM`** to your Railway service URL (no trailing slash).  
   Next.js **rewrites** proxy `/api/*` from Vercel to Railway so the browser stays same-origin and Mongo is only hit on Railway.
4. You do **not** need `MONGODB_URI` on Vercel if every `/api` call is proxied. If you remove `API_UPSTREAM` and serve API on Vercel instead, add `MONGODB_URI` there too.

### Local dev

Copy `.env.local.example` to `.env.local`, set `MONGODB_URI`, run `npm run dev`.  
If Mongo is unavailable locally, the app can fall back to in-memory demo data unless
`MONGODB_FALLBACK=false`. In **production**, that fallback is **off** by default so
bad credentials fail loudly.

### Stripe / email

Copy values from `.env.production.example` when you connect live checkout and SMTP.

## Brand

The UI uses the PDF palette exactly:

- `#FF007D`
- `#1E3951`
- `#FFFFFF`
- `#449883`
- `#D07D7A`
- `#E3C678`
- `#FBF3A7`
- `#262626`

## Next Build Steps

Connect PostgreSQL, authentication, live Stripe Checkout, email delivery,
file storage for before/after photos, and map/geocoding services.
