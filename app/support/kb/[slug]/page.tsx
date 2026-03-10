import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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
        <LegacyKbRedirect targetPath={`/support/tickets/${article.slug}`} />
        <div className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          If you are not redirected automatically, open{" "}
          <Link href={`/support/tickets/${article.slug}`} className="font-semibold text-accent hover:underline">
            this ticket
          </Link>
          .
        </div>
      </div>
    </section>
  );
}
