import type { Metadata } from "next";
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

        <div className="mt-8">
          <FixesCatalog fixes={fixes} categories={categories} tags={tags} />
        </div>
      </div>
    </section>
  );
}

