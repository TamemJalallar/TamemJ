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

type MenuKey = "explore" | null;

type MenuConfig = {
  key: Exclude<MenuKey, null>;
  label: string;
  items: NavItem[];
};

const reviewModeNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/support/tickets", label: "Tickets" },
  { href: "/downloads", label: "Downloads" },
  { href: "/guides", label: "Guides" }
];

const desktopPrimaryNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/support/tickets", label: "Tickets" },
  { href: "/downloads", label: "Downloads" },
  { href: "/guides", label: "Guides" },
  { href: "/corporate-tech-fixes", label: "Tech Fixes" }
];

const desktopExploreMenuItems: NavItem[] = [
  {
    href: "/support",
    label: "Support Portal",
    description: "Incident intake, service catalog, analytics, and support workflow surfaces"
  },
  {
    href: "/apps",
    label: "Apps",
    description: "Product pages, privacy links, support paths, and app release previews"
  },
  {
    href: "/ai-agents",
    label: "AI Hub",
    description: "AI agent libraries and prompt collections kept outside the core IT review path"
  },
  {
    href: "/pc-build-guides",
    label: "PC Builds",
    description: "Interactive hardware planning and workload-based component recommendations"
  },
  {
    href: "/recommended-gear",
    label: "Recommended Gear",
    description: "Curated desk, networking, power, and home lab recommendations"
  },
  {
    href: "/services/msp",
    label: "MSP Services",
    description: "Retained systems administration and ongoing support for growing teams"
  }
].filter((item) => item.href !== "/apps" || appsSectionEnabled);

const desktopMenus: MenuConfig[] = [{ key: "explore", label: "Explore", items: desktopExploreMenuItems }];

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
        title: "Explore",
        items: desktopExploreMenuItems
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
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          pathMatches(pathname, item.href)
                            ? "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-400/30 dark:bg-primary-500/10 dark:text-primary-300"
                            : "border-line bg-card text-fg hover:border-primary-200 hover:bg-white/80 dark:hover:bg-white/5"
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

              <div className="grid gap-2 sm:grid-cols-2">
                {!adsenseReviewModeEnabled ? (
                  <Link
                    href="/account"
                    className="inline-flex items-center justify-center rounded-2xl border border-line bg-card px-4 py-3 text-sm font-medium text-fg transition hover:border-primary-200 hover:bg-white/80 dark:hover:bg-white/5"
                  >
                    <AccountNavLabel />
                  </Link>
                ) : null}
                <Link href="/contact" className="btn-primary justify-center text-center">
                  Contact
                </Link>
              </div>

              <div className="flex justify-end">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
