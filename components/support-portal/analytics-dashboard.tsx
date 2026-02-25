"use client";

import { useEffect, useMemo, useState } from "react";
import { SupportPageHeader } from "@/components/support-portal/page-header";
import {
  getSupportAnalyticsStore,
  summarizeSupportAnalytics
} from "@/lib/support-portal.analytics";
import { getStoredTickets } from "@/lib/support-portal.storage";
import type { SupportAnalyticsSummary } from "@/lib/support-portal.analytics";

function MetricCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </div>
  );
}

function BarList({
  title,
  items,
  emptyMessage
}: {
  title: string;
  items: Array<{ label: string; count: number }>;
  emptyMessage: string;
}) {
  const max = Math.max(0, ...items.map((item) => item.count));

  return (
    <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={`${title}-${item.label}`}>
              <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                <span className="truncate text-slate-700 dark:text-slate-200">{item.label}</span>
                <span className="shrink-0 font-semibold text-slate-500 dark:text-slate-400">{item.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-slate-900 dark:bg-slate-100"
                  style={{ width: `${max > 0 ? Math.max(8, (item.count / max) * 100) : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{emptyMessage}</p>
      )}
    </section>
  );
}

export function AnalyticsDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [summary, setSummary] = useState<SupportAnalyticsSummary | null>(null);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    const store = getSupportAnalyticsStore();
    const tickets = getStoredTickets();
    setEventCount(store.events.length);
    setSummary(summarizeSupportAnalytics(store.events, tickets));
  }, [refreshKey]);

  const helpfulRatio = useMemo(() => {
    if (!summary) return "0 / 0";
    return `${summary.totals.helpfulYes} / ${summary.totals.helpfulNo}`;
  }, [summary]);

  return (
    <div className="space-y-5">
      <SupportPageHeader
        title="Analytics"
        description="Local analytics dashboard for KB views, searches, helpful votes, catalog requests, and incident patterns. No external analytics service is required."
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
            <BarList
              title="Most Viewed KB Articles"
              items={summary.mostViewedKBArticles}
              emptyMessage="No KB article views tracked yet. Open articles from the Knowledge Base to populate this chart."
            />
            <BarList
              title="Most Searched Issues"
              items={summary.mostSearchedIssues}
              emptyMessage="No search queries tracked yet. Use the search bars in the portal to populate results."
            />
            <BarList
              title="Top Products Causing Issues / Requests"
              items={summary.topProducts}
              emptyMessage="No product-level activity tracked yet. Submit incidents or requests to populate this list."
            />
            <BarList
              title="Incidents by Priority"
              items={summary.incidentsByPriority}
              emptyMessage="No incident tickets have been recorded yet."
            />
            <BarList
              title="Most Selected Categories"
              items={summary.topTicketCategories}
              emptyMessage="No category activity recorded yet."
            />
            <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Helpful vs Not Helpful Ratio</h2>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-200">Helpful (Yes)</span>
                    <span className="font-semibold text-slate-500 dark:text-slate-400">{summary.totals.helpfulYes}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-600"
                      style={{
                        width: `${
                          summary.totals.helpfulYes + summary.totals.helpfulNo > 0
                            ? (summary.totals.helpfulYes / (summary.totals.helpfulYes + summary.totals.helpfulNo)) * 100
                            : 0
                        }%`
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-200">Not Helpful (No)</span>
                    <span className="font-semibold text-slate-500 dark:text-slate-400">{summary.totals.helpfulNo}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-rose-600"
                      style={{
                        width: `${
                          summary.totals.helpfulYes + summary.totals.helpfulNo > 0
                            ? (summary.totals.helpfulNo / (summary.totals.helpfulYes + summary.totals.helpfulNo)) * 100
                            : 0
                        }%`
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Votes are stored locally and can be cleared from the Admin page.
                </p>
              </div>
            </section>
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
