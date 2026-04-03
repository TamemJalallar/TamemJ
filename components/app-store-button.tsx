interface AppStoreButtonProps {
  href?: string;
  className?: string;
  unavailableText?: string;
}

export function AppStoreButton({
  href,
  className = "",
  unavailableText = "Coming Soon on the App Store"
}: AppStoreButtonProps) {
  const hasHref = typeof href === "string" && href.trim().length > 0;

  if (!hasHref) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full border border-line bg-card px-4 py-2.5 text-sm font-semibold text-muted ${className}`}
        aria-label={unavailableText}
      >
        {unavailableText}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center rounded-full border border-accent/80 bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition hover:brightness-110 ${className}`}
      aria-label="Download on the App Store"
    >
      Download on the App Store
    </a>
  );
}
