import appsData from "@/data/apps.json";
import type { IOSApp, ProductAppLink } from "@/types/app";

const apps = appsData as IOSApp[];

export interface AppCategorySummary {
  name: string;
  slug: string;
  count: number;
  description: string;
}

const categoryDescriptions: Record<string, string> = {
  "Wedding Planner":
    "Wedding planning apps and tools for checklists, budgets, guest lists, vendors, timelines, and event coordination.",
  "Mileage Tracker":
    "Mileage, trip, earnings, expense, invoice, and small-business tracking products for independent operators.",
  "Broadcast Overlay":
    "Streaming and OBS products for overlays, scene graphics, live data displays, and broadcast-style workflows.",
  "Fantasy Sports":
    "Fantasy sports apps and companion tools for league dashboards, matchup tracking, roster planning, and API-powered insights."
};

export function getAppCategorySlug(category: string): string {
  return category
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getApps(): IOSApp[] {
  return [...apps];
}

export function getFeaturedApps(): IOSApp[] {
  return apps.filter((app) => app.featured);
}

export function getAppBySlug(slug: string): IOSApp | undefined {
  return apps.find((app) => app.slug === slug);
}

export function getAppCategories(): AppCategorySummary[] {
  const categoryCounts = new Map<string, number>();

  for (const app of apps) {
    categoryCounts.set(app.category, (categoryCounts.get(app.category) ?? 0) + 1);
  }

  return [...categoryCounts.entries()]
    .map(([name, count]) => ({
      name,
      slug: getAppCategorySlug(name),
      count,
      description:
        categoryDescriptions[name] ??
        `Browse ${name.toLowerCase()} apps and products by Tamem J.`
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getAppCategoryBySlug(slug: string): AppCategorySummary | undefined {
  return getAppCategories().find((category) => category.slug === slug);
}

export function getAppsByCategorySlug(slug: string): IOSApp[] {
  const category = getAppCategoryBySlug(slug);
  if (!category) return [];
  return apps.filter((app) => app.category === category.name);
}

export function isPublishedApp(app: IOSApp): boolean {
  if (app.status) {
    return app.status === "published";
  }

  return app.appStoreUrl.trim().length > 0 || (app.primaryUrl?.trim().length ?? 0) > 0;
}

export function hasAppStoreRelease(app: IOSApp): boolean {
  return app.appStoreUrl.trim().length > 0;
}

export function getAppStatusLabel(app: IOSApp): string {
  if (!isPublishedApp(app)) {
    return "In Development";
  }

  return hasAppStoreRelease(app) ? "Live on App Store" : "Published Product";
}

export function getAppPrimaryLink(app: IOSApp): ProductAppLink | undefined {
  if (app.appStoreUrl.trim().length > 0) {
    return { label: "Download on the App Store", href: app.appStoreUrl };
  }

  if (app.primaryUrl?.trim().length) {
    return {
      label: app.primaryUrlLabel?.trim().length ? app.primaryUrlLabel : "Open Product",
      href: app.primaryUrl
    };
  }

  return undefined;
}

export function getCompatibilityText(app: IOSApp): string {
  return app.compatibility?.trim().length ? app.compatibility : app.minIOSVersion;
}

export function getAppPricingText(app: IOSApp): string {
  return app.pricingNote?.trim().length ? `${app.pricing} • ${app.pricingNote}` : app.pricing;
}

export function getAppMaintainer(app: IOSApp): string {
  return app.maintainedBy?.trim().length ? app.maintainedBy : "Tamem J";
}
