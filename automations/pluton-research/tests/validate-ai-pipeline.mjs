import { readFile } from "node:fs/promises";
import { buildEvidencePackage, extractModelJson, validateReport } from "../ai-report-contract.mjs";

const fixture = JSON.parse(await readFile(new URL("../fixtures/controlled-ai-evidence.json", import.meta.url), "utf8"));
const workflow = JSON.parse(await readFile(new URL("../pluton-research-main.workflow.json", import.meta.url), "utf8"));
const aiNode = workflow.nodes.find((node) => node.name === "OpenAI - Analyze Evidence");
if (!aiNode?.parameters.body.includes("type:'json_schema'") || !aiNode.parameters.body.includes("strict:true")) throw new Error("OpenAI request is not configured for strict JSON schema output.");
const evidence = buildEvidencePackage(fixture);
if (evidence.sources.length !== 3 || evidence.sourceUrls.length !== 3) throw new Error("Complete evidence fixture was not packaged with URLs.");
if (evidence.sources.some((source) => source.content.length > 3_500)) throw new Error("Per-source evidence cap failed.");
if (evidence.researchMetadata.sourceCharacterCount > 45_000) throw new Error("Total evidence cap failed.");
if (JSON.stringify(evidence).includes("Home | Services | Contact\nHome | Services | Contact")) throw new Error("Repeated navigation was not cleaned.");
if (JSON.stringify(evidence).includes("Email") || JSON.stringify(evidence).includes("Phone")) throw new Error("Unnecessary personal data was included.");

const url = evidence.sourceUrls[0];
const validReport = {
  prospectSummary: { businessName: "Northstar HVAC", businessModel: "Residential HVAC service", targetCustomer: "Homeowners", mainChallenge: "After-hours lead capture", budgetRange: "$5,000-$10,000", timeline: "Within 30 Days" },
  clientProvidedFacts: ["The intake says after-hours inquiries are not consistently captured."],
  verifiedFindings: [{ finding: "The website describes residential repair and maintenance.", sourceUrl: url, confidence: "high" }],
  inferences: [{ inference: "A lead-recovery workflow may support the stated after-hours challenge.", supportingEvidence: [url], confidence: "medium" }],
  visibleInfrastructure: ["Website service pages"],
  customerJourney: { discovery: "Website service pages", leadCapture: "unknown", conversion: "unknown", serviceDelivery: "Residential service appointments", support: "unknown" },
  priorityOpportunities: [{ title: "After-hours lead recovery", problem: "The intake describes inconsistent after-hours follow-up.", recommendedSolution: "Add a capture form and automated acknowledgement workflow.", expectedBusinessOutcome: "More consistent handling of submitted inquiries.", impact: "high", complexity: "medium", budgetFit: "good", evidenceUrls: [url] }],
  missingInformation: ["Current CRM and follow-up ownership are unknown."],
  discoveryCallQuestions: ["How are after-hours inquiries handled today?", "Which scheduling system receives booked estimates?", "Who owns follow-up after the first response?", "Which inquiry sources create the most missed work?", "What would a successful 30-day pilot look like?"],
  recommendedDemo: { name: "After-hours lead recovery workflow", reason: "It directly addresses the intake challenge and can be scoped to the stated budget and timeline." },
  callStrategy: ["Confirm current inquiry volume before estimating impact."]
};
if (!validateReport(validReport, evidence.sourceUrls).valid) throw new Error("Valid controlled report was rejected.");

// Incomplete website evidence and no public results remain valid when uncertainty is explicit.
const sparse = buildEvidencePackage({ intake: fixture.intake, crawlPages: [], publicResults: [] });
if (sparse.sources.length !== 0 || sparse.sourceUrls.length !== 0) throw new Error("Sparse evidence fixture was not bounded.");
const sparseReport = structuredClone(validReport);
sparseReport.verifiedFindings = [];
sparseReport.priorityOpportunities[0].evidenceUrls = [];
sparseReport.customerJourney.discovery = "unknown";
sparseReport.missingInformation.push("No crawl or public-search evidence was available.");
if (!validateReport(sparseReport, sparse.sourceUrls).valid) throw new Error("Unknown-safe sparse report was rejected.");

// Contradictory evidence is represented as an inference/unknown, not a false verified fact.
const contradiction = structuredClone(validReport);
contradiction.verifiedFindings = [];
contradiction.inferences = [{ inference: "The intake and available public information should be reconciled during discovery.", supportingEvidence: [], confidence: "low" }];
contradiction.missingInformation.push("Public evidence does not resolve the differing service descriptions.");
if (!validateReport(contradiction, evidence.sourceUrls).valid) throw new Error("Contradiction-safe report was rejected.");

const malformed = extractModelJson({ output_text: "{not json" });
if (malformed.ok) throw new Error("Malformed model JSON was accepted.");
const unsupportedClaim = structuredClone(validReport);
unsupportedClaim.verifiedFindings[0].sourceUrl = "https://unsupported.example/claim";
if (validateReport(unsupportedClaim, evidence.sourceUrls).valid) throw new Error("Unsupported verified claim was accepted.");
const badEnum = structuredClone(validReport);
badEnum.priorityOpportunities[0].impact = "immediate";
if (validateReport(badEnum, evidence.sourceUrls).valid) throw new Error("Unsupported enum was accepted.");
const oversized = buildEvidencePackage({ intake: fixture.intake, crawlPages: Array.from({ length: 80 }, (_, index) => ({ url: `https://northstar.example/page-${index}`, markdown: `Line ${index}\n`.repeat(2_000) })), publicResults: [] });
if (oversized.sources.length > 25 || oversized.researchMetadata.sourceCharacterCount > 45_000) throw new Error("Oversized evidence safeguards failed.");
const missingOptional = buildEvidencePackage({ intake: { businessName: "Northstar HVAC", budgetRange: "$5,000-$10,000", timeline: "Within 30 Days" } });
if (missingOptional.intake.businessName !== "Northstar HVAC" || "email" in missingOptional.intake) throw new Error("Optional intake handling failed.");

console.log("PLUTON_AI_PIPELINE_VALID");
