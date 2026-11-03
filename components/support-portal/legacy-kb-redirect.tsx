"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LegacyKbRedirect({ targetPath }: { targetPath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const targetUrl = useMemo(() => {
    const query = searchParams?.toString();
    return query ? `${targetPath}?${query}` : targetPath;
  }, [searchParams, targetPath]);

  useEffect(() => {
    router.replace(targetUrl);
  }, [router, targetUrl]);

  return (
    <div className="surface-card p-5 text-sm text-fg-secondary">
      <p className="eyebrow">Legacy Knowledge Base Route</p>
      <p className="mt-3 font-semibold text-fg">Tickets have moved</p>
      <p className="mt-2 text-sm leading-6 text-fg-secondary">
        This older knowledge base URL is kept live for compatibility, but the canonical public reference is now the
        tickets library. Redirecting you to the current location.
      </p>
      <a href={targetUrl} className="mt-4 inline-flex items-center text-sm font-semibold text-primary-600 hover:underline dark:text-primary-300">
        Open canonical ticket page →
      </a>
    </div>
  );
}
