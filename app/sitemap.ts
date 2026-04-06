import type { MetadataRoute } from "next";
import {
  adsenseReviewCoreSitemapPaths,
  adsenseReviewModeEnabled
} from "@/lib/adsense-review-mode";
import { getApps } from "@/lib/apps";
import { appsSectionEnabled } from "@/lib/apps-visibility";
import { getAiAgentCategories, getAiAgentCategorySlug, getAiAgentsRegistry } from "@/lib/aiAgents.registry";
import { getCorporateFixes } from "@/lib/corporate-fixes.registry";
import { getDownloadAssets } from "@/lib/download-assets.registry";
import { getDownloads } from "@/lib/downloads.registry";
import { getGenAICategories, getGenAICategorySlug, getGenAIPrompts } from "@/lib/genai-prompts";
import { getPCBuildGuides } from "@/lib/pc-build-guides.registry";
import { getPillarContentIdeas } from "@/lib/seo-content.registry";
import { siteConfig } from "@/lib/site";
import { getCatalogItems } from "@/lib/support.catalog.registry";
import { getKBArticles } from "@/lib/support.kb.registry";

export const dynamic = "force-static";

function url(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

function parseDateInput(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const generatedAt = new Date();

  if (adsenseReviewModeEnabled) {
    const reviewCorePaths = appsSectionEnabled
      ? [...adsenseReviewCoreSitemapPaths]
      : adsenseReviewCoreSitemapPaths.filter((path) => path !== "/apps/");

    const coreEntries: MetadataRoute.Sitemap = reviewCorePaths.map((path) => ({
      url: url(path),
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : path === "/apps/" ? 0.9 : 0.7,
      lastModified: generatedAt
    }));

    const appEntries: MetadataRoute.Sitemap = appsSectionEnabled
      ? getApps().map((app) => ({
          url: url(`/apps/${app.slug}/`),
          changeFrequency: "weekly",
          priority: 0.85,
          lastModified: generatedAt
        }))
      : [];

    return [...coreEntries, ...appEntries];
  }

  const appsIndexEntry: MetadataRoute.Sitemap = [
    { url: url("/apps/"), changeFrequency: "weekly", priority: 0.9, lastModified: generatedAt }
  ];

  const staticEntries: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "weekly", priority: 1, lastModified: generatedAt },
    ...(appsSectionEnabled ? appsIndexEntry : []),
    { url: url("/services/msp/"), changeFrequency: "monthly", priority: 0.82, lastModified: generatedAt },
    { url: url("/downloads/"), changeFrequency: "daily", priority: 0.9, lastModified: generatedAt },
    { url: url("/downloads/assets/"), changeFrequency: "weekly", priority: 0.88, lastModified: generatedAt },
    { url: url("/ai-agents/"), changeFrequency: "weekly", priority: 0.85, lastModified: generatedAt },
    { url: url("/genai-prompts/"), changeFrequency: "weekly", priority: 0.86, lastModified: generatedAt },
    { url: url("/guides/"), changeFrequency: "weekly", priority: 0.9, lastModified: generatedAt },
    { url: url("/corporate-tech-fixes/"), changeFrequency: "daily", priority: 0.9, lastModified: generatedAt },
    { url: url("/pc-build-guides/"), changeFrequency: "weekly", priority: 0.9, lastModified: generatedAt },
    { url: url("/support/"), changeFrequency: "weekly", priority: 0.85, lastModified: generatedAt },
    { url: url("/support/tickets/"), changeFrequency: "daily", priority: 0.95, lastModified: generatedAt },
    { url: url("/support/catalog/"), changeFrequency: "weekly", priority: 0.8, lastModified: generatedAt },
    { url: url("/donate/"), changeFrequency: "monthly", priority: 0.5, lastModified: generatedAt },
    { url: url("/contact/"), changeFrequency: "monthly", priority: 0.6, lastModified: generatedAt },
    { url: url("/privacy/"), changeFrequency: "monthly", priority: 0.5, lastModified: generatedAt }
  ];

  const appEntries: MetadataRoute.Sitemap = appsSectionEnabled
    ? getApps().map((app) => ({
        url: url(`/apps/${app.slug}/`),
        changeFrequency: "monthly",
        priority: 0.7,
        lastModified: generatedAt
      }))
    : [];

  const aiAgentEntries: MetadataRoute.Sitemap = getAiAgentsRegistry().map((agent) => ({
    url: url(`/ai-agents/${agent.slug}/`),
    changeFrequency: "monthly",
    priority: 0.82,
    lastModified: generatedAt
  }));

  const aiAgentCategoryEntries: MetadataRoute.Sitemap = getAiAgentCategories().map((category) => ({
    url: url(`/ai-agents/category/${getAiAgentCategorySlug(category)}/`),
    changeFrequency: "weekly",
    priority: 0.86,
    lastModified: generatedAt
  }));

  const genAIPromptEntries: MetadataRoute.Sitemap = getGenAIPrompts().map((prompt) => ({
    url: url(`/genai-prompts/${prompt.slug}/`),
    changeFrequency: "monthly",
    priority: 0.82,
    lastModified: parseDateInput(prompt.updatedAt) ?? generatedAt
  }));

  const genAIPromptCategoryEntries: MetadataRoute.Sitemap = getGenAICategories().map((category) => ({
    url: url(`/genai-prompts/category/${getGenAICategorySlug(category)}/`),
    changeFrequency: "weekly",
    priority: 0.85,
    lastModified: generatedAt
  }));

  const corporateFixEntries: MetadataRoute.Sitemap = getCorporateFixes().map((fix) => ({
    url: url(`/corporate-tech-fixes/${fix.slug}/`),
    changeFrequency: "weekly",
    priority: 0.85,
    lastModified: parseDateInput(fix.lastVerified) ?? generatedAt
  }));

  const pcBuildGuideEntries: MetadataRoute.Sitemap = getPCBuildGuides().map((guide) => ({
    url: url(`/pc-build-guides/${guide.slug}/`),
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: generatedAt
  }));

  const kbEntries: MetadataRoute.Sitemap = getKBArticles().map((article) => ({
    url: url(`/support/tickets/${article.slug}/`),
    changeFrequency: "weekly",
    priority: 0.85,
    lastModified: parseDateInput(article.lastVerified) ?? generatedAt
  }));

  const catalogEntries: MetadataRoute.Sitemap = getCatalogItems().map((item) => ({
    url: url(`/support/catalog/${item.slug}/`),
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: generatedAt
  }));

  const downloadAssetEntries: MetadataRoute.Sitemap = getDownloadAssets().map((asset) => ({
    url: url(`/downloads/assets/${asset.slug}/`),
    changeFrequency: "weekly",
    priority: 0.84,
    lastModified: generatedAt
  }));

  const downloadEntries: MetadataRoute.Sitemap = getDownloads().map((entry) => ({
    url: url(`/downloads/${entry.slug}/`),
    changeFrequency: "weekly",
    priority: 0.82,
    lastModified: parseDateInput(entry.releaseMetadata?.publishedAt) ?? generatedAt
  }));

  const guideEntries: MetadataRoute.Sitemap = getPillarContentIdeas().map((guide) => ({
    url: url(`/guides/${guide.slug}/`),
    changeFrequency: "weekly",
    priority: 0.87,
    lastModified: generatedAt
  }));

  return [
    ...staticEntries,
    ...appEntries,
    ...aiAgentEntries,
    ...aiAgentCategoryEntries,
    ...genAIPromptEntries,
    ...genAIPromptCategoryEntries,
    ...downloadEntries,
    ...downloadAssetEntries,
    ...guideEntries,
    ...corporateFixEntries,
    ...pcBuildGuideEntries,
    ...kbEntries,
    ...catalogEntries
  ];
}
