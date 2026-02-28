import type { Metadata } from "next";
import { AppCard } from "@/components/app-card";
import { SectionHeading } from "@/components/section-heading";
import { getApps } from "@/lib/apps";
import { buildCollectionPageJsonLd, buildOpenGraph, buildTwitter } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Apps",
  description:
    "Browse iOS apps by Tamem J, including upcoming and published iPhone apps.",
  keywords: [
    "iOS apps",
    "iPhone apps",
    "app portfolio",
    "App Store apps",
    "mobile apps by Tamem J"
  ],
  alternates: {
    canonical: "/apps/"
  },
  openGraph: buildOpenGraph(
    "Apps | Tamem J",
    "Browse iOS apps by Tamem J, including upcoming and published iPhone apps.",
    "/apps/"
  ),
  twitter: buildTwitter(
    "Apps | Tamem J",
    "Browse iOS apps by Tamem J, including upcoming and published iPhone apps."
  )
};

export default function AppsPage() {
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

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Apps"
            title="iPhone apps built for clarity"
            description="All apps are listed below. Add a new app by updating the JSON file in /data/apps.json."
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
    </>
  );
}
