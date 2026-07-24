import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";

const finish = createServerFn({ method: "POST" })
  .validator((data: { code: string; state: string }) => data)
  .handler(async ({ data }) => {
    const { finishCallback } = await import("~/lib/linkedin.server");
    return finishCallback(data.code, data.state);
  });

export const Route = createFileRoute("/dashboard/linkedin-callback")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search.code === "string" ? search.code : "",
    state: typeof search.state === "string" ? search.state : "",
    error: typeof search.error === "string" ? search.error : "",
  }),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const finishOauth = useServerFn(finish);
  const completed = useRef(false);
  const missingResponse = !search.code || !search.state;
  const [message, setMessage] = useState(
    search.error
      ? `LinkedIn denied access: ${search.error}`
      : missingResponse
        ? "No OAuth response received. Start from Connect LinkedIn."
        : "Completing connection…",
  );

  useEffect(() => {
    if (completed.current || search.error || missingResponse) return;
    completed.current = true;
    void finishOauth({ data: { code: search.code, state: search.state } })
      .then((result) => setMessage(result.ok ? "LinkedIn connected." : result.error))
      .catch((reason) => setMessage(reason instanceof Error ? reason.message : "LinkedIn callback request failed."));
  }, [finishOauth, missingResponse, search.code, search.error, search.state]);

  return <main className="wrap" style={{ padding: "96px 0" }}><h1>LinkedIn connection</h1><p role={search.error || missingResponse ? "alert" : "status"}>{message}</p><Link className="button" to="/dashboard/linkedin">Return to LinkedIn</Link></main>;
}
