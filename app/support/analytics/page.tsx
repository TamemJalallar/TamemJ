import type { Metadata } from "next";
import dynamic from "next/dynamic";

const AnalyticsDashboard = dynamic(
  () =>
    import("@/components/support-portal/analytics-dashboard").then((m) => ({
      default: m.AnalyticsDashboard
    })),
  { ssr: false, loading: () => <div className="p-8 text-sm text-slate-500 dark:text-slate-400">Loading analytics…</div> }
);

export const metadata: Metadata = {
  title: "Analytics",
  description: "Local analytics dashboard for KB usage, searches, helpful votes, and support ticket trends.",
  alternates: { canonical: "/support/analytics/" },
  robots: { index: false, follow: false }
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
