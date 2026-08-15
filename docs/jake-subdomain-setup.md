# `jake.ellisaistudio.com` — how to attach it

Status: **not yet attached.** The page is built and reviewable at `/jake` on the
preview Worker. Nothing below has been executed, and no production deploy or DNS
change has been made.

## What the inspection found

Before changing any routing I checked how the apex is currently bound:

- `wrangler.jsonc` declares **no** `routes` and **no** `custom_domain`. It only
  sets `name`, `compatibility_date`, `compatibility_flags` and `main`.
- `ellisaistudio.com` nevertheless resolves to the `ellis-ai-studio` Worker.

So the apex is bound **outside the repository** — in the Cloudflare dashboard,
as a Custom Domain or route on the Worker. The repo is not the source of truth
for domain binding on this project.

## Why the route was not added to `wrangler.jsonc`

Two independent reasons, both of which would have caused real damage:

**1. The preview Worker would have stolen the subdomain.**
`.github/workflows/deploy-preview.yml` deploys with
`npx wrangler deploy --name ellis-ai-studio-preview` against the *same*
`wrangler.jsonc`. `--name` overrides only the Worker name — every other field,
including `routes`, is still applied. Adding the custom domain to that file
would have pointed `jake.ellisaistudio.com` at the **preview** Worker on the
next branch push, not production.

**2. A separate production config file would not be honoured.**
The Cloudflare Vite plugin flattens the config at build time and writes
`dist/server/wrangler.json` with `"configPath"` baked in. `wrangler deploy`
resolves that generated file, which is why `--name` works but `--env` does not
(`"definedEnvironments": []`). Passing `-c wrangler.production.jsonc` at deploy
time would not reliably override the generated config, and a config lacking the
plugin-generated `main`/`assets` fields would break the deploy.

Adding a partial `routes` array also risks conflicting with the dashboard-managed
apex binding, which requirement 3 explicitly rules out.

**Conclusion:** bind the subdomain the same way the apex is already bound —
outside the repo. That keeps preview and production deploying from byte-identical
config and cannot affect `ellisaistudio.com`.

## The exact step to run — after design approval

Cloudflare dashboard → **Workers & Pages** → `ellis-ai-studio` → **Settings** →
**Domains & Routes** → **Add** → **Custom Domain**:

```
jake.ellisaistudio.com
```

Cloudflare creates the proxied DNS record automatically. **No manual DNS record
is required** when using Custom Domain on a zone Cloudflare already manages.

If the zone is *not* on Cloudflare DNS, or the automatic record fails, create it
by hand instead:

| Field   | Value                                    |
| ------- | ---------------------------------------- |
| Type    | `CNAME`                                  |
| Name    | `jake`                                   |
| Target  | `ellis-ai-studio.<account-subdomain>.workers.dev` |
| Proxy   | Proxied (orange cloud) — **required**    |
| TTL     | Auto                                     |

Account ID (from `deploy-worker.yml`): `098e2f8f23724ea2bb0587b33f8309f3`.

## Serving the portfolio at the subdomain root

A Custom Domain sends `jake.ellisaistudio.com/*` to the Worker, which routes by
path — so the root would render the studio home page, not the portfolio. One
more rule maps the host to the page.

Cloudflare dashboard → the `ellisaistudio.com` zone → **Rules** →
**Redirect Rules** (or **Transform Rules → Rewrite URL** for a silent rewrite):

- **When:** `http.host eq "jake.ellisaistudio.com" and http.request.uri.path eq "/"`
- **Then:** rewrite path to `/jake`

Use a **Rewrite** rather than a Redirect if the URL should stay clean at
`jake.ellisaistudio.com/`. A redirect is simpler but exposes `/jake` in the bar.

This was deliberately not implemented in application code: TanStack Start does
not expose the request host to `beforeLoad` in the version pinned here
(`@tanstack/react-start` has no `getWebRequest` export in `./server`), and
adding a custom server entry would mean changing `main` in `wrangler.jsonc` —
a production-behaviour change this task is scoped out of.

## After the subdomain is live

`src/lib/seo.ts` hardcodes `siteUrl = "https://ellisaistudio.com"`, so the
portfolio's canonical and Open Graph URLs currently resolve to
`https://ellisaistudio.com/jake`. Once the subdomain is the public address,
that page's `pageHead` call should be given an absolute override so canonical,
`og:url` and `twitter:` tags point at `https://jake.ellisaistudio.com/`.
Left alone for now because changing `siteUrl` affects every page on the site.
