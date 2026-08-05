import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const json = async name => JSON.parse(await readFile(new URL(name, root), "utf8"));
const main = await json("pluton-research-main.workflow.json");
const error = await json("pluton-research-error-handler.workflow.json");
const schema = await json("report-schema.json");
const fixture = await json("fixtures/sample-form-response.json");
const mapping = await readFile(new URL("GOOGLE_SHEETS_MAPPING.md", root), "utf8");
const checklist = await readFile(new URL("SPRINT_1_FIRST_TEST_CHECKLIST.md", root), "utf8");

const byName = (workflow, name) => workflow.nodes.find(node => node.name === name);
const nodeNames = new Set(main.nodes.map(node => node.name));
const requiredNodes = [
  "Google Sheets Trigger - New Form Response",
  "Normalize Form Response",
  "Validate Required Business Data",
  "Exact Triggering Row Identified?",
  "Submission Valid?",
  "Already Delivered?",
  "Stop Duplicate Delivery",
  "Sheet - Mark Researching",
  "Sheet - Mark Analyzing",
  "Sheet - Mark Delivering",
  "Firecrawl Request Diagnostic",
  "Firecrawl - Start Website Crawl (20 pages)",
  "Evaluate Crawl State",
  "Firecrawl - Search Public Signals",
  "OpenAI - Analyze Evidence",
  "Validate AI Report",
  "Report Valid?",
  "Prepare AI Retry",
  "Prepare Validated Report File",
  "Google Drive - Save Full Report",
  "Sheet - Mark Complete",
  "Gmail - Notify Ellis",
  "Stop Unsafe Sheet Update",
];
for (const name of requiredNodes) if (!nodeNames.has(name)) throw new Error(`Missing workflow node: ${name}`);

const crawl = byName(main, "Firecrawl - Start Website Crawl (20 pages)");
if (!crawl.parameters.body.includes("limit:20")) throw new Error("Crawl limit is not 20 pages.");
const evaluator = byName(main, "Evaluate Crawl State");
if (!evaluator.parameters.jsCode.includes("pollAttempt>12")) throw new Error("Crawl polling is not bounded at 12 attempts.");

const expectedInputs = [
  "Timestamp", "Full Name", "Business Name", "Job Title", "Email", "Phone Number",
  "Number of Employees", "Approximate Annual Revenue",
  "Who is the primary decision-maker for this project?",
  "Besides yourself, who else will be involved in approving this project?",
  "Business Profile URL", "Additional Business Profile URLs",
  "Tell us about your business.", "Tell us about yourself.",
  "Which area of your business would benefit the most from improvement?",
  "Please describe the challenge in detail.", "Which systems does your business currently use?",
  "Which software do you currently use?",
  "If we met again one year from today, what would success look like?",
  "What would a successful solution accomplish within the next 6-12 months?",
  "What investment range have you allocated for solving this challenge?",
  "When would you like to begin?",
  "If you could automate one thing in your business tomorrow, what would it be?",
  "Pluton Submission ID",
];
for (const heading of expectedInputs) if (!(heading in fixture)) throw new Error(`Fixture missing expected Sheet input: ${heading}`);

const expectedOutputs = [
  "Pluton Status", "Research Started", "Research Completed", "Primary Opportunity",
  "Recommended Demo", "Report URL", "Error Message",
];
for (const heading of expectedOutputs) if (!(heading in fixture)) throw new Error(`Fixture missing expected Sheet output: ${heading}`);
for (const heading of ["Pluton Submission ID", ...expectedOutputs]) if (!mapping.includes(`| ${heading} |`)) throw new Error(`Mapping missing Sheet column: ${heading}`);

const normalize = byName(main, "Normalize Form Response").parameters.jsCode;
for (const internalField of ["jobTitle", "employeeCount", "annualRevenue", "primaryDecisionMaker", "additionalApprovers"]) {
  if (!normalize.includes(`${internalField}:`)) throw new Error(`Normalization missing ${internalField}.`);
}
if (!normalize.includes("rowIdentityValid")) throw new Error("Normalization does not verify row identity.");
if (!byName(main, "Stop Unsafe Sheet Update").parameters.jsCode.includes("No Sheet update was attempted")) throw new Error("Unsafe row guard is not explicit.");

