import { slugifyLabel } from "@/lib/slugs";
import type { DownloadAsset, DownloadAssetBundle } from "@/types/download";

const ASSET_BASE_URL = "https://downloads.tamemj.com";

interface DownloadAssetSeed {
  slug: string;
  title: string;
  description: string;
  format: DownloadAsset["format"];
  category: DownloadAsset["category"];
  access: DownloadAsset["access"];
  monetization: DownloadAsset["monetization"];
  searchDemand: DownloadAsset["searchDemand"];
  tags: string[];
}

interface DownloadAssetMetadataSeed {
  fileSizeBytes: number;
  updatedAt: string;
  previewItems: string[];
}

const DEFAULT_ASSET_UPDATED_AT = "2026-03-12T05:12:31-04:00";

const assetMetadataRegistry: Record<string, DownloadAssetMetadataSeed> = {
  "ad-user-audit-script": {
    fileSizeBytes: 1809,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "UserPrincipalName, Enabled, and LastLogonDate export fields",
      "Optional group membership collection for access reviews",
      "CSV output for cleanup, audit, and recertification workflows"
    ]
  },
  "it-asset-inventory-template": {
    fileSizeBytes: 3240,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Asset tag, serial number, and assigned user tracking",
      "Warranty, location, and department inventory fields",
      "Audit date and lifecycle note coverage"
    ]
  },
  "incident-response-checklist": {
    fileSizeBytes: 1981,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Preparation through post-incident workflow coverage",
      "Containment, eradication, and recovery checkpoints",
      "Post-mortem follow-up tasks for operational closeout"
    ]
  },
  "m365-license-tracker": {
    fileSizeBytes: 13073,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "License SKU, assigned date, and status tracking fields",
      "Department, manager, and cost center visibility",
      "Notes for reclaim actions, add-ons, and exception handling"
    ]
  },
  "it-onboarding-checklist": {
    fileSizeBytes: 1418,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Pre-start provisioning tasks for devices and accounts",
      "Day-one login, MFA, and software validation steps",
      "Week-one access checks and support handoff items"
    ]
  },
  "helpdesk-sla-tracker": {
    fileSizeBytes: 3217,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Opened, first response, and resolved timestamp tracking",
      "Response and resolution SLA target columns",
      "Priority, category, and assignee fields for queue reporting"
    ]
  },
  "windows-hardening-checklist": {
    fileSizeBytes: 1785,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Baseline hardening checks for Windows endpoints",
      "Identity, firewall, and legacy protocol review points",
      "Logging and security monitoring validation steps"
    ]
  },
  "group-policy-documentation-template": {
    fileSizeBytes: 2446,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Policy overview, purpose, and linked OU documentation",
      "Security filtering, WMI, and inheritance note sections",
      "Testing, rollback, and approval tracking blocks"
    ]
  },
  "patch-management-tracker": {
    fileSizeBytes: 13247,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "KB or release tracking by platform and deployment ring",
      "Compliance percentage, owner, and rollback fields",
      "Status notes for change windows and remediation follow-up"
    ]
  },
  "m365-bulk-license-script": {
    fileSizeBytes: 1381,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "CSV-driven assign or remove workflow for M365 SKUs",
      "Microsoft Graph connection and per-user processing logic",
      "Console output for validation during bulk license changes"
    ]
  },
  "vip-support-runbook": {
    fileSizeBytes: 16645,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Executive SLA, escalation, and communication structure",
      "Common VIP support scenario coverage",
      "Runbook sections for ownership, status updates, and handoff"
    ]
  },
  "sox-compliance-tracker": {
    fileSizeBytes: 13155,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Control ID, owner, and test cadence tracking",
      "Evidence link, findings, and remediation fields",
      "Audit-ready status visibility for recurring reviews"
    ]
  },
  "sharepoint-migration-checklist": {
    fileSizeBytes: 1607,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Discovery, cleanup, and permission mapping tasks",
      "Pilot migration and wave validation checkpoints",
      "Post-cutover review items for end-user readiness"
    ]
  },
  "entra-app-audit-script": {
    fileSizeBytes: 1310,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Application inventory export via Microsoft Graph",
      "Secret and certificate expiry visibility",
      "CSV output for Entra governance and lifecycle reviews"
    ]
  },
  "it-risk-register": {
    fileSizeBytes: 13225,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Likelihood, impact, and risk rating columns",
      "Mitigation owner and target date tracking",
      "Status fields for review and remediation progress"
    ]
  },
  "device-lifecycle-template": {
    fileSizeBytes: 3264,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Procurement through retirement lifecycle coverage",
      "Warranty planning and replacement milestone fields",
      "Assigned user, condition, and check-in tracking"
    ]
  },
  "ad-stale-computer-cleanup": {
    fileSizeBytes: 1872,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "90-day stale AD computer detection workflow",
      "Optional disable mode with ShouldProcess safety control",
      "CSV reporting for validation before remediation"
    ]
  },
  "change-management-log": {
    fileSizeBytes: 3263,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Change ID, owner, and risk documentation fields",
      "Approval and implementation status tracking",
      "Rollback plan and stakeholder note coverage"
    ]
  },
  "risk-assessment-matrix": {
    fileSizeBytes: 13220,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Threat and asset mapping grid",
      "Existing controls and treatment planning fields",
      "Owner, due date, and status tracking for remediation"
    ]
  },
  "sso-mapping-template": {
    fileSizeBytes: 13157,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Application protocol and endpoint inventory fields",
      "Claims mapping and provisioning notes",
      "Conditional access and rollout status tracking"
    ]
  },
  "it-budget-template": {
    fileSizeBytes: 13140,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Annual and monthly cost planning fields",
      "Vendor, renewal date, and contract term visibility",
      "Status and note sections for optimization reviews"
    ]
  },
  "mailbox-permission-audit": {
    fileSizeBytes: 1592,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Full Access, Send As, and Send on Behalf export coverage",
      "Exchange Online mailbox permission audit workflow",
      "CSV output for access reviews and cleanup projects"
    ]
  },
  "av-event-triage-checklist": {
    fileSizeBytes: 1618,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Alert validation and initial containment steps",
      "Investigation evidence and lateral movement checks",
      "Resolution and escalation closeout guidance"
    ]
  },
  "it-project-status-template": {
    fileSizeBytes: 16444,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Project summary and status indicator structure",
      "Risk, issue, and blocker documentation space",
      "Budget, resourcing, and stakeholder update sections"
    ]
  },
  "entra-mfa-status-script": {
    fileSizeBytes: 1202,
    updatedAt: DEFAULT_ASSET_UPDATED_AT,
    previewItems: [
      "Per-user MFA registration export for Entra ID",
      "Registered methods and admin flag visibility",
      "Compliance campaign reporting support"
    ]
  }
};

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

