"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { SupportPageHeader } from "@/components/support-portal/page-header";
import {
  getSupportAnalyticsStoreIndexedDbFirst,
  subscribeToAnalyticsEvents,
  summarizeSupportAnalytics
} from "@/lib/support-portal.analytics";
import type { SupportAnalyticsSummary } from "@/lib/support-portal.analytics";
import {
  getStoredTicketsIndexedDbFirst,
  subscribeToStoredTickets
} from "@/lib/support-portal.storage";

const AnalyticsCharts = dynamic(
  () =>
    import("@/components/support-portal/analytics-charts").then((module) => ({
      default: module.AnalyticsCharts
    })),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-line/70 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/70">
        <p className="text-sm text-slate-600 dark:text-slate-300">Loading analytics charts...</p>
      </div>
    )
  }
);

function MetricCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </div>
  );
}

function toChartRows(items: Array<{ label: string; count: number }>) {
  return items.map((item) => ({
    name: item.label,
    value: item.count
  }));
}

export function AnalyticsDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [summary, setSummary] = useState<SupportAnalyticsSummary | null>(null);
  const [eventCount, setEventCount] = useState(0);

  async function refreshAnalytics() {
    const [analyticsStore, tickets] = await Promise.all([
      getSupportAnalyticsStoreIndexedDbFirst(),
      getStoredTicketsIndexedDbFirst()
    ]);
    setEventCount(analyticsStore.events.length);
    setSummary(summarizeSupportAnalytics(analyticsStore.events, tickets));
  }

  useEffect(() => {
    void refreshAnalytics();

    const unsubAnalytics = subscribeToAnalyticsEvents(() => {
      void refreshAnalytics();
    });
    const unsubTickets = subscribeToStoredTickets(() => {
      void refreshAnalytics();
    });

    return () => {
      unsubAnalytics();
      unsubTickets();
    };
  }, [refreshKey]);

  const helpfulData = useMemo(() => {
    if (!summary) {
      return [];
    }

    return [
      { name: "Helpful", value: summary.totals.helpfulYes, color: "#16a34a" },
      { name: "Not Helpful", value: summary.totals.helpfulNo, color: "#e11d48" }
    ].filter((item) => item.value > 0);
  }, [summary]);

  const helpfulRatio = useMemo(() => {
    if (!summary) return "0 / 0";
    return `${summary.totals.helpfulYes} / ${summary.totals.helpfulNo}`;
  }, [summary]);

  const kbViewsRows = useMemo(
    () => toChartRows(summary?.mostViewedKBArticles ?? []),
    [summary]
  );
  const searchRows = useMemo(
    () => toChartRows(summary?.mostSearchedIssues ?? []),
    [summary]
  );
  const productRows = useMemo(
    () => toChartRows(summary?.topProducts ?? []),
    [summary]
  );
  const priorityRows = useMemo(
    () => toChartRows(summary?.incidentsByPriority ?? []),
    [summary]
  );
  const categoryRows = useMemo(
    () => toChartRows(summary?.topTicketCategories ?? []),
    [summary]
  );

  return (
    <div className="space-y-5">
      <SupportPageHeader
        title="Analytics"
        description="Local analytics dashboard for ticket views, searches, helpful votes, catalog requests, and incident patterns. Events are mirrored into IndexedDB for higher-capacity storage."
        breadcrumbs={[{ label: "Support Portal", href: "/support" }, { label: "Analytics" }]}
        actions={
          <button type="button" onClick={() => setRefreshKey((value) => value + 1)} className="btn-secondary">
            Refresh Analytics
          </button>
        }
      />

      {summary ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <MetricCard label="Ticket Views" value={summary.totals.kbViews} />
            <MetricCard label="Searches" value={summary.totals.searches} />
            <MetricCard label="Helpful / Not" value={helpfulRatio} hint="Ticket helpful votes" />
            <MetricCard label="Catalog Requests" value={summary.totals.catalogSubmissions} />
            <MetricCard label="Incidents Submitted" value={summary.totals.incidentSubmissions} />
            <MetricCard label="Tracked Events" value={eventCount} />
          </div>

          <AnalyticsCharts
            kbViewsRows={kbViewsRows}
            searchRows={searchRows}
            productRows={productRows}
            priorityRows={priorityRows}
            helpfulData={helpfulData}
            categoryRows={categoryRows}
          />
        </>
      ) : (
        <div className="rounded-2xl border border-line/70 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/70">
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading local analytics...</p>
        </div>
      )}
    </div>
  );
}
