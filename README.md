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

The TanStack Start Vite plugin generates `src/routeTree.gen.ts` during development and production builds. The generated file is intentionally ignored by Git.

## Meta publishing

The protected dashboard at `/dashboard/meta` connects a Meta user, lets an operator choose a Facebook Page and its linked Instagram Business account, creates drafts, schedules posts, and publishes through the Graph API. Configure the `META_*` values in `.env.example` as deployment secrets and add the callback URL to the Meta app.

Instagram publishing requires a public HTTPS URL for each image or video, per Meta's Content Publishing API. Facebook Page photo/video posts can also use a file selected in the dashboard. Scheduled drafts are persisted encrypted; invoke `processScheduledPosts()` from your platform's authenticated scheduled job (or use the dashboard's **Publish due posts** action) to release due work.
