import { canonicalizeUrl, fingerprint, normalizeText } from "~/lib/pluto/research/normalization";
import type { JsonObject } from "~/types/research";
import { withRetry } from "~/lib/pluto/research/retry";

export type ExtractedWebsiteData = {
  sourceUrl: string;
  pageTitle: string | null;
  fetchedAt: string;
  contentSha256: string;
  contentType: string;
  httpStatus: number;
  bodyText: string;
  metadata: JsonObject;
  facts: Array<{ factType: "business_name" | "email" | "phone" | "address" | "social_profile" | "service" | "metadata"; predicate: string; value: string; confidence: number }>;
};

const MAX_RESPONSE_BYTES = 1_000_000;

export class WebsiteExtractionService {
  async extract(inputUrl: string): Promise<ExtractedWebsiteData> {
    const sourceUrl = canonicalizeUrl(inputUrl);
    await this.assertSafeTarget(sourceUrl);
    const response = await withRetry(
      async () => {
        const result = await fetch(sourceUrl, { signal: AbortSignal.timeout(12_000), redirect: "follow" });
        if (result.status >= 500 || result.status === 429) throw new Error(`Transient website response: ${result.status}`);
        return result;
      },
      { shouldRetry: (error) => !(error instanceof TypeError && error.message.includes("invalid")) },
    );
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.includes("text/html")) throw new Error(`Expected HTML content, received ${contentType || "an unknown content type"}.`);
    if (!response.ok) throw new Error(`Website responded with HTTP ${response.status}.`);
    const html = await this.readBody(response);
    const pageTitle = matchOne(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = matchOne(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    const bodyText = htmlToText(html);
    const facts = extractFacts(html, bodyText, pageTitle);

    return {
      sourceUrl: canonicalizeUrl(response.url || sourceUrl),
      pageTitle: pageTitle ? normalizeText(decodeEntities(pageTitle)) : null,
      fetchedAt: new Date().toISOString(),
      contentSha256: fingerprint(html),
      contentType,
      httpStatus: response.status,
      bodyText,
      metadata: description ? { description: normalizeText(decodeEntities(description)) } : {},
      facts,
    };
  }

  private async assertSafeTarget(sourceUrl: string) {
    const hostname = new URL(sourceUrl).hostname.toLowerCase();
    if (hostname === "localhost" || hostname.endsWith(".local")) {
      throw new Error("Researching local or private network targets is not permitted.");
    }
    const addresses = isIP(hostname) ? [{ address: hostname }] : await lookup(hostname, { all: true, verbatim: true });
    if (addresses.some(({ address }) => isPrivateAddress(address))) throw new Error("Researching local or private network targets is not permitted.");
  }

  private async readBody(response: Response): Promise<string> {
    const length = Number(response.headers.get("content-length") ?? "0");
    if (length > MAX_RESPONSE_BYTES) throw new Error("Website response exceeds the 1 MB research limit.");
    const html = await response.text();
    if (new TextEncoder().encode(html).byteLength > MAX_RESPONSE_BYTES) throw new Error("Website response exceeds the 1 MB research limit.");
    return html;
  }
}

function extractFacts(html: string, bodyText: string, pageTitle: string | null) {
  const facts: ExtractedWebsiteData["facts"] = [];
  const add = (fact: ExtractedWebsiteData["facts"][number]) => facts.push(fact);
  for (const email of uniqueMatches(html, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) add({ factType: "email", predicate: "has_email", value: email, confidence: 0.98 });
  for (const phone of uniqueMatches(bodyText, /(?:\+?1[ .-]?)?(?:\(?\d{3}\)?[ .-]?)\d{3}[ .-]\d{4}/g)) add({ factType: "phone", predicate: "has_phone", value: phone, confidence: 0.9 });
  for (const href of uniqueMatches(html, /https?:\/\/[^"'\s<>]+/gi).filter((url) => /linkedin\.com|facebook\.com|instagram\.com|x\.com/i.test(url))) add({ factType: "social_profile", predicate: "has_social_profile", value: href.replace(/[),.]+$/, ""), confidence: 0.9 });
  if (pageTitle) add({ factType: "metadata", predicate: "page_title", value: decodeEntities(pageTitle), confidence: 0.99 });
  const headings = uniqueMatches(html, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi, 1).map((heading) => normalizeText(htmlToText(heading))).filter((heading) => heading.length > 2 && heading.length < 180);
  for (const heading of headings.slice(0, 12)) add({ factType: "service", predicate: "page_heading", value: heading, confidence: 0.72 });
  return facts;
}

function htmlToText(html: string): string {
  return normalizeText(decodeEntities(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "))).slice(0, 200_000);
}
function matchOne(value: string, pattern: RegExp): string | null { return pattern.exec(value)?.[1] ?? null; }
function uniqueMatches(value: string, pattern: RegExp, group = 0): string[] { return [...new Set(Array.from(value.matchAll(pattern), (match) => match[group]).filter((match): match is string => Boolean(match)))]; }
function decodeEntities(value: string): string { return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">"); }
function isPrivateAddress(address: string): boolean {
  if (address.includes(":")) {
    const normalized = address.toLowerCase();
    return normalized === "::1" || normalized === "::" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:");
  }
  const parts = address.split(".").map(Number);
  return parts.length === 4 && (parts[0] === 0 || parts[0] === 10 || parts[0] === 127 || (parts[0] === 169 && parts[1] === 254) || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168) || (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127));
}
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
