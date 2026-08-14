# Framer design exporter

A Framer plugin that serialises a Framer page to JSON so the design can be
rebuilt faithfully in this repo.

## Why this exists

This project's build environment has no general web access — outbound HTTPS runs
through an allowlist proxy, and every Framer host is denied:

```
framer.com                          403 CONNECT
www.framer.com                      403 CONNECT
framer.website                      403 CONNECT
*.framer.app                        403 CONNECT
```

`example.com` and `wikipedia.org` are denied too, so this is not Framer-specific
and publishing the design elsewhere does not help. The design has to be carried
in by hand. This plugin is the highest-fidelity way to do that: it reads the
canvas directly rather than relying on screenshots, so spacing, type scale,
colour and hierarchy come across as data instead of being eyeballed.

## What it exports

Walking from the page root (or the current selection), for every layer:

- node type, name and id, and the parent/child tree
- geometry — position, size, measured rect
- layout — padding, gap, direction, alignment, distribution
- typography — font, size, weight, line height, letter spacing, heading tag
- colour — background, text colour, border radius, opacity
- text content, and link targets

Images are **not** included — only the structure. That is deliberate for this
phase.

Rather than reading a hand-written list of properties, it copies every plain
serialisable value off each node and its prototype chain. Framer's node shape
varies by type and SDK version, so enumerating keys by hand would silently drop
whatever was forgotten.

## Running it

```bash
cd tools/framer-export
npm install
npm run dev
```

Then in Framer: **Menu → Plugins → Development → Open Development Plugin**, and
point it at the dev server. Open the page you want, click **Export whole page**,
then **Download JSON**.

Send the resulting `framer-design-export.json` back — uploading it in chat
works, as does committing it to this repo.

## Notes

- `npx tsc --noEmit` reports errors inside `node_modules/@framer/plugin`. Those
  are bugs in the SDK's own type declarations, not this plugin — `src/` is
  clean and `npm run build` succeeds.
- This directory is excluded from the app's tsconfig; it is a separate project
  with its own dependencies and is not part of the site build or deployment.
