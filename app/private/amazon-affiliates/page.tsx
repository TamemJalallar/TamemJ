import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateDisclosureBanner } from "@/components/affiliate/affiliate-disclosure-banner";
import { AmazonProductGlyph } from "@/components/affiliate/amazon-product-glyph";
import {
  getAmazonStorefrontCollections,
  getAmazonStorefrontFeaturedPicks,
  getAmazonStorefrontHeroLink
} from "@/lib/amazon-storefront";
import { buildOpenGraph, buildTwitter } from "@/lib/seo";

const pagePath = "/private/amazon-affiliates/";

export const metadata: Metadata = {
  title: "Amazon Recommended Products Workspace",
  description: "Private Amazon recommendations workspace for curated IT, desk, and lab product picks.",
  alternates: {
    canonical: pagePath
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  },
  openGraph: buildOpenGraph(
    "Amazon Recommended Products Workspace | Tamem J",
    "Private Amazon recommendations workspace.",
    pagePath
  ),
  twitter: buildTwitter("Amazon Recommended Products Workspace | Tamem J", "Private Amazon recommendations workspace.")
};

export default function PrivateAmazonAffiliatesPage() {
  const heroLink = getAmazonStorefrontHeroLink();
  const featuredPicks = getAmazonStorefrontFeaturedPicks();
  const collections = getAmazonStorefrontCollections();
  const categoryCount = new Set(featuredPicks.map((pick) => pick.category)).size;

  return (
    <section className="section-shell pt-10 sm:pt-14">
      <div className="page-shell max-w-7xl space-y-6">
        <section className="hero-surface p-6 sm:p-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
            <div>
              <p className="eyebrow text-primary-100">Private Storefront</p>
              <h1 className="mt-4 max-w-4xl font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                Amazon picks for desks, labs, and practical IT setups
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-primary-100/90 sm:text-base">
                This hidden workspace turns your Amazon affiliates into a curated recommendations page instead of a raw
                link ledger. It is organized like a lightweight storefront, with featured picks, browsing collections,
                and cleaner product positioning you can reuse across content.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {heroLink ? (
                  <a href={heroLink.url} target="_blank" rel="sponsored nofollow noreferrer" className="btn-primary">
                    Open Amazon master list
                  </a>
                ) : null}
                <Link href="/downloads/" className="btn-secondary">
                  Back to Downloads
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                  {featuredPicks.length} featured picks
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                  {collections.length} collections
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                  {categoryCount} merch categories
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                  noindex + hidden route
                </span>
              </div>
            </div>

            <div className="surface-card rounded-[24px] p-5 sm:p-6">
              <p className="eyebrow">Storefront Notes</p>
              <h2 className="mt-4 text-2xl font-semibold text-fg">How to use this page</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-fg-secondary">
                <p>
                  Use it as your internal Amazon recommendations hub, with better visual storytelling for the products
                  you actually want to feature.
                </p>
                <p>
                  The route is still static, so it stays private in practice by being unlinked and marked{" "}
                  <span className="rounded bg-card-3 px-1.5 py-0.5 font-mono text-xs text-fg">noindex</span>, but it
                  is not true access control.
                </p>
              </div>

              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line/80 bg-card-2/80 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Route</dt>
                  <dd className="mt-2 font-mono text-xs text-fg">{pagePath}</dd>
                </div>
                <div className="rounded-2xl border border-line/80 bg-card-2/80 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Visibility</dt>
                  <dd className="mt-2 text-sm font-semibold text-fg">Robots blocked + no navigation links</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <AffiliateDisclosureBanner className="max-w-5xl" />

        <section className="surface-card p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Featured Picks</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Recommended products with better context</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-fg-secondary sm:text-base">
                Each card adds the missing merchandising layer: who the product is for, why it makes the list, and how
                it fits into the broader desk, lab, or creator setup story.
              </p>
            </div>
            <span className="filter-chip px-2.5 py-1 text-xs">{featuredPicks.length} active Amazon links</span>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {featuredPicks.map((product) => (
              <article key={product.key} className="surface-card-interactive rounded-[24px] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AmazonProductGlyph category={product.category} />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{product.category}</p>
                      <p className="mt-1 text-sm font-semibold text-primary-600 dark:text-primary-300">{product.highlight}</p>
                    </div>
                  </div>
                  <span className="filter-chip shrink-0 px-2.5 py-1 text-[11px] font-semibold">{product.priceBand}</span>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-fg">{product.affiliate.label}</h3>
                <p className="mt-2 text-sm leading-7 text-fg-secondary">{product.recommendation}</p>

                <div className="mt-4 rounded-2xl border border-line/80 bg-card-2/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Best for</p>
                  <p className="mt-2 text-sm leading-7 text-fg">{product.bestFor}</p>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-fg-secondary">
                  {product.usageNotes.map((note) => (
                    <li key={note} className="flex gap-2 leading-7">
                      <span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="filter-chip px-2.5 py-1 text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={product.affiliate.url}
                    target="_blank"
                    rel="sponsored nofollow noreferrer"
                    className="btn-primary"
                  >
                    View on Amazon
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="surface-card p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Shop by Collection</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Collections that feel more like a storefront</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-fg-secondary sm:text-base">
                These groupings make it easier to position the links like themed shelves instead of one-off recommendations.
              </p>
            </div>
            <span className="filter-chip px-2.5 py-1 text-xs">{collections.length} curated collections</span>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            {collections.map((collection) => (
              <article key={collection.id} className="surface-card rounded-[24px] p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="eyebrow">{collection.title}</span>
                  <span className="filter-chip px-2.5 py-1 text-[11px]">{collection.products.length} picks</span>
                </div>

                <p className="mt-4 text-lg font-semibold text-fg">{collection.summary}</p>
                <p className="mt-2 text-sm leading-7 text-fg-secondary">{collection.audience}</p>

                <div className="mt-5 space-y-3">
                  {collection.products.map((product) => (
                    <div key={product.key} className="rounded-2xl border border-line/80 bg-card-2/70 p-4">
                      <div className="flex items-start gap-3">
                        <AmazonProductGlyph category={product.category} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-fg">{product.affiliate.label}</p>
                          <p className="mt-1 text-sm leading-6 text-fg-secondary">{product.bestFor}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="filter-chip px-2 py-1 text-[11px]">{product.highlight}</span>
                        <span className="filter-chip px-2 py-1 text-[11px]">{product.priceBand}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="surface-card-strong p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow">Operational Guardrail</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Still hidden, but not hard-locked</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-fg-secondary sm:text-base">
                This page is better merchandised now, but the privacy model has not changed. If you want it to behave
                like a true internal storefront, the next step is putting <span className="font-semibold text-fg">/private/</span>{" "}
                behind Cloudflare Access.
              </p>
            </div>

            <div className="surface-card rounded-2xl p-4 text-sm text-fg-secondary lg:max-w-sm">
              <p className="font-semibold text-fg">Current protections</p>
              <ul className="mt-3 space-y-2">
                <li>Unlinked from public navigation</li>
                <li>Excluded from the sitemap</li>
                <li>Marked noindex and nofollow</li>
                <li>Blocked in robots.txt</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
