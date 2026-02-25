import type { AnalyticsEvent, SupportAnalyticsStore, Ticket } from "@/types/support";
import { createLocalId } from "@/lib/support-portal.storage";

const ANALYTICS_STORAGE_KEY = "supportPortal:analytics:v1";
const MAX_EVENTS = 1500;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readAnalyticsStore(): SupportAnalyticsStore {
  if (!isBrowser()) {
    return { version: 1, events: [] };
  }

  try {
    const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) {
      return { version: 1, events: [] };
    }

    const parsed = JSON.parse(raw) as SupportAnalyticsStore;
    return {
      version: 1,
      events: Array.isArray(parsed.events) ? parsed.events : []
    };
  } catch {
    return { version: 1, events: [] };
  }
}

function writeAnalyticsStore(store: SupportAnalyticsStore): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Demo mode best-effort write.
  }
}

export function getSupportAnalyticsStore(): SupportAnalyticsStore {
  return readAnalyticsStore();
}

export function recordAnalyticsEvent(
  event: Omit<AnalyticsEvent, "id" | "createdAt">
): AnalyticsEvent {
  const fullEvent: AnalyticsEvent = {
    ...event,
    id: createLocalId("ANL"),
    createdAt: new Date().toISOString()
  };

  const current = readAnalyticsStore();
  const nextEvents = [...current.events, fullEvent].slice(-MAX_EVENTS);
  writeAnalyticsStore({ version: 1, events: nextEvents });
  return fullEvent;
}

export function resetSupportAnalytics(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ANALYTICS_STORAGE_KEY);
}

export function trackKBArticleView(input: {
  slug: string;
  title: string;
  category: string;
  product: string;
  productFamily: string;
}): void {
  recordAnalyticsEvent({
    type: "kb_view",
    area: "kb",
    payload: {
      slug: input.slug,
      title: input.title,
      category: input.category,
      product: input.product,
      productFamily: input.productFamily
    }
  });
}

export function trackSearch(input: {
  area: AnalyticsEvent["area"];
  query: string;
  resultCount: number;
  context?: string;
}): void {
  const trimmed = input.query.trim();
  if (!trimmed) {
    return;
  }

  recordAnalyticsEvent({
    type: "search",
    area: input.area,
    payload: {
      query: trimmed,
      resultCount: input.resultCount,
      context: input.context ?? null
    }
  });
}

export function trackSearchClick(input: {
  area: "kb" | "catalog";
  query: string;
  clickedSlug: string;
  clickedTitle: string;
  rank: number;
}): void {
  recordAnalyticsEvent({
    type: "search_click",
    area: input.area,
    payload: {
      query: input.query.trim() || null,
      clickedSlug: input.clickedSlug,
      clickedTitle: input.clickedTitle,
      rank: input.rank
    }
  });
}

export function trackKBHelpfulVote(input: {
  slug: string;
  title: string;
  vote: "yes" | "no";
}): void {
  recordAnalyticsEvent({
    type: "kb_helpful_vote",
    area: "kb",
    payload: {
      slug: input.slug,
      title: input.title,
      vote: input.vote
    }
  });
}

export function trackCatalogSubmit(input: {
  slug: string;
  title: string;
  category: string;
  product: string;
}): void {
  recordAnalyticsEvent({
    type: "catalog_submit",
    area: "catalog",
    payload: {
      slug: input.slug,
      title: input.title,
      category: input.category,
      product: input.product
    }
  });
}

export function trackIncidentSubmit(input: {
  category: string;
  subcategory: string;
  product: string;
  priority: string;
}): void {
  recordAnalyticsEvent({
    type: "incident_submit",
    area: "portal",
    payload: {
      category: input.category,
      subcategory: input.subcategory,
      product: input.product,
      priority: input.priority
    }
  });
}

export function trackTicketActivityAdded(input: {
  ticketId: string;
  mode: "note" | "comment";
}): void {
  recordAnalyticsEvent({
    type: input.mode === "note" ? "ticket_note_added" : "ticket_comment_added",
    area: "tickets",
    payload: {
      ticketId: input.ticketId,
      mode: input.mode
    }
  });
}

