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

## Production Setup

Copy `.env.example` to `.env.local` and configure Stripe and email credentials.
The current API routes intentionally return placeholders until live keys,
database persistence, and webhook handling are connected.

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
