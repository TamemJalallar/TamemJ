import type { MetadataRoute } from "next";
import { adsenseReviewModeEnabled, buildAdsenseReviewRobotsRule } from "@/lib/adsense-review-mode";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (adsenseReviewModeEnabled) {
    return {
      rules: [buildAdsenseReviewRobotsRule()],
      sitemap: `${siteConfig.url}/sitemap.xml`,
      host: siteConfig.domain
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/support/admin/",
          "/support/analytics/",
          "/support/my-tickets/",
          "/support/incident/new/",
          "/corporate-tech-fixes/builder/"
        ]
      }
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.domain
  };
}
