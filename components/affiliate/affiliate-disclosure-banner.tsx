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
        "alert-warning p-4 shadow-soft",
        className
      )}
      role="note"
      aria-label="Affiliate disclosure"
    >
      <p className="font-semibold">Affiliate Disclosure</p>
      <p className="mt-1 leading-7">
        Some recommendations may include affiliate links. If you purchase through these links, the site
        may earn a commission at no additional cost to you. Recommendations are still selected for fit,
        safety, and support relevance.
      </p>
      {!compact ? (
        <p className="mt-2">
          Link governance and support mappings are documented in the affiliate support guides in{" "}
          <Link
            href="/support/tickets/"
            className="font-semibold underline underline-offset-4"
          >
            Support Tickets
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
