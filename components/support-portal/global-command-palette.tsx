"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { buildFuzzyIndex, runFuzzySearch } from "@/lib/fuzzy-search";
import { trackSearch } from "@/lib/support-portal.analytics";

interface PaletteItem {
  id: string;
  label: string;
  description: string;
  href: string;
  group: "Quick" | "Knowledge Base" | "Catalog" | "Downloads" | "Guides" | "AI Agents";
  keywords: string[];
}

const quickItems: PaletteItem[] = [
  {
    id: "quick-support-home",
    label: "Support Home",
    description: "Open support portal home",
    href: "/support/",
    group: "Quick",
    keywords: ["support", "home", "portal"]
  },
  {
    id: "quick-kb",
    label: "Knowledge Base",
    description: "Browse troubleshooting guides",
    href: "/support/kb/",
    group: "Quick",
    keywords: ["kb", "knowledge", "troubleshooting"]
  },
  {
    id: "quick-incident",
    label: "Incident Form",
    description: "Submit a new incident",
    href: "/support/incident/new/",
    group: "Quick",
    keywords: ["incident", "ticket", "submit", "form"]
  },
  {
    id: "quick-tickets",
    label: "My Tickets",
    description: "View all local tickets",
    href: "/support/tickets/",
    group: "Quick",
    keywords: ["tickets", "incidents", "requests"]
  },
  {
    id: "quick-downloads",
    label: "Downloads",
    description: "Open curated downloads",
    href: "/downloads/",
    group: "Quick",
    keywords: ["downloads", "software", "apps"]
  },
  {
    id: "quick-download-assets",
    label: "IT Download Assets",
    description: "Open scripts, templates, and checklists",
    href: "/downloads/assets/",
    group: "Quick",
    keywords: ["downloads", "assets", "scripts", "templates", "checklists"]
  },
  {
    id: "quick-account",
    label: "Account",
    description: "Open sign-in and profile dashboard",
    href: "/account/",
    group: "Quick",
    keywords: ["account", "profile", "sign in", "auth"]
  },
  {
    id: "quick-guides",
    label: "IT Pillar Guides",
    description: "Open SEO pillar and cluster guide pages",
    href: "/guides/",
    group: "Quick",
    keywords: ["guides", "pillar", "clusters", "seo", "content"]
  },
  {
    id: "quick-ai-prompts",
    label: "AI Prompts",
    description: "Open the multi-model prompt builder",
    href: "/ai-prompts/",
    group: "Quick",
    keywords: ["prompts", "chatgpt", "claude", "perplexity", "grok", "meta ai", "adobe genai"]
  },
  {
    id: "quick-ai-agents",
    label: "AI Agents",
    description: "Browse copy-ready professional AI agent system prompts",
    href: "/ai-agents/",
    group: "Quick",
    keywords: ["ai agents", "system prompts", "roles", "prompt library"]
  },
  {
    id: "quick-revenue-roadmap",
    label: "Revenue Scaling Roadmap",
    description: "Open 0-24 month growth and monetization plan",
    href: "/guides/revenue-scaling-roadmap/",
    group: "Quick",
    keywords: ["revenue", "roadmap", "adsense", "affiliates", "gumroad", "saas"]
  }
];

