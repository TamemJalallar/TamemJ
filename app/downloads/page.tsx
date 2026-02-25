import type { Metadata } from "next";
import { DownloadsBrowser } from "@/components/downloads/downloads-browser";
import { getDownloads } from "@/lib/downloads.registry";

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Browse Mac App Store links, Microsoft Store links, and direct download options (including GitHub Releases) for desktop apps and curated tools.",
  keywords: [
    "downloads",
    "Mac App Store",
    "Microsoft Store",
    "GitHub Releases",
    "direct download",
    "desktop apps"
  ],
  alternates: {
    canonical: "/downloads/"
  },
  openGraph: {
    title: "Downloads | Tamem J",
    description:
      "Centralized downloads page with store links and direct download options hosted outside GitHub Pages.",
    url: "/downloads/",
    type: "website"
  }
};

export default function DownloadsPage() {
  return (
    <section className="section-shell pt-10 sm:pt-14">
      <div className="page-shell">
        <DownloadsBrowser entries={getDownloads()} />
      </div>
    </section>
  );
}

