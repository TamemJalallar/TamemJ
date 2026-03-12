interface AppStoreButtonProps {
  href?: string;
  className?: string;
  unavailableLabel?: string;
}

export function AppStoreButton({
  href,
  className = "",
  unavailableLabel = "App Store Coming Soon"
}: AppStoreButtonProps) {
  if (!href) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full border border-line bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 ${className}`}
        aria-label={unavailableLabel}
      >
        {unavailableLabel}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 ${className}`}
      aria-label="Download on the App Store"
    >
      Download on the App Store
    </a>
  );
}
