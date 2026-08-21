/**
 * Capture the before/after imagery for the /demos case studies.
 *
 *   node scripts/capture-demos.mjs            # both passes
 *   node scripts/capture-demos.mjs after      # re-render our concepts only
 *   node scripts/capture-demos.mjs before     # re-shoot the live sites only
 *   node scripts/capture-demos.mjs after ryanair usps   # filter by slug
 *
 * "after" renders public/demo-pages/<slug>.html locally — it is fully offline
 * and deterministic, so it runs anywhere.
 *
 * "before" visits the real, public homepage of each company. It needs
 * unrestricted outbound HTTPS; on a locked-down network (CI, sandboxes, the
 * Claude Code web runner) every request is refused by the egress proxy and the
 * pass exits non-zero listing the blocked hosts. Run it from a normal machine.
 *
 * Both passes write the same fixed 1440x900 frame at DPR 2, because a
 * before/after comparison is only honest if both sides are shot identically:
 * same viewport, same crop, same moment in the page's life (the fold).
 */
import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "images", "demos");
const statusFile = join(root, "src", "data", "demo-captures.ts");

/** Viewport is the contract between the two passes — do not vary it per site. */
const FRAME = { width: 1440, height: 900 };
const DPR = 2;
const JPEG = { type: "jpeg", quality: 82 };

/** The six studies. `before` is the live homepage; `after` is our concept. */
const DEMOS = [
  { slug: "berkshire-hathaway", before: "https://www.berkshirehathaway.com/" },
  { slug: "craigslist", before: "https://www.craigslist.org/about/sites" },
  { slug: "ryanair", before: "https://www.ryanair.com/gb/en" },
  { slug: "usps", before: "https://www.usps.com/" },
  { slug: "yahoo", before: "https://www.yahoo.com/" },
  { slug: "jcpenney", before: "https://www.jcpenney.com/" },
];

/**
 * Consent walls are the main thing standing between a headless browser and a
 * usable screenshot of a large commercial site. Try the common accept controls,
 * ignore the ones that are not present, and never fail the shot over it.
 */
const CONSENT = [
  'button:has-text("Accept all")',
  'button:has-text("Accept All")',
  'button:has-text("Accept cookies")',
  'button:has-text("I accept")',
  'button:has-text("Agree")',
  'button:has-text("Got it")',
  '[aria-label="Accept all"]',
  "#onetrust-accept-btn-handler",
  ".ot-sdk-container button",
];

async function dismissConsent(page) {
  for (const selector of CONSENT) {
    try {
      const button = page.locator(selector).first();
      if (await button.isVisible({ timeout: 600 })) {
        await button.click({ timeout: 1500 });
        await page.waitForTimeout(700);
        return;
      }
    } catch {
      /* selector absent or detached — next candidate */
    }
  }
}

async function shoot(context, url, file, { live }) {
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: live ? "networkidle" : "load", timeout: live ? 45000 : 20000 });
    if (live) {
      await dismissConsent(page);
      // Carousels and lazy images settle a beat after networkidle.
      await page.waitForTimeout(2500);
    }
    await page.evaluate(() => document.fonts?.ready);
    await page.screenshot({ path: file, ...JPEG });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message.split("\n")[0] };
  } finally {
    await page.close();
  }
}

/**
 * Stand-in for a before shot that has not been captured yet. Deliberately not a
 * drawing of the real site — inventing a depiction of someone else's homepage
 * would misrepresent them. It states plainly that the capture is outstanding.
 */
