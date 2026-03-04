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

        <div className="mt-6 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-5 shadow-soft dark:border-amber-900/50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/20 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-200">
            Quick Support Option
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
            Buy Me a Coffee
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-700 dark:text-slate-300">
            If you want a quick way to support the project, you can contribute here.
          </p>

          <div className="mt-4">
            <a
              href="https://buymeacoffee.com/tamemj"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-amber-300 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_10px_24px_-12px_rgba(245,158,11,0.65)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(251,146,60,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-amber-700 dark:text-slate-900 dark:focus-visible:ring-offset-slate-950"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/35 to-white/0 transition duration-700 group-hover:translate-x-full" />
              <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-base">
                ☕
              </span>
              <span className="relative">Support on Buy Me a Coffee</span>
              <span className="relative text-base leading-none">→</span>
            </a>
          </div>
        </div>

        <div className="mt-6">
          <CryptoDonationCard methods={methods} />
        </div>
      </div>
    </section>
  );
}
