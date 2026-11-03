import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: "TamemJ",
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#f8fafc",
    lang: "en",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon"
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    categories: ["technology", "developer", "productivity"],
    shortcuts: [
      {
        name: "Support Portal",
        short_name: "Support",
        description: "Open IT support knowledge base, catalog, tickets, and analytics.",
        url: "/support/",
        icons: [{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }]
      },
      {
        name: "Tech Fixes",
        short_name: "Fixes",
        description: "Open enterprise-safe troubleshooting guides.",
        url: "/corporate-tech-fixes/",
        icons: [{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }]
      },
      {
        name: "Downloads",
        short_name: "Downloads",
        description: "Open curated software downloads and tools.",
        url: "/downloads/",
        icons: [{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }]
      }
    ]
  };
}
