import Image from "next/image";
import Link from "next/link";
import type { IOSApp } from "@/types/app";

interface AppCardProps {
  app: IOSApp;
}

export function AppCard({ app }: AppCardProps) {
  const hasAppStoreUrl = app.appStoreUrl.trim().length > 0;
  const appDetailHref = `/apps/${app.slug}`;
  const iconHref = hasAppStoreUrl ? app.appStoreUrl : appDetailHref;
  const iconTargetProps =
    hasAppStoreUrl
      ? { target: "_blank", rel: "noreferrer" as const }
      : {};

  return (
    <article className="surface-card-strong flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-card sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {app.category}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
            <Link href={appDetailHref} className="transition hover:text-accent">
              {app.name}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{app.tagline}</p>
        </div>

        <a
          href={iconHref}
          aria-label={
            hasAppStoreUrl ? `Open ${app.name} on the App Store` : `Open ${app.name} details`
          }
          className="group/icon shrink-0 text-center"
          {...iconTargetProps}
        >
          <div className="relative h-20 w-20 overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-soft transition group-hover/icon:-translate-y-0.5 group-hover/icon:shadow-card">
            <Image src={app.icon} alt={`${app.name} icon`} fill sizes="80px" className="object-cover" />
          </div>
          <span className="mt-2 block text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 group-hover/icon:text-slate-900 dark:text-slate-400 dark:group-hover/icon:text-slate-100">
            {hasAppStoreUrl ? "Open app" : "Details"}
          </span>
        </a>
      </div>

      <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">{app.shortDescription}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {app.features.slice(0, 3).map((feature) => (
          <span
            key={`${app.slug}-${feature}`}
            className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            {feature}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <p>{app.pricing}</p>
          <p className="mt-1">{app.minIOSVersion}</p>
        </div>
        <Link href={appDetailHref} className="text-sm font-semibold text-accent hover:underline">
          View details
        </Link>
      </div>
    </article>
  );
}