export function formatDownloadAssetFileSize(fileSizeBytes: number): string {
  if (fileSizeBytes < 1000) {
    return `${fileSizeBytes} B`;
  }

  const formatted = (fileSizeBytes / 1000).toFixed(2).replace(/\.?0+$/, "");
  return `${formatted} KB`;
}

function buildAssetUrl(slug: string, format: DownloadAsset["format"]): string {
  const base = ASSET_BASE_URL.replace(/\/+$/, "");
  return `${base}/${slug}.${format}`;
}

function createAsset(seed: DownloadAssetSeed): DownloadAsset {
  const metadata = assetMetadataRegistry[seed.slug];

  if (!metadata) {
    throw new Error(`Missing asset metadata for ${seed.slug}`);
  }

  return {
    ...seed,
    downloadUrl: buildAssetUrl(seed.slug, seed.format),
    fileSize: formatDownloadAssetFileSize(metadata.fileSizeBytes),
    fileSizeBytes: metadata.fileSizeBytes,
    updatedAt: metadata.updatedAt,
    previewItems: [...metadata.previewItems],
    tags: [...new Set(seed.tags.map(normalizeTag).filter(Boolean))]
  };
}

const assetsRegistry: DownloadAsset[] = [
  createAsset({
    slug: "ad-user-audit-script",
    title: "PowerShell AD User Audit Script",
    description:
      "Export Active Directory users with last logon, account status, and group memberships for security and access reviews.",
    format: "ps1",
    category: "Scripts",
    access: "Free",
    monetization: "Free",
    searchDemand: "High",
    tags: ["powershell", "active-directory", "audit", "ad-users", "identity"]
  }),
  createAsset({
    slug: "it-asset-inventory-template",
    title: "IT Asset Inventory Template",
    description:
      "Track endpoints, software licenses, warranty dates, assigned users, and ownership lifecycle across your environment.",
    format: "xlsx",
    category: "Templates",
    access: "Free",
    monetization: "Free",
    searchDemand: "High",
    tags: ["asset-management", "inventory", "hardware", "licenses", "it-operations"]
  }),
  createAsset({
    slug: "incident-response-checklist",
    title: "Incident Response Checklist",
    description:
      "Step-by-step IR checklist covering detection, containment, eradication, recovery, and post-incident review.",
    format: "pdf",
    category: "Checklists",
    access: "Free",
    monetization: "Free",
    searchDemand: "High",
    tags: ["incident-response", "security", "soc", "containment", "playbook"]
  }),
  createAsset({
    slug: "m365-license-tracker",
    title: "Microsoft 365 License Tracker",
    description:
      "Monitor E3/E5/F1 assignments, costs, renewal windows, and allocation trends for Microsoft 365 subscriptions.",
    format: "xlsx",
    category: "Templates",
    access: "Free",
    monetization: "Free",
    searchDemand: "High",
    tags: ["microsoft-365", "licensing", "cost-management", "entra", "subscription"]
  }),
  createAsset({
    slug: "it-onboarding-checklist",
    title: "New Hire IT Onboarding Checklist",
    description:
      "Provisioning checklist for devices, accounts, MFA enrollment, software deployment, and security onboarding tasks.",
    format: "pdf",
    category: "Checklists",
    access: "Free",
    monetization: "Free",
    searchDemand: "High",
    tags: ["onboarding", "new-hire", "it-checklist", "provisioning", "helpdesk"]
  }),
  createAsset({
    slug: "helpdesk-sla-tracker",
    title: "Helpdesk SLA Tracking Dashboard",
    description:
      "Track first response, resolution times, breach rates, and SLA compliance by priority and support queue.",
    format: "xlsx",
    category: "Templates",
    access: "Free",
    monetization: "Free",
    searchDemand: "Medium",
    tags: ["sla", "helpdesk", "it-support", "kpi", "service-desk"]
  }),
  createAsset({
    slug: "windows-hardening-checklist",
    title: "Windows Security Hardening Checklist",
    description:
      "CIS-aligned enterprise hardening steps for Windows 10/11 endpoints with staged implementation guidance.",
    format: "pdf",
    category: "Checklists",
    access: "Free",
    monetization: "Free",
    searchDemand: "High",
    tags: ["windows-security", "hardening", "cis", "baseline", "endpoint-security"]
  }),
  createAsset({
    slug: "group-policy-documentation-template",
    title: "Group Policy Documentation Template",
    description:
      "Document GPO purpose, linked OUs, security filtering, and critical settings for audit and change control.",
    format: "docx",
    category: "Templates",
    access: "Free",
    monetization: "Free",
    searchDemand: "Medium",
    tags: ["gpo", "group-policy", "documentation", "active-directory", "change-control"]
  }),
  createAsset({
    slug: "patch-management-tracker",
    title: "Patch Management Tracker",
    description:
      "Track patch rollout status, deployment rings, remediation progress, rollback windows, and compliance trends.",
    format: "xlsx",
    category: "Templates",
    access: "Free",
    monetization: "Free",
    searchDemand: "Medium",
    tags: ["patching", "windows-update", "compliance", "endpoint-management", "tracker"]
  }),
  createAsset({
    slug: "m365-bulk-license-script",
    title: "PowerShell Bulk M365 License Assignment",
    description:
      "Assign or remove Microsoft 365 licenses in bulk via Microsoft Graph workflows with role-safe checks.",
    format: "ps1",
    category: "Scripts",
    access: "Free",
    monetization: "Free",
    searchDemand: "High",
    tags: ["powershell", "microsoft-graph", "m365", "bulk-operations", "licensing"]
  }),
  createAsset({
    slug: "vip-support-runbook",
    title: "VIP Support Runbook Template",
    description:
      "Executive support runbook with escalation paths, SLA overrides, communication templates, and ownership controls.",
    format: "docx",
    category: "Runbooks",
    access: "Free",
    monetization: "Free",
    searchDemand: "Medium",
    tags: ["vip-support", "runbook", "executive-support", "escalation", "it-operations"]
  }),
  createAsset({
    slug: "sox-compliance-tracker",
    title: "SOX IT Compliance Tracker",
    description:
      "Track SOX control objectives, test cycles, evidence links, findings, and remediation milestones.",
    format: "xlsx",
    category: "Templates",
    access: "Free",
    monetization: "Free",
    searchDemand: "Medium",
    tags: ["sox", "compliance", "audit", "governance", "risk"]
  }),
  createAsset({
    slug: "sharepoint-migration-checklist",
    title: "SharePoint Online Migration Checklist",
    description:
      "Migration checklist covering discovery, permission mapping, pilot validation, and production cutover readiness.",
    format: "pdf",
    category: "Checklists",
    access: "Free",
    monetization: "Free",
    searchDemand: "High",
    tags: ["sharepoint", "migration", "microsoft-365", "permissions", "content-move"]
  }),
  createAsset({
    slug: "entra-app-audit-script",
    title: "Entra ID App Registration Audit Script",
    description:
      "Export app registrations, permissions, and credential expiry details for Entra ID governance reviews.",
    format: "ps1",
    category: "Scripts",
    access: "Free",
    monetization: "Free",
    searchDemand: "High",
    tags: ["entra-id", "azure-ad", "app-registrations", "audit", "powershell"]
  }),
  createAsset({
    slug: "it-risk-register",
    title: "IT Risk Register Template",
    description:
      "Track identified risks, likelihood/impact scores, controls, treatment plans, and accountable owners.",
    format: "xlsx",
    category: "Templates",
    access: "Free",
    monetization: "Free",
    searchDemand: "Medium",
    tags: ["risk-register", "it-risk", "governance", "mitigation", "compliance"]
  }),
  createAsset({
    slug: "device-lifecycle-template",
    title: "Device Lifecycle Management Template",
    description:
      "Track procurement, deployment, warranty, refresh, reassignment, and decommission milestones.",
    format: "xlsx",
    category: "Templates",
    access: "Free",
    monetization: "Free",
    searchDemand: "Medium",
    tags: ["device-lifecycle", "asset-management", "endpoint", "warranty", "refresh"]
  }),
  createAsset({
    slug: "ad-stale-computer-cleanup",
    title: "PowerShell Stale Computer Cleanup Script",
    description:
      "Find and disable inactive AD computer objects (90+ days) with exports and staged safety controls.",
    format: "ps1",
    category: "Scripts",
    access: "Free",
    monetization: "Free",
    searchDemand: "High",
    tags: ["powershell", "active-directory", "computer-objects", "cleanup", "security-hygiene"]
  }),
  createAsset({
    slug: "change-management-log",
    title: "IT Change Management Log",
    description:
      "Document change requests, approvals, implementation windows, rollback plans, and post-change validation.",
    format: "xlsx",
    category: "Templates",
    access: "Free",
    monetization: "Free",
    searchDemand: "Medium",
    tags: ["change-management", "itil", "cab", "rollback", "operations"]
  }),
  createAsset({
    slug: "risk-assessment-matrix",
    title: "Cybersecurity Risk Assessment Matrix",
    description:
      "5x5 risk scoring matrix with threat categories, asset mapping, and treatment workflow columns.",
    format: "xlsx",
    category: "Templates",
    access: "Free",
    monetization: "Free",
    searchDemand: "Medium",
    tags: ["cybersecurity", "risk-matrix", "assessment", "threat-model", "governance"]
  }),
  createAsset({
    slug: "sso-mapping-template",
    title: "Okta / Entra SSO Mapping Template",
    description:
      "Map applications, protocols, claims, and conditional access requirements for SSO rollout projects.",
    format: "xlsx",
    category: "Templates",
    access: "Free",
    monetization: "Free",
    searchDemand: "Medium",
    tags: ["okta", "entra-id", "sso", "identity", "access-management"]
  }),
  createAsset({
    slug: "it-budget-template",
    title: "IT Budget Planning Template",
    description:
      "Annual IT budget workbook for hardware, software, cloud services, staffing, and project forecasting.",
    format: "xlsx",
    category: "Templates",
    access: "Free",
    monetization: "Free",
    searchDemand: "Medium",
    tags: ["it-budget", "finance", "capacity-planning", "forecast", "operations"]
  }),
  createAsset({
    slug: "mailbox-permission-audit",
    title: "PowerShell Mailbox Permission Audit",
    description:
      "Export Exchange Online mailbox permissions including Full Access, Send As, and Send on Behalf assignments.",
    format: "ps1",
    category: "Scripts",
    access: "Free",
    monetization: "Free",
    searchDemand: "High",
    tags: ["exchange-online", "mailbox", "permissions", "powershell", "microsoft-365"]
  }),
  createAsset({
    slug: "av-event-triage-checklist",
    title: "Endpoint Antivirus Event Checklist",
    description:
      "Triage workflow for AV events: quarantine verification, false-positive review, and escalation criteria.",
    format: "pdf",
    category: "Checklists",
    access: "Free",
    monetization: "Free",
    searchDemand: "Low",
    tags: ["antivirus", "edr", "incident-triage", "security-operations", "endpoint"]
  }),
  createAsset({
    slug: "it-project-status-template",
    title: "IT Project Status Report Template",
    description:
      "Weekly/monthly project reporting template for milestones, risks, blockers, dependencies, and stakeholders.",
    format: "docx",
    category: "Templates",
    access: "Free",
    monetization: "Free",
    searchDemand: "Medium",
    tags: ["project-management", "status-report", "pm", "stakeholder-update", "template"]
  }),
  createAsset({
    slug: "entra-mfa-status-script",
    title: "PowerShell MFA Status Report",
    description:
      "Export Entra ID MFA registration status by user and method type for compliance and remediation campaigns.",
    format: "ps1",
    category: "Scripts",
    access: "Free",
    monetization: "Free",
    searchDemand: "High",
    tags: ["entra-id", "mfa", "reporting", "powershell", "identity-security"]
  })
];

