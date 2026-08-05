import { readFile } from "node:fs/promises";

const workflow = JSON.parse(await readFile(new URL("../pluton-research-main.workflow.json", import.meta.url), "utf8"));
const node = (name) => workflow.nodes.find((candidate) => candidate.name === name) ?? (() => { throw new Error(`Missing ${name}`); })();
const next = (name, branch = 0) => workflow.connections[name]?.main?.[branch]?.[0]?.node;

if (workflow.active !== false) throw new Error("Template workflow must remain inactive.");
if (!workflow.settings?.errorWorkflow) throw new Error("Main workflow has no error workflow assignment.");
if (next("Exact Triggering Row Identified?") !== "Already Delivered?") throw new Error("Exact row check does not precede idempotency guard.");
if (next("Already Delivered?", 0) !== "Stop Duplicate Delivery") throw new Error("Completed row duplicate guard is missing.");
if (next("Already Delivered?", 1) !== "Submission Valid?") throw new Error("New row path is incorrect.");
if (next("Prepare Validated Report File") !== "Sheet - Mark Delivering") throw new Error("Delivering state must follow validation.");
if (next("Sheet - Mark Delivering") !== "Restore File After Delivering" || next("Restore File After Delivering") !== "Google Drive - Save Full Report") throw new Error("Delivering state does not preserve the report before Drive.");
if (next("Google Drive - Save Full Report") !== "Gmail - Notify Ellis") throw new Error("Email must follow successful Drive creation.");
if (next("Gmail - Notify Ellis") !== "Sheet - Mark Complete") throw new Error("Complete must follow successful email delivery.");
if (next("Sheet - Mark Complete")) throw new Error("Completion must be terminal.");
for (const name of ["Sheet - Mark Researching", "Sheet - Mark Complete", "Sheet - Mark Invalid"]) {
  const item = node(name);
  if (!JSON.stringify(item.parameters).includes("Pluton Submission ID")) throw new Error(`${name} does not use submission-ID matching.`);
}
if (!node("Stop Duplicate Delivery").parameters.jsCode.includes("return []")) throw new Error("Duplicate delivery stop is not terminal.");
console.log("PLUTON_DELIVERY_PIPELINE_VALID");
