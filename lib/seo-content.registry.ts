import { getKBEditorialOverrideBySlug } from "@/lib/editorial-overrides";
import { getDownloadAssets } from "@/lib/download-assets.registry";
import { getKBArticles } from "@/lib/support.kb.registry";
import type { DownloadAsset } from "@/types/download";
import type { KBArticle } from "@/types/support";

export type OpportunityLevel = "High" | "Medium" | "Low";
export type OpportunitySegment = "high-rpm" | "long-tail-errors" | "affiliate-intent";

export interface SeoKeywordOpportunity {
  keyword: string;
  traffic: OpportunityLevel;
  monetization: OpportunityLevel;
  competition: OpportunityLevel;
  segment: OpportunitySegment;
}

export interface SeoKeywordArticleTarget extends SeoKeywordOpportunity {
  articleSlug: string;
  articleTitle: string;
  articleCategory: KBArticle["category"];
  articleProduct: string;
  relevanceScore: number;
}

export interface KBSeoAlignment {
  articleSlug: string;
  articleTitle: string;
  articleCategory: KBArticle["category"];
  articleProduct: string;
  primaryKeyword: string;
  editorialIntro: string;
  optimizedLeadParagraph: string;
  relevanceScore: number;
}

export type ContentClusterSlug =
  | "microsoft-365-administration"
  | "endpoint-management"
  | "identity-security"
  | "powershell-automation"
  | "it-operations";

export interface ContentCluster {
  slug: ContentClusterSlug;
  title: string;
  description: string;
  focusAreas: string[];
}

export interface PillarContentIdea {
  slug: string;
  title: string;
  description: string;
  cluster: ContentClusterSlug;
  targetKeywords: string[];
  relatedTerms: string[];
}

const levelWeight: Record<OpportunityLevel, number> = {
  High: 3,
  Medium: 2,
  Low: 1
};

const clusters: ContentCluster[] = [
  {
    slug: "microsoft-365-administration",
    title: "Microsoft 365 Administration",
    description:
      "Outlook, Teams, OneDrive, Exchange Online, and SharePoint troubleshooting and administration workflows.",
    focusAreas: ["Outlook", "Teams", "OneDrive", "Exchange Online", "SharePoint"]
  },
  {
    slug: "endpoint-management",
    title: "Endpoint Management",
    description:
      "Intune, Autopilot, SCCM, Group Policy, and Windows endpoint hardening guidance for enterprise devices.",
    focusAreas: ["Intune", "Autopilot", "SCCM", "Group Policy", "Windows Hardening"]
  },
  {
    slug: "identity-security",
    title: "Identity & Security",
    description:
      "Entra ID, MFA, Conditional Access, SSO, and zero-trust-focused identity troubleshooting content.",
    focusAreas: ["Entra ID", "MFA", "Conditional Access", "SSO", "Zero Trust"]
  },
  {
    slug: "powershell-automation",
    title: "PowerShell Automation",
    description:
      "Administrative PowerShell scripts for Active Directory, Microsoft 365, Exchange Online, and reporting operations.",
    focusAreas: ["AD Scripts", "M365 Scripts", "Exchange Scripts", "Reporting"]
  },
  {
    slug: "it-operations",
    title: "IT Operations",
    description:
      "Onboarding, offboarding, asset lifecycle, patching, incident response, and escalation process documentation.",
    focusAreas: ["Onboarding", "Asset Management", "Patch Management", "Incident Response"]
  }
];

