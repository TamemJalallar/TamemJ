import type { Metadata } from "next";
import Link from "next/link";
import { AdSenseSlot } from "@/components/monetization/adsense-slot";
import { EditorialStandardsStrip } from "@/components/shared/editorial-authority-panels";
import { SupportForm } from "@/components/support-form";
import { SupportPortalHome } from "@/components/support-portal/support-portal-home";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { getAdSenseSlot, monetizationConfig } from "@/lib/monetization";
import { getApps, isPublishedApp } from "@/lib/apps";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import {
  buildSupportOpenGraph,
  buildSupportTwitter,
  toAbsoluteSupportUrl
} from "@/lib/support-portal.seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support Portal",
  description:
    "ServiceNow-style support portal demo with ticket articles, service catalog, incident intake, local ticketing, analytics, and app support contact paths.",
  keywords: [
    "IT support portal",
    "knowledge base",
    "service catalog",
    "incident form",
    "ITIL demo",
    "enterprise support docs",
    "iOS app support"
  ],
  alternates: {
    canonical: "/support/"
  },
  robots: buildRobotsIndexRule("/support/"),
  openGraph: buildSupportOpenGraph(
    "Support Portal | Tamem J",
    "ServiceNow-style support portal demo with ticket articles, service requests, incident intake, analytics, and app support.",
    "/support/"
  ),
  twitter: buildSupportTwitter(
    "Support Portal | Tamem J",
    "ServiceNow-style support portal demo with enterprise-safe troubleshooting docs, service requests, and app support."
  )
};

const faqs = [
  {
    question: "How do I restore a purchase?",
    answer:
      "Open the app settings and use Restore Purchases. If the issue continues, submit the app support form with your app name and device iOS version."
  },
  {
    question: "Why is data not syncing across devices?",
    answer:
      "Confirm both devices use the same Apple ID and have iCloud enabled if the app supports sync. Restarting the app can also refresh sync status."
  },
  {
    question: "How do I report a bug or request a feature?",
    answer:
      "Use the app support form below. Include steps to reproduce, your device model, iOS version, and the app version if possible."
  }
];

export default function SupportPage() {
  const apps = getApps();
  const hasApps = apps.length > 0;
  const publishedApps = apps.filter(isPublishedApp).length;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
  const supportPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Support Portal",
    url: toAbsoluteSupportUrl("/support/"),
    description:
      "ServiceNow-style support portal demo with ticket articles, service catalog, incident forms, local ticketing, analytics, and app support."
  };
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Support Portal", path: "/support/" }
  ]);

  return (
    <>
      <div className="space-y-6 pb-6">
        <section className="hero-surface p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 top-0 h-52 w-52 rounded-full bg-primary-300/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 bottom-0 h-52 w-52 rounded-full bg-accent-400/10 blur-3xl" />
          <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
            <div>
              <p className="eyebrow text-primary-100">Support</p>
              <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                One support entry point for tickets, requests, and app help.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-primary-100/90 sm:text-base">
                The support area now separates two clear paths: enterprise support workflows for IT issues,
                and app support for published products. That keeps the portal useful without making it feel split-brain.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/support/tickets" className="btn-primary">
                  Browse Tickets
                </Link>
                <Link href="/support/incident/new" className="btn-secondary">
                  Submit Incident
                </Link>
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="btn-ghost !text-white hover:!bg-white/10 hover:!text-white"
                >
                  Email Support
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Enterprise Path</p>
                <h2 className="mt-2 text-lg font-semibold text-white">Tickets, catalog, and incident intake</h2>
                <p className="mt-2 text-sm text-primary-100/85">
                  Search documented fixes, route requests, and submit incidents from one support workspace.
                </p>
              </article>
              <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">App Support</p>
                <h2 className="mt-2 text-lg font-semibold text-white">Privacy, contact, and issue reporting</h2>
                <p className="mt-2 text-sm text-primary-100/85">
                  Support links for live and in-progress apps stay on this page so product support remains easy to find.
                </p>
              </article>
              <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Published Products</p>
                <p className="mt-2 font-display text-3xl font-semibold text-white">{publishedApps}</p>
                <p className="mt-1 text-sm text-primary-100/85">Released apps and tools already linked into support</p>
              </article>
              <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Support Email</p>
                <p className="mt-2 text-lg font-semibold text-white">{siteConfig.supportEmail}</p>
                <p className="mt-1 text-sm text-primary-100/85">Fallback contact path for app issues and launch questions</p>
              </article>
            </div>
          </div>
        </section>

        <SupportPortalHome showHeader={false} />

        <AdSenseSlot
          client={monetizationConfig.adsenseClient}
          slot={getAdSenseSlot("display")}
          label="Advertisement"
        />

        <EditorialStandardsStrip description="The support experience is built around enterprise-safe troubleshooting, clearly separated app support, and reference pages that stay useful to both users and AI systems. That means detail pages are reviewed for scope, escalation, tested environments, and canonical routing." />

        <section className="surface-card p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow">App Support</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-fg">App contact and issue reporting</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-fg-secondary sm:text-base">
                App product pages now open a prefilled support email for the specific app. This support page still exists as the shared fallback
                for broader issue reporting, general product questions, and the embedded app support form.
              </p>
              <div className="status-info mt-4 p-4 text-sm">
                <p className="font-semibold">Support Email</p>
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="mt-1 inline-block underline underline-offset-4"
                >
                  {siteConfig.supportEmail}
                </a>
              </div>
            </div>

            <div className="surface-card bg-card-2/70 p-4 text-sm lg:max-w-sm">
              <p className="font-semibold text-fg">Simple support path</p>
              <ol className="mt-3 space-y-2 text-fg-secondary">
                {hasApps ? (
                  <>
                    <li>1. Choose the app from the form.</li>
                    <li>2. Add a short subject and explain the issue clearly.</li>
                    <li>3. Include device model, OS version, and app version if possible.</li>
                  </>
                ) : (
                  <>
                    <li>1. Use the support email for product questions or launch updates.</li>
                    <li>2. App-specific options appear automatically once products are published.</li>
                  </>
                )}
              </ol>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="surface-card bg-card-2/70 p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-fg">FAQ</h3>
              <div className="mt-4 space-y-3">
                {faqs.map((item) => (
                  <details key={item.question} className="surface-card rounded-2xl p-4">
                    <summary className="cursor-pointer list-none pr-6 text-sm font-medium text-fg">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-fg-secondary">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>

            {hasApps ? (
              <SupportForm apps={apps} />
            ) : (
              <div className="surface-card p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-fg">Support Form Coming Soon</h3>
                <p className="mt-2 text-sm text-fg-secondary">
                  Once an app is published, the app-specific support form will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(supportPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
