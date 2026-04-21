import type { Metadata } from "next";
import { FattFootballLinkFallback } from "@/components/apps/fatt-football-link-fallback";

export const metadata: Metadata = {
  title: "Fantasy Football League Link",
  description: "Universal link fallback for FATT Football league views.",
  alternates: { canonical: "/league/demo/" }
};

export default function LeagueDemoPage() {
  return (
    <FattFootballLinkFallback
      eyebrow="League Link"
      title="Fantasy Football League View"
      description="This universal link is intended to open a league-specific FATT Football screen when the iPhone app is installed."
      pathLabel="/league/demo/"
    />
  );
}
