import appsData from "@/data/apps.json";

function toBool(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

const configuredAppsVisibility = process.env.NEXT_PUBLIC_SHOW_APPS_SECTION;
const hasPublishedApps = Array.isArray(appsData) && appsData.length > 0;

export const appsSectionEnabled =
  configuredAppsVisibility === undefined ? hasPublishedApps : toBool(configuredAppsVisibility);
