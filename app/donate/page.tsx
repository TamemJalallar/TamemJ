import type { Metadata } from "next";
import Image from "next/image";
import { CryptoDonationCard } from "@/components/crypto-donation-card";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { getCryptoDonationMethods } from "@/lib/crypto-donations";
import { buildOpenGraph, buildTwitter } from "@/lib/seo";
import { donateProviders } from "@/src/content/donate/providers";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support TamemJ enterprise IT guides and tooling updates through PayPal, Buy Me a Coffee, or optional crypto donations.",
  alternates: {
    canonical: "/donate/"
  },
  robots: buildRobotsIndexRule("/donate/"),
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

  return (
    <section className="section-shell pt-10 sm:pt-14">
      <div className="page-shell max-w-5xl">
        <div className="hero-surface p-6 sm:p-8">
          <p className="eyebrow">Support This Project</p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-fg sm:text-4xl">
            Support the Site
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-fg-secondary sm:text-base">
            Donations are optional and help fund ongoing maintenance for enterprise support
            documentation, troubleshooting runbooks, and tool updates.
          </p>
        </div>

        <section className="surface-card mt-6 p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold text-fg">
            Donation Providers
          </h2>
          <p className="mt-2 text-sm text-fg-secondary">
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
                className="surface-card-interactive group flex h-full flex-col items-center p-4 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-primary-300 dark:focus-visible:ring-offset-slate-950"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-line/70 bg-card p-2 dark:bg-card">
                  <Image
                    src={provider.imgSrc}
                    alt={provider.imgAlt}
                    width={80}
                    height={80}
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <h3 className="mt-3 text-base font-semibold text-fg">{provider.name}</h3>
                {provider.note ? (
                  <p className="mt-1 text-xs text-muted">{provider.note}</p>
                ) : null}
                <p className="mt-3 text-xs font-semibold text-primary-600 transition group-hover:text-primary-700 dark:text-primary-300 dark:group-hover:text-primary-200">
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
  );
}
