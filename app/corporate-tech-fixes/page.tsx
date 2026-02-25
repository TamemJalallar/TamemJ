import type { Metadata } from "next";
import Link from "next/link";
import { FixesCatalog } from "@/components/corporate-fixes/fixes-catalog";
import { EnterpriseSupportBanner } from "@/components/corporate-fixes/fix-shared";
import { SectionHeading } from "@/components/section-heading";
import {
  getCorporateFixCategories,
  getCorporateFixes,
  getCorporateFixTags
} from "@/lib/corporate-fixes.registry";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Corporate Tech Fixes",
  description:
    "Enterprise-safe IT troubleshooting guides with structured step-by-step fixes for Windows, macOS, Microsoft 365, networking, printers, and security incidents.",
  keywords: [
    "corporate IT support",
    "enterprise troubleshooting",
    "IT runbook",
    "Microsoft 365 support",
    "Windows support",
    "macOS support",
    "network troubleshooting",
    "SharePoint access denied",
    "OneDrive sync issue",
    "Teams microphone issue"
  ],
  alternates: {
    canonical: "/corporate-tech-fixes/"
  },
  openGraph: {
    title: "Corporate Tech Fixes | Tamem J",
    description:
      "Professional, enterprise-safe IT troubleshooting guides for common corporate technology issues.",
    url: `${siteConfig.url}/corporate-tech-fixes/`,
    type: "website",
    images: [
      {
        url: "/images/site/og-image.svg",
        alt: "Corporate Tech Fixes"
      }
    ]
  }
};

export default function CorporateTechFixesPage() {
  const fixes = getCorporateFixes();
  const categories = getCorporateFixCategories();
  const tags = getCorporateFixTags();

  return (
    <section className="section-shell pt-10 sm:pt-14">
      <div className="page-shell">
        <EnterpriseSupportBanner />

        <SectionHeading
          className="mt-5"
          eyebrow="Corporate Tech Fixes"
          title="Enterprise-ready troubleshooting guides"
          description="Structured, professional runbooks for common corporate IT issues. Search by symptom, filter by category, and use tags to narrow results quickly."
        />

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-line/80 bg-white/80 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Need to add a new KB or support runbook?
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Use the built-in KB Builder to draft entries, manage steps/tags, and copy a registry snippet.
            </p>
          </div>
          <Link href="/corporate-tech-fixes/builder" className="btn-secondary">
            Open KB Builder
          </Link>
        </div>

        <div className="mt-8">
          <FixesCatalog fixes={fixes} categories={categories} tags={tags} />
        </div>
      </div>
    </section>
  );
}
