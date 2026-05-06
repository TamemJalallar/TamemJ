function toBool(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function normalizePath(path: string): string {
  if (!path) return "/";
  const withoutQuery = path.split("?")[0]?.split("#")[0] ?? "/";
  if (withoutQuery === "/") return "/";
  return withoutQuery.endsWith("/") ? withoutQuery : `${withoutQuery}/`;
}

const reviewModeEnv = process.env.NEXT_PUBLIC_ADSENSE_REVIEW_MODE;
const reviewModeAcknowledgeEnv = process.env.NEXT_PUBLIC_ADSENSE_REVIEW_MODE_ACKNOWLEDGE;

export const adsenseReviewModeEnabled =
  toBool(reviewModeEnv) && reviewModeAcknowledgeEnv?.trim() === "production-noindex";

const coreExactPaths = new Set(["/", "/apps/", "/privacy/", "/support/", "/contact/"]);

export function isAdsenseReviewCorePath(path: string): boolean {
  const normalized = normalizePath(path);
  if (coreExactPaths.has(normalized)) return true;
  return normalized.startsWith("/apps/") && normalized !== "/apps/";
}

export function buildRobotsIndexRule(path: string): { index: boolean; follow: boolean } {
  if (!adsenseReviewModeEnabled) {
    return { index: true, follow: true };
  }

  return isAdsenseReviewCorePath(path)
    ? { index: true, follow: true }
    : { index: false, follow: false };
}

export const adsenseReviewCoreSitemapPaths = ["/", "/apps/", "/privacy/", "/support/", "/contact/"] as const;

export const adsenseReviewDisallowPaths = [
  "/account/",
  "/ai-agents/",
  "/corporate-tech-fixes/",
  "/donate/",
  "/downloads/",
  "/genai-prompts/",
  "/guides/",
  "/pc-build-guides/",
  "/private/",
  "/services/",
  "/support/admin/",
  "/support/analytics/",
  "/support/catalog/",
  "/support/incident/",
  "/support/kb/",
  "/support/my-tickets/",
  "/support/tickets/"
] as const;

type RobotsRule = {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
};

export function buildAdsenseReviewRobotsRule(): RobotsRule {
  return {
    userAgent: "*",
    allow: ["/", "/apps/", "/apps/*", "/privacy/", "/support/", "/contact/", "/ads.txt"],
    disallow: [...adsenseReviewDisallowPaths]
  };
}
