import { fingerprint } from "~/lib/pluto/research/normalization";
import type { SupabaseResearchRepository } from "~/lib/supabase/research-repository.server";
import type { ExtractedFact, Finding, Recommendation, ResearchResult, RunResearchInput } from "~/types/research";
import { FactNormalizationService } from "~/services/fact-normalization-service";
import { WebsiteExtractionService } from "~/services/website-extraction-service";
import { IntelligenceService } from "~/services/intelligence-service";

export class BusinessResearchService {
  constructor(private readonly repository: SupabaseResearchRepository, private readonly websiteExtraction = new WebsiteExtractionService(), private readonly factNormalization = new FactNormalizationService(), private readonly intelligenceService = new IntelligenceService()) {}

  async research(input: RunResearchInput): Promise<ResearchResult> {
    if (!input.idempotencyKey.trim()) throw new Error("A non-empty idempotency key is required.");
    const business = await this.repository.upsertBusiness(input);
    const run = await this.repository.createOrGetRun(business.id, business.canonicalWebsiteUrl, input.idempotencyKey);
    if (run.isExisting) {
      if (run.status === "running") throw new Error(`Research run ${run.id} is already in progress for this idempotency key.`);
      if (run.status === "failed") throw new Error(`Research run ${run.id} previously failed; use a new idempotency key to retry.`);
      const existing = await this.repository.getRunResult(run.id);
      return { business, researchRunId: run.id, status: "completed", ...existing };
    }
    try {
      const extractedPages = await this.websiteExtraction.extractSite(business.canonicalWebsiteUrl);
      const snapshots = [];
      const normalizedFacts = [];
      for (const extracted of extractedPages) {
        const snapshot = await this.repository.insertSnapshot({ businessId: business.id, researchRunId: run.id, sourceUrl: extracted.sourceUrl, pageTitle: extracted.pageTitle, fetchedAt: extracted.fetchedAt, contentSha256: extracted.contentSha256, contentType: extracted.contentType, httpStatus: extracted.httpStatus, bodyText: extracted.bodyText, metadata: extracted.metadata });
        snapshots.push(snapshot);
        normalizedFacts.push(...extracted.facts.map((fact) => this.factNormalization.normalize({ ...fact, subject: business.name, sourceUrl: extracted.sourceUrl, pageTitle: extracted.pageTitle, extractedAt: extracted.fetchedAt, researchRunId: run.id, websiteSnapshotId: snapshot.id })));
      }
      const snapshot = snapshots[0];
      if (!snapshot) throw new Error("No pages were available for research.");
      const facts = this.factNormalization.deduplicate(normalizedFacts);
      await this.repository.insertFacts(business.id, facts);
      const { findings, recommendations } = deriveIntelligence(facts);
      const intelligence = this.intelligenceService.analyze(business, facts, snapshots);
      await this.repository.insertFindings(business.id, run.id, findings);
      await this.repository.insertRecommendations(business.id, run.id, recommendations);
      await this.repository.insertIntelligence(business.id, run.id, intelligence);
      await this.repository.completeRun(run.id);
      return { business, researchRunId: run.id, status: "completed", snapshot, snapshots, facts, findings, recommendations, intelligence };
    } catch (error) {
      await this.repository.failRun(run.id, error instanceof Error ? error.message : "Unknown research failure");
      throw error;
    }
  }
}

function deriveIntelligence(facts: ExtractedFact[]): { findings: Finding[]; recommendations: Recommendation[] } {
  const findings: Finding[] = [];
  const recommendations: Recommendation[] = [];
  const add = (findingType: string, title: string, summary: string, evidence: string[], confidence: number, recommendation: Omit<Recommendation, "findingFingerprint" | "recommendationFingerprint">) => {
    const findingFingerprint = fingerprint(findingType, evidence);
    findings.push({ findingType, title, summary, evidence, confidence, findingFingerprint });
    recommendations.push({ ...recommendation, findingFingerprint, recommendationFingerprint: fingerprint(recommendation.title, recommendation.action, evidence) });
  };
  if (!facts.some((fact) => fact.factType === "phone")) add("conversion_gap", "No phone number found", "The researched page did not expose a recognizable phone number, which can create a high-friction path for prospects ready to call.", ["No normalized phone fact was extracted."], 0.86, { priority: 2, title: "Add a prominent call path", rationale: "Phone-first prospects need an immediate, trackable path to contact the business.", action: "Publish a clickable phone number in the header, contact section, and mobile navigation." });
  if (!facts.some((fact) => fact.factType === "email")) add("conversion_gap", "No email address found", "The researched page did not expose a recognizable email address, reducing the number of ways a prospect can start a conversation.", ["No normalized email fact was extracted."], 0.8, { priority: 3, title: "Add a monitored email contact", rationale: "A visible, monitored contact channel prevents demand from being lost when a caller cannot act immediately.", action: "Add a business email address and route it into the lead-response workflow." });
  if (!facts.some((fact) => fact.factType === "social_profile")) add("trust_gap", "No social proof profile detected", "No supported social profile link was found on the researched page. This may limit external trust signals for visitors evaluating the business.", ["No LinkedIn, Facebook, Instagram, or X URL was extracted."], 0.66, { priority: 4, title: "Link verified social profiles", rationale: "Trusted profiles can reinforce legitimacy when buyers are comparing options.", action: "Add links to active, business-owned social profiles in the site footer or contact area." });
  return { findings, recommendations };
}
