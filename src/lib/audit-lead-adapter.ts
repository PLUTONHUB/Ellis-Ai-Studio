import type { AuditReport } from "~/types/audit";
import type { AuditLeadContext } from "~/types/lead";

export function auditToLeadContext(report: AuditReport): AuditLeadContext {
  const top = [...report.opportunities].sort((a, b) => b.priority - a.priority)[0];
  return { auditId: report.id, businessName: report.profile.name, website: report.profile.website, industry: report.profile.category, location: report.profile.location, automationOpportunityScore: report.automationOpportunity, systemsMaturity: report.maturity, topOpportunity: top ? { id: top.id, name: top.name, score: top.priority, evidence: [...top.evidence], confidence: top.confidence } : undefined, evidence: top ? top.observed.map((finding) => ({ statement: finding.statement, evidence: finding.evidence, source: finding.source })) : [] };
}
