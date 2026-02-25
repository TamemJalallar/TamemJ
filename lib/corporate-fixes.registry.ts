import publishedCorporateFixesStore from "@/data/corporate-fixes.published.json";
import { getKBArticles } from "@/lib/support.kb.registry";
import type { KBArticle } from "@/types/support";

export type CorporateFixCategory =
  | "Windows"
  | "macOS"
  | "Mobile"
  | "O365"
  | "Networking"
  | "Printers"
  | "Security"
  | "Adobe"
  | "Figma"
  | "Browsers";

export type CorporateFixSeverity = "Low" | "Medium" | "High";

export type CorporateFixAccessLevel = "User Safe" | "Admin Required";

export type CorporateFixStepType = "info" | "command" | "warning";

export interface CorporateFixStep {
  title: string;
  type: CorporateFixStepType;
  content: string;
}

export interface CorporateTechFix {
  slug: string;
  title: string;
  category: CorporateFixCategory;
  severity: CorporateFixSeverity;
  accessLevel: CorporateFixAccessLevel;
  estimatedTime: string;
  tags: string[];
  description: string;
  steps: CorporateFixStep[];
}

interface PublishedCorporateFixesStore {
  version?: number;
  entries?: unknown[];
}

export const corporateFixCategories: CorporateFixCategory[] = [
  "Windows",
  "macOS",
  "Mobile",
  "O365",
  "Networking",
  "Printers",
  "Security",
  "Adobe",
  "Figma",
  "Browsers"
];

const supportProductFamilies = new Set<KBArticle["productFamily"]>([
  "Microsoft",
  "Adobe",
  "Figma",
  "Okta",
  "Mobile"
]);

function isCorporateFixCategory(value: string): value is CorporateFixCategory {
  return corporateFixCategories.includes(value as CorporateFixCategory);
}

function isCorporateFixSeverity(value: string): value is CorporateFixSeverity {
  return value === "Low" || value === "Medium" || value === "High";
}

function isCorporateFixAccessLevel(value: string): value is CorporateFixAccessLevel {
  return value === "User Safe" || value === "Admin Required";
}

function isCorporateFixStepType(value: string): value is CorporateFixStepType {
  return value === "info" || value === "command" || value === "warning";
}

function normalizeTags(tags: string[]): string[] {
  return [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
}

function normalizePublishedCorporateFix(value: unknown): CorporateTechFix | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<CorporateTechFix>;

  if (
    typeof candidate.slug !== "string" ||
    typeof candidate.title !== "string" ||
    typeof candidate.category !== "string" ||
    typeof candidate.severity !== "string" ||
    typeof candidate.accessLevel !== "string" ||
    typeof candidate.estimatedTime !== "string" ||
    typeof candidate.description !== "string" ||
    !Array.isArray(candidate.tags) ||
    !Array.isArray(candidate.steps)
  ) {
    return null;
  }

  if (
    !isCorporateFixCategory(candidate.category) ||
    !isCorporateFixSeverity(candidate.severity) ||
    !isCorporateFixAccessLevel(candidate.accessLevel)
  ) {
    return null;
  }

  const steps: CorporateFixStep[] = [];

  for (const step of candidate.steps) {
    if (!step || typeof step !== "object") {
      return null;
    }

    const current = step as Partial<CorporateFixStep>;
    if (
      typeof current.title !== "string" ||
      typeof current.content !== "string" ||
      typeof current.type !== "string" ||
      !isCorporateFixStepType(current.type)
    ) {
      return null;
    }

    steps.push({
      title: current.title.trim(),
      type: current.type,
      content: current.content.trim()
    });
  }

  return {
    slug: candidate.slug.trim(),
    title: candidate.title.trim(),
    category: candidate.category,
    severity: candidate.severity,
    accessLevel: candidate.accessLevel,
    estimatedTime: candidate.estimatedTime.trim(),
    tags: normalizeTags(candidate.tags.filter((tag): tag is string => typeof tag === "string")),
    description: candidate.description.trim(),
    steps
  };
}

