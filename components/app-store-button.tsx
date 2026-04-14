interface AppStoreButtonProps {
  href?: string;
  label?: string;
  ariaLabel?: string;
  className?: string;
  unavailableText?: string;
}

export function AppStoreButton({
  href,
  label = "Download on the App Store",
  ariaLabel,
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
      aria-label={ariaLabel ?? label}
    >
      {label}
    </a>
  );
}
