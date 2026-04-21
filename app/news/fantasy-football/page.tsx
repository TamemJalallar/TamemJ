import type { Metadata } from "next";
import { FattFootballLinkFallback } from "@/components/apps/fatt-football-link-fallback";

export const metadata: Metadata = {
  title: "Fantasy Football News Link",
  description: "Universal link fallback for FATT Football news detail views.",
  alternates: { canonical: "/news/fantasy-football/" }
};

export default function FantasyFootballNewsPage() {
  return (
    <FattFootballLinkFallback
      eyebrow="News Link"
      title="Fantasy Football News"
      description="This universal link is intended to open a fantasy football news detail screen when the iPhone app is installed."
      pathLabel="/news/fantasy-football/"
    />
  );
}
