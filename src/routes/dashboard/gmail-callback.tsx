import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";

const finish = createServerFn({ method: "POST" }).validator((data: { code: string; state: string }) => data).handler(async ({ data }) => (await import("~/lib/gmail.server")).googleAuthService.finish(data.code, data.state));

export const Route = createFileRoute("/dashboard/gmail-callback")({
  validateSearch: (search: Record<string, unknown>) => ({ code: typeof search.code === "string" ? search.code : "", state: typeof search.state === "string" ? search.state : "", error: typeof search.error === "string" ? search.error : "" }),
  component: GmailCallback,
});

function GmailCallback() {
  const search = Route.useSearch(); const complete = useServerFn(finish); const [message, setMessage] = useState(search.error ? `Google denied Gmail access: ${search.error}` : "Completing the secure Gmail connection…");
  useEffect(() => { if (search.error || !search.code || !search.state) return; void complete({ data: { code: search.code, state: search.state } }).then((result) => setMessage(`${result.email} is connected to Pluto Mail.`)).catch((reason) => setMessage(reason instanceof Error ? reason.message : "Gmail connection failed.")); }, [complete, search.code, search.error, search.state]);
  return <main className="mail-callback"><p>PLUTO MAIL</p><h1>Gmail connection</h1><span role={search.error ? "alert" : "status"}>{message}</span><Link to="/dashboard/mail">Return to Pluto Mail</Link></main>;
}