export function GlobalCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dynamicItems, setDynamicItems] = useState<PaletteItem[]>([]);
  const [loadingRegistry, setLoadingRegistry] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const allItems = useMemo(() => [...quickItems, ...dynamicItems], [dynamicItems]);

  const fuzzyIndex = useMemo(() => {
    return buildFuzzyIndex(allItems, {
      keys: [
        { name: "label", weight: 0.45 },
        { name: "description", weight: 0.2 },
        { name: "keywords", weight: 0.25 },
        { name: "group", weight: 0.1 }
      ],
      threshold: 0.34
    });
  }, [allItems]);

  const results = useMemo(() => {
    const normalized = deferredQuery.trim();
    if (!normalized) {
      return allItems.slice(0, 80);
    }

    const fuzzyResults = runFuzzySearch(fuzzyIndex, normalized, 80).map((entry) => entry.item);
    if (fuzzyResults.length > 0) {
      return fuzzyResults;
    }

    return allItems.filter((item) => {
      const haystack = [item.label, item.description, item.group, item.keywords.join(" ")]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized.toLowerCase());
    });
  }, [allItems, deferredQuery, fuzzyIndex]);

  const groupedResults = useMemo(() => {
    const groups = new Map<PaletteItem["group"], PaletteItem[]>();
    for (const item of results) {
      const current = groups.get(item.group) ?? [];
      current.push(item);
      groups.set(item.group, current);
    }
    return groups;
  }, [results]);

  const loadDynamicItems = useCallback(async () => {
    if (loadingRegistry || dynamicItems.length > 0) {
      return;
    }

    setLoadingRegistry(true);

    const [kbModule, catalogModule, downloadsModule, downloadAssetsModule, seoContentModule, aiAgentsModule] =
      await Promise.all([
      import("@/lib/support.kb.registry"),
      import("@/lib/support.catalog.registry"),
      import("@/lib/downloads.registry"),
      import("@/lib/download-assets.registry"),
      import("@/lib/seo-content.registry"),
      import("@/lib/aiAgents.registry")
    ]);

    const kbItems: PaletteItem[] = kbModule.getKBArticles().map((article) => ({
      id: `kb-${article.slug}`,
      label: article.title,
      description: `${article.category} • ${article.product}`,
      href: `/support/kb/${article.slug}/`,
      group: "Knowledge Base",
      keywords: [article.productFamily, article.category, ...article.tags]
    }));

    const catalogItems: PaletteItem[] = catalogModule.getCatalogItems().map((item) => ({
      id: `catalog-${item.slug}`,
      label: item.title,
      description: `${item.category} • ${item.product}`,
      href: `/support/catalog/${item.slug}/`,
      group: "Catalog",
      keywords: [item.category, item.product, ...item.tags]
    }));

    const downloadItems: PaletteItem[] = downloadsModule.getDownloads().map((item) => ({
      id: `download-${item.slug}`,
      label: item.name,
      description: `${item.category} • ${item.platforms.join(", ")}`,
      href: `/downloads/#${item.slug}`,
      group: "Downloads",
      keywords: [item.category, ...item.tags, ...item.platforms]
    }));

    const downloadAssetItems: PaletteItem[] = downloadAssetsModule.getDownloadAssets().map((asset) => ({
      id: `download-asset-${asset.slug}`,
      label: asset.title,
      description: `${asset.category} • ${asset.format.toUpperCase()} • ${asset.access}`,
      href: `/downloads/assets/${asset.slug}/`,
      group: "Downloads",
      keywords: [asset.category, asset.format, asset.access, asset.searchDemand, ...asset.tags]
    }));

    const guideItems: PaletteItem[] = seoContentModule.getPillarContentIdeas().map((guide) => ({
      id: `guide-${guide.slug}`,
      label: guide.title,
      description: "IT Pillar Guide",
      href: `/guides/${guide.slug}/`,
      group: "Guides",
      keywords: [...guide.targetKeywords, ...guide.relatedTerms]
    }));

    const aiAgentItems: PaletteItem[] = aiAgentsModule.getAiAgentsRegistry().map((agent) => ({
      id: `ai-agent-${agent.slug}`,
      label: agent.title,
      description: `${agent.category} • ${agent.expertiseLevel}`,
      href: `/ai-agents/#${agent.slug}`,
      group: "AI Agents",
      keywords: [agent.role, agent.category, agent.expertiseLevel, ...agent.tags]
    }));

    startTransition(() => {
      setDynamicItems([
        ...kbItems,
        ...catalogItems,
        ...downloadItems,
        ...downloadAssetItems,
        ...guideItems,
        ...aiAgentItems
      ]);
    });
    setLoadingRegistry(false);
  }, [dynamicItems.length, loadingRegistry]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      void loadDynamicItems();
    } else {
      setQuery("");
    }
  }, [open, loadDynamicItems]);

  useEffect(() => {
    const normalized = deferredQuery.trim();
    if (!normalized) {
      return;
    }

    trackSearch({
      area: "portal",
      query: normalized,
      resultCount: results.length,
      context: "command-palette"
    });
  }, [deferredQuery, results.length]);

  function handleSelect(item: PaletteItem) {
    setOpen(false);
    setQuery("");
    router.push(item.href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-30 hidden rounded-full border border-line/80 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-card backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100 dark:hover:bg-slate-900 sm:inline-flex"
        aria-label="Open command palette"
      >
        Cmd/Ctrl + K
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global command palette"
        className="fixed left-1/2 top-20 z-[90] w-[95vw] max-w-2xl -translate-x-1/2 overflow-hidden rounded-2xl border border-line/80 bg-white shadow-[0_20px_65px_rgba(15,23,42,0.35)] dark:border-slate-700 dark:bg-slate-950"
      >
        <div className="border-b border-line/70 px-3 py-2 dark:border-slate-800">
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search KBs, downloads, AI agents, catalog items, tickets, and forms..."
            className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <Command.List className="max-h-[58vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-sm text-slate-600 dark:text-slate-300">
            No matches. Try shorter keywords.
          </Command.Empty>

          {loadingRegistry && dynamicItems.length === 0 ? (
            <div className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400">Loading support index...</div>
          ) : null}

          {Array.from(groupedResults.entries()).map(([group, items]) => (
            <Command.Group key={group} heading={group} className="mb-2">
              {items.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`${item.label} ${item.description} ${item.keywords.join(" ")}`}
                  onSelect={() => handleSelect(item)}
                  className="group flex cursor-pointer items-center justify-between rounded-xl border border-transparent px-3 py-2 text-sm text-slate-700 data-[selected=true]:border-slate-300 data-[selected=true]:bg-slate-100 data-[selected=true]:text-slate-900 dark:text-slate-200 dark:data-[selected=true]:border-slate-700 dark:data-[selected=true]:bg-slate-900 dark:data-[selected=true]:text-slate-100"
                >
                  <span className="truncate font-medium">{item.label}</span>
                  <span className="ml-3 truncate text-xs text-slate-500 dark:text-slate-400">{item.description}</span>
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command.Dialog>
    </>
  );
}
