import "@tanstack/react-start/server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { canonicalizeUrl, fingerprint, normalizeBusinessKey, normalizeText } from "~/lib/pluto/research/normalization";
import type { Business, ExtractedFact, Finding, IntelligenceReport, JsonObject, JsonValue, MemoryInput, Recommendation, WebsiteSnapshot } from "~/types/research";

type Row = Record<string, unknown>;

export class SupabaseResearchRepository {
  constructor(private readonly client: SupabaseClient) {}

  static fromEnvironment(): SupabaseResearchRepository {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for Pluto Research Engine.");
    return new SupabaseResearchRepository(createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } }));
  }

  async upsertBusiness(identity: { name: string; websiteUrl: string }): Promise<Business> {
    const canonicalWebsiteUrl = canonicalizeUrl(identity.websiteUrl);
    const name = normalizeText(identity.name);
    const businessKey = normalizeBusinessKey(canonicalWebsiteUrl);
    const { data, error } = await this.client.from("businesses").upsert({ business_key: businessKey, name, normalized_name: name.toLowerCase(), website_url: identity.websiteUrl, canonical_website_url: canonicalWebsiteUrl }, { onConflict: "business_key" }).select("id, name, website_url, canonical_website_url, business_key").single();
    if (error) throw error;
    return { id: data.id, name: data.name, websiteUrl: data.website_url, canonicalWebsiteUrl: data.canonical_website_url, businessKey: data.business_key };
  }

  async createOrGetRun(businessId: string, requestedUrl: string, idempotencyKey: string): Promise<{ id: string; isExisting: boolean; status: "running" | "completed" | "failed" }> {
    const { data: existing, error: lookupError } = await this.client.from("research_runs").select("id, status").eq("business_id", businessId).eq("idempotency_key", idempotencyKey).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) return { id: existing.id, isExisting: true, status: existing.status };
    const { data, error } = await this.client.from("research_runs").insert({ business_id: businessId, idempotency_key: idempotencyKey, requested_url: canonicalizeUrl(requestedUrl), status: "running" }).select("id").single();
    if (!error) return { id: data.id, isExisting: false, status: "running" };
    if (error.code === "23505") return this.createOrGetRun(businessId, requestedUrl, idempotencyKey);
    throw error;
  }

  async getRunResult(runId: string): Promise<{ snapshot: WebsiteSnapshot; snapshots: WebsiteSnapshot[]; facts: ExtractedFact[]; findings: Finding[]; recommendations: Recommendation[]; intelligence: IntelligenceReport }> {
    const [snapshotResult, factsResult, findingsResult, recommendationsResult, intelligenceResult] = await Promise.all([
      this.client.from("website_snapshots").select("*").eq("research_run_id", runId).order("created_at", { ascending: true }),
      this.client.from("extracted_facts").select("*").eq("research_run_id", runId),
      this.client.from("ai_findings").select("*").eq("research_run_id", runId),
      this.client.from("recommendations").select("*").eq("research_run_id", runId),
      this.client.from("research_intelligence").select("report").eq("research_run_id", runId).single(),
    ]);
    if (snapshotResult.error || factsResult.error || findingsResult.error || recommendationsResult.error || intelligenceResult.error) throw snapshotResult.error ?? factsResult.error ?? findingsResult.error ?? recommendationsResult.error ?? intelligenceResult.error;
    const snapshots = snapshotResult.data.map(mapSnapshot);
    const snapshot = snapshots[0];
    if (!snapshot) throw new Error(`Research run ${runId} has no website snapshots.`);
    return { snapshot, snapshots, facts: factsResult.data.map(mapFact), findings: findingsResult.data.map(mapFinding), recommendations: recommendationsResult.data.map(mapRecommendation), intelligence: intelligenceResult.data.report as IntelligenceReport };
  }

  async insertIntelligence(businessId: string, researchRunId: string, intelligence: IntelligenceReport): Promise<void> {
    const { error } = await this.client.from("research_intelligence").upsert({ business_id: businessId, research_run_id: researchRunId, report: intelligence, report_fingerprint: fingerprint(intelligence) }, { onConflict: "research_run_id,report_fingerprint", ignoreDuplicates: true });
    if (error) throw error;
  }

  async insertSnapshot(snapshot: Omit<WebsiteSnapshot, "id">): Promise<WebsiteSnapshot> {
    const { data: existing, error: lookupError } = await this.client.from("website_snapshots").select("*").eq("research_run_id", snapshot.researchRunId).eq("source_url", snapshot.sourceUrl).eq("content_sha256", snapshot.contentSha256).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) return mapSnapshot(existing);
    const { data, error } = await this.client.from("website_snapshots").insert({ business_id: snapshot.businessId, research_run_id: snapshot.researchRunId, source_url: snapshot.sourceUrl, page_title: snapshot.pageTitle, fetched_at: snapshot.fetchedAt, content_sha256: snapshot.contentSha256, content_type: snapshot.contentType, http_status: snapshot.httpStatus, body_text: snapshot.bodyText, metadata: snapshot.metadata }).select("*").single();
    if (error) throw error;
    return mapSnapshot(data);
  }

  async insertFacts(businessId: string, facts: ExtractedFact[]): Promise<void> {
    if (!facts.length) return;
    const { error } = await this.client.from("extracted_facts").upsert(facts.map((fact) => ({ business_id: businessId, research_run_id: fact.researchRunId, website_snapshot_id: fact.websiteSnapshotId, fact_type: fact.factType, subject: fact.subject, predicate: fact.predicate, value: fact.value, normalized_value: typeof fact.value === "string" ? fact.value : JSON.stringify(fact.value), source_url: fact.sourceUrl, page_title: fact.pageTitle, extracted_at: fact.extractedAt, confidence: fact.confidence, fact_fingerprint: fact.factFingerprint })), { onConflict: "research_run_id,fact_fingerprint", ignoreDuplicates: true });
    if (error) throw error;
  }

  async insertFindings(businessId: string, researchRunId: string, findings: Finding[]): Promise<void> {
    if (!findings.length) return;
    const { error } = await this.client.from("ai_findings").upsert(findings.map((finding) => ({ business_id: businessId, research_run_id: researchRunId, finding_type: finding.findingType, title: finding.title, summary: finding.summary, evidence: finding.evidence, confidence: finding.confidence, finding_fingerprint: finding.findingFingerprint })), { onConflict: "research_run_id,finding_fingerprint", ignoreDuplicates: true });
    if (error) throw error;
  }

  async insertRecommendations(businessId: string, researchRunId: string, recommendations: Recommendation[]): Promise<void> {
    if (!recommendations.length) return;
    const { data: findings, error: findingsError } = await this.client.from("ai_findings").select("id, finding_fingerprint").eq("research_run_id", researchRunId);
    if (findingsError) throw findingsError;
    const findingIds = new Map(findings.map((finding: Row) => [finding.finding_fingerprint as string, finding.id as string]));
    const { error } = await this.client.from("recommendations").upsert(recommendations.map((recommendation) => ({ business_id: businessId, research_run_id: researchRunId, ai_finding_id: recommendation.findingFingerprint ? findingIds.get(recommendation.findingFingerprint) : null, priority: recommendation.priority, title: recommendation.title, rationale: recommendation.rationale, action: recommendation.action, recommendation_fingerprint: recommendation.recommendationFingerprint })), { onConflict: "research_run_id,recommendation_fingerprint", ignoreDuplicates: true });
    if (error) throw error;
  }

  async completeRun(runId: string): Promise<void> { await this.updateRun(runId, "completed"); }
  async failRun(runId: string, errorMessage: string): Promise<void> { await this.updateRun(runId, "failed", errorMessage.slice(0, 2_000)); }
  private async updateRun(runId: string, status: "completed" | "failed", errorMessage?: string) {
    const { data, error } = await this.client.from("research_runs").update({ status, completed_at: new Date().toISOString(), error_message: errorMessage ?? null }).eq("id", runId).eq("status", "running").select("id").maybeSingle();
    if (error) throw error;
    if (!data) throw new Error(`Research run ${runId} is not in a mutable running state.`);
  }

  async appendConversationMemory(input: MemoryInput & { conversationId: string }): Promise<void> {
    const fingerprintValue = fingerprint(input.businessId, input.conversationId, input.memoryKey, input.value, input.source);
    const { error } = await this.client.from("conversation_memory").upsert({ business_id: input.businessId, conversation_id: input.conversationId, memory_key: input.memoryKey, value: input.value, source: input.source, confidence: input.confidence, memory_fingerprint: fingerprintValue, recorded_at: input.recordedAt ?? new Date().toISOString() }, { onConflict: "conversation_id,memory_fingerprint", ignoreDuplicates: true });
    if (error) throw error;
  }

  async appendOrganizationMemory(input: MemoryInput): Promise<void> {
    const fingerprintValue = fingerprint(input.businessId, input.memoryKey, input.value, input.source);
    const { error } = await this.client.from("organization_memory").upsert({ business_id: input.businessId, memory_key: input.memoryKey, value: input.value, source: input.source, confidence: input.confidence, memory_fingerprint: fingerprintValue, recorded_at: input.recordedAt ?? new Date().toISOString() }, { onConflict: "business_id,memory_fingerprint", ignoreDuplicates: true });
    if (error) throw error;
  }
}