async function writePlaceholder(context, demo) {
  const page = await context.newPage();
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>
    html,body{margin:0;height:100%}
    /* Flat fill, not a pattern — a placeholder that is going to be replaced
       should not cost 180 KB of JPEG noise in the repository. */
    body{display:grid;place-content:center;justify-items:center;gap:22px;text-align:center;
      background:#EDEAE3;color:#4A5563;font:400 17px/1.6 ui-sans-serif,system-ui,sans-serif}
    b{font-size:23px;color:#211E1A;font-weight:600;letter-spacing:-.01em}
    code{font:13px ui-monospace,monospace;background:#fff;border:1px solid #D3C9B4;
      border-radius:4px;padding:9px 14px;color:#211E1A}
    p{margin:0;max-width:52ch}
    </style>
    <b>“Before” screenshot not captured</b>
    <p>This frame is reserved for a real, unretouched screenshot of
       <strong>${demo.before}</strong>. It was not captured in the build environment,
       which blocks outbound requests to public websites.</p>
    <code>node scripts/capture-demos.mjs before ${demo.slug}</code>`);
  await page.screenshot({ path: join(outDir, `${demo.slug}-before.jpg`), ...JPEG });
  await page.close();
}

const args = process.argv.slice(2);
const passes = ["before", "after"].filter((p) => args.includes(p));
const slugs = args.filter((a) => !["before", "after"].includes(a));
const run = passes.length ? passes : ["after", "before"];
const targets = slugs.length ? DEMOS.filter((d) => slugs.includes(d.slug)) : DEMOS;

if (!targets.length) {
  console.error(`No demos matched: ${slugs.join(", ")}`);
  process.exit(1);
}

/**
 * Prefer the browser Playwright manages. Sandboxes and CI images often ship a
 * pinned Chromium that does not match the build this Playwright wants, so fall
 * back to an explicit binary (CHROMIUM_PATH, or the pre-installed one) rather
 * than failing on a version mismatch we cannot download our way out of.
 */
async function launch() {
  try {
    return await chromium.launch();
  } catch (error) {
    const fallback = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium";
    if (!existsSync(fallback)) throw error;
    console.log(`· bundled Chromium unavailable, using ${fallback}`);
    return chromium.launch({ executablePath: fallback });
  }
}

await mkdir(outDir, { recursive: true });
const browser = await launch();
const context = await browser.newContext({ viewport: FRAME, deviceScaleFactor: DPR });
const blocked = [];

if (run.includes("after")) {
  for (const demo of targets) {
    const src = `file://${join(root, "public", "demo-pages", `${demo.slug}.html`)}`;
    const result = await shoot(context, src, join(outDir, `${demo.slug}-after.jpg`), { live: false });
    console.log(`${result.ok ? "✓" : "✗"} after   ${demo.slug}${result.ok ? "" : ` — ${result.error}`}`);
    if (!result.ok) process.exitCode = 1;
  }
}

if (run.includes("before")) {
  for (const demo of targets) {
    const result = await shoot(context, demo.before, join(outDir, `${demo.slug}-before.jpg`), { live: true });
    if (result.ok) {
      console.log(`✓ before  ${demo.slug}`);
    } else {
      console.log(`✗ before  ${demo.slug} — ${result.error}`);
      blocked.push(demo.slug);
      await writePlaceholder(context, demo);
    }
  }
}

await browser.close();

/**
 * Record which "before" frames are real, so the site can distinguish a genuine
 * screenshot from a placeholder instead of asserting one it does not have.
 * Only the slugs this run touched are updated; the rest keep their status.
 */
if (run.includes("before")) {
  const today = new Date().toISOString().slice(0, 10);
  const previous = Object.fromEntries(
    [...(await readFile(statusFile, "utf8").catch(() => ""))
      .matchAll(/"([\w-]+)":\s*(null|"([\d-]+)")/g)]
      .map((m) => [m[1], m[3] ?? null])
  );
  const status = DEMOS.map((demo) => {
    const touched = targets.some((t) => t.slug === demo.slug);
    const value = touched ? (blocked.includes(demo.slug) ? null : today) : previous[demo.slug] ?? null;
    return `  "${demo.slug}": ${value ? `"${value}"` : "null"},`;
  }).join("\n");

  await writeFile(
    statusFile,
    `/**\n * Generated by scripts/capture-demos.mjs — do not edit by hand.\n *\n` +
      ` * Records the date each "before" frame was actually shot from the live site.\n` +
      ` * \`null\` means the capture has not succeeded yet and the image on disk is the\n` +
      ` * placeholder, so the UI says "pending capture" instead of claiming a\n` +
      ` * screenshot it does not have.\n */\n` +
      `export const capturedBefore: Record<string, string | null> = {\n${status}\n};\n`
  );
  console.log(`· wrote ${statusFile.replace(root + "/", "")}`);
}

if (blocked.length) {
  console.error(
    `\n${blocked.length} “before” capture(s) failed: ${blocked.join(", ")}.` +
      `\nPlaceholders were written so the pages still render.` +
      `\nRe-run from a machine with unrestricted outbound HTTPS:` +
      `\n  node scripts/capture-demos.mjs before\n`
  );
  process.exitCode = 1;
}
