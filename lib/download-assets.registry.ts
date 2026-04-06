import type { DownloadAsset, DownloadAssetBundle } from "@/types/download";

const DOWNLOAD_ASSET_BASE_URL = "https://downloads.tamemj.com";
const DEFAULT_DOWNLOAD_ASSET_UPDATED_AT = "2026-03-12";

interface DownloadAssetSeed {
  slug: string;
  title: string;
  description: string;
  format: DownloadAsset["format"];
  category: DownloadAsset["category"];
  access: DownloadAsset["access"];
  monetization: string;
  searchDemand: DownloadAsset["searchDemand"];
  priceLabel?: string;
  tags: string[];
}

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

function createAsset(seed: DownloadAssetSeed): DownloadAsset {
  return {
    ...seed,
    tags: [...new Set(seed.tags.map(normalizeTag).filter(Boolean))]
  };
}

function normalizeAssetForDelivery(asset: DownloadAsset): DownloadAsset {
  return {
    ...asset,
    access: "Free",
    monetization: "Direct download",
    priceLabel: undefined,
    tags: [...asset.tags]
  };
}

function normalizeBundleForDelivery(bundle: DownloadAssetBundle): DownloadAssetBundle {
  return {
    ...bundle,
    access: "Free",
    monetization: "Direct download",
    priceLabel: undefined,
    itemSlugs: [...bundle.itemSlugs]
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
    monetization: "AdSense on page",
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
    access: "Email gate",
    monetization: "Lead magnet",
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
    monetization: "AdSense on page",
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
    access: "Email gate",
    monetization: "Affiliate (M365 tools)",
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
    monetization: "AdSense on page",
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
    access: "Email gate",
    monetization: "Lead magnet",
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
    monetization: "Affiliate (security tools)",
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
    access: "Email gate",
    monetization: "Lead magnet",
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
    monetization: "AdSense on page",
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
    monetization: "AdSense on page",
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
    access: "Premium",
    monetization: "Direct revenue",
    searchDemand: "Medium",
    priceLabel: "$19",
    tags: ["vip-support", "runbook", "executive-support", "escalation", "it-operations"]
  }),
  createAsset({
    slug: "sox-compliance-tracker",
    title: "SOX IT Compliance Tracker",
    description:
      "Track SOX control objectives, test cycles, evidence links, findings, and remediation milestones.",
    format: "xlsx",
    category: "Templates",
    access: "Premium",
    monetization: "Direct revenue",
    searchDemand: "Medium",
    priceLabel: "$29",
    tags: ["sox", "compliance", "audit", "governance", "risk"]
  }),
  createAsset({
    slug: "sharepoint-migration-checklist",
    title: "SharePoint Online Migration Checklist",
    description:
      "Migration checklist covering discovery, permission mapping, pilot validation, and production cutover readiness.",
    format: "pdf",
    category: "Checklists",
    access: "Email gate",
    monetization: "Affiliate (migration tools)",
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
    monetization: "AdSense on page",
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
    access: "Email gate",
    monetization: "Lead magnet",
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
    monetization: "AdSense on page",
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
    monetization: "AdSense on page",
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
    access: "Email gate",
    monetization: "Lead magnet",
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
    access: "Premium",
    monetization: "Direct revenue",
    searchDemand: "Medium",
    priceLabel: "$19",
    tags: ["cybersecurity", "risk-matrix", "assessment", "threat-model", "governance"]
  }),
  createAsset({
    slug: "sso-mapping-template",
    title: "Okta / Entra SSO Mapping Template",
    description:
      "Map applications, protocols, claims, and conditional access requirements for SSO rollout projects.",
    format: "xlsx",
    category: "Templates",
    access: "Email gate",
    monetization: "Affiliate (identity tools)",
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
    access: "Premium",
    monetization: "Direct revenue",
    searchDemand: "Medium",
    priceLabel: "$29",
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
    monetization: "AdSense on page",
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
    monetization: "Affiliate (EDR tools)",
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
    monetization: "AdSense on page",
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
    monetization: "AdSense on page",
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
    access: "Email gate",
    monetization: "Lead magnet"
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
    access: "Premium",
    monetization: "Direct revenue",
    priceLabel: "$49"
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
    monetization: "AdSense on page"
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
    access: "Premium",
    monetization: "Direct revenue",
    priceLabel: "$29"
  }
];

