"use client";

import { useEffect, useState } from "react";
import { SupportPageHeader } from "@/components/support-portal/page-header";
import {
  getSupportPortalState,
  resetKBHelpfulVotes,
  resetStoredTickets,
  seedDemoTickets,
  setSupportAdminEnabled
} from "@/lib/support-portal.storage";
import { resetSupportAnalytics, trackAdminAction } from "@/lib/support-portal.analytics";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function AdminTools() {
  const [adminEnabled, setAdminEnabledState] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setAdminEnabledState(getSupportPortalState().adminEnabled);
  }, []);

  function flashMessage(next: string) {
    setMessage(next);
    window.setTimeout(() => setMessage(null), 2200);
  }

  return (
    <div className="space-y-5">
      <SupportPageHeader
        title="Admin Tools"
        description="Local-only demo utilities for seeding tickets and resetting portal analytics/state. Admin controls are available only on /support/admin."
        breadcrumbs={[{ label: "Support Portal", href: "/support" }, { label: "Admin" }]}
      />

      <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Admin Mode</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Toggle local admin mode to unlock reset and seed tools in this browser.
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Status: {adminEnabled ? "Enabled" : "Disabled"}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={adminEnabled}
            aria-label="Enable admin mode"
            onClick={() => {
              const nextEnabled = !adminEnabled;
              setSupportAdminEnabled(nextEnabled);
              setAdminEnabledState(nextEnabled);
              trackAdminAction(
                nextEnabled ? "enable_admin_mode_from_admin_page" : "disable_admin_mode_from_admin_page"
              );
              flashMessage(nextEnabled ? "Admin mode enabled locally." : "Admin mode disabled locally.");
            }}
            className={cx(
              "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 focus-visible:ring-offset-2 dark:focus-visible:ring-slate-500/70 dark:focus-visible:ring-offset-slate-950",
              adminEnabled
                ? "border-emerald-500 bg-emerald-500/90 dark:border-emerald-400 dark:bg-emerald-400"
                : "border-slate-300 bg-slate-300 dark:border-slate-600 dark:bg-slate-700"
            )}
          >
            <span
              className={cx(
                "inline-flex h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-out dark:bg-slate-950",
                adminEnabled ? "translate-x-7" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </section>

      {!adminEnabled ? (
        <section className="rounded-2xl border border-line/70 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/70">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Admin Tools Locked</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Enable Admin Mode above to use seed/reset tools.
          </p>
        </section>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Seed Data</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Create sample tickets for demos and UI screenshots.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  seedDemoTickets();
                  trackAdminAction("seed_demo_tickets");
                  flashMessage("Demo tickets seeded.");
                }}
              >
                Seed Demo Tickets
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Reset Data</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Reset local-only analytics and ticket data stored in this browser.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  resetSupportAnalytics();
                  trackAdminAction("reset_analytics");
                  flashMessage("Analytics reset.");
                }}
              >
                Reset Analytics
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  resetKBHelpfulVotes();
                  trackAdminAction("reset_kb_helpful_votes");
                  flashMessage("KB helpful votes reset.");
                }}
              >
                Reset Helpful Votes
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  resetStoredTickets();
                  trackAdminAction("reset_tickets");
                  flashMessage("Tickets reset.");
                }}
              >
                Reset Tickets
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6 lg:col-span-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Storage Keys (Browser)</h2>
            <ul className="mt-3 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
              <li className="list-disc leading-7"><code>supportPortal:tickets:v1</code> for ticket cache in localStorage.</li>
              <li className="list-disc leading-7"><code>supportPortal:analytics:v1</code> for analytics cache in localStorage.</li>
              <li className="list-disc leading-7"><code>supportPortal:kbHelpfulVotes:v1</code> for local Yes/No article feedback state.</li>
              <li className="list-disc leading-7"><code>supportPortal:state:v1</code> for sidebar collapse and admin toggle preferences.</li>
              <li className="list-disc leading-7">IndexedDB <code>supportPortalDb</code> mirrors tickets and analytics for larger offline storage capacity.</li>
            </ul>
          </section>
        </div>
      )}

      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
          {message}
        </div>
      ) : null}
    </div>
  );
}
