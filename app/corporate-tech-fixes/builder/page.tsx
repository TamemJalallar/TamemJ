import type { Metadata } from "next";
import Link from "next/link";
import { FixBuilderGate } from "@/components/corporate-fixes/fix-builder-gate";

const BUILDER_AUTH_MODE = (
  process.env.NEXT_PUBLIC_CORPORATE_FIXES_BUILDER_AUTH_MODE ?? "password"
)
  .trim()
  .toLowerCase();
const USES_CLOUDFLARE_ACCESS = BUILDER_AUTH_MODE === "cloudflare-access";

export const metadata: Metadata = {
  title: "Corporate Tech Fixes KB Builder",
  description:
    "Authoring tool for creating Corporate Tech Fixes knowledge base entries and support documentation drafts.",
  alternates: {
    canonical: "/corporate-tech-fixes/builder/"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function CorporateTechFixesBuilderPage() {
  return (
    <section className="section-shell pt-10 sm:pt-14">
      <div className="page-shell">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/corporate-tech-fixes"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            ← Back to Corporate Tech Fixes
          </Link>

          <div
            className={[
              "inline-flex items-center gap-2 self-start rounded-full border px-3 py-1.5 text-xs font-semibold",
              USES_CLOUDFLARE_ACCESS
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200"
                : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
            ].join(" ")}
            aria-label={`Builder authentication mode: ${USES_CLOUDFLARE_ACCESS ? "Cloudflare Access" : "Password"}`}
          >
            <span
              aria-hidden="true"
              className={[
                "inline-block h-2 w-2 rounded-full",
                USES_CLOUDFLARE_ACCESS ? "bg-emerald-500" : "bg-amber-500"
              ].join(" ")}
            />
            {USES_CLOUDFLARE_ACCESS ? "Protected by Cloudflare Access" : "Password Gate Enabled"}
          </div>
        </div>

        <FixBuilderGate />
      </div>
    </section>
  );
}
