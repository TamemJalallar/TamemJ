export interface ProductCtaEvent {
  id: string;
  appSlug: string;
  appName: string;
  label: string;
  href: string;
  source: string;
  createdAt: string;
}

const STORAGE_KEY = "tamemj:product-cta-events:v1";
const MAX_EVENTS = 250;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function readEvents(): ProductCtaEvent[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function trackProductCtaClick(input: Omit<ProductCtaEvent, "id" | "createdAt">): void {
  if (typeof window === "undefined") return;

  const event: ProductCtaEvent = {
    ...input,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString()
  };

  try {
    const nextEvents = [...readEvents(), event].slice(-MAX_EVENTS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEvents));
  } catch {
    // Tracking should never block navigation.
  }

  window.gtag?.("event", "product_cta_click", {
    app_slug: input.appSlug,
    app_name: input.appName,
    link_label: input.label,
    link_url: input.href,
    source: input.source
  });
}
