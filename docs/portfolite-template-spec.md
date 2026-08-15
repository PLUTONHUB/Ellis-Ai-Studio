# Portfolite — extracted template spec

Condensed from `framer-design-export.json` (canvas root `augiA20Il`, 498 nodes,
exported 2026-08-14). This is the structural source of truth for Jake's portfolio
page. **No images are recorded here** — the export references Framer-hosted assets
we are deliberately not pulling. Jake supplies media after preview approval.

## Breakpoints

| Name    | Width  | Node          |
| ------- | ------ | ------------- |
| Desktop | 1200px | `WQLkyLRf1` (primary) |
| Tablet  | 810px  | `PwI1GXFJS` (replica) |
| Phone   | 390px  | `b42tbywx4` (replica) |

Total page height: 10054 / 12895 / 13262 px respectively.

## Tokens

**Color** — the palette is four values plus one card surface:

| Token        | Value                      |
| ------------ | -------------------------- |
| Black        | `rgb(0,0,0)` (page bg)     |
| white \| 100 | `rgb(255,255,255)`         |
| white 65     | `rgba(255,255,255,0.65)`   |
| Border       | `rgba(255,255,255,0.1)`    |
| card bg      | `rgb(13,13,13)`            |

**Type** — Satoshi for display, Inter Display for body, Inter for small text.

| Style      | Tag | Family        | 390  | 810  | 1200+ | Line height |
| ---------- | --- | ------------- | ---- | ---- | ----- | ----------- |
| Heading 1  | h1  | Satoshi 400   | 92   | 44   | 74    | 1em         |
| Heading 2  | h2  | Satoshi 400   | 92   | 44   | 64    | 1em         |
| Body large | p   | Inter Display | 24   | 18   | 20    | 140%        |
| Body 18    | p   | Inter Display | 18   | 18   | 18    | 1.6em       |
| Body 15    | p   | Inter 400     | 15   | 15   | 15    | 1.5em, ls −0.02em |

Note the h1/h2 quirk: the base (mobile) size is the *largest* at 92px and the
810 breakpoint is the smallest at 44px. Framer's `breakpoints` array only
overrides at `minWidth` 810 and 1200, so 390 inherits the 92px base.

**Geometry** — section radius `48px`, images `17px` (process/services/FAQ),
`8px` (testimonial), `4px` (about portrait), stat card `18px`, buttons pill.
Container `max-width: 1600px`. Section padding `100px 80px` desktop →
`80px 18px` phone. Gap scale: 44 / 24 / 16 / 10.

## Section order

1. **hero** `URPShFkVs`
2. **Projects** `V4XhgF18A`
3. **about me section** `zcVcrwOch` (scroll target `#about-me`)
4. **process** `SiZOJLvjy`
5. **Services** `TNZqLa2yL` (scroll target `#services`)
6. **testimonials** `ngMUASqw8`
7. **FAQ's** `oi6PfpD99`

Sections 3–7 each carry an absolutely-positioned `Border` child: inset 0,
`border-radius: 48px`, `1px solid rgba(255,255,255,0.1)`, `z-index: 3`. That
hairline frame is what gives the page its panelled rhythm.

There is **no header/nav in the export.** The hero's `Header+Main` frame
contains only `Main`. The nav in the screenshot is not on the canvas root.

## Section detail

### hero
Padding `160 40 60`, vertical stack, gap 24, `overflow: hidden`.
- Absolute `bg animation` layer (z 0): "Animated Gradient Background" component,
  preset **Mist**, custom colors black/white/black, noise opacity 0.2 scale 0.2,
  rotation −50, scale 0.01, speed 20, swirl 50 (16 iterations), softness 47,
  offset −299, shape Checks @ 45. Plus a locked linear-gradient `Overlay` at z 1.
  Hidden entirely on Phone.
- `Main` (max-width 840, gap 80, padding `40 0`):
  - Pill tag — "Crafting Unique Brand Identities"
  - h1 centered — "Branding that you  need Indeed" (double space is in the source)
  - Body 15 centered, max-width 540
  - Buttons row, gap 16, wrap: **Get Started Now** (external) + **See Projects**
    (scrolls to `eGNiHwp2Y`)
  - `bottom container` (max-width 640, height 38, horizontal, gap 16):
    "Scroll down" · 1px white-10% rule · Phosphor `MouseSimple` duotone 25px ·
    "to see projects". **Hidden on Phone.**
  - `Companies` — Ticker, speed 50, direction left, gap 100, fade 25, height 55,
    5 logo slots (SVG, ~27px tall, opacity 0.65)
- Phone drops padding to `120 18 0` and switches both buttons to the `phone btn` variant.

### Projects
Padding `10 5 100 5`, gap 54. Container max 1600 → Wrapper (gap 44) → Mask
(horizontal, gap 12, align start) → Images Wrapper.

Three columns, each `overflow: hidden`, gap 10:

| Column | Width  | Cards | Desktop y-offset |
| ------ | ------ | ----- | ---------------- |
| Col 1  | `1fr`  | 3     | 103              |
| Col 5  | `1.2fr`| 3     | 0 (taller, leads) |
| Col 6  | `1fr`  | 3     | 103              |

The centre column being wider *and* flush to the top is what creates the
staggered masonry read. Card component `project` — aspect ratio 1.067,
height 343, variants `primary` / `no button` / `mobile`.

- **Tablet**: Col 5 hidden. Two columns.
- **Phone**: all columns stack vertically, single file, `mobile` variant.

