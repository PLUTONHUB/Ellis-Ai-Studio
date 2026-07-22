import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { authorizationUrl, dashboard, unlockDashboard } from "~/lib/google-business.server";

const loadDashboard = createServerFn({ method: "GET" }).handler(() => dashboard());
const unlock = createServerFn({ method: "POST" }).validator((data: { accessToken: string }) => data).handler(({ data }) => unlockDashboard(data.accessToken));
const beginOauth = createServerFn({ method: "POST" }).handler(() => ({ url: authorizationUrl() }));

export const Route = createFileRoute("/dashboard/google-business")({ loader: () => loadDashboard(), component: GoogleBusinessDashboard });

function GoogleBusinessDashboard() {
  const data = Route.useLoaderData();
  return <main className="wrap" style={{ padding: "96px 0" }}><p className="eyebrow">Internal dashboard</p><h1>Google Business Profile</h1>{data.accessRequired ? <UnlockPanel /> : !data.configured ? <p>{data.message}</p> : !data.connected ? <ConnectPanel message={data.message} /> : <ConnectedProfiles data={data} />}</main>;
}

function UnlockPanel() {
  const [accessToken, setAccessToken] = useState(""); const [error, setError] = useState(""); const unlockFn = useServerFn(unlock);
  return <form onSubmit={async (event) => { event.preventDefault(); try { await unlockFn({ data: { accessToken } }); window.location.reload(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Access failed."); } }} style={{ maxWidth: 440 }}><p>This route is protected. Enter the server-configured dashboard access token.</p><label style={{ display: "grid", gap: 8 }}>Access token<input type="password" value={accessToken} onChange={(event) => setAccessToken(event.target.value)} required /></label><button className="button" type="submit" style={{ marginTop: 16 }}>Unlock dashboard</button>{error && <p role="alert">{error}</p>}</form>;
}

function ConnectPanel({ message }: { message?: string }) {
  const [error, setError] = useState(""); const connect = useServerFn(beginOauth);
  return <section><p>{message ?? "No Business Profile account is connected."}</p><button className="button" type="button" onClick={async () => { try { const result = await connect(); window.location.assign(result.url); } catch (reason) { setError(reason instanceof Error ? reason.message : "OAuth could not start."); } }}>Connect Google Business Profile</button>{error && <p role="alert">{error}</p>}<p style={{ marginTop: 20 }}>Connection grants read-only retrieval for this milestone. It cannot post, edit a profile, or reply to reviews.</p></section>;
}

function ConnectedProfiles({ data }: { data: Awaited<ReturnType<typeof dashboard>> }) {
  return <section><p>{data.accounts.length} authorized account{data.accounts.length === 1 ? "" : "s"} · {data.locations.length} location{data.locations.length === 1 ? "" : "s"}</p>{data.locations.map((location) => <article key={location.id} style={{ borderTop: "1px solid #dbe3df", padding: "28px 0" }}><h2 style={{ fontSize: 30 }}>{location.name}</h2><p>{location.address}</p><p>{location.phone ?? "Phone not available"}{location.website ? <> · <a href={location.website}>{location.website}</a></> : null}</p><p><strong>Categories:</strong> {location.categories.join(", ") || "Not available"}</p><p><strong>Hours:</strong> {location.hours.join("; ") || "Not available"}</p><p><strong>Verification:</strong> {location.verificationStatus.replace("_", " ")}</p></article>)}</section>;
}
