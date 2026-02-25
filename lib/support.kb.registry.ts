import type {
  KBArticle,
  KBCommand,
  KBProductFamily,
  KBResolutionStep,
  SupportAccessLevel,
  SupportEnvironment,
  SupportSeverity
} from "@/types/support";

interface KBSeed {
  slug: string;
  title: string;
  description: string;
  category: KBArticle["category"];
  productFamily: KBProductFamily;
  product: string;
  severity?: SupportSeverity;
  accessLevel?: SupportAccessLevel;
  environment?: SupportEnvironment;
  estimatedTime?: string;
  tags: string[];
  symptoms: string[];
  causes: string[];
  remediations: string[];
  escalationCriteria: string[];
  commands?: KBCommand[];
}

function toMultilineList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

function getFallbackCommands(seed: KBSeed): KBCommand[] {
  const productToken =
    seed.product.toLowerCase().includes("creative cloud")
      ? "Creative Cloud"
      : seed.product.toLowerCase().includes("microsoft teams")
        ? "Teams"
        : seed.product.toLowerCase().includes("onedrive")
          ? "OneDrive"
          : seed.product.toLowerCase().includes("outlook")
            ? "Outlook"
            : seed.product;

  if (seed.category === "Networking / VPN") {
    return [
      {
        title: "Network and DNS checks",
        shell: "CLI",
        content:
          "# Windows (PowerShell)\nTest-NetConnection 8.8.8.8 -Port 53\nipconfig /all\n\n# macOS (Terminal)\nping -c 2 8.8.8.8\nscutil --dns"
      }
    ];
  }

  if (seed.category === "Identity / MFA / SSO") {
    return [
      {
        title: "Session and device registration checks",
        shell: "CLI",
        content:
          "# Windows\ndsregcmd /status\n\n# macOS\ndate\nscutil --proxy"
      }
    ];
  }

  if (seed.environment === "Windows") {
    return [
      {
        title: "Windows process/service quick check",
        shell: "PowerShell",
        content: `Get-Process | Where-Object { $_.ProcessName -match \"${productToken.replace(/"/g, "")}\" } | Select-Object ProcessName, Id, CPU`
      }
    ];
  }

  if (seed.environment === "macOS") {
    return [
      {
        title: "macOS process quick check",
        shell: "Terminal",
        content: `ps aux | grep -i \"${productToken.replace(/"/g, "")}\" | grep -v grep`
      }
    ];
  }

  return [
    {
      title: "Cross-platform process check",
      shell: "CLI",
      content:
        `# Windows (PowerShell)\nGet-Process | Where-Object { $_.ProcessName -match \"${productToken.replace(/"/g, "")}\" } | Select-Object ProcessName, Id\n\n# macOS (Terminal)\nps aux | grep -i \"${productToken.replace(/"/g, "")}\" | grep -v grep`
    }
  ];
}

function buildResolutionSteps(seed: KBSeed, commands: KBCommand[]): KBResolutionStep[] {
  const steps: KBResolutionStep[] = [
    {
      title: "Confirm scope, user impact, and reproduction",
      type: "info",
      content:
        "Document whether the issue affects one user, multiple users, or multiple devices. Confirm exact error messages, recent changes (password reset, update, network change), and whether the same issue reproduces in web vs desktop workflows where applicable."
    },
    {
      title: "Validate prerequisites and application/session state",
      type: "info",
      content:
        "Confirm the user is signed in with the correct corporate account, system time is accurate, network/VPN connectivity is stable, and the application is not running in offline or limited mode."
    }
  ];

  if (commands.length > 0) {
    steps.push({
      title: "Run safe diagnostics from the Commands section",
      type: "command",
      content:
        "Use the command snippets below to collect non-destructive diagnostics. Capture output in the ticket when escalation may be required. Avoid deleting profiles, cached credentials, or managed app data unless the runbook or admin approval explicitly allows it."
    });
  }

  steps.push(
    {
      title: "Apply safe remediation steps",
      type: "info",
      content: toMultilineList(seed.remediations)
    },
    {
      title: "Escalate when access, policy, or security controls are involved",
      type: "warning",
      requiresAdmin: true,
      content: toMultilineList(seed.escalationCriteria)
    }
  );

  return steps;
}

function buildArticle(seed: KBSeed): KBArticle {
  const commands = seed.commands && seed.commands.length > 0 ? seed.commands : getFallbackCommands(seed);

  return {
    slug: seed.slug,
    title: seed.title,
    description: seed.description,
    category: seed.category,
    productFamily: seed.productFamily,
    product: seed.product,
    severity: seed.severity ?? "Medium",
    accessLevel: seed.accessLevel ?? "User Safe",
    environment: seed.environment ?? "Both",
    estimatedTime: seed.estimatedTime ?? "10-20 min",
    tags: [...new Set(seed.tags.map(normalizeTag))],
    symptoms: seed.symptoms,
    causes: seed.causes,
    resolutionSteps: buildResolutionSteps(seed, commands),
    commands,
    escalationCriteria: seed.escalationCriteria,
    relatedArticleSlugs: []
  };
}

