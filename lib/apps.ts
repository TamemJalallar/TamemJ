import appsData from "@/data/apps.json";
import type { IOSApp, ProductAppLink } from "@/types/app";

const apps = appsData as IOSApp[];

export function getApps(): IOSApp[] {
  return [...apps];
}

export function getFeaturedApps(): IOSApp[] {
  return apps.filter((app) => app.featured);
}

export function getAppBySlug(slug: string): IOSApp | undefined {
  return apps.find((app) => app.slug === slug);
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
