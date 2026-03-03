import Link from "next/link";
import { AccountNavLabel } from "@/components/account-nav-label";
import { NavLink } from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/apps", label: "Apps" },
  { href: "/downloads", label: "Downloads" },
  { href: "/corporate-tech-fixes", label: "Tech Fixes" },
  { href: "/pc-build-guides", label: "PC Builds" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/90 backdrop-blur">
      <div className="page-shell">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <Link href="/" className="shrink-0">
            <span className="text-sm font-semibold tracking-tight sm:text-base">TamemJ</span>
          </Link>

          <nav aria-label="Primary navigation" className="hide-scrollbar -mx-1 flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            <NavLink href="/account">
              <AccountNavLabel />
            </NavLink>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
