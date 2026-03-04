import type { MetadataRoute } from "next";
import { getApps } from "@/lib/apps";
import { getCorporateFixes } from "@/lib/corporate-fixes.registry";
import { getDownloadAssets } from "@/lib/download-assets.registry";
import { getPCBuildGuides } from "@/lib/pc-build-guides.registry";
import { getPillarContentIdeas } from "@/lib/seo-content.registry";
import { siteConfig } from "@/lib/site";
import { getCatalogItems } from "@/lib/support.catalog.registry";
import { getKBArticles } from "@/lib/support.kb.registry";

export const dynamic = "force-static";

function url(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "weekly", priority: 1, lastModified },
    { url: url("/apps/"), changeFrequency: "weekly", priority: 0.9, lastModified },
    { url: url("/downloads/"), changeFrequency: "daily", priority: 0.9, lastModified },
    { url: url("/downloads/assets/"), changeFrequency: "weekly", priority: 0.88, lastModified },
    { url: url("/ai-agents/"), changeFrequency: "weekly", priority: 0.85, lastModified },
    { url: url("/guides/"), changeFrequency: "weekly", priority: 0.9, lastModified },
    { url: url("/guides/revenue-scaling-roadmap/"), changeFrequency: "monthly", priority: 0.86, lastModified },
    { url: url("/corporate-tech-fixes/"), changeFrequency: "daily", priority: 0.9, lastModified },
    { url: url("/pc-build-guides/"), changeFrequency: "weekly", priority: 0.9, lastModified },
    { url: url("/support/"), changeFrequency: "weekly", priority: 0.85, lastModified },
    { url: url("/support/kb/"), changeFrequency: "daily", priority: 0.95, lastModified },
    { url: url("/support/catalog/"), changeFrequency: "weekly", priority: 0.8, lastModified },
    { url: url("/donate/"), changeFrequency: "monthly", priority: 0.5, lastModified },
    { url: url("/contact/"), changeFrequency: "monthly", priority: 0.6, lastModified },
    { url: url("/privacy/"), changeFrequency: "monthly", priority: 0.5, lastModified }
  ];

  const appEntries: MetadataRoute.Sitemap = getApps().map((app) => ({
    url: url(`/apps/${app.slug}/`),
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified
  }));

  const corporateFixEntries: MetadataRoute.Sitemap = getCorporateFixes().map((fix) => ({
    url: url(`/corporate-tech-fixes/${fix.slug}/`),
    changeFrequency: "weekly",
    priority: 0.85,
    lastModified
  }));

  const pcBuildGuideEntries: MetadataRoute.Sitemap = getPCBuildGuides().map((guide) => ({
    url: url(`/pc-build-guides/${guide.slug}/`),
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified
  }));

  const kbEntries: MetadataRoute.Sitemap = getKBArticles().map((article) => ({
    url: url(`/support/kb/${article.slug}/`),
    changeFrequency: "weekly",
    priority: 0.85,
    lastModified
  }));

  const catalogEntries: MetadataRoute.Sitemap = getCatalogItems().map((item) => ({
    url: url(`/support/catalog/${item.slug}/`),
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified
  }));

  const downloadAssetEntries: MetadataRoute.Sitemap = getDownloadAssets().map((asset) => ({
    url: url(`/downloads/assets/${asset.slug}/`),
    changeFrequency: "weekly",
    priority: 0.84,
    lastModified
  }));

  const guideEntries: MetadataRoute.Sitemap = getPillarContentIdeas().map((guide) => ({
    url: url(`/guides/${guide.slug}/`),
    changeFrequency: "weekly",
    priority: 0.87,
    lastModified
  }));

  return [
    ...staticEntries,
    ...appEntries,
    ...downloadAssetEntries,
    ...guideEntries,
    ...corporateFixEntries,
    ...pcBuildGuideEntries,
    ...kbEntries,
    ...catalogEntries
  ];
}
