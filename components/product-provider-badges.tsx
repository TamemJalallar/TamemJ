import type { ProductProviderBadge, ProductProviderStatus } from "@/types/app";

interface ProductProviderBadgesProps {
  badges: ProductProviderBadge[];
}

const statusClasses: Record<ProductProviderStatus, string> = {
  Supported:
    "border-success-100 bg-success-50 text-success-700 dark:border-success-500/25 dark:bg-success-500/12 dark:text-green-200",
  Optional:
    "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-500/25 dark:bg-primary-500/12 dark:text-primary-200",
  Mock:
    "border-accent-200 bg-accent-50 text-accent-800 dark:border-accent-400/25 dark:bg-accent-500/12 dark:text-accent-100",
  Planned:
    "border-line bg-card-2 text-fg-secondary dark:border-line dark:bg-card-2/80 dark:text-fg-secondary"
};

const providerAccentClasses: Record<string, string> = {
  yahoo: "from-violet-500 to-purple-700",
  espn: "from-red-500 to-rose-700",
  sleeper: "from-cyan-500 to-blue-700",
  "mock mode": "from-slate-500 to-slate-800"
};

function getProviderAccent(name: string): string {
  return providerAccentClasses[name.trim().toLowerCase()] ?? "from-primary-500 to-accent-600";
}

export function ProductProviderBadges({ badges }: ProductProviderBadgesProps) {
  if (badges.length === 0) return null;

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Provider Support</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-fg">
            Fantasy platforms this product can work with
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-fg-secondary">
            These badges show which fantasy providers or test modes are supported by the overlay workflow.
          </p>
        </div>
        <span className="filter-chip w-fit px-3 py-1.5 text-xs">{badges.length} options</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {badges.map((badge) => (
          <article key={`${badge.name}-${badge.status}`} className="surface-card-interactive rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getProviderAccent(
                  badge.name
                )} text-sm font-bold text-white shadow-soft`}
                aria-hidden="true"
              >
                {badge.name
                  .split(/\s+/)
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-fg">{badge.name}</h3>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                      statusClasses[badge.status]
                    }`}
                  >
                    {badge.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-fg-secondary">{badge.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
