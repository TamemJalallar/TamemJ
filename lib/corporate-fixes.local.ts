import type { CorporateFixStep, CorporateTechFix } from "@/lib/corporate-fixes.registry";

export const LOCAL_CORPORATE_FIXES_STORAGE_KEY = "corporateTechFixes:localEntries:v1";
export const LOCAL_CORPORATE_FIXES_UPDATED_EVENT = "corporate-tech-fixes:local-entries-updated";
export const LOCAL_CORPORATE_FIX_SLUG_PREFIX = "local-";

interface LocalCorporateFixStore {
  version: 1;
  entries: CorporateTechFix[];
}

function normalizeTagList(tags: string[]): string[] {
  const seen = new Set<string>();
  const next: string[] = [];

  for (const raw of tags) {
    const tag = raw.trim().toLowerCase();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    next.push(tag);
  }

  return next;
}

function isValidStep(step: unknown): step is CorporateFixStep {
  if (!step || typeof step !== "object") {
    return false;
  }

  const candidate = step as Partial<CorporateFixStep>;

  return (
    typeof candidate.title === "string" &&
    typeof candidate.content === "string" &&
    (candidate.type === "info" || candidate.type === "command" || candidate.type === "warning")
  );
}

function isValidCorporateFix(value: unknown): value is CorporateTechFix {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CorporateTechFix>;

  return (
    typeof candidate.slug === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.category === "string" &&
    typeof candidate.severity === "string" &&
    typeof candidate.accessLevel === "string" &&
    typeof candidate.estimatedTime === "string" &&
    typeof candidate.description === "string" &&
    Array.isArray(candidate.tags) &&
    candidate.tags.every((tag) => typeof tag === "string") &&
    Array.isArray(candidate.steps) &&
    candidate.steps.every(isValidStep)
  );
}

function normalizeLocalCorporateFix(entry: CorporateTechFix): CorporateTechFix {
  const rawSlug = entry.slug.trim().replace(new RegExp(`^${LOCAL_CORPORATE_FIX_SLUG_PREFIX}+`), "");
  const safeSlug = rawSlug || "untitled-corporate-fix";

  return {
    ...entry,
    slug: `${LOCAL_CORPORATE_FIX_SLUG_PREFIX}${safeSlug}`,
    title: entry.title.trim(),
    estimatedTime: entry.estimatedTime.trim(),
    description: entry.description.trim(),
    tags: normalizeTagList([...entry.tags, "local-draft"]),
    steps: entry.steps.map((step) => ({
      title: step.title.trim(),
      type: step.type,
      content: step.content.trim()
    }))
  };
}

function readStore(): LocalCorporateFixStore {
  if (typeof window === "undefined") {
    return { version: 1, entries: [] };
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_CORPORATE_FIXES_STORAGE_KEY);
    if (!raw) {
      return { version: 1, entries: [] };
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return { version: 1, entries: [] };
    }

    const store = parsed as Partial<LocalCorporateFixStore>;
    if (store.version !== 1 || !Array.isArray(store.entries)) {
      return { version: 1, entries: [] };
    }

    const validEntries = store.entries
      .filter(isValidCorporateFix)
      .map(normalizeLocalCorporateFix);

    return { version: 1, entries: validEntries };
  } catch {
    return { version: 1, entries: [] };
  }
}

function writeStore(store: LocalCorporateFixStore): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_CORPORATE_FIXES_STORAGE_KEY, JSON.stringify(store));
}

function dispatchUpdatedEvent(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(LOCAL_CORPORATE_FIXES_UPDATED_EVENT));
}

export function isLocalCorporateFixSlug(slug: string): boolean {
  return slug.startsWith(LOCAL_CORPORATE_FIX_SLUG_PREFIX);
}

export function buildLocalCorporateFixEntry(entry: CorporateTechFix): CorporateTechFix {
  return normalizeLocalCorporateFix(entry);
}

export function getLocalCorporateFixes(): CorporateTechFix[] {
  return readStore().entries;
}

export function upsertLocalCorporateFix(entry: CorporateTechFix): {
  storedEntry: CorporateTechFix;
  replaced: boolean;
} {
  if (typeof window === "undefined") {
    return {
      storedEntry: normalizeLocalCorporateFix(entry),
      replaced: false
    };
  }

  const normalized = normalizeLocalCorporateFix(entry);
  const store = readStore();
  const existingIndex = store.entries.findIndex((item) => item.slug === normalized.slug);
  const replaced = existingIndex >= 0;

  if (replaced) {
    store.entries[existingIndex] = normalized;
  } else {
    store.entries.unshift(normalized);
  }

  writeStore(store);
  dispatchUpdatedEvent();

  return { storedEntry: normalized, replaced };
}

export function removeLocalCorporateFix(slug: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const store = readStore();
  const nextEntries = store.entries.filter((entry) => entry.slug !== slug);
  const changed = nextEntries.length !== store.entries.length;

  if (!changed) {
    return false;
  }

  writeStore({
    version: 1,
    entries: nextEntries
  });
  dispatchUpdatedEvent();

  return true;
}
