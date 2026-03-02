import type {
  KBHelpfulVotesStore,
  SupportPortalState,
  Ticket,
  TicketActivityEntry,
  TicketStatus
} from "@/types/support";
import {
  clearTicketsFromIndexedDb,
  loadTicketsFromIndexedDb,
  saveTicketsToIndexedDb
} from "@/lib/support-portal.db";

const STORAGE_KEYS = {
  tickets: "supportPortal:tickets:v1",
  portalState: "supportPortal:state:v1",
  kbHelpfulVotes: "supportPortal:kbHelpfulVotes:v1"
} as const;

const STORAGE_EVENTS = {
  ticketsUpdated: "supportPortal:tickets:updated"
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function emitStorageEvent(name: string): void {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(name));
}

export function createLocalId(prefix: string): string {
  const uuid = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : null;
  const suffix = uuid ?? `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  return `${prefix}-${suffix}`;
}

function readLocalJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocalJson<T>(key: string, value: T): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or serialization failures in demo mode.
  }
}

function queueSaveTicketsToIndexedDb(tickets: Ticket[]): void {
  void saveTicketsToIndexedDb(tickets);
}

let ticketsHydrationStarted = false;

function queueHydrateTicketsFromIndexedDb(): void {
  if (!isBrowser() || ticketsHydrationStarted) {
    return;
  }
  ticketsHydrationStarted = true;

  void loadTicketsFromIndexedDb().then((tickets) => {
    if (tickets.length === 0) {
      return;
    }

    const current = readLocalJson<Ticket[]>(STORAGE_KEYS.tickets, []);
    if (current.length > 0) {
      return;
    }

    writeLocalJson(STORAGE_KEYS.tickets, tickets);
    emitStorageEvent(STORAGE_EVENTS.ticketsUpdated);
  });
}

const defaultPortalState: SupportPortalState = {
  version: 1,
  adminEnabled: false,
  sidebarCollapsed: false
};

export function getSupportPortalState(): SupportPortalState {
  const state = readLocalJson<SupportPortalState>(STORAGE_KEYS.portalState, defaultPortalState);

  return {
    ...defaultPortalState,
    ...state,
    version: 1
  };
}

export function updateSupportPortalState(
  patch: Partial<Omit<SupportPortalState, "version">>
): SupportPortalState {
  const nextState = {
    ...getSupportPortalState(),
    ...patch,
    version: 1 as const
  };

  writeLocalJson(STORAGE_KEYS.portalState, nextState);
  return nextState;
}

export function isSupportAdminEnabled(): boolean {
  return getSupportPortalState().adminEnabled;
}

export function setSupportAdminEnabled(enabled: boolean): SupportPortalState {
  return updateSupportPortalState({ adminEnabled: enabled });
}

export function setSupportSidebarCollapsed(collapsed: boolean): SupportPortalState {
  return updateSupportPortalState({ sidebarCollapsed: collapsed });
}

export function getStoredTickets(): Ticket[] {
  queueHydrateTicketsFromIndexedDb();
  const tickets = readLocalJson<Ticket[]>(STORAGE_KEYS.tickets, []);

  return [...tickets].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getStoredTicketsIndexedDbFirst(): Promise<Ticket[]> {
  if (!isBrowser()) {
    return [];
  }

  const indexedDbTickets = await loadTicketsFromIndexedDb();
  if (indexedDbTickets.length > 0) {
    writeLocalJson(STORAGE_KEYS.tickets, indexedDbTickets);
    emitStorageEvent(STORAGE_EVENTS.ticketsUpdated);
    return [...indexedDbTickets].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }

  return getStoredTickets();
}

export function subscribeToStoredTickets(callback: () => void): () => void {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handler = () => callback();
  window.addEventListener(STORAGE_EVENTS.ticketsUpdated, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(STORAGE_EVENTS.ticketsUpdated, handler);
    window.removeEventListener("storage", handler);
  };
}

function saveStoredTickets(tickets: Ticket[]): void {
  writeLocalJson(STORAGE_KEYS.tickets, tickets);
  queueSaveTicketsToIndexedDb(tickets);
  emitStorageEvent(STORAGE_EVENTS.ticketsUpdated);
}

function createSimplifiedTicketId(type: Ticket["type"], existingTickets: Ticket[]): string {
  const prefix = type === "Incident" ? "INC" : "REQ";
  const startNumber = type === "Incident" ? 1000 : 2000;
  const idPattern = new RegExp(`^${prefix}-(\\d+)$`);
  const usedIds = new Set(existingTickets.map((ticket) => ticket.id));
  let maxNumber = startNumber - 1;

  for (const ticket of existingTickets) {
    const match = ticket.id.match(idPattern);
    if (!match) {
      continue;
    }

    const parsed = Number.parseInt(match[1], 10);
    if (Number.isFinite(parsed) && parsed > maxNumber) {
      maxNumber = parsed;
    }
  }

  let nextNumber = maxNumber + 1;
  let candidate = `${prefix}-${nextNumber}`;

  while (usedIds.has(candidate)) {
    nextNumber += 1;
    candidate = `${prefix}-${nextNumber}`;
  }

  return candidate;
}

export interface CreateTicketInput {
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;
  type: Ticket["type"];
  priority: Ticket["priority"];
  impact: Ticket["impact"];
  urgency: Ticket["urgency"];
  category: string;
  subcategory?: string;
  product: string;
  summary: string;
  description: string;
  preferredContactMethod: Ticket["preferredContactMethod"];
  attachments?: string[];
  catalogItemSlug?: string;
  requestedFields?: Record<string, string | string[] | boolean>;
}

export function createTicket(input: CreateTicketInput): Ticket {
  const now = new Date().toISOString();
  const current = getStoredTickets();
  const ticketId = createSimplifiedTicketId(input.type, current);

  const createdTicket: Ticket = {
    id: ticketId,
    createdAt: now,
    updatedAt: now,
    requesterName: input.requesterName.trim(),
    requesterPhone: input.requesterPhone.trim(),
    requesterEmail: input.requesterEmail.trim(),
    type: input.type,
    status: "New",
    priority: input.priority,
    impact: input.impact,
    urgency: input.urgency,
    category: input.category,
    subcategory: input.subcategory,
    product: input.product,
    summary: input.summary.trim(),
    description: input.description.trim(),
    preferredContactMethod: input.preferredContactMethod,
    attachments: input.attachments ?? [],
    catalogItemSlug: input.catalogItemSlug,
    requestedFields: input.requestedFields,
    activityLog: [
      {
        id: createLocalId("ACT"),
        createdAt: now,
        actor: "System",
        type: "created",
        message:
          input.type === "Incident"
            ? "Incident submitted through the demo support portal."
            : "Service request submitted through the demo catalog."
      }
    ]
  };

  saveStoredTickets([createdTicket, ...current]);
  return createdTicket;
}

export function updateTicket(ticketId: string, updater: (ticket: Ticket) => Ticket): Ticket | null {
  const current = getStoredTickets();
  let updatedTicket: Ticket | null = null;

  const next = current.map((ticket) => {
    if (ticket.id !== ticketId) {
      return ticket;
    }

    updatedTicket = {
      ...updater(ticket),
      updatedAt: new Date().toISOString()
    };

    return updatedTicket;
  });

  if (!updatedTicket) {
    return null;
  }

  saveStoredTickets(next);
  return updatedTicket;
}

export function addTicketActivity(
  ticketId: string,
  activity: Omit<TicketActivityEntry, "id" | "createdAt">
): Ticket | null {
  return updateTicket(ticketId, (ticket) => ({
    ...ticket,
    activityLog: [
      {
        ...activity,
        id: createLocalId("ACT"),
        createdAt: new Date().toISOString()
      },
      ...ticket.activityLog
    ]
  }));
}

export function updateTicketStatus(ticketId: string, status: TicketStatus): Ticket | null {
  return updateTicket(ticketId, (ticket) => ({
    ...ticket,
    status,
    activityLog:
      ticket.status === status
        ? ticket.activityLog
        : [
            {
              id: createLocalId("ACT"),
              createdAt: new Date().toISOString(),
              actor: "Analyst",
              type: "status",
              message: `Status updated to ${status}.`
            },
            ...ticket.activityLog
          ]
  }));
}

export function resetStoredTickets(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.tickets);
  void clearTicketsFromIndexedDb();
  emitStorageEvent(STORAGE_EVENTS.ticketsUpdated);
}

export function seedDemoTickets(): Ticket[] {
  const demoTickets: Ticket[] = [
    {
      id: "INC-1001",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      requesterName: "Alex Morgan",
      requesterPhone: "+1 (212) 555-0144",
      requesterEmail: "alex.morgan@company.com",
      type: "Incident",
      status: "In Progress",
      priority: "P2",
      impact: "High",
      urgency: "Medium",
      category: "Microsoft 365",
      subcategory: "Teams",
      product: "Teams",
      summary: "Teams desktop app microphone intermittently unavailable",
      description:
        "Microphone works in system settings but Teams stops detecting it after docking/undocking. Affects multiple meetings during the day.",
      preferredContactMethod: "Teams",
      attachments: ["teams-audio-settings.png"],
      activityLog: [
        {
          id: "ACT-INC-1001-1",
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          actor: "Analyst",
          type: "status",
          message: "Status updated to In Progress. Collecting device and Teams logs."
        },
        {
          id: "ACT-INC-1001-0",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
          actor: "System",
          type: "created",
          message: "Incident submitted through the demo support portal."
        }
      ]
    },
    {
      id: "REQ-2001",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      requesterName: "Jordan Lee",
      requesterPhone: "+1 (917) 555-0132",
      requesterEmail: "jordan.lee@company.com",
      type: "Request",
      status: "Waiting on User",
      priority: "P3",
      impact: "Medium",
      urgency: "Low",
      category: "Access Request",
      subcategory: "Shared Mailbox",
      product: "Outlook",
      summary: "Request shared mailbox access for Marketing Ops",
      description:
        "User needs read/send-as access to marketing-ops@ mailbox for campaign coordination. Manager approval pending.",
      preferredContactMethod: "Email",
      attachments: [],
      catalogItemSlug: "request-shared-mailbox-access",
      requestedFields: {
        mailboxName: "marketing-ops@company.com",
        accessType: "Send As + Full Access"
      },
      activityLog: [
        {
          id: "ACT-REQ-2001-1",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          actor: "Analyst",
          type: "comment",
          message: "Please confirm manager approval ticket/reference so we can proceed."
        },
        {
          id: "ACT-REQ-2001-0",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
          actor: "System",
          type: "created",
          message: "Service request submitted through the demo catalog."
        }
      ]
    },
    {
      id: "INC-1002",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      requesterName: "Sam Patel",
      requesterPhone: "+1 (646) 555-0188",
      requesterEmail: "sam.patel@company.com",
      type: "Incident",
      status: "Resolved",
      priority: "P3",
      impact: "Medium",
      urgency: "Medium",
      category: "Adobe",
      subcategory: "Creative Cloud Desktop",
      product: "Adobe Creative Cloud",
      summary: "Creative Cloud desktop app opens then immediately closes",
      description:
        "Adobe Creative Cloud desktop app launches but exits after splash screen on Windows 11 managed device.",
      preferredContactMethod: "Email",
      attachments: ["cc-crash.mp4"],
      activityLog: [
        {
          id: "ACT-INC-1002-2",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          actor: "Analyst",
          type: "status",
          message: "Status updated to Resolved. Safe cache reset completed and sign-in restored."
        },
        {
          id: "ACT-INC-1002-1",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          actor: "Analyst",
          type: "note",
          message: "Validated Adobe licensing service and proxy connectivity before cache cleanup."
        },
        {
          id: "ACT-INC-1002-0",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
          actor: "System",
          type: "created",
          message: "Incident submitted through the demo support portal."
        }
      ]
    }
  ];

  saveStoredTickets(demoTickets);
  return getStoredTickets();
}

const defaultHelpfulVotesStore: KBHelpfulVotesStore = {
  version: 1,
  votes: {}
};

export function getKBHelpfulVotesStore(): KBHelpfulVotesStore {
  const store = readLocalJson<KBHelpfulVotesStore>(STORAGE_KEYS.kbHelpfulVotes, defaultHelpfulVotesStore);
  return {
    version: 1,
    votes: store.votes ?? {}
  };
}

export function getKBHelpfulVote(articleSlug: string): "yes" | "no" | null {
  const vote = getKBHelpfulVotesStore().votes[articleSlug];
  return vote ?? null;
}

export function setKBHelpfulVote(articleSlug: string, vote: "yes" | "no"): KBHelpfulVotesStore {
  const current = getKBHelpfulVotesStore();
  const next: KBHelpfulVotesStore = {
    version: 1,
    votes: {
      ...current.votes,
      [articleSlug]: vote
    }
  };

  writeLocalJson(STORAGE_KEYS.kbHelpfulVotes, next);
  return next;
}

export function resetKBHelpfulVotes(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.kbHelpfulVotes);
}
