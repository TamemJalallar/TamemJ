export type SupportSeverity = "Low" | "Medium" | "High";
export type SupportAccessLevel = "User Safe" | "Admin Required";
export type SupportEnvironment = "Windows" | "macOS" | "iOS" | "Android" | "Both";
export type SupportImpact = "Low" | "Medium" | "High";
export type SupportUrgency = "Low" | "Medium" | "High";
export type TicketPriority = "P1" | "P2" | "P3" | "P4";
export type TicketStatus = "New" | "In Progress" | "Waiting on User" | "Resolved" | "Closed";
export type TicketType = "Incident" | "Request";

export type KBCategory =
  | "Microsoft 365"
  | "Windows"
  | "macOS"
  | "iOS"
  | "Android"
  | "Networking / VPN"
  | "Identity / MFA / SSO"
  | "Adobe"
  | "Figma"
  | "Browsers"
  | "Printers / Scanners"
  | "AV / Conference Rooms";

export type KBProductFamily =
  | "Microsoft"
  | "Adobe"
  | "Figma"
  | "Windows"
  | "Apple"
  | "Networking"
  | "Browser"
  | "Print"
  | "AV"
  | "Okta"
  | "Mobile";

export type SupportStepType = "info" | "command" | "warning";

export interface KBResolutionStep {
  title: string;
  type: SupportStepType;
  content: string;
  requiresAdmin?: boolean;
}

export interface KBCommand {
  title: string;
  shell: "PowerShell" | "Terminal" | "CMD" | "CLI";
  content: string;
  requiresAdmin?: boolean;
}

export interface KBArticle {
  slug: string;
  title: string;
  description: string;
  category: KBCategory;
  productFamily: KBProductFamily;
  product: string;
  severity: SupportSeverity;
  accessLevel: SupportAccessLevel;
  environment: SupportEnvironment;
  estimatedTime: string;
  tags: string[];
  symptoms: string[];
  causes: string[];
  resolutionSteps: KBResolutionStep[];
  commands: KBCommand[];
  escalationCriteria: string[];
  relatedArticleSlugs: string[];
}

export interface CatalogFieldOption {
  label: string;
  value: string;
}

export type CatalogFieldType = "text" | "textarea" | "select" | "checkbox" | "multiselect";

export interface CatalogField {
  id: string;
  label: string;
  type: CatalogFieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: CatalogFieldOption[];
}

export interface CatalogItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  product: string;
  expectedFulfillmentTime: string;
  approvalNote: string;
  tags: string[];
  requiredFields: CatalogField[];
  workflowSummary: string[];
}

export interface TicketActivityEntry {
  id: string;
  createdAt: string;
  actor: "System" | "User" | "Analyst";
  type: "status" | "note" | "comment" | "created";
  message: string;
}

export interface Ticket {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  impact: SupportImpact;
  urgency: SupportUrgency;
  category: string;
  subcategory?: string;
  product: string;
  summary: string;
  description: string;
  preferredContactMethod: "Email" | "Teams" | "Phone";
  attachments: string[];
  catalogItemSlug?: string;
  requestedFields?: Record<string, string | string[] | boolean>;
  activityLog: TicketActivityEntry[];
}

export type AnalyticsEventType =
  | "kb_view"
  | "search"
  | "search_click"
  | "kb_helpful_vote"
  | "catalog_submit"
  | "incident_submit"
  | "ticket_note_added"
  | "ticket_comment_added"
  | "admin_action";

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  createdAt: string;
  area: "kb" | "catalog" | "portal" | "tickets" | "analytics" | "admin";
  payload: Record<string, string | number | boolean | null>;
}

export interface SupportAnalyticsStore {
  version: 1;
  events: AnalyticsEvent[];
}

export interface SupportPortalState {
  version: 1;
  adminEnabled: boolean;
  sidebarCollapsed: boolean;
}

export interface KBHelpfulVotesStore {
  version: 1;
  votes: Record<string, "yes" | "no">;
}
