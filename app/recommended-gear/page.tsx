import type { Metadata } from "next";
import Link from "next/link";
import type { CollectionPage, ItemList, WebPage, WithContext } from "schema-dts";
import { AffiliateDisclosureBanner } from "@/components/affiliate/affiliate-disclosure-banner";
import { AmazonProductGlyph } from "@/components/affiliate/amazon-product-glyph";
import {
  getAmazonStorefrontCollections,
  getAmazonStorefrontFeaturedPicks,
  getAmazonStorefrontHeroLink
} from "@/lib/amazon-storefront";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOpenGraph,
  buildTwitter,
  toAbsoluteUrl
} from "@/lib/seo";

const pagePath = "/recommended-gear/";

function getStoreBadgeClassName(badge: "Best Starter" | "Best Value" | "Best Premium"): string {
  switch (badge) {
    case "Best Starter":
      return "border-success-500/25 bg-success-500/10 text-success-700 dark:text-success-100";
    case "Best Value":
      return "border-accent-500/25 bg-accent-500/10 text-accent-700 dark:text-accent-100";
    case "Best Premium":
      return "border-warning-500/25 bg-warning-500/10 text-warning-700 dark:text-warning-100";
    default:
      return "border-line bg-card-2 text-fg-secondary";
  }
}

export const metadata: Metadata = {
  title: "Recommended IT Gear & Desk Setup Picks",
  description:
    "Curated Amazon product recommendations for IT admins across home lab, desk setup, networking, and power categories.",
  keywords: [
    "recommended IT gear",
    "home lab gear",
    "desk setup gear",
    "networking gear",
    "ups battery backup",
    "sysadmin gear",
    "cable management for desks",
    "label maker for IT",
    "raspberry pi home lab",
    "synology nas home lab",
    "managed switch recommendations",
    "usb c dock recommendations"
  ],
  alternates: {
    canonical: pagePath
  },
  openGraph: buildOpenGraph(
    "Recommended IT Gear & Desk Setup Picks | Tamem J",
    "Curated Amazon recommendations for IT admins, home labs, support desks, and practical workstation upgrades.",
    pagePath
  ),
  twitter: buildTwitter(
    "Recommended IT Gear & Desk Setup Picks | Tamem J",
    "Curated Amazon recommendations for IT admins, home labs, support desks, and practical workstation upgrades."
  )
};

