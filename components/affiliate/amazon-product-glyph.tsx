import type { AmazonStorefrontProduct } from "@/lib/amazon-storefront";

export function AmazonProductGlyph({
  category
}: {
  category: AmazonStorefrontProduct["category"];
}) {
  const glyphClassName =
    "flex h-12 w-12 items-center justify-center rounded-2xl border border-line/80 bg-card-2 text-fg shadow-soft dark:border-white/10 dark:bg-white/5";

  switch (category) {
    case "Home Lab":
      return (
        <div className={glyphClassName}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="5" y="4" width="14" height="7" rx="2" />
            <rect x="7" y="13" width="10" height="7" rx="1.8" />
            <path d="M9 7.5h6" />
            <path d="M9 16.5h6" />
          </svg>
        </div>
      );
    case "Desk Setup":
      return (
        <div className={glyphClassName}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="4" y="5" width="16" height="6" rx="1.5" />
            <path d="M7 11v8" />
            <path d="M17 11v8" />
            <path d="M4 15h16" />
          </svg>
        </div>
      );
    case "Networking":
      return (
        <div className={glyphClassName}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="4" y="6" width="16" height="5" rx="1.6" />
            <rect x="4" y="13" width="16" height="5" rx="1.6" />
            <path d="M8 8.5h.01" />
            <path d="M12 8.5h.01" />
            <path d="M16 8.5h.01" />
            <path d="M8 15.5h.01" />
            <path d="M12 15.5h.01" />
            <path d="M16 15.5h.01" />
          </svg>
        </div>
      );
    case "Power":
      return (
        <div className={glyphClassName}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M13 2L6 13h5l-1 9 8-12h-5l0-8z" />
          </svg>
        </div>
      );
  }
}
