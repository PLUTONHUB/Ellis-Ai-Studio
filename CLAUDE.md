# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

## Project

The Ellis AI Studio website: TanStack Start (React 19 + Vite + Tailwind pipeline), served on port 3000. Marketing pages plus a protected `/dashboard` that drives Meta publishing, growth-engine and prospect-intelligence workflows through server functions.

```
src/
  routes/          # file-based routes; a file here becomes a URL
    __root.tsx     # HTML shell, head tags, font preloads
    dashboard/     # protected operator screens
  components/      # layout, pages, forms
  lib/             # *.server.ts — server-only integrations (Meta, Google, intake)
  styles/system/   # the design system (see below)
docs/foundation/   # the business operating system; authoritative, start here
docs/architecture/ # ADRs — major changes need one
```

## Commands

```bash
npm install
npm run dev          # vite dev
npm run typecheck    # tsc --noEmit — run before every commit
npm run build
bun run publish      # rebuild + restart the server on port 3000
```

Editing files does not update the live site; `bun run publish` does. The server log is `.run/server.log`. `routeTree.gen.ts` is generated during dev/build and is intentionally git-ignored.

`npm test` is wired to `tests/*.test.ts`, which does not exist yet — it will fail until tests are added.

## Design system

The visual layer is hand-built and token-driven. Read `docs/foundation/BRAND_DESIGN_SYSTEM.md` before changing anything visual.

- **`src/styles/system/tokens.css` is the only file allowed to declare a raw colour.** Everything else consumes roles (`--surface-canvas`, `--text-primary`, `--green-700`). A literal hex outside tokens.css is a bug.
- Type is self-hosted Geist and Geist Mono, preloaded in `__root.tsx`. Never add an external font request.
- `base.css` owns layout primitives, typography classes and the motion system. Prefer an existing primitive (`.container`, `.stack-*`, `.section-*`, `.measure`) over new bespoke CSS.
- Motion is CSS-only: `enter`/`reveal` classes driven by `animation-timeline: view()`, durations from `--dur-*`, easing from `--ease-out`. Every animation has a `prefers-reduced-motion` path. Animate transform and opacity, never `width`/`height`/`margin`.

**Do not add a component library or an animation library to this repository.** The system above already covers it, and either one would break token discipline. That constraint applies here only — client work starts from `docs/foundation/DESIGN_RESOURCE_STACK.md`.

## Design tooling

`docs/foundation/DESIGN_RESOURCE_STACK.md` is the vetted, license-checked set of free design tooling (agent skills, component and motion libraries, templates, asset sources) with the traps that matter for paid work. Consult it before reaching for anything new.

For concrete design decisions — styles, palettes, font pairings, motion presets, per-stack rules — use the `ui-ux-pro-max` skill rather than defaulting to generic choices:

```bash
python3 <skill>/scripts/search.py "<query>" --domain <style|color|typography|ux|resources|...>
```

## Conventions

- Server-only code lives in `src/lib/*.server.ts` and is reached through server functions. Secrets never cross into client bundles; configure them per `.env.example`.
- Content and copy follow `docs/foundation/BRAND_POSITIONING.md`: evidence-led, no unsupported outcome claims.
- Major architectural or business changes need an ADR in `docs/architecture/` and must clear the business validation gates.

## Git workflow

Never push directly to `main`. Branch, commit, push, open a PR.
