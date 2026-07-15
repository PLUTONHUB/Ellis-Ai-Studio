import { createServerFn } from "@tanstack/react-start";

import type { RunResearchInput } from "~/types/research";
import type { PlutoResearchSummary } from "~/types/pluto-runtime";

export const runBusinessResearch = createServerFn({ method: "POST" })
  .validator((data: RunResearchInput) => {
    if (!data || typeof data.name !== "string" || typeof data.websiteUrl !== "string" || typeof data.idempotencyKey !== "string") {
      throw new Error("Research requests require name, websiteUrl, and idempotencyKey strings.");
    }
    return data;
  })
  .handler(async ({ data }) => {
    if (process.env.PLUTO_RESEARCH_ENABLED !== "true") {
      throw new Error("Pluto Research Engine is disabled. Set PLUTO_RESEARCH_ENABLED=true only in the protected server environment.");
    }
    const [{ BusinessResearchService }, { SupabaseResearchRepository }] = await Promise.all([
      import("~/services/business-research-service"),
      import("~/lib/supabase/research-repository.server"),
    ]);
    const result = await new BusinessResearchService(SupabaseResearchRepository.fromEnvironment()).research(data);
    const summary: PlutoResearchSummary = {
      businessName: result.business.name,
      websiteUrl: result.business.canonicalWebsiteUrl,
      researchRunId: result.researchRunId,
      status: result.status,
      pageTitle: result.snapshot.pageTitle,
      sourceUrl: result.snapshot.sourceUrl,
      pageDescription: typeof result.snapshot.metadata.description === "string" ? result.snapshot.metadata.description : null,
      fetchedAt: result.snapshot.fetchedAt,
      factCount: result.facts.length,
      facts: result.facts.map(({ factType, predicate, value, sourceUrl, confidence }) => ({ factType, predicate, value, sourceUrl, confidence })),
      sources: [...new Set(result.snapshots.map((snapshot) => snapshot.sourceUrl))],
      findings: result.findings.map(({ title, summary: findingSummary, confidence }) => ({ title, summary: findingSummary, confidence })),
      recommendations: result.recommendations.map(({ priority, title, rationale, action }) => ({ priority, title, rationale, action })),
      intelligence: result.intelligence,
    };
    return summary;
  });
