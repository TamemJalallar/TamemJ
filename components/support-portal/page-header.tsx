import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/support-portal/breadcrumbs";
import { Breadcrumbs } from "@/components/support-portal/breadcrumbs";

export function SupportPageHeader({
  title,
  description,
  showDescription = false,
  breadcrumbs,
  search,
  actions,
  filters
}: {
  title: string;
  description?: string;
  showDescription?: boolean;
  breadcrumbs: BreadcrumbItem[];
  search?: ReactNode;
  actions?: ReactNode;
  filters?: ReactNode;
}) {
  return (
    <header className="mb-6 surface-card p-4 sm:p-5">
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fg sm:text-3xl">{title}</h1>
          {showDescription && description ? (
            <p className="mt-2 max-w-3xl text-sm leading-7 text-fg-secondary sm:text-base">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {search ? <div className="mt-4">{search}</div> : null}
      {filters ? <div className="mt-4">{filters}</div> : null}
    </header>
  );
}
