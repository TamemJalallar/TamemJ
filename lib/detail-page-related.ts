import { getCorporateFixes } from "@/lib/corporate-fixes.registry";
import {
  getDownloadAssetDownloadUrl,
  getDownloadAssets,
  getDownloadAssetsForBundle,
  getDownloadAssetBundles,
  getDownloadAssetUpdatedAt
} from "@/lib/download-assets.registry";
import { getDownloads } from "@/lib/downloads.registry";
import { getPillarContentIdeas } from "@/lib/seo-content.registry";
import { getKBArticles } from "@/lib/support.kb.registry";
import type { CorporateTechFix } from "@/lib/corporate-fixes.registry";
import type { PillarContentIdea } from "@/lib/seo-content.registry";
import type { DownloadAsset, DownloadAssetBundle, DownloadEntry } from "@/types/download";
import type { KBArticle } from "@/types/support";

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(values: string[]): string[] {
  return [...new Set(values.flatMap((value) => normalize(value).split(" ")).filter((token) => token.length >= 3))];
}

function scoreMatch(tokens: string[], haystackTerms: string[]): number {
  const haystack = new Set(tokenize(haystackTerms));
  let score = 0;

  for (const token of tokens) {
    if (haystack.has(token)) {
      score += 1;
    }
  }

  return score;
}

function topMatches<T>(items: T[], score: (item: T) => number, limit: number): T[] {
  return items
    .map((item) => ({ item, score: score(item) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function getRelatedAssetsForDownload(entry: DownloadEntry, limit = 3): DownloadAsset[] {
  const tokens = tokenize([entry.name, entry.summary, entry.category, ...entry.tags, ...entry.platforms]);

  return topMatches(getDownloadAssets(), (asset) =>
    scoreMatch(tokens, [asset.title, asset.description, asset.category, asset.format, ...asset.tags]), limit
  );
}

export function getRelatedPillarsForTerms(terms: string[], limit = 2): PillarContentIdea[] {
  const tokens = tokenize(terms);

  return topMatches(getPillarContentIdeas(), (pillar) =>
    scoreMatch(tokens, [pillar.title, pillar.description, ...pillar.targetKeywords, ...pillar.relatedTerms]), limit
  );
}

export function getRelatedDownloadsForKBArticle(article: KBArticle, limit = 3): DownloadEntry[] {
  const tokens = tokenize([
    article.title,
    article.description,
    article.product,
    article.productFamily,
    article.category,
    ...article.tags,
    ...article.symptoms,
    ...article.causes
  ]);

  return topMatches(getDownloads(), (entry) =>
    scoreMatch(tokens, [entry.name, entry.summary, entry.category, entry.developer ?? "", ...entry.tags, ...entry.platforms]), limit
  );
}

export function getRelatedAssetsForKBArticle(article: KBArticle, limit = 3): DownloadAsset[] {
  const tokens = tokenize([
    article.title,
    article.description,
    article.product,
    article.productFamily,
    article.category,
    ...article.tags,
    ...article.symptoms,
    ...article.causes
  ]);

  return topMatches(getDownloadAssets(), (asset) =>
    scoreMatch(tokens, [asset.title, asset.description, asset.category, asset.format, ...asset.tags]), limit
  );
}

export function getRelatedCorporateFixesForKBArticle(article: KBArticle, limit = 3): CorporateTechFix[] {
  const tokens = tokenize([
    article.title,
    article.description,
    article.product,
    article.productFamily,
    article.category,
    ...article.tags,
    ...article.symptoms,
    ...article.causes
  ]);

  return topMatches(getCorporateFixes(), (fix) =>
    scoreMatch(tokens, [fix.title, fix.description, fix.category, ...fix.tags, ...fix.steps.map((step) => step.title)]), limit
  );
}

export function getRelatedSupportArticlesForFix(fix: CorporateTechFix, limit = 3): KBArticle[] {
  const tokens = tokenize([
    fix.title,
    fix.description,
    fix.category,
    ...fix.tags,
    ...fix.steps.map((step) => step.title),
    ...fix.steps.map((step) => step.content)
  ]);

  return topMatches(getKBArticles(), (article) =>
    scoreMatch(tokens, [article.title, article.description, article.category, article.product, article.productFamily, ...article.tags]), limit
  );
}

export function getRelatedCorporateFixes(fix: CorporateTechFix, limit = 3): CorporateTechFix[] {
  const tokens = tokenize([
    fix.title,
    fix.description,
    fix.category,
    ...fix.tags,
    ...fix.steps.map((step) => step.title),
    ...fix.steps.map((step) => step.content)
  ]);

  return topMatches(
    getCorporateFixes().filter((candidate) => candidate.slug !== fix.slug),
    (candidate) => scoreMatch(tokens, [candidate.title, candidate.description, candidate.category, ...candidate.tags]),
    limit
  );
}

export function getRelatedDownloadsForFix(fix: CorporateTechFix, limit = 3): DownloadEntry[] {
  const tokens = tokenize([
    fix.title,
    fix.description,
    fix.category,
    ...fix.tags,
    ...fix.steps.map((step) => step.title)
  ]);

  return topMatches(getDownloads(), (entry) =>
    scoreMatch(tokens, [entry.name, entry.summary, entry.category, entry.developer ?? "", ...entry.tags, ...entry.platforms]), limit
  );
}

export function getRelatedAssetsForFix(fix: CorporateTechFix, limit = 3): DownloadAsset[] {
  const tokens = tokenize([
    fix.title,
    fix.description,
    fix.category,
    ...fix.tags,
    ...fix.steps.map((step) => step.title)
  ]);

  return topMatches(getDownloadAssets(), (asset) =>
    scoreMatch(tokens, [asset.title, asset.description, asset.category, asset.format, ...asset.tags]), limit
  );
}

export function getBundleLinks(limit = 4): Array<{
  bundle: DownloadAssetBundle;
  assets: DownloadAsset[];
  downloadUrl: string;
  updatedAt: string;
}> {
  return getDownloadAssetBundles().slice(0, limit).map((bundle) => {
    const assets = getDownloadAssetsForBundle(bundle.slug);
    const updatedAt = assets
      .map((asset) => Date.parse(getDownloadAssetUpdatedAt(asset)))
      .filter((value) => !Number.isNaN(value))
      .sort((a, b) => b - a)[0];

    return {
      bundle,
      assets,
      downloadUrl: `${"https://downloads.tamemj.com"}/bundles/${bundle.slug}.zip`,
      updatedAt: updatedAt ? new Date(updatedAt).toISOString() : new Date("2026-03-12").toISOString()
    };
  });
}

export function buildAssetDownloadMeta(asset: DownloadAsset) {
  return {
    fileName: `${asset.slug}.${asset.format}`,
    downloadUrl: getDownloadAssetDownloadUrl(asset),
    updatedAt: getDownloadAssetUpdatedAt(asset)
  };
}
