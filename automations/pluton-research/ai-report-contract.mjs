const TOP_LEVEL_KEYS = [
  "prospectSummary", "clientProvidedFacts", "verifiedFindings", "inferences",
  "visibleInfrastructure", "customerJourney", "priorityOpportunities",
  "missingInformation", "discoveryCallQuestions", "recommendedDemo", "callStrategy",
];
const CONFIDENCE = new Set(["high", "medium", "low"]);
const IMPACT = new Set(["high", "medium", "low"]);
const BUDGET_FIT = new Set(["good", "possible", "poor"]);
const MAX_SOURCE_CHARS = 3_500;
const MAX_TOTAL_EVIDENCE_CHARS = 45_000;
const MAX_SOURCES = 25;

const isString = (value) => typeof value === "string";
const isUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch { return false; }
};
const addError = (errors, condition, message) => { if (!condition) errors.push(message); };

export function cleanEvidenceText(value, repeatedLines = new Set()) {
  const seen = new Set();
  return String(value ?? "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line && !repeatedLines.has(line.toLowerCase()) && !seen.has(line.toLowerCase()) && (seen.add(line.toLowerCase()) || true))
    .join("\n")
    .slice(0, MAX_SOURCE_CHARS);
}

export function buildEvidencePackage({ intake = {}, crawlPages = [], publicResults = [], researchMetadata = {} }) {
  const candidates = [
    ...crawlPages.map((page) => ({
      sourceType: "website", url: page.url || page.metadata?.sourceURL || page.metadata?.url,
      title: page.metadata?.title || page.title || "", content: page.markdown || page.content || "",
    })),
    ...publicResults.map((page) => ({
      sourceType: "public_search", url: page.url || page.metadata?.sourceURL || page.metadata?.url,
      title: page.metadata?.title || page.title || "", content: page.markdown || page.description || page.content || "",
    })),
  ].filter((source) => isUrl(source.url));

  const lineCounts = new Map();
  for (const source of candidates) for (const line of String(source.content || "").split("\n")) {
    const normalized = line.replace(/\s+/g, " ").trim().toLowerCase();
    if (normalized.length >= 12) lineCounts.set(normalized, (lineCounts.get(normalized) || 0) + 1);
  }
  const repeatedLines = new Set([...lineCounts].filter(([, count]) => count >= 3).map(([line]) => line));
  const seenUrls = new Set();
  let remaining = MAX_TOTAL_EVIDENCE_CHARS;
  const sources = [];
  for (const candidate of candidates) {
    const canonicalUrl = new URL(candidate.url).toString();
    if (seenUrls.has(canonicalUrl) || sources.length >= MAX_SOURCES || remaining <= 0) continue;
    const content = cleanEvidenceText(candidate.content, repeatedLines).slice(0, remaining);
    if (!content) continue;
    seenUrls.add(canonicalUrl);
    remaining -= content.length;
    sources.push({ sourceType: candidate.sourceType, sourceUrl: canonicalUrl, title: String(candidate.title || "").slice(0, 300), content });
  }
  const selectedIntake = ["businessName", "website", "profileUrls", "businessDescription", "businessArea", "challenge", "currentSystems", "currentSoftware", "oneYearSuccess", "solutionOutcome", "budgetRange", "timeline", "automationWish"];
  const clientProvidedFacts = selectedIntake
    .filter((key) => intake[key] !== undefined && intake[key] !== null && String(intake[key]).trim())
    .map((key) => ({ field: key, value: Array.isArray(intake[key]) ? intake[key].join(", ") : String(intake[key]).slice(0, 1_000) }));
  return {
    intake: Object.fromEntries(clientProvidedFacts.map(({ field, value }) => [field, value])),
    clientProvidedFacts,
    sources,
    sourceUrls: sources.map((source) => source.sourceUrl),
    researchMetadata: { websitePageLimit: 20, sourceCount: sources.length, sourceCharacterCount: MAX_TOTAL_EVIDENCE_CHARS - remaining, ...researchMetadata },
  };
}

export function validateReport(report, allowedSourceUrls = []) {
  const errors = [];
  addError(errors, report && typeof report === "object" && !Array.isArray(report), "report must be an object");
  if (errors.length) return { valid: false, errors };
  addError(errors, Object.keys(report).every((key) => TOP_LEVEL_KEYS.includes(key)), "report contains unsupported top-level fields");
  for (const key of TOP_LEVEL_KEYS) addError(errors, key in report, `missing required field: ${key}`);
  const summaryFields = ["businessName", "businessModel", "targetCustomer", "mainChallenge", "budgetRange", "timeline"];
  addError(errors, report.prospectSummary && summaryFields.every((key) => isString(report.prospectSummary[key])), "prospectSummary is invalid");
  for (const field of ["clientProvidedFacts", "visibleInfrastructure", "missingInformation", "callStrategy"]) addError(errors, Array.isArray(report[field]) && report[field].every(isString), `${field} must be an array of strings`);
  addError(errors, Array.isArray(report.discoveryCallQuestions) && report.discoveryCallQuestions.length >= 5 && report.discoveryCallQuestions.length <= 10 && report.discoveryCallQuestions.every(isString), "discoveryCallQuestions must contain 5-10 strings");
  addError(errors, report.customerJourney && ["discovery", "leadCapture", "conversion", "serviceDelivery", "support"].every((key) => isString(report.customerJourney[key])), "customerJourney is invalid");
  addError(errors, report.recommendedDemo && isString(report.recommendedDemo.name) && isString(report.recommendedDemo.reason), "recommendedDemo is invalid");
  const allowed = new Set(allowedSourceUrls);
  addError(errors, Array.isArray(report.verifiedFindings), "verifiedFindings must be an array");
  for (const finding of report.verifiedFindings || []) addError(errors, isString(finding.finding) && isUrl(finding.sourceUrl) && allowed.has(finding.sourceUrl) && CONFIDENCE.has(finding.confidence), "verified finding must have a supported source URL and valid confidence");
  addError(errors, Array.isArray(report.inferences), "inferences must be an array");
  for (const inference of report.inferences || []) addError(errors, isString(inference.inference) && Array.isArray(inference.supportingEvidence) && inference.supportingEvidence.every(isString) && CONFIDENCE.has(inference.confidence), "inference is invalid");
  addError(errors, Array.isArray(report.priorityOpportunities) && report.priorityOpportunities.length <= 5, "priorityOpportunities must contain at most five items");
  for (const opportunity of report.priorityOpportunities || []) addError(errors,
    ["title", "problem", "recommendedSolution", "expectedBusinessOutcome"].every((key) => isString(opportunity[key])) &&
    IMPACT.has(opportunity.impact) && IMPACT.has(opportunity.complexity) && BUDGET_FIT.has(opportunity.budgetFit) &&
    Array.isArray(opportunity.evidenceUrls) && opportunity.evidenceUrls.every((url) => isUrl(url) && allowed.has(url)),
    "priority opportunity is invalid or cites an unsupported URL");
  return { valid: errors.length === 0, errors };
}

export function extractModelJson(response) {
  const text = response?.output_text || response?.output?.flatMap((item) => item.content || []).map((item) => item.text).filter(Boolean).join("") || response?.choices?.[0]?.message?.content;
  if (!isString(text)) return { ok: false, error: "AI response contained no text." };
  try { return { ok: true, report: JSON.parse(text) }; } catch { return { ok: false, error: "AI did not return valid JSON." }; }
}

export const AI_ANALYSIS_RULES = "Return only one JSON object matching the required report contract. Treat intake as client-provided. A verified finding requires a preserved public source URL from sourceUrls. Never invent internal systems, finances, metrics, employees, compliance facts, performance data, ROI, or sensitive traits. Label uncertainty; use unknown when evidence is insufficient. Do not exceed five priority opportunities. Match recommendations to budgetRange and timeline. Include five to ten specific discovery questions and justify the recommended demo with available evidence.";
