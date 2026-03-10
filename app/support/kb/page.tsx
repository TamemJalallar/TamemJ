import type { Metadata } from "next";
import Link from "next/link";
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
        <LegacyKbRedirect targetPath="/support/tickets" />
        <div className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          If you are not redirected automatically, open{" "}
          <Link href="/support/tickets" className="font-semibold text-accent hover:underline">
            the tickets library
          </Link>
          .
        </div>
      </div>
    </section>
  );
}
