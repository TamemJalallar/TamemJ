import type { Metadata } from "next";
import { FattFootballLinkFallback } from "@/components/apps/fatt-football-link-fallback";

export const metadata: Metadata = {
  title: "Fantasy Football Mock Draft Link",
  description: "Universal link fallback for FATT Football mock draft screens.",
  alternates: { canonical: "/mock-draft/demo/" }
};

export default function MockDraftDemoPage() {
  return (
    <FattFootballLinkFallback
      eyebrow="Mock Draft Link"
      title="Fantasy Football Mock Draft"
      description="This universal link is intended to open a mock draft preparation screen when the iPhone app is installed."
      pathLabel="/mock-draft/demo/"
    />
  );
}
