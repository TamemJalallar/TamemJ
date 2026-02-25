import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/support-portal/analytics-dashboard";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Local analytics dashboard for KB usage, searches, helpful votes, and support ticket trends.",
  alternates: { canonical: "/support/analytics/" }
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
