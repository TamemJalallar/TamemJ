import Link from "next/link";
import { adsenseReviewModeEnabled } from "@/lib/adsense-review-mode";
import { appsSectionEnabled } from "@/lib/apps-visibility";

const platformLinks = [
  { href: "/corporate-tech-fixes", label: "Tech Fixes" },
  { href: "/support/tickets", label: "Tickets" },
  { href: "/downloads", label: "Downloads" },
  { href: "/guides", label: "Guides" }
] as const;

const productLinks = [
  ...(appsSectionEnabled ? [{ href: "/apps", label: "Apps" }] : []),
  { href: "/services/msp", label: "MSP Services" },
  { href: "/contact", label: "Contact" }
] as const;

const aiLinks = [
  { href: "/ai-agents", label: "AI Agents" },
  { href: "/genai-prompts", label: "GenAI Prompts" },
  { href: "/pc-build-guides", label: "PC Builds" }
] as const;

const supportLinks = [
  { href: "/support", label: "Support Portal" },
  { href: "/editorial-standards", label: "Editorial Standards" },
  { href: "/privacy", label: "Privacy Policy" },
  ...(!adsenseReviewModeEnabled ? [{ href: "/donate", label: "Donate" }] : [])
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-line bg-neutral-100/90 backdrop-blur-sm dark:bg-neutral-950/80">
      <div className="page-shell py-10 sm:py-12 lg:py-14">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_1.8fr]">
          <div className="space-y-4">
            <p className="eyebrow">TamemJ</p>
            <div className="max-w-xl space-y-3">
              <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
                A search-first hub for enterprise fixes, support content, downloads, and product work.
              </h2>
              <p className="text-sm leading-7 text-fg-secondary sm:text-base">
                Built for helpdesk teams, sysadmins, IT operators, and users who need clearer entry points,
                better documentation, and practical tools that are actually easy to find.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="surface-card rounded-2xl p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Focus</p>
                <p className="mt-2 text-sm font-semibold text-fg">IT fixes + support workflows</p>
              </div>
              <div className="surface-card rounded-2xl p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Audience</p>
                <p className="mt-2 text-sm font-semibold text-fg">Operators, admins, and technical teams</p>
              </div>
              <div className="surface-card rounded-2xl p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Built for</p>
                <p className="mt-2 text-sm font-semibold text-fg">Search, clarity, and trust</p>
              </div>
            </div>
            <p className="text-sm text-muted">© {year} Tamem J. All rights reserved.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <section className="surface-card rounded-2xl p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Platform</p>
              <div className="mt-3 grid gap-2">
                {platformLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>

            <section className="surface-card rounded-2xl p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Support</p>
              <div className="mt-3 grid gap-2">
                {supportLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>

            <section className="surface-card rounded-2xl p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">AI & Build</p>
              <div className="mt-3 grid gap-2">
                {aiLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>

            <section className="surface-card rounded-2xl p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Products</p>
              <div className="mt-3 grid gap-2">
                {productLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </footer>
  );
}
