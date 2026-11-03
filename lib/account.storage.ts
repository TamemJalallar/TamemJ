import type { DownloadEventRecord, TrackDownloadInput } from "@/types/account";

const LOCAL_DOWNLOAD_TRACKING_KEY = "account:download-tracking:v1";
const MAX_LOCAL_EVENTS = 150;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createLocalId(prefix: string): string {
  const uuid = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : null;
  return `${prefix}-${uuid ?? `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`}`;
}

function readLocalEvents(): DownloadEventRecord[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_DOWNLOAD_TRACKING_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as DownloadEventRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalEvents(events: DownloadEventRecord[]): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(LOCAL_DOWNLOAD_TRACKING_KEY, JSON.stringify(events.slice(0, MAX_LOCAL_EVENTS)));
  } catch {
    // Best-effort local persistence.
  }
}

export function getLocalDownloadEvents(userId?: string | null): DownloadEventRecord[] {
  const all = readLocalEvents().sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  if (!userId) {
    return all;
  }
  return all.filter((event) => event.userId === userId);
}

export function trackLocalDownload(userId: string | null, input: TrackDownloadInput): DownloadEventRecord {
  const event: DownloadEventRecord = {
    id: createLocalId("DL"),
    userId: userId ?? "anonymous",
    appSlug: input.appSlug,
    appName: input.appName,
    channelLabel: input.channelLabel,
    channelType: input.channelType,
    platform: input.platform ?? null,
    url: input.url,
    createdAt: new Date().toISOString()
  };

  const existing = readLocalEvents();
  writeLocalEvents([event, ...existing]);
  return event;
}
