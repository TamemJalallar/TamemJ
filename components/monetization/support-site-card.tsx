import Link from "next/link";
import type { AffiliateLink } from "@/lib/affiliate-links";
import { monetizationConfig } from "@/lib/monetization";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function partnerRel(link: AffiliateLink): string {
  return link.status === "Active" ? "sponsored nofollow noreferrer" : "nofollow noreferrer";
}

export function SupportSiteCard({
  title = "Support the free IT library",
  description = "This site stays free through quiet ads, optional partner links, downloadable resources, and donations. Recommendations are secondary to the troubleshooting guidance.",
  affiliateLinks = [],
  compact = false,
  className
}: {
  title?: string;
  description?: string;
  affiliateLinks?: AffiliateLink[];
  compact?: boolean;
  className?: string;
}) {
  return (
    <section className={cx("surface-card-strong p-5 sm:p-6", className)} aria-label="Support this site">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr] lg:items-start">
        <div>
          <p className="eyebrow">Monetization disclosure</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-fg sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-fg-secondary sm:text-base">
            {description}
          </p>
          <p className="mt-3 max-w-3xl text-xs leading-6 text-muted">
            {monetizationConfig.disclosure}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/downloads/assets/" className="btn-primary">
              Get free IT assets
            </Link>
            <Link href="/donate/" className="btn-secondary">
              Support directly
            </Link>
          </div>
        </div>

        {affiliateLinks.length > 0 ? (
          <div className="rounded-3xl border border-line/80 bg-card-2/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-fg">Relevant partner picks</p>
              {!compact ? (
                <span className="filter-chip px-2.5 py-1 text-[11px]">Optional</span>
              ) : null}
            </div>
            <div className="mt-3 grid gap-2">
              {affiliateLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.url}
                  target="_blank"
                  rel={partnerRel(link)}
                  className="group rounded-2xl border border-line/70 bg-card px-3 py-3 transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-primary-500/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-fg transition group-hover:text-primary-600 dark:group-hover:text-primary-300">
                        {link.label}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted">{link.description}</p>
                    </div>
                    <span
                      className={cx(
                        "inline-flex shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold",
                        link.status === "Active"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200"
                          : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
                      )}
                    >
                      {link.status}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

