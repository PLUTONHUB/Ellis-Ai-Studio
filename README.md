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
