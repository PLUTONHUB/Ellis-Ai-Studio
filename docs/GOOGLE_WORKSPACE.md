# Google Cloud and Google Workspace setup

The Ellis AI Studio Friction Audit booking flow runs only in the TanStack Start server function. It uses a Google Cloud service account with Google Workspace domain-wide delegation to create a client folder, create a Calendar event with Google Meet, and send the confirmation email. No Google credential is included in the browser bundle.

## 1. Configure Google Cloud

1. Create or select a Google Cloud project and enable the Gmail API, Google Calendar API, and Google Drive API.
2. Create a service account, enable **Domain-wide delegation**, and create a JSON key.
3. In the Google Workspace Admin console, add the service account's OAuth client ID under Security → API controls → Domain-wide delegation. Authorize these scopes:

   ```text
   https://www.googleapis.com/auth/gmail.send
   https://www.googleapis.com/auth/calendar.events
   https://www.googleapis.com/auth/drive
   ```

4. Choose a Workspace user to impersonate. That user must be able to send mail, manage the selected calendar, and create folders in the selected parent Drive folder. Share the calendar and Drive parent folder with that account when they are not already owned by it.

## 2. Add Cloudflare Worker Secrets

Run these commands from the repository root. Paste the complete service-account JSON only when Wrangler prompts for it; do not place it in `.env.local` or commit it.

```bash
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_JSON
npx wrangler secret put GOOGLE_WORKSPACE_IMPERSONATED_USER
npx wrangler secret put GOOGLE_CALENDAR_ID
npx wrangler secret put GOOGLE_DRIVE_PARENT_FOLDER_ID
npx wrangler secret put PUBLIC_APP_URL
```

| Secret | Value |
| --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Complete JSON key for the delegated Google Cloud service account. |
| `GOOGLE_WORKSPACE_IMPERSONATED_USER` | Workspace mailbox to impersonate, such as `operations@yourdomain.com`. |
| `GOOGLE_CALENDAR_ID` | Calendar ID where Friction Audit sessions are created; use `primary` for the impersonated user's primary calendar. |
| `GOOGLE_DRIVE_PARENT_FOLDER_ID` | ID of the Drive folder that will contain each client folder. |
| `PUBLIC_APP_URL` | Canonical public app URL, for example `https://ellis.example.com`. |

Use the same secret names in the Cloudflare dashboard for preview and production environments. Do not prefix any of them with `VITE_`: Vite exposes `VITE_` values to the client.

## Booking behavior

`bookFrictionAudit` validates the submitted booking and then:

1. creates a client folder in Drive;
2. creates the Calendar event and requests a Google Meet conference;
3. emails the attendee their confirmation, Meet link, and `/onboarding` handoff.

The Calendar API is called with `sendUpdates=all`, so Google also sends its calendar invitation. The function returns only the event ID, Meet link, and onboarding URL—never service-account credentials or OAuth tokens.

## Verify before production

After deployment, submit a test booking using an internal mailbox and confirm that the Drive folder, Calendar event/Meet, Google invitation, and confirmation email all arrive. If token creation fails, verify the service account's domain-wide delegation client ID and scopes. If Calendar or Drive calls fail, verify that the impersonated user can access the configured calendar and folder.
