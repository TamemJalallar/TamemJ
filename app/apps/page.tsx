import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppCard } from "@/components/app-card";
import { EditorialStandardsStrip } from "@/components/shared/editorial-authority-panels";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { getApps } from "@/lib/apps";
import { appsSectionEnabled } from "@/lib/apps-visibility";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOpenGraph,
  buildTwitter
} from "@/lib/seo";

function uniqueKeywords(keywords: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const keyword of keywords) {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(keyword.trim());
  }

  return result;
}

const seoApps = getApps();
const topCategories = [...new Set(seoApps.map((app) => app.category))].slice(0, 8);
const topAppKeywords = seoApps.slice(0, 12).map((app) => `${app.name} app`);
const hasSeoApps = seoApps.length > 0;
const liveSeoApps = seoApps.filter((app) => app.appStoreUrl.trim().length > 0).length;
const upcomingSeoApps = seoApps.length - liveSeoApps;
const seoDescription = hasSeoApps
  ? `Browse ${seoApps.length} Apple app${seoApps.length === 1 ? "" : "s"} by Tamem J, including ${seoApps
      .slice(0, 3)
      .map((app) => app.name)
      .join(", ")}${upcomingSeoApps > 0 ? ", with live and upcoming releases" : ""}.`
  : "Browse Apple apps by Tamem J. New releases are in progress.";

export const metadata: Metadata = {
  title: "Apps",
  description: seoDescription,
  keywords: uniqueKeywords([
    "iOS apps",
    "macOS apps",
    "watchOS apps",
    "iPhone apps",
    "app portfolio",
    "App Store apps",
    "mobile apps by Tamem J",
    ...topCategories.map((category) => `${category} app`),
    ...topAppKeywords
  ]),
  alternates: {
    canonical: "/apps/"
  },
  robots: buildRobotsIndexRule("/apps/"),
  openGraph: buildOpenGraph("Apps | Tamem J", seoDescription, "/apps/"),
  twitter: buildTwitter("Apps | Tamem J", seoDescription)
};

