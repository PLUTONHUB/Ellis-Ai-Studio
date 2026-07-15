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
  discoveredUrls: string[];
  facts: Array<{ factType: "business_name" | "email" | "phone" | "address" | "social_profile" | "service" | "metadata"; predicate: string; value: string; confidence: number }>;
};

const MAX_RESPONSE_BYTES = 1_000_000;
const MAX_PAGES_PER_SITE = 25;
const MAX_CRAWL_DEPTH = 3;
const MAX_QUEUED_URLS = 250;

export class WebsiteExtractionService {
  /**
   * Crawls a bounded, same-site set of HTML pages.  Individual page failures do
   * not discard the rest of a site's research run; the entry page remains the
   * required successful starting point.
   */
  async extractSite(inputUrl: string): Promise<ExtractedWebsiteData[]> {
    const entryUrl = canonicalizeUrl(inputUrl);
    const siteHost = normalizedSiteHost(new URL(entryUrl).hostname);
    const queue: Array<{ url: string; depth: number }> = [{ url: entryUrl, depth: 0 }];
    const visited = new Set<string>();
    const pages: ExtractedWebsiteData[] = [];

    while (queue.length && pages.length < MAX_PAGES_PER_SITE) {
      const next = queue.shift();
      if (!next || visited.has(next.url)) continue;
      visited.add(next.url);
      try {
        const page = await this.extract(next.url);
        pages.push(page);
        if (next.depth >= MAX_CRAWL_DEPTH) continue;
        for (const discoveredUrl of page.discoveredUrls) {
          if (queue.length >= MAX_QUEUED_URLS) break;
          if (visited.has(discoveredUrl) || normalizedSiteHost(new URL(discoveredUrl).hostname) !== siteHost) continue;
          queue.push({ url: discoveredUrl, depth: next.depth + 1 });
        }
      } catch (error) {
        if (next.depth === 0) throw error;
      }
    }
    return pages;
  }

  async extract(inputUrl: string): Promise<ExtractedWebsiteData> {
    const sourceUrl = canonicalizeUrl(inputUrl);
    await this.assertSafeTarget(sourceUrl);
    const response = await withRetry(
      async () => this.fetchWithSafeRedirects(sourceUrl),
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
      discoveredUrls: extractSiteLinks(html, response.url || sourceUrl),
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

  private async fetchWithSafeRedirects(initialUrl: string): Promise<Response> {
    let currentUrl = initialUrl;
    for (let redirects = 0; redirects <= 5; redirects += 1) {
      const response = await fetch(currentUrl, { signal: AbortSignal.timeout(12_000), redirect: "manual" });
      if (response.status >= 500 || response.status === 429) throw new Error(`Transient website response: ${response.status}`);
      if (response.status < 300 || response.status >= 400) return response;
      const location = response.headers.get("location");
      if (!location) throw new Error("Website returned a redirect without a location.");
      currentUrl = canonicalizeUrl(new URL(location, currentUrl).toString());
      await this.assertSafeTarget(currentUrl);
    }
    throw new Error("Website exceeded the maximum of five redirects.");
  }
}

function extractSiteLinks(html: string, baseUrl: string): string[] {
  const urls = new Set<string>();
  for (const href of uniqueMatches(html, /<a\b[^>]*\bhref=["']([^"']+)["']/gi, 1)) {
    if (/^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    try {
      const url = canonicalizeUrl(new URL(href, baseUrl).toString());
      if (!isDocumentUrl(url)) urls.add(url);
    } catch { /* Ignore malformed or unsupported links. */ }
  }
  return [...urls];
}

function isDocumentUrl(url: string): boolean {
  return /\.(?:7z|avi|css|csv|docx?|gif|ico|jpe?g|js|json|mp3|mp4|pdf|png|svg|webp|woff2?|xlsx?|zip)$/i.test(new URL(url).pathname);
}

function normalizedSiteHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
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
