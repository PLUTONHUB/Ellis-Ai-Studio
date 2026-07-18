import { createServerFn } from "@tanstack/react-start";

type ClientOnboardingInput = { companyName: string; ownerName: string; email: string; phone?: string; address?: string; websiteUrl?: string; googleBusinessProfileUrl?: string; serviceAreas: string[]; servicesOffered: string[]; goals: string[]; currentSoftware: string[]; preferredIntegrations: string[] };

export const submitClientOnboarding = createServerFn({ method: "POST" }).validator(validate).handler(async ({ data }) => {
  const { SupabaseResearchRepository } = await import("~/lib/supabase/research-repository.server");
  const repository = SupabaseResearchRepository.fromEnvironment();
  await repository.saveClientIntake({ ...data, status: "research_started", researchStatus: "started" });
  if (!data.websiteUrl || process.env.PLUTO_RESEARCH_ENABLED !== "true") return { status: "submitted" as const };
  try {
    await repository.saveClientIntake({ ...data, status: "research_running", researchStatus: "running" });
    const [{ BusinessResearchService }, { FrictionAuditService }] = await Promise.all([import("~/services/business-research-service"), import("~/services/friction-audit-service")]);
    const research = await new BusinessResearchService(repository).research({ name: data.companyName, websiteUrl: data.websiteUrl, idempotencyKey: crypto.randomUUID() });
    const draft = new FrictionAuditService().createDraft({ companyName: data.companyName, websiteUrl: data.websiteUrl, contactName: data.ownerName, email: data.email, serviceArea: data.serviceAreas.join(", "), primaryService: data.servicesOffered[0] ?? "Service business" }, research);
    await repository.upsertFrictionAudit({ businessId: research.business.id, researchRunId: research.researchRunId, intake: draft.intake, draft });
    await repository.saveClientIntake({ ...data, status: "research_complete", researchStatus: "complete", researchRunId: research.researchRunId });
    return { status: "ready" as const };
  } catch (error) {
    await repository.saveClientIntake({ ...data, status: "research_failed", researchStatus: "failed", researchError: error instanceof Error ? error.message.slice(0, 500) : "Research preparation did not complete." });
    return { status: "submitted" as const };
  }
});

function validate(data: ClientOnboardingInput): ClientOnboardingInput {
  if (!data || ![data.companyName, data.ownerName, data.email].every((value) => typeof value === "string" && value.trim())) throw new Error("Company, owner, and email are required.");
  if (!/^\S+@\S+\.\S+$/.test(data.email)) throw new Error("Enter a valid business email.");
  if (data.websiteUrl) { try { new URL(data.websiteUrl); } catch { throw new Error("Enter a valid website URL."); } }
  return { ...data, companyName: data.companyName.trim(), ownerName: data.ownerName.trim(), email: data.email.trim(), serviceAreas: data.serviceAreas.filter(Boolean), servicesOffered: data.servicesOffered.filter(Boolean), goals: data.goals.filter(Boolean), currentSoftware: data.currentSoftware.filter(Boolean), preferredIntegrations: data.preferredIntegrations.filter(Boolean) };
}
