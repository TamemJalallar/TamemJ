import type { Metadata } from "next";
import { SupportForm } from "@/components/support-form";
import { SupportPortalHome } from "@/components/support-portal/support-portal-home";
import { getApps } from "@/lib/apps";
import { toAbsoluteSupportUrl } from "@/lib/support-portal.seo";
import { siteConfig } from "@/lib/site";
import { buildSupportOpenGraph, buildSupportTwitter } from "@/lib/support-portal.seo";

export const metadata: Metadata = {
  title: "Support Portal",
  description:
    "ServiceNow-style support portal demo with a knowledge base, service catalog, incident forms, local ticketing, analytics, and preserved iOS app support contact form.",
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
  openGraph: buildSupportOpenGraph(
    "Support Portal | Tamem J",
    "ServiceNow-style support portal demo with a knowledge base, service catalog, incident forms, local ticketing, analytics, and preserved iOS app support.",
    "/support/"
  ),
  twitter: buildSupportTwitter(
    "Support Portal | Tamem J",
    "ServiceNow-style support portal demo with enterprise-safe troubleshooting docs, service requests, and a preserved iOS app support form."
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
      "Confirm both devices use the same Apple ID and have iCloud enabled (if the app supports sync). Restarting the app can refresh sync status."
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
      "ServiceNow-style support portal demo with a knowledge base, service catalog, incident forms, local ticketing, analytics, and iOS app support."
  };

  return (
    <>
      <div className="space-y-6 pb-6">
        <SupportPortalHome />

      <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Legacy Feature (Preserved)
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">
              iOS App Support
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              The original lightweight app support experience is still available here. Existing links such
              as <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">/support?app=&lt;slug&gt;</code>
              continue to work because the support form remains embedded on this page.
            </p>
            <div className="mt-4 rounded-xl border border-line/70 bg-slate-50/70 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/70">
              <p className="font-semibold text-slate-900 dark:text-slate-100">Support Email</p>
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="mt-1 inline-block text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500 dark:text-slate-200 dark:decoration-slate-600"
              >
                {siteConfig.supportEmail}
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-line/70 bg-slate-50/70 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/70 lg:max-w-sm">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Simple App Support Instructions</p>
            <ol className="mt-2 space-y-2 text-slate-600 dark:text-slate-300">
              {hasApps ? (
                <>
                  <li>1. Choose the app from the form.</li>
                  <li>2. Add a short subject and issue summary.</li>
                  <li>3. Include device model, iOS version, and app version if possible.</li>
                </>
              ) : (
                <>
                  <li>1. Use the support email for general inquiries or launch updates.</li>
                  <li>2. App-specific support options will appear after apps are published.</li>
                </>
              )}
            </ol>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-line/70 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/70 sm:p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">FAQ</h3>
              <div className="mt-4 space-y-3">
                {faqs.map((item) => (
                  <details key={item.question} className="rounded-xl border border-line/70 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <summary className="cursor-pointer list-none pr-6 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {hasApps ? (
            <SupportForm apps={apps} />
          ) : (
            <div className="rounded-2xl border border-line/70 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Support Form Coming Soon</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
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
    </>
  );
}
