import Image from "next/image";
import Link from "next/link";
import { AppStoreButton } from "@/components/app-store-button";
import type { IOSApp } from "@/types/app";

interface AppCardProps {
  app: IOSApp;
  variant: "featured" | "full";
}

export function AppCard({ app, variant }: AppCardProps) {
  return (
    <article className="surface-card-strong overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card">
      {variant === "featured" ? (
        <div className="relative aspect-[16/9] border-b border-line bg-slate-100">
          <Image
            src={app.screenshots[0]?.src ?? app.icon}
            alt={app.screenshots[0]?.alt ?? `${app.name} screenshot`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-line bg-white">
            <Image src={app.icon} alt={`${app.name} icon`} fill sizes="56px" className="object-cover" />
          </div>

          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{app.category}</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{app.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{app.tagline}</p>
          </div>
        </div>

        <p className="mt-4 text-sm">{app.shortDescription}</p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href={`/apps/${app.slug}`} className="btn-secondary">
            {variant === "featured" ? "Learn More" : "Learn More"}
          </Link>
          <AppStoreButton href={app.appStoreUrl} />
        </div>
      </div>
    </article>
  );
}
