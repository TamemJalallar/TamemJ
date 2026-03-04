import type { Metadata } from "next";
import Link from "next/link";
import {
  buildBreadcrumbJsonLd,
  buildOpenGraph,
  buildTwitter,
  toAbsoluteUrl
} from "@/lib/seo";

const phaseOneTrafficActions = [
  "Fix site identity (title, description, schemas) — Week 1",
  "Add HowTo + TechArticle schema to all 212 fix guides — Week 2",
  "Consolidate /corporate-tech-fixes and /support/kb into one URL structure — Week 3",
  "Write 10 articles targeting exact error-message keywords — Weeks 2-8",
  "Add internal links between all existing articles (related fixes, related downloads) — Week 4",
  "Add datePublished/dateModified to all articles — Week 2"
] as const;

const phaseOneRevenueActions = [
  "Integrate AdSense script + placements — Day 1",
  "Create 5 gated templates as lead magnets — Week 3",
  "Set up email collection (ConvertKit/Buttondown) — Week 2",
  "Launch IT Admin Starter Kit bundle page — Week 4",
  "Apply to Veeam, NinjaOne, and IT Glue affiliate programs — Week 1"
] as const;

const phaseTwoTrafficActions = [
  "Publish 5 pillar pages linked to content clusters",
  "Write 30 additional error-message-targeted articles",
  "Create 5 comparison articles with affiliate intent",
  "Build backlinks via HARO, Reddit /r/sysadmin, and Spiceworks",
  "Submit content to IT-focused aggregators/newsletters"
] as const;

const phaseTwoRevenueActions = [
  "Launch premium bundles on Gumroad ($19-$49)",
  "Activate 3-5 SaaS affiliate programs",
  "Optimize AdSense placements based on RPM/CTR data",
  "A/B test lead-magnet CTAs and capture flows"
] as const;

const phaseThreeProductIdeas = [
  "IT Script Runner (browser-based PowerShell execution with parameter forms)",
  "Template Generator (fill-in-the-blank IT documents)",
  "Fix Guide Builder Pro (paid KB builder for IT teams)",
  "IT Dashboard (M365/Entra-integrated operations dashboard)",
  "Compliance Tracker SaaS (SOX/ISO audit tracking)"
] as const;

const revenueTargets = [
  {
    goal: "$1,000/month",
    monthlyTrafficNeeded: "~30,000 sessions",
    monetizationMix: "AdSense ($300) + Affiliates ($400) + Digital products ($300)"
  },
  {
    goal: "$5,000/month",
    monthlyTrafficNeeded: "~80,000 sessions",
    monetizationMix: "AdSense ($1,200) + Affiliates ($2,000) + Products ($1,800)"
  },
  {
    goal: "$10,000/month",
    monthlyTrafficNeeded: "~150,000 sessions",
    monetizationMix:
      "AdSense ($2,500) + Affiliates ($3,500) + Products ($2,500) + SaaS ($1,500)"
  }
] as const;

const whyThisSiteMightFail = [
  "Identity confusion will kill growth. Search engines and visitors should see one clear positioning: enterprise IT troubleshooting.",
  "The ServiceNow-style portal is strong engineering, but those pages do not drive organic discovery by default.",
  "The broad consumer downloads strategy is a weak SEO battleground versus dominant incumbents.",
  "An apps-first brand promise with no published apps creates a trust gap.",
  "No email list means no owned distribution or resilience against ranking volatility.",
  "Crypto donations are support-only, not a primary monetization channel."
] as const;

const nicheCompetitors = [
  "Practical365.com",
  "AdamTheAutomator.com",
  "TheITBros.com",
  "LazyAdmin.nl",
  "Spiceworks"
] as const;

const underestimatedFactors = [
  "Content volume required: 500+ high-quality fix articles is a realistic authority target for this niche.",
  "Exact-match error content impact: targeted pages like AADSTS/Intune/Entra errors can produce compounding traffic.",
  "SEO timeline: expect 6-12 months for durable traction on a newer domain."
] as const;

const structuralLimits = [
  "No server-side ad optimization",
  "No A/B testing framework",
  "No personalization at request time",
  "Limited API-backed lead capture and analytics workflows"
] as const;

const commonMistake = `Most IT sites write for peers instead of the searcher in panic mode. Lead with the fix in under 30 seconds, then add context, then provide tool/template recommendations.`;

export const metadata: Metadata = {
  title: "Revenue Scaling Roadmap",
  description:
    "24-month revenue roadmap for an enterprise IT troubleshooting site: SEO growth, affiliate monetization, digital products, and SaaS productization milestones.",
  keywords: [
    "it blog monetization roadmap",
    "it troubleshooting site revenue",
    "adsense affiliate digital products",
    "enterprise IT SEO roadmap",
    "it content monetization",
    "it affiliate strategy",
    "saas productization roadmap"
  ],
  alternates: {
    canonical: "/guides/revenue-scaling-roadmap/"
  },
  openGraph: buildOpenGraph(
    "Revenue Scaling Roadmap | Tamem J",
    "24-month roadmap for scaling IT support content into ad, affiliate, product, and SaaS revenue.",
    "/guides/revenue-scaling-roadmap/"
  ),
  twitter: buildTwitter(
    "Revenue Scaling Roadmap | Tamem J",
    "24-month roadmap for scaling IT support content into ad, affiliate, product, and SaaS revenue."
  )
};

