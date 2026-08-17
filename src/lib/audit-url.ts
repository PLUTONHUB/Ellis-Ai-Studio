/**
 * Website input handling for the AI Opportunity Audit entry form.
 *
 * Kept out of the component so the parsing rules can be tested directly —
 * this is the first thing a visitor touches, and rejecting a legitimate
 * address is the most expensive bug the entry page can have.
 */

/** Hostname labels: alphanumeric, inner hyphens allowed, at least two parts. */
const HOSTNAME = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;

/**
 * Accepts what people actually type — "example.com", "www.example.com",
 * "https://example.com/contact", trailing spaces — and returns a clean
 * lowercase hostname, or null when it isn't a website address at all.
 */
export function normalizeWebsite(input: string): string | null {
  const raw = input.trim().replace(/^[a-z]+:\/\//i, "").replace(/^www\./i, "");
  const host = raw.split(/[/?#]/)[0];
  if (!host || host.length > 253) return null;
  if (!HOSTNAME.test(host)) return null;
  // Must end in a real-looking TLD: "com" or "localhost" alone is a typo here.
  if (!/\.[a-z]{2,}$/i.test(host)) return null;
  return host.toLowerCase();
}