Footer row: "All Projects" (Body 18, links `#projects`, smooth scroll) +
**Book a Free Call** button.

### about me section
Padding `100 80`, gap 44, radius 48 + border.

Container (horizontal, gap 44, wrap):
- `more info` (min-width 460, gap 32, padding-right 20)
  - h2 — "Meet Meily"
  - About paragraph, Body 18, **opacity 0.7**, max-width 640
  - 1px rule
  - `Skills` — 7 pills, horizontal wrap, gap 16
  - 1px rule
  - `Experience` — 3 `experience` rows (role / company / year),
    variants `primary` / `mobile`
- `Image` — height 632, min-width 460, aspect 1.067, radius 4

Then, still inside the section:
- `projects text` — "Recent Works" (Body large) + Phosphor `ArrowCircleDown`
  35px, opacity 0.75. **This is the `#projects` scroll target** (`eGNiHwp2Y`).
- 1px rule
- **Projects Carousel** — Carousel component, height 355, gap 10, snap center,
  arrows on, 5 slots. Columns: **4** desktop / **2** tablet / **1** phone.

### process
Padding `100 80`. Container horizontal, gap 44, wrap:
- `Image` — `1fr` × `1fr`, min 460 × 360, radius 17
- `right content` (min 460, gap 24):
  - heading Badge — "Design process"
  - h2 — "Process"
  - Body large, opacity 0.9, max-width 640
  - buttons — Book a Free Call · See Projects
  - 1px rule
  - `Steps` — 3 × `Process` component (step number, title, body, vector icon),
    variants `Desktop` / `Phone`

Phone forces the image to a fixed 260px and stacks everything.

### Services
Padding `100 80`. Container vertical, gap 44:
- `top container` (horizontal, wrap, gap 44)
  - `left container` (min 460, gap 24, padding-right 40): heading Badge
    "Design services" · h2 "Services" · Body large · `Skills` 5 pills ·
    rule · buttons
  - `Image` — height 503, min 460, radius 17
- `Services Bento` — two columns (min 460 each), 2 `service` cards per column.
  Each card: title, vector icon, body copy.
- `More Services` — two stacked Tickers, speed 60, gap 24, fade 25, height 79
  each; **row 1 scrolls left, row 2 scrolls right**. 6 `small badge card`
  slots each (12 total across both rows, 10 unique labels).

Tablet narrows `More Services` to `width: 90%`. Phone reduces ticker gap to 8.

### testimonials
Padding `100 80`, `overflow: hidden`.
- `top container` (horizontal, wrap, gap 44)
  - `Image` — height 503, min 460, radius 8
  - `text content` (min 460, gap 24): badge "Reviews" · h2 "Client Reviews" ·
    Body large opacity 0.9 · buttons (Book a Free Call · See Services →
    scrolls to `TNZqLa2yL`)
- `bottom container` (vertical, gap 24)
  - Ticker — speed 100, **hoverFactor 0.5** (slows on hover), height 500,
    gap 24, 4 `Feedback` slots (portrait, name, role, quote)
  - `Stats` — card bg `#0D0D0D`, radius 18, padding `48 40`, horizontal wrap,
    3 `Stat Card`s separated by 1px × `1fr` white-15% dividers:
    **180+** design projects completed · **96%** client satisfaction rate ·
    **15+** years of experience

On Phone the vertical dividers are hidden and replaced by 75%-width horizontal
rules; padding drops to 24.

### FAQ's
Padding `100 80`. Container horizontal, wrap, align start, gap 44:
- `Left container` (min 460, gap 24): badge "FAQ'S" · h2 "Answers" ·
  Body large · Image (height 503, radius 17) · `Skills` 3 pills · rule ·
  **Book a Free Call** button
- `All FAQs` component (min 460) — accordion, no exposed controls

Carries both the 48px `Border` and an extra locked gradient `Overlay`
(top −115, bottom −76, z 1).

## Page-level fixed layers

- `Smooth-Scroll` — SmoothScroll_Prod, intensity 6 (**hidden on Phone**)
- `Blur Gradient` — fixed, bottom 0, height 100, blur 7, direction `to bottom`
- `Get template` — hidden, delete on rebuild

## Local components inventory

| Component            | Controls |
| -------------------- | -------- |
| `Button`             | variant (Main Button / phone btn), Title, Link, New Tab |
| `Main section tag`   | Text |
| `heading Badge`      | Text |
| `skill`              | Title |
| `service`            | Title, Icon (vectorSetItem), Text |
| `experience`         | variant (primary / mobile), Role, Company, Year |
| `Process`            | variant (Desktop / Phone), Icon, Steps, Title, Text |
| `project`            | variant (primary / no button / mobile), Image, Link, New Tab |
| `Stat Card`          | Number, Text |
| `Feedback`           | Image, Profile Visible, Title, Bio, Description |
| `small badge card`   | Icon, text |
| `All FAQs`           | — |

External modules used: Ticker, Carousel, Phosphor, AnimatedLiquidBackground,
BlurGradient, SmoothScroll.

## Template content to replace

All copy in the export is the template's placeholder persona ("Meily", a Tokyo
brand/package designer) with `behance.net` and `cal.com/rick/get-rick-rolled`
links. **None of it carries over.** The stats (180+ / 96% / 15+), the four
testimonials, and the client logo ticker are fabricated demo data and must not
be reproduced for Jake — real numbers only, or the section is cut.
