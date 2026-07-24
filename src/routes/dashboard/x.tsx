import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
const load=createServerFn({method:"GET"}).handler(async()=> (await import("~/lib/x.server")).dashboard());
export const Route=createFileRoute("/dashboard/x")({loader:()=>load(),component:()=>{const d=Route.useLoaderData();return <main className="wrap" style={{padding:"96px 0"}}><h1>X</h1><p>{d.connected?`Connected as ${d.displayName??"X user"}`:d.message??"Not connected"}</p></main>}});
