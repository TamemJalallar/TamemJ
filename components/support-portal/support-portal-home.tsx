"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SupportPageHeader } from "@/components/support-portal/page-header";
import { TopSearchBar } from "@/components/support-portal/top-search-bar";
import { SupportIcon } from "@/components/support-portal/icons";
import { getSupportAnalyticsStore, summarizeSupportAnalytics, trackSearch } from "@/lib/support-portal.analytics";
import { getStoredTickets } from "@/lib/support-portal.storage";
import type { SupportAnalyticsSummary } from "@/lib/support-portal.analytics";

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-line/70 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </Link>
  );
}

const quickLinks = [
  {
    href: "/support/kb",
    title: "Knowledge Base",
    description: "Search step-by-step fixes for Microsoft, Adobe, Figma, and endpoint issues.",
    icon: "book" as const
  },
  {
    href: "/support/catalog",
    title: "Service Catalog",
    description: "Request software, access, mailbox, VPN, device, and AV support services.",
    icon: "catalog" as const
  },
  {
    href: "/support/incident/new",
    title: "Submit Incident",
    description: "Create an incident with impact/urgency and automatic priority calculation.",
    icon: "incident" as const
  },
  {
    href: "/support/tickets",
    title: "My Tickets",
    description: "View and manage locally stored demo incidents/requests and activity logs.",
    icon: "tickets" as const
  },
  {
    href: "/support/analytics",
    title: "Analytics",
    description: "See KB views, searches, helpful votes, and issue trends stored locally.",
    icon: "analytics" as const
  }
];

export function SupportPortalHome() {
  const router = useRouter();
  const [summary, setSummary] = useState<SupportAnalyticsSummary | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [ticketCount, setTicketCount] = useState(0);
  const [recentTickets, setRecentTickets] = useState<ReturnType<typeof getStoredTickets>>([]);

  useEffect(() => {
    const analyticsStore = getSupportAnalyticsStore();
    const tickets = getStoredTickets();
    setTicketCount(tickets.length);
    setRecentTickets(tickets.slice(0, 5));
    setSummary(summarizeSupportAnalytics(analyticsStore.events, tickets));
  }, []);

  function submitPortalSearch(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;
    const events = getSupportAnalyticsStore().events;
    const tickets = getStoredTickets();
    const liveSummary = summarizeSupportAnalytics(events, tickets);
    trackSearch({ area: "portal", query: trimmed, resultCount: 0, context: "portal-home" });
    router.push(`/support/kb?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="space-y-5">
      <SupportPageHeader
        title="IT Support Portal"
        description="ServiceNow-style demo portal with KB articles, service catalog, incident intake, local ticketing, and analytics. Built to remain static-hosting compatible (GitHub Pages safe)."
        breadcrumbs={[{ label: "Support Portal" }]}
        search={
          <TopSearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSubmit={submitPortalSearch}
            placeholder="Search the Knowledge Base (e.g., Outlook search, Adobe sign-in, Figma fonts)"
            buttonLabel="Search KB"
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="KB Views" value={summary?.totals.kbViews ?? 0} href="/support/analytics" />
        <StatCard label="Searches" value={summary?.totals.searches ?? 0} href="/support/analytics" />
        <StatCard label="My Tickets" value={ticketCount} href="/support/tickets" />
        <StatCard label="Incidents Submitted" value={summary?.totals.incidentSubmissions ?? 0} href="/support/analytics" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Portal Modules</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">ServiceNow-inspired layout</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-2xl border border-line/70 bg-slate-50/60 p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line/70 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <SupportIcon name={link.icon} className="h-4 w-4 text-slate-700 dark:text-slate-200" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{link.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{link.description}</p>
                    <span className="mt-2 inline-block text-xs font-medium text-slate-500 transition group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">
                      Open →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Most Common Issues (Local Analytics)</h2>
            {summary?.mostViewedKBArticles && summary.mostViewedKBArticles.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {summary.mostViewedKBArticles.slice(0, 5).map((item) => (
                  <li key={item.label} className="rounded-xl border border-line/70 bg-slate-50/70 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900/70">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-700 dark:text-slate-200">{item.label}</span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.count}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Open KB articles and use search to populate local analytics.</p>
            )}
          </section>

          <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recent Demo Ticket Activity</h2>
            {recentTickets.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {recentTickets.map((ticket) => (
                  <li key={ticket.id} className="rounded-xl border border-line/70 bg-slate-50/70 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/70">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{ticket.id}</p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{ticket.summary}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{ticket.status} • {new Date(ticket.updatedAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">No local tickets yet. Submit an incident or catalog request to populate this list.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
