import { createHash } from "node:crypto";

export function canonicalizeUrl(input: string): string {
  const url = new URL(input.trim());
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only HTTP(S) website URLs can be researched.");
  }
  url.hash = "";
  url.hostname = url.hostname.toLowerCase();
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  for (const key of [...url.searchParams.keys()]) {
    if (key.startsWith("utm_") || key === "gclid" || key === "fbclid") url.searchParams.delete(key);
  }
  return url.toString();
}

export function normalizeText(value: string): string {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}

export function normalizeEmail(value: string): string {
  return normalizeText(value).toLowerCase();
}

export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) {
    throw new Error("Phone values must contain between 8 and 15 digits.");
  }
  if (!value.trim().startsWith("+") && digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}

export function fingerprint(...values: unknown[]): string {
  return createHash("sha256")
    .update(JSON.stringify(values))
    .digest("hex");
}

export function normalizeBusinessKey(name: string, canonicalWebsiteUrl: string): string {
  return fingerprint(normalizeText(name).toLowerCase(), canonicalWebsiteUrl);
}