const bundleRegistry: DownloadAssetBundle[] = [
  {
    slug: "it-admin-starter-kit",
    title: "IT Admin Starter Kit",
    description:
      "Core operations pack for onboarding, inventory, SLA tracking, change logging, and baseline project reporting.",
    itemSlugs: [
      "it-asset-inventory-template",
      "it-onboarding-checklist",
      "helpdesk-sla-tracker",
      "group-policy-documentation-template",
      "patch-management-tracker",
      "device-lifecycle-template",
      "change-management-log",
      "it-project-status-template"
    ],
    access: "Free",
    monetization: "Free"
  },
  {
    slug: "security-compliance-bundle",
    title: "Security & Compliance Bundle",
    description:
      "Security and governance toolkit for IR, hardening, control tracking, risk management, and AV triage.",
    itemSlugs: [
      "incident-response-checklist",
      "windows-hardening-checklist",
      "sox-compliance-tracker",
      "it-risk-register",
      "risk-assessment-matrix",
      "av-event-triage-checklist"
    ],
    access: "Free",
    monetization: "Free",
  },
  {
    slug: "powershell-admin-toolkit",
    title: "PowerShell Admin Toolkit",
    description:
      "Operational script library for AD auditing, Microsoft 365 administration, identity reporting, and hygiene cleanup.",
    itemSlugs: [
      "ad-user-audit-script",
      "m365-bulk-license-script",
      "entra-app-audit-script",
      "ad-stale-computer-cleanup",
      "mailbox-permission-audit",
      "entra-mfa-status-script"
    ],
    access: "Free",
    monetization: "Free"
  },
  {
    slug: "m365-admin-bundle",
    title: "M365 Admin Bundle",
    description:
      "Microsoft 365 operations pack for licensing, migration planning, permission auditing, and identity posture reporting.",
    itemSlugs: [
      "m365-license-tracker",
      "m365-bulk-license-script",
      "sharepoint-migration-checklist",
      "mailbox-permission-audit",
      "entra-mfa-status-script"
    ],
    access: "Free",
    monetization: "Free",
  }
];