function getPublishedCorporateFixes(): CorporateTechFix[] {
  const store = publishedCorporateFixesStore as PublishedCorporateFixesStore;
  if (!Array.isArray(store.entries)) {
    return [];
  }

  const seen = new Set<string>();
  const entries: CorporateTechFix[] = [];

  for (const raw of store.entries) {
    const entry = normalizePublishedCorporateFix(raw);
    if (!entry || !entry.slug || seen.has(entry.slug)) {
      continue;
    }

    seen.add(entry.slug);
    entries.push(entry);
  }

  return entries;
}

function mergeCorporateFixCollections(...collections: CorporateTechFix[][]): CorporateTechFix[] {
  const seen = new Set<string>();
  const merged: CorporateTechFix[] = [];

  for (const collection of collections) {
    for (const fix of collection) {
      if (seen.has(fix.slug)) {
        continue;
      }
      seen.add(fix.slug);
      merged.push(fix);
    }
  }

  return merged;
}

function toBulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function mapSupportCategoryToCorporateCategory(category: KBArticle["category"]): CorporateFixCategory {
  switch (category) {
    case "Microsoft 365":
      return "O365";
    case "Networking / VPN":
      return "Networking";
    case "Identity / MFA / SSO":
      return "Security";
    case "Printers / Scanners":
      return "Printers";
    case "Adobe":
      return "Adobe";
    case "Figma":
      return "Figma";
    case "Browsers":
      return "Browsers";
    case "Windows":
      return "Windows";
    case "macOS":
      return "macOS";
    case "iOS":
    case "Android":
      return "Mobile";
    case "AV / Conference Rooms":
      return "Networking";
    default:
      return "O365";
  }
}

function normalizeCorporateTags(article: KBArticle): string[] {
  const environmentTags =
    article.environment === "Both" ? ["windows", "macos"] : [article.environment.toLowerCase()];

  return [...new Set([...article.tags, article.productFamily.toLowerCase(), "support-kb", ...environmentTags])];
}

function buildCorporateStepsFromKBArticle(article: KBArticle): CorporateFixStep[] {
  const steps: CorporateFixStep[] = [];

  if (article.symptoms.length > 0) {
    steps.push({
      title: "Symptoms",
      type: "info",
      content: toBulletList(article.symptoms)
    });
  }

  if (article.causes.length > 0) {
    steps.push({
      title: "Likely Causes",
      type: "info",
      content: toBulletList(article.causes)
    });
  }

  for (const resolutionStep of article.resolutionSteps) {
    let content = resolutionStep.content.trim();

    if (resolutionStep.requiresAdmin) {
      content = `${content}\n\nAdmin review or admin rights may be required for this step.`;
    }

    steps.push({
      title: resolutionStep.title,
      type: resolutionStep.type === "warning" ? "warning" : "info",
      content
    });
  }

  for (const command of article.commands) {
    steps.push({
      title: command.requiresAdmin ? `${command.title} (Admin Required)` : command.title,
      type: "command",
      content: command.content
    });
  }

  if (article.escalationCriteria.length > 0) {
    steps.push({
      title: "When to Escalate to IT / Security",
      type: "warning",
      content: toBulletList(article.escalationCriteria)
    });
  }

  return steps;
}

function convertKBArticleToCorporateFix(article: KBArticle): CorporateTechFix {
  return {
    slug: `kb-${article.slug}`,
    title: article.title,
    category: mapSupportCategoryToCorporateCategory(article.category),
    severity: article.severity,
    accessLevel: article.accessLevel,
    estimatedTime: article.estimatedTime,
    tags: normalizeCorporateTags(article),
    description:
      `${article.description} This troubleshooting guide is mirrored from the Support Portal knowledge base for quick access in Corporate Tech Fixes.`,
    steps: buildCorporateStepsFromKBArticle(article)
  };
}

