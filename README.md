# Trim — URL Shortener with Analytics

A MERN-stack URL shortener. Submit a long URL, get a short link. Visit the short link, get redirected. View per-link analytics: total clicks, clicks per day, and referrer breakdown.

**Live**: https://trim-client.vercel.app | **API**: https://trim-server-ylth.onrender.com

---

## Running Locally

### One command (Docker)

The simplest way to run the full backend stack locally:

```bash
git clone https://github.com/aditya0xd/trim_server.git
cd trim_server
docker compose up -d --build
```

This starts the Express API at `http://localhost:5000` and MongoDB at `localhost:27017` with a persistent volume. No local MongoDB install needed.

Then in a separate terminal, start the frontend:

```bash
git clone https://github.com/aditya0xd/trim_client.git
cd trim_client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

### Manual Setup (without Docker)

**Prerequisites**: Node.js v18+, MongoDB running locally or a MongoDB Atlas URI.

**1. Backend**

```bash
cd trim_server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/trim
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm run dev
```

**2. Frontend**

```bash
cd trim_client
npm install
```

Create `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SHORT_BASE_URL=http://localhost:5000
```

```bash
npm run dev
```

### Environment Variables Reference

| Variable | Service | Description |
|---|---|---|
| `PORT` | Backend | Port Express listens on. Render injects this automatically — do not set it manually in production. |
| `MONGO_URI` | Backend | MongoDB connection string. |
| `BASE_URL` | Backend | Domain used to construct short URLs (e.g. `https://trim-server-ylth.onrender.com`). |
| `FRONTEND_URL` | Backend | Allowed CORS origin. In production this must be the exact Vercel URL, no trailing slash. |
| `NODE_ENV` | Backend | Set to `production` to enable strict CORS and production logging. |
| `VITE_API_BASE_URL` | Frontend | Where the frontend sends API requests. |
| `VITE_SHORT_BASE_URL` | Frontend | Base URL displayed when a link is created. |

---

## Architecture Overview

Two separate repos, deployed independently.

```
trim_server/                      → Node.js / Express / TypeScript (Render)
  src/
  ├── modules/
  │   ├── links/                  → Create, list, redirect logic
  │   └── analytics/              → Click recording, aggregation
  ├── middleware/                 → Centralized error handler, 404
  ├── config/                     → Env constants, DB connection
  └── utils/                      → Winston logger, nanoid wrapper, URL validator

trim_client/                      → React / Vite / TypeScript (Vercel)
  src/
  ├── hooks/                      → useLinks, useAnalytics (data fetching + state)
  ├── components/                 → MetricCard, LinksTable, ClicksChart, ReferrerTable
  ├── pages/                      → DashboardPage, CreateLinkPage, AnalyticsPage
  ├── feature/                    → Feature-scoped API services and types
  └── lib/                        → Pure utility/calculation functions
```

**Request flow:**

1. `POST /api/links` — validates the URL, generates a short code, persists a `Link` document, returns the full short URL.
2. `GET /:code` — looks up the `Link` by `shortCode`, fires off a `Click` write and a `$inc` on `clickCount` asynchronously (fire-and-forget so they never block the redirect), then returns a 302.
3. `GET /api/links/:code/analytics` — runs a MongoDB aggregation over the `Click` collection to produce `{ totalClicks, clicksPerDay, topReferrers }`.

The frontend is three pages wired to two custom hooks. The hooks own all fetching and error state. The pages and components are purely presentational.

---

## Design Decisions

### Short-code Generation — Random (nanoid)

Short codes are 7 characters from nanoid's URL-safe 64-character alphabet — roughly 3.5 trillion combinations.

**Why not a counter in base62?** Counters are sequential and therefore enumerable. An attacker can iterate every link in the database by incrementing the code. Random codes provide no such surface.

**Why not a hash of the URL?** Hashing is deterministic — two users shortening the same URL get identical codes. That breaks per-user link ownership and makes custom aliases ambiguous.

**Collision handling:** The service catches MongoDB duplicate-key errors (`code 11000`) on the `shortCode` unique index and retries up to five times with a fresh code. At current scale (~7 chars over 64 symbols) the probability of a collision in a database of one million links is negligible — the retry loop is a correctness guarantee, not an expected code path.

---

### Storing Clicks — Dual-Write (raw events + pre-aggregated counter)

Every redirect does two writes in parallel, fire-and-forget:

- **Raw `Click` document** — stores `linkId`, `timestamp`, `referrer`, and `userAgent`. This is the source of truth for all analytics breakdowns: time series, referrer breakdown, etc., computed via MongoDB aggregation pipelines on read.
- **`clickCount` `$inc` on the `Link` document** — a pre-aggregated counter that makes the "list all links with counts" dashboard query a single cheap `find()` — no aggregation, no join.

**Cost as traffic grows:** The `Click` collection grows one document per click — linear growth with no pruning. Aggregation queries will degrade as the collection grows. The fix at scale is a TTL index to expire events older than N days, or moving analytics into a dedicated time-series store (MongoDB time-series collections, InfluxDB). For MVP traffic this is not a concern. The architecture does not prevent adding either of these later.

---

### Indexes

| Collection | Index | Why |
|---|---|---|
| `links` | `{ shortCode: 1 }` — unique | Every single redirect is a lookup on `shortCode`. Without this index, every redirect is a full collection scan. |
| `clicks` | `{ linkId: 1, timestamp: 1 }` — compound | Every analytics query filters by `linkId` and then groups or sorts by `timestamp`. The compound index covers both criteria in one B-tree scan and eliminates the in-memory sort MongoDB would otherwise do. |

---

### 302 vs. 301

**302 (Temporary Redirect).** The decision is straightforward: a 301 instructs the browser to cache the redirect permanently. After the first visit, the browser skips the server entirely and goes directly to the destination — meaning repeat clicks are never recorded. Analytics breaks silently and completely.

A 302 requires the browser to hit the server on every visit. That is a small, constant latency cost (one extra round-trip). For a product where click tracking is a core feature, that is the only acceptable trade-off. Correctness over marginal latency.

---

## What I'd Do With More Time

- **Auth** — Links are currently global with no ownership. Adding JWT-based auth would scope links to users and gate the analytics view.
- **Link expiry enforcement** — The `expiresAt` field exists on the schema and the create form exposes it, but the redirect handler does not yet check it. A one-line guard and a MongoDB TTL index on `expiresAt` would close this.
- **Rate limiting** — `express-rate-limit` on `POST /api/links` to prevent abuse.
- **TTL index on clicks** — Prune click events older than 90 days automatically to keep the collection bounded.
- **QR code generation** — Generate a downloadable QR code for each short link on the success screen.
- **End-to-end tests** — Playwright tests covering the create → redirect → analytics flow. Unit tests on the service layer (short-code generation, collision retry logic, aggregation output).
- **Bundle splitting** — The frontend JS bundle is ~675 KB. Lazy-loading the analytics page with `React.lazy` would meaningfully reduce initial load time.
