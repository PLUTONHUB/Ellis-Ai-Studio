import assert from "node:assert/strict";
import test from "node:test";
import { buildGmailRawMessage } from "../src/lib/gmail.server";

function header(raw: string, name: string) { return raw.match(new RegExp(`^${name}:\\s*(.+)$`, "mi"))?.[1] ?? ""; }
function decodedParts(raw: string) { return raw.split(/\r?\n--(?:alt|mix)_[A-Za-z0-9]+(?:--)?\r?\n/).flatMap((part) => { const body = part.split(/\r?\n\r?\n/).slice(1).join("\r\n\r\n").trim(); return /Content-Transfer-Encoding: base64/i.test(part) && body ? [Buffer.from(body.replace(/\s/g, ""), "base64").toString("utf8")] : []; }); }
function decodedSubject(raw: string) { const value = header(raw, "Subject"); const encoded = value.match(/^=\?UTF-8\?B\?(.+)\?=$/i); return encoded ? Buffer.from(encoded[1], "base64").toString("utf8") : value; }

test("outbound plain-text mail keeps the subject and recipient-visible text separate from transport headers", () => {
  const raw = buildGmailRawMessage({ to: ["client@example.com"], subject: "Project update", html: "The rollout is complete." });
  assert.equal(decodedSubject(raw), "Project update");
  assert.ok(decodedParts(raw).includes("The rollout is complete."));
  assert.ok(!decodedParts(raw).some((part) => /MIME-Version:|Content-Type:|boundary=/i.test(part)));
});

test("outbound HTML and rich-text mail preserves the editor HTML without showing its source as text", () => {
  const html = "<p><strong>Decision:</strong> approve the launch.</p><p>Thank you.</p>";
  const raw = buildGmailRawMessage({ to: ["client@example.com"], subject: "Launch decision", html });
  const parts = decodedParts(raw);
  assert.equal(parts.at(-1), html);
  assert.ok(parts.some((part) => part.includes("Decision: approve the launch.")));
});

test("outbound replies and forwards use Gmail thread metadata while preserving the user subject and body", () => {
  const reply = buildGmailRawMessage({ to: ["client@example.com"], subject: "Re: Proposal", html: "Thanks — approved.", threadId: "thread_123", inReplyTo: "<original@example.com>", references: ["<original@example.com>"] });
  const forward = buildGmailRawMessage({ to: ["team@example.com"], subject: "Fwd: Proposal", html: "Please review this.", threadId: "thread_456" });
  assert.equal(decodedSubject(reply), "Re: Proposal");
  assert.equal(header(reply, "In-Reply-To"), "<original@example.com>");
  assert.equal(header(reply, "References"), "<original@example.com>");
  assert.ok(decodedParts(reply).includes("Thanks — approved."));
  assert.equal(decodedSubject(forward), "Fwd: Proposal");
  assert.ok(decodedParts(forward).includes("Please review this."));
});

test("attachments and signatures are MIME parts, not content injected into the recipient message", () => {
  const raw = buildGmailRawMessage({ to: ["client@example.com"], subject: "Files attached", html: "Please find the brief attached.", signatureHtml: "<p>Ellis AI Studio</p>", attachments: [{ name: "brief.pdf", mimeType: "application/pdf", dataBase64: "JVBERi0xLjQ=" }] });
  const parts = decodedParts(raw);
  assert.ok(parts.some((part) => part.includes("Please find the brief attached.") && part.includes("Ellis AI Studio")));
  assert.ok(parts.includes("%PDF-1.4"));
  assert.ok(!parts.some((part) => /--mix_|Content-Disposition:/i.test(part)));
});

test("scheduled sends serialize through the same safe outbound builder", () => {
  const raw = buildGmailRawMessage({ to: ["client@example.com"], subject: "Scheduled note", html: "This is scheduled for tomorrow." });
  assert.equal(decodedSubject(raw), "Scheduled note");
  assert.ok(decodedParts(raw).includes("This is scheduled for tomorrow."));
});

test("UTF-8 subjects and bodies preserve smart punctuation across MIME alternatives", () => {
  const subject = "Ellis AI Studio — “your next step” … it’s ready";
  const html = "<p>We’re ready — with “connected systems” … not isolated tools.</p>";
  const raw = buildGmailRawMessage({ to: ["client@example.com"], subject, html });
  assert.match(raw, /^Subject: =\?UTF-8\?B\?.+\?=$/mi);
  assert.match(raw, /Content-Type: text\/plain; charset=UTF-8\r?\nContent-Transfer-Encoding: base64/i);
  assert.match(raw, /Content-Type: text\/html; charset=UTF-8\r?\nContent-Transfer-Encoding: base64/i);
  assert.equal(decodedSubject(raw), subject);
  const parts = decodedParts(raw);
  assert.ok(parts.includes("We’re ready — with “connected systems” … not isolated tools."));
  assert.ok(parts.includes(html));
  assert.equal(Buffer.from(parts.at(-1)!, "utf8").toString("utf8"), html);
  assert.ok(!/charset=(?:ISO-8859-1|Windows-1252)/i.test(raw));
});

test("UTF-8 transport payload is Gmail-safe base64url without character-set fallback", () => {
  const raw = buildGmailRawMessage({ to: ["client@example.com"], subject: "Quotes “ ”, apostrophe ’, dash —, ellipsis …", html: "<p>Quotes “ ”, apostrophe ’, dash —, ellipsis …</p>" });
  const gmailPayload = Buffer.from(raw, "utf8").toString("base64url");
  const reconstructed = Buffer.from(gmailPayload, "base64url").toString("utf8");
  assert.equal(reconstructed, raw);
  assert.equal(decodedSubject(reconstructed), "Quotes “ ”, apostrophe ’, dash —, ellipsis …");
  assert.ok(decodedParts(reconstructed).some((part) => part.includes("apostrophe ’, dash —, ellipsis …")));
});
