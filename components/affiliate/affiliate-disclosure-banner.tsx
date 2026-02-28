import Link from "next/link";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function AffiliateDisclosureBanner({
  compact = false,
  className
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-sm shadow-soft dark:border-amber-900/60 dark:bg-amber-950/20",
        className
      )}
      role="note"
      aria-label="Affiliate disclosure"
    >
      <p className="font-semibold text-amber-900 dark:text-amber-200">Affiliate Disclosure</p>
      <p className="mt-1 leading-7 text-amber-800 dark:text-amber-100">
        Some recommendations may include affiliate links. If you purchase through these links, the site
        may earn a commission at no additional cost to you. Recommendations are still selected for fit,
        safety, and support relevance.
      </p>
      {!compact ? (
        <p className="mt-2 text-amber-800 dark:text-amber-100">
          Link governance and support mappings are documented in the affiliate support guides in{" "}
          <Link href="/support/kb/" className="font-semibold underline decoration-amber-600/60 underline-offset-4">
            Support KB
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
