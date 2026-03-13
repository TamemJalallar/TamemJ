import { getApps } from "@/lib/apps";
import { getCorporateFixes } from "@/lib/corporate-fixes.registry";
import { getDownloadAssets } from "@/lib/download-assets.registry";
import { getPillarContentIdeas } from "@/lib/seo-content.registry";
import { getKBArticles } from "@/lib/support.kb.registry";

export interface RelatedContentItem {
  title: string;
  href: string;
  description: string;
  eyebrow?: string;
}

export interface RelatedContentGroup {
  title: string;
  description?: string;
  href?: string;
  items: RelatedContentItem[];
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function keywordScore(haystack: string, keyword: string): number {
  const normalizedKeyword = normalize(keyword);
  if (!normalizedKeyword) {
    return 0;
  }

  let score = haystack.includes(normalizedKeyword) ? Math.max(4, normalizedKeyword.split(" ").length * 2) : 0;

  for (const token of normalizedKeyword.split(" ")) {
    if (token.length < 4) {
      continue;
    }

    if (haystack.includes(token)) {
      score += 1;
    }
  }

  return score;
}

function buildContextTerms(parts: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  const terms: string[] = [];

  for (const part of parts) {
    if (!part) {
      continue;
    }

    const normalized = normalize(part);
    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    terms.push(part.trim());
  }

  return terms;
}

function scoreForTerms(haystackParts: string[], terms: string[]): number {
  const haystack = normalize(haystackParts.join(" "));
  return terms.reduce((total, term) => total + keywordScore(haystack, term), 0);
}

export function getRelatedGuidesForContext(parts: Array<string | undefined | null>, limit = 3): RelatedContentItem[] {
  const terms = buildContextTerms(parts);

  return getPillarContentIdeas()
    .map((pillar) => ({
      pillar,
      score: scoreForTerms(
        [pillar.title, pillar.description, pillar.cluster, ...pillar.targetKeywords, ...pillar.relatedTerms],
        terms
      )
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.pillar.title.localeCompare(b.pillar.title))
    .slice(0, limit)
    .map(({ pillar }) => ({
      title: pillar.title,
      href: `/guides/${pillar.slug}/`,
      eyebrow: "Guide",
      description: pillar.description
    }));
}

export function getRelatedDownloadAssetsForContext(
  parts: Array<string | undefined | null>,
  limit = 4,
  excludeSlugs?: string | string[]
): RelatedContentItem[] {
  const terms = buildContextTerms(parts);
  const excluded = new Set(
    (Array.isArray(excludeSlugs) ? excludeSlugs : excludeSlugs ? [excludeSlugs] : []).filter(Boolean)
  );

  return getDownloadAssets()
    .filter((asset) => !excluded.has(asset.slug))
    .map((asset) => ({
      asset,
      score: scoreForTerms([asset.title, asset.description, asset.category, ...asset.tags, ...asset.previewItems], terms)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.asset.title.localeCompare(b.asset.title))
    .slice(0, limit)
    .map(({ asset }) => ({
      title: asset.title,
      href: `/downloads/assets/${asset.slug}/`,
      eyebrow: `${asset.category} • ${asset.format.toUpperCase()}`,
      description: asset.description
    }));
}

export function getRelatedCorporateFixesForContext(
  parts: Array<string | undefined | null>,
  limit = 4,
  excludeSlug?: string
): RelatedContentItem[] {
  const terms = buildContextTerms(parts);

  return getCorporateFixes()
    .filter((fix) => fix.slug !== excludeSlug)
    .map((fix) => ({
      fix,
      score: scoreForTerms([fix.title, fix.description, fix.category, ...fix.tags], terms)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.fix.title.localeCompare(b.fix.title))
    .slice(0, limit)
    .map(({ fix }) => ({
      title: fix.title,
      href: `/corporate-tech-fixes/${fix.slug}/`,
      eyebrow: `${fix.category} • ${fix.estimatedTime}`,
      description: fix.description
    }));
}

export function getRelatedKBArticlesForContext(
  parts: Array<string | undefined | null>,
  limit = 4,
  excludeSlug?: string
): RelatedContentItem[] {
  const terms = buildContextTerms(parts);

  return getKBArticles()
    .filter((article) => article.slug !== excludeSlug)
    .map((article) => ({
      article,
      score: scoreForTerms(
        [
          article.title,
          article.description,
          article.category,
          article.product,
          article.productFamily,
          ...article.tags,
          ...article.symptoms,
          ...article.causes
        ],
        terms
      )
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.article.title.localeCompare(b.article.title))
    .slice(0, limit)
    .map(({ article }) => ({
      title: article.title,
      href: `/support/tickets/${article.slug}/`,
      eyebrow: `${article.productFamily} • ${article.estimatedTime}`,
      description: article.description
    }));
}

export function buildResourceGroupsForItContext(
  parts: Array<string | undefined | null>,
  options?: {
    excludeKBSlug?: string;
    excludeFixSlug?: string;
    excludeAssetSlug?: string;
    excludeAssetSlugs?: string[];
  }
): RelatedContentGroup[] {
  const guideItems = getRelatedGuidesForContext(parts, 3);
  const assetExclusions = options?.excludeAssetSlugs ?? (options?.excludeAssetSlug ? [options.excludeAssetSlug] : []);
  const assetItems = getRelatedDownloadAssetsForContext(parts, 3, assetExclusions);
  const fixItems = getRelatedCorporateFixesForContext(parts, 3, options?.excludeFixSlug);
  const ticketItems = getRelatedKBArticlesForContext(parts, 3, options?.excludeKBSlug);

  return [
    {
      title: "Related Guides",
      description: "Pillar pages covering the broader operational topic around this issue.",
      href: "/guides/",
      items: guideItems
    },
    {
      title: "Related Download Assets",
      description: "Templates, scripts, and checklists that support remediation or follow-up work.",
      href: "/downloads/assets/",
      items: assetItems
    },
    {
      title: "Related Corporate Fixes",
      description: "Enterprise-safe troubleshooting guides for adjacent incidents and recurring support cases.",
      href: "/corporate-tech-fixes/",
      items: fixItems
    },
    {
      title: "Related Support Tickets",
      description: "Additional support runbooks targeting nearby symptoms, errors, or services.",
      href: "/support/tickets/",
      items: ticketItems
    }
  ].filter((group) => group.items.length > 0);
}

export function getAppCrossSectionGroups(excludeAppSlug?: string): RelatedContentGroup[] {
  const firstApp = getApps().find((app) => app.slug !== excludeAppSlug);

  return [
    {
      title: "IT Guides",
      description: "Enterprise-focused guide pages and troubleshooting hubs published across the site.",
      href: "/guides/",
      items: [
        {
          title: "IT Pillar Guides",
          href: "/guides/",
          eyebrow: "Guides",
          description: "Browse Microsoft 365, endpoint, identity, automation, and operations guide hubs."
        }
      ]
    },
    {
      title: "Download Resources",
      description: "Operational assets for support teams, admins, and technical workflows.",
      href: "/downloads/assets/",
      items: [
        {
          title: "IT Download Assets",
          href: "/downloads/assets/",
          eyebrow: "Downloads",
          description: "Free scripts, checklists, templates, and runbooks for enterprise support work."
        },
        {
          title: "Software Downloads",
          href: "/downloads/",
          eyebrow: "Downloads",
          description: "Curated software listings with official store links, direct downloads, and GitHub releases."
        }
      ]
    },
    {
      title: "Support Knowledge",
      description: "Structured support documentation and enterprise-safe troubleshooting content.",
      href: "/corporate-tech-fixes/",
      items: [
        {
          title: "Corporate Tech Fixes",
          href: "/corporate-tech-fixes/",
          eyebrow: "Fixes",
          description: "Step-by-step remediation guides for Microsoft 365, Windows, macOS, networking, and security incidents."
        },
        {
          title: "Support Tickets",
          href: "/support/tickets/",
          eyebrow: "Support",
          description: "Detailed ticket-style runbooks for helpdesk, sysadmin, and endpoint support scenarios."
        }
      ]
    },
    {
      title: "Apps Catalog",
      description: "Current and upcoming apps published on the site.",
      href: "/apps/",
      items: firstApp
        ? [
            {
              title: firstApp.name,
              href: `/apps/${firstApp.slug}/`,
              eyebrow: "App",
              description: firstApp.shortDescription
            }
          ]
        : []
    }
  ].filter((group) => group.items.length > 0);
}