export function getDownloadAssets(): DownloadAsset[] {
  return assetsRegistry.map((asset) => ({
    ...asset,
    previewItems: [...asset.previewItems],
    tags: [...asset.tags]
  }));
}

export function getDownloadAssetBySlug(slug: string): DownloadAsset | undefined {
  return assetsRegistry.find((asset) => asset.slug === slug);
}

export function getDownloadAssetCategories(): DownloadAsset["category"][] {
  const categories = [...new Set(assetsRegistry.map((asset) => asset.category))];
  return categories.sort((a, b) => a.localeCompare(b));
}

export function getDownloadAssetCategorySlug(category: DownloadAsset["category"]): string {
  return slugifyLabel(category);
}

export function getDownloadAssetCategoryBySlug(slug: string): DownloadAsset["category"] | undefined {
  return getDownloadAssetCategories().find((category) => getDownloadAssetCategorySlug(category) === slug);
}

export function getDownloadAssetsByCategory(
  categoryOrSlug: DownloadAsset["category"] | string
): DownloadAsset[] {
  const resolvedCategory = getDownloadAssetCategoryBySlug(categoryOrSlug) ?? categoryOrSlug;

  return assetsRegistry
    .filter((asset) => asset.category === resolvedCategory)
    .map((asset) => ({
      ...asset,
      previewItems: [...asset.previewItems],
      tags: [...asset.tags]
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getDownloadAssetFormats(): DownloadAsset["format"][] {
  const formats = [...new Set(assetsRegistry.map((asset) => asset.format))];
  return formats.sort((a, b) => a.localeCompare(b));
}

export function getDownloadAssetBundles(): DownloadAssetBundle[] {
  return bundleRegistry.map((bundle) => ({
    ...bundle,
    itemSlugs: [...bundle.itemSlugs]
  }));
}

export function getDownloadAssetsForBundle(bundleSlug: string): DownloadAsset[] {
  const bundle = bundleRegistry.find((entry) => entry.slug === bundleSlug);
  if (!bundle) {
    return [];
  }

  return bundle.itemSlugs
    .map((slug) => getDownloadAssetBySlug(slug))
    .filter((asset): asset is DownloadAsset => Boolean(asset))
    .map((asset) => ({
      ...asset,
      tags: [...asset.tags]
    }));
}

export function getDownloadAssetStats() {
  const total = assetsRegistry.length;
  const byAccess = {
    free: assetsRegistry.filter((asset) => asset.access === "Free").length,
    emailGate: 0,
    premium: 0
  };
  const highDemand = assetsRegistry.filter((asset) => asset.searchDemand === "High").length;
  const totalFileSizeBytes = assetsRegistry.reduce((sum, asset) => sum + asset.fileSizeBytes, 0);
  const latestUpdatedAt =
    [...assetsRegistry]
      .map((asset) => asset.updatedAt)
      .sort((a, b) => Date.parse(b) - Date.parse(a))[0] ?? DEFAULT_ASSET_UPDATED_AT;

  return {
    total,
    bundles: bundleRegistry.length,
    highDemand,
    byAccess,
    totalFileSizeBytes,
    latestUpdatedAt
  };
}

export function buildDownloadAssetUrl(asset: DownloadAsset): string {
  return asset.downloadUrl;
}