function mapSnapshot(row: Row): WebsiteSnapshot { return { id: row.id as string, businessId: row.business_id as string, researchRunId: row.research_run_id as string, sourceUrl: row.source_url as string, pageTitle: row.page_title as string | null, fetchedAt: row.fetched_at as string, contentSha256: row.content_sha256 as string, contentType: row.content_type as string, httpStatus: row.http_status as number, bodyText: row.body_text as string, metadata: row.metadata as JsonObject }; }
function mapFact(row: Row): ExtractedFact { return { factType: row.fact_type as ExtractedFact["factType"], subject: row.subject as string, predicate: row.predicate as string, value: row.value as JsonValue, sourceUrl: row.source_url as string, pageTitle: row.page_title as string | null, extractedAt: row.extracted_at as string, confidence: Number(row.confidence), researchRunId: row.research_run_id as string, websiteSnapshotId: row.website_snapshot_id as string | undefined, factFingerprint: row.fact_fingerprint as string }; }
function mapFinding(row: Row): Finding { return { findingType: row.finding_type as string, title: row.title as string, summary: row.summary as string, evidence: row.evidence as string[], confidence: Number(row.confidence), findingFingerprint: row.finding_fingerprint as string }; }
function mapRecommendation(row: Row): Recommendation { return { findingFingerprint: undefined, priority: row.priority as Recommendation["priority"], title: row.title as string, rationale: row.rationale as string, action: row.action as string, recommendationFingerprint: row.recommendation_fingerprint as string }; }
