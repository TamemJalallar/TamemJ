"use client";

import Link from "next/link";
import type { RelatedContentGroup } from "@/lib/related-content";

export function RelatedContentSection({
  title = "Related Content",
  description,
  groups
}: {
  title?: string;
  description?: string;
  groups: RelatedContentGroup[];
}) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          Internal Links
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {groups.map((group) => (
          <article
            key={group.title}
            className="rounded-2xl border border-line/70 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{group.title}</h3>
                {group.description ? (
                  <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">{group.description}</p>
                ) : null}
              </div>
              {group.href ? (
                <Link href={group.href} className="text-xs font-semibold text-accent hover:underline">
                  View all
                </Link>
              ) : null}
            </div>

            <ul className="mt-4 space-y-2">
              {group.items.map((item) => (
                <li key={`${group.title}-${item.href}`}>
                  <Link
                    href={item.href}
                    className="block rounded-xl border border-line/70 bg-white px-3 py-3 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950/70 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                  >
                    {item.eyebrow ? (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                        {item.eyebrow}
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                    <p className="mt-1 text-xs leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
