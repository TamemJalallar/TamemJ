import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppCard } from "@/components/app-card";
import { SectionHeading } from "@/components/section-heading";
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

export const metadata: Metadata = {
  title: "Apps",
  description:
    "Browse iOS apps by Tamem J, including upcoming and published iPhone apps like HappilyEverAfter Planner.",
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
  openGraph: buildOpenGraph(
    "Apps | Tamem J",
    "Browse iOS apps by Tamem J, including upcoming and published iPhone apps like HappilyEverAfter Planner.",
    "/apps/"
  ),
  twitter: buildTwitter(
    "Apps | Tamem J",
    "Browse iOS apps by Tamem J, including upcoming and published iPhone apps like HappilyEverAfter Planner."
  )
};

export default function AppsPage() {
  if (!appsSectionEnabled) {
    notFound();
  }

  const apps = getApps();
  const hasApps = apps.length > 0;
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
            title="iPhone apps built for clarity"
            description="A growing catalog of iPhone apps designed around focused workflows, thoughtful interfaces, and practical day-to-day use."
          />

          {hasApps ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {apps.map((app) => (
                <AppCard key={app.slug} app={app} variant="full" />
              ))}
            </div>
          ) : (
            <div className="surface-card mt-8 border-dashed p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-slate-900">No apps published yet</h3>
              <p className="mt-2 text-sm sm:text-base">
                App listings will appear here once they are added to
                <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">data/apps.json</code>.
              </p>
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
