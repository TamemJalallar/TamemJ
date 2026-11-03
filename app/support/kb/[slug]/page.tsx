import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { LegacyKbRedirect } from "@/components/support-portal/legacy-kb-redirect";
import { getKBArticleBySlug, getKBArticles } from "@/lib/support.kb.registry";
import { buildKbArticleMetadata } from "@/lib/support-portal.seo";

interface KBArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getKBArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: KBArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getKBArticleBySlug(slug);

  if (!article) {
    return { title: "Ticket Not Found" };
  }

  const baseMetadata = buildKbArticleMetadata(article);
  return {
    ...baseMetadata,
    alternates: { canonical: `/support/tickets/${article.slug}/` },
    robots: { index: false, follow: true }
  };
}

export default async function KBArticlePage({ params }: KBArticlePageProps) {
  const { slug } = await params;
  const article = getKBArticleBySlug(slug);

  if (!article) {
    notFound();
  }
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
          <LegacyKbRedirect targetPath={`/support/tickets/${article.slug}`} />
        </Suspense>
        <div className="mt-6 rounded-2xl border border-line/70 bg-card-2/70 p-4 text-sm text-fg-secondary">
          <p className="font-medium text-fg">Canonical support article</p>
          <p className="mt-2 leading-6">
            This legacy knowledge base URL remains available for backward compatibility, but the indexed reference page
            now lives in the tickets library.
          </p>
          <p className="mt-3">
          If you are not redirected automatically, open{" "}
          <Link
            href={`/support/tickets/${article.slug}`}
            className="font-semibold text-primary-600 hover:underline dark:text-primary-300"
          >
            this ticket
          </Link>
          .
          </p>
        </div>
      </div>
    </section>
  );
}
