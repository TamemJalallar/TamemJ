import type { Metadata } from "next";
import { CryptoDonationCard } from "@/components/crypto-donation-card";
import { getCryptoDonationMethods } from "@/lib/crypto-donations";
import { buildOpenGraph, buildTwitter } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support TamemJ enterprise IT guides and tooling updates through optional crypto donations.",
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

  return (
    <section className="section-shell pt-10 sm:pt-14">
      <div className="page-shell max-w-5xl">
        <div className="surface-card-strong p-6 sm:p-8">
          <p className="eyebrow">Support This Project</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
            Donate
          </h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base">
            Donations are optional and help fund ongoing maintenance for enterprise support
            documentation, troubleshooting runbooks, and tool updates.
          </p>
        </div>

        <div className="mt-6">
          <CryptoDonationCard methods={methods} />
        </div>
      </div>
    </section>
  );
}
