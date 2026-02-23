import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppStoreButton } from "@/components/app-store-button";
import { ScreenshotCarousel } from "@/components/screenshot-carousel";
import { getAppBySlug, getApps } from "@/lib/apps";
import { siteConfig } from "@/lib/site";

const STATIC_EXPORT_PLACEHOLDER_SLUG = "__site-build-placeholder__";

interface AppPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const apps = getApps();

  if (apps.length === 0) {
    return [{ slug: STATIC_EXPORT_PLACEHOLDER_SLUG }];
  }

  return apps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) {
    if (slug === STATIC_EXPORT_PLACEHOLDER_SLUG) {
      return {
        title: "App Coming Soon",
        description: "Placeholder page used for static export while no apps are published yet.",
        robots: {
          index: false,
          follow: false
        }
      };
    }

    return {
      title: "App Not Found"
    };
  }

  return {
    title: app.name,
    description: app.shortDescription,
    alternates: {
      canonical: `/apps/${app.slug}/`
    },
    openGraph: {
      title: `${app.name} | Tamem J`,
      description: app.shortDescription,
      url: `${siteConfig.url}/apps/${app.slug}/`,
      images: [
        {
          url: app.screenshots[0]?.src ?? "/images/site/og-image.svg",
          alt: `${app.name} screenshot`
        }
      ]
    }
  };
}

export default async function IndividualAppPage({ params }: AppPageProps) {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) {
    if (slug === STATIC_EXPORT_PLACEHOLDER_SLUG) {
      return (
        <section className="section-shell pt-10 sm:pt-14">
          <div className="page-shell max-w-3xl">
            <div className="surface-card-strong p-6 sm:p-8">
              <div className="mb-6">
                <Link
                  href="/apps"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  ← Back to Apps
                </Link>
              </div>
              <p className="eyebrow">Hidden Build Placeholder</p>
              <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">No apps published yet</h1>
              <p className="mt-3 text-sm sm:text-base">
                This internal page exists only so static export can build while the apps catalog is
                empty. It is not linked anywhere in the site UI.
              </p>
            </div>
          </div>
        </section>
      );
    }

    notFound();
  }

  return (
    <section className="section-shell pt-10 sm:pt-14">
      <div className="page-shell">
        <div className="mb-6">
          <Link href="/apps" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Back to Apps
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div className="space-y-6">
            <div className="surface-card-strong p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-line bg-white">
                  <Image
                    src={app.icon}
                    alt={`${app.name} app icon`}
                    fill
                    sizes="64px"
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{app.category}</p>
                  <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{app.name}</h1>
                  <p className="mt-2 text-sm text-slate-600 sm:text-base">{app.tagline}</p>
                </div>
              </div>

              <p className="mt-6 text-sm sm:text-base">{app.description}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <AppStoreButton href={app.appStoreUrl} />
                <Link href="/privacy" className="btn-secondary">
                  Privacy Policy
                </Link>
                <Link href={`/support?app=${encodeURIComponent(app.slug)}`} className="btn-secondary">
                  Support
                </Link>
              </div>

              <dl className="mt-6 grid gap-4 rounded-xl border border-line bg-slate-50 p-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-900">Pricing</dt>
                  <dd className="mt-1 text-slate-600">{app.pricing}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Compatibility</dt>
                  <dd className="mt-1 text-slate-600">{app.minIOSVersion}</dd>
                </div>
              </dl>
            </div>

            <div className="surface-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold sm:text-xl">Features</h2>
              <ul className="mt-4 space-y-3">
                {app.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm sm:text-base">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="surface-card p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold sm:text-xl">Screenshots</h2>
              <span className="text-xs uppercase tracking-[0.14em] text-slate-500">
                Mobile Preview
              </span>
            </div>
            <ScreenshotCarousel screenshots={app.screenshots} appName={app.name} />
          </div>
        </div>
      </div>
    </section>
  );
}
