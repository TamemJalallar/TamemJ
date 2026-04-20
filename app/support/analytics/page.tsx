import type { Metadata } from "next";
import { AdSenseSlot } from "@/components/monetization/adsense-slot";
import { getAdSenseSlot, monetizationConfig } from "@/lib/monetization";
import { AnalyticsDashboard } from "@/components/support-portal/analytics-dashboard";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Local analytics dashboard for ticket usage, searches, helpful votes, and support ticket trends.",
  alternates: { canonical: "/support/analytics/" },
  robots: { index: false, follow: false }
};

export default function AnalyticsPage() {
  return (
    <>
      <div className="section-shell pb-4 pt-6">
        <div className="page-shell">
          <AdSenseSlot
            client={monetizationConfig.adsenseClient}
            slot={getAdSenseSlot("display")}
            label="Advertisement"
          />
        </div>
      </div>
      <AnalyticsDashboard />
    </>
  );
}
