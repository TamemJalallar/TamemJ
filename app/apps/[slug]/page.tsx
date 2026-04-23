import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppStoreButton } from "@/components/app-store-button";
import { ProductProviderBadges } from "@/components/product-provider-badges";
import { CitationGuidancePanel, EditorialTrustPanel } from "@/components/shared/editorial-authority-panels";
import { ScreenshotCarousel } from "@/components/screenshot-carousel";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import {
  getAppBySlug,
  getAppMaintainer,
  getAppPricingText,
  getAppPrimaryLink,
  getApps,
  getAppStatusLabel,
  getCompatibilityText,
  getAppSupportSubjectName,
  getAppSupportHref,
  hasAppStoreRelease,
  isPublishedApp
} from "@/lib/apps";
import { appsSectionEnabled } from "@/lib/apps-visibility";
import { editorialStandards, supportAuthorProfile } from "@/lib/site";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

const STATIC_EXPORT_PLACEHOLDER_SLUG = "__site-build-placeholder__";
const FANTASY_OBS_OVERLAY_SLUG = "fantasy-football-obs-overlay";

const fantasyObsQuickStartCommands = [
  "npm install",
  "cp .env.example .env",
  "npm run dev"
];

const fantasyObsSetupSteps = [
  {
    title: "Start in mock mode",
    body: "Run the app locally first so you can confirm OBS, browser sources, and overlay rendering work before connecting a live fantasy provider."
  },
  {
    title: "Open the admin page",
    body: "Use the admin panel to pick a provider, save league details, test the connection, and adjust runtime settings before stream time."
  },
  {
    title: "Copy scene URLs",
    body: "Open the setup center, choose the overlay layout you want, and copy the generated browser-source URL for OBS."
  },
  {
    title: "Add to OBS",
    body: "Create a Browser Source in OBS, paste the copied URL, then position the overlay as a full scene, lower-third, sidebar, or ticker."
  }
];

