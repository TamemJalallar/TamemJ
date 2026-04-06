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

type MenuKey = "ai" | "explore" | null;

type MenuConfig = {
  key: Exclude<MenuKey, null>;
  label: string;
  items: NavItem[];
};

const reviewModeNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  ...(appsSectionEnabled ? [{ href: "/apps", label: "Apps" }] : []),
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" }
];

const desktopPrimaryNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/corporate-tech-fixes", label: "Tech Fixes" },
  { href: "/support/tickets", label: "Tickets" },
  { href: "/downloads", label: "Downloads" },
  ...(appsSectionEnabled ? [{ href: "/apps", label: "Apps" }] : [])
];

const desktopAiMenuItems: NavItem[] = [
  {
    href: "/ai-agents",
    label: "AI Agents",
    description: "Role-based system prompts and copy-ready specialist agents"
  },
  {
    href: "/genai-prompts",
    label: "GenAI Prompts",
    description: "Task-level prompts for content, creative, and productivity workflows"
  }
];

const desktopExploreMenuItems: NavItem[] = [
  {
    href: "/support",
    label: "Support Portal",
    description: "Service catalog, incident intake, analytics, and support workflows"
  },
  {
    href: "/guides",
    label: "Pillar Guides",
    description: "Long-form enterprise IT guide hubs and editorial content clusters"
  },
  {
    href: "/pc-build-guides",
    label: "PC Builds",
    description: "Interactive hardware planning and workload-based build recommendations"
  },
  {
    href: "/services/msp",
    label: "MSP Services",
    description: "Retained systems administration and ongoing support for growing teams"
  }
];

const desktopMenus: MenuConfig[] = [
  { key: "ai", label: "AI Hub", items: desktopAiMenuItems },
  { key: "explore", label: "Explore", items: desktopExploreMenuItems }
];

const mobileSections = adsenseReviewModeEnabled
  ? [
      {
        title: "Main",
        items: reviewModeNavItems
      }
    ]
  : [
      {
        title: "Main",
        items: desktopPrimaryNavItems
      },
      {
        title: "Support & Resources",
        items: desktopExploreMenuItems
      },
      {
        title: "AI Hub",
        items: desktopAiMenuItems
      }
    ];

function pathMatches(pathname: string | null, href: string): boolean {
  if (!pathname) {
    return false;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function menuIsActive(pathname: string | null, items: NavItem[]): boolean {
  return items.some((item) => pathMatches(pathname, item.href));
}

function MenuButton({
  label,
  open,
  active,
  onClick
}: {
  label: string;
  open: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`nav-link flex items-center gap-1.5 ${active ? "nav-link-active" : ""}`}
      aria-expanded={open}
      aria-haspopup="menu"
    >
      {label}
      <svg
        viewBox="0 0 20 20"
        className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 8 5 5 5-5" />
      </svg>
    </button>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<MenuKey>(null);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDesktopMenu(null);
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
    if (!openDesktopMenu) {
      return;
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (desktopMenuRef.current && target && !desktopMenuRef.current.contains(target)) {
        setOpenDesktopMenu(null);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [openDesktopMenu]);

  return (
    <header className="glass-nav sticky top-0 z-40 border-b">
      <div className="page-shell">
        <div className="flex min-h-[4.75rem] items-center justify-between gap-4 py-3">
          <Link href="/" className="shrink-0">
            <div className="flex flex-col">
              <span className="font-display text-base font-semibold tracking-tight text-fg sm:text-lg">
                TamemJ
              </span>
              <span className="hidden text-[11px] font-medium uppercase tracking-[0.16em] text-muted sm:block">
                IT Knowledge Hub
              </span>
            </div>
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
            {(adsenseReviewModeEnabled ? reviewModeNavItems : desktopPrimaryNavItems).map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}

            {!adsenseReviewModeEnabled ? (
              <div ref={desktopMenuRef} className="flex items-center gap-1">
                {desktopMenus.map((menu) => {
                  const active = menuIsActive(pathname, menu.items);
                  const open = openDesktopMenu === menu.key;

                  return (
                    <div key={menu.key} className="relative">
                      <MenuButton
                        label={menu.label}
                        open={open}
                        active={active}
                        onClick={() => setOpenDesktopMenu((current) => (current === menu.key ? null : menu.key))}
                      />

                      {open ? (
                        <div
                          className="absolute right-0 top-[calc(100%+0.75rem)] w-[24rem] rounded-[24px] border border-line bg-card/95 p-3 shadow-card backdrop-blur-md"
                          role="menu"
                        >
                          <div className="mb-2 px-2 py-1">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                              {menu.label}
                            </p>
                          </div>
                          <div className="grid gap-2">
                            {menu.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                                  pathMatches(pathname, item.href)
                                    ? "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-400/30 dark:bg-primary-500/10 dark:text-primary-300"
                                    : "border-transparent text-fg-secondary hover:border-line hover:bg-white/70 hover:text-fg dark:hover:bg-white/5"
                                }`}
                                role="menuitem"
                              >
                                <p className="text-sm font-semibold">{item.label}</p>
                                {item.description ? (
                                  <p className="mt-1 text-xs leading-5 text-muted">{item.description}</p>
                                ) : null}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {!adsenseReviewModeEnabled ? (
              <NavLink href="/account">
                <AccountNavLabel />
              </NavLink>
            ) : null}
            <Link href="/contact" className="btn-primary !px-4 !py-2.5">
              Contact
            </Link>
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card/90 text-fg shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white/90 lg:hidden dark:hover:bg-white/5"
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
        <div className="border-t border-line bg-card/95 px-4 py-5 backdrop-blur-md lg:hidden">
          <div className="page-shell !px-0">
            <div className="grid gap-5">
              {mobileSections.map((section) => (
                <section key={section.title} className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    {section.title}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {section.items.map((item) => (
                      <Link
                        key={`mobile-${section.title}-${item.href}`}
                        href={item.href}
                        className={`surface-card-interactive rounded-2xl px-4 py-3 ${
                          pathMatches(pathname, item.href)
                            ? "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-400/30 dark:bg-primary-500/10 dark:text-primary-300"
                            : ""
                        }`}
                      >
                        <p className="text-sm font-semibold">{item.label}</p>
                        {item.description ? (
                          <p className="mt-1 text-xs leading-5 text-muted">{item.description}</p>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}

              <section className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Account & Settings
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {!adsenseReviewModeEnabled ? (
                    <Link href="/account" className="surface-card-interactive rounded-2xl px-4 py-3 text-sm font-semibold">
                      <AccountNavLabel />
                    </Link>
                  ) : null}
                  <Link href="/contact" className="btn-primary text-sm">
                    Contact
                  </Link>
                  <div className="surface-card rounded-2xl px-4 py-3">
                    <ThemeToggle />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
