import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import type { GmailConnection } from "~/lib/gmail.server";
import "~/styles/pluto-mail.css";

const status = createServerFn({ method: "GET" }).handler(async () => (await import("~/lib/gmail.server")).googleAuthService.connection());
const unlock = createServerFn({ method: "POST" }).validator((data: { accessToken: string }) => data).handler(async ({ data }) => (await import("~/lib/gmail.server")).googleAuthService.unlock(data.accessToken));
const connect = createServerFn({ method: "POST" }).handler(async () => ({ url: (await import("~/lib/gmail.server")).googleAuthService.authorizationUrl() }));
const disconnect = createServerFn({ method: "POST" }).handler(async () => (await import("~/lib/gmail.server")).googleAuthService.disconnect());

export const Route = createFileRoute("/dashboard/connected-accounts")({ loader: () => status(), component: ConnectedAccounts });

function ConnectedAccounts() {
  const data = Route.useLoaderData(); const unlockFn = useServerFn(unlock); const connectFn = useServerFn(connect); const disconnectFn = useServerFn(disconnect); const [token, setToken] = useState(""); const [notice, setNotice] = useState("");
  if (data.accessRequired) return <main className="mail-access"><p>PLUTO / CONNECTED ACCOUNTS</p><h1>Unlock communications.</h1><form onSubmit={(event) => { event.preventDefault(); void unlockFn({ data: { accessToken: token } }).then(() => window.location.reload()).catch((error) => setNotice(error instanceof Error ? error.message : "Access failed.")); }}><input type="password" aria-label="Dashboard access token" placeholder="Dashboard access token" value={token} onChange={(event) => setToken(event.target.value)} required /><button>Continue</button></form><span role="alert">{notice}</span></main>;
  return <main className="accounts-page"><header><div><p>SETTINGS / CONNECTED ACCOUNTS</p><h1>Communication infrastructure</h1><span>Connections are encrypted at rest and available only to the Ellis workspace.</span></div><Link to="/dashboard/mail">Open Pluto Mail <b>↗</b></Link></header><section className="account-grid"><GmailCard data={data} onConnect={() => void connectFn().then(({ url }) => window.location.assign(url)).catch((error) => setNotice(error instanceof Error ? error.message : "Connection failed."))} onDisconnect={() => void disconnectFn().then(() => window.location.reload()).catch((error) => setNotice(error instanceof Error ? error.message : "Disconnect failed."))} /><article className="account-placeholder"><i>in</i><div><small>LinkedIn</small><strong>Social publishing</strong><span>Managed separately in Social Accounts.</span></div><Link to="/dashboard/social-accounts">Manage</Link></article></section>{notice && <p className="mail-notice" role="status">{notice}</p>}</main>;
}

function GmailCard({ data, onConnect, onDisconnect }: { data: GmailConnection; onConnect: () => void; onDisconnect: () => void }) {
  const expired = Boolean(data.expiresAt && data.expiresAt < Date.now());
  return <article className={`account-card ${data.connected ? "connected" : ""}`}><div className="account-icon gmail">M</div><div className="account-copy"><small>Gmail</small><strong>{data.connected ? data.email : "Not connected"}</strong><span>{data.connected ? expired ? "Reconnect required" : "Connected securely" : data.configured ? "Connect an inbox to begin" : "Configuration required"}</span></div><div className="account-meta"><em className={data.connected && !expired ? "healthy" : "idle"}>{data.connected && !expired ? "● Connected" : "○ Disconnected"}</em>{data.lastSyncAt && <time>Last sync {new Date(data.lastSyncAt).toLocaleString()}</time>}</div>{data.connected ? <div className="account-actions"><button onClick={onConnect}>{expired ? "Reconnect" : "Reconnect"}</button><button className="quiet" onClick={onDisconnect}>Disconnect</button></div> : <button className="connect" disabled={!data.configured} onClick={onConnect}>{data.configured ? "Connect Gmail" : "Configure Gmail"}</button>}</article>;
}