const pillars: PillarContentIdea[] = [
  {
    slug: "complete-microsoft-365-troubleshooting-guide",
    title: "The Complete Microsoft 365 Troubleshooting Guide",
    description:
      "Centralized Microsoft 365 admin playbook linking Outlook, Teams, OneDrive, Exchange Online, and SharePoint fixes.",
    cluster: "microsoft-365-administration",
    targetKeywords: [
      "outlook keeps asking for password",
      "teams camera not working",
      "onedrive not syncing windows 11",
      "exchange online mailbox full",
      "teams meeting recording missing",
      "sharepoint permission inheritance broken"
    ],
    relatedTerms: ["microsoft 365", "outlook", "teams", "onedrive", "exchange online", "sharepoint"]
  },
  {
    slug: "windows-endpoint-security-hardening-enterprise-guide",
    title: "Windows Endpoint Security Hardening: Enterprise Guide",
    description:
      "Enterprise hardening and endpoint security guidance linking Group Policy, Defender, BitLocker, and compliance runbooks.",
    cluster: "endpoint-management",
    targetKeywords: [
      "bitlocker recovery key not found",
      "group policy not applying",
      "this app has been blocked by your system administrator",
      "0x80070005 access denied group policy",
      "printer driver is unavailable"
    ],
    relatedTerms: ["windows", "endpoint security", "group policy", "bitlocker", "defender"]
  },
  {
    slug: "active-directory-administration-definitive-guide",
    title: "Active Directory Administration: The Definitive Guide",
    description:
      "Practical AD administration hub for trust relationship failures, disabled accounts, stale objects, and audit scripts.",
    cluster: "powershell-automation",
    targetKeywords: [
      "the trust relationship between this workstation and the primary domain failed",
      "user account is disabled active directory",
      "ad user audit script",
      "ad stale computer cleanup",
      "hybrid join failed error 0x801c03f2"
    ],
    relatedTerms: ["active directory", "domain join", "computer objects", "powershell", "directory services"]
  },
  {
    slug: "it-onboarding-offboarding-automation-playbook",
    title: "IT Onboarding & Offboarding Automation Playbook",
    description:
      "Operational onboarding/offboarding framework with checklists, device lifecycle templates, and automation scripts.",
    cluster: "it-operations",
    targetKeywords: [
      "it onboarding checklist",
      "it asset inventory template",
      "device lifecycle template",
      "change management log",
      "helpdesk sla tracker"
    ],
    relatedTerms: ["onboarding", "offboarding", "asset management", "it operations", "automation"]
  },
  {
    slug: "microsoft-intune-deployment-troubleshooting-guide",
    title: "Microsoft Intune Deployment & Troubleshooting Guide",
    description:
      "End-to-end Intune guide for enrollment, compliance, app deployment, Autopilot, and remediation workflows.",
    cluster: "endpoint-management",
    targetKeywords: [
      "intune device not compliant",
      "your it admin has limited access intune",
      "this device is not compliant intune portal",
      "windows autopilot stuck",
      "defender for endpoint onboarding failed"
    ],
    relatedTerms: ["intune", "autopilot", "compliance", "company portal", "endpoint manager"]
  },
  {
    slug: "powershell-for-it-admins-scripts-automation-library",
    title: "PowerShell for IT Admins: Scripts & Automation Library",
    description:
      "PowerShell automation hub for AD, Exchange, Entra ID, and Microsoft 365 reporting and bulk administration.",
    cluster: "powershell-automation",
    targetKeywords: [
      "powershell mailbox permission audit",
      "set-mailboxpermission failed exchange online powershell",
      "entra app audit script",
      "m365 bulk license script",
      "entra mfa status script"
    ],
    relatedTerms: ["powershell", "automation", "exchange online", "entra id", "microsoft graph"]
  },
  {
    slug: "it-incident-response-escalation-framework",
    title: "IT Incident Response & Escalation Framework",
    description:
      "Incident response operational framework linking response checklists, AV triage, and escalation criteria templates.",
    cluster: "it-operations",
    targetKeywords: [
      "incident response checklist",
      "endpoint antivirus event checklist",
      "certificate expired internal website",
      "dhcp scope full no ip address",
      "rdp black screen after connecting"
    ],
    relatedTerms: ["incident response", "triage", "escalation", "security operations", "runbook"]
  },
  {
    slug: "sharepoint-online-administration-migration-guide",
    title: "SharePoint Online Administration & Migration Guide",
    description:
      "SharePoint administration and migration guide covering access, inheritance, external sharing, and governance.",
    cluster: "microsoft-365-administration",
    targetKeywords: [
      "sharepoint permission inheritance broken",
      "you need permission to access this resource sharepoint",
      "sharepoint online migration checklist",
      "cannot open shared powerpoint cross tenant",
      "sharepoint access denied"
    ],
    relatedTerms: ["sharepoint online", "migration", "permissions", "cross-tenant", "governance"]
  },
  {
    slug: "enterprise-vpn-network-troubleshooting-guide",
    title: "Enterprise VPN & Network Troubleshooting Guide",
    description:
      "VPN, DNS, DHCP, and remote access troubleshooting guide for connectivity incidents in corporate environments.",
    cluster: "it-operations",
    targetKeywords: [
      "vpn connected but no internet",
      "error 0x800704cf the network location cannot be reached",
      "the remote session was disconnected 0x3 rdp",
      "rdp black screen after connecting",
      "dhcp scope full no ip address"
    ],
    relatedTerms: ["vpn", "dns", "dhcp", "rdp", "network troubleshooting"]
  },
  {
    slug: "identity-access-management-entra-id-guide",
    title: "Identity & Access Management with Entra ID",
    description:
      "Entra ID identity troubleshooting guide for MFA, SSO, conditional access, app registration, and sign-in blocks.",
    cluster: "identity-security",
    targetKeywords: [
      "conditional access blocking sign in",
      "okta mfa not working",
      "aadsts50076 conditional access",
      "entra id password writeback error",
      "mfa registration campaign entra"
    ],
    relatedTerms: ["entra id", "mfa", "conditional access", "sso", "identity governance"]
  }
];

