/**
 * Quick integration test — runs against live Strapi.
 * Usage: npx tsx src/test.ts
 */

import "dotenv/config";
import { strapiBase, strapiToken } from "./strapi.js";
import { formatComponent } from "./formatter.js";
import { buildTokenSection } from "./tokens.js";
import type { StrapiComponent } from "./strapi.js";

const PASS = "✅";
const FAIL = "❌";
const WARN = "⚠️ ";

function check(label: string, value: boolean) {
  console.log(`  ${value ? PASS : FAIL} ${label}`);
}

async function fetchComponent(name: string): Promise<StrapiComponent | null> {
  const params = new URLSearchParams({
    "filters[Title][$eqi]": name,
    "pagination[pageSize]": "1",
  });
  const res = await fetch(`${strapiBase}/api/components?${params}`, {
    headers: { Authorization: `Bearer ${strapiToken}` },
  });
  const list = (await res.json()) as { data?: { documentId: string }[] };
  const doc = list.data?.[0]?.documentId;
  if (!doc) return null;

  const deepParams = new URLSearchParams({
    "populate[Overview][populate][Anatomy][populate]":  "*",
    "populate[Overview][populate][Type][populate]":     "*",
    "populate[Overview][populate][States][populate]":   "*",
    "populate[Specification]":                          "true",
    "populate[Usage][populate]":                        "*",
    "populate[Guidelines][populate]":                   "*",
    "populate[Accessiblity][populate]":                 "*",
  });
  const full = await fetch(`${strapiBase}/api/components/${doc}?${deepParams}`, {
    headers: { Authorization: `Bearer ${strapiToken}` },
  });
  return ((await full.json()) as { data?: StrapiComponent }).data ?? null;
}

// ─── Test 1: Strapi connectivity ─────────────────────────────────────────────

console.log("\n📡 Test 1: Strapi connectivity");
try {
  const res = await fetch(`${strapiBase}/api/components?pagination[pageSize]=1`, {
    headers: { Authorization: `Bearer ${strapiToken}` },
  });
  check("Strapi reachable", res.ok);
  check("Auth token valid", res.status !== 401 && res.status !== 403);
} catch (e) {
  console.log(`  ${FAIL} Strapi unreachable: ${e}`);
}

// ─── Test 2: list_components ──────────────────────────────────────────────────

console.log("\n📋 Test 2: list_components");
const listRes = await fetch(
  `${strapiBase}/api/components?pagination[pageSize]=100`,
  { headers: { Authorization: `Bearer ${strapiToken}` } }
);
const listData = (await listRes.json()) as { data?: { Title: string }[] };
const components = listData.data ?? [];
check(`Returns components (got ${components.length})`, components.length > 0);
check("Has 20+ components", components.length >= 20);

// ─── Test 3: get_component — Buttons ─────────────────────────────────────────

console.log("\n🔘 Test 3: get_component(\"Buttons\")");
const buttons = await fetchComponent("Buttons");
check("Component found", buttons !== null);

if (buttons) {
  check("Has Title", !!buttons.Title);
  check("Has Description", !!buttons.Description);
  check("Has Overview", !!buttons.Overview);
  check("Has Anatomy image", !!buttons.Overview?.Anatomy?.[0]?.AnatomyImage?.url);
  check("Has Types", (buttons.Overview?.Type?.length ?? 0) > 0);
  check("Has Specification", !!buttons.Specification);
  check("Has Usage content", !!buttons.Usage?.Content);
  check("Has Guidelines", (buttons.Guidelines?.length ?? 0) > 0);
  check("Has Accessibility", (buttons.Accessiblity?.length ?? 0) > 0);

  // Check Usage images
  const usageContent = buttons.Usage?.Content ?? "";
  const imageUrls = [...usageContent.matchAll(/!\[[^\]]*\]\((https?:\/\/[^\)]+)\)/g)].map(m => m[1]);
  check(`Usage has ${imageUrls.length} inline images`, imageUrls.length > 0);

  if (imageUrls.length > 0) {
    const expiries = imageUrls.map(url => {
      const m = url.match(/X-Amz-Expires=(\d+)/);
      return m ? parseInt(m[1]) : null;
    });
    const expired = expiries.filter(e => e !== null && e < 3600).length;
    check(`Usage image expiry — ${expired} short-lived (<1hr)`, true);
    console.log(`    ${WARN} ${expired}/${imageUrls.length} Usage URLs have <1hr expiry → refreshImageUrl() will fix these`);
  }
}