const corporateFixes: CorporateTechFix[] = [
  {
    slug: "outlook-not-syncing-windows-macos",
    title: "Outlook Not Syncing Mail (Windows / macOS)",
    category: "O365",
    severity: "Medium",
    accessLevel: "User Safe",
    estimatedTime: "15-20 min",
    tags: ["outlook", "exchange-online", "windows", "macos", "cache", "sync"],
    description:
      "Use this guide when Outlook stops sending or receiving mail but the user account is still active. The steps focus on safe client-side checks and explicitly call out when to escalate for Exchange, Conditional Access, or mailbox permission issues.",
    steps: [
      {
        title: "Confirm scope and service health first",
        type: "info",
        content:
          "Confirm whether the issue affects one mailbox, one device, or multiple users. Test Outlook on the web (OWA) for the same account. If OWA is also failing, treat it as a mailbox or service-side issue rather than a local Outlook client issue."
      },
      {
        title: "Validate sign-in and network connectivity",
        type: "command",
        content:
          "# Windows (PowerShell)\nTest-NetConnection outlook.office365.com -Port 443\n\n# macOS (Terminal)\nnc -vz outlook.office365.com 443",
      },
      {
        title: "Check Outlook status indicators",
        type: "info",
        content:
          "In Outlook, confirm the app is not in Work Offline mode. Review the status bar for Disconnected, Need Password, or Trying to connect messages. Ask the user to open a recent email and send a test message to themselves to confirm if the issue is send, receive, or both."
      },
      {
        title: "Restart Outlook and perform a manual sync",
        type: "info",
        content:
          "Close Outlook fully, reopen it, then trigger Send/Receive (Windows) or Sync (macOS). If a shared mailbox is impacted, confirm the primary mailbox sync is healthy before investigating the shared mailbox cache behavior."
      },
      {
        title: "Review local cache symptoms before resetting profiles",
        type: "warning",
        content:
          "Do not delete Outlook profiles or credentials as a first step in a corporate environment. Profile recreation can remove shared mailbox mappings, local signatures, and support telemetry. Escalate to the messaging team before profile reset if the user has repeated auth prompts, missing folders, or delegate access issues."
      },
      {
        title: "Escalate when mailbox or policy indicators are present",
        type: "warning",
        content:
          "Escalate to Exchange / Microsoft 365 admins if OWA fails, multiple users are affected, mailbox permissions changed recently, or sign-in logs show Conditional Access blocks, MFA loops, or risky sign-in enforcement."
      }
    ]
  },
  {
    slug: "onedrive-stuck-syncing",
    title: "OneDrive Stuck Syncing or Processing Changes",
    category: "O365",
    severity: "Medium",
    accessLevel: "User Safe",
    estimatedTime: "10-20 min",
    tags: ["onedrive", "sync", "sharepoint", "windows", "macos", "files"],
    description:
      "This guide addresses common OneDrive sync stalls caused by local client state, naming/path issues, or connectivity interruptions. It avoids risky actions like removing accounts or deleting sync roots unless approved by IT.",
    steps: [
      {
        title: "Identify what is stuck",
        type: "info",
        content:
          "Open the OneDrive client and note whether it shows Processing changes, Sync pending, or a specific file error. Check if the issue affects only OneDrive personal work files or also SharePoint library sync locations."
      },
      {
        title: "Verify account and storage status",
        type: "info",
        content:
          "Confirm the user is signed into the correct work account and not a personal Microsoft account. Check available local disk space and the user's OneDrive web portal for quota warnings or blocked file names."
      },
      {
        title: "Pause and resume sync safely",
        type: "info",
        content:
          "Pause syncing for a few minutes, then resume. If a single file is failing, temporarily rename it to remove unsupported characters or reduce path length, then re-test sync."
      },
      {
        title: "Reset the OneDrive client (safe first-line reset)",
        type: "command",
        content:
          "# Windows (Run or PowerShell)\n%localappdata%\\Microsoft\\OneDrive\\OneDrive.exe /reset\n\n# macOS (Terminal)\n/Applications/OneDrive.app/Contents/MacOS/OneDrive /reset",
      },
      {
        title: "Restart the app after reset",
        type: "command",
        content:
          "# Windows (PowerShell)\nStart-Process \"$env:LOCALAPPDATA\\Microsoft\\OneDrive\\OneDrive.exe\"\n\n# macOS (Terminal)\nopen -a OneDrive",
      },
      {
        title: "Escalate for retention, DLP, or tenant policy blocks",
        type: "warning",
        content:
          "Escalate to Microsoft 365 admins if the client repeatedly stalls on the same SharePoint library, if file access is denied after sync, or if retention labels / DLP / sensitivity policies are preventing uploads. Do not advise users to move corporate files to personal cloud storage as a workaround."
      }
    ]
  },
  {
    slug: "teams-microphone-not-detected",
    title: "Teams Microphone Not Detected",
    category: "O365",
    severity: "Medium",
    accessLevel: "User Safe",
    estimatedTime: "10-15 min",
    tags: ["teams", "audio", "microphone", "windows", "macos", "permissions"],
    description:
      "Use this guide when Microsoft Teams cannot detect or use a microphone. The steps focus on physical checks, OS permissions, Teams settings, and safe diagnostics before driver or endpoint policy escalation.",
    steps: [
      {
        title: "Confirm hardware state and mute controls",
        type: "info",
        content:
          "Check headset mute toggles, docking station audio paths, and whether the microphone works in another approved app (such as system sound settings test). Many incidents are caused by a physical mute switch or the wrong audio device selected after docking/undocking."
      },
      {
        title: "Verify OS-level microphone permissions",
        type: "info",
        content:
          "On Windows, confirm microphone access is enabled for desktop apps. On macOS, confirm Teams is allowed under Privacy & Security > Microphone. If permissions were just changed, restart Teams before retesting."
      },
      {
        title: "Collect a quick device inventory",
        type: "command",
        content:
          "# Windows (PowerShell)\nGet-CimInstance Win32_SoundDevice | Select-Object Name, Status\n\n# macOS (Terminal)\nsystem_profiler SPAudioDataType",
      },
      {
        title: "Select the correct device inside Teams",
        type: "info",
        content:
          "In Teams Settings > Devices, select the expected microphone explicitly (do not leave on Auto if multiple devices are present). Run a test call if allowed by policy and verify the level meter responds when speaking."
      },
      {
        title: "Restart Teams and reconnect USB/Bluetooth audio devices",
        type: "info",
        content:
          "Quit Teams fully (including tray/menu bar process), reconnect the headset, and relaunch Teams. If using Bluetooth, re-check the selected profile to avoid hands-free/low-quality mode mismatches."
      },
      {
        title: "Escalate for driver, endpoint protection, or policy restrictions",
        type: "warning",
        content:
          "Escalate to endpoint support if no microphone devices appear in the OS, if a corporate audio driver update recently rolled out, or if endpoint protection / privacy controls may be blocking audio input. Do not instruct users to disable security tooling."
      }
    ]
  },
  {
    slug: "cannot-open-shared-powerpoint-cross-tenant",
    title: "Cannot Open Shared PowerPoint (Cross-Tenant Access)",
    category: "O365",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "20-40 min",
    tags: ["powerpoint", "sharepoint", "cross-tenant", "external-sharing", "guest-access", "o365"],
    description:
      "This guide is for PowerPoint files shared between organizations when users receive access denied, sign-in mismatch, or tenant restriction errors. Cross-tenant access often requires identity, sharing, or security policy review by administrators.",
    steps: [
      {
        title: "Capture the exact error and sharing context",
        type: "info",
        content:
          "Record the full URL, who shared the file, the tenant/domain of the recipient, and the exact error text. Determine whether the file is in OneDrive or SharePoint and whether the share was to a named user, a guest account, or an organization-wide link."
      },
      {
        title: "Test access in a private browser session",
        type: "info",
        content:
          "Use a private/incognito browser window and sign in only with the intended corporate account. Cross-tenant failures are frequently caused by cached sessions signed into the wrong tenant."
      },
      {
        title: "Validate external sharing and guest redemption path",
        type: "info",
        content:
          "Confirm the file owner is using the approved external-sharing method for the tenant. If guest access is required, verify the recipient has redeemed the guest invitation and is using the same email address that was granted access."
      },
      {
        title: "Check for tenant restrictions or B2B policy requirements",
        type: "warning",
        content:
          "Cross-tenant access may be blocked by tenant restrictions, Conditional Access, or B2B collaboration settings. This requires Microsoft 365 / Entra ID admin review. Do not work around policy by downloading corporate content to personal accounts or unmanaged devices."
      },
      {
        title: "Escalate to identity/security with complete evidence",
        type: "warning",
        content:
          "Escalate to the IT identity or security team with the URL, error screenshot, recipient domain, and affected tenant names. Include whether the problem is specific to one file or affects all external sharing between the two organizations."
      }
    ]
  },
  {
    slug: "cloudflare-413-payload-too-large",
    title: "413 Payload Too Large (Cloudflare / Reverse Proxy)",
    category: "Networking",
    severity: "Medium",
    accessLevel: "Admin Required",
    estimatedTime: "15-30 min",
    tags: ["cloudflare", "413", "upload", "reverse-proxy", "http", "api"],
    description:
      "Use this guide when file uploads or API requests fail with HTTP 413. The objective is to identify which layer enforces the request-size limit and adjust the approved path safely without weakening security controls.",
    steps: [
      {
        title: "Confirm where the 413 is returned",
        type: "info",
        content:
          "Capture the request path, approximate payload size, and whether the response page or headers indicate Cloudflare, the origin web server, or the application. Limits differ between Cloudflare plan settings, NGINX/Apache, and the app itself."
      },
      {
        title: "Reproduce with a controlled test request",
        type: "command",
        content:
          "# Example (adjust URL and file path)\ncurl -i -X POST https://example.com/upload \\\n  -F \"file=@/path/to/test-file.zip\"",
      },
      {
        title: "Check approved upload size limits across layers",
        type: "info",
        content:
          "Review Cloudflare upload limits, reverse proxy body-size settings, and application-level request limits. The effective limit is the smallest configured value in the request path."
      },
      {
        title: "Apply the right fix for the architecture",
        type: "info",
        content:
          "Preferred fixes include chunked uploads, direct-to-object-storage uploads, or increasing limits only for the specific route that requires it. Avoid globally increasing body-size limits unless capacity and abuse controls are reviewed."
      },
      {
        title: "Security review before changing limits",
        type: "warning",
        content:
          "Do not disable WAF, bypass Cloudflare, or remove authentication checks to make uploads succeed. If the request handles sensitive or externally submitted files, coordinate with the security/platform team before raising limits."
      }
    ]
  },
  {
    slug: "mac-system-data-storage-too-high",
    title: "Mac \"System Data\" Storage Too High",
    category: "macOS",
    severity: "Medium",
    accessLevel: "Admin Required",
    estimatedTime: "20-35 min",
    tags: ["macos", "storage", "system-data", "cache", "logs", "support"],
    description:
      "This guide helps identify large local caches, logs, and snapshots contributing to high System Data on managed Macs. It emphasizes safe inspection first and escalation before deleting enterprise application data or local snapshots.",
    steps: [
      {
        title: "Confirm storage trend and user impact",
        type: "info",
        content:
          "Check whether the issue is sudden or gradual and which apps the user relies on. Confirm available free disk space and whether the problem is causing app crashes, update failures, or sync issues."
      },
      {
        title: "Restart and allow Spotlight/storage recalc",
        type: "info",
        content:
          "Restart the Mac and wait several minutes. Storage categories can temporarily misreport after large file moves, software updates, or Time Machine activity."
      },
      {
        title: "Inspect large user-library folders",
        type: "command",
        content:
          "# macOS (Terminal)\ndu -sh ~/Library/* 2>/dev/null | sort -h | tail -20",
      },
      {
        title: "Inspect common cache and log locations",
        type: "command",
        content:
          "# macOS (Terminal)\ndu -sh ~/Library/Caches ~/Library/Logs 2>/dev/null\nls -lah ~/Library/Caches | head",
      },
      {
        title: "Use approved cleanup only",
        type: "warning",
        content:
          "Only remove temporary files and caches covered by your support standard. Do not delete Outlook/OneDrive/Teams data stores, browser profiles, or MDM-related directories unless the service desk runbook explicitly allows it and the user understands the impact (re-sync, re-download, or sign-in prompts)."
      },
      {
        title: "Escalate for local snapshots or endpoint tooling growth",
        type: "warning",
        content:
          "If Time Machine local snapshots, endpoint security logs, or device management agents appear to be consuming large space, escalate to Mac platform / security engineering. Snapshot deletion and agent log rotation may require admin approval and change tracking."
      }
    ]
  },
  {
    slug: "windows-printer-stuck-queue",
    title: "Windows Printer Job Stuck in Queue",
    category: "Printers",
    severity: "Medium",
    accessLevel: "Admin Required",
    estimatedTime: "10-20 min",
    tags: ["windows", "printer", "spooler", "queue", "printing"],
    description:
      "Use this guide when print jobs remain in queue and block new jobs. It starts with user-safe actions, then moves to spooler reset steps that generally require local admin rights or remote support tooling.",
    steps: [
      {
        title: "Confirm printer scope and connection type",
        type: "info",
        content:
          "Check whether the issue affects one user, one workstation, or all users on the same printer. Note whether the printer is USB, network IP, or print-server mapped, because remediation differs."
      },
      {
        title: "Attempt user-safe queue cleanup first",
        type: "info",
        content:
          "Open Printers & scanners, open the print queue, and cancel pending jobs. If one document is corrupted, removing that single job may restore printing without service restart."
      },
      {
        title: "Restart the print spooler service (admin step)",
        type: "command",
        content:
          "# Windows (PowerShell - Run as Administrator)\nRestart-Service Spooler -Force",
      },
      {
        title: "Clear stuck spool files if service restart is insufficient",
        type: "command",
        content:
          "# Windows (PowerShell - Run as Administrator)\nStop-Service Spooler -Force\nRemove-Item \"$env:SystemRoot\\System32\\spool\\PRINTERS\\*\" -Force -ErrorAction SilentlyContinue\nStart-Service Spooler",
      },
      {
        title: "Re-test with a simple document",
        type: "info",
        content:
          "Print a small text document first. If it prints successfully but larger documents fail, check printer memory limits, driver type, and document rendering settings."
      },
      {
        title: "Escalate for driver or print server incidents",
        type: "warning",
        content:
          "Escalate to desktop engineering or print services if multiple users are affected, if jobs fail only on one print server queue, or if a recent driver rollout introduced the issue. Do not install unsigned printer drivers or disable endpoint controls."
      }
    ]
  },
  {
    slug: "vpn-connected-but-no-internet",
    title: "VPN Connected but No Internet / Internal Access",
    category: "Networking",
    severity: "High",
    accessLevel: "User Safe",
    estimatedTime: "15-25 min",
    tags: ["vpn", "networking", "dns", "routing", "split-tunnel", "windows", "macos"],
    description:
      "Use this guide when the VPN shows connected but users cannot browse, access internal systems, or resolve names. The steps gather useful diagnostics without changing security posture or bypassing VPN policy.",
    steps: [
      {
        title: "Confirm what is actually failing",
        type: "info",
        content:
          "Determine whether the user cannot access internet sites, internal-only resources, or both. Check if the issue started after changing networks (home, hotspot, office) or after a VPN client update."
      },
      {
        title: "Run basic connectivity checks",
        type: "command",
        content:
          "# Windows (PowerShell)\nTest-NetConnection 8.8.8.8 -Port 53\nTest-NetConnection intranet.company.local -Port 443\n\n# macOS (Terminal)\nping -c 2 8.8.8.8\nnc -vz intranet.company.local 443",
      },
      {
        title: "Capture DNS and route details",
        type: "command",
        content:
          "# Windows (PowerShell)\nipconfig /all\nroute print\n\n# macOS (Terminal)\nscutil --dns\nnetstat -rn",
      },
      {
        title: "Check split-tunnel expectations",
        type: "info",
        content:
          "Some VPN profiles intentionally route only internal traffic through the tunnel. If public internet works but internal names fail, the issue may be DNS suffix, route push, or access policy, not a full connectivity outage."
      },
      {
        title: "Reconnect cleanly and retest on another network",
        type: "info",
        content:
          "Disconnect the VPN, reconnect, and test again. If possible, test from a different network (for example, hotspot) to identify home-router DNS or ISP interference."
      },
      {
        title: "Escalate to network/security if routes or policy look incorrect",
        type: "warning",
        content:
          "Escalate to network/VPN engineering when route tables, DNS servers, or tunnel policies appear incorrect. Do not instruct users to disable the VPN, modify security clients, or use personal remote-access tools as a workaround."
      }
    ]
  },
  {
    slug: "mfa-device-lost-account-recovery",
    title: "MFA Device Lost (Account Recovery Steps)",
    category: "Security",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "15-45 min",
    tags: ["mfa", "account-recovery", "security", "identity", "entra-id", "authenticator"],
    description:
      "Use this runbook when a user loses or replaces a device used for MFA. Recovery must follow identity verification and security procedures; support staff should not bypass MFA policy or grant unmanaged access outside approved workflows.",
    steps: [
      {
        title: "Verify identity using approved helpdesk process",
        type: "warning",
        content:
          "Before making any MFA changes, complete the organization's identity verification process (manager confirmation, HR data checks, ticket validation, or other approved controls). MFA reset without identity verification is a security incident risk."
      },
      {
        title: "Determine what recovery methods are still available",
        type: "info",
        content:
          "Check whether the user still has access to a secondary authenticator method (hardware token, backup phone, temporary access pass, SMS if still allowed by policy). Prefer approved stronger methods first."
      },
      {
        title: "Perform an admin-assisted MFA method reset",
        type: "info",
        content:
          "Have the identity admin reset or remove the lost device's MFA registration in the identity platform, then require re-registration on the new managed device at next sign-in."
      },
      {
        title: "Revoke or review active sessions after reset",
        type: "warning",
        content:
          "If the lost device may still be accessible by another person, coordinate with IT security to revoke sessions and review sign-in activity. Escalate immediately if the user reports theft, suspicious sign-ins, or any account compromise indicators."
      },
      {
        title: "Document the recovery action",
        type: "info",
        content:
          "Record the recovery method used, identity verification evidence, and who approved the reset. This is important for auditability and repeat incident analysis."
      }
    ]
  },
  {
    slug: "intune-device-not-checking-in",
    title: "Intune Device Not Checking In",
    category: "O365",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "20-40 min",
    tags: ["intune", "device-management", "company-portal", "compliance", "windows", "macos"],
    description:
      "Use this guide when a managed device shows stale check-in status in Intune. It separates user-safe sync checks from admin-only actions such as re-enrollment or compliance policy remediation.",
    steps: [
      {
        title: "Confirm check-in delay and compliance impact",
        type: "info",
        content:
          "Check the device's last check-in time in Intune and whether it is affecting compliance, Conditional Access, or app deployment. A short delay may not require intervention if the device is offline or asleep."
      },
      {
        title: "Verify network access to Microsoft endpoints",
        type: "command",
        content:
          "# Windows (PowerShell)\nTest-NetConnection login.microsoftonline.com -Port 443\nTest-NetConnection enterpriseenrollment.manage.microsoft.com -Port 443\n\n# macOS (Terminal)\nnc -vz login.microsoftonline.com 443\nnc -vz enterpriseenrollment.manage.microsoft.com 443",
      },
      {
        title: "Collect local enrollment status (Windows)",
        type: "command",
        content:
          "# Windows (Command Prompt or PowerShell)\ndsregcmd /status",
      },
      {
        title: "Trigger a manual sync from the managed client",
        type: "info",
        content:
          "On Windows, use Settings > Accounts > Access work or school > connected account > Info > Sync. On macOS, use Company Portal (or the approved MDM agent) to check device status and initiate sync."
      },
      {
        title: "Check date/time drift and sign-in token issues",
        type: "info",
        content:
          "Incorrect system time can break token-based authentication and check-ins. Confirm the device time is syncing automatically and the signed-in work account is still valid."
      },
      {
        title: "Escalate before re-enrollment or device record deletion",
        type: "warning",
        content:
          "Do not remove the device from management or delete the Intune device record as a first-line fix unless the endpoint/Intune team approves it. Re-enrollment can impact BitLocker/FileVault keys, app deployments, and compliance history."
      }
    ]
  },
  {
    slug: "sharepoint-access-denied",
    title: "SharePoint Access Denied",
    category: "O365",
    severity: "Medium",
    accessLevel: "Admin Required",
    estimatedTime: "15-30 min",
    tags: ["sharepoint", "permissions", "o365", "access-denied", "groups", "external-sharing"],
    description:
      "Use this guide when a user receives Access Denied in SharePoint Online. Most cases are permission inheritance, sharing link scope, licensing, or guest identity mismatches and require admin review for final resolution.",
    steps: [
      {
        title: "Capture the exact URL and error context",
        type: "info",
        content:
          "Record the full site/library/file URL, time of failure, and whether the user previously had access. Confirm whether the problem occurs in browser only, sync client only, or both."
      },
      {
        title: "Validate the signed-in account and tenant",
        type: "info",
        content:
          "Confirm the user is using the correct corporate account and tenant. Access denied frequently occurs when a browser session is signed into a different tenant or a guest account than the one granted access."
      },
      {
        title: "Check permissions via group membership and inheritance",
        type: "info",
        content:
          "Review site permissions, M365 group/team membership, and whether the library or item has broken inheritance. Ensure the user was granted access through an approved group rather than ad hoc sharing where policy requires group-based access."
      },
      {
        title: "Review sharing link scope and expiration",
        type: "warning",
        content:
          "Links may expire or be limited to specific people. Avoid broadening access from Specific people to Anyone unless policy explicitly permits it. If sensitive content is involved, coordinate with data owner and security before changing access scope."
      },
      {
        title: "Escalate if DLP, sensitivity labels, or conditional access is involved",
        type: "warning",
        content:
          "Escalate to Microsoft 365 / security admins if access is blocked by sensitivity labels, DLP policies, managed-device requirements, or Conditional Access. Do not move content to less secure locations as a workaround."
      }
    ]
  },
  {
    slug: "slow-wifi-corporate-network",
    title: "Slow Wi-Fi on Corporate Network",
    category: "Networking",
    severity: "Medium",
    accessLevel: "User Safe",
    estimatedTime: "15-25 min",
    tags: ["wifi", "wireless", "networking", "latency", "signal", "corporate-lan"],
    description:
      "Use this guide when users report slow wireless performance on managed corporate networks. It helps gather signal and performance evidence before escalating to network engineering or on-site support.",
    steps: [
      {
        title: "Define the performance problem clearly",
        type: "info",
        content:
          "Confirm whether the issue is low throughput, high latency, intermittent disconnects, or poor performance only for a specific app. Capture location (floor/room), time, and whether nearby users are affected."
      },
      {
        title: "Gather wireless signal and link details",
        type: "command",
        content:
          "# Windows (Command Prompt)\nnetsh wlan show interfaces\n\n# macOS (Terminal)\n/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I",
      },
      {
        title: "Run quick latency and name-resolution checks",
        type: "command",
        content:
          "# Windows (PowerShell)\nTest-NetConnection gateway.company.local -Port 443\nping -n 10 8.8.8.8\n\n# macOS (Terminal)\nping -c 10 8.8.8.8\nnslookup intranet.company.local",
      },
      {
        title: "Check local factors before escalating",
        type: "info",
        content:
          "Ask the user to move closer to the access point if known, disable personal hotspot tethering devices nearby, and confirm no large sync/upload jobs are saturating the connection on that device."
      },
      {
        title: "Escalate with evidence for AP/channel investigation",
        type: "warning",
        content:
          "Escalate to network engineering with the location, timestamps, SSID, signal metrics, and test results. Do not provide users with corporate Wi-Fi passwords for alternate SSIDs or ask them to join unsecured networks to work around the issue."
      }
    ]
  }
];

