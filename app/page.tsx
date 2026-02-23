import type { Metadata } from "next";
import Link from "next/link";
import { AppCard } from "@/components/app-card";
import { SectionHeading } from "@/components/section-heading";
import { getFeaturedApps } from "@/lib/apps";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  description: siteConfig.description,
  alternates: {
    canonical: "/"
  }
};

export default function HomePage() {
  const featuredApps = getFeaturedApps();
  const hasFeaturedApps = featuredApps.length > 0;

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14 lg:pt-20">
        <div className="page-shell">
          <div className="surface-card-strong overflow-hidden p-6 sm:p-8 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="eyebrow">Independent iOS Developer</span>
                <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                  {siteConfig.name}
                </h1>
                <p className="mt-4 text-balance text-lg text-slate-700 sm:text-xl">
                  {siteConfig.tagline}
                </p>
                <p className="mt-6 max-w-xl text-base sm:text-lg">
                  Clean, focused iPhone apps built with a strong emphasis on usability,
                  performance, and thoughtful interface design.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/apps" className="btn-primary">
                    View My Apps
                  </Link>
                  <Link href="/support" className="btn-secondary">
                    App Support
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {hasFeaturedApps ? (
                  <>
                    {featuredApps.slice(0, 2).map((app) => (
                      <div
                        key={app.slug}
                        className="surface-card p-4 transition hover:-translate-y-0.5 hover:shadow-card"
                      >
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                          {app.category}
                        </p>
                        <h2 className="mt-2 text-lg font-semibold">{app.name}</h2>
                        <p className="mt-2 text-sm text-slate-600">{app.shortDescription}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="surface-card border-dashed p-4 sm:p-5">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                        Launching Soon
                      </p>
                      <h2 className="mt-2 text-lg font-semibold">First app in progress</h2>
                      <p className="mt-2 text-sm text-slate-600">
                        App previews will appear here once the first iOS app is published.
                      </p>
                    </div>
                    <div className="surface-card border-dashed p-4 sm:p-5">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                        Apps Hub
                      </p>
                      <h2 className="mt-2 text-lg font-semibold">Ready for future releases</h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Support pages and privacy policy pages are already structured to scale.
                      </p>
                    </div>
                  </>
                )}
                <div className="col-span-2 surface-card border-dashed p-4 sm:p-5">
                  <p className="text-sm font-medium text-slate-900">
                    Focused on useful, beautifully designed apps for everyday life.
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Portfolio, privacy policy, and support resources for all apps in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-4 sm:pt-6">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Featured Apps"
            title="Simple iOS apps with clean interfaces"
            description="A curated set of iPhone apps designed for speed, clarity, and everyday usefulness."
          />
          {hasFeaturedApps ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredApps.map((app) => (
                <AppCard key={app.slug} app={app} variant="featured" />
              ))}
            </div>
          ) : (
            <div className="surface-card mt-8 border-dashed p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-slate-900">No featured apps yet</h3>
              <p className="mt-2 text-sm sm:text-base">
                This section will automatically populate after apps are added to
                <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">data/apps.json</code>
                and marked as featured.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section-shell pt-2">
        <div className="page-shell">
          <div className="surface-card p-6 sm:p-8">
            <SectionHeading
              eyebrow="About"
              title="Built with a product-first mindset"
              description="Independent iOS developer focused on creating clean, functional applications that simplify everyday life."
            />
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm sm:text-base">
                Every app emphasizes clear information hierarchy, fast interactions, and a
                minimal interface that feels at home on iPhone.
              </p>
              <Link href="/contact" className="btn-secondary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