export default function RevenueScalingRoadmapPage() {
  const roadmapSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Revenue Scaling Roadmap",
    description:
      "Phased growth and monetization roadmap for an enterprise IT troubleshooting site.",
    url: toAbsoluteUrl("/guides/revenue-scaling-roadmap/"),
    inLanguage: "en",
    articleSection: "Business Strategy"
  };

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "IT Pillar Guides", path: "/guides/" },
    { name: "Revenue Scaling Roadmap", path: "/guides/revenue-scaling-roadmap/" }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-6xl space-y-6">
          <div>
            <Link
              href="/guides"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              ← Back to IT Pillar Guides
            </Link>
          </div>

          <section className="surface-card-strong p-6 sm:p-8">
            <p className="eyebrow">Monetization Strategy</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
              Revenue Scaling Roadmap
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              A phased 24-month framework to scale traffic and revenue using SEO content expansion,
              affiliate optimization, digital product bundles, and eventual SaaS productization.
            </p>
          </section>

          <section className="grid gap-5 xl:grid-cols-3">
            <article className="surface-card p-5 sm:p-6 xl:col-span-1">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Phase 1 (Months 0-3)</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Quick wins and foundation setup.</p>
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Traffic Actions
              </h3>
              <ul className="mt-2 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
                {phaseOneTrafficActions.map((item) => (
                  <li key={item} className="list-disc">
                    {item}
                  </li>
                ))}
              </ul>
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Revenue Actions
              </h3>
              <ul className="mt-2 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
                {phaseOneRevenueActions.map((item) => (
                  <li key={item} className="list-disc">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-xl border border-line/80 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                Target: 5,000 organic sessions/month, $50-$150/month AdSense, 200 email subscribers.
              </p>
            </article>

            <article className="surface-card p-5 sm:p-6 xl:col-span-1">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Phase 2 (Months 3-9)</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Authority building and conversion growth.</p>
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Traffic Actions
              </h3>
              <ul className="mt-2 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
                {phaseTwoTrafficActions.map((item) => (
                  <li key={item} className="list-disc">
                    {item}
                  </li>
                ))}
              </ul>
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Revenue Actions
              </h3>
              <ul className="mt-2 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
                {phaseTwoRevenueActions.map((item) => (
                  <li key={item} className="list-disc">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-xl border border-line/80 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                Target: 25,000 organic sessions/month, $300-$800/month (AdSense + affiliates + digital products).
              </p>
            </article>

            <article className="surface-card p-5 sm:p-6 xl:col-span-1">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Phase 3 (Months 9-24)</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Productization and recurring revenue.</p>
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                SaaS Feature Ideas
              </h3>
              <ul className="mt-2 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
                {phaseThreeProductIdeas.map((item) => (
                  <li key={item} className="list-disc">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-xl border border-line/80 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                Assumption basis: $8-$15 RPM for IT content and 2%-5% conversion on gated content.
              </p>
            </article>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Revenue Targets</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line/80 dark:border-slate-700">
                    <th className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Revenue Goal</th>
                    <th className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Monthly Traffic Needed</th>
                    <th className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Monetization Mix</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueTargets.map((target) => (
                    <tr key={target.goal} className="border-b border-line/60 dark:border-slate-800">
                      <td className="px-2 py-2 font-medium text-slate-900 dark:text-slate-100">{target.goal}</td>
                      <td className="px-2 py-2 text-slate-600 dark:text-slate-300">{target.monthlyTrafficNeeded}</td>
                      <td className="px-2 py-2 text-slate-600 dark:text-slate-300">{target.monetizationMix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="surface-card-strong p-5 sm:p-6">
            <p className="eyebrow">Section 10</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">Brutal Truth</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              This is the execution-risk view of the roadmap. It is intentionally direct and should be used as a
              focus filter for what to build next.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <article className="rounded-2xl border border-line/80 bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Why This Site Might Fail</h3>
                <ul className="mt-3 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
                  {whyThisSiteMightFail.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-line/80 bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Competitors That Currently Outperform
                </h3>
                <ul className="mt-3 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
                  {nicheCompetitors.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  They win by maintaining one identity, sustained publishing velocity, and owned audience channels.
                </p>
              </article>

              <article className="rounded-2xl border border-line/80 bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">What You&apos;re Underestimating</h3>
                <ul className="mt-3 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
                  {underestimatedFactors.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-line/80 bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Structural Flaw Limiting Revenue (Static Export)
                </h3>
                <ul className="mt-3 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
                  {structuralLimits.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  GitHub Pages is excellent for cost. Migrate to Cloudflare Pages or Vercel once you need server-side
                  experimentation, personalization, and capture flows.
                </p>
              </article>
            </div>

            <article className="mt-5 rounded-2xl border border-amber-300/70 bg-amber-50/70 p-4 dark:border-amber-500/40 dark:bg-amber-950/30">
              <h3 className="text-base font-semibold text-amber-900 dark:text-amber-200">What Most IT Sites Do Wrong</h3>
              <p className="mt-2 text-sm leading-7 text-amber-900/90 dark:text-amber-100/90">{commonMistake}</p>
            </article>
          </section>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roadmapSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
