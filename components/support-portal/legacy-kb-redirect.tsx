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
    <div className="rounded-2xl border border-line/70 bg-white p-5 text-sm text-slate-700 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200">
      <p className="font-semibold text-slate-900 dark:text-slate-100">Tickets have moved</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Redirecting you to the new tickets location.
      </p>
      <a href={targetUrl} className="mt-3 inline-flex items-center text-sm font-semibold text-accent hover:underline">
        Open tickets →
      </a>
    </div>
  );
}