function opportunity(
  keyword: string,
  traffic: OpportunityLevel,
  monetization: OpportunityLevel,
  competition: OpportunityLevel,
  segment: OpportunitySegment
): SeoKeywordOpportunity {
  return { keyword, traffic, monetization, competition, segment };
}

const opportunities: SeoKeywordOpportunity[] = [
  opportunity("outlook keeps asking for password", "High", "Medium", "Medium", "high-rpm"),
  opportunity("teams camera not working", "High", "Medium", "Low", "high-rpm"),
  opportunity("vpn connected but no internet", "High", "High", "Medium", "high-rpm"),
  opportunity("bitlocker recovery key not found", "High", "Medium", "Medium", "high-rpm"),
  opportunity("intune device not compliant", "Medium", "High", "Low", "high-rpm"),
  opportunity("onedrive not syncing windows 11", "High", "Medium", "Medium", "high-rpm"),
  opportunity("conditional access blocking sign in", "Medium", "High", "Low", "high-rpm"),
  opportunity("group policy not applying", "High", "Medium", "Medium", "high-rpm"),
  opportunity("printer driver is unavailable", "High", "Medium", "Low", "high-rpm"),
  opportunity("azure ad connect sync error", "Medium", "High", "Low", "high-rpm"),
  opportunity("exchange online mailbox full", "Medium", "Medium", "Low", "high-rpm"),
  opportunity("teams meeting recording missing", "Medium", "Medium", "Low", "high-rpm"),
  opportunity("windows autopilot stuck", "Medium", "High", "Low", "high-rpm"),
  opportunity("sharepoint permission inheritance broken", "Medium", "Medium", "Low", "high-rpm"),
  opportunity("okta mfa not working", "Medium", "High", "Low", "high-rpm"),
  opportunity("defender for endpoint onboarding failed", "Medium", "High", "Low", "high-rpm"),
  opportunity("sccm client not installing", "Medium", "High", "Low", "high-rpm"),
  opportunity("hybrid join failed error 0x801c03f2", "Medium", "High", "Low", "high-rpm"),
  opportunity("power automate flow failing", "Medium", "Medium", "Low", "high-rpm"),
  opportunity("entra id password writeback error", "Medium", "High", "Low", "high-rpm"),
  opportunity("rdp black screen after connecting", "High", "Medium", "Medium", "high-rpm"),
  opportunity("dhcp scope full no ip address", "Medium", "Medium", "Low", "high-rpm"),
  opportunity("certificate expired internal website", "Medium", "Medium", "Low", "high-rpm"),
  opportunity("mfa registration campaign entra", "Low", "High", "Low", "high-rpm"),
  opportunity("teams phone number not displaying", "Medium", "Medium", "Low", "high-rpm"),

  opportunity(
    "\"your organization's policies are preventing us from completing this action\"",
    "Medium",
    "Medium",
    "Low",
    "long-tail-errors"
  ),
  opportunity("\"we couldn't sign you in please try again\" microsoft", "High", "Medium", "Medium", "long-tail-errors"),
  opportunity("\"this app has been blocked by your system administrator\"", "Medium", "Medium", "Low", "long-tail-errors"),
  opportunity("\"the trust relationship between this workstation and the primary domain failed\"", "High", "Medium", "Low", "long-tail-errors"),
  opportunity("\"something went wrong 1001\" teams", "Medium", "Medium", "Low", "long-tail-errors"),
  opportunity("\"your it admin has limited access\" intune", "Medium", "High", "Low", "long-tail-errors"),
  opportunity("\"caa50021\" error azure ad", "Low", "High", "Low", "long-tail-errors"),
  opportunity("\"aadsts50076\" conditional access", "Low", "High", "Low", "long-tail-errors"),
  opportunity("\"0x80070005 access denied\" group policy", "Medium", "Medium", "Low", "long-tail-errors"),
  opportunity("\"this device is not compliant\" intune portal", "Medium", "High", "Low", "long-tail-errors"),
  opportunity("\"there was a problem reaching this app\" azure enterprise app", "Medium", "High", "Low", "long-tail-errors"),
  opportunity("\"you need permission to access this resource\" sharepoint", "High", "Medium", "Low", "long-tail-errors"),
  opportunity("\"mailbox unavailable\" 550 5.7.708", "Low", "Medium", "Low", "long-tail-errors"),
  opportunity("\"your connection is not private\" err_cert_authority_invalid", "High", "Low", "High", "long-tail-errors"),
  opportunity("\"we can't sign you in right now\" outlook mobile", "Medium", "Medium", "Low", "long-tail-errors"),
  opportunity("\"policy does not allow granting permissions at this level\" exchange", "Low", "High", "Low", "long-tail-errors"),
  opportunity("\"user account is disabled\" active directory", "Medium", "Medium", "Low", "long-tail-errors"),
  opportunity("\"this site can't provide a secure connection\" chrome", "High", "Low", "High", "long-tail-errors"),
  opportunity("\"windows cannot access the specified device path or file\"", "High", "Low", "Medium", "long-tail-errors"),
  opportunity("error 0x800704cf \"the network location cannot be reached\"", "Medium", "Medium", "Low", "long-tail-errors"),
  opportunity("\"your admin has configured the application to block users\"", "Medium", "High", "Low", "long-tail-errors"),
  opportunity("\"sync is paused\" onedrive error", "Medium", "Medium", "Low", "long-tail-errors"),
  opportunity("\"the remote session was disconnected\" 0x3 rdp", "Medium", "Medium", "Low", "long-tail-errors"),
  opportunity("\"tenant has exceeded the maximum number of objects\" azure", "Low", "High", "Low", "long-tail-errors"),
  opportunity("\"set-mailboxpermission failed\" exchange online powershell", "Low", "High", "Low", "long-tail-errors"),

  opportunity("best endpoint management tool for small business", "Medium", "High", "Medium", "affiliate-intent"),
  opportunity("best password manager for enterprise", "Medium", "High", "High", "affiliate-intent"),
  opportunity("best it documentation tool", "Medium", "High", "Medium", "affiliate-intent"),
  opportunity("best remote monitoring and management tool", "Medium", "High", "Medium", "affiliate-intent"),
  opportunity("best backup solution for microsoft 365", "Medium", "High", "Medium", "affiliate-intent"),
  opportunity("best it ticketing system for small teams", "Medium", "High", "Medium", "affiliate-intent"),
  opportunity("intune vs jamf comparison", "Medium", "High", "Low", "affiliate-intent"),
  opportunity("best siem tool for small business", "Low", "High", "Medium", "affiliate-intent"),
  opportunity("best email security gateway", "Low", "High", "Medium", "affiliate-intent"),
  opportunity("veeam vs acronis for m365 backup", "Low", "High", "Low", "affiliate-intent"),
  opportunity("best patch management software", "Medium", "High", "Medium", "affiliate-intent"),
  opportunity("connectwise vs datto rmm", "Low", "High", "Low", "affiliate-intent"),
  opportunity("best it asset management software", "Medium", "High", "Medium", "affiliate-intent"),
  opportunity("best zero trust network access solution", "Low", "High", "Medium", "affiliate-intent"),
  opportunity("best privileged access management tool", "Low", "High", "Low", "affiliate-intent")
];

