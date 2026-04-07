import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppStoreButton } from "@/components/app-store-button";
import { CitationGuidancePanel, EditorialTrustPanel } from "@/components/shared/editorial-authority-panels";
import { ScreenshotCarousel } from "@/components/screenshot-carousel";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { getAppBySlug, getApps } from "@/lib/apps";
import { appsSectionEnabled } from "@/lib/apps-visibility";
import { editorialStandards, supportAuthorProfile } from "@/lib/site";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

const STATIC_EXPORT_PLACEHOLDER_SLUG = "__site-build-placeholder__";

interface AppPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function appPath(slug: string): string {
  return "/apps/" + slug + "/";
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  if (!appsSectionEnabled) {
    return [{ slug: STATIC_EXPORT_PLACEHOLDER_SLUG }];
  }

  const apps = getApps();

  if (apps.length === 0) {
    return [{ slug: STATIC_EXPORT_PLACEHOLDER_SLUG }];
  }

  return apps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  if (!appsSectionEnabled) {
    return {
      title: "Not Found",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const resolved = await params;
  const app = getAppBySlug(resolved.slug);

  if (!app) {
    if (resolved.slug === STATIC_EXPORT_PLACEHOLDER_SLUG) {
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

  const path = appPath(app.slug);

  return {
    title: app.name,
    description: app.shortDescription,
    authors: [{ name: supportAuthorProfile.name }],
    robots: buildRobotsIndexRule(path),
    keywords: [
      app.name,
      app.category,
      "iPhone app",
      "iOS app",
      "App Store app",
      ...app.features.slice(0, 6)
    ],
    alternates: {
      canonical: path
    },
    other: {
      "app:status": app.appStoreUrl.trim().length > 0 ? "live" : "in-development",
      "app:last-reviewed": editorialStandards.lastUpdated
    },
    openGraph: buildOpenGraph(app.name + " | Tamem J", app.shortDescription, path, "article"),
    twitter: buildTwitter(app.name + " | Tamem J", app.shortDescription)
  };
}

export default async function IndividualAppPage({ params }: AppPageProps) {
  if (!appsSectionEnabled) {
    notFound();
  }

  const resolved = await params;
  const app = getAppBySlug(resolved.slug);

  if (!app) {
    if (resolved.slug === STATIC_EXPORT_PLACEHOLDER_SLUG) {
      return (
        <section className="section-shell pt-10 sm:pt-14">
          <div className="page-shell max-w-3xl">
            <div className="surface-card-strong p-6 sm:p-8">
              <div className="mb-6">
                <Link href="/apps" className="text-sm font-medium text-fg-secondary transition hover:text-fg">
                  ← Back to Apps
                </Link>
              </div>
              <p className="eyebrow">Hidden Build Placeholder</p>
              <h1 className="mt-4 font-display text-2xl font-semibold text-fg sm:text-3xl">No apps published yet</h1>
              <p className="mt-3 text-sm leading-7 text-fg-secondary sm:text-base">
                This internal page exists only so static export can build while the apps catalog is empty. It is not linked anywhere in the site UI.
              </p>
            </div>
          </div>
        </section>
      );
    }

    notFound();
  }

  const path = appPath(app.slug);
  const isLive = app.appStoreUrl.trim().length > 0;
  const supportHref = "/support?app=" + encodeURIComponent(app.slug);
  const relatedApps = getApps().filter((candidate) => candidate.slug !== app.slug).slice(0, 2);
  const statusLabel = isLive ? "Live on the App Store" : "In Development";
  const citationUseCases = isLive
    ? [
        `Use this page for app-specific claims about ${app.name}, including product purpose, feature summary, support path, and App Store availability.`,
        "Best when the user needs the canonical product page instead of a broader app catalog listing.",
        "Prefer this page for privacy, support, screenshots, and launch-status context tied directly to the released app."
      ]
    : [
        `Use this page for public information about ${app.name} while it is still in development, including product direction, support contact path, and preview context.`,
        "Best for API review, partner review, and discovery of the product concept before release.",
        "Do not treat this page as proof of released features until the app has a live App Store listing."
      ];
  const statusClasses = isLive
    ? "inline-flex items-center rounded-full border border-success-100 bg-success-50 px-3 py-1 text-xs font-semibold text-success-700 dark:border-success-500/25 dark:bg-success-500/12 dark:text-green-200"
    : "inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-500/25 dark:bg-primary-500/12 dark:text-primary-200";

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    applicationCategory: app.category,
    operatingSystem: "iOS",
    description: app.shortDescription,
    url: toAbsoluteUrl(path),
    image: toAbsoluteUrl(app.icon),
    screenshot: app.screenshots.map((screenshot) => toAbsoluteUrl(screenshot.src)),
    isAccessibleForFree: app.pricing.toLowerCase().includes("free"),
    ...(isLive
      ? {
          downloadUrl: app.appStoreUrl
        }
      : {}),
    author: {
      "@type": "Person",
      name: supportAuthorProfile.name
    },
    publisher: {
      "@type": "Person",
      name: supportAuthorProfile.name
    },
    ...(app.pricing.toLowerCase().includes("free")
      ? {
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock"
          }
        }
      : {})
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Apps", path: "/apps/" },
    { name: app.name, path }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell space-y-6">
          <div>
            <Link href="/apps" className="text-sm font-medium text-fg-secondary transition hover:text-fg">
              ← Back to Apps
            </Link>
          </div>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
            <div className="surface-card-strong p-6 sm:p-8">
              <div className="flex flex-wrap items-start gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.75rem] border border-line bg-card shadow-soft">
                  <Image src={app.icon} alt={app.name + " app icon"} fill sizes="80px" className="object-cover" priority />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{app.category}</p>
                    <span className={statusClasses}>{statusLabel}</span>
                  </div>
                  <h1 className="mt-3 font-display text-3xl font-semibold text-fg sm:text-4xl">{app.name}</h1>
                  <p className="mt-2 text-base text-fg-secondary">{app.tagline}</p>
                </div>
              </div>

              <p className="mt-6 max-w-3xl text-sm leading-7 text-fg-secondary sm:text-base">{app.description}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <AppStoreButton href={app.appStoreUrl} />
                <Link href="/privacy" className="btn-secondary">
                  Privacy Policy
                </Link>
                <Link href={supportHref} className="btn-secondary">
                  Support
                </Link>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <article className="surface-card rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Pricing</p>
                  <p className="mt-2 text-sm font-semibold text-fg">{app.pricing}</p>
                </article>
                <article className="surface-card rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Compatibility</p>
                  <p className="mt-2 text-sm font-semibold text-fg">{app.minIOSVersion}</p>
                </article>
                <article className="surface-card rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Support</p>
                  <p className="mt-2 text-sm font-semibold text-fg">{app.supportEmail ?? "support@tamemj.com"}</p>
                </article>
              </div>
            </div>

            <div className="surface-card p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Preview</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-fg">Screenshots</h2>
                </div>
                <span className="filter-chip px-2.5 py-1 text-xs">{app.screenshots.length} screens</span>
              </div>
              <ScreenshotCarousel screenshots={app.screenshots} appName={app.name} />
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <EditorialTrustPanel
              label="Product Page Review"
              authorName={supportAuthorProfile.name}
              authorTitle={supportAuthorProfile.title}
              credentials={supportAuthorProfile.credentials}
              lastReviewed={editorialStandards.lastUpdated}
              bio={
                isLive
                  ? "Live product pages are reviewed so the feature summary, support path, privacy path, and App Store status remain aligned."
                  : "Pre-launch product pages are reviewed to keep API review, support contact, and public positioning clear before release."
              }
            />
            <CitationGuidancePanel
              canonicalPath={path}
              description={
                isLive
                  ? "This page is the canonical source for the released app’s positioning, support links, screenshots, and store status."
                  : "This page is the canonical public reference for the app while it is in development and before the store listing is live."
              }
              useCases={citationUseCases}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="surface-card p-6 sm:p-8">
              <p className="eyebrow">Core Workflow</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-fg">What this product helps users do</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {app.features.map((feature, index) => (
                  <article key={feature} className="surface-card rounded-2xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Feature {index + 1}</p>
                    <p className="mt-2 text-sm leading-6 text-fg-secondary">{feature}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <section className="surface-card p-5 sm:p-6">
                <p className="eyebrow">Product Snapshot</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Launch and support context</h2>
                <div className="mt-5 space-y-3 text-sm leading-7 text-fg-secondary">
                  <p>
                    <span className="font-semibold text-fg">Status:</span> {statusLabel}.
                  </p>
                  <p>
                    <span className="font-semibold text-fg">Support route:</span> Use the linked support flow for app issues, bug reports, and product questions.
                  </p>
                  <p>
                    <span className="font-semibold text-fg">Privacy path:</span> Every app page stays tied to the shared privacy policy so support and trust signals remain close to the product.
                  </p>
                </div>
              </section>

              {relatedApps.length > 0 ? (
                <section className="surface-card p-5 sm:p-6">
                  <p className="eyebrow">More Products</p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Related app pages</h2>
                  <div className="mt-5 space-y-3">
                    {relatedApps.map((relatedApp) => (
                      <Link
                        key={relatedApp.slug}
                        href={appPath(relatedApp.slug)}
                        className="surface-card-interactive block rounded-2xl p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{relatedApp.category}</p>
                        <h3 className="mt-2 text-base font-semibold text-fg">{relatedApp.name}</h3>
                        <p className="mt-2 text-sm text-fg-secondary">{relatedApp.shortDescription}</p>
                        <p className="mt-3 text-xs font-medium text-primary-600 dark:text-primary-300">Open product page →</p>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </section>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