// ─── Test 4: formatComponent — content blocks ─────────────────────────────────

console.log("\n🖼️  Test 4: formatComponent output");
if (buttons) {
  const blocks = await formatComponent(buttons);
  const textBlocks  = blocks.filter(b => b.type === "text");
  const imageBlocks = blocks.filter(b => b.type === "image");

  check(`Returns content blocks (got ${blocks.length})`, blocks.length > 0);
  check(`Has text blocks (got ${textBlocks.length})`, textBlocks.length > 0);
  check(`Has image blocks (got ${imageBlocks.length})`, imageBlocks.length > 0);

  // Check images are real base64, not placeholders
  const realImages = imageBlocks.filter(b => b.type === "image" && b.data.length > 100);
  check(`Image blocks have real base64 data (${realImages.length}/${imageBlocks.length})`, realImages.length === imageBlocks.length);

  // Check Usage images specifically (not placeholders)
  const allText = textBlocks.map(b => b.type === "text" ? b.text : "").join("\n");
  const hasPlaceholders = allText.includes("[image:");
  check("No [image: placeholder] in output", !hasPlaceholders);

  // Check tokens are present
  check("Tokens section present", allText.includes("## Tokens"));
  check("Button tokens present", allText.includes("--bs-button-"));
}

// ─── Test 5: Tokens ───────────────────────────────────────────────────────────

console.log("\n🎨 Test 5: Tokens");
try {
  const tokenSection = buildTokenSection("Buttons");
  check("Token section generated", tokenSection.length > 0);
  check("Has button-specific tokens", tokenSection.includes("--bs-button-"));
  check("Has breakpoints", tokenSection.includes("--breakpoint-"));
  check("Has interaction states", tokenSection.includes("--opacity-"));
} catch (e) {
  console.log(`  ${FAIL} Token error: ${e}`);
}

// ─── Test 6: Usage image refresh ──────────────────────────────────────────────

console.log("\n🔄 Test 6: Usage image URL refresh");
if (buttons?.Usage?.Content) {
  const imageUrls = [...buttons.Usage.Content.matchAll(/!\[[^\]]*\]\((https?:\/\/[^\)]+)\)/g)].map(m => m[1]);
  if (imageUrls.length > 0) {
    const testUrl = imageUrls[0];
    const hashMatch = testUrl.match(/\/([^\/\?]+?)(\?|$)/);
    const hash = hashMatch?.[1]?.replace(/\.[^.]+$/, "");
    const uploadRes = await fetch(
      `${strapiBase}/api/upload/files?filters[hash][$eq]=${hash}`,
      { headers: { Authorization: `Bearer ${strapiToken}` } }
    );
    const files = (await uploadRes.json()) as { url?: string }[];
    const refreshedUrl = files[0]?.url;
    check("Upload API returns file", !!refreshedUrl);
    if (refreshedUrl) {
      const hasExpiry = refreshedUrl.includes("X-Amz-Expires=");
      check("Refreshed URL has no expiry (permanent)", !hasExpiry);
      console.log(`    URL: ${refreshedUrl.slice(0, 80)}...`);
    }
  }
}

// ─── Test 7: search_guidelines ────────────────────────────────────────────────

console.log("\n🔍 Test 7: search_guidelines");
const guideRes = await fetch(
  `${strapiBase}/api/foundations?populate[0]=Article&filters[Article][Title][$containsi]=typography&pagination[pageSize]=3`,
  { headers: { Authorization: `Bearer ${strapiToken}` } }
);
const guideData = (await guideRes.json()) as { data?: unknown[] };
check("Foundations endpoint accessible", guideRes.ok);
check("Returns foundation articles", (guideData.data?.length ?? 0) > 0);

console.log("\n─────────────────────────────────────────");
console.log("Done. Check ❌ items above for issues.\n");
