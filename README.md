# Ellis AI Studio

Ellis AI Studio designs, builds, and manages AI-powered growth infrastructure: intelligent websites, custom software, AI agents, business automation, and operational intelligence for businesses.

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run typecheck
npm run build
```

## Mission Control local server

Mission Control is supervised as three coordinated local services: the HTTPS dashboard, the Pluto dispatcher, and the learning loop. After `SUPABASE_DATABASE_URL` and the local HTTPS certificate settings are configured in `.env` / `.env.local`, start all three together with:

```bash
npm run start:mission-control
```

Use `Ctrl+C` in that terminal to stop all three services cleanly. The dashboard is available at `https://127.0.0.1:3000/dashboard/mission-control`. Before the first start, run the non-destructive runtime verification:

```bash
npm run check:mission-control
```

The TanStack Start Vite plugin generates `src/routeTree.gen.ts` during development and production builds. The generated file is intentionally ignored by Git.

## Meta publishing

The protected dashboard at `/dashboard/meta` connects a Meta user, lets an operator choose a Facebook Page and its linked Instagram Business account, creates drafts, schedules posts, and publishes through the Graph API. Configure the `META_*` values in `.env.example` as deployment secrets and add the callback URL to the Meta app.

Instagram publishing requires a public HTTPS URL for each image or video, per Meta's Content Publishing API. Facebook Page photo/video posts can also use a file selected in the dashboard. Scheduled drafts are persisted encrypted; invoke `processScheduledPosts()` from your platform's authenticated scheduled job (or use the dashboard's **Publish due posts** action) to release due work.