export function getDownloadAssets(): DownloadAsset[] {
  return assetsRegistry.map(normalizeAssetForDelivery);
}

export function getDownloadAssetBySlug(slug: string): DownloadAsset | undefined {
  const asset = assetsRegistry.find((entry) => entry.slug === slug);
  return asset ? normalizeAssetForDelivery(asset) : undefined;
}

export function getDownloadAssetCategories(): DownloadAsset["category"][] {
  const categories = [...new Set(assetsRegistry.map((asset) => asset.category))];
  return categories.sort((a, b) => a.localeCompare(b));
}

export function getDownloadAssetFormats(): DownloadAsset["format"][] {
  const formats = [...new Set(assetsRegistry.map((asset) => asset.format))];
  return formats.sort((a, b) => a.localeCompare(b));
}

export function getDownloadAssetBundles(): DownloadAssetBundle[] {
  return bundleRegistry.map(normalizeBundleForDelivery);
}

export function getDownloadAssetBundleBySlug(slug: string): DownloadAssetBundle | undefined {
  const bundle = bundleRegistry.find((entry) => entry.slug === slug);
  return bundle ? normalizeBundleForDelivery(bundle) : undefined;
}

export function getDownloadAssetsForBundle(bundleSlug: string): DownloadAsset[] {
  const bundle = bundleRegistry.find((entry) => entry.slug === bundleSlug);
  if (!bundle) {
    return [];
  }

  return bundle.itemSlugs
    .map((slug) => getDownloadAssetBySlug(slug))
    .filter((asset): asset is DownloadAsset => Boolean(asset))
    .map(normalizeAssetForDelivery);
}

export function getDownloadAssetStats() {
  const total = assetsRegistry.length;
  const byAccess = {
    free: assetsRegistry.length,
    emailGate: 0,
    premium: 0
  };
  const highDemand = assetsRegistry.filter((asset) => asset.searchDemand === "High").length;

  return {
    total,
    bundles: bundleRegistry.length,
    highDemand,
    byAccess
  };
}

export function getDownloadAssetFileName(asset: DownloadAsset): string {
  return `${asset.slug}.${asset.format}`;
}

export function getDownloadAssetDownloadUrl(asset: DownloadAsset): string {
  return `${DOWNLOAD_ASSET_BASE_URL}/${getDownloadAssetFileName(asset)}`;
}

export function getDownloadAssetUpdatedAt(_asset: DownloadAsset): string {
  return DEFAULT_DOWNLOAD_ASSET_UPDATED_AT;
}

export function getDownloadAssetBundleFileName(bundle: DownloadAssetBundle): string {
  return `${bundle.slug}.zip`;
}

export function getDownloadAssetBundleDownloadUrl(bundle: DownloadAssetBundle): string {
  return `${DOWNLOAD_ASSET_BASE_URL}/bundles/${getDownloadAssetBundleFileName(bundle)}`;
}

export function buildDownloadAssetRequestMailto(
  asset: DownloadAsset,
  recipientEmail: string
): string {
  const subjectPrefix =
    asset.access === "Premium"
      ? "Purchase Request"
      : asset.access === "Email gate"
        ? "Email Gate Request"
        : "Free Asset Request";

  const subject = `${subjectPrefix}: ${asset.title}`;
  const body = [
    `Asset: ${asset.title}`,
    `Slug: ${asset.slug}`,
    `Category: ${asset.category}`,
    `Format: ${asset.format.toUpperCase()}`,
    `Access: ${asset.access}`,
    "",
    "Please send access details."
  ].join("\n");

  return `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
