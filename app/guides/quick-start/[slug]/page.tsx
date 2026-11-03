import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import { getDownloadAssetBySlug } from "@/lib/download-assets.registry";
import { getKBArticleBySlug } from "@/lib/support.kb.registry";
import { supportAuthorProfile } from "@/lib/site";
import type { KBArticle } from "@/types/support";
import {
  getQuickStartGuideBySlug,
  getQuickStartGuides
} from "@/src/content/editorial/quick-start-guides";

interface QuickStartGuidePageProps {
  params: Promise<{ slug: string }>;
}

function toIsoDuration(value: string): string | undefined {
  const matches = value.match(/\d+/g);
  if (!matches || matches.length === 0) return undefined;

  const minutes = matches.length === 1
    ? Number(matches[0])
    : Math.round((Number(matches[0]) + Number(matches[1])) / 2);

  if (!Number.isFinite(minutes) || minutes <= 0) {
    return undefined;
  }

  return `PT${minutes}M`;
}

function uniqueKeywords(keywords: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const keyword of keywords) {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(keyword.trim());
  }

  return result;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getQuickStartGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: QuickStartGuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getQuickStartGuideBySlug(slug);

  if (!guide) {
    return { title: "Guide Not Found" };
  }

  const relatedAssets = guide.relatedAssetSlugs
    .map((assetSlug) => getDownloadAssetBySlug(assetSlug))
    .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset));

  return {
    title: `${guide.title} | Quick Start Guide`,
    description: guide.summary,
    authors: [{ name: supportAuthorProfile.name }],
    keywords: uniqueKeywords([
      guide.title,
      ...guide.tags,
      ...relatedAssets.map((asset) => asset.title),
      `${guide.product} quick start`,
      `${guide.product} setup guide`,
      "New York cannabis operations"
    ]),
    alternates: {
      canonical: `/guides/quick-start/${guide.slug}/`
    },
    openGraph: buildOpenGraph(
      `${guide.title} | Quick Start Guide`,
      guide.summary,
      `/guides/quick-start/${guide.slug}/`
    ),
    twitter: buildTwitter(`${guide.title} | Quick Start Guide`, guide.summary)
  };
}

export default async function QuickStartGuideDetailPage({ params }: QuickStartGuidePageProps) {
  const { slug } = await params;
  const guide = getQuickStartGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedTickets = guide.relatedTicketSlugs
    .map((ticketSlug) => getKBArticleBySlug(ticketSlug))
    .filter((article): article is KBArticle => Boolean(article));
  const relatedAssets = guide.relatedAssetSlugs
    .map((assetSlug) => getDownloadAssetBySlug(assetSlug))
    .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset));

  const guideSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.summary,
    url: toAbsoluteUrl(`/guides/quick-start/${guide.slug}/`),
    ...(toIsoDuration(guide.estimatedTime)
      ? { totalTime: toIsoDuration(guide.estimatedTime) }
      : {}),
    supply: guide.tags.map((tag) => ({
      "@type": "HowToSupply",
      name: tag
    })),
    step: guide.sections.map((section, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: section.title,
      text: [section.description, ...section.bullets].join(" ")
    })),
    author: {
      "@type": "Person",
      name: supportAuthorProfile.name,
      jobTitle: supportAuthorProfile.title
    }
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "IT Pillar Guides", path: "/guides/" },
    { name: "Quick Start Guides", path: "/guides/" },
    { name: guide.title, path: `/guides/quick-start/${guide.slug}/` }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-6xl space-y-6">
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/guides"
              className="font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to Guides
            </Link>
            <Link
              href="/support/tickets"
              className="font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Browse Tickets
            </Link>
          </div>

          <section className="surface-card-strong p-6 sm:p-8">
            <p className="eyebrow">Quick Start Guide</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
              {guide.title}
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              {guide.summary}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Product: {guide.product}
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Audience: {guide.audience}
              </span>
              <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Estimated Time: {guide.estimatedTime}
              </span>
            </div>
          </section>

          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-6 dark:border-amber-800/60 dark:bg-amber-950/25">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">
              Compliance Note
            </p>
            <p className="mt-3 text-sm leading-7 text-amber-900 dark:text-amber-100">
              {guide.caution}
            </p>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
            <div className="space-y-5">
              {guide.sections.map((section, index) => (
                <section key={`${guide.slug}-${section.title}`} className="surface-card p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                      {index + 1}
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                        {section.title}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {section.bullets.map((bullet) => (
                      <li
                        key={`${guide.slug}-${section.title}-${bullet}`}
                        className="rounded-2xl border border-line/80 bg-white p-4 text-sm leading-7 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="space-y-5">
              <section className="surface-card p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Official Source Links</h2>
                <div className="mt-4 space-y-3">
                  {guide.officialSources.map((source) => (
                    <a
                      key={`${guide.slug}-${source.href}`}
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-2xl border border-line/80 bg-white p-4 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-700 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-primary-400/30 dark:hover:text-primary-200"
                    >
                      {source.label}
                    </a>
                  ))}
                </div>
              </section>

              <section className="surface-card p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Related Download Assets</h2>
                {relatedAssets.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {relatedAssets.map((asset) => (
                      <Link
                        key={asset.slug}
                        href={`/downloads/assets/${asset.slug}/`}
                        className="block rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-400/30"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                          {asset.category} • {asset.format.toUpperCase()}
                        </p>
                        <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {asset.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {asset.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    No related download assets are linked to this quick guide yet.
                  </p>
                )}
              </section>

              <section className="surface-card p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Related Support Tickets</h2>
                {relatedTickets.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {relatedTickets.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/support/tickets/${article.slug}/`}
                        className="block rounded-2xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-400/30"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                          {article.product}
                        </p>
                        <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {article.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {article.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    No related tickets are linked to this quick guide yet.
                  </p>
                )}
              </section>

              <section className="surface-card p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Reviewed</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Last reviewed on {guide.lastReviewed} by {supportAuthorProfile.name}, {supportAuthorProfile.title}.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {guide.tags.map((tag) => (
                    <span
                      key={`${guide.slug}-tag-${tag}`}
                      className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
