import Image from "next/image";
import Link from "next/link";
import type { IOSApp } from "@/types/app";
import { getAppPrimaryLink, getAppStatusLabel, getCompatibilityText, hasAppStoreRelease } from "@/lib/apps";

interface AppCardProps {
  app: IOSApp;
}

export function AppCard({ app }: AppCardProps) {
  const hasAppStoreUrl = hasAppStoreRelease(app);
  const primaryLink = getAppPrimaryLink(app);
  const appDetailHref = `/apps/${app.slug}`;
  const statusLabel = getAppStatusLabel(app);
  const iconHref = primaryLink?.href ?? appDetailHref;
  const iconTargetProps = primaryLink ? { target: "_blank", rel: "noreferrer" as const } : {};

  return (
    <article className="surface-card-strong flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-card dark:hover:border-primary-400/30 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{app.category}</p>
            <span
              className={hasAppStoreUrl
                ? "inline-flex items-center rounded-full border border-success-100 bg-success-50 px-2.5 py-1 text-[11px] font-semibold text-success-700 dark:border-success-500/25 dark:bg-success-500/12 dark:text-green-200"
                : "inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700 dark:border-primary-500/25 dark:bg-primary-500/12 dark:text-primary-200"}
            >
              {statusLabel}
            </span>
          </div>
          <h3 className="mt-3 font-display text-xl font-semibold text-fg">
            <Link href={appDetailHref} className="transition hover:text-primary-600 dark:hover:text-primary-300">
              {app.name}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-fg-secondary">{app.tagline}</p>
        </div>

        <a
          href={iconHref}
          aria-label={primaryLink ? `${primaryLink.label} for ${app.name}` : `Open ${app.name} details`}
          className="group/icon shrink-0 text-center"
          {...iconTargetProps}
        >
          <div className="relative h-20 w-20 overflow-hidden rounded-[1.6rem] border border-line bg-card shadow-soft transition-all duration-200 group-hover/icon:-translate-y-0.5 group-hover/icon:border-primary-200 group-hover/icon:shadow-card dark:group-hover/icon:border-primary-400/30">
            <Image src={app.icon} alt={`${app.name} icon`} fill sizes="80px" className="object-cover" />
          </div>
          <span className="mt-2 block text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-muted transition group-hover/icon:text-primary-600 dark:group-hover/icon:text-primary-300">
            {primaryLink ? (hasAppStoreUrl ? "Open store" : "Open product") : "Details"}
          </span>
        </a>
      </div>

      <p className="mt-4 text-sm leading-6 text-fg-secondary">{app.shortDescription}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {app.features.slice(0, 2).map((feature) => (
          <span key={`${app.slug}-${feature}`} className="filter-chip">
            {feature}
          </span>
        ))}
        {app.features.length > 2 ? (
          <span className="filter-chip px-2.5 py-1 text-xs">+{app.features.length - 2} more</span>
        ) : null}
      </div>

      <div className="mt-auto grid gap-3 pt-6">
        <div className="grid gap-2 text-xs text-muted sm:grid-cols-2">
          <div className="rounded-xl border border-line/80 bg-card-2/60 px-3 py-2">
            <p className="font-semibold text-fg">Pricing</p>
            <p className="mt-1">{app.pricing}</p>
          </div>
          <div className="rounded-xl border border-line/80 bg-card-2/60 px-3 py-2">
            <p className="font-semibold text-fg">Compatibility</p>
            <p className="mt-1">{getCompatibilityText(app)}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-muted">{app.screenshots.length} screenshots</p>
          <Link
            href={appDetailHref}
            className="text-sm font-semibold text-primary-600 transition hover:text-primary-700 hover:underline dark:text-primary-300 dark:hover:text-primary-200"
          >
            View product page
          </Link>
        </div>
      </div>
    </article>
  );
}