function linkRelatedArticles(articles: KBArticle[]): KBArticle[] {
  return articles.map((article) => {
    const related = articles
      .filter((candidate) => candidate.slug !== article.slug)
      .map((candidate) => {
        let score = 0;

        if (candidate.product === article.product) score += 5;
        if (candidate.productFamily === article.productFamily) score += 3;
        if (candidate.category === article.category) score += 2;
        const sharedTags = candidate.tags.filter((tag) => article.tags.includes(tag)).length;
        score += sharedTags;

        return { slug: candidate.slug, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
      .slice(0, 4)
      .map((item) => item.slug);

    return {
      ...article,
      relatedArticleSlugs: related
    };
  });
}

const microsoftSeeds: KBSeed[] = [
  {
    slug: "outlook-search-not-working-windows-macos",
    title: "Outlook Search Not Returning Expected Results",
    description:
      "Troubleshoot missing or incomplete search results in Outlook desktop clients using safe indexing, cache state, and service validation checks before profile rebuilds.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Outlook",
    environment: "Both",
    severity: "Medium",
    tags: ["outlook", "search", "indexing", "mailbox", "windows", "macos"],
    symptoms: [
      "Recent emails are not returned in search results.",
      "Search works in Outlook on the web but not in the desktop app.",
      "Search shows 'Something went wrong' or remains in progress for a long time."
    ],
    causes: [
      "Local search index is stale or incomplete.",
      "Outlook profile cache state is inconsistent after updates or large mailbox changes.",
      "Network or sign-in issues prevent mailbox content from refreshing."
    ],
    remediations: [
      "Confirm search behavior in Outlook on the web to separate mailbox/server issues from desktop client issues.",
      "Use built-in Outlook search scope options (Current Mailbox vs All Mailboxes) and verify the correct mailbox is selected.",
      "Restart Outlook and allow the client time to complete indexing after large mailbox sync activity.",
      "Escalate before rebuilding the profile if shared mailboxes, delegated access, or repeated auth prompts are involved."
    ],
    escalationCriteria: [
      "OWA search is also failing or multiple users report the issue at the same time.",
      "The issue affects eDiscovery/legal hold mailboxes or shared mailboxes with delegate access.",
      "Conditional Access or sign-in logs show repeated token failures."
    ],
    commands: [
      {
        title: "Validate connectivity to Exchange Online endpoint",
        shell: "CLI",
        content:
          "# Windows (PowerShell)\nTest-NetConnection outlook.office365.com -Port 443\n\n# macOS (Terminal)\nnc -vz outlook.office365.com 443"
      }
    ]
  },
  {
    slug: "outlook-profile-rebuild-planning-safe",
    title: "Outlook Profile Rebuild (When to Plan It Safely)",
    description:
      "Use this article to determine whether an Outlook profile rebuild is appropriate and how to prepare safely in a managed corporate environment.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Outlook",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    estimatedTime: "20-35 min",
    tags: ["outlook", "profile", "rebuild", "cache", "support-runbook"],
    symptoms: [
      "Outlook repeatedly crashes on launch or hangs while loading profile.",
      "Authentication prompts continue after successful sign-in.",
      "Folders, shared mailboxes, or send/receive behavior remain inconsistent after standard fixes."
    ],
    causes: [
      "Corrupt local Outlook profile or cache metadata.",
      "Credential/token cache mismatch after account changes.",
      "Local add-in conflicts presenting as profile corruption."
    ],
    remediations: [
      "Validate Outlook on the web and service health before changing local profiles.",
      "Record shared mailbox mappings, signatures, and cached mode settings before any rebuild.",
      "Test in safe mode / add-in-minimized workflow where supported before recreating the profile.",
      "Proceed with profile rebuild only under approved desktop support runbook steps."
    ],
    escalationCriteria: [
      "Mailbox permissions or delegate access changed recently and behavior is inconsistent across multiple devices.",
      "The user holds executive, legal, or high-sensitivity mailbox roles that require controlled change handling.",
      "Repeated crashes suggest endpoint plugin/security interaction rather than profile corruption."
    ]
  },
  {
    slug: "outlook-ost-sync-errors-cached-mode",
    title: "Outlook OST Sync Errors in Cached Mode",
    description:
      "Diagnose cached mode sync issues, OST growth behavior, and send/receive errors without immediately deleting local data files.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Outlook",
    environment: "Windows",
    severity: "Medium",
    tags: ["outlook", "ost", "cached-mode", "sync", "windows"],
    symptoms: [
      "Outlook shows Send/Receive errors or delayed folder updates.",
      "Mail appears in Outlook on the web but not in the local Outlook client.",
      "Large mailbox folders take an unusually long time to refresh."
    ],
    causes: [
      "OST file synchronization backlog due to large mailbox changes.",
      "Intermittent network connectivity causing cached mode retries.",
      "Corrupt local cache state or add-in interference."
    ],
    remediations: [
      "Confirm issue scope in Outlook on the web and note whether all folders or only one folder is affected.",
      "Check cached mode settings and ensure the device has stable network/VPN connectivity to Microsoft 365 endpoints.",
      "Reduce concurrent mailbox load (close unused shared mailboxes temporarily if approved) and allow re-sync time.",
      "Escalate before deleting or recreating OST files on managed devices."
    ],
    escalationCriteria: [
      "Multiple users experience sync errors after a policy rollout or network change.",
      "Mailbox corruption or server-side throttling is suspected.",
      "The user depends on regulated mail retention workflows and local data handling must be controlled."
    ],
    commands: [
      {
        title: "Windows connectivity checks for Outlook sync",
        shell: "PowerShell",
        content:
          "Test-NetConnection outlook.office365.com -Port 443\nGet-Process outlook | Select-Object ProcessName, Id, CPU"
      }
    ]
  },
  {
    slug: "outlook-shared-mailbox-missing-or-not-updating",
    title: "Outlook Shared Mailbox Missing or Not Updating",
    description:
      "Troubleshoot shared mailbox visibility and stale folder content in Outlook while preserving access mappings and permissions evidence.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Outlook",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "15-30 min",
    tags: ["outlook", "shared-mailbox", "permissions", "delegate", "exchange-online"],
    symptoms: [
      "Shared mailbox disappeared from Outlook navigation pane.",
      "Folders are visible but new messages do not appear.",
      "Only one user or a subset of delegates is affected."
    ],
    causes: [
      "Mailbox automapping or delegate permission changes.",
      "Local Outlook cache not refreshing shared mailbox folders.",
      "Token/session mismatch after MFA or account changes."
    ],
    remediations: [
      "Confirm whether the shared mailbox works in Outlook on the web for the same user account.",
      "Record the mailbox name and access type (Full Access, Send As, Send on Behalf) before making client changes.",
      "Restart Outlook and confirm the primary mailbox is syncing correctly first.",
      "Escalate to M365 messaging admins to verify permissions and automapping configuration."
    ],
    escalationCriteria: [
      "Permissions were recently changed or removed and multiple delegates are affected.",
      "OWA access fails or shows access denied for the shared mailbox.",
      "The mailbox contains sensitive or regulated business functions requiring admin audit trails."
    ]
  },
  {
    slug: "outlook-signature-not-syncing-or-missing",
    title: "Outlook Signature Not Syncing or Missing",
    description:
      "Troubleshoot Outlook signature inconsistencies across desktop and web clients, including roaming signature limitations and policy-managed signatures.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Outlook",
    environment: "Both",
    severity: "Low",
    tags: ["outlook", "signature", "roaming-signatures", "policy"],
    symptoms: [
      "Signature appears in Outlook on the web but not in desktop Outlook, or vice versa.",
      "User reports duplicated or outdated signatures.",
      "New messages or replies use the wrong signature by default."
    ],
    causes: [
      "Roaming signature behavior differs between client versions.",
      "Local cache/profile settings are out of sync with mailbox settings.",
      "Enterprise signature management add-in/policy overwrites user changes."
    ],
    remediations: [
      "Confirm whether the organization uses centrally managed signatures or a third-party add-in.",
      "Check default signature settings for new messages and replies in the impacted client.",
      "Restart Outlook after signature changes and retest with a new message draft.",
      "Avoid deleting signature folders manually unless endpoint support runbooks allow it."
    ],
    escalationCriteria: [
      "Signatures are enforced by central policy and templates are not applying.",
      "Add-in or compliance footer insertion fails across multiple users.",
      "The issue is tied to regulated disclaimers or legal footer requirements."
    ]
  },
  {
    slug: "outlook-sign-in-loop-mfa-prompts",
    title: "Outlook Repeated Sign-In / MFA Prompt Loop",
    description:
      "Handle Outlook authentication prompt loops safely by validating identity state, Conditional Access impact, and token refresh issues before clearing credentials.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Outlook",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "15-25 min",
    tags: ["outlook", "mfa", "auth", "signin-loop", "conditional-access"],
    symptoms: [
      "Outlook prompts for password/MFA repeatedly despite successful sign-in.",
      "Mail briefly syncs, then the client returns to 'Need Password'.",
      "Other Microsoft apps may show similar token issues."
    ],
    causes: [
      "Stale sign-in tokens or account session mismatch.",
      "Conditional Access/device compliance requirements not being met.",
      "Network proxy/VPN interruptions affecting auth endpoints."
    ],
    remediations: [
      "Verify the user can access Outlook on the web and other M365 apps with the same account.",
      "Confirm the device time and timezone are correct and syncing automatically.",
      "Check whether the issue started after password reset, device compliance change, or MFA method changes.",
      "Escalate to identity/security for sign-in log review before clearing enterprise credentials."
    ],
    escalationCriteria: [
      "Conditional Access blocks, risky sign-ins, or device compliance failures appear in identity logs.",
      "Multiple users on the same site/network experience auth loops.",
      "The user recently reported a lost MFA device or potential account compromise."
    ]
  },
  {
    slug: "outlook-calendar-freebusy-not-updating",
    title: "Outlook Calendar Free/Busy Not Updating",
    description:
      "Troubleshoot delayed or incorrect free/busy visibility in Outlook and Exchange Online, including delegate and hybrid scheduling considerations.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Outlook",
    environment: "Both",
    severity: "Medium",
    tags: ["outlook", "calendar", "freebusy", "scheduling", "exchange"],
    symptoms: [
      "Scheduling Assistant shows no availability or outdated blocks.",
      "Only some users' calendars fail to resolve free/busy information.",
      "Free/busy appears correct in web but not desktop client."
    ],
    causes: [
      "Autodiscover or availability service lookup issues.",
      "Permission/delegate settings changed for one or more calendars.",
      "Client cache state is stale after mailbox moves or profile changes."
    ],
    remediations: [
      "Confirm the target users' availability is visible in Outlook on the web.",
      "Validate calendar permissions and whether the issue is internal-only or cross-tenant.",
      "Restart Outlook and retest scheduling assistant after network reconnection.",
      "Capture affected users and timestamps if Exchange admin escalation is needed."
    ],
    escalationCriteria: [
      "Multiple users or meeting rooms show missing free/busy simultaneously.",
      "Cross-tenant scheduling or room mailbox policies appear to be involved.",
      "Permission changes or mailbox migrations occurred recently."
    ]
  },
  {
    slug: "teams-microphone-not-detected-enterprise",
    title: "Teams Microphone Not Detected (Enterprise Workstations)",
    description:
      "Troubleshoot Teams microphone detection issues using device, permission, and Teams settings checks before driver or endpoint policy escalation.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Microsoft Teams",
    environment: "Both",
    severity: "Medium",
    tags: ["teams", "microphone", "audio", "permissions", "windows", "macos"],
    symptoms: [
      "Teams does not detect any microphone device.",
      "The microphone works in OS sound settings but not in Teams.",
      "Audio input disappears after docking/undocking or headset reconnection."
    ],
    causes: [
      "Incorrect audio device selected in Teams.",
      "OS microphone permissions or privacy controls blocking Teams.",
      "USB/Bluetooth device profile switching or driver state issues."
    ],
    remediations: [
      "Confirm hardware mute switches and test microphone function in OS sound settings.",
      "Verify Teams microphone permissions in Windows Privacy settings or macOS Privacy & Security.",
      "Select the expected input device explicitly in Teams > Settings > Devices and run a test call if allowed.",
      "Restart Teams fully and reconnect the audio device before retesting."
    ],
    escalationCriteria: [
      "No input devices appear in the OS at all.",
      "A recent driver rollout or endpoint privacy policy change correlates with the incident.",
      "Multiple users on the same device model/dock report identical behavior."
    ],
    commands: [
      {
        title: "Audio device inventory (Windows/macOS)",
        shell: "CLI",
        content:
          "# Windows (PowerShell)\nGet-CimInstance Win32_SoundDevice | Select-Object Name, Status\n\n# macOS (Terminal)\nsystem_profiler SPAudioDataType"
      }
    ]
  },
  {
    slug: "teams-camera-not-detected",
    title: "Teams Camera Not Detected or Black Screen",
    description:
      "Resolve Teams camera detection failures and black preview issues using safe permission and device checks before driver replacement or security tooling changes.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Microsoft Teams",
    environment: "Both",
    severity: "Medium",
    tags: ["teams", "camera", "video", "permissions", "conference"],
    symptoms: [
      "Teams camera preview is black or unavailable.",
      "The webcam works in another app but not in Teams.",
      "Camera device disappears after docking station or monitor USB changes."
    ],
    causes: [
      "OS camera permissions blocked for Teams.",
      "Another app has exclusive access to the camera device.",
      "USB bandwidth/dock path or driver issues after hardware changes."
    ],
    remediations: [
      "Verify the camera works in system settings or another approved app, then close that app before retesting Teams.",
      "Check Windows/macOS camera privacy settings for Teams access.",
      "Select the correct camera in Teams settings and reconnect the webcam directly if using a dock/hub.",
      "Restart Teams and retest in a new meeting preview."
    ],
    escalationCriteria: [
      "No camera is detected by the operating system.",
      "The issue began after a security/endpoint privacy policy rollout.",
      "Conference room/shared device cameras fail for multiple users."
    ]
  },
  {
    slug: "teams-stuck-on-loading-or-signing-in",
    title: "Teams Stuck on Loading or Signing In",
    description:
      "Address Teams desktop app loading loops and sign-in stalls while preserving enterprise account state and identifying identity/policy dependencies.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Microsoft Teams",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "15-30 min",
    tags: ["teams", "loading", "signin", "cache", "mfa", "sso"],
    symptoms: [
      "Teams stays on splash screen or keeps loading indefinitely.",
      "Teams returns to sign-in repeatedly after successful authentication.",
      "Web version works but desktop app does not complete launch."
    ],
    causes: [
      "Corrupt local Teams cache or session state.",
      "Identity token/SSO issues or Conditional Access checks failing.",
      "Network proxy/VPN or TLS inspection interfering with sign-in endpoints."
    ],
    remediations: [
      "Validate access to Teams web in the correct tenant and capture any sign-in errors.",
      "Confirm system time, device compliance, and recent password/MFA method changes.",
      "Use approved safe cache cleanup steps only if permitted by desktop support standards.",
      "Capture logs/evidence before any reinstall or credential clearing."
    ],
    escalationCriteria: [
      "Multiple M365 apps show auth loops or device compliance messages.",
      "Conditional Access or proxy/security controls are blocking sign-in.",
      "Reinstalling the app is being considered on a managed executive/critical endpoint without change approval."
    ]
  },
  {
    slug: "teams-notifications-not-showing-desktop",
    title: "Teams Notifications Not Showing on Desktop",
    description:
      "Troubleshoot missing Teams notifications using app, OS, focus mode, and account settings checks in an enterprise-safe order.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Microsoft Teams",
    environment: "Both",
    severity: "Low",
    tags: ["teams", "notifications", "focus-mode", "desktop-alerts"],
    symptoms: [
      "Teams messages arrive but desktop banners/sounds do not appear.",
      "Notifications work on mobile but not on desktop.",
      "Only meeting reminders or only chat alerts are missing."
    ],
    causes: [
      "Teams notification settings disabled or scoped incorrectly.",
      "OS notification permissions or focus modes suppress alerts.",
      "User is signed into the wrong tenant/account profile in Teams."
    ],
    remediations: [
      "Review Teams notification settings for chats, mentions, and meeting reminders.",
      "Check OS notification permissions and Focus/Do Not Disturb mode state.",
      "Confirm the user is in the expected tenant and receives messages in Teams web.",
      "Restart Teams and test using a direct message from a teammate."
    ],
    escalationCriteria: [
      "Notifications fail across multiple users after a Teams client update.",
      "Enterprise notification policies or endpoint controls suppress Teams alerts.",
      "The issue affects critical paging/escalation workflows."
    ]
  },
  {
    slug: "teams-meeting-addin-missing-in-outlook",
    title: "Teams Meeting Add-in Missing in Outlook",
    description:
      "Resolve missing Teams Meeting add-in behavior in Outlook with safe checks for add-in state, sign-in, and Office app health before plugin reinstalls.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Microsoft Teams",
    environment: "Windows",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["teams", "outlook", "meeting-addin", "office-addin", "windows"],
    symptoms: [
      "New Teams Meeting button is missing in Outlook calendar.",
      "Add-in appears disabled or inactive in Outlook add-ins list.",
      "Issue started after Office or Teams update."
    ],
    causes: [
      "Teams add-in load behavior disabled after crash or startup timeout.",
      "Teams desktop app not signed in or not installed correctly for the user profile.",
      "Office COM add-in registration issue on the endpoint."
    ],
    remediations: [
      "Confirm Teams desktop app is installed and signed in with the same work account as Outlook.",
      "Check Outlook add-ins state and whether the Teams add-in is disabled by startup resiliency.",
      "Restart Teams first, then Outlook, and retest calendar compose.",
      "Escalate to desktop engineering before reinstalling Office components on managed devices."
    ],
    escalationCriteria: [
      "Multiple users are affected after an Office/Teams rollout.",
      "COM registration repair or Office reinstall is being considered.",
      "The device has strict software packaging controls requiring approved remediation."
    ]
  },
  {
    slug: "teams-screen-share-permissions-macos",
    title: "Teams Screen Share Permissions Not Working on macOS",
    description:
      "Fix Teams screen sharing on macOS when the app lacks Screen Recording permission or prompts persist after access was granted.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Microsoft Teams",
    environment: "macOS",
    severity: "Medium",
    tags: ["teams", "screen-share", "macos", "permissions", "screen-recording"],
    symptoms: [
      "Screen share button is available but shared content is blank.",
      "macOS repeatedly prompts for screen recording permission.",
      "Only Teams is affected; other apps can share screen."
    ],
    causes: [
      "Screen Recording permission not granted or not applied until restart.",
      "Teams app bundle/path changed after update and macOS permission record is stale.",
      "Managed privacy controls (PPPC/MDM profile) do not match installed app version/path."
    ],
    remediations: [
      "Confirm Teams is enabled in macOS Privacy & Security > Screen Recording.",
      "Quit Teams fully and relaunch after permission changes.",
      "Test screen sharing in a new meeting and verify the selected window or screen is active.",
      "Capture screenshots of macOS privacy settings if escalation is needed."
    ],
    escalationCriteria: [
      "PPPC/MDM privacy profiles appear to block or override Teams permissions.",
      "The issue affects multiple managed Macs after a Teams update.",
      "Users attempt to remove security/MDM profiles to bypass the issue."
    ]
  },
  {
    slug: "teams-safe-cache-cleanup-windows-macos",
    title: "Teams Safe Cache Cleanup (Windows / macOS)",
    description:
      "Use this article to perform approved Teams cache cleanup safely, with reminders about sign-in impact and when to escalate instead of deleting data.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Microsoft Teams",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    estimatedTime: "15-25 min",
    tags: ["teams", "cache", "cleanup", "windows", "macos", "support-runbook"],
    symptoms: [
      "Teams shows stale chats, loading loops, or UI glitches.",
      "Teams behavior improves temporarily after restart but returns.",
      "Web Teams works normally while desktop client remains unstable."
    ],
    causes: [
      "Corrupt local cache/session files.",
      "Client version mismatch or incomplete update.",
      "Identity token issues misdiagnosed as cache problems."
    ],
    remediations: [
      "Confirm Teams web behavior and capture screenshots/errors before changing local cache files.",
      "Use approved runbook cache cleanup steps only after quitting Teams fully.",
      "Document user sign-in impact and expected reauthentication prompts before proceeding.",
      "Retest core functions (chat, calls, meetings, files) after relaunch."
    ],
    escalationCriteria: [
      "Cache cleanup does not resolve the issue or auth loops persist.",
      "Conditional Access/device compliance errors are present.",
      "Multiple users on one network/site report identical Teams behavior."
    ],
    commands: [
      {
        title: "Confirm Teams processes are closed",
        shell: "CLI",
        content:
          "# Windows (PowerShell)\nGet-Process teams -ErrorAction SilentlyContinue\n\n# macOS (Terminal)\nps aux | grep -i teams | grep -v grep"
      }
    ]
  },
  {
    slug: "onedrive-processing-changes-or-stuck-syncing",
    title: "OneDrive 'Processing Changes' or Stuck Syncing",
    description:
      "Resolve common OneDrive sync stalls using safe client checks, path/name validation, and reset workflow before account removal or resync of large libraries.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "OneDrive",
    environment: "Both",
    severity: "Medium",
    tags: ["onedrive", "sync", "processing-changes", "sharepoint", "m365"],
    symptoms: [
      "OneDrive shows 'Processing changes' for an extended period.",
      "Sync icons remain pending for many files.",
      "Only one SharePoint library or folder appears stuck."
    ],
    causes: [
      "Client state backlog after network interruption or large changes.",
      "Unsupported file names/paths or long path issues.",
      "Library permissions or policy restrictions on specific files."
    ],
    remediations: [
      "Identify whether the issue is OneDrive personal work files, a synced SharePoint library, or both.",
      "Pause and resume sync, then check for file name/path errors and low disk space.",
      "Use the approved OneDrive reset command before removing accounts or deleting sync roots.",
      "Retest sync and watch for a repeated file/folder causing blockage."
    ],
    escalationCriteria: [
      "Same library stalls for multiple users.",
      "DLP, sensitivity labels, or retention policies appear to block uploads.",
      "Support is considering moving files to personal storage as a workaround."
    ],
    commands: [
      {
        title: "OneDrive reset and relaunch (Windows/macOS)",
        shell: "CLI",
        content:
          "# Windows\n%localappdata%\\Microsoft\\OneDrive\\OneDrive.exe /reset\nStart-Process \"$env:LOCALAPPDATA\\Microsoft\\OneDrive\\OneDrive.exe\"\n\n# macOS\n/Applications/OneDrive.app/Contents/MacOS/OneDrive /reset\nopen -a OneDrive"
      }
    ]
  },
  {
    slug: "onedrive-known-folder-move-issues",
    title: "OneDrive Known Folder Move (KFM) Issues",
    description:
      "Troubleshoot KFM prompts, partial Desktop/Documents sync, and blocked moves on managed devices without overriding enterprise OneDrive policies.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "OneDrive",
    environment: "Windows",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["onedrive", "known-folder-move", "kfm", "desktop", "documents", "windows"],
    symptoms: [
      "Desktop/Documents/Pictures do not complete backup to OneDrive.",
      "KFM prompt repeats or fails with policy-related messages.",
      "Users see missing or duplicated folders after partial move."
    ],
    causes: [
      "KFM policy mismatch or tenant restrictions.",
      "Unsupported existing folder redirection or permissions on user profile folders.",
      "Low disk/network reliability during initial sync."
    ],
    remediations: [
      "Confirm the device is using the correct work tenant and KFM is approved/enforced by policy.",
      "Identify whether existing redirected folders or legacy backup agents are present.",
      "Stabilize sync first, then retry KFM under desktop support guidance.",
      "Do not manually move protected profile folders outside approved migration steps."
    ],
    escalationCriteria: [
      "KFM policy conflicts with GPO/Intune settings or legacy folder redirection.",
      "User profile permission issues or migration tooling is involved.",
      "The device is at risk of data loss during folder redirection changes."
    ]
  },
  {
    slug: "onedrive-files-on-demand-not-working",
    title: "OneDrive Files On-Demand Not Working as Expected",
    description:
      "Investigate missing cloud icons, forced local downloads, or unavailable online-only files while respecting storage and compliance policies.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "OneDrive",
    environment: "Both",
    severity: "Low",
    tags: ["onedrive", "files-on-demand", "storage", "sync"],
    symptoms: [
      "Files On-Demand icons do not appear or do not change state.",
      "Online-only files download unexpectedly and consume local disk space.",
      "Users cannot mark corporate folders as online-only."
    ],
    causes: [
      "Files On-Demand setting disabled or overridden by policy.",
      "Client version/state issue after update or reset.",
      "Compliance/offline availability rules for specific libraries."
    ],
    remediations: [
      "Confirm Files On-Demand is enabled in OneDrive settings for the work account.",
      "Test file state changes on a non-sensitive folder and watch for policy messages.",
      "Restart OneDrive and allow status icons to refresh before further action.",
      "Escalate if policy-managed libraries ignore user file state selections."
    ],
    escalationCriteria: [
      "Intune/GPO settings enforce local sync state unexpectedly.",
      "Multiple users lose Files On-Demand behavior after client or policy rollout.",
      "The requested workaround would weaken data handling controls."
    ]
  },
  {
    slug: "onedrive-sync-conflicts-copy-created",
    title: "OneDrive Sync Conflicts (Duplicate Copy Created)",
    description:
      "Handle OneDrive conflict copies and version collisions in shared files while preserving the latest approved content and auditability.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "OneDrive",
    environment: "Both",
    severity: "Medium",
    tags: ["onedrive", "sync-conflict", "duplicate", "versioning", "sharepoint"],
    symptoms: [
      "Files appear with computer name or username appended to filename.",
      "Users report overwriting each other's changes in shared folders.",
      "Conflict copies recur in the same shared document set."
    ],
    causes: [
      "Simultaneous edits while devices are offline or syncing slowly.",
      "Unsupported coauthoring flow (e.g., editing local copies instead of Office web/desktop coauthoring).",
      "Repeated sync errors on one endpoint."
    ],
    remediations: [
      "Confirm which copy is the correct current version with the content owner before deleting duplicates.",
      "Use SharePoint/OneDrive version history where available to verify changes.",
      "Improve editing workflow for shared Office files (coauthoring vs local copy editing).",
      "Investigate the specific endpoint if conflict copies repeatedly originate from one device."
    ],
    escalationCriteria: [
      "Business-critical content ownership is unclear and data reconciliation needs admin help.",
      "A sync client repeatedly generates conflicts due to endpoint or permission issues.",
      "Retention/legal requirements apply to version handling."
    ]
  },
  {
    slug: "onedrive-reset-client-safe-enterprise",
    title: "OneDrive Client Reset (Enterprise-Safe Procedure)",
    description:
      "Reference article for performing a OneDrive client reset and post-reset validation without removing enterprise account configurations unnecessarily.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "OneDrive",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    estimatedTime: "10-15 min",
    tags: ["onedrive", "reset", "runbook", "sync", "support"],
    symptoms: [
      "OneDrive client UI is unresponsive or repeatedly fails to sync after restarts.",
      "Status icons do not refresh despite stable connectivity.",
      "Other OneDrive troubleshooting steps have not resolved the issue."
    ],
    causes: [
      "Local sync engine state corruption.",
      "Client update inconsistency.",
      "Persistent local cache queue issue."
    ],
    remediations: [
      "Confirm the issue is client-side and not a tenant/service incident.",
      "Inform the user that the client will restart and temporarily reindex/sync.",
      "Run the approved reset command and relaunch OneDrive.",
      "Validate the correct work account and sync locations after relaunch."
    ],
    escalationCriteria: [
      "Reset completes but the client remains in error state.",
      "The same library or file blocks sync repeatedly after reset.",
      "Endpoint controls or MDM settings appear to prevent OneDrive startup."
    ]
  },
  {
    slug: "sharepoint-access-denied-site-library-file",
    title: "SharePoint Access Denied (Site, Library, or File)",
    description:
      "Troubleshoot SharePoint Online access denied errors with identity, link scope, permission inheritance, and policy checks in the correct escalation order.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "SharePoint",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["sharepoint", "access-denied", "permissions", "sharing", "o365"],
    symptoms: [
      "User receives Access Denied for site, library, or file URL.",
      "Shared link opens for some users but not others.",
      "Access worked previously and stopped after membership/policy changes."
    ],
    causes: [
      "Wrong tenant/account signed in.",
      "Broken inheritance or missing group membership/permissions.",
      "Conditional Access, DLP, or sensitivity label restrictions."
    ],
    remediations: [
      "Capture the exact URL and test with a private browser session using the intended account.",
      "Confirm site/library/item inheritance and membership in the expected Microsoft 365 group.",
      "Review link scope (Specific people vs organization) and expiration if applicable.",
      "Use least-privilege access changes only; do not broaden access without owner approval."
    ],
    escalationCriteria: [
      "DLP, sensitivity labels, managed-device requirements, or Conditional Access blocks are involved.",
      "Multiple users lose access after a group or tenant policy change.",
      "The content is sensitive and ownership/permissions need security review."
    ]
  },
  {
    slug: "sharepoint-sync-button-missing",
    title: "SharePoint Sync Button Missing or Disabled",
    description:
      "Investigate missing Sync button behavior in SharePoint libraries, including browser limitations, policy restrictions, and library configuration.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "SharePoint",
    environment: "Both",
    severity: "Low",
    tags: ["sharepoint", "sync", "onedrive", "library", "ui"],
    symptoms: [
      "Library page does not show the Sync button.",
      "Only some libraries have Sync available.",
      "Users can open files in browser but cannot start library sync."
    ],
    causes: [
      "Library type/settings or unsupported configuration.",
      "Browser UI restrictions or unsupported session context.",
      "Tenant/site policy disables syncing for the library."
    ],
    remediations: [
      "Confirm the user is in the modern library view and signed into the correct tenant.",
      "Test in another supported browser/profile and compare library behavior.",
      "Check whether 'Add shortcut to OneDrive' is the intended enterprise workflow instead of Sync.",
      "Escalate to SharePoint admins if the site/library is intentionally blocked from sync."
    ],
    escalationCriteria: [
      "Sync is disabled by policy for data protection or records management reasons.",
      "Multiple users see missing Sync on the same library unexpectedly.",
      "Site template/customization changes likely impacted library UI commands."
    ]
  },
  {
    slug: "sharepoint-library-not-syncing-onedrive-client",
    title: "SharePoint Library Not Syncing in OneDrive Client",
    description:
      "Troubleshoot SharePoint library sync failures between SharePoint Online and the OneDrive sync client with safe client and permission checks.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "SharePoint",
    environment: "Both",
    severity: "Medium",
    tags: ["sharepoint", "onedrive", "library-sync", "permissions", "files"],
    symptoms: [
      "One library fails to sync while OneDrive personal work files sync normally.",
      "Sync starts but stalls at a specific folder/file.",
      "Users see repeated errors for the same SharePoint document library."
    ],
    causes: [
      "Library permissions or access token mismatch.",
      "Invalid file names/path lengths or unsupported content in the library.",
      "OneDrive client state issue specific to that sync relationship."
    ],
    remediations: [
      "Confirm the library opens in SharePoint web and permissions are intact.",
      "Identify the exact folder/file where sync stops and correct naming/path issues if present.",
      "Use the OneDrive client reset/runbook only after documenting the impacted library.",
      "Retest sync and capture the repeated error for escalation if unresolved."
    ],
    escalationCriteria: [
      "Library permissions or site settings changed recently.",
      "Retention labels/DLP block file sync for protected content.",
      "The issue affects multiple users on the same library."
    ]
  },
  {
    slug: "sharepoint-permissions-mismatch-after-group-change",
    title: "SharePoint Permissions Mismatch After Group Membership Change",
    description:
      "Investigate delayed or inconsistent SharePoint access after Microsoft 365 group or team membership changes, including token refresh timing and inheritance behavior.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "SharePoint",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["sharepoint", "permissions", "m365-group", "membership", "token-refresh"],
    symptoms: [
      "User was added to a group but still cannot access SharePoint content.",
      "Access works in one app/browser session but not another.",
      "Only some sites/libraries reflect updated access."
    ],
    causes: [
      "Directory/group membership propagation delay.",
      "User token/session has not refreshed to include new claims.",
      "Site/item inheritance or unique permissions override group membership."
    ],
    remediations: [
      "Confirm the user appears in the expected Microsoft 365 group/team membership list.",
      "Use a private browser session to force a fresh sign-in and token issuance.",
      "Check for unique permissions at the library/item level that bypass site group membership.",
      "Wait for propagation where appropriate, then re-test before making broad access changes."
    ],
    escalationCriteria: [
      "Propagation delay exceeds normal expectation across multiple services.",
      "Identity sync/Entra group writeback issues are suspected.",
      "Site permissions are complex and require SharePoint admin review to avoid over-permissioning."
    ]
  },
  {
    slug: "office-activation-error-sign-in-required",
    title: "Office Activation Error / Sign-In Required",
    description:
      "Troubleshoot Microsoft Office activation and licensing sign-in issues while preserving compliance with device-based and user-based licensing policies.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Microsoft Office",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["office", "activation", "licensing", "signin", "microsoft-365-apps"],
    symptoms: [
      "Office apps show activation required or unlicensed product messages.",
      "User signs in successfully but apps remain unactivated.",
      "Activation issues appeared after device replacement or account changes."
    ],
    causes: [
      "Licensing assignment missing or delayed.",
      "Token/session mismatch in Office apps.",
      "Device compliance or connectivity to licensing endpoints blocked."
    ],
    remediations: [
      "Confirm the correct work account is licensed and can access Office on the web.",
      "Check date/time, network/VPN, and proxy connectivity to Microsoft sign-in/licensing endpoints.",
      "Sign out/in of Office apps only under approved support guidance and document impact.",
      "Escalate to M365 admins if licensing assignment or tenant activation issues are suspected."
    ],
    escalationCriteria: [
      "License assignment looks correct but activation fails across multiple devices/users.",
      "Conditional Access or device compliance blocks sign-in to Office apps.",
      "User is on a restricted/shared device requiring special activation model review."
    ]
  },
  {
    slug: "office-addin-disabled-after-crash",
    title: "Office Add-in Disabled After Crash or Slow Startup",
    description:
      "Restore Office add-ins that were disabled by startup resiliency or crash handling without bypassing enterprise add-in governance controls.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Microsoft Office",
    environment: "Windows",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["office", "addin", "disabled", "outlook", "excel", "word"],
    symptoms: [
      "An Office add-in is missing or shown as disabled after app restart.",
      "Office reports add-in performance impact and disables it automatically.",
      "Business workflow relying on the add-in is interrupted."
    ],
    causes: [
      "Office startup resiliency disabled the add-in after crash/timeout.",
      "Add-in version conflict after Office update.",
      "Policy blocks loading unmanaged or deprecated add-in versions."
    ],
    remediations: [
      "Confirm the add-in is approved and required for the user/business process.",
      "Review Office add-in state (Disabled Items / COM Add-ins / Web add-ins depending on product).",
      "Restart the Office app and test with a clean launch before re-enabling.",
      "Coordinate with desktop engineering for packaged add-in reinstall/repair if needed."
    ],
    escalationCriteria: [
      "The add-in fails repeatedly across multiple devices after re-enable.",
      "Security/governance policy blocks the add-in version in use.",
      "Registry or Office repair changes are required on managed devices."
    ]
  },
  {
    slug: "office-macro-security-prompts-and-blocks",
    title: "Office Macro Security Prompts and Blocks",
    description:
      "Explain and troubleshoot macro security prompts in Office without instructing users to lower macro security or bypass trust controls.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Microsoft Office",
    environment: "Windows",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "15-30 min",
    tags: ["office", "macro", "security", "excel", "trust-center"],
    symptoms: [
      "Excel/Word blocks macros in downloaded or emailed files.",
      "Users receive security warnings and cannot run business templates.",
      "Previously working macros stop after policy changes."
    ],
    causes: [
      "Macro execution blocked by Office security policy for internet-sourced files.",
      "Trusted location/signing requirements not met.",
      "Endpoint or DLP policy update changed file trust handling."
    ],
    remediations: [
      "Confirm the business owner and source of the macro-enabled file/template.",
      "Check whether the file is marked as downloaded from the internet and whether approved trust workflows exist.",
      "Use signed macros or approved trusted locations according to enterprise standards.",
      "Do not disable macro security globally or advise users to bypass security warnings."
    ],
    escalationCriteria: [
      "Business-critical macro workflows require policy exception or code signing support.",
      "Multiple teams are blocked after Office security policy changes.",
      "Security review is needed before enabling execution for high-risk documents."
    ]
  },
  {
    slug: "mfa-device-lost-account-recovery-enterprise",
    title: "MFA Device Lost (Enterprise Account Recovery)",
    description:
      "Follow an identity-safe process for MFA recovery when users lose or replace their authenticator device, with explicit verification and escalation requirements.",
    category: "Identity / MFA / SSO",
    productFamily: "Microsoft",
    product: "Microsoft Entra ID",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "15-45 min",
    tags: ["mfa", "authenticator", "identity", "recovery", "entra-id", "security"],
    symptoms: [
      "User cannot complete MFA because the registered device is lost or replaced.",
      "Authenticator approval prompts go to an inaccessible device.",
      "User is locked out of M365 apps requiring MFA."
    ],
    causes: [
      "Primary MFA method unavailable due to device loss/replacement.",
      "No backup method or temporary access method configured.",
      "Identity verification needed before resetting MFA methods."
    ],
    remediations: [
      "Complete approved identity verification before any MFA reset or method removal.",
      "Check for available backup methods (hardware token, secondary authenticator, temporary access pass) per policy.",
      "Have an identity admin remove/reset the lost method and require re-registration on the new managed device.",
      "Document the recovery action and approvals in the ticket for auditability."
    ],
    escalationCriteria: [
      "The device was stolen or account compromise is suspected.",
      "Suspicious sign-in activity or risky sign-ins appear in identity logs.",
      "User requests a workaround that bypasses MFA policy."
    ]
  },
  {
    slug: "conditional-access-block-device-compliance",
    title: "Conditional Access Blocked Due to Device Compliance or Location",
    description:
      "Diagnose Conditional Access access denials caused by device compliance, network location, or sign-in risk conditions and route to identity/security teams appropriately.",
    category: "Identity / MFA / SSO",
    productFamily: "Microsoft",
    product: "Microsoft Entra ID",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["conditional-access", "entra-id", "device-compliance", "identity", "m365"],
    symptoms: [
      "Users receive 'You can't get there from here' or policy block messages.",
      "Access works on one device but not another.",
      "Users can sign in but are blocked when opening specific apps/resources."
    ],
    causes: [
      "Device not compliant or not recognized as managed.",
      "Sign-in from restricted location/network or high-risk context.",
      "Conditional Access policy targets specific app/resource conditions."
    ],
    remediations: [
      "Capture the exact error message, correlation ID, timestamp, and affected app/resource.",
      "Confirm device management/compliance state and whether the user is on VPN or an external network.",
      "Verify the user is signing into the correct tenant/account and not a guest context unexpectedly.",
      "Escalate to identity/security admins for sign-in log and policy evaluation."
    ],
    escalationCriteria: [
      "Access to critical business systems is blocked and policy review is needed urgently.",
      "Multiple users are blocked after a policy change.",
      "Users propose bypassing compliance/VPN/security requirements to continue work."
    ]
  },
  {
    slug: "microsoft-sign-in-loop-office-apps-and-web",
    title: "Microsoft Sign-In Loop (Desktop Apps and Web)",
    description:
      "Troubleshoot recurring sign-in loops across Microsoft apps and web sessions by isolating identity, token, browser, and device state issues.",
    category: "Identity / MFA / SSO",
    productFamily: "Microsoft",
    product: "Microsoft Entra ID",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["signin-loop", "sso", "m365", "token", "browser", "office"],
    symptoms: [
      "User is redirected to sign in repeatedly without reaching the app.",
      "Desktop apps and web portals both prompt repeatedly.",
      "Problem started after password reset, browser profile change, or device enrollment changes."
    ],
    causes: [
      "Stale cookies/tokens or browser session conflicts across tenants.",
      "Conditional Access/device compliance checks not passing.",
      "Network/proxy interference with auth redirects."
    ],
    remediations: [
      "Test in a private browser session using only the intended corporate account.",
      "Confirm system time and device compliance state are healthy.",
      "Compare behavior on another network to isolate proxy/VPN issues.",
      "Escalate with timestamps and correlation IDs for identity log review."
    ],
    escalationCriteria: [
      "Multiple users show sign-in loops after policy, proxy, or browser updates.",
      "Conditional Access logs indicate block/challenge loops.",
      "The account may be compromised or under risk-based restrictions."
    ]
  },
  {
    slug: "cross-tenant-file-access-mac-app-vs-web",
    title: "Cross-Tenant File Access Fails in Mac App but Works on Web",
    description:
      "Troubleshoot cross-tenant Microsoft file access differences between desktop apps on macOS and web clients, focusing on identity context and sharing policies.",
    category: "Identity / MFA / SSO",
    productFamily: "Microsoft",
    product: "Microsoft 365 Cross-Tenant Access",
    environment: "macOS",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "20-40 min",
    tags: ["cross-tenant", "macos", "office", "sharepoint", "guest-access", "identity"],
    symptoms: [
      "Shared file opens in browser but fails in PowerPoint/Word/Excel desktop app on Mac.",
      "Users see account mismatch or permission prompts in desktop apps.",
      "Issue occurs only for external tenant content."
    ],
    causes: [
      "Desktop app token/account context differs from browser session.",
      "Guest/B2B account not properly selected or redeemed in the desktop app workflow.",
      "Cross-tenant sharing/policy restrictions for desktop app access."
    ],
    remediations: [
      "Capture the exact file URL and compare browser vs desktop app sign-in identities.",
      "Test in a private browser session to confirm the intended guest/corporate account path.",
      "Verify the share uses the approved external sharing method and recipient identity.",
      "Escalate to M365 identity/sharepoint admins for tenant sharing and B2B policy review."
    ],
    escalationCriteria: [
      "Tenant restrictions, Conditional Access, or B2B settings likely block desktop app access.",
      "Multiple users or all external shares from a partner tenant are affected.",
      "Users request insecure workarounds such as personal accounts or unmanaged downloads."
    ]
  }
];

const adobeSeeds: KBSeed[] = [
  {
    slug: "adobe-creative-cloud-desktop-app-not-opening",
    title: "Adobe Creative Cloud Desktop App Not Opening",
    description:
      "Troubleshoot Adobe Creative Cloud desktop app launch failures using safe process, sign-in, and cache checks before reinstalling managed Adobe packages.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Creative Cloud",
    environment: "Both",
    severity: "Medium",
    tags: ["adobe", "creative-cloud", "desktop-app", "launch", "cache"],
    symptoms: [
      "Creative Cloud desktop app does not open or closes after splash screen.",
      "App launches but stays blank/loading indefinitely.",
      "Users cannot install or update Adobe apps because the desktop app is unavailable."
    ],
    causes: [
      "Corrupt local Creative Cloud cache/session data.",
      "Licensing/sign-in token issue.",
      "Proxy/network access problem to Adobe services."
    ],
    remediations: [
      "Confirm Adobe service status and user sign-in access in browser if possible.",
      "Close Adobe background processes and relaunch the Creative Cloud desktop app.",
      "Use approved Adobe cache reset steps before reinstalling managed packages.",
      "Retest sign-in and app management functions after relaunch."
    ],
    escalationCriteria: [
      "Problem affects multiple users after Adobe app/package update rollout.",
      "Licensing/SSO integration errors persist after safe cache reset.",
      "Reinstall requires enterprise software packaging or admin approval."
    ]
  },
  {
    slug: "adobe-sign-in-loop-or-licensing-prompt",
    title: "Adobe Sign-In Loop or Licensing Prompt Repeats",
    description:
      "Resolve Adobe sign-in loops and recurring licensing prompts in managed environments with identity, licensing assignment, and proxy checks.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Creative Cloud",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["adobe", "sign-in", "licensing", "sso", "loop"],
    symptoms: [
      "Adobe apps ask users to sign in repeatedly.",
      "Licensing prompts appear after successful login.",
      "Apps open in trial mode unexpectedly."
    ],
    causes: [
      "SSO/federated sign-in issue or stale Adobe session.",
      "License assignment mismatch or entitlement change.",
      "Network/proxy blocks Adobe identity/licensing endpoints."
    ],
    remediations: [
      "Confirm Adobe account/entitlement in the Adobe web portal and correct org profile is selected.",
      "Validate sign-in in browser and compare with desktop app behavior.",
      "Check proxy/VPN connectivity and SSL inspection impact for Adobe services.",
      "Use approved sign-out/cache cleanup workflow only if required by support runbook."
    ],
    escalationCriteria: [
      "Enterprise SSO integration or directory sync issue is suspected.",
      "Licensing entitlement is missing or inconsistent across users.",
      "Multiple users report the same issue after a policy/network change."
    ]
  },
  {
    slug: "acrobat-cannot-combine-files-sharepoint-or-onedrive",
    title: "Acrobat 'Cannot Combine Files' (SharePoint / OneDrive Sources)",
    description:
      "Troubleshoot Acrobat combine/merge failures when files are opened from SharePoint or OneDrive synced paths, focusing on permissions and local file availability.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Acrobat",
    environment: "Both",
    severity: "Medium",
    tags: ["adobe", "acrobat", "pdf", "sharepoint", "onedrive", "combine-files"],
    symptoms: [
      "Acrobat fails to combine PDF files stored in SharePoint/OneDrive locations.",
      "Some files combine while others fail with access/open errors.",
      "Issue is more common with online-only synced files."
    ],
    causes: [
      "Files not fully available locally (online-only placeholders).",
      "Path length, special characters, or permission restrictions.",
      "Acrobat integration/session issue with cloud storage provider."
    ],
    remediations: [
      "Confirm files can be opened individually and are fully downloaded locally before combining.",
      "Test with short local paths and simplified filenames for a controlled reproduction.",
      "Validate user access to SharePoint/OneDrive locations and avoid using personal storage workarounds.",
      "Retest in a local temp workspace approved for corporate documents."
    ],
    escalationCriteria: [
      "The issue affects many users after Acrobat version change.",
      "SharePoint/OneDrive policy restrictions or DLP controls block file operations.",
      "Enterprise Acrobat packaging/plugin conflict is suspected."
    ]
  },
  {
    slug: "acrobat-browser-plugin-conflicts-chrome-edge",
    title: "Acrobat Browser Plugin Conflicts (Chrome / Edge)",
    description:
      "Troubleshoot Acrobat extension conflicts, PDF handler issues, and browser policies affecting PDF open/preview workflows in corporate browsers.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Acrobat",
    environment: "Both",
    severity: "Low",
    tags: ["adobe", "acrobat", "browser", "chrome", "edge", "plugin"],
    symptoms: [
      "PDFs fail to preview correctly in browser.",
      "Browser repeatedly prompts to open/download PDFs unexpectedly.",
      "Acrobat extension behaviors differ between Chrome and Edge."
    ],
    causes: [
      "Browser extension conflict or disabled Acrobat extension.",
      "Browser PDF handler policy overrides.",
      "Acrobat desktop integration mismatch after update."
    ],
    remediations: [
      "Confirm which browser is standard/approved for the user and reproduce consistently.",
      "Check browser extension state and enterprise browser policies for PDF handling.",
      "Test with Acrobat extension temporarily disabled only if policy allows and document results.",
      "Restore the approved browser/extension configuration after testing."
    ],
    escalationCriteria: [
      "Browser policies require change via endpoint/browser management.",
      "Issue affects all users after extension or browser rollout.",
      "PDF workflows are tied to signed/legal document processes."
    ]
  },
  {
    slug: "adobe-fonts-not-syncing-creative-cloud",
    title: "Adobe Fonts Not Syncing in Creative Cloud",
    description:
      "Fix Adobe Fonts sync delays or failures in Creative Cloud apps while considering licensing, network, and enterprise font policy restrictions.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Fonts",
    environment: "Both",
    severity: "Medium",
    tags: ["adobe", "fonts", "creative-cloud", "sync", "licensing"],
    symptoms: [
      "Adobe Fonts do not activate in Creative Cloud apps.",
      "Fonts show as syncing but never become available.",
      "Only some fonts fail for one user or one device."
    ],
    causes: [
      "Creative Cloud sign-in/session issue.",
      "Network/proxy restrictions to Adobe Fonts services.",
      "Enterprise licensing or font policy restrictions."
    ],
    remediations: [
      "Confirm the user is signed in to the correct Adobe enterprise profile.",
      "Check Creative Cloud desktop app health and basic connectivity to Adobe services.",
      "Retry font activation and test in one Creative Cloud app after relaunch.",
      "Use local approved fonts when business-critical work cannot wait, then continue support workflow."
    ],
    escalationCriteria: [
      "Enterprise font entitlement/policy restrictions are suspected.",
      "Proxy/SSL inspection blocks Adobe Fonts for multiple users.",
      "The issue impacts shared brand font deployments requiring design platform coordination."
    ]
  },
  {
    slug: "adobe-cc-libraries-not-syncing",
    title: "Adobe Creative Cloud Libraries Not Syncing",
    description:
      "Troubleshoot Creative Cloud Libraries sync issues across Adobe apps with emphasis on account context, app versions, and network reliability.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe CC Libraries",
    environment: "Both",
    severity: "Medium",
    tags: ["adobe", "cc-libraries", "sync", "creative-cloud"],
    symptoms: [
      "Library assets appear on one device but not another.",
      "Libraries panel shows sync errors or stale assets.",
      "Only one Adobe app reflects outdated library content."
    ],
    causes: [
      "Creative Cloud desktop app/session state issue.",
      "App version mismatch affecting library sync features.",
      "Network interruptions or service sync delays."
    ],
    remediations: [
      "Confirm sign-in to the same Adobe org/profile across apps and devices.",
      "Restart the affected Adobe app and Creative Cloud desktop app.",
      "Check library asset visibility on the Adobe web experience where available.",
      "Escalate if library sync delays affect multiple designers or teams."
    ],
    escalationCriteria: [
      "Team-wide library sync outage is suspected.",
      "Asset permissions/ownership within shared libraries are inconsistent.",
      "Enterprise Adobe admin action is required to fix org profile access."
    ]
  },
  {
    slug: "adobe-pdf-preview-issues-finder-explorer",
    title: "PDF Preview Issues in Finder / Explorer",
    description:
      "Diagnose PDF preview problems in file explorers (macOS Finder / Windows Explorer) where Acrobat integration or thumbnail handlers may be involved.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Acrobat",
    environment: "Both",
    severity: "Low",
    tags: ["adobe", "acrobat", "pdf-preview", "finder", "explorer", "thumbnails"],
    symptoms: [
      "PDF thumbnails/previews are missing or incorrect in Finder/Explorer.",
      "Preview works for some PDFs only.",
      "Issue started after Acrobat update or OS update."
    ],
    causes: [
      "Thumbnail/preview cache stale.",
      "Default PDF handler integration changed.",
      "Acrobat/OS preview extension mismatch."
    ],
    remediations: [
      "Confirm PDFs open normally in the approved PDF app before focusing on thumbnails/previews.",
      "Check default PDF application association and recent Acrobat updates.",
      "Restart the affected app/session and allow preview cache rebuild.",
      "Treat as cosmetic unless business workflow requires previews for critical triage."
    ],
    escalationCriteria: [
      "Preview failure is tied to managed OS image or Acrobat package rollout.",
      "Preview handlers crash Explorer/Finder or impact stability.",
      "Security tooling blocks previews for protected PDF types."
    ]
  },
  {
    slug: "adobe-device-limit-or-activation-count-reached",
    title: "Adobe Device Limit / Activation Count Reached",
    description:
      "Handle Adobe activation limit prompts in enterprise licensing scenarios without instructing users to de-activate unknown devices themselves.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Licensing",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["adobe", "activation", "device-limit", "licensing"],
    symptoms: [
      "Adobe apps report device limit reached or too many activations.",
      "User recently received a replacement device or reimage.",
      "Apps open in reduced functionality due to licensing state."
    ],
    causes: [
      "Old device activations still associated with the user account.",
      "Enterprise entitlement/profile mismatch.",
      "Licensing sign-in state not fully refreshed after hardware change."
    ],
    remediations: [
      "Confirm recent device replacements/reimages and collect asset identifiers if available.",
      "Check Adobe account profile and enterprise org membership.",
      "Coordinate with Adobe admin for approved activation cleanup or entitlement review.",
      "Retest app sign-in after admin-side licensing adjustments."
    ],
    escalationCriteria: [
      "Activation cleanup requires admin console changes.",
      "Multiple users report device-limit prompts unexpectedly.",
      "User is in the wrong Adobe org profile due to SSO mapping issues."
    ]
  },
  {
    slug: "adobe-cache-cleanup-windows-safe-locations",
    title: "Adobe Cache Cleanup (Windows, Safe Locations)",
    description:
      "Reference safe Windows cache cleanup targets for Adobe apps, with reminders to avoid deleting managed profiles and licensed content without approval.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Creative Cloud",
    environment: "Windows",
    severity: "Medium",
    accessLevel: "Admin Required",
    estimatedTime: "15-25 min",
    tags: ["adobe", "cache", "cleanup", "windows", "creative-cloud"],
    symptoms: [
      "Adobe apps crash, hang, or show stale UI after updates.",
      "Creative Cloud app behavior remains unstable after restart.",
      "Support runbook indicates cache cleanup as approved next step."
    ],
    causes: [
      "Corrupt Adobe cache/temp files.",
      "Interrupted app update leaving stale cache state.",
      "Session/cache mismatch between Adobe components."
    ],
    remediations: [
      "Close Adobe apps and document which products are impacted before cleanup.",
      "Use only approved cache/temp locations from enterprise runbooks.",
      "Avoid deleting user projects, presets, or managed configuration directories unless explicitly approved.",
      "Restart the workstation and retest core app launch/sign-in."
    ],
    escalationCriteria: [
      "Cache cleanup does not resolve the issue and reinstall is required.",
      "Packaging/permissions prevent Adobe app repair steps.",
      "The issue is linked to enterprise image or endpoint policy changes."
    ]
  },
  {
    slug: "adobe-cache-cleanup-macos-safe-locations",
    title: "Adobe Cache Cleanup (macOS, Safe Locations)",
    description:
      "Reference safe macOS cache cleanup locations for Adobe apps and Creative Cloud without removing licensed assets or managed app configurations.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Creative Cloud",
    environment: "macOS",
    severity: "Medium",
    accessLevel: "Admin Required",
    estimatedTime: "15-25 min",
    tags: ["adobe", "cache", "cleanup", "macos", "creative-cloud"],
    symptoms: [
      "Adobe apps fail to launch or show blank screens on macOS.",
      "Creative Cloud app remains unstable after restart.",
      "Symptoms recur after automatic Adobe updates."
    ],
    causes: [
      "Corrupt local cache files in user Library paths.",
      "Interrupted Adobe component update.",
      "Session/cache mismatch across Adobe services."
    ],
    remediations: [
      "Collect impacted app names and confirm sign-in state before cleanup.",
      "Follow approved Adobe/macOS runbook cache locations only.",
      "Do not remove managed profiles, licensing files, or user content without approval.",
      "Relaunch Creative Cloud and affected apps after cleanup."
    ],
    escalationCriteria: [
      "Mac management/privacy controls interfere with Adobe components.",
      "Issue persists across multiple Macs after Adobe update.",
      "Reinstall/repair requires packaging or admin support."
    ]
  },
  {
    slug: "premiere-pro-performance-safe-enterprise-checks",
    title: "Premiere Pro Performance Slowdowns (Enterprise-Safe Checks)",
    description:
      "Provide safe troubleshooting guidance for Premiere Pro performance issues on managed devices without disabling endpoint security or unsupported GPU settings.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Premiere Pro",
    environment: "Both",
    severity: "Medium",
    tags: ["adobe", "premiere-pro", "performance", "gpu", "media-cache"],
    symptoms: [
      "Premiere Pro playback stutters or timeline scrubbing is slow.",
      "Exports are significantly slower than usual.",
      "Performance drops after project size increases or app updates."
    ],
    causes: [
      "Large media cache/project complexity.",
      "Hardware acceleration mismatch or driver issues.",
      "Insufficient local disk space or slow network media paths."
    ],
    remediations: [
      "Confirm project media locations (local vs network) and available disk space.",
      "Review approved Adobe performance settings and media cache location/size.",
      "Test with a smaller project or local copied media to isolate network storage bottlenecks.",
      "Coordinate with endpoint/graphics support if driver issues are suspected."
    ],
    escalationCriteria: [
      "GPU driver/package issues affect multiple creative workstations.",
      "Users request disabling endpoint protection for performance gains.",
      "Shared storage throughput or NAS issues are impacting multiple editors."
    ]
  },
  {
    slug: "after-effects-performance-safe-enterprise-checks",
    title: "After Effects Performance Issues (Enterprise-Safe Checks)",
    description:
      "Troubleshoot After Effects performance degradation with safe cache, project, and resource checks appropriate for managed creative endpoints.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe After Effects",
    environment: "Both",
    severity: "Medium",
    tags: ["adobe", "after-effects", "performance", "cache", "render"],
    symptoms: [
      "Compositions preview slowly or render times increase sharply.",
      "Memory warnings appear during preview/render.",
      "Performance issues worsen with specific plugins/projects."
    ],
    causes: [
      "Disk cache growth or low free space.",
      "Plugin or version compatibility issues.",
      "Resource limits on shared/managed endpoints."
    ],
    remediations: [
      "Check free disk space and approved cache settings/locations.",
      "Test a clean/new project or disable non-essential project elements to isolate scope.",
      "Confirm plugin versions are approved and consistent across the team when possible.",
      "Escalate to desktop engineering for graphics driver or hardware acceleration issues."
    ],
    escalationCriteria: [
      "Crashes or performance regressions correlate with plugin or GPU driver rollouts.",
      "Multiple creative users report the same slowdown after image updates.",
      "Users propose insecure workarounds to bypass endpoint controls."
    ]
  },
  {
    slug: "illustrator-slow-opening-network-assets",
    title: "Illustrator Slow Opening Files from Network/Cloud Assets",
    description:
      "Troubleshoot slow Illustrator open/save operations when files and linked assets are stored on network shares or cloud-synced paths.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Illustrator",
    environment: "Both",
    severity: "Medium",
    tags: ["adobe", "illustrator", "performance", "network-share", "linked-assets"],
    symptoms: [
      "Illustrator opens files slowly, especially with many linked assets.",
      "Save operations hang when assets are on shared/network locations.",
      "Performance is normal with small local files."
    ],
    causes: [
      "Network path latency or inconsistent VPN connectivity.",
      "Large linked asset sets and missing/relocating links.",
      "Cloud sync conflicts on working files."
    ],
    remediations: [
      "Test with a local copy of the file and linked assets to isolate network latency.",
      "Verify stable network/VPN connection and avoid simultaneous sync-heavy operations.",
      "Check link panel for missing assets and path resolution issues.",
      "Use approved shared storage workflows for collaborative design assets."
    ],
    escalationCriteria: [
      "Shared storage performance issue impacts multiple designers.",
      "VPN/network latency is abnormal or site-specific.",
      "Storage architecture changes are needed for design workflows."
    ]
  },
  {
    slug: "photoshop-scratch-disk-full-managed-device",
    title: "Photoshop Scratch Disk Full on Managed Device",
    description:
      "Handle Photoshop scratch disk issues safely on corporate-managed devices, including storage checks and approved cleanup without deleting user content unexpectedly.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Photoshop",
    environment: "Both",
    severity: "Medium",
    tags: ["adobe", "photoshop", "scratch-disk", "storage", "performance"],
    symptoms: [
      "Photoshop reports scratch disk full errors.",
      "Photoshop cannot complete save/open operations due to low disk space.",
      "Performance degrades significantly during editing/export."
    ],
    causes: [
      "Low free disk space on system or configured scratch volume.",
      "Large temp/cache files from Adobe or other creative apps.",
      "Scratch disk settings pointing to slow or unavailable storage."
    ],
    remediations: [
      "Confirm available disk space and identify the configured scratch disk location.",
      "Use approved cleanup steps for temporary/cache files and non-business-critical local clutter.",
      "Check Photoshop scratch disk preferences and ensure they point to valid corporate-approved storage.",
      "Avoid deleting user project files without confirmation and backup awareness."
    ],
    escalationCriteria: [
      "Persistent low storage indicates device capacity issue for job role/workload.",
      "Shared storage policies or endpoint controls limit necessary temp/cache behavior.",
      "Device replacement/upgrade may be required for creative workload standards."
    ]
  },
  {
    slug: "acrobat-default-app-or-open-permissions-issue",
    title: "Acrobat Default App / Open Permission Issue",
    description:
      "Troubleshoot cases where PDFs do not open in Acrobat as expected due to default app associations, managed policies, or file permission restrictions.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Acrobat",
    environment: "Both",
    severity: "Low",
    tags: ["adobe", "acrobat", "default-app", "pdf", "permissions"],
    symptoms: [
      "Double-clicking a PDF opens the wrong app or fails.",
      "Users cannot change PDF default app due to policy restrictions.",
      "Some PDFs open but protected files do not."
    ],
    causes: [
      "Default application association changed by OS/browser updates.",
      "Endpoint policy controls default app settings.",
      "File location permissions or DLP restrictions block open-in-desktop workflows."
    ],
    remediations: [
      "Confirm whether the issue is default app behavior or file-specific access denial.",
      "Check approved PDF handler policy and endpoint management configuration.",
      "Test opening the same file from a different permitted location and with Acrobat launched first.",
      "Escalate if policy-controlled associations require endpoint admin changes."
    ],
    escalationCriteria: [
      "Default app associations are centrally managed and need policy update.",
      "Protected/sensitive documents fail due to security policy restrictions.",
      "Multiple devices show the same Acrobat association issue after updates."
    ]
  }
];

const figmaSeeds: KBSeed[] = [
  {
    slug: "figma-desktop-app-wont-open",
    title: "Figma Desktop App Won't Open",
    description:
      "Troubleshoot Figma desktop app launch failures using safe process, cache, and sign-in checks before reinstalling or modifying managed app controls.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma Desktop App",
    environment: "Both",
    severity: "Medium",
    tags: ["figma", "desktop-app", "launch", "cache", "startup"],
    symptoms: [
      "Figma desktop app does not launch or closes immediately.",
      "App window opens blank and becomes unresponsive.",
      "Users can still access Figma in browser."
    ],
    causes: [
      "Corrupt local cache/session state.",
      "App update issue or packaged install mismatch.",
      "Proxy/network restrictions affecting startup auth."
    ],
    remediations: [
      "Confirm browser access to Figma and capture whether the issue is desktop-only.",
      "Close Figma background processes and relaunch the app.",
      "Use approved cache reset/reinstall workflow only if desktop support standards allow it.",
      "Collect screenshots and timestamps if the app crashes on launch."
    ],
    escalationCriteria: [
      "Issue affects multiple users after Figma desktop app update.",
      "Endpoint packaging or software distribution is suspected.",
      "Proxy/certificate inspection may be interfering with startup connectivity."
    ]
  },
  {
    slug: "figma-desktop-app-stuck-on-loading",
    title: "Figma Desktop App Stuck on Loading",
    description:
      "Fix Figma desktop loading loops by validating account context, network access, and local app state before reinstalling the desktop client.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma Desktop App",
    environment: "Both",
    severity: "Medium",
    tags: ["figma", "desktop-app", "loading", "signin", "cache"],
    symptoms: [
      "Figma desktop app opens but remains on loading screen.",
      "Loading loop occurs after SSO login or tenant switch.",
      "Browser Figma works while desktop client does not."
    ],
    causes: [
      "Local app cache/session corruption.",
      "SSO token/session mismatch.",
      "Proxy/VPN or certificate inspection disrupting app requests."
    ],
    remediations: [
      "Verify Figma browser access in the same tenant/workspace.",
      "Check the device network/proxy/VPN path and compare behavior on another network if possible.",
      "Apply approved Figma cache reset workflow if documented for your environment.",
      "Capture console/log details if available before reinstalling."
    ],
    escalationCriteria: [
      "SSO or IdP integration issues affect multiple users.",
      "Corporate proxy/certificate trust path appears to block Figma desktop requests.",
      "Desktop app version rollout/package is causing widespread loading loops."
    ]
  },
  {
    slug: "figma-browser-webgl-disabled-or-unsupported",
    title: "Figma Browser Issue: WebGL Disabled or Unsupported",
    description:
      "Troubleshoot Figma browser rendering failures caused by WebGL availability, browser hardware acceleration settings, or GPU/driver policies.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma Web",
    environment: "Both",
    severity: "Medium",
    tags: ["figma", "webgl", "browser", "chrome", "edge", "gpu"],
    symptoms: [
      "Figma canvas fails to render or shows unsupported browser/GPU warnings.",
      "Browser tab becomes blank or extremely slow when opening design files.",
      "Issue differs between browsers on the same device."
    ],
    causes: [
      "WebGL disabled by browser settings or policy.",
      "Hardware acceleration disabled or GPU incompatibility.",
      "Graphics driver or remote session limitations."
    ],
    remediations: [
      "Test Figma in an alternate supported browser and compare the result.",
      "Review browser hardware acceleration state and WebGL availability pages (e.g., browser diagnostics pages).",
      "Check whether the user is on VDI/remote session where GPU acceleration is limited.",
      "Escalate to endpoint/browser management if WebGL is disabled by policy."
    ],
    escalationCriteria: [
      "Browser policy disables hardware acceleration or WebGL for a user group.",
      "GPU driver issue affects multiple devices/models.",
      "Design workflow is blocked on managed VDI with limited graphics acceleration."
    ]
  },
  {
    slug: "figma-fonts-missing-enterprise-restrictions",
    title: "Figma Fonts Missing (Enterprise Font Restrictions)",
    description:
      "Troubleshoot missing fonts in Figma with attention to enterprise font deployment, licensing restrictions, and local font helper behavior.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma Fonts",
    environment: "Both",
    severity: "Medium",
    tags: ["figma", "fonts", "enterprise", "permissions", "design"],
    symptoms: [
      "Designs show missing fonts in Figma desktop or browser.",
      "Fonts are available on one device but not another.",
      "Team members report inconsistent text rendering."
    ],
    causes: [
      "Enterprise font not installed or not available to the current user profile.",
      "Figma font service/helper not running or not allowed.",
      "Licensing restrictions on specific fonts."
    ],
    remediations: [
      "Confirm whether the font is corporate-managed, licensed, and approved for the user team.",
      "Verify the font is installed locally and visible to other approved apps.",
      "Check Figma font helper/service status (if used) and relaunch Figma.",
      "Coordinate with desktop/design systems teams for managed font deployment."
    ],
    escalationCriteria: [
      "Font licensing or enterprise distribution policy restricts the requested font.",
      "Font deployment tooling/package is failing across multiple designers.",
      "Users propose installing unlicensed fonts to bypass the issue."
    ]
  },
  {
    slug: "figma-sso-sign-in-loop",
    title: "Figma SSO Sign-In Loop",
    description:
      "Troubleshoot Figma SSO sign-in loops by isolating browser cookies, IdP session state, and corporate security controls without bypassing SSO requirements.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma SSO",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["figma", "sso", "signin-loop", "identity", "cookies"],
    symptoms: [
      "User returns to Figma login page after successful SSO authentication.",
      "Figma opens, then prompts sign-in again immediately.",
      "Issue happens in browser and/or desktop app for enterprise users."
    ],
    causes: [
      "Stale browser cookies/session storage or blocked third-party cookies.",
      "IdP/SSO mapping issue or workspace domain mismatch.",
      "Security controls interfering with auth redirects."
    ],
    remediations: [
      "Test in a private browser session and sign in only with the intended work account.",
      "Confirm the user's email/domain is assigned to the expected Figma org/workspace and IdP app.",
      "Check browser cookie/site data settings and corporate browser policies.",
      "Capture IdP correlation IDs or login events for escalation."
    ],
    escalationCriteria: [
      "IdP/Figma SSO integration issue affects multiple users.",
      "Browser policies block cookies/redirects needed for enterprise SSO.",
      "Users request personal-account fallback for corporate content."
    ]
  },
  {
    slug: "figma-team-project-permissions-confusion",
    title: "Figma Team/Project Permission Confusion (View vs Edit)",
    description:
      "Resolve Figma access confusion caused by team/project/file-level permissions and role inheritance without broadening access unnecessarily.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma Permissions",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["figma", "permissions", "team", "project", "access"],
    symptoms: [
      "User can view a file but cannot edit or use Dev Mode/inspect features.",
      "Permissions differ between files in the same project.",
      "Invited user still cannot access after invitation accepted."
    ],
    causes: [
      "Permission set at file/project/team level differs from expectation.",
      "Seat/license role limitations in the Figma org.",
      "Wrong account or workspace selected during sign-in."
    ],
    remediations: [
      "Confirm the user is signed into the correct Figma workspace/account.",
      "Check file, project, and team permission layers and role assignments.",
      "Use least-privilege changes and confirm required capability (view, comment, edit, dev mode).",
      "Document the owner approval if privileged access is granted."
    ],
    escalationCriteria: [
      "Org seat/license assignment requires Figma admin changes.",
      "Permissions are inconsistent due to SSO/group sync mapping issues.",
      "Access request affects sensitive pre-release design assets."
    ]
  },
  {
    slug: "figma-performance-slow-large-files",
    title: "Figma Performance Slowdowns on Large Files",
    description:
      "Provide safe troubleshooting and best-practice guidance for large Figma files, component-heavy pages, and browser/device performance bottlenecks.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma Performance",
    environment: "Both",
    severity: "Medium",
    tags: ["figma", "performance", "large-files", "browser", "desktop"],
    symptoms: [
      "Figma file takes a long time to open or becomes laggy while editing.",
      "Scrolling/zooming is delayed in large design systems.",
      "Only certain files or pages cause severe lag."
    ],
    causes: [
      "Very large file/page complexity and many loaded components/assets.",
      "Browser/GPU acceleration limitations or local system resource pressure.",
      "Network latency impacting file asset synchronization."
    ],
    remediations: [
      "Confirm whether slowdown is file-specific or affects all Figma files.",
      "Test browser vs desktop app and compare performance on another network/device if available.",
      "Apply Figma best practices (split large pages/files, archive heavy assets, reduce simultaneous tabs).",
      "Coordinate with design systems owners if a shared file structure needs refactoring."
    ],
    escalationCriteria: [
      "Performance issue is widespread and linked to Figma service or org-wide files.",
      "VDI/browser policy/GPU constraints impact many designers.",
      "Teams request disabling security tooling to improve performance."
    ]
  },
  {
    slug: "figma-desktop-app-proxy-or-certificate-issue",
    title: "Figma Desktop App Proxy / Certificate Trust Issue",
    description:
      "Troubleshoot Figma desktop app connectivity problems caused by proxy configuration or certificate trust/inspection in corporate networks.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma Desktop App",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["figma", "proxy", "certificate", "desktop-app", "network"],
    symptoms: [
      "Figma desktop app fails to load content while browser version may partially work.",
      "Users see network errors, SSL errors, or repeated loading failures.",
      "Issue occurs only on corporate network/VPN."
    ],
    causes: [
      "Proxy configuration or PAC file behavior incompatible with the app.",
      "TLS inspection/certificate trust issue.",
      "Firewall restrictions to Figma endpoints."
    ],
    remediations: [
      "Compare behavior on/off VPN or on another approved network to isolate network path influence.",
      "Check system proxy settings and whether the desktop app follows corporate proxy configuration.",
      "Capture exact error messages and timestamps for network/security review.",
      "Do not disable certificate validation or bypass corporate proxy controls."
    ],
    escalationCriteria: [
      "Proxy/TLS inspection policy needs review by network/security teams.",
      "Multiple users are affected on the same site/network segment.",
      "Figma access is business-critical and blocked by corporate network policy changes."
    ]
  },
  {
    slug: "figma-offline-behavior-and-cache-expectations",
    title: "Figma Offline Behavior and Local Cache Expectations",
    description:
      "Clarify what Figma does and does not support offline, and troubleshoot confusion around cached files, unsynced changes, and reconnect behavior.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma Offline",
    environment: "Both",
    severity: "Low",
    tags: ["figma", "offline", "cache", "sync", "expectations"],
    symptoms: [
      "Users expect files to open/edit fully offline but cannot access needed content.",
      "Changes appear missing after reconnecting.",
      "Offline behavior differs between desktop app and browser."
    ],
    causes: [
      "Figma offline support limitations misunderstood.",
      "Required file data not cached locally before disconnection.",
      "Session/auth state expired while offline."
    ],
    remediations: [
      "Confirm whether the user had opened the file recently and remained signed in before going offline.",
      "Document expected offline limitations for the team's workflow.",
      "Reconnect to network and verify sync completion before assuming data loss.",
      "Escalate if unsynced changes appear missing and recovery options need vendor/admin guidance."
    ],
    escalationCriteria: [
      "Potential unsynced design data loss is suspected.",
      "Offline behavior causes repeated business impact for traveling/offsite teams.",
      "Policy/workflow changes are needed to support offline design scenarios."
    ]
  },
  {
    slug: "figma-browser-cookie-storage-blocked",
    title: "Figma Browser Session Fails Due to Cookie/Storage Restrictions",
    description:
      "Troubleshoot Figma browser issues caused by blocked cookies, storage restrictions, or strict browser privacy policies in enterprise environments.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma Web",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["figma", "browser", "cookies", "storage", "privacy-policy"],
    symptoms: [
      "Figma signs out unexpectedly or cannot maintain session.",
      "Loading loops occur only in specific browser profiles.",
      "Users see site storage/cookie permission warnings."
    ],
    causes: [
      "Browser privacy settings or policies blocking required storage/cookies.",
      "Third-party cookie restrictions impacting SSO/session flows.",
      "Extension conflicts manipulating site storage behavior."
    ],
    remediations: [
      "Reproduce in a clean/private browser session to isolate profile/extension issues.",
      "Review enterprise browser policies and privacy settings for Figma domains.",
      "Test with extensions disabled only within approved support workflow.",
      "Document the affected browser version/profile and policy context for escalation."
    ],
    escalationCriteria: [
      "Browser policies need adjustment by endpoint/browser management.",
      "SSO and cookie restrictions break access for multiple Figma users.",
      "Users request insecure browser exceptions beyond policy guidance."
    ]
  }
];

const generalSeeds: KBSeed[] = [
  {
    slug: "windows-printer-job-stuck-in-queue",
    title: "Windows Printer Job Stuck in Queue",
    description:
      "Troubleshoot Windows print queue issues and spooler-related hangs with safe user steps first, then admin-run spooler reset actions when required.",
    category: "Printers / Scanners",
    productFamily: "Print",
    product: "Windows Print Spooler",
    environment: "Windows",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["printer", "windows", "queue", "spooler", "printing"],
    symptoms: [
      "Print jobs remain in queue and block new prints.",
      "Canceling jobs does not clear the queue.",
      "Issue may affect one printer or one workstation only."
    ],
    causes: [
      "Stuck/corrupt print job in spooler queue.",
      "Print spooler service stalled.",
      "Driver or print server queue issue."
    ],
    remediations: [
      "Try user-safe queue cleanup in Printers & scanners first.",
      "Restart the spooler service only with admin rights or remote support tooling.",
      "Clear spool files using approved runbook if service restart is not enough.",
      "Re-test with a small text document before larger jobs."
    ],
    escalationCriteria: [
      "Multiple users are affected on the same print queue/server.",
      "Printer driver rollout or print server issue is suspected.",
      "Unsigned/unapproved driver installation would be required."
    ],
    commands: [
      {
        title: "Restart spooler and clear queue (admin)",
        shell: "PowerShell",
        content:
          "Restart-Service Spooler -Force\nStop-Service Spooler -Force\nRemove-Item \"$env:SystemRoot\\System32\\spool\\PRINTERS\\*\" -Force -ErrorAction SilentlyContinue\nStart-Service Spooler"
      }
    ]
  },
  {
    slug: "mac-system-data-storage-too-high-managed-mac",
    title: "macOS 'System Data' Storage Too High (Managed Mac)",
    description:
      "Inspect large cache/log/snapshot contributors to macOS System Data on managed devices using safe diagnostics before deleting app or security data.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS Storage",
    environment: "macOS",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["macos", "storage", "system-data", "cache", "logs"],
    symptoms: [
      "System Data category is unusually large in macOS Storage settings.",
      "Low disk space impacts app updates or sync clients.",
      "Storage does not recover after deleting user files."
    ],
    causes: [
      "Large caches/logs or local snapshots.",
      "Endpoint security/management logs growing unexpectedly.",
      "Storage recategorization delay after updates or file moves."
    ],
    remediations: [
      "Restart the Mac and allow storage categories to recalculate.",
      "Inspect large folders in the user Library and identify cache/log growth safely.",
      "Remove only approved temporary files; avoid deleting managed app data without runbook guidance.",
      "Escalate if local snapshots or security tooling consume most space."
    ],
    escalationCriteria: [
      "Time Machine snapshots, MDM, or endpoint security data appears to be the main consumer.",
      "Storage pressure impacts multiple managed Macs after the same update/agent rollout.",
      "Admin tooling is required to remediate safely."
    ],
    commands: [
      {
        title: "Inspect large user Library folders",
        shell: "Terminal",
        content: "du -sh ~/Library/* 2>/dev/null | sort -h | tail -20"
      }
    ]
  },
  {
    slug: "vpn-connected-but-no-internet-or-internal-access",
    title: "VPN Connected but No Internet / Internal Access",
    description:
      "Diagnose VPN sessions that appear connected but cannot reach internet or internal resources by collecting safe routing and DNS evidence.",
    category: "Networking / VPN",
    productFamily: "Networking",
    product: "Corporate VPN",
    environment: "Both",
    severity: "High",
    tags: ["vpn", "network", "dns", "routing", "split-tunnel"],
    symptoms: [
      "VPN shows connected but the user cannot browse or reach internal sites.",
      "Only internal resources fail, or only public internet fails while VPN is active.",
      "Issue started after network change, VPN update, or device wake/resume."
    ],
    causes: [
      "DNS resolution or route push issue.",
      "Split-tunnel expectations misunderstood.",
      "VPN client/session state problem or local network conflict."
    ],
    remediations: [
      "Confirm what is failing (internet, internal resources, or both) and when it started.",
      "Reconnect VPN cleanly and test on another approved network if available.",
      "Collect route/DNS diagnostics and attach them to the ticket.",
      "Avoid disabling security clients or using personal remote access tools as a workaround."
    ],
    escalationCriteria: [
      "Routes, DNS servers, or tunnel policy appear incorrect.",
      "Many users on the same VPN profile are affected.",
      "Security/network teams must review tunnel and access policy configuration."
    ]
  },
  {
    slug: "windows-slow-corporate-wifi-troubleshooting",
    title: "Windows Slow Wi-Fi on Corporate Network",
    description:
      "Gather evidence for slow corporate Wi-Fi on Windows devices using signal, latency, and adapter diagnostics before wireless escalation.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows Wi-Fi",
    environment: "Windows",
    severity: "Medium",
    tags: ["windows", "wifi", "wireless", "latency", "corporate-network"],
    symptoms: [
      "Slow browsing, call quality issues, or poor throughput on corporate Wi-Fi.",
      "Problem varies by office location or time of day.",
      "Nearby users may or may not be affected."
    ],
    causes: [
      "Weak signal/interference or access point congestion.",
      "Driver/adapter power settings or roaming behavior.",
      "Local device background sync traffic saturating connection."
    ],
    remediations: [
      "Capture location, time, SSID, and whether the issue is app-specific or general.",
      "Collect Windows Wi-Fi interface diagnostics and simple latency tests.",
      "Test closer to the access point and pause heavy sync/uploads where possible.",
      "Escalate with evidence for AP/channel investigation by network engineering."
    ],
    escalationCriteria: [
      "Multiple users in the same area report degraded Wi-Fi.",
      "AP/channel/interference investigation is required.",
      "Users request access to alternate/unsecured SSIDs as a workaround."
    ],
    commands: [
      {
        title: "Wi-Fi interface and latency checks (Windows)",
        shell: "CMD",
        content: "netsh wlan show interfaces\nping -n 10 8.8.8.8"
      }
    ]
  },
  {
    slug: "browser-sso-loop-chrome-edge-corporate",
    title: "Browser SSO Loop in Chrome / Edge (Corporate Apps)",
    description:
      "Troubleshoot browser SSO loops for corporate apps by isolating account context, cookie policy, and extension interference without bypassing identity controls.",
    category: "Browsers",
    productFamily: "Browser",
    product: "Chrome / Edge",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["browser", "sso", "chrome", "edge", "cookies", "signin-loop"],
    symptoms: [
      "User is redirected back to login repeatedly in corporate web apps.",
      "Issue reproduces in one browser profile but not another.",
      "Desktop apps may work while browser-based SSO loops persist."
    ],
    causes: [
      "Cookie/site storage restrictions or browser policy changes.",
      "Extension conflict affecting identity redirects.",
      "Wrong tenant/account context in browser session."
    ],
    remediations: [
      "Test in a private browser session using only the intended corporate account.",
      "Review browser privacy/cookie settings and enterprise-managed policies.",
      "Disable suspicious extensions only within approved support workflow and document results.",
      "Capture correlation IDs/timestamps and escalate if the issue spans multiple users."
    ],
    escalationCriteria: [
      "Browser policy changes affect SSO for many users.",
      "Identity/Conditional Access behavior is causing redirect loops.",
      "Users request bypassing SSO or security settings to continue work."
    ]
  }
];

const kbArticles = linkRelatedArticles(
  [...microsoftSeeds, ...adobeSeeds, ...figmaSeeds, ...generalSeeds].map(buildArticle)
);

export function getKBArticles(): KBArticle[] {
  return kbArticles.map((article) => ({
    ...article,
    tags: [...article.tags],
    symptoms: [...article.symptoms],
    causes: [...article.causes],
    resolutionSteps: article.resolutionSteps.map((step) => ({ ...step })),
    commands: article.commands.map((command) => ({ ...command })),
    escalationCriteria: [...article.escalationCriteria],
    relatedArticleSlugs: [...article.relatedArticleSlugs]
  }));
}

export function getKBArticleBySlug(slug: string): KBArticle | undefined {
  return kbArticles.find((article) => article.slug === slug);
}

export function getKBCategories(): string[] {
  return [...new Set(kbArticles.map((article) => article.category))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function getKBProducts(): string[] {
  return [...new Set(kbArticles.map((article) => article.product))].sort((a, b) => a.localeCompare(b));
}

export function getKBTags(): string[] {
  return [...new Set(kbArticles.flatMap((article) => article.tags))].sort((a, b) => a.localeCompare(b));
}

export function getKBArticlesByProductFamily(productFamily: KBArticle["productFamily"]): KBArticle[] {
  return kbArticles.filter((article) => article.productFamily === productFamily);
}

export function getKBRegistryCounts() {
  return {
    total: kbArticles.length,
    microsoft: kbArticles.filter((a) => a.productFamily === "Microsoft").length,
    adobe: kbArticles.filter((a) => a.productFamily === "Adobe").length,
    figma: kbArticles.filter((a) => a.productFamily === "Figma").length
  };
}