let cachedTopKBSeoAlignments: KBSeoAlignment[] | null = null;

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(value: string): string[] {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length >= 3);
}

function matchScore(haystack: string, term: string): number {
  const normalizedTerm = normalize(term);
  if (!normalizedTerm) {
    return 0;
  }

  let score = 0;
  if (haystack.includes(normalizedTerm)) {
    score += 8;
  }

  const tokens = tokenize(normalizedTerm);
  let tokenHits = 0;

  for (const token of tokens) {
    if (haystack.includes(token)) {
      tokenHits += 1;
      score += 1;
    }
  }

  if (tokens.length > 1 && tokenHits === tokens.length) {
    score += 2;
  }

  return score;
}

function buildKbArticleSearchHaystack(article: KBArticle): string {
  return normalize(
    [
      article.title,
      article.description,
      article.category,
      article.product,
      article.productFamily,
      article.tags.join(" "),
      article.symptoms.join(" "),
      article.causes.join(" "),
      article.escalationCriteria.join(" ")
    ].join(" ")
  );
}

function opportunityValue(opportunity: SeoKeywordOpportunity): number {
  const competitionPenalty = 4 - levelWeight[opportunity.competition];
  return (
    levelWeight[opportunity.traffic] * 2 +
    levelWeight[opportunity.monetization] * 3 +
    competitionPenalty
  );
}

