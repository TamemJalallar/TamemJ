import Dexie, { type Table } from "dexie";
import type { AnalyticsEvent, Ticket } from "@/types/support";

const DB_NAME = "supportPortalDb";
const DB_VERSION = 1;
const MAX_ANALYTICS_EVENTS = 8000;

interface KVRecord {
  key: string;
  value: string;
}

class SupportPortalDexie extends Dexie {
  tickets!: Table<Ticket, string>;
  analyticsEvents!: Table<AnalyticsEvent, string>;
  kv!: Table<KVRecord, string>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores({
      tickets: "id, updatedAt, createdAt, type, status, priority, category, product",
      analyticsEvents: "id, createdAt, type, area",
      kv: "key"
    });
  }
}

let dbInstance: SupportPortalDexie | null = null;

function canUseIndexedDb(): boolean {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

function getDb(): SupportPortalDexie | null {
  if (!canUseIndexedDb()) {
    return null;
  }

  if (!dbInstance) {
    dbInstance = new SupportPortalDexie();
  }

  return dbInstance;
}

export async function saveTicketsToIndexedDb(tickets: Ticket[]): Promise<void> {
  const db = getDb();
  if (!db) return;

  try {
    await db.transaction("rw", db.tickets, async () => {
      await db.tickets.clear();
      if (tickets.length > 0) {
        await db.tickets.bulkPut(tickets);
      }
    });
  } catch {
    // Best-effort persistence for static demo mode.
  }
}

export async function loadTicketsFromIndexedDb(): Promise<Ticket[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const tickets = await db.tickets.toArray();
    return tickets.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  } catch {
    return [];
  }
}

export async function clearTicketsFromIndexedDb(): Promise<void> {
  const db = getDb();
  if (!db) return;

  try {
    await db.tickets.clear();
  } catch {
    // Best-effort persistence for static demo mode.
  }
}

export async function saveAnalyticsEventsToIndexedDb(events: AnalyticsEvent[]): Promise<void> {
  const db = getDb();
  if (!db) return;

  try {
    await db.transaction("rw", db.analyticsEvents, async () => {
      await db.analyticsEvents.clear();
      if (events.length > 0) {
        await db.analyticsEvents.bulkPut(events.slice(-MAX_ANALYTICS_EVENTS));
      }
    });
  } catch {
    // Best-effort persistence for static demo mode.
  }
}

export async function loadAnalyticsEventsFromIndexedDb(): Promise<AnalyticsEvent[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const events = await db.analyticsEvents.toArray();
    return events.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  } catch {
    return [];
  }
}

export async function appendAnalyticsEventToIndexedDb(event: AnalyticsEvent): Promise<void> {
  const db = getDb();
  if (!db) return;

  try {
    await db.analyticsEvents.put(event);
    const count = await db.analyticsEvents.count();
    if (count > MAX_ANALYTICS_EVENTS) {
      const overflow = count - MAX_ANALYTICS_EVENTS;
      const keys = await db.analyticsEvents.orderBy("createdAt").limit(overflow).primaryKeys();
      if (keys.length > 0) {
        await db.analyticsEvents.bulkDelete(keys as string[]);
      }
    }
  } catch {
    // Best-effort persistence for static demo mode.
  }
}

export async function clearAnalyticsFromIndexedDb(): Promise<void> {
  const db = getDb();
  if (!db) return;

  try {
    await db.analyticsEvents.clear();
  } catch {
    // Best-effort persistence for static demo mode.
  }
}

export async function setIndexedDbMeta(key: string, value: string): Promise<void> {
  const db = getDb();
  if (!db) return;

  try {
    await db.kv.put({ key, value });
  } catch {
    // Best-effort persistence for static demo mode.
  }
}

export async function getIndexedDbMeta(key: string): Promise<string | null> {
  const db = getDb();
  if (!db) return null;

  try {
    const row = await db.kv.get(key);
    return row?.value ?? null;
  } catch {
    return null;
  }
}
