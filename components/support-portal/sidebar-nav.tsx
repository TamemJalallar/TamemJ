"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SupportIcon } from "@/components/support-portal/icons";

interface SidebarNavProps {
  collapsed: boolean;
  onCloseMobile?: () => void;
}

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const baseNavItems = [
  { href: "/support", label: "Home", icon: "home" as const },
  { href: "/support/kb", label: "Knowledge Base", icon: "book" as const },
  { href: "/support/catalog", label: "Service Catalog", icon: "catalog" as const },
  { href: "/support/incident/new", label: "Submit Incident", icon: "incident" as const },
  { href: "/support/tickets", label: "My Tickets", icon: "tickets" as const },
  { href: "/support/analytics", label: "Analytics", icon: "analytics" as const }
];

export function SidebarNav({ collapsed, onCloseMobile }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className={cx("border-b border-line/70 p-4 dark:border-slate-800", collapsed && "lg:px-3")}> 
        <Link href="/support" className="flex items-center gap-3" onClick={onCloseMobile}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line/80 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-900">
            <SupportIcon name="tickets" className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          </div>
          {!collapsed ? (
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">IT Support Portal</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">ITIL-style demo experience</p>
            </div>
          ) : null}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <p className={cx("mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400", collapsed && "lg:hidden")}>Portal</p>
        <nav aria-label="Support portal navigation" className="space-y-1">
          {baseNavItems.map((item) => {
            const isActive = item.href === "/support" ? pathname === "/support" : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cx(
                  "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-soft dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : "border-transparent text-slate-700 hover:border-line/80 hover:bg-white hover:text-slate-900 dark:text-slate-200 dark:hover:border-slate-800 dark:hover:bg-slate-900",
                  collapsed && "lg:justify-center lg:px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <SupportIcon name={item.icon} className="h-4 w-4 shrink-0" aria-hidden="true" />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
