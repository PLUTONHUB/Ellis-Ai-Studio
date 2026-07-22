import { createHmac, randomBytes, timingSafeEqual, webcrypto } from "node:crypto";
import { env } from "cloudflare:workers";
import { getRequestHeader, setResponseHeader } from "@tanstack/react-start/server";

const GOOGLE_SCOPE = "https://www.googleapis.com/auth/business.manage";
const CONNECTION_ID = "ellis-default";
const TOKEN_STORE_KEY = "google-business/tokens";

type OAuthToken = { accessToken: string; refreshToken: string; expiresAt: number };
type StoredTokens = Record<string, OAuthToken>;
type GoogleAccount = { name: string; accountName?: string; type?: string };
type GoogleLocation = {
  name: string;
  title?: string;
  storefrontAddress?: { addressLines?: string[]; locality?: string; administrativeArea?: string; postalCode?: string; regionCode?: string };
  regularHours?: { periods?: Array<{ openDay?: string; openTime?: { hours?: number; minutes?: number }; closeDay?: string; closeTime?: { hours?: number; minutes?: number } }> };
  phoneNumbers?: { primaryPhone?: string };
  websiteUri?: string;
  categories?: { primaryCategory?: { displayName?: string }; additionalCategories?: Array<{ displayName?: string }> };
};

export type BusinessProfile = {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  categories: string[];
  hours: string[];
  verificationStatus: "verified" | "needs_attention" | "unknown";
};

export type GoogleBusinessDashboard = {
  accessRequired: boolean;
  configured: boolean;
  connected: boolean;
  message?: string;
  accounts: GoogleAccount[];
  locations: BusinessProfile[];
};

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function configReady() {
  return Boolean(env.GBP_TOKEN_STORE) && ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_REDIRECT_URI", "GBP_OAUTH_STATE_SECRET", "GBP_TOKEN_ENCRYPTION_KEY", "GBP_DASHBOARD_ACCESS_TOKEN"].every((name) => Boolean(process.env[name]));
}

function cookieValue(name: string) {
  const cookie = getRequestHeader("cookie") ?? "";
  return cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

function accessAllowed() {
  const expected = process.env.GBP_DASHBOARD_ACCESS_TOKEN;
  const actual = cookieValue("ellis_gbp_dashboard");
  if (!expected || !actual || actual.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export function unlockDashboard(accessToken: string) {
  const expected = required("GBP_DASHBOARD_ACCESS_TOKEN");
  if (accessToken.length !== expected.length || !timingSafeEqual(Buffer.from(accessToken), Buffer.from(expected))) {
    throw new Error("Dashboard access was denied.");
  }
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  setResponseHeader("Set-Cookie", `ellis_gbp_dashboard=${encodeURIComponent(expected)}; HttpOnly; SameSite=Lax; Path=/${secure}; Max-Age=28800`);
}

function requireAccess() {
  if (!accessAllowed()) throw new Error("Dashboard access is required.");
}

function base64Url(value: Uint8Array | string) {
  return Buffer.from(value).toString("base64url");
}

function stateSignature(payload: string) {
  return createHmac("sha256", required("GBP_OAUTH_STATE_SECRET")).update(payload).digest("base64url");
}

function encryptionKey() {
  return webcrypto.subtle.digest("SHA-256", new TextEncoder().encode(required("GBP_TOKEN_ENCRYPTION_KEY"))).then((digest) => webcrypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]));
}

async function readTokens(): Promise<StoredTokens> {
  try {
    const stored = await env.GBP_TOKEN_STORE.get(TOKEN_STORE_KEY);
    if (!stored) return {};
    const envelope = JSON.parse(stored) as { iv: string; ciphertext: string };
    const plain = await webcrypto.subtle.decrypt({ name: "AES-GCM", iv: Buffer.from(envelope.iv, "base64url") }, await encryptionKey(), Buffer.from(envelope.ciphertext, "base64url"));
    return JSON.parse(new TextDecoder().decode(plain)) as StoredTokens;
  } catch {
    throw new Error("The encrypted Google token store could not be read.");
  }
}

async function writeTokens(tokens: StoredTokens) {
  const iv = randomBytes(12);
  const plain = new TextEncoder().encode(JSON.stringify(tokens));
  const ciphertext = await webcrypto.subtle.encrypt({ name: "AES-GCM", iv }, await encryptionKey(), plain);
  await env.GBP_TOKEN_STORE.put(TOKEN_STORE_KEY, JSON.stringify({ iv: base64Url(iv), ciphertext: base64Url(new Uint8Array(ciphertext)) }));
}

async function refreshToken(token: OAuthToken) {
  if (token.expiresAt > Date.now() + 60_000) return token;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: required("GOOGLE_OAUTH_CLIENT_ID"), client_secret: required("GOOGLE_OAUTH_CLIENT_SECRET"), refresh_token: token.refreshToken, grant_type: "refresh_token" }),
  });
  const body = await response.json() as { access_token?: string; expires_in?: number; error_description?: string };
  if (!response.ok || !body.access_token || !body.expires_in) throw new Error(body.error_description ?? "Google token refresh failed. Reconnect the Business Profile account.");
  const refreshed = { ...token, accessToken: body.access_token, expiresAt: Date.now() + body.expires_in * 1000 };
  const tokens = await readTokens();
  tokens[CONNECTION_ID] = refreshed;
  await writeTokens(tokens);
  return refreshed;
}

