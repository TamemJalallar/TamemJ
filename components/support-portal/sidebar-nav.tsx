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
  { href: "/support/tickets", label: "Tickets", icon: "tickets" as const },
  { href: "/support/catalog", label: "Service Catalog", icon: "catalog" as const },
  { href: "/support/incident/new", label: "Submit Incident", icon: "incident" as const },
  { href: "/support/my-tickets", label: "My Tickets", icon: "tickets" as const },
  { href: "/support/analytics", label: "Analytics", icon: "analytics" as const }
];

export function SidebarNav({ collapsed, onCloseMobile }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className={cx("border-b border-line p-4", collapsed && "lg:px-3")}>
        <Link href="/support" className="flex items-center gap-3" onClick={onCloseMobile}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-200 bg-primary-50 shadow-soft dark:border-primary-400/30 dark:bg-primary-500/10">
            <SupportIcon name="tickets" className="h-5 w-5 text-primary-600 dark:text-primary-300" />
          </div>
          {!collapsed ? (
            <div>
              <p className="text-sm font-semibold text-fg">IT Support Portal</p>
              <p className="text-xs text-muted">ITIL-style demo experience</p>
            </div>
          ) : null}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <p className={cx("mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted", collapsed && "lg:hidden")}>Portal</p>
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
                    ? "border-primary-200 bg-primary-50 text-primary-700 shadow-soft dark:border-primary-400/30 dark:bg-primary-500/15 dark:text-primary-300"
                    : "border-transparent text-fg-secondary hover:border-line hover:bg-white/80 hover:text-fg dark:hover:bg-white/5",
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
