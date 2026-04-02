import type { StrapiComponent, StrapiImage } from "./strapi.js";
import { buildTokenSection } from "./tokens.js";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image"; data: string; mimeType: string };

type UsageVariant     = { title: string; description: string; images: string[] };
type UsageLayout      = { title: string; description: string; variants: UsageVariant[] };
type UsageCombination = { name: string; pattern: string; whenToUse: string; image?: string };
type UsageExample     = { caption: string; image?: string };

type ParsedUsage = {
  intro: string;
  layoutRules: UsageLayout[];
  combinationRules: UsageCombination[];
  examples: UsageExample[];
};

// ─── Image fetcher ────────────────────────────────────────────────────────────

async function fetchImage(img: StrapiImage): Promise<ContentBlock | null> {
  if (!img.url) return null;
  try {
    const res = await fetch(img.url);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return {
      type: "image",
      data: Buffer.from(buf).toString("base64"),
      mimeType: img.mime ?? res.headers.get("content-type") ?? "image/svg+xml",
    };
  } catch {
    return null;
  }
}

// ─── Usage parser ─────────────────────────────────────────────────────────────

function parseUsageContent(md: string): ParsedUsage {
  const clean = md
    .replace(/\{\{space:\d+px\}\}/g, "")
    .replace(/^[ \t]+(#{1,6} )/gm, "$1") // remove leading spaces before headings
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const pullImages = (text: string): { text: string; images: string[] } => {
    const images: string[] = [];
    const stripped = text
      .replace(/!\[([^\]]*)\]\(https?:\/\/[^\)]+\)/g, (_, alt) => {
        if (alt) images.push(alt);
        return "";
      })
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    return { text: stripped, images };
  };

  const splitByHeading = (text: string, level: number) =>
    text.split(new RegExp(`(?=^#{${level}} )`, "m"));

  const result: ParsedUsage = {
    intro: "",
    layoutRules: [],
    combinationRules: [],
    examples: [],
  };

  for (const block of splitByHeading(clean, 5)) {
    const hm = block.match(/^#{5}\s+\*{0,2}(.+?)\*{0,2}\s*\n/);
    const heading = hm?.[1]?.trim() ?? "";
    const body = hm ? block.slice(hm[0].length).trim() : block.trim();
    const lc = heading.toLowerCase();

    if (!heading || lc === "usage") {
      result.intro = pullImages(body).text;
    } else if (lc === "layout") {
      const h6Blocks = splitByHeading(body, 6);
      const layoutDesc = pullImages(h6Blocks[0]).text;
      const variants: UsageVariant[] = [];
      for (const sub of h6Blocks.slice(1)) {
        const sh = sub.match(/^#{6}\s+\*{0,2}(.+?)\*{0,2}\s*\n/);
        const { text, images } = pullImages(sh ? sub.slice(sh[0].length).trim() : sub.trim());
        variants.push({ title: sh?.[1]?.trim() ?? "", description: text, images });
      }
      result.layoutRules.push({ title: heading, description: layoutDesc, variants });
    } else if (lc.includes("combination")) {
      for (const sub of splitByHeading(body, 6)) {
        const sh = sub.match(/^#{6}\s+\*{0,2}(.+?)\*{0,2}\s*\n/);
        if (!sh) continue;
        const { text, images } = pullImages(sub.slice(sh[0].length).trim());
        result.combinationRules.push({
          name:      sh[1].trim(),
          pattern:   text.match(/Pattern:\s*(.+)/)?.[1]?.trim() ?? "",
          whenToUse: text.match(/Use when:\s*(.+)/)?.[1]?.trim() ?? "",
          image:     images[0],
        });
      }
    } else if (lc.includes("example")) {
      const { text: exBody, images: exImages } = pullImages(body);
      exBody
        .split("\n\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((caption, i) => {
          result.examples.push({ caption, image: exImages[i] });
        });
    }
  }

  return result;
}

// ─── Usage formatter ──────────────────────────────────────────────────────────

function formatParsedUsage(u: ParsedUsage): string {
  const s: string[] = [];

  if (u.intro) {
    s.push("### Overview");
    s.push(u.intro);
  }
  if (u.layoutRules.length) {
    s.push("\n### Layout Rules");
    for (const rule of u.layoutRules) {
      if (rule.description) s.push(rule.description);
      for (const v of rule.variants) {
        s.push(`\n**${v.title}**`);
        if (v.description) s.push(v.description);
        for (const img of v.images) s.push(`[image: ${img}]`);
      }
    }
  }
  if (u.combinationRules.length) {
    s.push("\n### Combination Rules");
    for (const c of u.combinationRules) {
      s.push(`\n**${c.name}**`);
      if (c.pattern)   s.push(`Pattern: ${c.pattern}`);
      if (c.whenToUse) s.push(`Use when: ${c.whenToUse}`);
      if (c.image)     s.push(`[image: ${c.image}]`);
    }
  }
  if (u.examples.length) {
    s.push("\n### Examples");
    for (const e of u.examples) {
      if (e.image)   s.push(`[image: ${e.image}]`);
      if (e.caption) s.push(e.caption);
    }
  }

  return s.join("\n");
}

// ─── Component formatter ──────────────────────────────────────────────────────

export async function formatComponent(item: StrapiComponent): Promise<ContentBlock[]> {
  const blocks: ContentBlock[] = [];
  const text: string[] = [];

  const flush = () => {
    const t = text.join("\n").trim();
    if (t) blocks.push({ type: "text", text: t });
    text.length = 0;
  };

  const addImage = async (img: StrapiImage) => {
    flush();
    const block = await fetchImage(img);
    if (block) blocks.push(block);
  };

  // Header
  text.push(`# ${item.Title}`);
  if (item.Description) text.push(item.Description);

  // Overview
  const ov = item.Overview;
  if (ov) {
    const hasAnatomy = ov.Anatomy?.some((a) => a.AnatomyImage?.url);
    const hasTypes   = ov.Type?.some((t) => t.TypeElements?.length);
    const hasStates  = ov.States?.some((s) => s.Image?.url);

    if (hasAnatomy || hasTypes || hasStates) {
      text.push("\n## Overview\n");
      if (hasAnatomy) {
        text.push("### Anatomy");
        for (const a of ov.Anatomy!) {
          if (a.AnatomyImage?.url) await addImage(a.AnatomyImage);
        }
      }
      if (hasTypes) {
        text.push("\n### Types");
        for (const t of ov.Type!) {
          for (const el of t.TypeElements ?? []) {
            const heading = [el.SecondaryTitle, el.PrimaryTitle].filter(Boolean).join(" — ");
            if (heading) text.push(`\n**${heading}**`);
            if (el.Decription) text.push(el.Decription.trim());
          }
        }
      }
      if (hasStates) {
        text.push("\n### States");
        for (const s of ov.States!) {
          if (s.Image?.url) await addImage(s.Image);
        }
      }
    }
  }

  // Specification
  if (item.Specification) {
    const relevant = Object.entries(item.Specification).filter(([k]) => k !== "id");
    if (relevant.length) {
      text.push("\n## Specification\n");
      text.push(relevant.map(([k, v]) => `- ${k}: ${v}`).join("\n"));
    }
  }

  // Usage
  if (item.Usage?.Content) {
    text.push("\n## Usage\n");
    text.push(formatParsedUsage(parseUsageContent(item.Usage.Content)));
  }

  // Guidelines
  if (item.Guidelines?.length) {
    text.push("\n## Guidelines\n");
    for (const g of item.Guidelines) {
      text.push(`### ${g.Title}`);
      for (const el of g.GuidelineElement ?? []) {
        text.push(`\n#### ${el.ElementTitle}`);
        if (el.Description) text.push(el.Description.trim());
      }
    }
  }

  // Accessibility
  if (item.Accessiblity?.length) {
    text.push("\n## Accessibility\n");
    for (const a of item.Accessiblity) {
      text.push(`### ${a.Title}`);
      for (const el of a.AccessiblityElement ?? []) {
        text.push(`\n#### ${el.ElementTitle}`);
        if (el.Description) text.push(el.Description.trim());
      }
    }
  }

  // Tokens
  flush();
  blocks.push({ type: "text", text: "\n" + buildTokenSection(item.Title) });

  return blocks;
}
