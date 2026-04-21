import Link from "next/link";

interface FattFootballLinkFallbackProps {
  eyebrow: string;
  title: string;
  description: string;
  pathLabel: string;
}

export function FattFootballLinkFallback({
  eyebrow,
  title,
  description,
  pathLabel
}: FattFootballLinkFallbackProps) {
  return (
    <section className="section-shell pt-10 sm:pt-14">
      <div className="page-shell max-w-4xl space-y-6">
        <Link href="/apps/fantasy-football-hub/" className="text-sm font-medium text-fg-secondary transition hover:text-fg">
          ← Back to FATT Football
        </Link>

        <section className="hero-surface p-6 sm:p-8 lg:p-10">
          <p className="eyebrow text-primary-100">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-primary-100/90 sm:text-base">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/apps/fantasy-football-hub/" className="btn-primary">
              View App Page
            </Link>
            <Link href="/support?app=fantasy-football-hub" className="btn-secondary">
              Support
            </Link>
          </div>
        </section>

        <section className="surface-card p-5 sm:p-6">
          <p className="eyebrow">Universal Link Fallback</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-fg">This link is configured for the iPhone app</h2>
          <p className="mt-3 text-sm leading-7 text-fg-secondary sm:text-base">
            If FATT Football is installed, supported links can open directly inside the app. If it is not installed, this web fallback explains what the link is for.
          </p>
          <code className="mt-5 block overflow-x-auto rounded-2xl border border-line bg-card-2 px-4 py-3 font-mono text-sm text-fg-secondary">
            {pathLabel}
          </code>
        </section>
      </div>
    </section>
  );
}
