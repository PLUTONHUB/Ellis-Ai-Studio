import {
  canonicalizeUrl,
  fingerprint,
  normalizeEmail,
  normalizePhone,
  normalizeText,
} from "~/lib/pluto/research/normalization";
import type { ExtractedFact } from "~/types/research";

type RawFact = Omit<ExtractedFact, "factFingerprint" | "sourceUrl" | "value"> & {
  sourceUrl: string;
  value: string;
};

export class FactNormalizationService {
  normalize(rawFact: RawFact): ExtractedFact {
    this.assertConfidence(rawFact.confidence);
    const sourceUrl = canonicalizeUrl(rawFact.sourceUrl);
    const value = this.normalizeValue(rawFact.factType, rawFact.value);
    const subject = normalizeText(rawFact.subject);
    const predicate = normalizeText(rawFact.predicate).toLowerCase();

    return {
      ...rawFact,
      sourceUrl,
      subject,
      predicate,
      value,
      factFingerprint: fingerprint(rawFact.factType, subject, predicate, value, sourceUrl),
    };
  }

  deduplicate(facts: ExtractedFact[]): ExtractedFact[] {
    const uniqueFacts = new Map<string, ExtractedFact>();
    for (const fact of facts) uniqueFacts.set(fact.factFingerprint, fact);
    return [...uniqueFacts.values()];
  }

  private normalizeValue(factType: ExtractedFact["factType"], value: string): string {
    switch (factType) {
      case "email":
        return normalizeEmail(value);
      case "phone":
        return normalizePhone(value);
      case "social_profile":
        return canonicalizeUrl(value);
      default:
        return normalizeText(value);
    }
  }

  private assertConfidence(confidence: number) {
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
      throw new Error("Fact confidence must be a number between 0 and 1.");
    }
  }
}
