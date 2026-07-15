import type { SupabaseResearchRepository } from "~/lib/supabase/research-repository.server";
import type { MemoryInput } from "~/types/research";

export class MemoryService {
  constructor(private readonly repository: SupabaseResearchRepository) {}
  rememberConversation(input: MemoryInput & { conversationId: string }) {
    this.validate(input);
    if (!input.conversationId.trim()) throw new Error("Conversation memory requires a conversation ID.");
    return this.repository.appendConversationMemory(input);
  }
  rememberOrganization(input: MemoryInput) {
    this.validate(input);
    return this.repository.appendOrganizationMemory(input);
  }
  private validate(input: MemoryInput) {
    if (!input.businessId.trim() || !input.memoryKey.trim() || !input.source.trim()) throw new Error("Memory requires a business ID, key, and source.");
    if (!Number.isFinite(input.confidence) || input.confidence < 0 || input.confidence > 1) throw new Error("Memory confidence must be a number between 0 and 1.");
  }
}
