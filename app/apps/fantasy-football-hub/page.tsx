import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fantasy Football Hub",
  description:
    "Fantasy Football Hub is a free iPhone app for opening league views, news, mock drafts, and fantasy football sections from universal links.",
  keywords: [
    "Fantasy Football Hub",
    "FATT Football",
    "fantasy football app",
    "fantasy football league app",
    "mock draft app",
    "fantasy football news"
  ],
  alternates: {
    canonical: "/apps/fantasy-football-hub/"
  },
  openGraph: {
    title: "Fantasy Football Hub | Tamem J",
    description:
      "A free fantasy football companion app for league views, news, mock drafts, and quick app sections through universal links.",
    url: "/apps/fantasy-football-hub/",
    siteName: "TamemJ",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Fantasy Football Hub | Tamem J",
    description:
      "A free fantasy football companion app for league views, news, mock drafts, and quick app sections through universal links."
  }
};

const universalLinkRoutes = [
  {
    path: "/open/*",
    title: "Open app sections",
    description: "Launch specific Fantasy Football Hub screens directly from links."
  },
  {
    path: "/league/*",
    title: "League views",
    description: "Open league-specific dashboards, teams, standings, and matchup context."
  },
  {
    path: "/news/*",
    title: "News detail",
    description: "Deep-link into player, league, and fantasy football news views."
  },
  {
    path: "/mock-draft/*",
    title: "Mock draft screens",
    description: "Jump into mock draft preparation and draft-related screens."
  }
] as const;

const features = [
  "Open league, news, and mock draft sections from universal links",
  "Keep fantasy football workflows organized around the screens users actually revisit",
  "Provide simple fallback product and support information from tamemj.com",
  "Use app-specific link paths so this app does not take over unrelated website URLs"
] as const;

export default function FantasyFootballHubPage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Fantasy Football Hub",
    alternateName: "FATT Football",
    applicationCategory: "SportsApplication",
    operatingSystem: "iOS",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    description:
      "Fantasy Football Hub is a free iPhone app for opening league views, news, mock drafts, and fantasy football sections from universal links.",
    url: "https://tamemj.com/apps/fantasy-football-hub/"
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-6xl space-y-6">
          <Link href="/apps" className="text-sm font-medium text-fg-secondary transition hover:text-fg">
            ← Back to Apps
          </Link>

          <section className="hero-surface p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
              <div>
                <p className="eyebrow text-primary-100">Fantasy Football App</p>
                <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  Fantasy Football Hub
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-primary-100/90 sm:text-base">
                  A free fantasy football companion app built to open league views, news, mock drafts,
                  and app sections quickly through universal links.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="btn-primary pointer-events-none">Free</span>
                  <Link href="/support" className="btn-secondary">
                    Support
                  </Link>
                  <Link href="/privacy" className="btn-ghost !text-white hover:!bg-white/10 hover:!text-white">
                    Privacy Policy
                  </Link>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-card backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-100/80">
                  App Identity
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-primary-100/75">Pricing</dt>
                    <dd className="font-semibold text-white">Free</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-primary-100/75">Platform</dt>
                    <dd className="font-semibold text-white">iPhone</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-primary-100/75">Bundle ID</dt>
                    <dd className="break-all text-right font-mono text-xs font-semibold text-white">
                      com.FATTFootball.app
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-primary-100/75">Universal Links</dt>
                    <dd className="font-semibold text-white">Enabled</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="surface-card p-5 sm:p-6">
              <p className="eyebrow">What It Does</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-fg">
                Simple fantasy football navigation from real links
              </h2>
              <p className="mt-3 text-sm leading-7 text-fg-secondary sm:text-base">
                Fantasy Football Hub focuses on getting users to the right app section quickly: league
                pages, news details, mock draft tools, and general app entry points. It is intentionally
                straightforward so links from messages, websites, or notifications can open the right screen.
              </p>
            </article>

            <article className="surface-card p-5 sm:p-6">
              <p className="eyebrow">Supported Link Paths</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {universalLinkRoutes.map((route) => (
                  <div key={route.path} className="rounded-2xl border border-line/80 bg-card-2/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <p className="font-mono text-xs font-semibold text-primary-600 dark:text-primary-300">
                      {route.path}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold text-fg">{route.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted">{route.description}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <p className="eyebrow">Features</p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Built for quick football workflows</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="rounded-2xl border border-line/80 bg-card-2/70 p-4 text-sm leading-7 text-fg-secondary dark:border-slate-800 dark:bg-slate-950/50">
                  {feature}
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
    </>
  );
}