export default function AppsPage() {
  if (!appsSectionEnabled) {
    notFound();
  }

  const apps = getApps();
  const hasApps = apps.length > 0;
  const liveApps = apps.filter((app) => app.appStoreUrl.trim().length > 0);
  const upcomingApps = apps.filter((app) => app.appStoreUrl.trim().length === 0);
  const categoryCount = new Set(apps.map((app) => app.category)).size;
  const appsCollectionSchema = buildCollectionPageJsonLd(
    "Apple Apps by Tamem J",
    "Browse Apple platform apps by Tamem J, including live releases and coming-soon launches.",
    "/apps/",
    apps.map((app) => ({
      name: app.name,
      path: `/apps/${app.slug}/`
    }))
  );
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Apps", path: "/apps/" }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell space-y-6">
          <section className="hero-surface p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-16 top-0 h-52 w-52 rounded-full bg-primary-300/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-accent-400/10 blur-3xl" />
            <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
              <div>
                <p className="eyebrow text-primary-100">Apps</p>
                <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Product pages built like real launch surfaces, not placeholder portfolio tiles.
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-primary-100/90 sm:text-base">
                  This section is now positioned as a product catalog. Live apps get full support and privacy paths,
                  while in-development products still have a clear landing page for API approvals, previews, and launch status.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#app-catalog" className="btn-primary">
                    Browse Apps
                  </a>
                  <Link href="/support" className="btn-secondary">
                    App Support
                  </Link>
                  <Link href="/privacy" className="btn-ghost !text-white hover:!bg-white/10 hover:!text-white">
                    Privacy Policy
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Total Apps</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{apps.length}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Product pages currently in the catalog</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Live Releases</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{liveApps.length}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Apps already available on the App Store</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">In Development</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{upcomingApps.length}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Product pages ready before launch</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Categories</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{categoryCount}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Distinct product lanes represented so far</p>
                </article>
              </div>
            </div>
          </section>

          <EditorialStandardsStrip description="App pages are treated as product reference pages, not just portfolio entries. Each page is reviewed so launch status, screenshots, privacy links, support paths, and product positioning stay aligned for users, store reviewers, and AI systems." />

          {hasApps ? (
            <>
              <section className="grid gap-4 lg:grid-cols-3">
                <article className="surface-card-interactive p-5 sm:p-6">
                  <p className="eyebrow">Launch-ready pages</p>
                  <h2 className="mt-3 font-display text-xl font-semibold text-fg">Every app gets a complete support surface</h2>
                  <p className="mt-3 text-sm leading-7 text-fg-secondary">
                    Product pages now tie together screenshots, privacy, support paths, and launch state so the catalog reads like a real software surface instead of a placeholder portfolio.
                  </p>
                </article>
                <article className="surface-card-interactive p-5 sm:p-6">
                  <p className="eyebrow">Live and upcoming</p>
                  <h2 className="mt-3 font-display text-xl font-semibold text-fg">Published apps and in-progress products can coexist cleanly</h2>
                  <p className="mt-3 text-sm leading-7 text-fg-secondary">
                    Live releases drive the primary product story, while in-development pages still help with API reviews, waitlist-style previews, and product positioning.
                  </p>
                </article>
                <article className="surface-card-interactive p-5 sm:p-6">
                  <p className="eyebrow">Support continuity</p>
                  <h2 className="mt-3 font-display text-xl font-semibold text-fg">Privacy and contact links stay close to the product</h2>
                  <p className="mt-3 text-sm leading-7 text-fg-secondary">
                    That makes each app easier to trust and easier to review, especially when people land on a product page directly from search or the App Store.
                  </p>
                </article>
              </section>

              {liveApps.length > 0 ? (
                <section className="space-y-4" id="app-catalog">
                  <div className="flex flex-col gap-2">
                    <p className="eyebrow">Live on the App Store</p>
                    <h2 className="font-display text-2xl font-semibold text-fg">Published products</h2>
                    <p className="max-w-3xl text-sm leading-7 text-fg-secondary">
                      These apps are live and should read like finished product pages, with support and privacy available right away.
                    </p>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {liveApps.map((app) => (
                      <AppCard key={app.slug} app={app} />
                    ))}
                  </div>
                </section>
              ) : null}

              {upcomingApps.length > 0 ? (
                <section className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <p className="eyebrow">In Development</p>
                    <h2 className="font-display text-2xl font-semibold text-fg">Upcoming products</h2>
                    <p className="max-w-3xl text-sm leading-7 text-fg-secondary">
                      These pages still matter even before launch. They give each product a real home for roadmap context, external review, and later App Store handoff.
                    </p>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {upcomingApps.map((app) => (
                      <AppCard key={app.slug} app={app} />
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="surface-card p-5 sm:p-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="eyebrow">All Product Pages</p>
                    <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Full app catalog</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-fg-secondary">
                      The featured and live groupings above help with pacing, while this grid remains the simple full catalog view.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/privacy" className="btn-secondary !px-4 !py-2 text-xs">
                      Privacy Policy
                    </Link>
                    <Link href="/support" className="btn-secondary !px-4 !py-2 text-xs">
                      App Support
                    </Link>
                  </div>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {apps.map((app) => (
                    <AppCard key={`catalog-${app.slug}`} app={app} />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="surface-card-strong border-dashed p-6 sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
                  First app launch is on deck
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-fg-secondary sm:text-base">
                  The product catalog shell is already in place. As soon as the first App Store release goes live,
                  this page will switch from launch prep to a real product index with support and privacy paths built in.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/contact" className="btn-primary">
                    Contact
                  </Link>
                  <Link href="/privacy" className="btn-secondary">
                    Privacy Policy
                  </Link>
                </div>
              </div>

              <div className="surface-card p-6 sm:p-8">
                <h3 className="font-display text-xl font-semibold text-fg">What this section is designed for</h3>
                <ul className="mt-4 space-y-3 text-sm text-fg-secondary sm:text-base">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent-500" />
                    <span>Clear product pages for live App Store launches.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent-500" />
                    <span>Preview pages for products still in development.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent-500" />
                    <span>Support and privacy links that stay close to each product.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appsCollectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
