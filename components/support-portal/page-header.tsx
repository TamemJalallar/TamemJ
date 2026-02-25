import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/support-portal/breadcrumbs";
import { Breadcrumbs } from "@/components/support-portal/breadcrumbs";

export function SupportPageHeader({
  title,
  description,
  breadcrumbs,
  search,
  actions,
  filters
}: {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  search?: ReactNode;
  actions?: ReactNode;
  filters?: ReactNode;
}) {
  return (
    <header className="mb-6 rounded-2xl border border-line/70 bg-white/90 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {search ? <div className="mt-4">{search}</div> : null}
      {filters ? <div className="mt-4">{filters}</div> : null}
    </header>
  );
}
