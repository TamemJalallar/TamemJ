"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { SidebarNav } from "@/components/support-portal/sidebar-nav";
import { SupportIcon } from "@/components/support-portal/icons";
import {
  getSupportPortalState,
  setSupportAdminEnabled,
  setSupportSidebarCollapsed
} from "@/lib/support-portal.storage";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function SupportPortalShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [adminEnabled, setAdminEnabled] = useState(false);

  useEffect(() => {
    const state = getSupportPortalState();
    setCollapsed(state.sidebarCollapsed);
    setAdminEnabled(state.adminEnabled);
  }, []);

  function handleToggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    setSupportSidebarCollapsed(next);
  }

  function handleToggleAdmin(enabled: boolean) {
    setAdminEnabled(enabled);
    setSupportAdminEnabled(enabled);
  }

  return (
    <div className="section-shell !py-0">
      <div className="mx-auto w-full max-w-[1400px] px-0 sm:px-4 lg:px-6">
        <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 gap-0 lg:grid-cols-[auto_1fr] lg:py-4">
          <div className="hidden lg:block">
            <aside
              className={cx(
                "h-full rounded-2xl border border-line/70 bg-slate-50/80 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-950/70",
                collapsed ? "w-20" : "w-72"
              )}
            >
              <div className="flex h-14 items-center justify-end border-b border-line/70 px-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleToggleCollapse}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line/70 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <SupportIcon name="chevron" className={cx("h-4 w-4", collapsed && "rotate-180")} />
                </button>
              </div>
              <div className="h-[calc(100%-3.5rem)]">
                <SidebarNav
                  collapsed={collapsed}
                  adminEnabled={adminEnabled}
                  onToggleAdmin={handleToggleAdmin}
                />
              </div>
            </aside>
          </div>

          <div className="min-w-0 lg:pl-4">
            <div className="sticky top-16 z-20 border-b border-line/70 bg-bg/95 px-4 py-3 backdrop-blur sm:px-6 lg:hidden dark:border-slate-800 dark:bg-slate-950/90">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line/70 bg-white text-slate-700 shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  aria-label="Open support navigation"
                >
                  <SupportIcon name="menu" className="h-4 w-4" />
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">IT Support Portal</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">ServiceNow-style demo portal</p>
                </div>
                <div className="h-10 w-10" aria-hidden="true" />
              </div>
            </div>

            <div className="px-4 py-4 sm:px-6 lg:px-0 lg:py-0">{children}</div>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="lg:hidden">
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close support navigation"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm p-3">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line/70 bg-slate-50 shadow-card dark:border-slate-800 dark:bg-slate-950">
              <div className="flex h-14 items-center justify-between border-b border-line/70 px-3 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Support Navigation</p>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line/70 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  aria-label="Close menu"
                >
                  <SupportIcon name="close" className="h-4 w-4" />
                </button>
              </div>
              <SidebarNav
                collapsed={false}
                adminEnabled={adminEnabled}
                onToggleAdmin={handleToggleAdmin}
                onCloseMobile={() => setMobileOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
