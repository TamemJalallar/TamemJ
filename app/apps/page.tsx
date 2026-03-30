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
const seoDescription = hasSeoApps
  ? `Browse ${seoApps.length} iOS app${seoApps.length === 1 ? "" : "s"} by Tamem J, including ${seoApps
      .slice(0, 3)
      .map((app) => app.name)
      .join(", ")}.`
  : "Browse iOS apps by Tamem J. New releases are in progress.";

export const metadata: Metadata = {
  title: "Apps",
  description: seoDescription,
  keywords: uniqueKeywords([
    "iOS apps",
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
  const featuredApp = apps.find((app) => app.featured) ?? apps[0];
  const remainingApps = apps.filter((app) => app.slug !== featuredApp?.slug);
  const appsCollectionSchema = buildCollectionPageJsonLd(
    "iOS Apps by Tamem J",
    "Browse iOS apps by Tamem J, including upcoming and published iPhone apps.",
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
            title={hasApps ? "Published iPhone apps built for clarity" : "New iPhone apps are on the way"}
            description={
              hasApps
                ? "Published apps, screenshots, support paths, and App Store links are listed below."
                : "This page is ready for launch. Published apps will appear here as they go live."
            }
          />

          {hasApps ? (
            <div className="mt-8 space-y-8">
              {featuredApp ? (
                <section className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      Featured App
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/privacy" className="btn-secondary !px-4 !py-2 text-xs">
                        Privacy Policy
                      </Link>
                      <Link href={`/support?app=${encodeURIComponent(featuredApp.slug)}`} className="btn-secondary !px-4 !py-2 text-xs">
                        App Support
                      </Link>
                    </div>
                  </div>
                  <AppCard app={featuredApp} variant="featured" />
                </section>
              ) : null}

              {remainingApps.length > 0 ? (
                <section>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      App Library
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      {apps.length} published
                    </p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {remainingApps.map((app) => (
                      <AppCard key={app.slug} app={app} variant="full" />
                    ))}
                  </div>
                </section>
              ) : (
                <section className="surface-card p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    More apps can be added here anytime
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    The site is already wired to render additional apps from the shared apps data file as soon as you add their metadata, screenshots, and App Store links.
                  </p>
                </section>
              )}
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
