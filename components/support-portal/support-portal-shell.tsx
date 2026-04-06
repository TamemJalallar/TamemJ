"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AffiliateDisclosureBanner } from "@/components/affiliate/affiliate-disclosure-banner";
import { SidebarNav } from "@/components/support-portal/sidebar-nav";
import { SupportIcon } from "@/components/support-portal/icons";
import {
  getSupportPortalState,
  setSupportSidebarCollapsed
} from "@/lib/support-portal.storage";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function SupportPortalShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const state = getSupportPortalState();
    setCollapsed(state.sidebarCollapsed);
  }, []);

  function handleToggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    setSupportSidebarCollapsed(next);
  }

  return (
    <div className="section-shell !py-0">
      <div className="mx-auto w-full max-w-[1400px] px-0 sm:px-4 lg:px-6">
        <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 gap-0 lg:grid-cols-[auto_1fr] lg:py-4">
          <div className="hidden lg:block">
            <aside
              className={cx(
                "h-full rounded-[22px] border border-line bg-white/74 shadow-soft backdrop-blur-md dark:bg-card/78",
                collapsed ? "w-20" : "w-72"
              )}
            >
              <div className="flex h-14 items-center justify-end border-b border-line px-3">
                <button
                  type="button"
                  onClick={handleToggleCollapse}
                  className="btn-ghost !h-9 !w-9 !rounded-xl !px-0 !py-0"
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <SupportIcon name="chevron" className={cx("h-4 w-4", collapsed && "rotate-180")} />
                </button>
              </div>
              <div className="h-[calc(100%-3.5rem)]">
                <SidebarNav collapsed={collapsed} />
              </div>
            </aside>
          </div>

          <div className="min-w-0 lg:pl-4">
            <div className="glass-nav sticky top-16 z-20 border-b px-4 py-3 sm:px-6 lg:hidden">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="btn-ghost !h-10 !w-10 !rounded-xl !px-0 !py-0"
                  aria-label="Open support navigation"
                >
                  <SupportIcon name="menu" className="h-4 w-4" />
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-fg">IT Support Portal</p>
                  <p className="truncate text-xs text-muted">ServiceNow-style demo portal</p>
                </div>
                <div className="h-10 w-10" aria-hidden="true" />
              </div>
            </div>

            <div className="space-y-4 px-4 py-4 sm:px-6 lg:px-0 lg:py-0">
              <AffiliateDisclosureBanner compact />
              {children}
            </div>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="lg:hidden">
          <button
            type="button"
            className="fixed inset-0 z-40 bg-neutral-950/55 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close support navigation"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm p-3">
            <div className="flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-white/94 shadow-card backdrop-blur-md dark:bg-card">
              <div className="flex h-14 items-center justify-between border-b border-line px-3">
                <p className="text-sm font-semibold text-fg">Support Navigation</p>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="btn-ghost !h-9 !w-9 !rounded-xl !px-0 !py-0"
                  aria-label="Close menu"
                >
                  <SupportIcon name="close" className="h-4 w-4" />
                </button>
              </div>
              <SidebarNav
                collapsed={false}
                onCloseMobile={() => setMobileOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
