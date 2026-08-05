import { readFile } from "node:fs/promises";

const workflow = JSON.parse(
  await readFile(new URL("../pluton-research-main.workflow.json", import.meta.url), "utf8"),
);

const byName = (name) => {
  const node = workflow.nodes.find((candidate) => candidate.name === name);
  if (!node) throw new Error(`Missing workflow node: ${name}`);
  return node;
};

const crawl = byName("Firecrawl - Start Website Crawl (20 pages)");
const status = byName("Firecrawl - Get Crawl Status");
const search = byName("Firecrawl - Search Public Signals");
const evaluate = byName("Evaluate Crawl State");
const packageEvidence = byName("Clean and Package Evidence");

if (crawl.parameters.url !== "https://api.firecrawl.dev/v2/crawl") {
  throw new Error("Crawl node does not target Firecrawl v2 crawl.");
}
if (!crawl.parameters.body.includes("limit:20")) {
  throw new Error("Crawl page limit is not bounded to 20.");
}
if (!crawl.parameters.body.includes("allowExternalLinks:false")) {
  throw new Error("Crawl permits external links.");
}
if (!crawl.parameters.body.includes("onlyMainContent:true")) {
  throw new Error("Crawl does not request cleaned main content.");
}
if (!status.parameters.url.includes("/v2/crawl/")) {
  throw new Error("Crawl status node does not target Firecrawl v2.");
}
if (!evaluate.parameters.jsCode.includes("pollAttempt>12")) {
  throw new Error("Crawl polling does not have a bounded failure condition.");
}
if (!search.parameters.body.includes("limit:5") || !search.parameters.body.includes("sources:['web']")) {
  throw new Error("Public-signal search is not bounded to five web results per query.");
}
if (!packageEvidence.parameters.jsCode.includes("seenUrls.has(url)") || !packageEvidence.parameters.jsCode.includes("sourceUrls")) {
  throw new Error("Evidence packaging does not deduplicate and retain source URLs.");
}

const expectedLinks = [
  ["Firecrawl Request Diagnostic", "Firecrawl - Start Website Crawl (20 pages)"],
  ["Firecrawl - Start Website Crawl (20 pages)", "Wait for Crawl"],
  ["Wait for Crawl", "Firecrawl - Get Crawl Status"],
  ["Firecrawl - Get Crawl Status", "Evaluate Crawl State"],
  ["Evaluate Crawl State", "Crawl Complete?"],
  ["Crawl Complete?", "Build Public Research Queries"],
  ["Build Public Research Queries", "Firecrawl - Search Public Signals"],
  ["Firecrawl - Search Public Signals", "Clean and Package Evidence"],
];
for (const [from, to] of expectedLinks) {
  const destinations = workflow.connections[from]?.main?.flat().map((connection) => connection.node) ?? [];
  if (!destinations.includes(to)) throw new Error(`Missing Firecrawl connection: ${from} → ${to}`);
}

console.log("PLUTON_FIRECRAWL_PIPELINE_VALID");
