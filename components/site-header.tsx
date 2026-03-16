"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AccountNavLabel } from "@/components/account-nav-label";
import { NavLink } from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { appsSectionEnabled } from "@/lib/apps-visibility";

const primaryNavItems = [
  { href: "/corporate-tech-fixes", label: "Fixes" },
  { href: "/downloads", label: "Downloads" },
  { href: "/support/tickets", label: "Tickets" },
  { href: "/ai-agents", label: "AI Agents" },
  { href: "/genai-prompts", label: "GenAI Prompts" },
  { href: "/guides", label: "Guides" },
  { href: "/pc-build-guides", label: "PC Builds" },
  { href: "/support", label: "Support" },
  ...(appsSectionEnabled ? [{ href: "/apps", label: "Apps" }] : [])
] as const;

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
            {primaryNavItems.map((item) => (
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
            <nav aria-label="Mobile navigation" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {primaryNavItems.map((item) => (
                <NavLink key={`mobile-${item.href}`} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
              <NavLink href="/account">
                <AccountNavLabel />
              </NavLink>
              <NavLink href="/contact">Contact</NavLink>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
