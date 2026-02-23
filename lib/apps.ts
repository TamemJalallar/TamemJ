import appsData from "@/data/apps.json";
import type { IOSApp } from "@/types/app";

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
