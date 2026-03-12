import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account/",
          "/support/admin/",
          "/support/analytics/",
          "/support/my-tickets/",
          "/support/incident/new/",
          "/support/kb/",
          "/corporate-tech-fixes/builder/"
        ]
      }
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.domain
  };
}
