import type { MetadataRoute } from "next";
import { getApps } from "@/lib/apps";
import { appsSectionEnabled } from "@/lib/apps-visibility";
import {
  getAiAgentCategories,
  getAiAgentCategorySlug,
  getAiAgentsLastVerified,
  getAiAgentsRegistry
} from "@/lib/aiAgents.registry";
import { getCorporateFixes } from "@/lib/corporate-fixes.registry";
import { getDownloadAssets, getDownloadAssetStats } from "@/lib/download-assets.registry";
import {
  getGenAICategories,
  getGenAICategorySlug,
  getGenAIPrompts,
  getLatestGenAIPromptUpdatedAt
} from "@/lib/genai-prompts";
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

function latestDate(values: Array<Date | undefined>): Date | undefined {
  const normalized = values.filter((value): value is Date => Boolean(value));
  if (normalized.length === 0) {
    return undefined;
  }

  return normalized.reduce((latest, value) => (value > latest ? value : latest));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const generatedAt = new Date();
  const kbLastUpdated =
    latestDate(getKBArticles().map((article) => parseDateInput(article.lastVerified))) ?? generatedAt;
  const corporateFixesLastUpdated =
    latestDate(getCorporateFixes().map((fix) => parseDateInput(fix.lastVerified))) ?? generatedAt;
  const aiAgentsLastUpdated = parseDateInput(getAiAgentsLastVerified()) ?? generatedAt;
  const genAIPromptsLastUpdated = parseDateInput(getLatestGenAIPromptUpdatedAt()) ?? generatedAt;
  const downloadAssetsLastUpdated =
    parseDateInput(getDownloadAssetStats().latestUpdatedAt) ?? generatedAt;
  const homeLastUpdated =
    latestDate([
      kbLastUpdated,
      corporateFixesLastUpdated,
      aiAgentsLastUpdated,
      genAIPromptsLastUpdated,
      downloadAssetsLastUpdated
    ]) ?? generatedAt;
  const aiHubLastUpdated =
    latestDate([aiAgentsLastUpdated, genAIPromptsLastUpdated]) ?? generatedAt;
  const appsIndexEntry: MetadataRoute.Sitemap = [
    { url: url("/apps/"), changeFrequency: "weekly", priority: 0.9, lastModified: generatedAt }
  ];

  const staticEntries: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "weekly", priority: 1, lastModified: homeLastUpdated },
    ...(appsSectionEnabled ? appsIndexEntry : []),
    { url: url("/downloads/"), changeFrequency: "daily", priority: 0.9, lastModified: downloadAssetsLastUpdated },
    { url: url("/downloads/assets/"), changeFrequency: "weekly", priority: 0.88, lastModified: downloadAssetsLastUpdated },
    { url: url("/ai/"), changeFrequency: "weekly", priority: 0.86, lastModified: aiHubLastUpdated },
    { url: url("/ai-agents/"), changeFrequency: "weekly", priority: 0.85, lastModified: aiAgentsLastUpdated },
    { url: url("/genai-prompts/"), changeFrequency: "weekly", priority: 0.86, lastModified: genAIPromptsLastUpdated },
    { url: url("/guides/"), changeFrequency: "weekly", priority: 0.9, lastModified: homeLastUpdated },
    {
      url: url("/guides/revenue-scaling-roadmap/"),
      changeFrequency: "monthly",
      priority: 0.86,
      lastModified: homeLastUpdated
    },
    { url: url("/corporate-tech-fixes/"), changeFrequency: "daily", priority: 0.9, lastModified: corporateFixesLastUpdated },
    { url: url("/pc-build-guides/"), changeFrequency: "weekly", priority: 0.9, lastModified: generatedAt },
    { url: url("/support/"), changeFrequency: "weekly", priority: 0.85, lastModified: kbLastUpdated },
    { url: url("/support/tickets/"), changeFrequency: "daily", priority: 0.95, lastModified: kbLastUpdated },
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
    lastModified: aiAgentsLastUpdated
  }));

  const aiAgentCategoryEntries: MetadataRoute.Sitemap = getAiAgentCategories().map((category) => ({
    url: url(`/ai-agents/category/${getAiAgentCategorySlug(category)}/`),
    changeFrequency: "weekly",
    priority: 0.86,
    lastModified: aiAgentsLastUpdated
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
    lastModified: genAIPromptsLastUpdated
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
    lastModified: parseDateInput(asset.updatedAt) ?? generatedAt
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
    ...downloadAssetEntries,
    ...guideEntries,
    ...corporateFixEntries,
    ...pcBuildGuideEntries,
    ...kbEntries,
    ...catalogEntries
  ];
}
