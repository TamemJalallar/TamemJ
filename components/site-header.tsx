"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/apps", label: "Apps" },
  { href: "/privacy", label: "Privacy" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/90 backdrop-blur">
      <div className="page-shell">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <Link href="/" className="shrink-0">
            <span className="text-sm font-semibold tracking-tight sm:text-base">Tamem J</span>
          </Link>

          <nav aria-label="Primary navigation" className="hide-scrollbar -mx-1 flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
