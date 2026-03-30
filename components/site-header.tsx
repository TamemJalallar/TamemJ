"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AccountNavLabel } from "@/components/account-nav-label";
import { NavLink } from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { adsenseReviewModeEnabled } from "@/lib/adsense-review-mode";
import { appsSectionEnabled } from "@/lib/apps-visibility";

type NavItem = {
  href: string;
  label: string;
  description?: string;
};

const reviewModeNavItems: NavItem[] = [
  ...(appsSectionEnabled ? [{ href: "/apps", label: "Apps" }] : []),
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" }
];

const desktopPrimaryNavItems: NavItem[] = [
  ...(appsSectionEnabled ? [{ href: "/apps", label: "Apps" }] : []),
  { href: "/support/tickets", label: "Tickets" },
  { href: "/downloads", label: "Downloads" },
  { href: "/guides", label: "Guides" }
];

const desktopExploreNavItems: NavItem[] = [
  {
    href: "/corporate-tech-fixes",
    label: "Fixes",
    description: "Corporate runbooks and quick remediation guides"
  },
  {
    href: "/ai-agents",
    label: "AI Agents",
    description: "Role-based system prompts and category hubs"
  },
  {
    href: "/genai-prompts",
    label: "GenAI Prompts",
    description: "Task-level prompt templates and creative workflows"
  },
  {
    href: "/pc-build-guides",
    label: "PC Builds",
    description: "Hardware planning and part-selection guides"
  },
  {
    href: "/support",
    label: "Support",
    description: "Support portal, catalog, and incident workflows"
  }
];

const mobileNavItems: NavItem[] = adsenseReviewModeEnabled
  ? reviewModeNavItems
  : [...desktopPrimaryNavItems, ...desktopExploreNavItems];

function pathMatches(pathname: string | null, href: string): boolean {
  if (!pathname) {
    return false;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreMenuOpen, setExploreMenuOpen] = useState(false);
  const exploreMenuRef = useRef<HTMLDivElement | null>(null);
  const exploreActive = desktopExploreNavItems.some((item) => pathMatches(pathname, item.href));

  useEffect(() => {
    setMobileMenuOpen(false);
    setExploreMenuOpen(false);
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

  useEffect(() => {
    if (!exploreMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (exploreMenuRef.current && target && !exploreMenuRef.current.contains(target)) {
        setExploreMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [exploreMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/90 backdrop-blur">
      <div className="page-shell">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <Link href="/" className="shrink-0">
            <span className="text-sm font-semibold tracking-tight sm:text-base">TamemJ</span>
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
            {(adsenseReviewModeEnabled ? reviewModeNavItems : desktopPrimaryNavItems).map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            {!adsenseReviewModeEnabled ? (
              <div ref={exploreMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setExploreMenuOpen((current) => !current)}
                  className={`nav-link flex items-center gap-1.5 ${exploreActive ? "nav-link-active" : ""}`}
                  aria-expanded={exploreMenuOpen}
                  aria-haspopup="menu"
                >
                  Explore
                  <svg
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 transition ${exploreMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 8 5 5 5-5" />
                  </svg>
                </button>
                {exploreMenuOpen ? (
                  <div
                    className="absolute right-0 top-[calc(100%+0.75rem)] w-[21rem] rounded-2xl border border-line/80 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-950"
                    role="menu"
                  >
                    <div className="grid gap-2">
                      {desktopExploreNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`rounded-2xl border px-3 py-3 text-left transition ${
                            pathMatches(pathname, item.href)
                              ? "border-slate-300 bg-slate-50 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                              : "border-transparent text-slate-700 hover:border-line/80 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                          }`}
                          role="menuitem"
                        >
                          <p className="text-sm font-semibold">{item.label}</p>
                          {item.description ? (
                            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                              {item.description}
                            </p>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </nav>

          <div className="hidden items-center gap-1 lg:flex">
            {!adsenseReviewModeEnabled ? (
              <NavLink href="/account">
                <AccountNavLabel />
              </NavLink>
            ) : null}
            <NavLink href="/contact">Contact</NavLink>
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
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
        <div className="border-t border-line/70 bg-white/95 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
          <div className="page-shell !px-0">
            <nav aria-label="Mobile navigation" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {mobileNavItems.map((item) => (
                <NavLink key={`mobile-${item.href}`} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
              {!adsenseReviewModeEnabled ? (
                <NavLink href="/account">
                  <AccountNavLabel />
                </NavLink>
              ) : null}
              <NavLink href="/contact">Contact</NavLink>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
