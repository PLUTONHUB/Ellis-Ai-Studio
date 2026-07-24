import { loadLocalEnvironment } from "~/lib/local-env.server";

loadLocalEnvironment();

type GeneratedContent = { title: string; body: string };
async function requestContent(instruction: string): Promise<GeneratedContent> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is required to generate content.");
  const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" }, body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini", input: "Return JSON only with title and body. " + instruction + " Brand: Ellis AI Studio designs, builds, and manages AI-powered growth infrastructure for businesses. Write with a professional, clear, confident systems-engineering voice. Avoid hype and do not use legacy terminology." }) });
  const raw = await response.text();
  if (!response.ok) throw new Error("Content generation failed (" + response.status + ").");
  const data = JSON.parse(raw) as { output_text?: string };
  if (!data.output_text) throw new Error("Content generation returned no text.");
  const parsed = JSON.parse(data.output_text) as GeneratedContent;
  if (!parsed.title || !parsed.body) throw new Error("Content generation returned an incomplete draft.");
  return parsed;
}
export async function generateLinkedInDraft(topic: string) { return requestContent("Create an original 500–900 word LinkedIn post about: " + topic + ". Include a strong hook, short paragraphs, an actionable takeaway, a natural CTA to request an Ellis AI Studio business assessment, and 5–8 relevant hashtags."); }
export async function repurposeForPlatform(body: string, platform: "x" | "instagram" | "facebook" | "email") { return requestContent("Repurpose this source post for " + platform + ". Preserve its facts and brand voice; adapt its structure and length for the destination. Source post:\n\n" + body); }