const supportPortalFixes: CorporateTechFix[] = getKBArticles()
  .filter((article) => supportProductFamilies.has(article.productFamily))
  .sort(
    (a, b) =>
      a.productFamily.localeCompare(b.productFamily) ||
      a.category.localeCompare(b.category) ||
      a.title.localeCompare(b.title)
  )
  .map(convertKBArticleToCorporateFix);

const publishedCorporateFixes: CorporateTechFix[] = getPublishedCorporateFixes();

const corporateFixRegistry: CorporateTechFix[] = mergeCorporateFixCollections(
  publishedCorporateFixes,
  corporateFixes,
  supportPortalFixes
);

export function getCorporateFixes(): CorporateTechFix[] {
  return corporateFixRegistry.map((fix) => ({
    ...fix,
    tags: [...fix.tags],
    steps: fix.steps.map((step) => ({ ...step }))
  }));
}

export function getCorporateFixBySlug(slug: string): CorporateTechFix | undefined {
  return corporateFixRegistry.find((fix) => fix.slug === slug);
}

export function getCorporateFixTags(): string[] {
  const tagSet = new Set<string>();

  for (const fix of corporateFixRegistry) {
    for (const tag of fix.tags) {
      tagSet.add(tag);
    }
  }

  return [...tagSet].sort((a, b) => a.localeCompare(b));
}

export function getCorporateFixCategories(): CorporateFixCategory[] {
  const usedCategories = new Set(corporateFixRegistry.map((fix) => fix.category));

  return corporateFixCategories.filter((category) => usedCategories.has(category));
}
