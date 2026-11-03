"use client";

import { trackProductCtaClick } from "@/lib/product-cta-analytics";

interface AppStoreButtonProps {
  href?: string;
  label?: string;
  ariaLabel?: string;
  className?: string;
  unavailableText?: string;
  tracking?: {
    appSlug: string;
    appName: string;
    source: string;
  };
}

export function AppStoreButton({
  href,
  label = "Download on the App Store",
  ariaLabel,
  className = "",
  unavailableText = "Coming Soon on the App Store",
  tracking
}: AppStoreButtonProps) {
  const hasHref = typeof href === "string" && href.trim().length > 0;
  const buttonLabel = label ?? "Download on the App Store";

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
      aria-label={ariaLabel ?? buttonLabel}
      onClick={() => {
        if (!tracking) return;
        trackProductCtaClick({
          appSlug: tracking.appSlug,
          appName: tracking.appName,
          href,
          label: buttonLabel,
          source: tracking.source
        });
      }}
    >
      {buttonLabel}
    </a>
  );
}
