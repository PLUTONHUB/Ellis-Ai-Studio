import type { LeadActivity, LeadAnalysisStatus, LeadIntake, LeadInterpretation, LeadScores, PipelineStatus, RecommendedNextAction } from "~/types/lead";
import type { LeadAnalysisRow, LeadListRow, LeadRow } from "~/types/lead-record";

type Row = Record<string, unknown>;
type SupabaseError = { code?: string; message?: string };
function required(name: string) { const value = process.env[name]; if (!value) throw new Error(`${name} is not configured.`); return value; }
function api(path: string, init: RequestInit = {}) { const key = required("SUPABASE_SERVICE_ROLE_KEY"); return fetch(`${required("SUPABASE_URL").replace(/\/$/, "")}/rest/v1/${path}`, { ...init, headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers ?? {}) } }); }
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await api(path, init);
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { code?: string } | null;
    throw new Error(`Supabase lead request failed${body?.code ? ` (${body.code})` : ""}.`);
  }
  // PostgREST returns 201 (not only 204) with an intentionally empty body for
  // `Prefer: return=minimal`. Treat any successful empty response as void.
  const body = await response.text();
  return body ? JSON.parse(body) as T : undefined as T;
}
const eq = (value: string) => encodeURIComponent(value);
const isIdempotencyConflict = (response: Response, error: SupabaseError | null) =>
  response.status === 409 && error?.code === "23505" && error.message?.includes("leads_idempotency_key_key");
async function leadByRequestId(requestId: string) {
  return (await request<Row[]>(`leads?select=id,created_at,updated_at,pipeline_status,analysis_status&idempotency_key=eq.${eq(requestId)}&limit=1`))[0];
}
export type StoredLead = LeadIntake & { id: string; createdAt: string; updatedAt: string; pipelineStatus: PipelineStatus; analysisStatus: LeadAnalysisStatus };

export async function createLead(input: LeadIntake): Promise<{ lead: StoredLead; duplicate: boolean }> {
  const payload = { source: input.source, first_name: input.firstName, last_name: input.lastName, email: input.email, phone: input.phone ?? null, business_name: input.businessName, website: input.website ?? null, industry: input.industry ?? null, location: input.location ?? null, primary_challenge: input.primaryChallenge, desired_outcome: input.desiredOutcome, urgency: input.urgency, additional_context: input.additionalContext ?? null, operational_context: { businessSize: input.businessSize, approximateMonthlyLeadVolume: input.approximateMonthlyLeadVolume, currentTools: input.currentTools, currentProcess: input.currentProcess, biggestManualBottleneck: input.biggestManualBottleneck, bottleneckAudit: input.bottleneckAudit ?? null }, audit_context: input.auditContext ?? null, idempotency_key: input.requestId };
  const created = await api("leads?on_conflict=idempotency_key", { method: "POST", headers: { Prefer: "return=representation,resolution=ignore-duplicates" }, body: JSON.stringify(payload) });
  if (!created.ok) {
    const error = await created.json().catch(() => null) as SupabaseError | null;
    if (isIdempotencyConflict(created, error)) {
      const existing = await leadByRequestId(input.requestId);
      if (existing) return { duplicate: true, lead: storedLead(input, existing) };
    }
    throw new Error("Supabase lead request failed.");
  }
  const text = await created.text();
  const rows = text ? JSON.parse(text) as Row[] : [];
  const row = rows[0] ?? await leadByRequestId(input.requestId);
  if (!row) throw new Error("Lead could not be created.");
  return { duplicate: rows.length === 0, lead: storedLead(input, row) };
}
function storedLead(input: LeadIntake, row: Row): StoredLead {
  return { ...input, id: String(row.id), createdAt: String(row.created_at), updatedAt: String(row.updated_at), pipelineStatus: row.pipeline_status as PipelineStatus, analysisStatus: row.analysis_status as LeadAnalysisStatus };
}
export async function updateAnalysisStatus(leadId: string, status: LeadAnalysisStatus) { await request(`leads?id=eq.${eq(leadId)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ analysis_status: status, updated_at: new Date().toISOString() }) }); }
export async function addActivity(leadId: string, type: string, metadata?: Record<string, unknown>) { await request("lead_activities", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ lead_id: leadId, type, metadata: metadata ?? null }) }); }
export async function saveAnalysis(leadId: string, interpretation: LeadInterpretation, scores: LeadScores, action: RecommendedNextAction) { await request("lead_analyses", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ lead_id: leadId, interpretation, recommended_system_key: interpretation.recommendedSystem.key, recommended_next_action: action, problem_fit: scores.problemFit, potential_impact: scores.potentialImpact, urgency_score: scores.urgency, implementation_fit: scores.implementationFit, intent: scores.intent, opportunity_score: scores.opportunityScore, qualification_confidence: scores.qualificationConfidence, qualification_class: scores.qualificationClass }) }); await updateAnalysisStatus(leadId, "complete"); }
export async function updatePipelineStatus(leadId: string, status: PipelineStatus) { await request(`leads?id=eq.${eq(leadId)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ pipeline_status: status, updated_at: new Date().toISOString() }) }); await addActivity(leadId, "status_changed", { status }); }
export async function listLeads(): Promise<LeadListRow[]> { const [leads, analyses] = await Promise.all([request<Row[]>("leads?select=id,created_at,business_name,first_name,last_name,email,source,pipeline_status,analysis_status&order=created_at.desc&limit=200"), request<Row[]>("lead_analyses?select=lead_id,created_at,opportunity_score,qualification_confidence,qualification_class,recommended_system_key&order=created_at.desc&limit=1000")]); const latest = new Map<string, Row>(); for (const analysis of analyses) if (!latest.has(String(analysis.lead_id))) latest.set(String(analysis.lead_id), analysis); return leads.map((lead) => ({ ...lead, ...(latest.get(String(lead.id)) ?? { opportunity_score: null, qualification_confidence: null, qualification_class: null, recommended_system_key: null }) })) as LeadListRow[]; }
export async function getLead(leadId: string): Promise<{ lead: LeadRow; analysis: LeadAnalysisRow | null; activities: LeadActivity[] } | null> { const [leads, analyses, activities] = await Promise.all([request<Row[]>(`leads?select=*&id=eq.${eq(leadId)}&limit=1`), request<Row[]>(`lead_analyses?select=*&lead_id=eq.${eq(leadId)}&order=created_at.desc&limit=1`), request<Row[]>(`lead_activities?select=id,lead_id,type,created_at&lead_id=eq.${eq(leadId)}&order=created_at.asc`)]); const lead = leads[0]; if (!lead) return null; return { lead: lead as LeadRow, analysis: (analyses[0] as LeadAnalysisRow | undefined) ?? null, activities: activities.map((activity): LeadActivity => ({ id: String(activity.id), leadId: String(activity.lead_id), type: String(activity.type), createdAt: String(activity.created_at) })) }; }
