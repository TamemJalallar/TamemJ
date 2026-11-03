import Fuse from "fuse.js";
import type { IFuseOptions } from "fuse.js";

export interface FuzzySearchResult<T> {
  item: T;
  score: number;
}

export function buildFuzzyIndex<T>(
  items: readonly T[],
  options: IFuseOptions<T>
): Fuse<T> {
  return new Fuse([...items], {
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.38,
    ...options
  });
}

export function runFuzzySearch<T>(
  fuse: Fuse<T>,
  query: string,
  limit = 120
): FuzzySearchResult<T>[] {
  const normalized = query.trim();
  if (!normalized) {
    return [];
  }

  return fuse.search(normalized, { limit }).map((entry) => ({
    item: entry.item,
    score: entry.score ?? 1
  }));
}

export function scoreToRelevance(score: number): number {
  // Fuse score: 0 is best. Convert to 0-100 for UI use.
  return Math.max(0, Math.min(100, Math.round((1 - score) * 100)));
}
