import Link from "next/link";
import { toAbsoluteUrl } from "@/lib/seo";
import { editorialStandards, siteConfig } from "@/lib/site";

interface EditorialTrustPanelProps {
  label?: string;
  authorName: string;
  authorTitle: string;
  credentials: readonly string[];
  lastReviewed: string;
  testedOn?: readonly string[];
  bio?: string;
}

export function EditorialTrustPanel({
  label = "Editorial Trust",
  authorName,
  authorTitle,
  credentials,
  lastReviewed,
  testedOn = [],
  bio
}: EditorialTrustPanelProps) {
  return (
    <section className="rounded-2xl border border-line/70 bg-card-2/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2 text-sm font-semibold text-fg">{authorName}</p>
      <p className="text-xs text-muted">{authorTitle}</p>
      <p className="mt-2 text-xs text-fg-secondary">Last reviewed: {lastReviewed}</p>
      {bio ? <p className="mt-2 text-xs leading-6 text-fg-secondary">{bio}</p> : null}
      <ul className="mt-3 space-y-1 text-xs text-fg-secondary">
        {credentials.slice(0, 3).map((credential) => (
          <li key={`${authorName}-${credential}`} className="leading-6">
            • {credential}
          </li>
        ))}
      </ul>
      {testedOn.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {testedOn.map((environment) => (
            <span
              key={`${authorName}-${environment}`}
              className="inline-flex items-center rounded-full border border-line/70 bg-card-1 px-2.5 py-1 text-[11px] font-semibold text-fg-secondary dark:border-slate-700 dark:bg-slate-950"
            >
              Tested on {environment}
            </span>
          ))}
        </div>
      ) : null}
      <p className="mt-3 text-xs text-muted">
        Reviewed under{` `}
        <Link href={editorialStandards.path} className="font-medium text-primary-600 hover:text-primary-700 hover:underline dark:text-primary-300 dark:hover:text-primary-200">
          {editorialStandards.title}
        </Link>
        .
      </p>
    </section>
  );
}

interface CitationGuidancePanelProps {
  label?: string;
  title?: string;
  canonicalPath: string;
  useCases: readonly string[];
  description?: string;
}

export function CitationGuidancePanel({
  label = "Reference This Page For",
  title = "Best use cases",
  canonicalPath,
  useCases,
  description
}: CitationGuidancePanelProps) {
  const canonicalUrl = toAbsoluteUrl(canonicalPath);

  return (
    <section className="rounded-2xl border border-primary-200/70 bg-primary-50/70 p-4 shadow-soft dark:border-primary-400/25 dark:bg-primary-500/10">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-700 dark:text-primary-200">
        {label}
      </p>
      <h2 className="mt-2 text-sm font-semibold text-fg">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-fg-secondary">{description}</p> : null}
      <ul className="mt-3 space-y-2 text-sm text-fg-secondary">
        {useCases.map((item) => (
          <li key={`${canonicalPath}-${item}`} className="flex gap-2 leading-6">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-xl border border-primary-200/80 bg-white/80 p-3 dark:border-primary-400/25 dark:bg-slate-950/60">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Canonical URL</p>
        <a
          href={canonicalUrl}
          className="mt-2 block break-all font-mono text-xs text-primary-700 hover:underline dark:text-primary-200"
        >
          {canonicalUrl}
        </a>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <Link href={editorialStandards.path} className="btn-secondary !px-3 !py-1.5 text-xs">
          Editorial standards
        </Link>
        <Link href="/llms.txt" className="btn-ghost !px-3 !py-1.5 text-xs">
          AI retrieval guide
        </Link>
      </div>
    </section>
  );
}

interface EditorialStandardsStripProps {
  title?: string;
  description: string;
}

export function EditorialStandardsStrip({
  title = "How this content is reviewed",
  description
}: EditorialStandardsStripProps) {
  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="eyebrow">Trust & Standards</p>
          <h2 className="mt-3 font-display text-xl font-semibold text-fg sm:text-2xl">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-fg-secondary sm:text-base">{description}</p>
        </div>
        <div className="surface-card bg-card-2/70 p-4 text-sm lg:max-w-md">
          <p className="font-semibold text-fg">Publisher</p>
          <p className="mt-1 text-fg-secondary">{siteConfig.name}</p>
          <p className="mt-3 font-semibold text-fg">Standards last updated</p>
          <p className="mt-1 text-fg-secondary">{editorialStandards.lastUpdated}</p>
          <Link href={editorialStandards.path} className="mt-4 inline-flex text-sm font-semibold text-primary-600 hover:underline dark:text-primary-300">
            Read editorial standards →
          </Link>
        </div>
      </div>
    </section>
  );
}