export function trackAdminAction(action: string): void {
  recordAnalyticsEvent({
    type: "admin_action",
    area: "admin",
    payload: { action }
  });
}

function topCounts(map: Map<string, number>, limit = 5): Array<{ label: string; count: number }> {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

export interface SupportAnalyticsSummary {
  totals: {
    kbViews: number;
    searches: number;
    helpfulYes: number;
    helpfulNo: number;
    catalogSubmissions: number;
    incidentSubmissions: number;
  };
  mostViewedKBArticles: Array<{ label: string; count: number }>;
  mostSearchedIssues: Array<{ label: string; count: number }>;
  topProducts: Array<{ label: string; count: number }>;
  incidentsByPriority: Array<{ label: string; count: number }>;
  topTicketCategories: Array<{ label: string; count: number }>;
}

export function summarizeSupportAnalytics(events: AnalyticsEvent[], tickets: Ticket[]): SupportAnalyticsSummary {
  const kbViewsByTitle = new Map<string, number>();
  const searchesByQuery = new Map<string, number>();
  const productsByCount = new Map<string, number>();
  const incidentsByPriority = new Map<string, number>();
  const categoriesByCount = new Map<string, number>();

  let helpfulYes = 0;
  let helpfulNo = 0;
  let kbViews = 0;
  let searches = 0;
  let catalogSubmissions = 0;
  let incidentSubmissions = 0;

  for (const event of events) {
    if (event.type === "kb_view") {
      kbViews += 1;
      const title = String(event.payload.title ?? event.payload.slug ?? "Unknown KB Article");
      kbViewsByTitle.set(title, (kbViewsByTitle.get(title) ?? 0) + 1);
      const product = String(event.payload.product ?? "Unknown Product");
      productsByCount.set(product, (productsByCount.get(product) ?? 0) + 1);
    }

    if (event.type === "search") {
      searches += 1;
      const query = String(event.payload.query ?? "").trim();
      if (query) {
        searchesByQuery.set(query, (searchesByQuery.get(query) ?? 0) + 1);
      }
    }

    if (event.type === "kb_helpful_vote") {
      const vote = String(event.payload.vote ?? "").toLowerCase();
      if (vote === "yes") {
        helpfulYes += 1;
      } else if (vote === "no") {
        helpfulNo += 1;
      }
    }

    if (event.type === "catalog_submit") {
      catalogSubmissions += 1;
      const product = String(event.payload.product ?? "Unknown Product");
      productsByCount.set(product, (productsByCount.get(product) ?? 0) + 1);
      const category = String(event.payload.category ?? "Unknown Category");
      categoriesByCount.set(category, (categoriesByCount.get(category) ?? 0) + 1);
    }

    if (event.type === "incident_submit") {
      incidentSubmissions += 1;
      const product = String(event.payload.product ?? "Unknown Product");
      const category = String(event.payload.category ?? "Unknown Category");
      const priority = String(event.payload.priority ?? "Unknown Priority");

      productsByCount.set(product, (productsByCount.get(product) ?? 0) + 1);
      categoriesByCount.set(category, (categoriesByCount.get(category) ?? 0) + 1);
      incidentsByPriority.set(priority, (incidentsByPriority.get(priority) ?? 0) + 1);
    }
  }

  for (const ticket of tickets) {
    categoriesByCount.set(ticket.category, (categoriesByCount.get(ticket.category) ?? 0) + 1);
    productsByCount.set(ticket.product, (productsByCount.get(ticket.product) ?? 0) + 1);
    if (ticket.type === "Incident") {
      incidentsByPriority.set(ticket.priority, (incidentsByPriority.get(ticket.priority) ?? 0) + 1);
    }
  }

  return {
    totals: {
      kbViews,
      searches,
      helpfulYes,
      helpfulNo,
      catalogSubmissions,
      incidentSubmissions
    },
    mostViewedKBArticles: topCounts(kbViewsByTitle, 8),
    mostSearchedIssues: topCounts(searchesByQuery, 8),
    topProducts: topCounts(productsByCount, 8),
    incidentsByPriority: topCounts(incidentsByPriority, 4),
    topTicketCategories: topCounts(categoriesByCount, 8)
  };
}