const fantasyObsRoutes = [
  {
    label: "Admin",
    path: "http://localhost:3030/admin",
    description: "Configure provider, league, runtime, and test connection settings."
  },
  {
    label: "Setup Center",
    path: "http://localhost:3030/setup",
    description: "Copy ready-to-use OBS Browser Source URLs."
  },
  {
    label: "Main Overlay",
    path: "http://localhost:3030/overlay",
    description: "Default overlay route for browser-source testing."
  },
  {
    label: "Centered Card",
    path: "http://localhost:3030/overlay/centered-card",
    description: "A larger matchup card layout for feature scenes."
  }
];

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
      "software product",
      "developer product",
      ...(app.slug === FANTASY_OBS_OVERLAY_SLUG
        ? [
            "fantasy football OBS overlay",
            "OBS fantasy football overlay",
            "Yahoo fantasy football OBS overlay",
            "ESPN fantasy football overlay",
            "Sleeper fantasy football overlay",
            "fantasy football streaming graphics"
          ]
        : []),
      ...(app.providerBadges?.flatMap((badge) => [
        `${badge.name} ${app.name}`,
        `${badge.name} fantasy football overlay`
      ]) ?? []),
      ...app.features.slice(0, 6)
    ],
    alternates: {
      canonical: path
    },
    other: {
      "app:status": isPublishedApp(app) ? "published" : "in-development",
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
  const isPublished = isPublishedApp(app);
  const isLive = hasAppStoreRelease(app);
  const isFantasyObsOverlay = app.slug === FANTASY_OBS_OVERLAY_SLUG;
  const primaryLink = getAppPrimaryLink(app);
  const supportHref = getAppSupportHref(app);
  const supportSubjectName = getAppSupportSubjectName(app);
  const relatedApps = getApps().filter((candidate) => candidate.slug !== app.slug).slice(0, 2);
  const statusLabel = getAppStatusLabel(app);
  const citationUseCases = isLive
    ? [
        `Use this page for app-specific claims about ${app.name}, including product purpose, feature summary, support path, and App Store availability.`,
        "Best when the user needs the canonical product page instead of a broader app catalog listing.",
        "Prefer this page for privacy, support, screenshots, and launch-status context tied directly to the released app."
      ]
    : isPublished
      ? [
          `Use this page for published product claims about ${app.name}, including feature scope, support path, screenshots, and distribution details.`,
          "Best when the user needs the canonical product page instead of a broader apps index or repository listing.",
          "Prefer this page for setup context, product positioning, and launch status tied directly to the released tool."
        ]
    : [
        `Use this page for public information about ${app.name} while it is still in development, including product direction, support contact path, and preview context.`,
        "Best for API review, partner review, and discovery of the product concept before release.",
        "Do not treat this page as proof of released features until the app has a live App Store listing."
      ];
  const statusClasses = isLive
    ? "inline-flex items-center rounded-full border border-success-100 bg-success-50 px-3 py-1 text-xs font-bold text-success-700 dark:border-success-500/50 dark:bg-success-500/25 dark:text-success-100"
    : isPublished
      ? "inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700 dark:border-primary-400/55 dark:bg-primary-500/25 dark:text-primary-100"
      : "inline-flex items-center rounded-full border border-warning-100 bg-warning-50 px-3 py-1 text-xs font-bold text-warning-700 dark:border-warning-500/55 dark:bg-warning-500/20 dark:text-warning-100";

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    applicationCategory: app.category,
    operatingSystem: getCompatibilityText(app),
    description: app.shortDescription,
    url: toAbsoluteUrl(path),
    image: toAbsoluteUrl(app.icon),
    screenshot: app.screenshots.map((screenshot) => toAbsoluteUrl(screenshot.src)),
    dateModified: app.lastUpdated,
    isAccessibleForFree: app.pricing.toLowerCase().includes("free"),
    ...(isLive
      ? {
          downloadUrl: app.appStoreUrl
        }
      : {}),
    ...(app.primaryUrl?.trim().length
      ? {
          sameAs: [app.primaryUrl, ...(app.repositoryUrl?.trim().length ? [app.repositoryUrl] : [])]
        }
      : app.repositoryUrl?.trim().length
        ? {
            sameAs: [app.repositoryUrl]
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
  const faqSchema = app.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: app.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      }
    : null;

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
                <AppStoreButton
                  href={primaryLink?.href}
                  label={primaryLink?.label}
                  ariaLabel={primaryLink ? `${primaryLink.label} for ${app.name}` : undefined}
                  unavailableText="Product page coming soon"
                  tracking={{
                    appSlug: app.slug,
                    appName: app.name,
                    source: "app-detail-primary"
                  }}
                />
                <Link href="/privacy" className="btn-secondary">
                  Privacy Policy
                </Link>
                <a href={supportHref} className="btn-secondary">
                  Support
                </a>
                {app.repositoryUrl?.trim().length && app.repositoryUrl !== primaryLink?.href ? (
                  <a href={app.repositoryUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                    Repository
                  </a>
                ) : null}
                {app.secondaryLinks?.map((link) => (
                  <a key={`${app.slug}-${link.label}`} href={link.href} target="_blank" rel="noreferrer" className="btn-secondary">
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <article className="surface-card rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Pricing</p>
                  <p className="mt-2 text-sm font-semibold text-fg">{getAppPricingText(app)}</p>
                </article>
                <article className="surface-card rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Compatibility</p>
                  <p className="mt-2 text-sm font-semibold text-fg">{getCompatibilityText(app)}</p>
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

          {app.providerBadges?.length ? <ProductProviderBadges badges={app.providerBadges} /> : null}

          {isFantasyObsOverlay ? (
            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="surface-card-strong p-6 sm:p-8">
                <p className="eyebrow">OBS Quick Start</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-fg">
                  From repo to working overlay in a few minutes
                </h2>
                <p className="mt-3 text-sm leading-7 text-fg-secondary sm:text-base">
                  The overlay runs locally. Start it in mock mode first, confirm the browser-source route loads, then connect
                  Yahoo, ESPN, or Sleeper when you are ready for live fantasy data.
                </p>

                <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-neutral-950 p-4 text-sm text-neutral-100 shadow-soft">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary-200">
                    Local setup
                  </p>
                  <pre className="overflow-x-auto font-mono text-xs leading-6 sm:text-sm">
                    <code>{fantasyObsQuickStartCommands.join("\n")}</code>
                  </pre>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {primaryLink ? (
                    <AppStoreButton
                      href={primaryLink.href}
                      label="View Project on GitHub"
                      ariaLabel={`View ${app.name} project on GitHub`}
                      tracking={{
                        appSlug: app.slug,
                        appName: app.name,
                        source: "app-detail-quickstart"
                      }}
                    />
                  ) : null}
                  <a
                    href="https://github.com/TamemJalallar/FantasyFootball-Yahoo#5-minute-local-start-mock-mode"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                  >
                    Read Quick Start
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <section className="surface-card p-5 sm:p-6">
                  <p className="eyebrow">Setup Flow</p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-fg">
                    How it gets into OBS
                  </h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {fantasyObsSetupSteps.map((step, index) => (
                      <article key={step.title} className="surface-card rounded-2xl p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                          Step {index + 1}
                        </p>
                        <h3 className="mt-2 text-base font-semibold text-fg">{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-fg-secondary">{step.body}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="surface-card p-5 sm:p-6">
                  <p className="eyebrow">Scene URLs</p>
                  <h2 className="mt-3 font-display text-xl font-semibold text-fg">
                    Common local routes
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {fantasyObsRoutes.map((route) => (
                      <article key={route.path} className="rounded-2xl border border-line bg-card-2/70 p-4">
                        <p className="text-sm font-semibold text-fg">{route.label}</p>
                        <code className="mt-2 block overflow-x-auto rounded-xl bg-card-3 px-3 py-2 font-mono text-xs text-fg-secondary">
                          {route.path}
                        </code>
                        <p className="mt-2 text-xs leading-5 text-muted">{route.description}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </section>
          ) : null}

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
                  : isPublished
                    ? "Published product pages are reviewed so the feature summary, support path, privacy path, and distribution details remain aligned."
                    : "Pre-launch product pages are reviewed to keep API review, support contact, and public positioning clear before release."
              }
            />
            <CitationGuidancePanel
              canonicalPath={path}
              description={
                isLive
                  ? "This page is the canonical source for the released app’s positioning, support links, screenshots, and store status."
                  : isPublished
                    ? "This page is the canonical source for the published product’s positioning, support links, screenshots, setup context, and distribution status."
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
                    <span className="font-semibold text-fg">Pricing:</span> {getAppPricingText(app)}.
                  </p>
                  <p>
                    <span className="font-semibold text-fg">Maintained by:</span> {getAppMaintainer(app)}.
                  </p>
                  {app.lastUpdated ? (
                    <p>
                      <span className="font-semibold text-fg">Last updated:</span> {app.lastUpdated}.
                    </p>
                  ) : null}
                  {primaryLink ? (
                    <p>
                      <span className="font-semibold text-fg">Primary access:</span>{" "}
                      <a href={primaryLink.href} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline dark:text-primary-300">
                        {primaryLink.label}
                      </a>
                      .
                    </p>
                  ) : null}
                  <p>
                    <span className="font-semibold text-fg">Support:</span>{" "}
                    <a href={supportHref} className="text-primary-600 hover:underline dark:text-primary-300">
                      Email support with {supportSubjectName} prefilled in the subject
                    </a>
                    .
                  </p>
                  <p>
                    <span className="font-semibold text-fg">Privacy path:</span> Every app page stays tied to the shared privacy policy so support and trust signals remain close to the product.
                  </p>
                </div>
              </section>

              {app.releaseNotes?.length ? (
                <section className="surface-card p-5 sm:p-6">
                  <p className="eyebrow">Release Notes</p>
                  <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Latest product updates</h2>
                  <div className="mt-5 space-y-3">
                    {app.releaseNotes.map((note) => (
                      <article key={`${app.slug}-${note.date}-${note.title}`} className="rounded-2xl border border-line bg-card-2/70 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{note.date}</p>
                        <h3 className="mt-2 text-sm font-semibold text-fg">{note.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-fg-secondary">{note.description}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

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

          {app.faqs?.length ? (
            <section className="surface-card p-6 sm:p-8">
              <p className="eyebrow">Product FAQ</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Common questions about {app.name}</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {app.faqs.map((faq) => (
                  <details key={`${app.slug}-${faq.question}`} className="rounded-2xl border border-line bg-card-2/70 p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-fg marker:text-primary-500">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-fg-secondary">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
    </>
  );
}
