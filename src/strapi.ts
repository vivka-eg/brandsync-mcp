import "dotenv/config";

// ─── Config ──────────────────────────────────────────────────────────────────

const rawUrl = process.env.STRAPI_BASE_URL ?? "";
export const strapiBase = rawUrl ? new URL(rawUrl).origin : "";
export const strapiToken = process.env.STRAPI_API_TOKEN ?? "";

if (!strapiBase || !strapiToken) {
  process.stderr.write(
    "Warning: STRAPI_BASE_URL or STRAPI_API_TOKEN not set — Strapi tools will fail.\n"
  );
}

// ─── Query ───────────────────────────────────────────────────────────────────

export async function strapiQuery(
  collection: string,
  params: URLSearchParams
): Promise<unknown> {
  const url = `${strapiBase}/api/${collection}?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${strapiToken}` },
  });
  if (!res.ok) {
    throw new Error(`Strapi responded ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type GuidelineElement = { ElementTitle: string; Description?: string };
export type AccessibilityElement = { ElementTitle: string; Description?: string };
export type TypeElement = {
  PrimaryTitle?: string;
  SecondaryTitle?: string;
  Decription?: string; // typo in Strapi
};
export type StrapiImage = { name?: string; url?: string; mime?: string };

export type StrapiComponent = {
  documentId: string;
  Title: string;
  Description?: string;
  Overview?: {
    Anatomy?: { AnatomyImage?: StrapiImage }[];
    Type?: { TypeElements?: TypeElement[] }[];
    States?: { Image?: StrapiImage }[];
  };
  Specification?: Record<string, unknown>;
  Usage?: { Content?: string };
  Guidelines?: { Title: string; GuidelineElement?: GuidelineElement[] }[];
  Accessiblity?: { Title: string; AccessiblityElement?: AccessibilityElement[] }[]; // typo in Strapi
  CodeExamples?: { id: number; Framework: string; Variant: string; Group: string; Code: string }[];
};