function keywordOpportunityPriority(opportunity: SeoKeywordOpportunity): number {
  return opportunityValue(opportunity);
}

function keywordTargetPriority(target: SeoKeywordArticleTarget): number {
  return target.relevanceScore * 3 + keywordOpportunityPriority(target);
}

function resolvePillar(pillarOrSlug: PillarContentIdea | string): PillarContentIdea | undefined {
  if (typeof pillarOrSlug === "string") {
    return pillars.find((pillar) => pillar.slug === pillarOrSlug);
  }

  return pillarOrSlug;
}

function pillarTerms(pillar: PillarContentIdea): string[] {
  return [...new Set([...pillar.targetKeywords, ...pillar.relatedTerms])];
}

export function getContentClusters(): ContentCluster[] {
  return clusters.map((cluster) => ({
    ...cluster,
    focusAreas: [...cluster.focusAreas]
  }));
}

export function getContentClusterBySlug(slug: ContentClusterSlug): ContentCluster | undefined {
  return clusters.find((cluster) => cluster.slug === slug);
}

export function getPillarContentIdeas(): PillarContentIdea[] {
  return pillars.map((pillar) => ({
    ...pillar,
    targetKeywords: [...pillar.targetKeywords],
    relatedTerms: [...pillar.relatedTerms]
  }));
}

