"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
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

function MetricCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </div>
  );
}

function ChartCard({
  title,
  children,
  emptyMessage,
  hasData
}: {
  title: string;
  children: ReactNode;
  emptyMessage: string;
  hasData: boolean;
}) {
  return (
    <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      {hasData ? (
        <div className="mt-4 h-[260px]">{children}</div>
      ) : (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{emptyMessage}</p>
      )}
    </section>
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

  return (
    <div className="space-y-5">
      <SupportPageHeader
        title="Analytics"
        description="Local analytics dashboard for KB views, searches, helpful votes, catalog requests, and incident patterns. Events are mirrored into IndexedDB for higher-capacity storage."
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
            <MetricCard label="KB Views" value={summary.totals.kbViews} />
            <MetricCard label="Searches" value={summary.totals.searches} />
            <MetricCard label="Helpful / Not" value={helpfulRatio} hint="KB helpful votes" />
            <MetricCard label="Catalog Requests" value={summary.totals.catalogSubmissions} />
            <MetricCard label="Incidents Submitted" value={summary.totals.incidentSubmissions} />
            <MetricCard label="Tracked Events" value={eventCount} />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <ChartCard
              title="Most Viewed KB Articles"
              emptyMessage="No KB article views tracked yet. Open articles from the Knowledge Base to populate this chart."
              hasData={kbViewsRows.length > 0}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kbViewsRows}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="name" hide />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Views" fill="#0f172a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Most Searched Issues"
              emptyMessage="No search queries tracked yet. Use search across the portal to populate results."
              hasData={searchRows.length > 0}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={searchRows}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="name" hide />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Searches" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Top Products Causing Issues / Requests"
              emptyMessage="No product-level activity tracked yet."
              hasData={productRows.length > 0}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productRows} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={120} />
                  <Tooltip />
                  <Bar dataKey="value" name="Events" fill="#4f46e5" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Incidents by Priority"
              emptyMessage="No incident tickets have been recorded yet."
              hasData={priorityRows.length > 0}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityRows}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" name="Incidents" fill="#dc2626" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Helpful vs Not Helpful Ratio"
              emptyMessage="No helpfulness votes tracked yet."
              hasData={helpfulData.length > 0}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={helpfulData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label
                  >
                    {helpfulData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Most Selected Categories"
              emptyMessage="No category activity recorded yet."
              hasData={(summary.topTicketCategories ?? []).length > 0}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={toChartRows(summary.topTicketCategories)}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="name" hide />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" name="Selections" fill="#0891b2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-line/70 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/70">
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading local analytics...</p>
        </div>
      )}
    </div>
  );
}
