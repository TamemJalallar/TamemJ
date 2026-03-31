import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppCard } from "@/components/app-card";
import { SectionHeading } from "@/components/section-heading";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { getApps } from "@/lib/apps";
import { appsSectionEnabled } from "@/lib/apps-visibility";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildOpenGraph, buildTwitter } from "@/lib/seo";

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
  openGraph: buildOpenGraph(
    "Apps | Tamem J",
    seoDescription,
    "/apps/"
  ),
  twitter: buildTwitter(
    "Apps | Tamem J",
    seoDescription
  )
};

export default function AppsPage() {
  if (!appsSectionEnabled) {
    notFound();
  }

  const apps = getApps();
  const hasApps = apps.length > 0;
  const liveApps = apps.filter((app) => app.appStoreUrl.trim().length > 0).length;
  const upcomingApps = apps.length - liveApps;
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
        <div className="page-shell">
          <SectionHeading
            eyebrow="Apps"
            title={hasApps ? "Apple apps built for real-world workflows" : "New Apple apps are on the way"}
            description={
              hasApps
                ? "Live App Store releases and coming-soon apps are listed here with screenshots, support paths, and launch status."
                : "This page is ready for launch. New apps will appear here as they move toward release."
            }
          />

          {hasApps ? (
            <div className="mt-8 space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Apps</h3>
                  <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                    Each tile links to the app detail page, and the app icon opens the live App
                    Store listing when one is available or the app details when it is still in
                    progress.
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

              <section>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    {apps.length} total · {liveApps} live · {upcomingApps} coming soon
                  </p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {apps.map((app) => (
                    <AppCard key={app.slug} app={app} />
                  ))}
                </div>
              </section>

              {apps.length < 3 ? (
                <section className="surface-card p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    More apps can be added here anytime
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    The layout is already set up for a wider apps grid, so new launches will drop
                    straight into place as soon as you add their metadata and launch links.
                  </p>
                </section>
              ) : null}
            </div>
          ) : (
            <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="surface-card-strong border-dashed p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                  First app launching soon
                </h3>
                <p className="mt-3 text-sm sm:text-base">
                  I&apos;m currently building and polishing the first release. Once it&apos;s live on
                  the App Store, it will appear here with screenshots, features, support, and
                  privacy details.
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
                <h4 className="text-base font-semibold text-slate-900 sm:text-lg">What to expect</h4>
                <ul className="mt-4 space-y-3 text-sm sm:text-base">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <span>Clean, focused iOS product experiences.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <span>Fast updates, clear release notes, and support.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <span>Transparent privacy practices for each app.</span>
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
