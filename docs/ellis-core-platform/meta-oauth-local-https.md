# Meta OAuth local HTTPS

Meta OAuth local development uses `https://127.0.0.1:3000/dashboard/meta-callback`.

## One-time setup

Run `npm run setup:https`. It creates a self-signed certificate at `.certs/ellis-local-dev.pfx` and a local-only `.env.local` containing its random passphrase. Both are ignored by Git.

Trust the generated certificate in the browser or operating system certificate manager, then start the application with `npm run dev` and use `https://127.0.0.1:3000/dashboard/meta`.

In Meta Developer App → Facebook Login → Settings, save this exact Valid OAuth Redirect URI:

`https://127.0.0.1:3000/dashboard/meta-callback`

Do not register the HTTP URL, `localhost`, a different port, a trailing slash, or query parameters. Production uses the separately configured HTTPS public callback URI.

## Security

The private PFX and its passphrase are workstation-specific. They are never committed or deployed. Vite refuses to start the local dev server without them so an OAuth configuration cannot silently fall back to HTTP.
