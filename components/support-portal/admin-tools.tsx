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
        description="Local-only demo utilities for seeding tickets and resetting portal analytics/state. Admin mode visibility is controlled by a local sidebar toggle."
        breadcrumbs={[{ label: "Support Portal", href: "/support" }, { label: "Admin" }]}
      />

      {!adminEnabled ? (
        <section className="rounded-2xl border border-line/70 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/70">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Admin Mode Disabled</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Enable Admin Mode from the support portal sidebar to reveal admin navigation and use reset/seed tools.
          </p>
          <button
            type="button"
            onClick={() => {
              setSupportAdminEnabled(true);
              setAdminEnabledState(true);
              trackAdminAction("enable_admin_mode_from_admin_page");
              flashMessage("Admin mode enabled locally.");
            }}
            className="btn-primary mt-4"
          >
            Enable Admin Mode (Local)
          </button>
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
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Storage Keys (Local Browser)</h2>
            <ul className="mt-3 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
              <li className="list-disc leading-7"><code>supportPortal:tickets:v1</code> for demo ticket objects and activity logs.</li>
              <li className="list-disc leading-7"><code>supportPortal:analytics:v1</code> for analytics events.</li>
              <li className="list-disc leading-7"><code>supportPortal:kbHelpfulVotes:v1</code> for local Yes/No article feedback state.</li>
              <li className="list-disc leading-7"><code>supportPortal:state:v1</code> for sidebar collapse and admin toggle preferences.</li>
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
