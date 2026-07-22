import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { completeAuthorization } from "~/lib/google-business.server";

const finishOauth = createServerFn({ method: "POST" }).validator((data: { code: string; state: string }) => data).handler(({ data }) => completeAuthorization(data.code, data.state));

export const Route = createFileRoute("/dashboard/google-business-callback")({ validateSearch: (search: Record<string, unknown>) => ({ code: typeof search.code === "string" ? search.code : "", state: typeof search.state === "string" ? search.state : "", error: typeof search.error === "string" ? search.error : "" }), component: GoogleBusinessCallback });

function GoogleBusinessCallback() {
  const search = Route.useSearch(); const finish = useServerFn(finishOauth); const [message, setMessage] = useState(search.error ? `Google denied access: ${search.error}` : "Completing secure connection…");
  useEffect(() => { if (search.error || !search.code || !search.state) return; void finish({ data: { code: search.code, state: search.state } }).then(() => setMessage("Google Business Profile is connected.")).catch((reason) => setMessage(reason instanceof Error ? reason.message : "Connection failed.")); }, [finish, search.code, search.error, search.state]);
  return <main className="wrap" style={{ padding: "96px 0" }}><p className="eyebrow">Google Business Profile</p><h1>Connection status</h1><p>{message}</p><Link className="button" to="/dashboard/google-business">Return to dashboard</Link></main>;
}
