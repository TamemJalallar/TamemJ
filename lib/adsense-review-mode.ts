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

const coreExactPaths = new Set([
  "/",
  "/contact/",
  "/downloads/",
  "/downloads/assets/",
  "/editorial-standards/",
  "/guides/",
  "/privacy/",
  "/support/tickets/"
]);

const corePrefixPaths = ["/downloads/", "/downloads/assets/", "/guides/", "/support/tickets/"] as const;

export function isAdsenseReviewCorePath(path: string): boolean {
  const normalized = normalizePath(path);
  if (coreExactPaths.has(normalized)) return true;
  return corePrefixPaths.some((prefix) => normalized.startsWith(prefix));
}

export function buildRobotsIndexRule(path: string): { index: boolean; follow: boolean } {
  if (!adsenseReviewModeEnabled) {
    return { index: true, follow: true };
  }

  return isAdsenseReviewCorePath(path)
    ? { index: true, follow: true }
    : { index: false, follow: false };
}

export const adsenseReviewCoreSitemapPaths = [
  "/",
  "/contact/",
  "/downloads/",
  "/downloads/assets/",
  "/editorial-standards/",
  "/guides/",
  "/privacy/",
  "/support/tickets/"
] as const;

export const adsenseReviewDisallowPaths = [
  "/account/",
  "/ai-agents/",
  "/corporate-tech-fixes/",
  "/donate/",
  "/genai-prompts/",
  "/private/",
  "/recommended-gear/",
  "/support/",
  "/support/admin/",
  "/support/analytics/",
  "/support/catalog/",
  "/support/incident/",
  "/pc-build-guides/",
  "/services/",
  "/support/kb/",
  "/support/my-tickets/",
  "/apps/"
] as const;

export const noIndexRobotsRule = { index: false, follow: false } as const;

type RobotsRule = {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
};

export function buildAdsenseReviewRobotsRule(): RobotsRule {
  return {
    userAgent: "*",
    allow: [
      "/",
      "/contact/",
      "/downloads/",
      "/downloads/*",
      "/downloads/assets/",
      "/downloads/assets/*",
      "/editorial-standards/",
      "/guides/",
      "/guides/*",
      "/privacy/",
      "/support/tickets/",
      "/support/tickets/*",
      "/ads.txt"
    ],
    disallow: [...adsenseReviewDisallowPaths]
  };
}