export function getPillarContentBySlug(slug: string): PillarContentIdea | undefined {
  const pillar = pillars.find((item) => item.slug === slug);
  if (!pillar) {
    return undefined;
  }

  return {
    ...pillar,
    targetKeywords: [...pillar.targetKeywords],
    relatedTerms: [...pillar.relatedTerms]
  };
}

export function getPillarsForCluster(clusterSlug: ContentClusterSlug): PillarContentIdea[] {
  return getPillarContentIdeas().filter((pillar) => pillar.cluster === clusterSlug);
}

export function getSeoKeywordOpportunities(
  segment?: OpportunitySegment
): SeoKeywordOpportunity[] {
  const base = segment
    ? opportunities.filter((opportunity) => opportunity.segment === segment)
    : opportunities;

  return [...base].sort(
    (a, b) =>
      opportunityValue(b) - opportunityValue(a) ||
      a.keyword.localeCompare(b.keyword)
  );
}

export function getTopSeoKeywordOpportunities(limit = 40): SeoKeywordOpportunity[] {
  return getSeoKeywordOpportunities().slice(0, limit);
}

export function getTopKeywordArticleTargets(limit = 50): SeoKeywordArticleTarget[] {
  const topKeywords = getTopSeoKeywordOpportunities(Math.max(limit, 50));
  const articles = getKBArticles();
  const articleHaystacks = articles.map((article) => ({
    article,
    haystack: buildKbArticleSearchHaystack(article)
  }));

  const mapped = topKeywords
    .map((opportunity) => {
      let best:
        | {
            article: KBArticle;
            score: number;
          }
        | undefined;

      for (const entry of articleHaystacks) {
        const score = matchScore(entry.haystack, opportunity.keyword);
        if (!best || score > best.score) {
          best = { article: entry.article, score };
        }
      }

      if (!best || best.score <= 0) {
        return undefined;
      }

      return {
        ...opportunity,
        articleSlug: best.article.slug,
        articleTitle: best.article.title,
        articleCategory: best.article.category,
        articleProduct: best.article.product,
        relevanceScore: best.score
      } satisfies SeoKeywordArticleTarget;
    })
    .filter((entry): entry is SeoKeywordArticleTarget => Boolean(entry));

  return mapped.slice(0, limit);
}

