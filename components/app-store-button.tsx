interface AppStoreButtonProps {
  href: string;
  className?: string;
}

export function AppStoreButton({ href, className = "" }: AppStoreButtonProps) {
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
