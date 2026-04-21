import type { Metadata } from "next";
import { FattFootballLinkFallback } from "@/components/apps/fatt-football-link-fallback";

export const metadata: Metadata = {
  title: "Open Fantasy Football Hub",
  description: "Universal link fallback for opening Fantasy Football Hub app sections.",
  alternates: { canonical: "/open/fantasy-football-hub/" }
};

export default function OpenFantasyFootballHubPage() {
  return (
    <FattFootballLinkFallback
      eyebrow="Open App Link"
      title="Open Fantasy Football Hub"
      description="This universal link is intended to open a general Fantasy Football Hub app section when the iPhone app is installed."
      pathLabel="/open/fantasy-football-hub/"
    />
  );
}