function normalizeKeywordLabel(value: string): string {
  return value.replace(/"/g, "").trim();
}

function buildLeadEnvironmentText(environment: KBArticle["environment"]): string {
  switch (environment) {
    case "Both":
      return "Windows and macOS enterprise environments";
    case "Windows":
      return "Windows enterprise environments";
    case "macOS":
      return "macOS enterprise environments";
    case "iOS":
      return "managed iOS enterprise environments";
    case "Android":
      return "managed Android enterprise environments";
    default:
      return "enterprise environments";
  }
}

function buildSeoAlignment(article: KBArticle, target: SeoKeywordArticleTarget): KBSeoAlignment {
  const override = getKBEditorialOverrideBySlug(article.slug);
  const keywordLabel = normalizeKeywordLabel(target.keyword);
  const environmentText = buildLeadEnvironmentText(article.environment);

  return {
    articleSlug: article.slug,
    articleTitle: article.title,
    articleCategory: article.category,
    articleProduct: article.product,
    primaryKeyword: override?.primaryKeyword ?? keywordLabel,
    editorialIntro:
      override?.editorialIntro ??
      `This troubleshooting guide is aligned to the exact query "${keywordLabel}" and focuses on enterprise-safe remediation for ${article.product}.`,
    optimizedLeadParagraph:
      override?.optimizedLeadParagraph ??
      `If you are seeing "${keywordLabel}", use this IT support runbook to validate symptoms, isolate likely causes, apply safe resolution steps, and escalate correctly in ${environmentText}.`,
    relevanceScore: target.relevanceScore
  };
}

function getBestTargetForArticle(article: KBArticle): SeoKeywordArticleTarget | undefined {
  const haystack = buildKbArticleSearchHaystack(article);

  const candidates = opportunities
    .map((opportunity) => {
      const relevanceScore = matchScore(haystack, opportunity.keyword);
      return relevanceScore > 0
        ? {
            ...opportunity,
            articleSlug: article.slug,
            articleTitle: article.title,
            articleCategory: article.category,
            articleProduct: article.product,
            relevanceScore
          }
        : undefined;
    })
    .filter((entry): entry is SeoKeywordArticleTarget => Boolean(entry))
    .sort(
      (a, b) =>
        keywordTargetPriority(b) - keywordTargetPriority(a) ||
        b.relevanceScore - a.relevanceScore ||
        a.keyword.localeCompare(b.keyword)
    );

  return candidates[0];
}

export function getTopKBSeoAlignments(limit = 50): KBSeoAlignment[] {
  if (cachedTopKBSeoAlignments && cachedTopKBSeoAlignments.length >= limit) {
    return cachedTopKBSeoAlignments.slice(0, limit);
  }

  const topKeywordTargets = getTopKeywordArticleTargets(160);
  const articleMap = new Map(getKBArticles().map((article) => [article.slug, article]));
  const bestTargetByArticle = new Map<string, SeoKeywordArticleTarget>();

  for (const target of topKeywordTargets) {
    const existing = bestTargetByArticle.get(target.articleSlug);
    if (!existing || keywordTargetPriority(target) > keywordTargetPriority(existing)) {
      bestTargetByArticle.set(target.articleSlug, target);
    }
  }

  const alignments = [...bestTargetByArticle.values()]
    .sort(
      (a, b) =>
        keywordTargetPriority(b) - keywordTargetPriority(a) ||
        b.relevanceScore - a.relevanceScore ||
        a.keyword.localeCompare(b.keyword)
    )
    .map((target) => {
      const article = articleMap.get(target.articleSlug);
      return article ? buildSeoAlignment(article, target) : undefined;
    })
    .filter((entry): entry is KBSeoAlignment => Boolean(entry));

  if (alignments.length >= limit) {
    cachedTopKBSeoAlignments = alignments;
    return alignments.slice(0, limit);
  }

  const seen = new Set(alignments.map((entry) => entry.articleSlug));
  const fallback: KBSeoAlignment[] = [];

  for (const article of getKBArticles()) {
    if (seen.has(article.slug)) continue;
    const bestTarget = getBestTargetForArticle(article);
    if (!bestTarget) continue;
    fallback.push(buildSeoAlignment(article, bestTarget));
  }

  fallback.sort(
    (a, b) =>
      b.relevanceScore - a.relevanceScore ||
      a.primaryKeyword.localeCompare(b.primaryKeyword)
  );

  cachedTopKBSeoAlignments = [...alignments, ...fallback];
  return cachedTopKBSeoAlignments.slice(0, limit);
}

export function getKBSeoAlignmentBySlug(slug: string): KBSeoAlignment | undefined {
  const cachedAlignment = getTopKBSeoAlignments(50).find((entry) => entry.articleSlug === slug);
  if (cachedAlignment) {
    return cachedAlignment;
  }

  const article = getKBArticles().find((entry) => entry.slug === slug);
  if (!article) {
    return undefined;
  }

  const bestTarget = getBestTargetForArticle(article);
  if (bestTarget) {
    return buildSeoAlignment(article, bestTarget);
  }

  const override = getKBEditorialOverrideBySlug(slug);
  if (!override) {
    return undefined;
  }

  return {
    articleSlug: article.slug,
    articleTitle: article.title,
    articleCategory: article.category,
    articleProduct: article.product,
    primaryKeyword: override.primaryKeyword ?? article.title,
    editorialIntro: override.editorialIntro,
    optimizedLeadParagraph: override.optimizedLeadParagraph,
    relevanceScore: 0
  };
}

export function getKeywordTargetsForKBArticle(
  articleOrSlug: KBArticle | string,
  limit = 10
): SeoKeywordArticleTarget[] {
  const article =
    typeof articleOrSlug === "string"
      ? getKBArticles().find((item) => item.slug === articleOrSlug)
      : articleOrSlug;

  if (!article) {
    return [];
  }

  const articleHaystack = buildKbArticleSearchHaystack(article);
  const topKeywordTargets = getTopKeywordArticleTargets(80);

  return topKeywordTargets
    .map((target) => ({
      ...target,
      relevanceScore: matchScore(articleHaystack, target.keyword)
    }))
    .filter((target) => target.relevanceScore > 0)
    .sort(
      (a, b) =>
        b.relevanceScore - a.relevanceScore ||
        opportunityValue(b) - opportunityValue(a) ||
        a.keyword.localeCompare(b.keyword)
    )
    .slice(0, limit);
}

export function getSuggestedKBArticlesForPillar(
  pillarOrSlug: PillarContentIdea | string,
  limit = 24
): KBArticle[] {
  const pillar = resolvePillar(pillarOrSlug);
  if (!pillar) {
    return [];
  }

  const terms = pillarTerms(pillar);

  return getKBArticles()
    .map((article) => {
      const haystack = normalize(
        [
          article.title,
          article.description,
          article.category,
          article.product,
          article.productFamily,
          article.tags.join(" "),
          article.symptoms.join(" "),
          article.causes.join(" "),
          article.escalationCriteria.join(" ")
        ].join(" ")
      );

      const score = terms.reduce((sum, term) => sum + matchScore(haystack, term), 0);

      return { article, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.article.title.localeCompare(b.article.title))
    .slice(0, limit)
    .map((item) => item.article);
}

export function getSuggestedDownloadAssetsForPillar(
  pillarOrSlug: PillarContentIdea | string,
  limit = 10
): DownloadAsset[] {
  const pillar = resolvePillar(pillarOrSlug);
  if (!pillar) {
    return [];
  }

  const terms = pillarTerms(pillar);

  return getDownloadAssets()
    .map((asset) => {
      const haystack = normalize(
        [asset.title, asset.description, asset.category, asset.monetization, asset.tags.join(" ")].join(" ")
      );

      const score = terms.reduce((sum, term) => sum + matchScore(haystack, term), 0);
      return { asset, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.asset.title.localeCompare(b.asset.title))
    .slice(0, limit)
    .map((item) => item.asset);
}

export function getKeywordOpportunitiesForPillar(
  pillarOrSlug: PillarContentIdea | string,
  limitPerSegment = 10
): Record<OpportunitySegment, SeoKeywordOpportunity[]> {
  const pillar = resolvePillar(pillarOrSlug);

  if (!pillar) {
    return {
      "high-rpm": [],
      "long-tail-errors": [],
      "affiliate-intent": []
    };
  }

  const terms = pillarTerms(pillar);

  const scored = opportunities
    .map((opportunity) => {
      const haystack = normalize(opportunity.keyword);
      const relevance = terms.reduce((sum, term) => sum + matchScore(haystack, term), 0);
      const value = opportunityValue(opportunity);
      return {
        opportunity,
        relevance,
        score: relevance * 2 + value
      };
    })
    .filter((item) => item.relevance > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.relevance - a.relevance || a.opportunity.keyword.localeCompare(b.opportunity.keyword)
    );

  const segments: OpportunitySegment[] = ["high-rpm", "long-tail-errors", "affiliate-intent"];

  return {
    "high-rpm": scored
      .filter((item) => item.opportunity.segment === "high-rpm")
      .slice(0, limitPerSegment)
      .map((item) => item.opportunity),
    "long-tail-errors": scored
      .filter((item) => item.opportunity.segment === "long-tail-errors")
      .slice(0, limitPerSegment)
      .map((item) => item.opportunity),
    "affiliate-intent": scored
      .filter((item) => item.opportunity.segment === "affiliate-intent")
      .slice(0, limitPerSegment)
      .map((item) => item.opportunity)
  };
}
