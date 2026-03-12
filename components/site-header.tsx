"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AccountNavLabel } from "@/components/account-nav-label";
import { NavLink } from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { appsSectionEnabled } from "@/lib/apps-visibility";

type NavMenuItem = {
  href: string;
  label: string;
  description: string;
};

type NavMenuGroup = {
  href: string;
  label: string;
  items: readonly NavMenuItem[];
};

const fixNavItems = [
  {
    href: "/corporate-tech-fixes",
    label: "Corporate Tech Fixes",
    description: "Enterprise-safe remediation guides for common workplace IT issues."
  },
  {
    href: "/support/tickets",
    label: "Troubleshooting Tickets",
    description: "Searchable issue articles for Microsoft 365, devices, networking, and identity."
  }
] as const;

const guideNavItems = [
  {
    href: "/guides",
    label: "Guides Hub",
    description: "Long-form pillar content, setup guides, and structured technical walkthroughs."
  },
  {
    href: "/pc-build-guides",
    label: "PC Build Guides",
    description: "Interactive workstation and gaming build planning with component recommendations."
  }
] as const;

const supportNavItems = [
  {
    href: "/support",
    label: "Support Portal",
    description: "Portal home for search, navigation, and support workflows."
  },
  {
    href: "/support/catalog",
    label: "Service Catalog",
    description: "Request access, hardware, mailbox, and support services."
  },
  {
    href: "/support/incident/new",
    label: "Incident Form",
    description: "Submit a new issue with structured intake fields."
  },
  {
    href: "/support/tickets",
    label: "Tickets",
    description: "Browse troubleshooting articles and issue-specific resolutions."
  }
] as const;

const aiNavItems = [
  {
    href: "/ai-agents",
    label: "AI Agents",
    description: "Specialized agent prompts organized by role and platform."
  },
  {
    href: "/genai-prompts",
    label: "GenAI Prompts",
    description: "Prompt library for creation, research, content, and workflow tasks."
  }
] as const;

const menuGroups = [
  { href: "/corporate-tech-fixes", label: "Fixes", items: fixNavItems },
  { href: "/guides", label: "Guides", items: guideNavItems },
  { href: "/support", label: "Support", items: supportNavItems },
  { href: "/ai", label: "AI Hub", items: aiNavItems }
] as const satisfies readonly NavMenuGroup[];

const directNavItems = [
  { href: "/downloads", label: "Downloads" },
  ...(appsSectionEnabled ? [{ href: "/apps", label: "Apps" }] : [])
] as const;

function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopNavMenu({ group, pathname }: { group: NavMenuGroup; pathname: string | null }) {
  const active = isActivePath(pathname, group.href) || group.items.some((item) => isActivePath(pathname, item.href));

  return (
    <div className="group relative">
      <Link
        href={group.href}
        className={`nav-link inline-flex items-center gap-1 ${active ? "nav-link-active" : ""}`}
        aria-haspopup="menu"
      >
        {group.label}
        <svg
          viewBox="0 0 20 20"
          className="h-4 w-4 text-slate-400 transition group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z" />
        </svg>
      </Link>
      <div className="invisible absolute left-0 top-full z-40 mt-2 w-72 translate-y-1 rounded-2xl border border-line/80 bg-white/95 p-2 opacity-0 shadow-card backdrop-blur transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 dark:border-slate-700 dark:bg-slate-950/95">
        {group.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col gap-1 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <span className="font-semibold">{item.label}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{item.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/90 backdrop-blur">
      <div className="page-shell">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <Link href="/" className="shrink-0">
            <span className="text-sm font-semibold tracking-tight sm:text-base">TamemJ</span>
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
            {menuGroups.slice(0, 1).map((group) => (
              <DesktopNavMenu key={group.label} group={group} pathname={pathname} />
            ))}
            {directNavItems.slice(0, 1).map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            {menuGroups.slice(1).map((group) => (
              <DesktopNavMenu key={group.label} group={group} pathname={pathname} />
            ))}
            {directNavItems.slice(1).map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            <NavLink href="/account">
              <AccountNavLabel />
            </NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <ThemeToggle />
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="sr-only">Menu</span>
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-line/70 bg-white/95 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
          <div className="page-shell !px-0">
            <nav aria-label="Mobile navigation" className="space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {directNavItems.map((item) => (
                  <NavLink key={`mobile-direct-${item.href}`} href={item.href}>
                    {item.label}
                  </NavLink>
                ))}
                <NavLink href="/account">
                  <AccountNavLabel />
                </NavLink>
                <NavLink href="/contact">Contact</NavLink>
                <div className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line/70 bg-slate-50/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/70">
                  <ThemeToggle />
                </div>
              </div>

              {menuGroups.map((group) => (
                <div
                  key={`mobile-group-${group.label}`}
                  className="rounded-xl border border-line/70 bg-slate-50/80 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {group.label}
                    </p>
                    <Link href={group.href} className="text-[11px] font-medium text-accent">
                      Open hub
                    </Link>
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <NavLink key={`mobile-${group.label}-${item.href}`} href={item.href}>
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
