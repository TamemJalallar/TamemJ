import type { Metadata } from "next";
import { FattFootballLinkFallback } from "@/components/apps/fatt-football-link-fallback";

export const metadata: Metadata = {
  title: "Open FATT Football",
  description: "Universal link fallback for opening FATT Football app sections.",
  alternates: { canonical: "/open/fantasy-football-hub/" }
};

export default function OpenFantasyFootballHubPage() {
  return (
    <FattFootballLinkFallback
      eyebrow="Open App Link"
      title="Open FATT Football"
      description="This universal link is intended to open a general FATT Football app section when the iPhone app is installed."
      pathLabel="/open/fantasy-football-hub/"
    />
  );
}