export default function RecommendedGearPage() {
  const heroLink = getAmazonStorefrontHeroLink();
  const featuredPicks = getAmazonStorefrontFeaturedPicks();
  const collections = getAmazonStorefrontCollections();

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Recommended Gear", path: pagePath }
  ]);

  const collectionSchema = buildCollectionPageJsonLd(
    "Recommended IT Gear & Desk Setup Picks",
    "Curated Amazon product recommendations for desk setups, home labs, IT operations, and productivity workflows.",
    pagePath,
    featuredPicks.map((product) => ({
      name: product.affiliate.label,
      path: pagePath
    }))
  );

  const storefrontListSchema: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Recommended IT Gear",
    numberOfItems: featuredPicks.length,
    itemListElement: featuredPicks.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.affiliate.label,
        description: product.recommendation,
        category: product.category,
        url: product.affiliate.url
      }
    }))
  };

  const webPageSchema: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Recommended IT Gear & Desk Setup Picks",
    url: toAbsoluteUrl(pagePath),
    description:
      "Curated Amazon product recommendations for home lab builds, desk setup upgrades, networking gear, and power protection.",
    about: [
      { "@type": "Thing", name: "Home lab hardware" },
      { "@type": "Thing", name: "Desk setup gear" },
      { "@type": "Thing", name: "Networking gear" },
      { "@type": "Thing", name: "Power protection" }
    ]
  };

  return (
    <>
      <section className="section-shell pt-8 sm:pt-10">
        <div className="page-shell space-y-6">
          <section className="hero-surface p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-16 top-0 h-52 w-52 rounded-full bg-primary-300/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-accent-400/10 blur-3xl" />

            <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
              <div>
                <p className="eyebrow text-primary-100">Recommended Gear</p>
                <h1 className="mt-4 max-w-4xl text-balance font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                  Amazon picks for IT work, home labs, cleaner desks, and better everyday setups
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-primary-100/90 sm:text-base">
                  These are practical product recommendations that fit the rest of the site: home lab builds, cleaner
                  desks, stronger networking, and safer power setups for day-to-day admin work.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {heroLink ? (
                    <a href={heroLink.url} target="_blank" rel="sponsored nofollow noreferrer" className="btn-primary">
                      Open Amazon gear list
                    </a>
                  ) : null}
                  <Link href="/downloads/" className="btn-secondary">
                    Back to Downloads
                  </Link>
                  <Link href="/pc-build-guides/" className="btn-ghost !text-white hover:!bg-white/10 hover:!text-white">
                    Open PC Build Guides
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Featured Picks</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{featuredPicks.length}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Curated links with your affiliate</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Collections</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{collections.length}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Grouped for clearer browsing intent</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Storefront Focus</p>
                  <p className="mt-2 text-sm leading-6 text-primary-100/90">
                    Four shelf-style categories: Home Lab, Desk Setup, Networking, and Power. That keeps the page
                    aligned with your support docs, downloads, and practical IT workflows.
                  </p>
                </article>
              </div>
            </div>
          </section>

          <AffiliateDisclosureBanner className="max-w-5xl" />

          <section className="surface-card p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Featured Amazon Links</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Recommended products using your affiliate links</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-fg-secondary">
                  These links are intentionally curated around real IT workflows instead of acting like a generic storefront.
                </p>
              </div>
              <span className="filter-chip px-3 py-1 text-xs">{featuredPicks.length} picks</span>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {featuredPicks.map((product) => (
                <article key={product.key} className="surface-card-interactive rounded-[24px] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <AmazonProductGlyph category={product.category} />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{product.category}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-primary-600 dark:text-primary-300">{product.highlight}</p>
                          {product.storeBadge ? (
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStoreBadgeClassName(product.storeBadge)}`}
                            >
                              {product.storeBadge}
                            </span>
                          ) : null}
                        </div>
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
                <p className="eyebrow">Browse by Use Case</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-fg">Collections with clearer intent</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-fg-secondary">
                  This keeps the gear recommendations aligned with the rest of the site by grouping them into clear shelves you can browse quickly.
                </p>
              </div>
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
                      <a
                        key={product.key}
                        href={product.affiliate.url}
                        target="_blank"
                        rel="sponsored nofollow noreferrer"
                        className="surface-card-interactive flex items-start gap-3 rounded-2xl p-4"
                      >
                        <AmazonProductGlyph category={product.category} />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-fg">{product.affiliate.label}</p>
                            {product.storeBadge ? (
                              <span
                                className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getStoreBadgeClassName(product.storeBadge)}`}
                              >
                                {product.storeBadge}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm leading-6 text-fg-secondary">{product.bestFor}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="surface-card-strong p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <article className="surface-card rounded-2xl p-4">
                <p className="eyebrow">Related Surface</p>
                <h3 className="mt-3 text-lg font-semibold text-fg">Downloads</h3>
                <p className="mt-2 text-sm leading-6 text-fg-secondary">
                  Pair these hardware picks with your software catalog and direct download pages.
                </p>
                <Link href="/downloads/" className="btn-secondary mt-4">
                  Open Downloads
                </Link>
              </article>
              <article className="surface-card rounded-2xl p-4">
                <p className="eyebrow">Related Surface</p>
                <h3 className="mt-3 text-lg font-semibold text-fg">PC Build Guides</h3>
                <p className="mt-2 text-sm leading-6 text-fg-secondary">
                  Use the build guides when the recommendation needs full component logic and budget planning.
                </p>
                <Link href="/pc-build-guides/" className="btn-secondary mt-4">
                  Open PC Builds
                </Link>
              </article>
              <article className="surface-card rounded-2xl p-4">
                <p className="eyebrow">Related Surface</p>
                <h3 className="mt-3 text-lg font-semibold text-fg">Support Tickets</h3>
                <p className="mt-2 text-sm leading-6 text-fg-secondary">
                  Keep troubleshooting primary and use product recommendations only where they genuinely fit the workflow.
                </p>
                <Link href="/support/tickets/" className="btn-secondary mt-4">
                  Open Tickets
                </Link>
              </article>
            </div>
          </section>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbSchema,
            collectionSchema,
            storefrontListSchema,
            webPageSchema
          ])
        }}
      />
    </>
  );
}