const researchLink = main.connections["Sheet - Mark Researching"]?.main?.[0]?.[0]?.node;
if (researchLink !== "Firecrawl Request Diagnostic") throw new Error("Researching status is not connected to Firecrawl diagnostics.");
const firecrawlLink = main.connections["Firecrawl Request Diagnostic"]?.main?.[0]?.[0]?.node;
if (firecrawlLink !== "Firecrawl - Start Website Crawl (20 pages)") throw new Error("First Firecrawl request is not connected after diagnostics.");
const validationLink = main.connections["Validate Required Business Data"]?.main?.[0]?.[0]?.node;
if (validationLink !== "Exact Triggering Row Identified?") throw new Error("Validation does not flow through exact-row identity check.");
if (main.connections["Validate AI Report"]?.main?.[0]?.[0]?.node !== "Report Valid?") throw new Error("AI validation does not gate downstream work.");
if (main.connections["Report Valid?"]?.main?.[0]?.[0]?.node !== "Prepare Validated Report File") throw new Error("Valid reports do not prepare a report file.");
if (main.connections["Report Valid?"]?.main?.[1]?.[0]?.node !== "Prepare AI Retry") throw new Error("Invalid reports do not enter the retry path.");
if (main.connections["Prepare AI Retry"]?.main?.[0]?.[0]?.node !== "OpenAI - Analyze Evidence") throw new Error("AI retry path does not return to analysis.");
if (main.connections["Prepare Validated Report File"]?.main?.[0]?.[0]?.node !== "Sheet - Mark Delivering") throw new Error("Delivery state is missing before Drive.");
if (main.connections["Sheet - Mark Delivering"]?.main?.[0]?.[0]?.node !== "Restore File After Delivering") throw new Error("Delivery state does not preserve the validated report file.");
if (main.connections["Restore File After Delivering"]?.main?.[0]?.[0]?.node !== "Google Drive - Save Full Report") throw new Error("Drive is reachable without a validated report gate.");
if (main.connections["Google Drive - Save Full Report"]?.main?.[0]?.[0]?.node !== "Gmail - Notify Ellis") throw new Error("Completion email must precede Complete status.");
if (main.connections["Gmail - Notify Ellis"]?.main?.[0]?.[0]?.node !== "Sheet - Mark Complete") throw new Error("Complete status must only follow email delivery.");
if (main.connections["Already Delivered?"]?.main?.[0]?.[0]?.node !== "Stop Duplicate Delivery") throw new Error("Completed submissions are not protected from duplicate delivery.");

for (const name of ["Sheet - Mark Researching", "Sheet - Mark Invalid", "Sheet - Mark Complete"]) {
  const node = byName(main, name);
  if (!JSON.stringify(node.parameters).includes("Pluton Submission ID")) throw new Error(`${name} does not match by Pluton Submission ID.`);
}
if (!error.nodes.some(node => node.name === "Submission ID Available?")) throw new Error("Error workflow can update an unknown Sheet row.");
if (!error.connections["Submission ID Available?"]?.main?.[1]?.[0] || error.connections["Submission ID Available?"].main[1][0].node !== "Gmail - Notify Research Failure") throw new Error("Unknown error rows must bypass Sheet updates.");

for (const node of main.nodes.filter(node => node.type === "n8n-nodes-base.code")) {
  const code = node.parameters.jsCode || "";
  const logSegments = [...code.matchAll(/console\.log\(([\s\S]*?)\);/g)].map(match => match[1]);
  for (const segment of logSegments) {
    if (/(fullName|email:|website:|phone:|FIRECRAWL_API_KEY)/.test(segment)) throw new Error(`${node.name} may log personal data or credentials.`);
  }
}
if (!checklist.includes("Expected node-by-node results")) throw new Error("Sprint 1 test checklist is missing node-by-node verification.");
if (schema.properties.priorityOpportunities.maxItems !== 5) throw new Error("Report schema must cap priority opportunities at five.");

console.log("PLUTON_RESEARCH_ARTIFACTS_VALID");
