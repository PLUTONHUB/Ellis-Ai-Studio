# Ellis AI Studio

Ellis AI Studio is a TanStack Start + Vite application that powers the Ellis marketing site and the Pluto AI operating system shell.

## Stack

- TanStack Start
- TanStack Router file-based routes
- React 19
- Vite
- Tailwind CSS v4
- Bun production publish server (`serve.ts`)

## Project layout

- `src/routes/__root.tsx` — HTML shell, metadata, global document layout
- `src/routes/index.tsx` — Ellis homepage + Pluto console
- `src/routes/proposal.tsx` — friction audit proposal calculator
- `src/routes/onboarding.tsx` — onboarding tracker and launch readiness flow
- `src/components/` — reusable Ellis and Pluto UI
- `src/lib/pluto/` — Pluto natural-language command parsing
- `src/services/plutoEngine.js` — classic Pluto runtime commands (memory, tasks, date/time)
- `src/styles/app.css` — Tailwind entrypoint and global styling
- `src/router.tsx` — TanStack router wiring
- `vite.config.ts` — TanStack Start + Vite configuration

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Type-check the project:

```bash
npm run typecheck
```

## Routing

Routes are generated from files in `src/routes`. The TanStack Start Vite plugin generates `src/routeTree.gen.ts` during development and build. That file is intentionally gitignored.

## Production publishing

The repository still includes the original Bun-based publishing flow:

```bash
bun run publish
```

That command rebuilds the app and restarts the Bun server defined in `serve.ts`.

## Google Workspace integration

Ellis AI Studio Free Friction Audit bookings create a Google Calendar event with a Google Meet link and Gmail confirmation through a server-only Cloudflare Worker function. Follow [Google Cloud and Google Workspace setup](docs/GOOGLE_WORKSPACE.md) to configure domain-wide delegation and Worker Secrets. Do not add Google credentials to `.env.local`, `wrangler.jsonc`, or client-side `VITE_` variables.

## Friction Audit Pipeline

Completed Free Friction Audit bookings also generate a server-only, editable research draft for internal review. See [Friction Audit Pipeline](docs/FRICTION_AUDIT_PIPELINE.md) for the intake, persistence, and review workflow.

## Stripe Checkout

Client deposits use server-side Stripe Checkout. The browser never receives `STRIPE_SECRET_KEY` or the webhook signing secret.

1. Apply `supabase/migrations/20260718000000_create_client_proposals.sql` in the Supabase SQL Editor for project `tuqzomstsvzymndvxbto`.
2. Add these Cloudflare Worker secrets:

   ```text
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   PUBLIC_APP_URL=https://ellisaistudio.com
   ```

3. In Stripe Dashboard, create a webhook endpoint at `https://ellisaistudio.com/api/stripe/webhook`, subscribe it to `checkout.session.completed`, and save its signing secret as `STRIPE_WEBHOOK_SECRET`.
4. Set `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...` only in the secure build environment. Stripe Checkout redirects to Stripe-hosted payment, so this value is intentionally not bundled or used by the current frontend.

The API routes are `POST /_serverFn/...` for Checkout creation and confirmation (TanStack Start server functions) and `POST /api/stripe/webhook` for Stripe. The webhook is idempotent: it marks the proposal paid, records the Checkout Session and Payment Intent, activates the workspace, and sends the welcome email only once.
## Client onboarding and business operations

Apply `supabase/migrations/20260719000000_create_client_operations.sql` after the existing research and proposal migrations. It creates the server-only `client_intakes` table plus the internal `prospects` and `prospect_timeline_events` foundation.

The guided `/onboarding` form saves business information, goals, and selected software through a TanStack Start server function. When a website is supplied and protected research is enabled, the existing business research and Friction Audit services create the client-ready executive foundation. Do not expose `SUPABASE_SERVICE_ROLE_KEY` or the research feature flag to the browser.

The `prospects` tables are intentionally server-only. An internal operations dashboard must be placed behind authenticated staff access before release; no client route may query those tables.
