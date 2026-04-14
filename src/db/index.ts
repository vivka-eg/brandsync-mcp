import "dotenv/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ─── Client ──────────────────────────────────────────────────────────────────

const SUPABASE_URL         = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  process.stderr.write(
    "Warning: SUPABASE_URL or SUPABASE_SERVICE_KEY not set — Supabase tools will fail.\n"
  );
}

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY
);

// ─── Types ───────────────────────────────────────────────────────────────────

export type CorpusType =
  | "component"
  | "component_html"
  | "pattern"
  | "pattern_html"
  | "pattern_css"
  | "decision"
  | "gap"
  | "token"
  | "graph";

export type CorpusEntry = {
  id: string;
  slug: string;
  type: CorpusType;
  path: string;
  content: string;
  org_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

// ─── Graph ───────────────────────────────────────────────────────────────────

/** Returns the most recent graph snapshot for an org (or the shared base when orgId=null). */
export async function getLatestGraph(orgId: string | null = null): Promise<unknown | null> {
  let query = supabase
    .from("graph_snapshots")
    .select("graph, built_at")
    .order("built_at", { ascending: false })
    .limit(1);

  if (orgId) {
    query = query.eq("org_id", orgId);
  } else {
    query = query.is("org_id", null);
  }

  const { data, error } = await query;
  if (error || !data?.length) return null;
  return data[0].graph;
}

// ─── Corpus queries ───────────────────────────────────────────────────────────

/** List all entries of a given type for the shared base (org_id = NULL). */
export async function listCorpusByType(type: CorpusType): Promise<CorpusEntry[]> {
  const { data, error } = await supabase
    .from("corpus_entries")
    .select("id, slug, type, path, content, org_id, created_by, created_at, updated_at")
    .eq("type", type)
    .is("org_id", null);

  if (error) return [];
  return (data ?? []) as CorpusEntry[];
}

/**
 * Find a single corpus entry whose slug contains slugPattern (case-insensitive).
 * Tries an exact component-name match first (e.g. "buttons" → slug ends with /buttons.md),
 * then falls back to ilike.
 */
export async function findCorpusEntry(
  slugPattern: string,
  type: CorpusType
): Promise<CorpusEntry | null> {
  const { data, error } = await supabase
    .from("corpus_entries")
    .select("*")
    .eq("type", type)
    .is("org_id", null)
    .ilike("slug", `%${slugPattern}%`)
    .limit(1);

  if (error || !data?.length) return null;
  return data[0] as CorpusEntry;
}

/** Full-text keyword search across content, restricted to given types. */
export async function searchCorpus(
  query: string,
  types: CorpusType[],
  limit = 5
): Promise<CorpusEntry[]> {
  const { data, error } = await supabase
    .from("corpus_entries")
    .select("id, slug, type, content, org_id, created_by, created_at, updated_at, path")
    .in("type", types)
    .is("org_id", null)
    .ilike("content", `%${query}%`)
    .limit(limit);

  if (error) return [];
  return (data ?? []) as CorpusEntry[];
}

// ─── Corpus writes ────────────────────────────────────────────────────────────

export async function upsertCorpusEntry(
  entry: Omit<CorpusEntry, "id" | "created_at" | "updated_at">
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("corpus_entries")
    .upsert(entry, { onConflict: "slug,type,org_id" });

  return { error: error?.message ?? null };
}
