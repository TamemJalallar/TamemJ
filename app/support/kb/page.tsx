import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LegacyKbRedirect } from "@/components/support-portal/legacy-kb-redirect";
import { getKBArticles } from "@/lib/support.kb.registry";
import { buildSupportKbIndexMetadataWithArticles } from "@/lib/support-portal.seo";

export async function generateMetadata(): Promise<Metadata> {
  const base = buildSupportKbIndexMetadataWithArticles(getKBArticles());
  return {
    ...base,
    alternates: { canonical: "/support/tickets/" },
    robots: { index: false, follow: true }
  };
}

export default function KBPage() {
  return (
    <section className="section-shell pb-10 pt-10 sm:pt-14">
      <div className="page-shell max-w-3xl">
        <Suspense
          fallback={
            <div className="surface-card p-5 text-sm text-fg-secondary">
              Redirecting to tickets…
            </div>
          }
        >
          <LegacyKbRedirect targetPath="/support/tickets" />
        </Suspense>
        <div className="mt-6 rounded-2xl border border-line/70 bg-card-2/70 p-4 text-sm text-fg-secondary">
          <p className="font-medium text-fg">Canonical support library</p>
          <p className="mt-2 leading-6">
            The public, indexed support knowledge base now lives under the tickets path so support documentation has a
            single canonical home.
          </p>
          <p className="mt-3">
          If you are not redirected automatically, open{" "}
          <Link href="/support/tickets" className="font-semibold text-primary-600 hover:underline dark:text-primary-300">
            the tickets library
          </Link>
          .
          </p>
        </div>
      </div>
    </section>
  );
}
