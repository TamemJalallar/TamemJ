import type { Metadata } from "next";
import Link from "next/link";
import { FixBuilderGate } from "@/components/corporate-fixes/fix-builder-gate";

export const metadata: Metadata = {
  title: "Corporate Tech Fixes KB Builder",
  description:
    "Authoring tool for creating Corporate Tech Fixes knowledge base entries and support documentation drafts.",
  alternates: {
    canonical: "/corporate-tech-fixes/builder/"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function CorporateTechFixesBuilderPage() {
  return (
    <section className="section-shell pt-10 sm:pt-14">
      <div className="page-shell">
        <div className="mb-5">
          <Link
            href="/corporate-tech-fixes"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            ← Back to Corporate Tech Fixes
          </Link>
        </div>

        <FixBuilderGate />
      </div>
    </section>
  );
}
