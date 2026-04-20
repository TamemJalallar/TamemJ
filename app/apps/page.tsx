import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppsCatalogBrowser } from "@/components/apps/apps-catalog-browser";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { getApps, isPublishedApp } from "@/lib/apps";
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
const topAppKeywords = seoApps.slice(0, 12).flatMap((app) => [app.name, `${app.name} product`]);
const hasSeoApps = seoApps.length > 0;
const publishedSeoApps = seoApps.filter(isPublishedApp).length;
const upcomingSeoApps = seoApps.length - publishedSeoApps;
const seoDescription = hasSeoApps
  ? `Browse ${seoApps.length} apps and products by Tamem J, including ${seoApps
      .slice(0, 3)
      .map((app) => app.name)
      .join(", ")}${upcomingSeoApps > 0 ? ", with published and upcoming releases" : ""}.`
  : "Browse apps and products by Tamem J. New releases are in progress.";

export const metadata: Metadata = {
  title: "Apps",
  description: seoDescription,
  keywords: uniqueKeywords([
    "iOS apps",
    "developer products",
    "software products",
    "OBS tools",
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
  const categoryCount = new Set(apps.map((app) => app.category)).size;
  const publishedCount = apps.filter(isPublishedApp).length;
  const appsCollectionSchema = buildCollectionPageJsonLd(
    "Apps and Products by Tamem J",
    "Browse apps and technical products by Tamem J, including App Store releases and published developer tools.",
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
                  Apps and products by Tamem J.
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-primary-100/90 sm:text-base">
                  Browse the full product catalog, including App Store releases, open-source tools, and in-development products with screenshots, support links, and clear status labels.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#app-catalog" className="btn-primary">
                    Browse Catalog
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
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Total Products</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{apps.length}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Product pages currently in the catalog</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Published Products</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{publishedCount}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Released apps and tools available now</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Categories</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{categoryCount}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Distinct product lanes represented so far</p>
                </article>
              </div>
            </div>
          </section>

          {hasApps ? (
            <AppsCatalogBrowser apps={apps} />
          ) : (
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="surface-card-strong border-dashed p-6 sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
                  First app launch is on deck
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-fg-secondary sm:text-base">
                  The product catalog shell is already in place. As soon as the first release goes live, this page will switch from launch prep to a real product index with support and privacy paths built in.
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
                    <span>Clear product pages for released apps and developer tools.</span>
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
