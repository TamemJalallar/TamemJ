import type { Metadata } from "next";
import Image from "next/image";
import { CryptoDonationCard } from "@/components/crypto-donation-card";
import { getCryptoDonationMethods } from "@/lib/crypto-donations";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import { donateProviders } from "@/src/content/donate/providers";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support TamemJ enterprise IT guides and tooling updates through PayPal, Buy Me a Coffee, or optional crypto donations.",
  keywords: [
    "support tamemj",
    "donate to support it guides",
    "payPal donation",
    "buy me a coffee",
    "crypto donation",
    "support enterprise it content"
  ],
  alternates: {
    canonical: "/donate/"
  },
  openGraph: buildOpenGraph(
    "Donate | TamemJ",
    "Support ongoing enterprise IT troubleshooting content and updates.",
    "/donate/"
  ),
  twitter: buildTwitter(
    "Donate | TamemJ",
    "Support ongoing enterprise IT troubleshooting content and updates."
  )
};

export default function DonatePage() {
  const methods = getCryptoDonationMethods();
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Support the Site",
    url: toAbsoluteUrl("/donate/"),
    description:
      "Optional donations that support maintenance of enterprise IT documentation, downloads, and troubleshooting resources."
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What do donations support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Donations support ongoing maintenance for enterprise IT troubleshooting guides, download assets, and tooling updates published on tamemj.com."
        }
      },
      {
        "@type": "Question",
        name: "Which donation methods are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `The page supports ${donateProviders.map((provider) => provider.name).join(", ")} and optional cryptocurrency donations.`
        }
      }
    ]
  };
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Donate", path: "/donate/" }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-5xl">
          <div className="surface-card-strong p-6 sm:p-8">
            <p className="eyebrow">Support This Project</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
              Support the Site
            </h1>
            <p className="mt-3 max-w-3xl text-sm sm:text-base">
              Donations are optional and help fund ongoing maintenance for enterprise support
              documentation, troubleshooting runbooks, and tool updates.
            </p>
          </div>

          <section className="mt-6 rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Donation Providers
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Choose the provider you prefer. Each option opens in a new tab.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {donateProviders.map((provider) => (
                <a
                  key={provider.id}
                  href={provider.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Donate using ${provider.name}`}
                  className="group flex h-full flex-col items-center rounded-2xl border border-line/80 bg-slate-50/80 p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-slate-600 dark:hover:bg-slate-900 dark:focus-visible:ring-cyan-300 dark:focus-visible:ring-offset-slate-950"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-line/70 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">
                    <Image
                      src={provider.imgSrc}
                      alt={provider.imgAlt}
                      width={80}
                      height={80}
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
                    {provider.name}
                  </h3>
                  {provider.note ? (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{provider.note}</p>
                  ) : null}
                  <p className="mt-3 text-xs font-semibold text-cyan-700 transition group-hover:text-cyan-800 dark:text-cyan-300 dark:group-hover:text-cyan-200">
                    Donate →
                  </p>
                </a>
              ))}
            </div>
          </section>

          <div className="mt-6">
            <CryptoDonationCard methods={methods} />
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
