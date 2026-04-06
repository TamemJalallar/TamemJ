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
        className={`btn-secondary cursor-default ${className}`}
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
      className={`btn-primary ${className}`}
      aria-label="Download on the App Store"
    >
      Download on the App Store
    </a>
  );
}
