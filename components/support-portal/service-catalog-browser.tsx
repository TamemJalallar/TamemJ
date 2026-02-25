"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CatalogItem } from "@/types/support";
import { SupportPageHeader } from "@/components/support-portal/page-header";
import { TopSearchBar } from "@/components/support-portal/top-search-bar";
import { FilterChips } from "@/components/support-portal/filter-chips";
import { trackSearch, trackSearchClick } from "@/lib/support-portal.analytics";

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function ServiceCatalogBrowser({
  items,
  initialQuery = ""
}: {
  items: CatalogItem[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = useMemo(() => uniqueSorted(items.map((item) => item.category)), [items]);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
  }, [initialQuery]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return items.filter((item) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        item.title,
        item.description,
        item.category,
        item.product,
        item.tags.join(" "),
        item.workflowSummary.join(" ")
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, selectedCategories]);

  return (
    <div>
      <SupportPageHeader
        title="Service Catalog"
        description="Request common IT services such as software installs, access requests, mailbox changes, data recovery, VPN access, and device support."
        breadcrumbs={[{ label: "Support Portal", href: "/support" }, { label: "Service Catalog" }]}
        search={
          <TopSearchBar
            value={query}
            onChange={setQuery}
            onSubmit={(value) =>
              trackSearch({ area: "catalog", query: value, resultCount: filtered.length, context: "service-catalog" })
            }
            placeholder="Search catalog items (e.g., VPN access, shared mailbox, software install)"
            buttonLabel="Search Catalog"
          />
        }
        actions={
          <div className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p className="font-semibold text-slate-900 dark:text-slate-100">{filtered.length} items</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Self-service request catalog</p>
          </div>
        }
        filters={
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Categories</p>
              <FilterChips
                options={categories.map((category) => ({ label: category, value: category }))}
                selected={selectedCategories}
                onChange={setSelectedCategories}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedCategories([]);
                }}
                className="btn-secondary h-10 px-4 py-0"
                disabled={!query && selectedCategories.length === 0}
              >
                Reset
              </button>
            </div>
          </div>
        }
      />

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((item, index) => (
            <Link
              key={item.slug}
              href={`/support/catalog/${item.slug}`}
              onClick={() =>
                trackSearchClick({
                  area: "catalog",
                  query,
                  clickedSlug: item.slug,
                  clickedTitle: item.title,
                  rank: index + 1
                })
              }
              className="group rounded-2xl border border-line/70 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card dark:border-slate-800 dark:bg-slate-950/70"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{item.category}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.product}</p>
                </div>
                <span className="text-xs text-slate-400 transition group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300">Open →</span>
              </div>

              <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>

              <div className="mt-4 rounded-xl border border-line/70 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/70">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Expected Fulfillment</p>
                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{item.expectedFulfillmentTime}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.slice(0, 4).map((tag) => (
                  <span key={`${item.slug}-${tag}`} className="inline-flex items-center rounded-full border border-line/70 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No matching catalog items</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try a broader query or remove category filters.</p>
        </div>
      )}
    </div>
  );
}
