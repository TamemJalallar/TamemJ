"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { canRenderAdSenseOnPath } from "@/lib/monetization";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function AdSenseSlot({
  client,
  slot,
  label = "Advertisement",
  format = "auto",
  layout,
  className
}: {
  client: string;
  slot: string;
  label?: string;
  format?: "auto" | "fluid";
  layout?: string;
  className?: string;
}) {
  const pushedRef = useRef(false);
  const pathname = usePathname();
  const canRender = canRenderAdSenseOnPath(pathname);

  useEffect(() => {
    if (!client || !slot || !canRender || pushedRef.current) return;

    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.src = src;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushedRef.current = true;
    } catch {
      // Ad blockers or blocked scripts should never break page rendering.
    }
  }, [canRender, client, slot]);

  if (!client || !slot || !canRender) {
    return null;
  }

  return (
    <aside
      className={cx(
        "print:hidden",
        "rounded-3xl border border-line/70 bg-card/80 p-3 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-950/60",
        className
      )}
      aria-label={label}
    >
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
      <ins
        className="adsbygoogle block min-h-24"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