async function authorizedFetch(url: string) {
  const tokens = await readTokens();
  const token = tokens[CONNECTION_ID];
  if (!token) throw new Error("No Business Profile account is connected.");
  const activeToken = await refreshToken(token);
  const response = await fetch(url, { headers: { Authorization: `Bearer ${activeToken.accessToken}` } });
  if (!response.ok) throw new Error(`Google Business Profile request failed (${response.status}).`);
  return response.json() as Promise<unknown>;
}

export function authorizationUrl() {
  requireAccess();
  if (!configReady()) throw new Error("Google Business Profile is not configured. Add the required deployment secrets first.");
  const payload = base64Url(JSON.stringify({ nonce: base64Url(randomBytes(16)), expiresAt: Date.now() + 10 * 60_000 }));
  const state = `${payload}.${stateSignature(payload)}`;
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({ client_id: required("GOOGLE_OAUTH_CLIENT_ID"), redirect_uri: required("GOOGLE_OAUTH_REDIRECT_URI"), response_type: "code", scope: GOOGLE_SCOPE, access_type: "offline", prompt: "consent", state }).toString();
  return url.toString();
}

export async function completeAuthorization(code: string, state: string) {
  requireAccess();
  const [payload, signature] = state.split(".");
  if (!payload || !signature || signature.length !== stateSignature(payload).length || !timingSafeEqual(Buffer.from(signature), Buffer.from(stateSignature(payload)))) throw new Error("OAuth state validation failed.");
  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { expiresAt?: number };
  if (!decoded.expiresAt || decoded.expiresAt < Date.now()) throw new Error("OAuth state expired. Start the connection again.");
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: required("GOOGLE_OAUTH_CLIENT_ID"), client_secret: required("GOOGLE_OAUTH_CLIENT_SECRET"), redirect_uri: required("GOOGLE_OAUTH_REDIRECT_URI"), grant_type: "authorization_code" }),
  });
  const body = await response.json() as { access_token?: string; refresh_token?: string; expires_in?: number; error_description?: string };
  if (!response.ok || !body.access_token || !body.refresh_token || !body.expires_in) throw new Error(body.error_description ?? "Google OAuth did not return a refresh token. Revoke access and reconnect with consent.");
  await writeTokens({ ...(await readTokens()), [CONNECTION_ID]: { accessToken: body.access_token, refreshToken: body.refresh_token, expiresAt: Date.now() + body.expires_in * 1000 } });
}

function formatAddress(address: GoogleLocation["storefrontAddress"]) {
  if (!address) return "Not available";
  return [address.addressLines?.join(", "), address.locality, address.administrativeArea, address.postalCode, address.regionCode].filter(Boolean).join(", ");
}

function formatHours(hours: GoogleLocation["regularHours"]) {
  return hours?.periods?.map((period) => `${period.openDay ?? ""} ${period.openTime?.hours ?? 0}:${String(period.openTime?.minutes ?? 0).padStart(2, "0")}–${period.closeDay && period.closeDay !== period.openDay ? `${period.closeDay} ` : ""}${period.closeTime?.hours ?? 0}:${String(period.closeTime?.minutes ?? 0).padStart(2, "0")}`) ?? [];
}

async function verificationStatus(locationName: string): Promise<BusinessProfile["verificationStatus"]> {
  try {
    const body = await authorizedFetch(`https://mybusinessverifications.googleapis.com/v1/${locationName}/VoiceOfMerchantState`) as { hasVoiceOfMerchant?: boolean };
    return body.hasVoiceOfMerchant ? "verified" : "needs_attention";
  } catch {
    return "unknown";
  }
}

export async function dashboard(): Promise<GoogleBusinessDashboard> {
  if (!accessAllowed()) return { accessRequired: true, configured: configReady(), connected: false, accounts: [], locations: [] };
  if (!configReady()) return { accessRequired: false, configured: false, connected: false, message: "Add the GBP_TOKEN_STORE binding plus Google OAuth, state, encryption, and dashboard-access secrets to enable this connection.", accounts: [], locations: [] };
  const tokens = await readTokens();
  if (!tokens[CONNECTION_ID]) return { accessRequired: false, configured: true, connected: false, accounts: [], locations: [] };
  try {
    const accountData = await authorizedFetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts") as { accounts?: GoogleAccount[] };
    const readMask = "name,title,storefrontAddress,regularHours,phoneNumbers,websiteUri,categories";
    const locationData = await authorizedFetch(`https://mybusinessbusinessinformation.googleapis.com/v1/accounts/-/locations?readMask=${encodeURIComponent(readMask)}`) as { locations?: GoogleLocation[] };
    const locations = await Promise.all((locationData.locations ?? []).map(async (location) => ({ id: location.name, name: location.title ?? location.name, address: formatAddress(location.storefrontAddress), phone: location.phoneNumbers?.primaryPhone ?? null, website: location.websiteUri ?? null, categories: [location.categories?.primaryCategory?.displayName, ...(location.categories?.additionalCategories?.map((category) => category.displayName) ?? [])].filter((value): value is string => Boolean(value)), hours: formatHours(location.regularHours), verificationStatus: await verificationStatus(location.name) })));
    return { accessRequired: false, configured: true, connected: true, accounts: accountData.accounts ?? [], locations };
  } catch (error) {
    return { accessRequired: false, configured: true, connected: false, message: error instanceof Error ? error.message : "Google Business Profile could not be loaded.", accounts: [], locations: [] };
  }
}
