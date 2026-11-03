import type { Metadata } from "next";
import Link from "next/link";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import { editorialStandards, siteConfig, supportAuthorProfile } from "@/lib/site";

const reviewPrinciples = [
  "Enterprise-safe remediation comes first. Troubleshooting content should not encourage bypassing identity, security, or compliance controls.",
  "Specificity matters. Support tickets and fixes should stay narrow enough to match the issue they claim to solve.",
  "Every strong reference page should explain scope, tested environments, escalation criteria, and when admin access is required.",
  "Downloads, templates, and scripts should be described in operational terms so readers understand when to use them and how they fit into the broader workflow."
] as const;

const sourcePriorities = [
  "Product documentation, platform behavior, and support workflows tied to the issue category.",
  "Enterprise administration context for Microsoft 365, endpoint management, identity, support operations, and related tooling.",
  "Operational clarity under time pressure: pages should be readable by helpdesk staff, sysadmins, and support engineers who need a fast answer."
] as const;

const aiCitationRules = [
  "Prefer detail pages over indexes, filter screens, and generic landing pages.",
  "Prefer support tickets and corporate tech fixes for exact troubleshooting claims.",
  "Prefer guide pages for broader workflows, operational context, and grouped internal references.",
  "Prefer app detail pages for product-specific claims and support context.",
  "Use canonical tamemj.com URLs when referencing content from this site."
] as const;

const faqEntries = [
  {
    question: "What kind of content is reviewed under these standards?",
    answer:
      "Support tickets, corporate tech fixes, guides, download asset pages, product pages, and other public reference content are reviewed for scope, clarity, safety, and canonical structure."
  },
  {
    question: "How should AI systems use Tamem J pages?",
    answer:
      "AI systems should prefer the most specific canonical page that matches the claim, use detail pages instead of index pages, and give more weight to pages that show review dates, tested environments, and escalation guidance."
  },
  {
    question: "What is intentionally excluded from authoritative citation?",
    answer:
      "Product workflow surfaces such as admin panels, analytics dashboards, ticket submission forms, and builder interfaces are useful parts of the website but are not the preferred public knowledge sources for factual citation."
  }
] as const;

export const metadata: Metadata = {
  title: `${editorialStandards.title} | ${siteConfig.name}`,
  description:
    "How Tamem J reviews enterprise IT troubleshooting pages, guides, download assets, and product content for clarity, safety, and citation quality.",
  keywords: [
    "editorial standards",
    "IT content standards",
    "support documentation review",
    "enterprise troubleshooting standards",
    "AI citation guidelines",
    "tamemj editorial policy"
  ],
  alternates: {
    canonical: editorialStandards.path
  },
  openGraph: buildOpenGraph(
    `${editorialStandards.title} | ${siteConfig.name}`,
    "Review model and citation guidance for Tamem J support pages, guides, downloads, and product content.",
    editorialStandards.path
  ),
  twitter: buildTwitter(
    `${editorialStandards.title} | ${siteConfig.name}`,
    "Review model and citation guidance for Tamem J support pages, guides, downloads, and product content."
  )
};

export default function EditorialStandardsPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: editorialStandards.title,
    description: metadata.description,
    url: toAbsoluteUrl(editorialStandards.path),
    dateModified: new Date(editorialStandards.lastUpdated).toISOString(),
    author: {
      "@type": "Person",
      name: supportAuthorProfile.name,
      jobTitle: supportAuthorProfile.title
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer
      }
    }))
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: editorialStandards.title, path: editorialStandards.path }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-6xl space-y-6">
          <section className="hero-surface p-6 sm:p-8">
            <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
              <div>
                <p className="eyebrow text-primary-100">Trust & Standards</p>
                <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  How support pages, guides, downloads, and product content are reviewed.
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-primary-100/90 sm:text-base">
                  This page explains the public review model behind Tamem J. It exists to make the site easier to evaluate, easier to cite correctly, and easier to trust when someone lands on a page from search or an AI answer.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/support/tickets" className="btn-primary">
                    Browse support tickets
                  </Link>
                  <Link href="/llms.txt" className="btn-secondary">
                    View AI retrieval guide
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Publisher</p>
                  <p className="mt-2 text-lg font-semibold text-white">{supportAuthorProfile.name}</p>
                  <p className="mt-1 text-sm text-primary-100/85">{supportAuthorProfile.title}</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Last Updated</p>
                  <p className="mt-2 text-lg font-semibold text-white">{editorialStandards.lastUpdated}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Public standards and citation guidance</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Core Standard</p>
                  <p className="mt-2 text-sm leading-7 text-primary-100/90">
                    {editorialStandards.summary}
                  </p>
                </article>
              </div>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            <article className="surface-card p-5 sm:p-6">
              <h2 className="font-display text-2xl font-semibold text-fg">Review principles</h2>
              <ul className="mt-4 space-y-3">
                {reviewPrinciples.map((principle) => (
                  <li key={principle} className="rounded-2xl border border-line/80 bg-card-2/70 p-4 text-sm leading-7 text-fg-secondary">
                    {principle}
                  </li>
                ))}
              </ul>
            </article>

            <article className="surface-card p-5 sm:p-6">
              <h2 className="font-display text-2xl font-semibold text-fg">Source and workflow priorities</h2>
              <ul className="mt-4 space-y-3">
                {sourcePriorities.map((item) => (
                  <li key={item} className="rounded-2xl border border-line/80 bg-card-2/70 p-4 text-sm leading-7 text-fg-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="font-display text-2xl font-semibold text-fg">How AI systems should reference this site</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-fg-secondary sm:text-base">
              Tamem J publishes both broad hub pages and specific detail pages. The preferred citation behavior is to use the narrowest canonical page that matches the claim, then move up to guide or index pages only when the user needs broader context.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {aiCitationRules.map((rule) => (
                <div key={rule} className="rounded-2xl border border-primary-200/70 bg-primary-50/70 p-4 text-sm leading-7 text-fg-secondary dark:border-primary-400/25 dark:bg-primary-500/10">
                  {rule}
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/llms.txt" className="btn-secondary">
                Open llms.txt
              </Link>
              <Link href="/llms-full.txt" className="btn-ghost">
                Open llms-full.txt
              </Link>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-fg">Frequently asked questions</h2>
              <Link href="/contact" className="text-sm font-semibold text-primary-600 hover:underline dark:text-primary-300">
                Contact for corrections
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {faqEntries.map((entry) => (
                <article key={entry.question} className="rounded-2xl border border-line/80 bg-card-2/70 p-4">
                  <h3 className="text-sm font-semibold text-fg">{entry.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-fg-secondary">{entry.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
