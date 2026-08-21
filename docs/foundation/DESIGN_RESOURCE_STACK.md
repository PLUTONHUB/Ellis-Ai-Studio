# Design Resource Stack

The vetted set of free design tooling Ellis builds with, so delivery starts from a known-good stack instead of re-researching it per project. Visual authority remains [Brand Design System](BRAND_DESIGN_SYSTEM.md); this document only decides *what we reach for*, never *how it should look*.

Every entry below is free to use commercially and was license-checked against the project's own repository or site. Anything not on this list needs a license check before it reaches client work.

## Two different contexts

**This repository** already has a hand-built design system: tokens in `src/styles/system/tokens.css`, self-hosted Geist, and CSS scroll-driven reveals in `base.css`. It takes **no** component library and **no** animation library. Adding either would duplicate a system that already works and would break the token discipline.

**Client work** starts from this stack. The default is the smallest set that clears the brief.

## Agent tooling

Design quality from an AI agent is a tooling problem before it is a taste problem. Install all four.

| Tool | Install | Why |
| --- | --- | --- |
| UI UX Pro Max | `npx ui-ux-pro-max-cli init` | Searchable styles, palettes, font pairings, motion presets, per-stack rules. Also carries this list — `--domain resources` |
| Frontend Design (Anthropic) | `/plugin install frontend-design@claude-plugins-official` | Forces a deliberate visual direction before code |
| Web Design Guidelines (Vercel) | `curl -fsSL https://vercel.com/design/guidelines/install \| bash` | Audits finished UI against 100+ interaction and a11y rules |
| Chrome DevTools MCP | `claude mcp add chrome-devtools npx chrome-devtools-mcp@latest` | The agent sees the rendered page and real Core Web Vitals, not just source |

Build with the first two, audit with the third, verify with the fourth. An unverified build claim is not a delivery.

## Interface

| Need | Pick | License |
| --- | --- | --- |
| Application UI (dashboards, forms, tables) | [shadcn/ui](https://ui.shadcn.com) | MIT |
| Marketing sections | [Tailark](https://github.com/tailark/blocks), [Magic UI](https://magicui.design) | MIT |
| No React build (Astro, Blade, plain HTML) | [HyperUI](https://www.hyperui.dev) | MIT |
| Backend-rendered widgets | [Flowbite](https://flowbite.com), [Preline](https://preline.co) | MIT (Preline adds Fair Use terms) |
| Accessibility primitives | [Radix](https://www.radix-ui.com/primitives) | MIT |

One library per project. Mixing two is the fastest way to a site that looks assembled rather than designed.

## Motion

Calm motion is a brand rule, not a taste preference — fade, translate, purposeful sequencing, nothing else.

| Need | Pick | Note |
| --- | --- | --- |
| Reveals, hovers, page transitions | Native CSS (`animation-timeline: view()`, View Transitions API) | What this site uses. Reach here first |
| Sequenced or art-directed motion | [GSAP](https://gsap.com) | Free including every former Club plugin since April 2025 |
| React component motion | [Motion](https://motion.dev) | MIT core |
| Scroll feel | [Lenis](https://lenis.dev) | ~3.5KB, the cheapest perceived-quality win |
| Designer-authored vector animation | [Lottie](https://lottiefiles.com) (playback) or [Rive](https://rive.app) (reacts to state) | Marketplace assets are licensed per asset |

Every motion decision honours `prefers-reduced-motion`, and no animation touches `width`, `height` or `margin`.

## Assets

Icons: [Lucide](https://lucide.dev) (ISC) as default, [Phosphor](https://phosphoricons.com) (MIT) where weight range matters. One set per project — mixed icon sets are the clearest visual tell of machine-assembled UI.

Type: self-host via [Google Fonts](https://fonts.google.com) (OFL) or [Fontshare](https://www.fontshare.com) when the brief needs a display face that does not read as generic. Never link a font CDN.

Imagery: [Unsplash](https://unsplash.com) and [Pexels](https://www.pexels.com), both free commercially with no attribution required, both compressed to AVIF/WebP before shipping. Illustration is [unDraw](https://undraw.co/illustrations), recolored to brand. All of it stays inside the brand rule against stock "AI" visuals.

Color: [Radix Colors](https://www.radix-ui.com/colors) for scales that stay accessible by construction; [oklch.com](https://oklch.com) for perceptually even steps.

## License traps

Checked, and worth remembering — each one is a real constraint on paid work:

- **Astroship** free version is GPL-3.0, not MIT. Copyleft follows derivative work.
- **Preline** carries a Fair Use clause forbidding a directly competing product.
- **Theatre.js** studio is AGPL-3.0 and is dev-only; only the Apache-2.0 core may ship.
- **LottieFiles** assets are licensed individually — free to download is not free to use.
- **Iconify** ships sets under their own separate licenses.
- **Aceternity** Pro blocks and templates are paid; only the free components are open.

Anything GPL or AGPL is out for client deliverables unless the client has explicitly accepted the terms in writing.

Delivery obligations remain [Client Delivery Standard](CLIENT_DELIVERY_STANDARD.md); creative prompt authority remains [Design Prompt Library](DESIGN_PROMPT_LIBRARY.md).
