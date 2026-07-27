import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";

const load = createServerFn({ method: "GET" }).handler(async () => (await import("~/lib/google-calendar.server")).connection());
const connect = createServerFn({ method: "POST" }).handler(async () => ({ url: (await import("~/lib/google-calendar.server")).authorizationUrl() }));
const sync = createServerFn({ method: "POST" }).handler(async () => (await import("~/lib/google-calendar.server")).syncContentCalendar());
export const Route = createFileRoute("/dashboard/google-calendar")({ loader: () => load(), component: GoogleCalendar });
function GoogleCalendar() { const data = Route.useLoaderData(); const begin = useServerFn(connect); const run = useServerFn(sync); const [message, setMessage] = useState(""); return <main className="wrap" style={{ padding: "96px 0" }}><p className="eyebrow">Content OS integration</p><h1>Google Calendar</h1>{!data.configured ? <p>{data.message}</p> : !data.connected ? <><p>Connect Google Calendar to mirror approved Content OS publishing slots as calendar events.</p><button className="button" onClick={() => void begin().then((result) => window.location.assign(result.url)).catch((error: Error) => setMessage(error.message))}>Connect Google Calendar</button></> : <><p>Connected{data.email ? ` as ${data.email}` : ""}.</p><button className="button" onClick={() => void run().then((result) => setMessage(`${result.created} events created; ${result.existing} already synced.`)).catch((error: Error) => setMessage(error.message))}>Sync Content OS calendar</button></>}<p role="status">{message}</p><Link to="/dashboard/content-studio">Return to Content OS</Link></main>; }
