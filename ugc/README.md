# JAK3FFECT — Jacob Ellis UGC portfolio

Standalone static site. No build step, no dependencies: `index.html` plus
`assets/`. This directory is the **deploy root**, so `assets/…` in the HTML
resolves to `ugc/assets/…` here.

Kept separate from the Ellis AI Studio app on purpose — different brand,
different domain. The founder copy names Ellis AI Studio but deliberately does
not link to it; see the note in `SITE_CONFIG` before adding a URL.

## Production domain

`https://jak3ffect.com` — hardcoded in four places in `<head>`: `canonical`,
`og:url`, `og:image`, `twitter:image`. Link-preview crawlers (iMessage, Slack,
Discord, X, LinkedIn, Facebook) read these as static HTML and do not run
JavaScript, so they must stay absolute literals. If the domain changes, update
all four together — a relative `og:image` silently breaks every preview.

The OG image is `assets/og-image.jpg`, 1200×630, matching the declared
`og:image:width` / `og:image:height`.

## Contact form

Submissions reach **Jake@ellisaistudio.com**. With `SITE_CONFIG.formEndpoint`
left `null`, a validated submission opens the visitor's mail client pre-filled
with every field, addressed to Jake — no account, key, or third party needed.
The status message never claims the mail was sent, because the visitor still
has to press send. This mirrors the fallback the Ellis AI Studio audit form
already uses.

To upgrade to silent background submission, set `SITE_CONFIG.formEndpoint` to a
form backend and change nothing else. The mail-client handoff then becomes the
fallback if that request fails:

1. Create an account at formspree.io using Jake@ellisaistudio.com
2. Create a form, set its notification email to Jake@ellisaistudio.com
3. Paste the endpoint (`https://formspree.io/f/xxxxxxxx`) into `formEndpoint`

Formspree's form endpoint is public by design — no secret belongs in this file.

## Deploying

Any static host works. Point it at this directory as the site root and map
`jak3ffect.com` to it. Nothing here is served by the TanStack app in `src/`, so
publishing the main site does not publish this, and vice versa.
