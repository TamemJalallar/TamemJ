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

  if (seed.environment === "iOS") {
    return [
      {
        title: "iPhone/iPad support checks (non-destructive)",
        shell: "CLI",
        content:
          "# iOS (device UI)\n# Settings > General > About (capture iOS version + device name)\n# Settings > VPN / Device Management (confirm managed profile status)\n# Settings > [App] (confirm permissions enabled as required)\n# Capture timestamp + screenshot of the error for the ticket"
      }
    ];
  }

  if (seed.environment === "Android") {
    return [
      {
        title: "Android support checks (non-destructive)",
        shell: "CLI",
        content:
          "# Android (device UI)\n# Settings > About phone (capture Android version + device model)\n# Settings > Security / Work profile (confirm work profile is present and enabled)\n# App info > Permissions (confirm required permissions)\n# Capture timestamp + screenshot of the error for the ticket"
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
  },
  {
    slug: "okta-sign-in-loop-browser-or-desktop-sso",
    title: "Okta Sign-In Loop (Browser / Desktop App SSO)",
    description:
      "Troubleshoot repeated Okta sign-in redirects or successful authentication that returns to the login screen without bypassing SSO, MFA, or device trust policies.",
    category: "Identity / MFA / SSO",
    productFamily: "Okta",
    product: "Okta SSO",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["okta", "sso", "signin-loop", "mfa", "browser", "identity"],
    symptoms: [
      "User signs in successfully but is returned to the Okta login page.",
      "Loop occurs in browser and sometimes in desktop app web auth windows.",
      "Issue may reproduce only on one browser profile or device."
    ],
    causes: [
      "Stale Okta/browser session cookies or conflicting tenant/account context.",
      "Device trust, conditional access, or risk policy check failing after authentication.",
      "Clock skew, network proxy behavior, or blocked identity redirects."
    ],
    remediations: [
      "Reproduce in a private browser session using only the intended corporate identity.",
      "Capture the exact app URL, timestamp, browser, and any error/correlation IDs displayed.",
      "Confirm system date/time is automatic and accurate before retesting.",
      "Escalate to identity admins for Okta system log review if loop persists after clean-session testing."
    ],
    escalationCriteria: [
      "Okta system logs show policy denials, device trust failures, or risk-based authentication blocks.",
      "Multiple users cannot access the same app after an Okta policy or app-sign-on rule change.",
      "Users request disabling MFA or device trust enforcement as a workaround."
    ]
  },
  {
    slug: "okta-verify-push-not-received-or-delayed",
    title: "Okta Verify Push Not Received or Delayed",
    description:
      "Troubleshoot delayed or missing Okta Verify push prompts using safe device, network, and app-notification checks before MFA method resets.",
    category: "Identity / MFA / SSO",
    productFamily: "Okta",
    product: "Okta Verify",
    environment: "Both",
    severity: "Medium",
    tags: ["okta", "okta-verify", "mfa", "push", "notifications", "authenticator"],
    symptoms: [
      "User approves sign-in requests only after a long delay or never receives them.",
      "Manual code entry works while push notifications fail.",
      "Problem may occur after phone OS update, app update, or notification permission changes."
    ],
    causes: [
      "Notification permissions disabled or restricted on the mobile device.",
      "Battery optimization / low power mode delaying background notifications.",
      "Intermittent network connectivity or push service delivery issues."
    ],
    remediations: [
      "Confirm Okta Verify app notifications are allowed and not silenced/focus-filtered.",
      "Test on cellular and Wi-Fi to rule out local network delivery issues.",
      "Use approved alternate factor methods (code/passcode) if available while troubleshooting.",
      "Avoid re-enrolling or deleting the MFA factor unless directed by the identity support runbook."
    ],
    escalationCriteria: [
      "Multiple users report delayed Okta Verify push behavior at the same time.",
      "User lost access to all factors and account recovery is required.",
      "Identity admins need to review factor status, enrollment state, or policy changes."
    ]
  },
  {
    slug: "okta-new-phone-or-lost-device-mfa-recovery",
    title: "Okta MFA Recovery (New Phone or Lost Device)",
    description:
      "Follow enterprise-safe recovery steps when a user replaces or loses the device used for Okta MFA, without bypassing identity verification controls.",
    category: "Identity / MFA / SSO",
    productFamily: "Okta",
    product: "Okta MFA Recovery",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "10-30 min",
    tags: ["okta", "mfa", "account-recovery", "lost-device", "new-phone", "identity"],
    symptoms: [
      "User cannot complete Okta sign-in after phone replacement or loss.",
      "Okta Verify or enrolled factor no longer exists on the new device.",
      "User may be locked out of all apps protected by Okta."
    ],
    causes: [
      "MFA factor tied to an old or unavailable device.",
      "No backup factor was enrolled previously.",
      "Identity verification must be re-established before factor reset."
    ],
    remediations: [
      "Verify user identity using approved help desk verification procedures before any factor reset.",
      "Use documented Okta admin or delegated help desk workflow to reset/re-enroll factors.",
      "Guide the user to enroll the new device and confirm sign-in to at least one protected app.",
      "Encourage enrollment of a secondary approved factor if policy allows."
    ],
    escalationCriteria: [
      "User cannot be verified using approved procedures.",
      "High-risk or privileged account requires security team approval for factor reset.",
      "User reports suspicious prompts or possible account compromise in addition to device loss."
    ]
  },
  {
    slug: "okta-access-denied-app-assignment-or-group-membership",
    title: "Okta 'Access Denied' (App Assignment / Group Membership)",
    description:
      "Troubleshoot Okta app access denied messages by validating assignment, group membership, and app sign-on policy without circumventing access governance controls.",
    category: "Identity / MFA / SSO",
    productFamily: "Okta",
    product: "Okta App Access",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["okta", "access-denied", "group-membership", "assignment", "sso"],
    symptoms: [
      "User signs into Okta but receives Access Denied for a specific app tile.",
      "App is visible but launch fails due to assignment or policy error.",
      "Other users can access the app normally."
    ],
    causes: [
      "User is not assigned to the app or required group.",
      "Assignment propagated slowly after recent changes.",
      "App sign-on policy blocks based on network, device, or group conditions."
    ],
    remediations: [
      "Confirm which app is affected and whether access worked previously for the same user.",
      "Capture exact error message and timestamp from Okta or target app launch page.",
      "Validate user identity, department/location changes, and recent access request approvals.",
      "Escalate to identity/app admin to review assignment and sign-on policy conditions."
    ],
    escalationCriteria: [
      "App assignment or group membership changes are required.",
      "Policy exceptions are requested for restricted apps.",
      "Multiple users lose access after an app assignment or role sync change."
    ]
  },
  {
    slug: "ios-intune-company-portal-device-compliance-not-evaluating",
    title: "iOS Intune Company Portal Device Compliance Not Evaluating",
    description:
      "Troubleshoot iOS managed device compliance status stuck as pending/unknown in Intune Company Portal using safe profile and sync checks before re-enrollment.",
    category: "iOS",
    productFamily: "Mobile",
    product: "Intune Company Portal (iOS)",
    environment: "iOS",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "15-30 min",
    tags: ["ios", "intune", "company-portal", "compliance", "mdm", "enrollment"],
    symptoms: [
      "Company Portal shows compliance pending/unknown for an extended period.",
      "User is blocked from corporate apps due to device compliance requirement.",
      "Issue started after device restore, iOS update, or management profile changes."
    ],
    causes: [
      "Management profile or device registration state is incomplete.",
      "Company Portal app cannot sync due to network or sign-in issue.",
      "Conditional Access checks require updated compliance state from Intune."
    ],
    remediations: [
      "Confirm the device is connected to a stable network and user can sign into Company Portal.",
      "Open Company Portal and perform a manual sync/check status from the app.",
      "Verify the management profile exists in iOS Settings and required permissions are granted.",
      "Avoid removing the management profile or unenrolling without IT approval."
    ],
    escalationCriteria: [
      "Compliance remains stuck after manual sync and profile verification.",
      "Device is blocked by Conditional Access and user cannot work.",
      "Re-enrollment is required and must be coordinated through endpoint management support."
    ]
  },
  {
    slug: "ios-outlook-work-mail-not-syncing-managed-device",
    title: "iOS Outlook Work Mail Not Syncing (Managed Device)",
    description:
      "Troubleshoot Outlook for iOS sync delays or missing mail on managed devices while preserving corporate account security and MDM controls.",
    category: "iOS",
    productFamily: "Mobile",
    product: "Outlook for iOS",
    environment: "iOS",
    severity: "Medium",
    tags: ["ios", "outlook", "mail", "sync", "microsoft-365", "mobile"],
    symptoms: [
      "New mail is delayed or not appearing in Outlook for iOS.",
      "Search or folder refresh is inconsistent on the mobile app.",
      "Outlook on web/desktop may work while iOS app lags."
    ],
    causes: [
      "Mobile app background refresh or notification settings disabled.",
      "Network connectivity issues or temporary token/session issue.",
      "App update state or managed app policy restrictions affecting sync."
    ],
    remediations: [
      "Confirm account sign-in is current and no banner requests re-authentication in Outlook.",
      "Check iOS Background App Refresh and notifications for Outlook per policy guidance.",
      "Switch networks (Wi-Fi/cellular) and manually refresh mail folders.",
      "Escalate before removing and re-adding the managed account if app protection policies apply."
    ],
    escalationCriteria: [
      "Conditional Access or app protection policy prompts appear repeatedly.",
      "Multiple iOS users report sync issues after an app or iOS update.",
      "Managed app reconfiguration or policy review is required."
    ]
  },
  {
    slug: "ios-teams-notifications-not-arriving-managed-device",
    title: "iOS Teams Notifications Not Arriving (Managed Device)",
    description:
      "Troubleshoot missing Teams notifications on iPhone/iPad using safe notification, focus mode, and account checks before app resets.",
    category: "iOS",
    productFamily: "Mobile",
    product: "Microsoft Teams (iOS)",
    environment: "iOS",
    severity: "Low",
    tags: ["ios", "teams", "notifications", "focus-mode", "mobile", "microsoft-365"],
    symptoms: [
      "Teams messages arrive when app is open but push notifications do not appear.",
      "User receives some notifications (mentions/chats) but not all.",
      "Issue may begin after iOS Focus mode changes or OS update."
    ],
    causes: [
      "iOS notification permissions disabled or notification summary settings delaying delivery.",
      "Focus mode / Do Not Disturb suppressing banners.",
      "Teams mobile notification settings not enabled for the event type."
    ],
    remediations: [
      "Check iOS notification settings for Teams and confirm alerts/sounds/badges are enabled.",
      "Review Focus modes and notification summaries that may delay work app notifications.",
      "Validate Teams mobile notification preferences for chats, mentions, and meetings.",
      "Test with a direct message from a coworker after settings changes."
    ],
    escalationCriteria: [
      "Notifications fail for multiple users after a Teams mobile app release.",
      "Managed app configuration policies appear to suppress notifications.",
      "Critical on-call/escalation workflows depend on Teams mobile alerts."
    ]
  },
  {
    slug: "ios-corporate-vpn-connected-no-internal-app-access",
    title: "iOS Corporate VPN Connected but No Internal App Access",
    description:
      "Troubleshoot iOS VPN sessions that appear connected but cannot reach internal apps or sites using safe device and network checks before profile changes.",
    category: "iOS",
    productFamily: "Mobile",
    product: "iOS Corporate VPN",
    environment: "iOS",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["ios", "vpn", "mobile", "network", "dns", "internal-access"],
    symptoms: [
      "VPN status shows connected but intranet or internal apps still fail.",
      "Public internet works while internal names/resources fail, or vice versa.",
      "Issue may start after roaming between Wi-Fi and cellular."
    ],
    causes: [
      "VPN tunnel/profile issue or stale mobile network session.",
      "DNS resolution path not working while tunnel is active.",
      "Managed VPN/app-per-app policy configuration mismatch."
    ],
    remediations: [
      "Disconnect/reconnect VPN and retest on both Wi-Fi and cellular if policy allows.",
      "Capture affected app/site names and exact timestamps for troubleshooting.",
      "Confirm the device remains compliant and the VPN profile is still installed/managed.",
      "Avoid deleting VPN profiles or management profiles without IT instruction."
    ],
    escalationCriteria: [
      "Multiple users with the same VPN profile cannot access internal resources.",
      "App-per-app or managed VPN policy behavior requires network/MDM review.",
      "Profile reinstallation or MDM re-push is required."
    ]
  },
  {
    slug: "android-work-profile-not-created-or-paused",
    title: "Android Work Profile Not Created or Paused",
    description:
      "Troubleshoot Android Enterprise work profile setup failures or paused profiles using safe Company Portal/Intune and device setting checks before re-enrollment.",
    category: "Android",
    productFamily: "Mobile",
    product: "Android Work Profile",
    environment: "Android",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "15-30 min",
    tags: ["android", "work-profile", "intune", "company-portal", "enrollment", "mdm"],
    symptoms: [
      "Work apps are missing or the work profile setup never completes.",
      "Android shows work profile is paused, disabled, or unavailable.",
      "User cannot access corporate email/Teams because work profile apps do not launch."
    ],
    causes: [
      "Enrollment workflow interrupted or permission denied during setup.",
      "Work profile manually paused or restricted by battery/device settings.",
      "Company Portal/MDM communication issue preventing policy application."
    ],
    remediations: [
      "Confirm Company Portal or approved MDM app is signed in and can sync.",
      "Check whether the work profile is paused and re-enable it through Android settings.",
      "Ensure required permissions for Company Portal and work apps are granted.",
      "Avoid removing the work profile without IT guidance because it can wipe managed app data."
    ],
    escalationCriteria: [
      "Enrollment repeatedly fails after approved retry steps.",
      "Policy/app deployment errors require endpoint management review.",
      "User data-loss concerns require guided work profile reset."
    ]
  },
  {
    slug: "android-outlook-work-mail-not-syncing-work-profile",
    title: "Android Outlook Work Mail Not Syncing (Work Profile)",
    description:
      "Troubleshoot Outlook for Android mail sync issues on managed work-profile devices using safe app, profile, and network checks before resetting accounts.",
    category: "Android",
    productFamily: "Mobile",
    product: "Outlook for Android",
    environment: "Android",
    severity: "Medium",
    tags: ["android", "outlook", "mail", "sync", "work-profile", "microsoft-365"],
    symptoms: [
      "Outlook in the work profile does not receive new messages consistently.",
      "Folders refresh slowly or require manual refresh.",
      "Desktop/web Outlook may work while Android work-profile Outlook is delayed."
    ],
    causes: [
      "Work profile background restrictions or battery optimization affecting sync.",
      "Network changes between Wi-Fi and cellular interrupting app session state.",
      "Managed app configuration or authentication token issue."
    ],
    remediations: [
      "Confirm Outlook is opened from the work profile and shows the correct corporate account.",
      "Review Android battery optimization/background data settings for the work-profile Outlook app per policy guidance.",
      "Test sync on another network and perform a manual refresh.",
      "Escalate before removing the managed account or clearing app data in the work profile."
    ],
    escalationCriteria: [
      "App protection or compliance prompts recur and block sync.",
      "Multiple Android users report the same issue after app/OS changes.",
      "Managed app config/policy review is required."
    ]
  },
  {
    slug: "android-teams-notifications-delayed-work-profile",
    title: "Android Teams Notifications Delayed or Missing (Work Profile)",
    description:
      "Troubleshoot delayed Teams notifications on Android work-profile devices using safe notification, battery, and work profile checks before reinstalling managed apps.",
    category: "Android",
    productFamily: "Mobile",
    product: "Microsoft Teams (Android)",
    environment: "Android",
    severity: "Low",
    tags: ["android", "teams", "notifications", "work-profile", "battery-optimization", "mobile"],
    symptoms: [
      "Teams notifications arrive late or only after opening the app.",
      "Personal apps notify normally but work-profile Teams notifications are delayed.",
      "Issue may be worse in battery saver mode."
    ],
    causes: [
      "Battery optimization or adaptive battery delaying background processing.",
      "Work profile notification settings disabled or profile paused.",
      "Teams notification settings or Android channel-level notification settings misconfigured."
    ],
    remediations: [
      "Verify the work profile is active and notifications are allowed for Teams in the work profile.",
      "Review battery optimization settings for Teams and Company Portal/management app per support policy.",
      "Check Teams notification settings for chat, mentions, and meetings.",
      "Test with a coworker message after each change to confirm improvement."
    ],
    escalationCriteria: [
      "Managed app configuration or endpoint policy is suppressing notifications.",
      "Issue affects many Android devices after policy or app rollout.",
      "Critical on-call workflows depend on timely Teams mobile notifications."
    ]
  },
  {
    slug: "android-corporate-vpn-connected-no-internal-access",
    title: "Android Corporate VPN Connected but No Internal Access",
    description:
      "Troubleshoot Android VPN sessions that show connected but cannot reach internal resources using safe profile/network checks before deleting managed VPN profiles.",
    category: "Android",
    productFamily: "Mobile",
    product: "Android Corporate VPN",
    environment: "Android",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["android", "vpn", "mobile", "dns", "routing", "internal-access"],
    symptoms: [
      "VPN appears connected but internal apps/sites fail to load.",
      "Issue may occur only on Wi-Fi or only on cellular.",
      "VPN reconnect temporarily helps, then access fails again."
    ],
    causes: [
      "Managed VPN profile or tunnel session state issue.",
      "Network handoff causing stale DNS/tunnel path state.",
      "Per-app VPN or compliance policy mismatch."
    ],
    remediations: [
      "Disconnect/reconnect the VPN and test on a second approved network if available.",
      "Capture the affected internal URLs/apps and timestamps for support review.",
      "Confirm the device remains compliant and work profile/device management is healthy.",
      "Do not remove the managed VPN profile unless instructed by IT."
    ],
    escalationCriteria: [
      "Many users on the same Android VPN profile are impacted.",
      "Per-app VPN or tunnel configuration needs network/MDM team review.",
      "Profile redeployment or MDM remediation is required."
    ]
  },
  {
    slug: "windows-update-pending-restart-blocking-compliance-or-apps",
    title: "Windows Update Pending Restart Blocking Compliance or App Access",
    description:
      "Troubleshoot managed Windows devices that remain in a pending restart state and may fail compliance checks, VPN posture checks, or app updates until restart is completed.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows Update",
    environment: "Windows",
    severity: "Medium",
    tags: ["windows", "updates", "restart", "compliance", "patching", "reboot"],
    symptoms: [
      "Device shows pending restart after Windows updates.",
      "Company Portal/compliance or VPN posture checks remain outdated.",
      "Office or browser updates may fail or stay queued."
    ],
    causes: [
      "Windows update install completed but reboot is required to finalize files/services.",
      "User deferred restart multiple times.",
      "Pending restart flags remain after patching and require managed reboot workflow."
    ],
    remediations: [
      "Confirm there is no active user presentation/meeting before scheduling a restart.",
      "Use approved restart window or endpoint management workflow to complete the reboot.",
      "After restart, confirm updates/compliance status refreshes before further remediation.",
      "Avoid registry edits or third-party cleanup tools to clear pending restart indicators."
    ],
    escalationCriteria: [
      "Pending restart remains after one or more approved restarts.",
      "Multiple devices show the same issue after a patch cycle.",
      "Endpoint management or Windows update servicing policy review is required."
    ],
    commands: [
      {
        title: "Check Windows Update and pending restart indicators",
        shell: "PowerShell",
        content:
          "Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\WindowsUpdate\\Auto Update\\RebootRequired' -ErrorAction SilentlyContinue\nGet-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, OsBuildNumber"
      }
    ]
  },
  {
    slug: "windows-credential-manager-stale-corporate-credentials",
    title: "Windows Credential Manager Stale Corporate Credentials",
    description:
      "Troubleshoot repeated prompts or access failures caused by stale Windows stored credentials after password changes or account updates using safe review steps first.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows Credential Manager",
    environment: "Windows",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["windows", "credential-manager", "password-change", "prompts", "stale-credentials"],
    symptoms: [
      "User is repeatedly prompted for credentials on file shares, Outlook, or internal sites.",
      "Access fails even though the user enters the correct current password.",
      "Issue started after password reset or account rename/update."
    ],
    causes: [
      "Old cached credentials remain stored in Windows Credential Manager.",
      "Saved target names no longer match current authentication path.",
      "Multiple account contexts (old/new UPN) are cached."
    ],
    remediations: [
      "Identify which app/share/site is prompting and confirm the exact account being used.",
      "Review saved Windows credentials with support guidance before removing entries.",
      "Remove only affected stale entries and re-test sign-in using the current corporate credentials.",
      "Document which target names were impacted if escalation is needed."
    ],
    escalationCriteria: [
      "Credential prompts continue after stale entries are removed.",
      "Kerberos/SSO or identity token issues are suspected rather than saved credentials.",
      "Multiple users report the same prompts against the same system or service."
    ],
    commands: [
      {
        title: "List stored Windows credentials",
        shell: "CMD",
        content: "cmdkey /list"
      }
    ]
  },
  {
    slug: "windows-mapped-drives-disconnected-after-password-change",
    title: "Windows Mapped Drives Disconnected After Password Change",
    description:
      "Troubleshoot mapped drives showing disconnected or repeatedly prompting after a password change by validating current identity context and reconnect behavior safely.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows Mapped Drives",
    environment: "Windows",
    severity: "Medium",
    tags: ["windows", "mapped-drive", "password-change", "file-share", "smb"],
    symptoms: [
      "Mapped drives show red X or 'Disconnected Network Drive'.",
      "User is prompted for credentials when opening a mapped drive.",
      "Issue began after password reset or account unlock."
    ],
    causes: [
      "Mapped session cached old credentials.",
      "VPN/domain connectivity is unavailable at sign-in.",
      "Drive mapping script/GPO depends on a resource currently unreachable."
    ],
    remediations: [
      "Confirm the user is on the corporate network or connected to approved VPN.",
      "Verify the user can access the share path directly before remapping.",
      "Reconnect only required mapped drives using approved scripts or documented support steps.",
      "Capture exact share path and timestamp if drive mapping policy seems to be failing."
    ],
    escalationCriteria: [
      "Many users lose the same mapped drives after a password policy change.",
      "GPO/login script mapping failures are suspected.",
      "File server permissions or SMB service issue is indicated."
    ],
    commands: [
      {
        title: "Check mapped drives and user identity",
        shell: "CMD",
        content: "whoami /upn\nnet use"
      }
    ]
  },
  {
    slug: "windows-bitlocker-recovery-prompt-managed-device",
    title: "Windows BitLocker Recovery Prompt on Managed Device",
    description:
      "Handle BitLocker recovery prompts on corporate Windows devices safely by collecting device details and recovery evidence, then escalating through approved security workflows.",
    category: "Windows",
    productFamily: "Windows",
    product: "BitLocker",
    environment: "Windows",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "10-30 min",
    tags: ["windows", "bitlocker", "recovery", "security", "encryption"],
    symptoms: [
      "Device boots to a BitLocker recovery screen and requests a recovery key.",
      "Prompt appeared after firmware/BIOS update, docking change, or hardware event.",
      "User cannot sign in to Windows."
    ],
    causes: [
      "BitLocker integrity checks detected a platform/boot configuration change.",
      "TPM-related state changed after update or hardware event.",
      "Recovery key entry is required before normal startup can continue."
    ],
    remediations: [
      "Verify device ownership and user identity using approved help desk procedures.",
      "Collect the BitLocker recovery key ID shown on the prompt for lookup by authorized staff.",
      "Use approved key recovery sources and security process; do not attempt to bypass encryption controls.",
      "Document the trigger event (update, dock, hardware change) after the device is recovered."
    ],
    escalationCriteria: [
      "Recovery key is not available in approved key escrow systems.",
      "Repeated BitLocker recovery prompts continue after successful unlock.",
      "Suspicious tamper indicators or high-risk user/device context requires security escalation."
    ],
    commands: [
      {
        title: "Check BitLocker status (after device boots)",
        shell: "PowerShell",
        content: "Get-BitLockerVolume | Select-Object MountPoint, VolumeStatus, ProtectionStatus, KeyProtector"
      }
    ]
  },
  {
    slug: "windows-hello-pin-signin-not-available-managed-device",
    title: "Windows Hello PIN Sign-In Not Available on Managed Device",
    description:
      "Troubleshoot Windows Hello for Business PIN sign-in issues using safe device registration and time-sync checks before PIN reset or identity escalation.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows Hello for Business",
    environment: "Windows",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["windows", "windows-hello", "pin", "signin", "whfb", "entra"],
    symptoms: [
      "PIN option is missing or unavailable at sign-in.",
      "User receives PIN unavailable / something went wrong messages.",
      "Password sign-in works but PIN setup/reset fails."
    ],
    causes: [
      "Device registration or token state is unhealthy.",
      "Time sync or network connectivity affects identity validation.",
      "Windows Hello policy or TPM state requires admin review."
    ],
    remediations: [
      "Confirm password sign-in works and the device has stable network connectivity.",
      "Verify date/time/time zone are correct before retrying PIN setup.",
      "Collect device registration status for endpoint/identity support.",
      "Use approved PIN reset workflow only after identity and device checks are complete."
    ],
    escalationCriteria: [
      "Device registration appears broken or Entra join state is unhealthy.",
      "TPM or Windows Hello policy issues are suspected.",
      "Multiple devices fail PIN setup after a policy rollout."
    ],
    commands: [
      {
        title: "Check device registration and sync status",
        shell: "CMD",
        content: "dsregcmd /status"
      }
    ]
  },
  {
    slug: "windows-dns-resolution-issues-after-vpn-switch-or-network-change",
    title: "Windows DNS Resolution Issues After VPN Switch or Network Change",
    description:
      "Troubleshoot Windows DNS resolution issues after switching networks or VPN state by collecting adapter and resolver evidence before advanced network changes.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows DNS Client",
    environment: "Windows",
    severity: "Medium",
    tags: ["windows", "dns", "vpn", "network-change", "name-resolution"],
    symptoms: [
      "Websites or internal hostnames fail to resolve after network/VPN changes.",
      "Some sites open by IP address but not by hostname.",
      "Issue may improve temporarily after reconnecting."
    ],
    causes: [
      "DNS cache contains stale records from prior network/VPN state.",
      "Adapter DNS servers are incorrect or not refreshed.",
      "VPN split-DNS policy or resolver order issue."
    ],
    remediations: [
      "Identify whether only internal names fail, only external names fail, or both.",
      "Reconnect the affected network/VPN and retest using the same hostname.",
      "Use approved DNS cache flush and adapter renew steps if documented for your environment.",
      "Attach DNS server/resolution output to the ticket before escalation."
    ],
    escalationCriteria: [
      "VPN split-DNS policy or name server assignment appears wrong.",
      "Issue affects multiple users after a VPN or DHCP/DNS change.",
      "Network engineering review is required."
    ],
    commands: [
      {
        title: "DNS resolver and cache checks (Windows)",
        shell: "CMD",
        content: "ipconfig /all\nnslookup microsoft.com\nipconfig /displaydns | more"
      }
    ]
  },
  {
    slug: "windows-audio-device-missing-after-dock-undock",
    title: "Windows Audio Device Missing After Dock / Undock",
    description:
      "Troubleshoot missing speakers, headset, or microphone endpoints after docking changes on managed Windows devices using safe device and endpoint checks first.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows Audio Devices",
    environment: "Windows",
    severity: "Medium",
    tags: ["windows", "audio", "dock", "microphone", "headset", "usb"],
    symptoms: [
      "Headset, speaker, or microphone is missing after docking/undocking.",
      "Teams/Zoom/Meet cannot detect the expected device.",
      "Audio devices return after reboot or cable reconnect."
    ],
    causes: [
      "USB/dock enumeration issue after power state change.",
      "Audio endpoint disabled or default device switched unexpectedly.",
      "Dock firmware/driver or endpoint driver problem."
    ],
    remediations: [
      "Confirm the issue affects one dock/port/device combination or all audio devices.",
      "Reconnect the dock/device and test another approved port/cable if available.",
      "Check Sound settings for disabled devices and default input/output selection.",
      "Escalate if recurring after docking firmware or driver updates."
    ],
    escalationCriteria: [
      "Multiple users with the same dock model are affected.",
      "Driver/firmware deployment issue is suspected.",
      "Admin rights are required to update or rollback device drivers."
    ],
    commands: [
      {
        title: "List audio endpoints and device status",
        shell: "PowerShell",
        content: "Get-PnpDevice -Class AudioEndpoint | Select-Object Status, Class, FriendlyName"
      }
    ]
  },
  {
    slug: "windows-file-explorer-slow-on-network-shares-or-quick-access",
    title: "Windows File Explorer Slow on Network Shares or Quick Access",
    description:
      "Troubleshoot Windows File Explorer delays when opening folders, network shares, or Quick Access using safe path-isolation and shell diagnostics before profile resets.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows File Explorer",
    environment: "Windows",
    severity: "Low",
    tags: ["windows", "file-explorer", "quick-access", "network-share", "slow"],
    symptoms: [
      "File Explorer takes a long time to open or hangs on a white window.",
      "Delays are worse when opening Quick Access or a specific network path.",
      "Only one user or one profile may be affected."
    ],
    causes: [
      "Unavailable network path pinned in Quick Access or recent items.",
      "Shell extension or preview pane interaction causing delays.",
      "Profile-specific Explorer cache or namespace issue."
    ],
    remediations: [
      "Identify whether delays happen in all folders or only specific network/pinned paths.",
      "Test opening a local folder and then the affected network path directly.",
      "Remove unavailable pinned items through normal File Explorer UI if identified.",
      "Escalate before deleting user profile or registry shell settings."
    ],
    escalationCriteria: [
      "Issue affects many users after a shell extension or endpoint rollout.",
      "File server/network path availability issue is suspected.",
      "Profile reset or registry-level remediation is being considered."
    ]
  },
  {
    slug: "macos-keychain-password-prompts-outlook-teams-onedrive",
    title: "macOS Keychain Password Prompts for Outlook / Teams / OneDrive",
    description:
      "Troubleshoot repeated macOS Keychain access prompts affecting Microsoft apps on managed Macs using safe keychain status checks before credential deletion or app resets.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS Keychain",
    environment: "macOS",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["macos", "keychain", "outlook", "teams", "onedrive", "prompts"],
    symptoms: [
      "User is repeatedly prompted to allow Keychain access for Outlook, Teams, or OneDrive.",
      "Prompts return after clicking Always Allow or entering the login password.",
      "App sign-in or token refresh may fail intermittently."
    ],
    causes: [
      "Login keychain password is out of sync with the current macOS password.",
      "Keychain item permissions or app signature trust prompts are stuck/corrupt.",
      "Repeated token recreation by apps triggers repeated prompts."
    ],
    remediations: [
      "Confirm whether prompts affect one app or multiple Microsoft apps on the same Mac.",
      "Verify the user can unlock the login keychain with the current macOS password.",
      "Use approved keychain repair/reset runbook only after support reviews impact to stored credentials.",
      "Capture screenshots of prompt text and app names before escalation."
    ],
    escalationCriteria: [
      "Keychain appears locked/corrupted or login keychain password mismatch is suspected.",
      "Multiple managed Macs show the issue after an app or macOS update.",
      "Credential reset or keychain reset could impact other enterprise apps and requires guided support."
    ],
    commands: [
      {
        title: "Check user keychain configuration (macOS)",
        shell: "Terminal",
        content: "security default-keychain -d user\nsecurity list-keychains -d user"
      }
    ]
  },
  {
    slug: "macos-screen-recording-permission-missing-for-screen-sharing",
    title: "macOS Screen Recording Permission Missing for Screen Sharing (Teams/Zoom/Meet)",
    description:
      "Troubleshoot screen sharing failures on macOS caused by missing Screen Recording permission using safe privacy-setting checks before app reinstall or policy changes.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS Privacy Permissions (TCC)",
    environment: "macOS",
    severity: "Medium",
    tags: ["macos", "screen-sharing", "screen-recording", "teams", "zoom", "permissions"],
    symptoms: [
      "User can join meetings but screen share shows black screen or nothing happens.",
      "Meeting app prompts for Screen Recording access or never appears in the list.",
      "Issue started after macOS update or app reinstall."
    ],
    causes: [
      "Screen Recording permission not granted in Privacy & Security.",
      "App update/reinstall changed app signature/path and old permission entry no longer applies.",
      "MDM privacy preferences profile controls or restricts prompts."
    ],
    remediations: [
      "Confirm which meeting app is affected and whether other meeting apps can share screen.",
      "Check Privacy & Security > Screen Recording and grant access to the approved app if allowed.",
      "Quit and relaunch the app after permission changes, then retest in a meeting.",
      "Escalate if MDM privacy profile restrictions block changes."
    ],
    escalationCriteria: [
      "TCC/Privacy settings are managed by MDM and users cannot change them.",
      "Issue affects multiple Macs after a macOS or app update.",
      "Resetting TCC entries or profile changes are required."
    ],
    commands: [
      {
        title: "Open Privacy & Security settings (macOS)",
        shell: "Terminal",
        content: "open 'x-apple.systempreferences:com.apple.preference.security'"
      }
    ]
  },
  {
    slug: "macos-mdm-profile-missing-or-not-verified-managed-mac",
    title: "macOS MDM Profile Missing or Not Verified (Managed Mac)",
    description:
      "Troubleshoot missing or unverified MDM profiles on managed Macs using safe enrollment checks before profile removal or device re-enrollment.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS Device Management",
    environment: "macOS",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "15-30 min",
    tags: ["macos", "mdm", "management-profile", "enrollment", "device-management"],
    symptoms: [
      "Corporate apps or VPN fail because the Mac appears unmanaged or non-compliant.",
      "Profiles/settings expected from IT are missing.",
      "System Settings shows profile warnings or verification issues."
    ],
    causes: [
      "Enrollment did not complete successfully.",
      "Profile trust/verification issue or expired enrollment state.",
      "User removed or partially removed a management profile (if permitted)."
    ],
    remediations: [
      "Confirm whether the Mac was previously managed and when the issue started.",
      "Check profile presence/status in System Settings and capture exact warnings shown.",
      "Avoid removing any remaining profile components without endpoint management guidance.",
      "Escalate for MDM enrollment status review and re-enrollment planning if needed."
    ],
    escalationCriteria: [
      "Profile verification fails or management profile is missing on a device expected to be managed.",
      "Compliance blocks business access and the user cannot continue work.",
      "MDM re-enrollment or device-side cleanup is required."
    ],
    commands: [
      {
        title: "Check MDM enrollment/profile status (macOS)",
        shell: "Terminal",
        content: "profiles status -type enrollment\nprofiles list"
      }
    ]
  },
  {
    slug: "macos-filevault-status-or-recovery-prompt-managed-device",
    title: "macOS FileVault Status or Recovery Prompt on Managed Device",
    description:
      "Troubleshoot FileVault status questions and unexpected recovery prompts on managed Macs using approved security workflows without bypassing encryption controls.",
    category: "macOS",
    productFamily: "Apple",
    product: "FileVault",
    environment: "macOS",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "10-30 min",
    tags: ["macos", "filevault", "encryption", "recovery", "security"],
    symptoms: [
      "User is prompted for a FileVault recovery key or cannot unlock the disk normally.",
      "FileVault status appears to change unexpectedly after updates.",
      "User asks for recovery key retrieval for a managed Mac."
    ],
    causes: [
      "Disk encryption state changed or recovery unlock is required.",
      "Password/account changes impacted expected unlock workflow.",
      "Authorized recovery method is required through managed key escrow."
    ],
    remediations: [
      "Verify user identity and device ownership before discussing recovery options.",
      "Use approved key escrow or MDM workflows for FileVault recovery requests.",
      "Collect exact error prompt text and whether the issue occurs at boot or login.",
      "Do not disable FileVault or use unauthorized tools to bypass encryption."
    ],
    escalationCriteria: [
      "Recovery key is unavailable in approved escrow systems.",
      "Repeated recovery prompts continue after successful unlock.",
      "Security review is required due to suspicious tamper or device custody concerns."
    ],
    commands: [
      {
        title: "Check FileVault encryption status (macOS)",
        shell: "Terminal",
        content: "fdesetup status"
      }
    ]
  },
  {
    slug: "macos-wifi-connected-no-internet-on-corporate-ssid",
    title: "macOS Wi-Fi Connected but No Internet on Corporate SSID",
    description:
      "Troubleshoot managed Mac Wi-Fi sessions that show connected but cannot browse or reach internal services using safe DNS/interface evidence collection.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS Wi-Fi",
    environment: "macOS",
    severity: "Medium",
    tags: ["macos", "wifi", "wireless", "corporate-network", "dns"],
    symptoms: [
      "Mac shows connected to corporate Wi-Fi but internet or internal resources fail.",
      "Issue may follow wake/resume or movement between office areas.",
      "Other devices may or may not be affected."
    ],
    causes: [
      "Wi-Fi association succeeded but DHCP/DNS routing state is unhealthy.",
      "Captive portal/802.1X session or roaming issue.",
      "Local interface state stale after sleep or network transition."
    ],
    remediations: [
      "Capture SSID, office location, and whether failure is internet-only or internal-only.",
      "Toggle Wi-Fi off/on and retest before deeper remediation.",
      "Collect interface and DNS output for wireless/network support review.",
      "Avoid deleting enterprise Wi-Fi profiles/certificates without support guidance."
    ],
    escalationCriteria: [
      "Multiple users in the same area/SSID are affected.",
      "802.1X/authentication or AP issues are suspected.",
      "Wireless engineering investigation is required."
    ],
    commands: [
      {
        title: "Check Wi-Fi interface and DNS state (macOS)",
        shell: "Terminal",
        content:
          "networksetup -getairportnetwork en0 2>/dev/null || true\nifconfig en0\nscutil --dns | head -80"
      }
    ]
  },
  {
    slug: "macos-vpn-connected-no-internal-resources-after-sleep",
    title: "macOS VPN Connected but No Internal Resources After Sleep/Wake",
    description:
      "Troubleshoot macOS VPN sessions that remain connected after sleep/wake but lose internal access by collecting route and DNS evidence before profile changes.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS VPN",
    environment: "macOS",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["macos", "vpn", "sleep-wake", "internal-access", "routing", "dns"],
    symptoms: [
      "VPN shows connected after wake, but internal apps/sites no longer load.",
      "Disconnect/reconnect temporarily restores access.",
      "Public internet may still work."
    ],
    causes: [
      "Route or DNS state not refreshed after sleep/wake transition.",
      "VPN client session remains connected but is not passing traffic correctly.",
      "Network switch (home/office/hotspot) left stale tunnel state."
    ],
    remediations: [
      "Confirm whether the issue reproduces consistently after sleep/wake.",
      "Disconnect/reconnect VPN and retest internal resources immediately.",
      "Collect route/DNS details while the issue is present for network team review.",
      "Avoid deleting VPN profiles or certificates unless directed by IT."
    ],
    escalationCriteria: [
      "Multiple Macs using the same VPN client/profile are affected.",
      "VPN client update or tunnel policy issue is suspected.",
      "Network/security team review is required."
    ],
    commands: [
      {
        title: "Collect route and DNS state while VPN is connected",
        shell: "Terminal",
        content: "netstat -rn | head -80\nscutil --dns | head -120"
      }
    ]
  },
  {
    slug: "macos-printer-offline-or-jobs-stuck-managed-printer",
    title: "macOS Printer Offline or Jobs Stuck (Managed Printer)",
    description:
      "Troubleshoot macOS printing issues on managed printers using safe queue and printer-status checks before removing printer objects or reinstalling drivers.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS Printing",
    environment: "macOS",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["macos", "printer", "printing", "queue", "cups"],
    symptoms: [
      "Printer appears offline on the Mac even though other users can print.",
      "Jobs remain in queue and do not complete.",
      "Issue may start after network change or printer wake/sleep."
    ],
    causes: [
      "Local CUPS queue paused/stuck.",
      "Printer unreachable from the Mac or wrong queue/protocol selected.",
      "Driver/PPD mismatch after updates or printer replacement."
    ],
    remediations: [
      "Confirm whether the issue is isolated to one Mac or affects the shared queue broadly.",
      "Pause/resume or cancel only stuck local jobs using normal UI steps first.",
      "Collect local printer queue status and printer URI details for support.",
      "Avoid deleting/re-adding managed printers without IT guidance."
    ],
    escalationCriteria: [
      "Shared queue or print server issue affects multiple users.",
      "Managed printer deployment/profile needs to be re-pushed.",
      "Driver or CUPS admin remediation is required."
    ],
    commands: [
      {
        title: "Check local printer queue and defaults (macOS)",
        shell: "Terminal",
        content: "lpstat -t"
      }
    ]
  },
  {
    slug: "macos-login-items-or-background-agents-high-cpu-after-update",
    title: "macOS Login Items / Background Agents High CPU After Update",
    description:
      "Troubleshoot high CPU after macOS updates by isolating login items and background agents with safe diagnostics before disabling managed security or productivity agents.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS Background Agents",
    environment: "macOS",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["macos", "cpu", "performance", "login-items", "background-agents"],
    symptoms: [
      "Fans run loudly and CPU usage stays high after login.",
      "Performance degrades after macOS update or reboot.",
      "Activity Monitor shows one or more background processes consuming CPU."
    ],
    causes: [
      "Post-update indexing or background maintenance tasks still running.",
      "Login items/background agents stuck or repeatedly crashing/restarting.",
      "Managed security/sync clients performing heavy catch-up activity."
    ],
    remediations: [
      "Capture the top processes and whether the issue subsides after 15-30 minutes.",
      "Use Activity Monitor to identify the specific process before changing settings.",
      "Do not disable endpoint security or management agents without approval.",
      "Escalate with process names, CPU usage, and timestamps if sustained."
    ],
    escalationCriteria: [
      "Managed security/MDM/backup agent is consuming sustained CPU and needs admin review.",
      "Many Macs show the issue after the same macOS or agent update.",
      "Process crash loop or kernel-level issue is suspected."
    ],
    commands: [
      {
        title: "Top CPU processes (macOS)",
        shell: "Terminal",
        content: "ps -Ao pid,pcpu,pmem,comm | sort -k2 -nr | head -15"
      }
    ]
  },
  {
    slug: "amazon-associates-affiliate-setup-and-link-compliance",
    title: "Amazon Associates Setup, Link Governance, and Compliance",
    description:
      "Operational playbook for configuring Amazon Associates links in a support/downloads portal with disclosure placement, link validation, and policy-safe usage.",
    category: "Business / Partnerships",
    productFamily: "Partnerships",
    product: "Amazon Associates",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    estimatedTime: "15-25 min",
    tags: ["affiliate", "amazon", "compliance", "disclosure", "tracking", "downloads"],
    symptoms: [
      "Affiliate links are live but disclosures are missing or inconsistent across pages.",
      "Outbound links are not using approved attributes for sponsored content.",
      "Clicks are visible in local analytics but not attributed as expected in partner reporting."
    ],
    causes: [
      "Affiliate links were added ad hoc without a centralized registry.",
      "Disclosure banner and link treatment are not consistently rendered across routes.",
      "Tracking parameters were changed or rewritten by redirects."
    ],
    remediations: [
      "Store all affiliate URLs in a single registry file and reference them by key in UI components.",
      "Render a clear affiliate disclosure banner near partner CTAs on Downloads and support pages.",
      "Use rel='sponsored nofollow noreferrer' for active affiliate outbound links.",
      "Validate link redirects after every registry update and before deployment."
    ],
    escalationCriteria: [
      "Partner program reports compliance policy warnings or attribution anomalies.",
      "There is uncertainty about required disclosure language in regulated jurisdictions.",
      "A link unexpectedly redirects to unapproved landing pages or broken storefronts."
    ],
    commands: [
      {
        title: "Validate Amazon shortlink redirect path",
        shell: "CLI",
        content:
          "curl -I https://amzn.to/4b1Cr3z\ncurl -Ls -o /dev/null -w \"Final URL: %{url_effective}\\nHTTP: %{http_code}\\n\" https://amzn.to/4b1Cr3z"
      }
    ]
  },
  {
    slug: "adobe-affiliate-partnerize-setup-and-attribution-validation",
    title: "Adobe Affiliate (Partnerize) Setup and Attribution Validation",
    description:
      "Setup guide for Adobe Affiliate links with Partnerize-friendly tracking hygiene, category-level placement strategy, and safe promotion copy.",
    category: "Business / Partnerships",
    productFamily: "Partnerships",
    product: "Adobe Affiliate",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    estimatedTime: "20-30 min",
    tags: ["affiliate", "adobe", "partnerize", "creative-cloud", "attribution", "tracking"],
    symptoms: [
      "Adobe troubleshooting pages are high traffic but partner conversions are low.",
      "Links point to generic Adobe pages without campaign context.",
      "Team cannot confirm which content clusters generate conversions."
    ],
    causes: [
      "Placement strategy not aligned to Adobe-specific support articles.",
      "Inconsistent mapping between support docs and affiliate offers.",
      "No periodic QA of active links and redirect targets."
    ],
    remediations: [
      "Map Adobe affiliate links to Adobe KB categories and article tags using a documented registry.",
      "Use contextual CTA text based on user intent (licensing, install, app troubleshooting).",
      "Review partner dashboard click/conversion patterns weekly and tune placements.",
      "Maintain neutral support-first wording and avoid claims that bypass enterprise licensing controls."
    ],
    escalationCriteria: [
      "Partnerize dashboard reports invalid traffic or policy enforcement actions.",
      "Enterprise procurement restrictions require legal/compliance review of placement copy.",
      "Attribution drops after site release and requires structured rollback/testing."
    ],
    commands: [
      {
        title: "Quick redirect and status check for Adobe partner links",
        shell: "CLI",
        content:
          "curl -I \"https://www.adobe.com/affiliates.html\"\n# Replace with approved Adobe tracking URL once issued and re-run checks."
      }
    ]
  },
  {
    slug: "onepassword-affiliate-cj-setup-and-conversion-testing",
    title: "1Password Affiliate (CJ) Setup and Conversion Test Plan",
    description:
      "Operational checklist for 1Password affiliate placements in identity/security support content, including disclosure, link QA, and non-bypass messaging.",
    category: "Business / Partnerships",
    productFamily: "Partnerships",
    product: "1Password Affiliate",
    environment: "Both",
    severity: "Low",
    accessLevel: "Admin Required",
    estimatedTime: "15-20 min",
    tags: ["affiliate", "1password", "identity", "security", "cj", "conversion-testing"],
    symptoms: [
      "Identity/MFA support docs generate clicks but poor qualified conversions.",
      "No repeatable process exists to validate updated 1Password tracking links.",
      "Offer placement appears in unrelated categories."
    ],
    causes: [
      "Link placements are not scoped to identity and credential-management topics.",
      "A/B comparisons were run without preserving baseline CTA positions.",
      "Disclosure or partner status labels are missing near links."
    ],
    remediations: [
      "Place 1Password partner links only in relevant identity, credential, and security support contexts.",
      "Document pre/post update link checks and keep a changelog for affiliate URL updates.",
      "Ensure active links include sponsored attributes and visible disclosure text.",
      "Review conversion quality by article family and remove low-intent placements."
    ],
    escalationCriteria: [
      "CJ account flags traffic quality or placement non-compliance issues.",
      "Security/legal stakeholders require revision of copy or placement rules.",
      "Users report misunderstanding affiliate CTAs as mandatory support steps."
    ],
    commands: [
      {
        title: "Baseline check for 1Password affiliate landing path",
        shell: "CLI",
        content:
          "curl -I \"https://1password.com/affiliate/\"\n# Replace with live CJ tracking URL after approval for final validation."
      }
    ]
  },
  {
    slug: "malwarebytes-affiliate-setup-and-security-safe-promotion",
    title: "Malwarebytes Affiliate Setup and Security-Safe Promotion Guidelines",
    description:
      "Guide for placing Malwarebytes affiliate offers in security-adjacent docs while maintaining enterprise-safe remediation guidance and escalation boundaries.",
    category: "Business / Partnerships",
    productFamily: "Partnerships",
    product: "Malwarebytes Affiliate",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    estimatedTime: "15-25 min",
    tags: ["affiliate", "malwarebytes", "security", "endpoint", "partnerize", "compliance"],
    symptoms: [
      "Security-related pages have partner links but unclear safety/disclaimer messaging.",
      "Recommendations conflict with existing corporate endpoint tooling guidance.",
      "Analysts are unsure when to suggest partner tools vs IT escalation."
    ],
    causes: [
      "Affiliate placement rules are not aligned with enterprise security standards.",
      "Support playbooks do not clearly separate user-safe advice from admin-managed controls.",
      "No documented escalation path when threat signals are high."
    ],
    remediations: [
      "Keep affiliate suggestions optional and secondary to approved corporate security controls.",
      "Add clear escalation guidance for suspected compromise, phishing, or policy violations.",
      "Review copy to avoid implying users should bypass managed endpoint protection.",
      "Include partner link status and disclosure in the recommendation section."
    ],
    escalationCriteria: [
      "Users report active compromise indicators, suspicious sign-ins, or lateral movement concerns.",
      "Partner CTA placement conflicts with internal security standards or legal guidance.",
      "Security team requests temporary suspension of security-affiliate promotions."
    ],
    commands: [
      {
        title: "Check published Malwarebytes partner landing URL",
        shell: "CLI",
        content:
          "curl -I \"https://www.malwarebytes.com/affiliates\"\n# Use your approved tracking URL for production QA."
      }
    ]
  },
  {
    slug: "grammarly-affiliate-impact-setup-and-link-governance",
    title: "Grammarly Affiliate (Impact) Setup and Link Governance",
    description:
      "Runbook for adding Grammarly affiliate placements to productivity/documentation support topics with clean disclosure and attribution hygiene.",
    category: "Business / Partnerships",
    productFamily: "Partnerships",
    product: "Grammarly Affiliate",
    environment: "Both",
    severity: "Low",
    accessLevel: "Admin Required",
    estimatedTime: "10-20 min",
    tags: ["affiliate", "grammarly", "impact", "productivity", "documentation", "governance"],
    symptoms: [
      "Documentation and communication guides lack structured partner mapping.",
      "Affiliate links are copied manually, leading to inconsistent URLs.",
      "Policy teams request an auditable workflow for placement updates."
    ],
    causes: [
      "No central registry linking article families to affiliate providers.",
      "Lack of release checklist for validating outbound link health.",
      "Affiliate status (applied vs active) is not visible in UI."
    ],
    remediations: [
      "Store Grammarly links and metadata in the affiliate registry with status indicators.",
      "Connect relevant support docs to Grammarly via documented mapping rules.",
      "Include disclosure banner and avoid deceptive or mandatory language around partner tools.",
      "Run a link health check before each deploy and after partner URL updates."
    ],
    escalationCriteria: [
      "Impact account flags policy concerns or invalid traffic behavior.",
      "Disclosure requirements change and legal review is needed.",
      "Attribution drops sharply after navigation or SEO updates."
    ],
    commands: [
      {
        title: "Check Grammarly affiliate info page reachability",
        shell: "CLI",
        content:
          "curl -I \"https://www.grammarly.com/affiliates\"\n# Swap with your live Impact URL once approved."
      }
    ]
  },
  {
    slug: "surfshark-affiliate-placement-and-policy-compliant-positioning",
    title: "Surfshark Affiliate Placement and Policy-Compliant Positioning",
    description:
      "Position Surfshark partner links within networking/privacy support docs while preserving enterprise VPN guidance and avoiding policy bypass messaging.",
    category: "Business / Partnerships",
    productFamily: "Partnerships",
    product: "Surfshark Affiliate",
    environment: "Both",
    severity: "Low",
    accessLevel: "Admin Required",
    estimatedTime: "10-20 min",
    tags: ["affiliate", "surfshark", "vpn", "privacy", "networking", "impact"],
    symptoms: [
      "VPN troubleshooting pages need partner placement but overlap with corporate VPN policies.",
      "Users may confuse consumer VPN recommendations with mandatory corporate access methods.",
      "No documented guardrails exist for consumer-VPN promotional language."
    ],
    causes: [
      "Affiliate messaging not separated from official enterprise network runbooks.",
      "Category mapping lacks explicit inclusion/exclusion rules.",
      "Disclosures are inconsistent across pages with networking content."
    ],
    remediations: [
      "Keep corporate VPN support steps primary and place partner links in optional recommendation sections.",
      "Explicitly state that affiliate tools do not replace corporate security/network policy requirements.",
      "Use consistent disclosure, rel attributes, and status badges for partner links.",
      "Track click quality by article type and remove underperforming or confusing placements."
    ],
    escalationCriteria: [
      "Network/security teams report conflicts with approved remote access standards.",
      "Users repeatedly attempt policy-bypass workarounds after reading partner CTAs.",
      "Partner platform flags non-compliant placement or traffic anomalies."
    ],
    commands: [
      {
        title: "Validate Surfshark partner destination availability",
        shell: "CLI",
        content:
          "curl -I \"https://surfshark.com/affiliate\"\n# Replace with your approved tracking URL before go-live."
      }
    ]
  },
  {
    slug: "proton-partners-affiliate-setup-and-privacy-safe-messaging",
    title: "Proton Partners Setup and Privacy-Safe Messaging",
    description:
      "Support document for Proton affiliate placements in privacy and identity content, including trust messaging and enterprise-safe boundaries.",
    category: "Business / Partnerships",
    productFamily: "Partnerships",
    product: "Proton Partners",
    environment: "Both",
    severity: "Low",
    accessLevel: "Admin Required",
    estimatedTime: "10-20 min",
    tags: ["affiliate", "proton", "privacy", "encryption", "identity", "compliance"],
    symptoms: [
      "Privacy-focused support pages have no consistent affiliate recommendation strategy.",
      "Copy mixes personal-privacy suggestions with enterprise account requirements.",
      "Team cannot quickly identify where Proton links are currently used."
    ],
    causes: [
      "No content governance layer for privacy affiliate links.",
      "Lack of mapping between support categories and partner relevance.",
      "Incomplete disclosure rollout across support layouts."
    ],
    remediations: [
      "Use registry-based placement so Proton links only appear in relevant privacy/security topics.",
      "Keep guidance neutral and avoid suggesting migration away from corporate-managed systems.",
      "Add clear disclosure and status badges for partner links.",
      "Review content quarterly for policy alignment and conversion quality."
    ],
    escalationCriteria: [
      "Legal/compliance requests copy changes for privacy/security claims.",
      "Partner reporting indicates invalid traffic, misattribution, or policy issues.",
      "Support teams report user confusion between corporate and personal security tooling."
    ],
    commands: [
      {
        title: "Verify Proton partner information endpoint",
        shell: "CLI",
        content:
          "curl -I \"https://proton.me/partners/affiliates\"\n# Replace with your partner tracking URL for final validation."
      }
    ]
  },
  {
    slug: "apple-services-performance-partners-onboarding-and-approval-notes",
    title: "Apple Services Performance Partners Onboarding and Approval Notes",
    description:
      "Operational notes for Apple Services Performance Partner onboarding, approval boundaries, and compliant promotion handling in a support-driven portfolio.",
    category: "Business / Partnerships",
    productFamily: "Partnerships",
    product: "Apple Services Performance Partners",
    environment: "Both",
    severity: "Low",
    accessLevel: "Admin Required",
    estimatedTime: "15-25 min",
    tags: ["affiliate", "apple", "performance-partners", "approval", "app-store", "policy"],
    symptoms: [
      "Apple partner application is submitted but tracking links are not yet available.",
      "Team needs a documented process for handling approval-gated partner programs.",
      "Placement plans exist before final partner terms are accepted."
    ],
    causes: [
      "Program approvals are pending and operational readiness steps are incomplete.",
      "No fallback plan for pending-status partner entries in the affiliate registry.",
      "Lack of central documentation on partner-specific restrictions."
    ],
    remediations: [
      "Keep Apple partner entries marked as Applied until official tracking links are issued.",
      "Use official Apple program pages as placeholders without sponsored attribution until activation.",
      "Document approval terms and update disclosure/copy to match accepted policies.",
      "Deploy activation changes only after link QA and compliance sign-off."
    ],
    escalationCriteria: [
      "Program terms are unclear and require legal/partnership review.",
      "Tracking links are issued but redirect behavior does not match approved campaigns.",
      "Team requests pre-approval promotional copy that may violate program guidelines."
    ],
    commands: [
      {
        title: "Verify Apple partner program page availability",
        shell: "CLI",
        content:
          "curl -I \"https://performance-partners.apple.com/home\"\n# Update to approved Apple tracking URL after partner activation."
      }
    ]
  },
  {
    slug: "outlook-shared-calendar-not-updating-windows-macos",
    title: "Outlook Shared Calendar Not Updating (Windows / macOS)",
    description:
      "Troubleshoot delayed or missing shared calendar updates in Outlook desktop clients using safe cache, delegate, and permission checks.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Outlook",
    environment: "Both",
    severity: "Medium",
    tags: ["outlook", "shared-calendar", "delegate", "calendar", "sync"],
    symptoms: [
      "Shared calendar updates appear in web but not desktop Outlook.",
      "One delegate sees new events while another delegate does not.",
      "Calendar status appears stale for extended periods."
    ],
    causes: [
      "Local Outlook cache for shared folders is stale.",
      "Delegate permissions changed recently or did not fully propagate.",
      "Session/token state mismatch after sign-in changes."
    ],
    remediations: [
      "Verify the same calendar in Outlook on the web first.",
      "Confirm delegate permissions and owner-side sharing state.",
      "Restart Outlook and force refresh before profile reset actions.",
      "Escalate to Exchange admins before any profile rebuild."
    ],
    escalationCriteria: [
      "Multiple delegates are affected for the same mailbox.",
      "Issue follows permissions changes and remains inconsistent.",
      "Calendar supports regulated or executive scheduling workflows."
    ]
  },
  {
    slug: "teams-status-stuck-away-or-offline",
    title: "Teams Status Stuck on Away or Offline",
    description:
      "Fix Microsoft Teams presence state issues where users appear Away/Offline despite active usage.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Microsoft Teams",
    environment: "Both",
    severity: "Low",
    tags: ["teams", "presence", "status", "away", "offline"],
    symptoms: [
      "User remains Away or Offline while actively using Teams.",
      "Manual status changes revert unexpectedly.",
      "Presence differs between Teams and Outlook."
    ],
    causes: [
      "Multiple active clients provide conflicting presence signals.",
      "Client session state is stale.",
      "Mailbox/calendar integration is delayed."
    ],
    remediations: [
      "Sign out and back in to Teams desktop client.",
      "Close duplicate sessions on unused devices.",
      "Validate Outlook calendar connectivity.",
      "Retest presence using a message and meeting event."
    ],
    escalationCriteria: [
      "Presence issue affects multiple users after updates.",
      "Calendar/mailbox integration errors are present.",
      "Operations depend on accurate presence state."
    ]
  },
  {
    slug: "onedrive-no-permission-to-sync-library",
    title: "OneDrive: You Do Not Have Permission to Sync This Library",
    description:
      "Resolve OneDrive/SharePoint library sync permission errors without weakening access controls.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "OneDrive",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["onedrive", "sharepoint", "permissions", "library-sync", "access"],
    symptoms: [
      "User sees permission error when starting library sync.",
      "Web access may work but sync fails.",
      "Reconnect attempts do not resolve the issue."
    ],
    causes: [
      "Group membership or library inheritance issue.",
      "Link scope or token context mismatch.",
      "Policy restrictions for protected content."
    ],
    remediations: [
      "Validate access in SharePoint web with the intended account.",
      "Review site/library permissions and group membership.",
      "Reconnect sync relationship only through approved workflow.",
      "Apply least-privilege fixes and re-test."
    ],
    escalationCriteria: [
      "Multiple users show the same permission sync failure.",
      "DLP/sensitivity controls appear to block sync.",
      "Owner/security review is required before permission changes."
    ]
  },
  {
    slug: "sharepoint-external-sharing-blocked-by-policy",
    title: "SharePoint External Sharing Blocked by Policy",
    description:
      "Troubleshoot external sharing failures in SharePoint Online caused by tenant/site policy and security controls.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "SharePoint",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["sharepoint", "external-sharing", "policy", "guest", "security"],
    symptoms: [
      "Users cannot send external shares and get policy errors.",
      "Sharing options are reduced or disabled.",
      "Previously valid external links no longer work."
    ],
    causes: [
      "Tenant or site sharing policy changed.",
      "Domain restrictions block recipients.",
      "Conditional Access/device requirements prevent external access."
    ],
    remediations: [
      "Capture exact error text, URL, and recipient domain.",
      "Determine if the restriction is tenant-wide or site-specific.",
      "Verify link scope and guest redemption path.",
      "Coordinate with security before changing share scope."
    ],
    escalationCriteria: [
      "Policy impact spans multiple teams/sites.",
      "DLP/CA/sensitivity controls are the blocking factor.",
      "Business request conflicts with compliance policy."
    ]
  },
  {
    slug: "m365-group-not-appearing-outlook-or-teams",
    title: "Microsoft 365 Group Not Appearing in Outlook or Teams",
    description:
      "Investigate delayed or missing M365 group visibility across Outlook and Teams after creation or membership updates.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Microsoft 365 Groups",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["m365-group", "outlook", "teams", "membership", "provisioning"],
    symptoms: [
      "Newly created group is missing in one or both clients.",
      "Assigned user cannot see group resources.",
      "Group appears in one service but not another."
    ],
    causes: [
      "Provisioning or replication delay.",
      "User session has not refreshed claims/membership.",
      "Group settings are incompatible with expected workload."
    ],
    remediations: [
      "Verify group exists with correct owners/members.",
      "Sign out/in of affected clients and retest.",
      "Check hidden-from-client settings and workload enablement.",
      "Allow propagation window and revalidate."
    ],
    escalationCriteria: [
      "Delays are widespread across groups.",
      "Directory inconsistency appears across services.",
      "Backend provisioning incident is suspected."
    ]
  },
  {
    slug: "intune-app-deployment-failed-error-code-triage",
    title: "Intune App Deployment Failed (Common Error-Code Triage)",
    description:
      "Triage Intune app install failures using error-code context, requirement checks, and detection logic validation.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Intune",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "20-35 min",
    tags: ["intune", "app-deployment", "error-code", "endpoint", "compliance"],
    symptoms: [
      "App install repeatedly fails in Company Portal.",
      "Deployment succeeds for some devices but fails for others.",
      "Error code persists across retries."
    ],
    causes: [
      "Requirement or detection rule mismatch.",
      "Device non-compliance or stale check-in.",
      "Package/dependency issue."
    ],
    remediations: [
      "Capture exact error code, app version, and assignment intent.",
      "Validate requirements and detection against target device state.",
      "Review dependency chain and package metadata.",
      "Retest on controlled pilot after corrections."
    ],
    escalationCriteria: [
      "Failure impacts broad deployment cohorts.",
      "Package integrity/signing concerns are present.",
      "Service-side tenant issue is suspected."
    ],
    commands: [
      {
        title: "Windows Intune management extension logs",
        shell: "PowerShell",
        content:
          "dsregcmd /status\nGet-ChildItem \"C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs\" | Select-Object Name, LastWriteTime"
      }
    ]
  },
  {
    slug: "conditional-access-device-not-compliant-remediation-path",
    title: "Conditional Access Block: Device Not Compliant (Remediation Path)",
    description:
      "Handle Conditional Access compliance blocks using approved identity and endpoint remediation steps.",
    category: "Identity / MFA / SSO",
    productFamily: "Microsoft",
    product: "Microsoft Entra ID",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["conditional-access", "device-compliance", "entra-id", "identity", "security"],
    symptoms: [
      "Sign-in succeeds but app access is blocked for non-compliant device.",
      "Access works on one device but fails on another.",
      "Issue appears after compliance policy changes."
    ],
    causes: [
      "Device compliance state is failed or stale.",
      "Policy recently tightened enforcement.",
      "MDM registration/check-in mismatch."
    ],
    remediations: [
      "Collect correlation ID, policy name, and device ID from error prompt.",
      "Validate compliance and latest check-in in endpoint management.",
      "Run approved sync/compliance refresh workflow.",
      "Coordinate identity and endpoint teams for final resolution."
    ],
    escalationCriteria: [
      "Blocks occur at scale after policy updates.",
      "Device appears compliant but policy still blocks.",
      "Users request bypassing compliance controls."
    ]
  },
  {
    slug: "windows-hello-pin-reset-managed-device",
    title: "Windows Hello PIN Reset on Managed Device",
    description:
      "Troubleshoot and reset Windows Hello PIN issues in managed environments with security-safe workflow.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows Hello",
    environment: "Windows",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["windows-hello", "pin", "identity", "managed-device", "windows"],
    symptoms: [
      "User cannot sign in with PIN.",
      "PIN reset loops or fails.",
      "Issue started after account or policy change."
    ],
    causes: [
      "Hello credential container mismatch.",
      "TPM or policy state issue.",
      "MDM/GPO configuration conflict."
    ],
    remediations: [
      "Verify account sign-in works with password.",
      "Use approved PIN reset flow on managed device.",
      "Validate Hello policy assignment/compliance state.",
      "Document expected re-enrollment prompts."
    ],
    escalationCriteria: [
      "TPM/credential provider errors persist.",
      "Policy conflicts are suspected across device baselines.",
      "Issue affects multiple endpoints."
    ]
  },
  {
    slug: "bitlocker-recovery-loop-after-bios-firmware-update",
    title: "BitLocker Recovery Loop After BIOS/Firmware Update",
    description:
      "Respond to repeated BitLocker recovery prompts after BIOS or firmware changes using approved key escrow and admin controls.",
    category: "Windows",
    productFamily: "Windows",
    product: "BitLocker",
    environment: "Windows",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "15-30 min",
    tags: ["bitlocker", "recovery", "bios", "firmware", "encryption", "windows"],
    symptoms: [
      "Recovery key is requested on every reboot after firmware update.",
      "Device unlocks once but re-prompts repeatedly.",
      "Boot sequence/TPM measurements changed."
    ],
    causes: [
      "TPM trust chain changed by firmware or boot config updates.",
      "BitLocker protectors require admin maintenance flow.",
      "Unexpected secure boot state shift."
    ],
    remediations: [
      "Confirm device ownership and retrieve key from approved escrow.",
      "Validate firmware and secure boot configuration under admin control.",
      "Apply sanctioned protector maintenance procedure.",
      "Retest across multiple restarts."
    ],
    escalationCriteria: [
      "Escrow key unavailable or invalid.",
      "Same model cohort shows repeated post-update recovery loops.",
      "Tamper indicators require security incident review."
    ]
  },
  {
    slug: "macos-gatekeeper-blocks-corporate-app-after-update",
    title: "macOS Gatekeeper Blocks Corporate App After Update",
    description:
      "Troubleshoot Gatekeeper app blocks after updates without bypassing notarization or security policy controls.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS Gatekeeper",
    environment: "macOS",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["macos", "gatekeeper", "notarization", "app-update", "security"],
    symptoms: [
      "Corporate app launch is blocked by Gatekeeper after update.",
      "App worked before latest release.",
      "Users request local bypass commands."
    ],
    causes: [
      "Updated package signature/notarization mismatch.",
      "Allowlist/profile rules no longer match app build.",
      "MDM policy and package metadata are out of sync."
    ],
    remediations: [
      "Capture exact Gatekeeper warning and app version.",
      "Validate signature/notarization status with approved tooling.",
      "Confirm deployment package came from approved source.",
      "Use managed redistribution/update path for fixes."
    ],
    escalationCriteria: [
      "Notarization/signature checks fail in production package.",
      "Issue affects multiple managed Macs after release.",
      "Request involves disabling Gatekeeper controls."
    ],
    commands: [
      {
        title: "Gatekeeper and signature check",
        shell: "Terminal",
        content:
          "codesign -dv --verbose=4 /Applications/CorpApp.app 2>&1 | head -40\nspctl --assess --type execute --verbose /Applications/CorpApp.app"
      }
    ]
  },
  {
    slug: "okta-scim-provisioning-deprovisioning-delay",
    title: "Okta SCIM Provisioning/Deprovisioning Delay",
    description:
      "Investigate delayed Okta SCIM lifecycle events for joins/moves/leavers while maintaining governance controls.",
    category: "Identity / MFA / SSO",
    productFamily: "Okta",
    product: "Okta SCIM Provisioning",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["okta", "scim", "provisioning", "deprovisioning", "identity-governance"],
    symptoms: [
      "New users are not provisioned on time.",
      "Departed users remain active in downstream apps.",
      "Provisioning queue appears delayed or inconsistent."
    ],
    causes: [
      "Connector/API errors or throttling.",
      "Attribute mapping/filter mismatch.",
      "Lifecycle trigger sequencing delays."
    ],
    remediations: [
      "Capture impacted user IDs, app integration, and timestamps.",
      "Review Okta system logs for connector failures.",
      "Validate assignment scope and mapping attributes.",
      "Coordinate with app owner for endpoint health and limits."
    ],
    escalationCriteria: [
      "Deprovisioning delay creates security risk.",
      "Connector issue affects many users.",
      "Manual emergency access revocation is required."
    ]
  },
  {
    slug: "okta-app-assignment-not-applying-user-group",
    title: "Okta App Assignment Not Applying to User/Group",
    description:
      "Troubleshoot missing Okta app entitlements despite expected group assignments and policy conditions.",
    category: "Identity / MFA / SSO",
    productFamily: "Okta",
    product: "Okta App Assignment",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["okta", "app-assignment", "group", "entitlements", "sso"],
    symptoms: [
      "User does not see expected app in Okta dashboard.",
      "Group assignment exists but selected users are excluded.",
      "Assignment appears delayed after changes."
    ],
    causes: [
      "Rule filters exclude target users.",
      "Policy conditions deny app visibility.",
      "Assignment sync delay in connector."
    ],
    remediations: [
      "Validate effective group membership for the impacted user.",
      "Review app assignment rules and sign-on policies.",
      "Check logs for assignment or policy denial events.",
      "Test with controlled pilot user in known-good group."
    ],
    escalationCriteria: [
      "Access gap affects multiple business-critical apps.",
      "Governance approval required for rule changes.",
      "Temporary admin workaround is needed for urgent access."
    ]
  },
  {
    slug: "acrobat-sign-in-loop-enterprise-sso",
    title: "Adobe Acrobat Sign-In Loop with Enterprise SSO",
    description:
      "Fix recurring Adobe Acrobat authentication loops in federated enterprise SSO environments.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Acrobat",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["adobe", "acrobat", "sso", "signin-loop", "federated-auth"],
    symptoms: [
      "Acrobat returns to sign-in repeatedly after successful auth.",
      "Browser auth works but desktop session does not persist.",
      "Issue starts after IdP/policy changes."
    ],
    causes: [
      "Federated session exchange failure.",
      "Stale local Adobe auth state.",
      "Proxy/TLS path issues for Adobe identity endpoints."
    ],
    remediations: [
      "Validate federated login behavior in browser first.",
      "Capture timestamp and sign-in loop context.",
      "Apply approved Adobe session cleanup workflow.",
      "Coordinate with identity team for federation validation."
    ],
    escalationCriteria: [
      "Multiple federated users are affected.",
      "Recent IdP metadata/certificate changes align with incident.",
      "Policy updates are required across identity stack."
    ]
  },
  {
    slug: "adobe-fonts-not-syncing-behind-proxy-firewall",
    title: "Adobe Fonts Not Syncing Behind Proxy/Firewall",
    description:
      "Troubleshoot Adobe Fonts sync failures in controlled enterprise network paths with proxy/firewall restrictions.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Fonts",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["adobe", "fonts", "proxy", "firewall", "creative-cloud", "network"],
    symptoms: [
      "Fonts do not appear in Adobe apps despite active sign-in.",
      "Sync works off-network but fails on corporate network.",
      "Creative Cloud reports fonts unavailable."
    ],
    causes: [
      "Required Adobe endpoints are blocked by network controls.",
      "TLS inspection/certificate trust issues.",
      "Local sync service state stale after policy changes."
    ],
    remediations: [
      "Compare behavior on corporate and alternate network.",
      "Collect endpoint block evidence from proxy/firewall logs.",
      "Restart Creative Cloud services and retest.",
      "Submit allowlist updates through security/network process."
    ],
    escalationCriteria: [
      "Policy block affects broad design teams.",
      "Exception requests require security architecture review.",
      "Endpoint allowlist changes need governance approval."
    ]
  },
  {
    slug: "figma-comments-files-not-loading-websocket-firewall",
    title: "Figma Comments/Files Not Loading (WebSocket/Firewall)",
    description:
      "Investigate Figma loading and collaboration failures caused by blocked real-time channels or restrictive network policies.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["figma", "websocket", "firewall", "comments", "network", "collaboration"],
    symptoms: [
      "Files open slowly and comments/presence do not load.",
      "Live collaboration events fail on corporate network.",
      "Issue resolves on alternate network path."
    ],
    causes: [
      "WebSocket traffic blocked or interrupted.",
      "Security controls interfere with Figma real-time endpoints.",
      "DNS/routing path instability."
    ],
    remediations: [
      "Capture browser/app version and network context.",
      "Reproduce on alternate approved network for isolation.",
      "Collect network traces for blocked socket requests.",
      "Coordinate with network/security for endpoint protocol validation."
    ],
    escalationCriteria: [
      "Issue affects multiple users/sites.",
      "Firewall/policy rollout correlates with incident.",
      "Any workaround would bypass enterprise controls."
    ]
  },
  {
    slug: "figma-org-transfer-team-permission-mismatch",
    title: "Figma Organization Transfer / Team Permission Mismatch",
    description:
      "Resolve access mismatches after Figma organization or team restructuring with least-privilege controls.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["figma", "organization", "permissions", "team", "transfer", "access"],
    symptoms: [
      "Users lose edit rights after org or team moves.",
      "Project roles differ from expected ownership model.",
      "Inherited permissions are inconsistent."
    ],
    causes: [
      "Role inheritance changed during transfer.",
      "SSO/group mapping no longer aligns with team structure.",
      "Legacy project permissions persisted."
    ],
    remediations: [
      "Inventory expected vs actual roles for impacted projects.",
      "Validate SSO/group mappings against org design.",
      "Correct roles using least-privilege and document changes.",
      "Run post-change access validation with pilot users."
    ],
    escalationCriteria: [
      "Mismatch is organization-wide.",
      "Sensitive projects have incorrect permissions.",
      "Vendor/admin API support is needed for correction."
    ]
  },
  {
    slug: "chrome-edge-profile-corruption-enterprise-safe-reset",
    title: "Chrome/Edge Profile Corruption (Enterprise-Safe Reset)",
    description:
      "Fix browser profile corruption with controlled reset workflow that preserves policy and security posture.",
    category: "Browsers",
    productFamily: "Browser",
    product: "Chrome / Edge",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["chrome", "edge", "profile", "corruption", "browser", "reset"],
    symptoms: [
      "Browser crashes or resets sessions unexpectedly.",
      "SSO fails only in one browser profile.",
      "Settings/extensions behave inconsistently."
    ],
    causes: [
      "Local profile data corruption.",
      "Extension conflict with stored profile state.",
      "Managed policy/profile sync mismatch."
    ],
    remediations: [
      "Validate issue with a clean test profile.",
      "Backup bookmarks and approved user settings.",
      "Reset/rebuild profile using enterprise-safe steps.",
      "Reapply only approved extensions and retest SSO."
    ],
    escalationCriteria: [
      "Issue follows browser policy rollout across many users.",
      "Managed policy conflict remains after clean profile.",
      "Endpoint engineering change is required."
    ]
  },
  {
    slug: "vpn-split-tunnel-dns-mismatch-internal-names-fail",
    title: "VPN Split-Tunnel DNS Mismatch (Internal Names Fail)",
    description:
      "Troubleshoot split-tunnel VPN sessions where internal names fail while VPN appears connected.",
    category: "Networking / VPN",
    productFamily: "Networking",
    product: "Corporate VPN",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["vpn", "split-tunnel", "dns", "internal-names", "networking", "routing"],
    symptoms: [
      "VPN is connected but internal hostnames do not resolve.",
      "Internal resources work by IP but fail by DNS name.",
      "Issue varies after reconnect or network changes."
    ],
    causes: [
      "DNS servers/search suffixes not applied correctly via tunnel.",
      "Local DNS overrides enterprise resolution path.",
      "Split-tunnel route policy and DNS scope mismatch."
    ],
    remediations: [
      "Capture DNS server/search suffix state while VPN is active.",
      "Test internal resources by hostname and IP for comparison.",
      "Reconnect VPN and compare route/DNS outputs.",
      "Escalate for profile-level DNS/split-tunnel policy correction."
    ],
    escalationCriteria: [
      "Multiple users on same VPN profile are affected.",
      "Issue started after VPN profile or client updates.",
      "Requested workaround bypasses managed security controls."
    ],
    commands: [
      {
        title: "Split-tunnel DNS diagnostics",
        shell: "CLI",
        content:
          "# Windows\nipconfig /all\nResolve-DnsName intranet.company.local\nroute print\n\n# macOS\nscutil --dns\nnslookup intranet.company.local\nnetstat -rn"
      }
    ]
  },
  {
    slug: "password-manager-autofill-not-working-chrome-edge-enterprise",
    title: "Password Manager Autofill Not Working (Chrome / Edge)",
    description:
      "Troubleshoot enterprise browser autofill failures for password manager extensions without bypassing browser security policy, SSO controls, or MFA requirements.",
    category: "Identity / MFA / SSO",
    productFamily: "Okta",
    product: "Password Manager Browser Extension",
    environment: "Both",
    severity: "Medium",
    tags: ["1password", "password-manager", "autofill", "browser-extension", "chrome", "edge", "credential"],
    symptoms: [
      "Autofill prompt does not appear on supported sign-in pages.",
      "Extension icon is present but does not fill username/password fields.",
      "Issue affects one browser profile while another profile works."
    ],
    causes: [
      "Extension is disabled, outdated, or blocked in the active browser profile.",
      "Site URL mismatch between saved vault item and current login page.",
      "Enterprise browser settings or privacy controls restrict extension interaction."
    ],
    remediations: [
      "Confirm extension is enabled and signed in with the intended corporate account.",
      "Validate saved item URL matches the login domain and not a different tenant/environment.",
      "Test in a clean browser profile to isolate extension/policy conflicts safely.",
      "Keep MFA and corporate SSO controls enabled during all troubleshooting."
    ],
    escalationCriteria: [
      "Extension is blocked by enterprise policy and requires browser admin changes.",
      "Autofill failure affects many users after browser or extension updates.",
      "Users request insecure workarounds such as storing credentials in plain text."
    ]
  },
  {
    slug: "password-manager-shared-vault-access-not-updating",
    title: "Password Manager Shared Vault Access Not Updating",
    description:
      "Resolve shared vault permission and sync delays using least-privilege identity checks and controlled access review workflows.",
    category: "Identity / MFA / SSO",
    productFamily: "Okta",
    product: "1Password Shared Vaults",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["1password", "shared-vault", "permissions", "access", "identity", "least-privilege"],
    symptoms: [
      "User was added to a vault/group but does not see expected items.",
      "Vault access differs across desktop, browser extension, or web client.",
      "Permission changes appear delayed after group updates."
    ],
    causes: [
      "Group membership did not propagate fully across identity and vault systems.",
      "User account context mismatch (wrong tenant/account signed in).",
      "Role assignment grants insufficient vault permissions."
    ],
    remediations: [
      "Verify requested access level and business justification before any permission changes.",
      "Confirm user is signed in to the correct account and vault scope.",
      "Recheck group membership and sync state after propagation window.",
      "Document final permission outcome and keep least-privilege defaults."
    ],
    escalationCriteria: [
      "Privileged/shared admin vault access is requested or changed unexpectedly.",
      "Many users lose vault access after role/group updates.",
      "Identity governance review is required for conflicting entitlement rules."
    ]
  },
  {
    slug: "password-manager-extension-blocked-by-browser-policy",
    title: "Password Manager Extension Blocked by Browser Policy",
    description:
      "Troubleshoot cases where enterprise browser policy blocks password manager extensions and restore approved configuration safely.",
    category: "Browsers",
    productFamily: "Browser",
    product: "Chrome / Edge Extension Policies",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["1password", "browser-policy", "extension-blocked", "chrome", "edge", "security-policy"],
    symptoms: [
      "Users cannot install or enable approved password manager extensions.",
      "Extension is installed but marked blocked by organization policy.",
      "Behavior differs between managed and unmanaged browser profiles."
    ],
    causes: [
      "Extension allow/blocklist policy changed in enterprise browser management.",
      "Extension store ID/version mismatch in policy definition.",
      "Profile is not receiving latest management policy sync."
    ],
    remediations: [
      "Capture policy-block message, extension ID, and browser version.",
      "Confirm device/profile is enrolled in expected browser management scope.",
      "Validate allowlist entry for approved extension ID and update channel.",
      "Retest after policy refresh using managed profile only."
    ],
    escalationCriteria: [
      "Policy update is required in centralized browser management.",
      "Approved extension is blocked across large user groups.",
      "Request involves bypassing security policy enforcement."
    ],
    commands: [
      {
        title: "Inspect applied browser policies",
        shell: "CLI",
        content:
          "# Chrome\n# Open chrome://policy and export screenshot/evidence\n\n# Edge\n# Open edge://policy and export screenshot/evidence"
      }
    ]
  },
  {
    slug: "vpn-kill-switch-blocking-teams-outlook",
    title: "VPN Kill Switch Blocking Teams / Outlook Traffic",
    description:
      "Handle VPN kill-switch behavior that blocks Microsoft collaboration apps after tunnel drops, while preserving secure remote-access controls.",
    category: "Networking / VPN",
    productFamily: "Networking",
    product: "Corporate VPN",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["vpn", "kill-switch", "teams", "outlook", "remote-work", "network"],
    symptoms: [
      "Teams and Outlook disconnect immediately when VPN reconnects or drops.",
      "Network returns only after VPN client restart.",
      "Issue is more common during unstable home/public connectivity."
    ],
    causes: [
      "Kill-switch policy blocks all traffic until tunnel recovers fully.",
      "VPN client service state remains partially disconnected after reconnect.",
      "DNS/route state is not restored correctly when tunnel flaps."
    ],
    remediations: [
      "Capture exact timing of tunnel drop/reconnect and affected apps.",
      "Reconnect VPN using approved workflow and retest app connectivity.",
      "Collect route/DNS state while failure is active for network support.",
      "Do not disable kill-switch protections outside approved security policy."
    ],
    escalationCriteria: [
      "Kill-switch behavior disrupts many users on same VPN profile/client version.",
      "Temporary policy tuning is needed for business-critical collaboration traffic.",
      "Users request disabling secure tunnel enforcement permanently."
    ]
  },
  {
    slug: "vpn-connected-saas-apps-blocked-ip-reputation-geo",
    title: "VPN Connected but SaaS Apps Blocked (IP Reputation / Geo Policy)",
    description:
      "Troubleshoot SaaS sign-in or access blocks when traffic exits via VPN egress ranges flagged by IP reputation or geolocation controls.",
    category: "Networking / VPN",
    productFamily: "Networking",
    product: "Corporate VPN",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["vpn", "saas", "ip-reputation", "geolocation", "access-block", "privacy"],
    symptoms: [
      "SaaS applications reject login while VPN is active but work off VPN.",
      "Users see unusual location/risk alerts during authentication.",
      "Specific apps fail while others continue to work."
    ],
    causes: [
      "SaaS risk engines flag shared VPN egress IP ranges.",
      "Geolocation-based policy blocks current VPN exit region.",
      "Conditional access/trust policy mismatch between SaaS and VPN routing."
    ],
    remediations: [
      "Capture blocked app, error text, timestamp, and apparent sign-in location.",
      "Compare behavior on approved alternate egress profile if available.",
      "Coordinate with SaaS admin to validate trusted IP/location configuration.",
      "Avoid routing around corporate policy via unauthorized personal tunnels."
    ],
    escalationCriteria: [
      "Multiple users are blocked in the same region/egress profile.",
      "SaaS trust policy needs updates for approved enterprise egress ranges.",
      "Security review is required due to high-risk sign-in detections."
    ]
  },
  {
    slug: "public-wifi-safe-remote-work-connectivity-checklist",
    title: "Public Wi-Fi Safe Remote Work Connectivity Checklist",
    description:
      "Use a security-first checklist for working on public Wi-Fi with enterprise policy compliance, safe VPN usage, and escalation boundaries.",
    category: "Networking / VPN",
    productFamily: "Networking",
    product: "Remote Work Connectivity",
    environment: "Both",
    severity: "Medium",
    tags: ["public-wifi", "remote-work", "vpn", "privacy", "security", "travel", "network"],
    symptoms: [
      "User reports unstable access to corporate apps on hotel/airport/cafe Wi-Fi.",
      "Session drops and re-auth prompts occur frequently.",
      "User asks for quick workarounds that may reduce security posture."
    ],
    causes: [
      "High-latency and captive-portal behavior on untrusted networks.",
      "Interference/content filtering on public Wi-Fi path.",
      "VPN tunnel instability during roaming between networks."
    ],
    remediations: [
      "Verify captive portal is completed before starting corporate app sessions.",
      "Use approved VPN profile and confirm policy-required security agents are active.",
      "Prefer trusted tether/hotspot fallback only if allowed by company policy.",
      "Capture timing/location evidence when recurring failures require escalation."
    ],
    escalationCriteria: [
      "Frequent connectivity failures affect executive/traveling teams.",
      "Public-network issues expose repeated security risk prompts or lockouts.",
      "Users request bypassing MFA, VPN, or endpoint controls for convenience."
    ]
  },
  {
    slug: "endpoint-security-false-positive-blocking-business-app",
    title: "Endpoint Security False Positive Blocking Business App",
    description:
      "Triage endpoint protection false positives that block approved applications without disabling enterprise security controls.",
    category: "Windows",
    productFamily: "Windows",
    product: "Endpoint Protection",
    environment: "Windows",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["malwarebytes", "false-positive", "endpoint", "security", "threat", "application-block"],
    symptoms: [
      "Approved business app is quarantined or blocked at launch.",
      "Alert appears after definition update or policy change.",
      "Users cannot complete business workflow due to block action."
    ],
    causes: [
      "Detection signature flags a benign binary or installer component.",
      "Application update changed hash/signature and no longer matches allow rules.",
      "Policy is too strict for current app behavior."
    ],
    remediations: [
      "Capture detection name, file path/hash, and policy version from endpoint logs.",
      "Validate the app package source and publisher signature before exception review.",
      "Use controlled allowlist/exception process with security-team approval.",
      "Re-test after policy/signature update and remove temporary exceptions when possible."
    ],
    escalationCriteria: [
      "False positive impacts multiple users or critical business applications.",
      "Potential true-positive uncertainty requires incident triage before restoration.",
      "Exception request affects sensitive/high-risk execution paths."
    ]
  },
  {
    slug: "endpoint-security-agent-high-cpu-after-update",
    title: "Endpoint Security Agent High CPU After Update",
    description:
      "Diagnose sustained high CPU from endpoint security agents after updates using safe evidence collection and security-team escalation workflow.",
    category: "Windows",
    productFamily: "Windows",
    product: "Endpoint Security Agent",
    environment: "Windows",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["malwarebytes", "endpoint", "high-cpu", "security-agent", "performance", "windows"],
    symptoms: [
      "CPU usage remains high for extended periods after security update.",
      "Device becomes sluggish and user productivity drops.",
      "Issue may affect a cohort on same agent/signature version."
    ],
    causes: [
      "Post-update scanning backlog or repeated scan loop.",
      "Conflict between agent module and specific application workload.",
      "Corrupt local cache/signature state."
    ],
    remediations: [
      "Capture process CPU trend, agent version, and definition/signature timestamp.",
      "Confirm whether CPU stabilizes after expected initial scan window.",
      "Collect agent logs using approved support workflow.",
      "Escalate to endpoint security team for policy/module tuning."
    ],
    escalationCriteria: [
      "Sustained impact affects many devices after same update rollout.",
      "High CPU is accompanied by app crashes or endpoint instability.",
      "Any fix would require disabling core protection modules."
    ]
  },
  {
    slug: "ransomware-safe-onedrive-sharepoint-file-recovery",
    title: "Ransomware-Safe OneDrive / SharePoint File Recovery",
    description:
      "Execute safe Microsoft 365 recovery steps for suspicious encryption or mass-file changes without violating incident-response policy.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "OneDrive / SharePoint Recovery",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "20-45 min",
    tags: ["ransomware", "onedrive", "sharepoint", "recovery", "version-history", "security"],
    symptoms: [
      "Large sets of files are renamed/encrypted unexpectedly.",
      "Users report inaccessible content after suspicious activity.",
      "Cloud sync propagates unwanted file changes quickly."
    ],
    causes: [
      "Compromised endpoint or account performed bulk malicious file operations.",
      "Unintended automation/script changed many files.",
      "Recovery window is shrinking as sync propagates."
    ],
    remediations: [
      "Initiate security incident process before broad restoration actions.",
      "Contain impacted account/device per security-team instructions.",
      "Use Microsoft 365 version history/restore features through approved admin workflow.",
      "Validate restored data integrity with content owners before closing incident."
    ],
    escalationCriteria: [
      "Active compromise indicators are present.",
      "Recovery involves privileged/legal/regulatory content.",
      "Cross-tenant or multi-site impact requires formal incident command."
    ]
  },
  {
    slug: "usb-c-dock-dual-monitors-not-detected-windows-macos",
    title: "USB-C Dock Dual Monitors Not Detected (Windows / macOS)",
    description:
      "Troubleshoot dual-display detection failures on managed dock setups with safe cable, firmware, and display path validation.",
    category: "AV / Conference Rooms",
    productFamily: "AV",
    product: "USB-C Docking Station",
    environment: "Both",
    severity: "Medium",
    tags: ["dock", "dual-monitor", "usb-c", "displayport", "hdmi", "adapter"],
    symptoms: [
      "Only one external monitor is detected through dock.",
      "Displays work when connected directly but not via dock.",
      "Issue appears after OS/dock firmware updates or cable swaps."
    ],
    causes: [
      "Unsupported cable/adapter combination or bandwidth limitation.",
      "Dock firmware/driver mismatch after updates.",
      "Display arrangement settings or refresh-rate limits not supported."
    ],
    remediations: [
      "Document dock model, monitor models, cable types, and port mapping.",
      "Test known-good cables and certified adapter path from support inventory.",
      "Validate display settings/resolution-refresh combinations on both monitors.",
      "Escalate for firmware/driver package review if issue persists."
    ],
    escalationCriteria: [
      "Same dock model fails across multiple users after update rollout.",
      "Firmware rollback/update requires endpoint engineering approval.",
      "Users request unsupported daisy-chain or adapter bypass configurations."
    ]
  },
  {
    slug: "teams-usb-headset-microphone-not-detected-after-sleep",
    title: "Teams USB Headset/Microphone Not Detected After Sleep",
    description:
      "Fix post-sleep USB audio device detection issues in Teams using safe endpoint and app-level checks before driver changes.",
    category: "Microsoft 365",
    productFamily: "Microsoft",
    product: "Microsoft Teams",
    environment: "Both",
    severity: "Medium",
    tags: ["teams", "usb", "headset", "microphone", "audio", "sleep-wake"],
    symptoms: [
      "Headset works before sleep but Teams cannot detect it after wake.",
      "Microphone appears in OS settings but not in Teams device list.",
      "Replugging headset temporarily restores function."
    ],
    causes: [
      "USB audio endpoint is not re-enumerated cleanly after sleep/wake.",
      "Teams retains stale audio device reference.",
      "Dock/port power state causes intermittent endpoint availability."
    ],
    remediations: [
      "Reconnect headset and relaunch Teams to refresh device enumeration.",
      "Confirm default input/output device in OS and in Teams settings.",
      "Test direct USB connection versus dock path for isolation.",
      "Collect device model and reproducible steps for support escalation."
    ],
    escalationCriteria: [
      "Issue affects many users with the same headset or dock model.",
      "Driver/firmware update is required and needs admin packaging.",
      "Business-critical meeting workflows are repeatedly disrupted."
    ]
  },
  {
    slug: "home-office-ups-sizing-runtime-planning",
    title: "Home Office UPS Sizing and Runtime Planning",
    description:
      "Plan UPS capacity for remote-work setups to reduce outage-related disruptions while preserving safe shutdown and data-protection practices.",
    category: "Windows",
    productFamily: "Windows",
    product: "UPS Power Backup",
    environment: "Both",
    severity: "Low",
    tags: ["ups", "backup-power", "remote-work", "surge-protection", "runtime", "home-office"],
    symptoms: [
      "Brief power events interrupt calls, VPN sessions, or unsaved work.",
      "Users are unsure which devices to place on UPS battery outlets.",
      "Runtime is shorter than expected during outages."
    ],
    causes: [
      "UPS watt/VA rating is too small for actual load.",
      "Non-critical peripherals consume battery output.",
      "Battery health degraded and replacement cycle missed."
    ],
    remediations: [
      "Inventory essential load (laptop/dock/monitor/router) and estimate total watt draw.",
      "Prioritize critical devices on battery-backed outlets; move non-critical devices to surge-only.",
      "Test graceful shutdown runtime periodically and document baseline.",
      "Replace aged batteries per manufacturer guidance and enterprise safety policy."
    ],
    escalationCriteria: [
      "Frequent outages impact regulated workflows and require continuity planning.",
      "Electrical safety concerns are identified in home-office setup.",
      "Team-wide hardware standardization for remote resilience is requested."
    ]
  },
  {
    slug: "premiere-pro-scratch-disk-full-export-fails-managed-device",
    title: "Premiere Pro Scratch Disk Full / Export Fails (Managed Device)",
    description:
      "Resolve Premiere Pro scratch-disk and export failures using safe storage triage on managed endpoints before deleting project data.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Premiere Pro",
    environment: "Both",
    severity: "Medium",
    tags: ["adobe", "premiere-pro", "scratch-disk", "export-fail", "storage", "creative-cloud"],
    symptoms: [
      "Exports fail with low disk/scratch error messages.",
      "Timeline performance drops sharply near export time.",
      "Premiere reports insufficient space despite free disk capacity elsewhere."
    ],
    causes: [
      "Scratch/cache location points to constrained system volume.",
      "Media cache growth consumed available local storage.",
      "Temporary export path is blocked by permissions or endpoint policy."
    ],
    remediations: [
      "Capture current scratch disk path and available free space per volume.",
      "Use approved media-cache cleanup workflow and retest short export sample.",
      "Move scratch/export destination to approved high-capacity local volume.",
      "Avoid deleting source media/project files without owner confirmation."
    ],
    escalationCriteria: [
      "Storage constraints affect multiple creative users on same device profile.",
      "Endpoint storage policy blocks required cache/export operations.",
      "Device workload sizing no longer meets creative team requirements."
    ]
  },
  {
    slug: "after-effects-disk-cache-growth-storage-pressure",
    title: "After Effects Disk Cache Growth Causing Storage Pressure",
    description:
      "Troubleshoot After Effects disk-cache growth safely on enterprise-managed devices to restore performance without data-loss risk.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe After Effects",
    environment: "Both",
    severity: "Medium",
    tags: ["adobe", "after-effects", "disk-cache", "storage", "performance", "render"],
    symptoms: [
      "After Effects performance degrades as cache size grows.",
      "System storage fills quickly during renders/previews.",
      "Projects fail to preview/render due to low free space."
    ],
    causes: [
      "Disk cache location is too small for project workload.",
      "Cache cleanup policy not applied regularly.",
      "Concurrent creative apps consume shared storage pool."
    ],
    remediations: [
      "Review current cache settings and location against approved standards.",
      "Clear disk cache using app controls and verify free-space recovery.",
      "Set cache size/location to enterprise-approved capacity target.",
      "Coordinate with user on long-term project storage hygiene."
    ],
    escalationCriteria: [
      "Creative fleet devices repeatedly exceed local storage limits.",
      "Policy changes are required for cache location or device profile.",
      "Potential data-loss risk exists due to aggressive manual cleanup attempts."
    ]
  },
  {
    slug: "phishing-link-clicked-immediate-containment-checklist",
    title: "Phishing Link Clicked: Immediate Containment Checklist",
    description:
      "Provide an enterprise-safe immediate response checklist when a user clicks a suspected phishing link, without deleting forensic evidence or bypassing incident policy.",
    category: "Identity / MFA / SSO",
    productFamily: "Okta",
    product: "Security Incident Triage",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    estimatedTime: "10-20 min",
    tags: ["phishing", "security", "incident-response", "credential", "mfa", "containment"],
    symptoms: [
      "User clicked a suspicious URL received by email or chat.",
      "Unexpected credential prompt or MFA push appears after click.",
      "Browser redirects to unknown domains or fake sign-in pages."
    ],
    causes: [
      "Credential-harvesting or token-theft phishing campaign.",
      "Malicious redirect site mimicking corporate sign-in flow.",
      "User session/cookie capture attempt."
    ],
    remediations: [
      "Stop active interaction with suspicious page and capture URL/screenshot for evidence.",
      "Initiate security incident process and follow approved containment guidance immediately.",
      "Have user change password via approved portal and invalidate sessions through identity admin workflow.",
      "Run managed endpoint security checks and review mailbox sign-in activity with security team."
    ],
    escalationCriteria: [
      "Credential entry or MFA approval may have occurred on suspicious site.",
      "Privileged account or sensitive system access is involved.",
      "Multiple users report similar phishing pattern within a short window."
    ]
  },
  {
    slug: "browser-password-breach-warning-corporate-account",
    title: "Browser Password Breach Warning for Corporate Account",
    description:
      "Handle browser leak warnings for corporate credentials using identity-safe reset workflow and managed password policy compliance.",
    category: "Browsers",
    productFamily: "Browser",
    product: "Chrome / Edge Password Security",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["password", "breach-warning", "chrome", "edge", "identity", "security"],
    symptoms: [
      "Browser warns that a saved corporate password was found in a data breach.",
      "User stored corporate credentials in browser profile unexpectedly.",
      "Repeated warning appears after password changes."
    ],
    causes: [
      "Credential reused on external site that was breached.",
      "Outdated password still stored in browser/extension vault.",
      "Compromised credential pair remains active in one account path."
    ],
    remediations: [
      "Force password reset using approved corporate identity flow and MFA confirmation.",
      "Remove old leaked credential from unmanaged browser store and confirm approved vault usage.",
      "Review recent sign-in activity for risky sessions and revoke as needed.",
      "Educate user on approved credential storage standards for enterprise accounts."
    ],
    escalationCriteria: [
      "Suspicious sign-ins or impossible-travel alerts are present.",
      "Leaked credential belongs to privileged/admin account.",
      "Potential compromise spans multiple identities or shared accounts."
    ]
  },
  {
    slug: "secure-home-router-for-remote-work-connectivity",
    title: "Secure Home Router Baseline for Remote Work Connectivity",
    description:
      "Set a safe baseline for home router configuration to improve remote-work stability without weakening enterprise security requirements.",
    category: "Networking / VPN",
    productFamily: "Networking",
    product: "Home Router / Wi-Fi",
    environment: "Both",
    severity: "Medium",
    tags: ["router", "home-wifi", "remote-work", "vpn", "security", "network"],
    symptoms: [
      "Remote workers report recurring VPN drops or unstable call quality at home.",
      "Wi-Fi dead zones or interference affect business app reliability.",
      "Users ask for ad-hoc fixes that reduce security posture."
    ],
    causes: [
      "Outdated firmware or unstable router hardware.",
      "Crowded channels/interference from nearby networks.",
      "Home network misconfiguration causing packet loss or DNS instability."
    ],
    remediations: [
      "Update router firmware through vendor-approved UI and reboot during maintenance window.",
      "Use WPA2/WPA3, strong admin credentials, and disable unnecessary remote administration.",
      "Place critical work devices on 5 GHz where signal quality supports it and optimize channel selection.",
      "Retest VPN and collaboration app quality after baseline improvements."
    ],
    escalationCriteria: [
      "Business-critical users remain unstable after baseline changes.",
      "Home environment requires enterprise networking support program guidance.",
      "User requests disabling VPN or endpoint protections to improve connectivity."
    ]
  },
  {
    slug: "conference-room-usb-camera-flicker-freeze-teams-zoom",
    title: "Conference Room USB Camera Flicker/Freeze (Teams/Zoom)",
    description:
      "Troubleshoot conference-room camera instability using safe AV path checks, cable validation, and firmware/version evidence collection.",
    category: "AV / Conference Rooms",
    productFamily: "AV",
    product: "Conference Room USB Camera",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["conference-room", "camera", "usb", "teams", "zoom", "av"],
    symptoms: [
      "Camera feed flickers, freezes, or drops during meetings.",
      "Issue appears only at specific resolutions/frame rates.",
      "Camera is detected by OS but unstable in meeting app."
    ],
    causes: [
      "USB bandwidth/power instability in room device chain.",
      "Cable quality or hub/dock path causing signal degradation.",
      "Firmware/driver mismatch after endpoint or camera update."
    ],
    remediations: [
      "Capture room hardware chain (camera, hub/dock, cables, host device) and app version.",
      "Test known-good direct connection path and certified cable set.",
      "Lower meeting resolution/frame rate temporarily to validate bandwidth constraint hypothesis.",
      "Coordinate firmware/driver validation via approved AV support workflow."
    ],
    escalationCriteria: [
      "Multiple rooms with same camera model fail after update.",
      "Firmware rollback/update requires managed AV change control.",
      "Critical executive/client-facing meeting rooms are impacted."
    ]
  },
  {
    slug: "docking-station-ethernet-not-detected-after-reboot",
    title: "Docking Station Ethernet Not Detected After Reboot",
    description:
      "Troubleshoot missing wired Ethernet adapters on docked endpoints after reboot using safe adapter-state and firmware checks.",
    category: "Windows",
    productFamily: "Windows",
    product: "USB-C Dock Ethernet Adapter",
    environment: "Windows",
    severity: "Medium",
    tags: ["dock", "ethernet", "usb-c", "adapter", "network", "windows"],
    symptoms: [
      "Wired connection does not appear after reboot while dock is connected.",
      "Wi-Fi works but LAN adapter is missing/intermittent.",
      "Unplug/replug temporarily restores Ethernet."
    ],
    causes: [
      "Dock Ethernet adapter not enumerated correctly during startup.",
      "Power management or driver state issue for USB network device.",
      "Dock firmware and endpoint driver mismatch."
    ],
    remediations: [
      "Verify adapter presence in Device Manager and network settings immediately after reboot.",
      "Test with known-good dock cable/port and direct host connection path.",
      "Collect adapter hardware IDs and driver versions for endpoint engineering.",
      "Apply approved firmware/driver package updates and retest boot cycle."
    ],
    escalationCriteria: [
      "Issue affects multiple users sharing same dock model/firmware.",
      "Driver packaging update is required across managed fleet.",
      "Workaround requires unsupported device manager changes."
    ],
    commands: [
      {
        title: "Inspect network adapter state after reboot",
        shell: "PowerShell",
        content: "Get-NetAdapter | Select-Object Name, Status, LinkSpeed, InterfaceDescription"
      }
    ]
  },
  {
    slug: "teams-meeting-echo-audio-feedback-conference-room",
    title: "Teams Meeting Echo/Audio Feedback in Conference Room",
    description:
      "Resolve persistent room echo and feedback loops with safe mic/speaker path isolation and AV configuration checks.",
    category: "AV / Conference Rooms",
    productFamily: "AV",
    product: "Microsoft Teams Rooms Audio",
    environment: "Both",
    severity: "Medium",
    tags: ["teams", "conference-room", "echo", "feedback", "microphone", "speaker"],
    symptoms: [
      "Participants hear echo or delayed audio feedback from room endpoint.",
      "Issue increases when room volume is raised.",
      "Only some rooms or device combinations are affected."
    ],
    causes: [
      "Microphone pickup overlaps room speaker output path.",
      "Duplicate audio devices active in meeting app settings.",
      "Room DSP or echo-cancellation configuration mismatch."
    ],
    remediations: [
      "Confirm selected meeting-room microphone and speaker pair in app settings.",
      "Reduce speaker gain and test with single known-good mic array path.",
      "Check room audio processing/echo-cancellation profile against standard template.",
      "Document room ID, device chain, and reproducible test call results."
    ],
    escalationCriteria: [
      "Same room profile fails across recurring meetings.",
      "DSP/room controller configuration updates are required.",
      "Executive or client-briefing rooms are affected."
    ]
  },
  {
    slug: "remote-worker-webcam-image-quality-low-light-noise",
    title: "Remote Worker Webcam Quality Poor in Low Light",
    description:
      "Improve webcam clarity for remote calls using safe lighting, positioning, and supported device settings without bypassing policy controls.",
    category: "AV / Conference Rooms",
    productFamily: "AV",
    product: "USB Webcam",
    environment: "Both",
    severity: "Low",
    tags: ["webcam", "video-quality", "low-light", "remote-work", "meetings", "usb"],
    symptoms: [
      "Video appears noisy, grainy, or blurry in meetings.",
      "Auto-exposure continuously hunts/flickers in darker rooms.",
      "Quality differs significantly between users despite same app."
    ],
    causes: [
      "Insufficient front-facing lighting and webcam placement.",
      "Unsupported resolution/frame-rate settings for current bandwidth.",
      "Older webcam hardware with low-light limitations."
    ],
    remediations: [
      "Position a neutral front light source and avoid bright backlighting behind the user.",
      "Use supported resolution settings appropriate for network conditions.",
      "Validate USB bandwidth path and avoid unstable hubs for camera connection.",
      "Recommend approved webcam hardware upgrades when baseline quality remains poor."
    ],
    escalationCriteria: [
      "Meeting quality affects client-facing communication standards.",
      "Standardized hardware refresh guidance is needed for remote teams.",
      "Users request unsupported third-party virtual camera software."
    ]
  },
  {
    slug: "acrobat-pdf-too-large-for-email-or-upload-safe-reduction",
    title: "Acrobat PDF Too Large for Email/Upload (Safe Reduction)",
    description:
      "Reduce oversized PDFs safely for business sharing while preserving required quality, metadata, and compliance requirements.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Acrobat",
    environment: "Both",
    severity: "Low",
    tags: ["adobe", "acrobat", "pdf", "optimize", "compression", "upload"],
    symptoms: [
      "PDF cannot be emailed or uploaded due to size limits.",
      "Users manually downsample in ways that hurt required readability.",
      "Repeated 413/attachment-limit errors occur on standard workflows."
    ],
    causes: [
      "High-resolution embedded images and duplicate resources.",
      "Scanned PDFs saved without optimization.",
      "Unnecessary metadata/attachments inflate file size."
    ],
    remediations: [
      "Use Acrobat's optimization workflow with a documented quality baseline.",
      "Target only non-critical image compression to preserve business readability.",
      "Verify resulting file opens correctly and required content remains intact.",
      "Use approved enterprise sharing channel for files that must remain high fidelity."
    ],
    escalationCriteria: [
      "Compression would violate legal/regulatory document fidelity requirements.",
      "Business process repeatedly exceeds platform attachment limits and needs redesign.",
      "Sensitive documents require approved DLP-aware transfer route."
    ]
  },
  {
    slug: "creative-cloud-desktop-update-stuck-download-loop",
    title: "Creative Cloud Desktop Update Stuck or Download Loop",
    description:
      "Troubleshoot recurring Creative Cloud app update loops in managed environments using safe cache and network checks.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Creative Cloud",
    environment: "Both",
    severity: "Medium",
    tags: ["adobe", "creative-cloud", "update", "download-loop", "install", "cache"],
    symptoms: [
      "Update progress stalls or restarts repeatedly in Creative Cloud Desktop.",
      "App version does not change after 'successful' update.",
      "Issue recurs after reboot/sign-out."
    ],
    causes: [
      "Corrupt local update cache or package state.",
      "Proxy/content filtering interrupting download segments.",
      "Managed package/channel mismatch in software distribution."
    ],
    remediations: [
      "Capture app version, update target version, and exact error text.",
      "Run approved Creative Cloud cache cleanup workflow and retry update.",
      "Validate network path/proxy access to Adobe update endpoints.",
      "Escalate if package channel assignment in endpoint management is inconsistent."
    ],
    escalationCriteria: [
      "Update loops affect multiple users in same deployment ring.",
      "Packaging team intervention is required for managed app channel fix.",
      "Users request manual installer bypass outside approved process."
    ]
  },
  {
    slug: "figma-desktop-high-memory-usage-large-design-files",
    title: "Figma Desktop High Memory Usage on Large Design Files",
    description:
      "Triage Figma desktop memory pressure on complex files using safe project-scope and workstation checks before invasive resets.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma Desktop App",
    environment: "Both",
    severity: "Medium",
    tags: ["figma", "memory", "performance", "large-files", "desktop-app", "design-system"],
    symptoms: [
      "Figma desktop consumes high RAM and becomes unresponsive on large files.",
      "Performance degrades after prolonged editing sessions.",
      "Issue is worst on files with many components/pages/assets."
    ],
    causes: [
      "Large file complexity and excessive component/instance nesting.",
      "Limited endpoint memory resources for current workload.",
      "Background apps competing for RAM on creative workstation."
    ],
    remediations: [
      "Capture file scope metrics (pages/components/assets) and workstation specs.",
      "Split very large files into logical modules where collaboration model permits.",
      "Close non-essential high-memory apps before long editing sessions.",
      "Coordinate with design ops for file-architecture best practices."
    ],
    escalationCriteria: [
      "High-memory impact affects many designers on standard hardware profile.",
      "Workstation tier no longer matches workload requirements.",
      "Potential data-loss risk from repeated app crashes."
    ]
  },
  {
    slug: "figma-fonts-missing-on-vdi-or-shared-workstations",
    title: "Figma Fonts Missing on VDI or Shared Workstations",
    description:
      "Troubleshoot missing Figma fonts in virtual or shared enterprise environments while maintaining approved font licensing and deployment policy.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma Fonts",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["figma", "fonts", "vdi", "shared-workstation", "permissions", "licensing"],
    symptoms: [
      "Design files show missing fonts on VDI or shared desktops.",
      "Fonts appear on local machine but not virtual session.",
      "Substituted fonts break layout consistency."
    ],
    causes: [
      "Font service/agent not installed or blocked in virtual environment.",
      "User permission scope for licensed fonts is incomplete.",
      "Session isolation/profile reset removes expected local font state."
    ],
    remediations: [
      "Confirm whether missing fonts are custom, licensed, or enterprise-standard sets.",
      "Validate font service/agent state in VDI image and user session scope.",
      "Align font deployment with licensing and endpoint management policy.",
      "Reopen affected file after font sync and verify component layout integrity."
    ],
    escalationCriteria: [
      "Licensed font entitlement conflicts require vendor/admin review.",
      "VDI base image changes are needed across shared workstation pool.",
      "Design-critical brand assets are blocked by unresolved font availability."
    ]
  },
  {
    slug: "windows-external-ssd-not-detected-usb-c-thunderbolt",
    title: "Windows External SSD Not Detected (USB-C / Thunderbolt)",
    description:
      "Troubleshoot missing external SSD detection on managed Windows devices using safe cable, power, and storage-state checks before formatting actions.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows External Storage",
    environment: "Windows",
    severity: "Medium",
    tags: ["windows", "external-ssd", "usb-c", "thunderbolt", "storage", "adapter"],
    symptoms: [
      "External SSD powers on but does not appear in File Explorer.",
      "Drive appears intermittently after reconnecting cable or dock.",
      "Device is visible in one USB port but not another."
    ],
    causes: [
      "Cable/adapter power delivery or data path limitation.",
      "Driver/firmware mismatch for USB/TB controller.",
      "Disk is offline or missing drive letter assignment."
    ],
    remediations: [
      "Test with known-good cable and direct host connection (no dock) for isolation.",
      "Check Disk Management for offline/unlettered volumes before any partition changes.",
      "Confirm approved controller/firmware and storage driver state.",
      "Avoid formatting or initializing unknown disks until data-ownership is confirmed."
    ],
    escalationCriteria: [
      "Potential data-loss risk exists on business-critical removable storage.",
      "Controller firmware/package update is required across endpoint fleet.",
      "Drive hardware failure is suspected and forensic handling may be needed."
    ],
    commands: [
      {
        title: "Inspect external disk and USB controller state",
        shell: "PowerShell",
        content:
          "Get-Disk | Select-Object Number,FriendlyName,OperationalStatus,PartitionStyle,IsOffline\nGet-PnpDevice -Class DiskDrive,USB | Select-Object Status,Class,FriendlyName"
      }
    ]
  },
  {
    slug: "windows-bluetooth-headset-handsfree-low-audio-quality",
    title: "Windows Bluetooth Headset Stuck in Hands-Free Low Quality Mode",
    description:
      "Fix Windows Bluetooth headset quality degradation in meeting apps while preserving approved audio-device and endpoint security settings.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows Bluetooth Audio",
    environment: "Windows",
    severity: "Low",
    tags: ["windows", "bluetooth", "headset", "audio-quality", "hands-free", "meetings"],
    symptoms: [
      "Audio quality drops to narrowband/robotic during calls.",
      "Headset profile switches unexpectedly between stereo and hands-free.",
      "Issue appears mostly in Teams/Zoom calls."
    ],
    causes: [
      "Hands-free telephony profile forced as default output path.",
      "Multiple audio endpoints selected inconsistently across apps/OS.",
      "Bluetooth interference or outdated adapter/headset firmware."
    ],
    remediations: [
      "Confirm app and OS are using intended Bluetooth input/output endpoints.",
      "Disable unused duplicate audio profiles in endpoint settings where policy allows.",
      "Test wired or USB dongle path to isolate Bluetooth transport limits.",
      "Capture headset model/firmware and adapter details for support baseline."
    ],
    escalationCriteria: [
      "Issue affects broad headset model cohort after update rollout.",
      "Driver/firmware package update requires endpoint engineering deployment.",
      "Critical conferencing workflows are repeatedly impacted."
    ]
  },
  {
    slug: "windows-webcam-not-detected-after-quality-update",
    title: "Windows Webcam Not Detected After Quality Update",
    description:
      "Troubleshoot webcam disappearance after Windows updates using safe privacy, driver, and hardware path checks before rollback requests.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows Camera Devices",
    environment: "Windows",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["windows", "webcam", "camera", "update", "driver", "privacy"],
    symptoms: [
      "Meeting apps report camera not found after Windows update.",
      "Camera device is missing or disabled in Device Manager.",
      "Built-in camera fails while external USB camera works (or vice versa)."
    ],
    causes: [
      "Driver package replaced or disabled during update process.",
      "Camera privacy control toggled by policy or OS setting changes.",
      "Hardware enumeration issue on boot/dock chain."
    ],
    remediations: [
      "Validate camera privacy permissions in Windows settings and per app.",
      "Check Device Manager status and collect hardware/driver version details.",
      "Test camera in built-in Camera app and collaboration app for scope isolation.",
      "Escalate driver rollback/update only through approved endpoint packaging workflow."
    ],
    escalationCriteria: [
      "Same update build breaks camera on multiple endpoint models.",
      "Camera driver remediation requires managed package deployment.",
      "User requests unsupported local security/privacy control bypass."
    ]
  },
  {
    slug: "windows-multi-monitor-flicker-after-dock-firmware-update",
    title: "Windows Multi-Monitor Flicker After Dock Firmware Update",
    description:
      "Diagnose post-update display flicker on docked Windows setups using safe cable, refresh-rate, and firmware baseline checks.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows Multi-Monitor Display",
    environment: "Windows",
    severity: "Medium",
    tags: ["windows", "dock", "monitor", "flicker", "displayport", "firmware"],
    symptoms: [
      "External displays flicker or reconnect repeatedly while docked.",
      "Problem started after dock firmware or graphics driver updates.",
      "Flicker occurs only at higher resolution/refresh settings."
    ],
    causes: [
      "Dock firmware and GPU driver compatibility regression.",
      "Cable path bandwidth limitation for active display mode.",
      "Display timing negotiation instability after update."
    ],
    remediations: [
      "Capture dock firmware, GPU driver, monitor model, and cable type matrix.",
      "Test stable baseline resolution/refresh then reintroduce target mode incrementally.",
      "Swap to certified cables and avoid mixed adapter chains.",
      "Coordinate approved firmware/driver rollback or update through endpoint support."
    ],
    escalationCriteria: [
      "Issue affects many users on same dock firmware version.",
      "Rollback/change control approval is required for room/fleet stability.",
      "Executive or production-critical display workflows are impacted."
    ]
  },
  {
    slug: "windows-ethernet-poor-speed-negotiation-on-dock",
    title: "Windows Dock Ethernet Link Speed Negotiates Too Low",
    description:
      "Troubleshoot docked Ethernet links negotiating at low speed with safe NIC, cable, and switch-path diagnostics.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows Wired Networking",
    environment: "Windows",
    severity: "Medium",
    tags: ["windows", "ethernet", "dock", "link-speed", "network", "adapter"],
    symptoms: [
      "Dock Ethernet links at 100 Mbps instead of expected 1 Gbps.",
      "Large uploads/downloads are unusually slow when docked.",
      "Wi-Fi may perform better than wired unexpectedly."
    ],
    causes: [
      "Cable quality/damage or port mismatch on upstream switch/router.",
      "Dock NIC driver/firmware mismatch.",
      "Power management or speed/duplex negotiation issues."
    ],
    remediations: [
      "Capture negotiated speed, adapter model, and cable/port path.",
      "Test known-good Cat5e/Cat6 cable and alternate switch/router port.",
      "Validate approved dock NIC driver and disable problematic power-saving settings if runbook allows.",
      "Retest throughput after each controlled change."
    ],
    escalationCriteria: [
      "Low-speed negotiation affects many devices on same dock model.",
      "Network switch infrastructure issue is suspected.",
      "Driver/firmware packaging change is required for managed fleet."
    ],
    commands: [
      {
        title: "Check Ethernet negotiation and adapter details",
        shell: "PowerShell",
        content: "Get-NetAdapter | Select-Object Name,Status,LinkSpeed,InterfaceDescription"
      }
    ]
  },
  {
    slug: "windows-home-router-qos-for-teams-zoom-calls",
    title: "Windows Home Router QoS Baseline for Teams/Zoom Calls",
    description:
      "Set a policy-safe home-network baseline to improve call quality for remote Windows users without weakening enterprise controls.",
    category: "Windows",
    productFamily: "Windows",
    product: "Remote Work Call Quality",
    environment: "Windows",
    severity: "Low",
    tags: ["windows", "router", "qos", "teams", "zoom", "remote-work", "network"],
    symptoms: [
      "Calls degrade when household streaming/uploads are active.",
      "Meeting audio/video drops during peak home network usage.",
      "Users report frequent jitter and packet loss on Wi-Fi."
    ],
    causes: [
      "Home router lacks proper traffic prioritization for real-time media.",
      "Wi-Fi congestion/interference on primary work path.",
      "Background sync/backup traffic saturates upstream bandwidth."
    ],
    remediations: [
      "Use wired connection for primary workstation when feasible.",
      "Enable router QoS/media prioritization for conferencing traffic per vendor guidance.",
      "Schedule heavy backup/sync tasks outside critical meeting windows.",
      "Retest call stability and packet-loss metrics after changes."
    ],
    escalationCriteria: [
      "Critical users continue to fail call-quality standards after baseline tuning.",
      "Team-wide remote networking kit standardization is required.",
      "Users request bypassing VPN/security controls to improve call quality."
    ]
  },
  {
    slug: "macos-thunderbolt-dock-dual-display-flicker-after-update",
    title: "macOS Thunderbolt Dock Dual Display Flicker After Update",
    description:
      "Troubleshoot dual-display flicker on docked Macs after macOS/dock updates using safe path validation and AV baseline checks.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS Thunderbolt Docking",
    environment: "macOS",
    severity: "Medium",
    tags: ["macos", "thunderbolt", "dock", "dual-monitor", "flicker", "display"],
    symptoms: [
      "One or both external displays flicker or blank intermittently.",
      "Issue appears after macOS update or dock firmware revision.",
      "Flicker is worse at higher refresh/resolution modes."
    ],
    causes: [
      "Dock firmware/display controller compatibility change.",
      "Cable/adapter path bandwidth constraints.",
      "Display mode negotiation instability in current OS build."
    ],
    remediations: [
      "Capture Mac model/chipset, macOS build, dock firmware, and monitor mode details.",
      "Test direct monitor connection and certified cable set to isolate dock path.",
      "Apply conservative display mode baseline then increment toward target settings.",
      "Coordinate approved firmware/OS mitigation via endpoint engineering."
    ],
    escalationCriteria: [
      "Same dock/OS combination fails across multiple Mac models.",
      "Rollback or coordinated update campaign is required.",
      "Critical creative/executive display workflows are impacted."
    ]
  },
  {
    slug: "macos-external-ssd-not-mounting-after-macos-update",
    title: "macOS External SSD Not Mounting After macOS Update",
    description:
      "Diagnose external SSD mount failures post-update with safe disk-state checks before repair/erase actions.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS External Storage",
    environment: "macOS",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["macos", "external-ssd", "mount", "disk-utility", "usb-c", "thunderbolt"],
    symptoms: [
      "External SSD no longer mounts after macOS update.",
      "Drive appears in System Information but not Finder.",
      "Volume mounts read-only or fails with filesystem errors."
    ],
    causes: [
      "Filesystem metadata inconsistency after update/reconnect.",
      "USB/TB bridge compatibility issue with current OS build.",
      "Power/cable path limitations or enclosure firmware issue."
    ],
    remediations: [
      "Check disk visibility in Disk Utility and capture volume state before modification.",
      "Test alternate cable/port and direct connection path.",
      "Use read-only-safe verification workflow before any repair command.",
      "Escalate for data-protection handling when business-critical content is at risk."
    ],
    escalationCriteria: [
      "Disk may contain critical unrecovered project/business data.",
      "Repair steps could risk data integrity without validated backup.",
      "Multiple users with same enclosure model are impacted after OS update."
    ],
    commands: [
      {
        title: "Inspect disk and mount state",
        shell: "Terminal",
        content: "diskutil list\ndiskutil info /dev/disk2 2>/dev/null || true"
      }
    ]
  },
  {
    slug: "macos-bluetooth-headset-audio-stutter-in-meetings",
    title: "macOS Bluetooth Headset Audio Stutter in Meetings",
    description:
      "Resolve Bluetooth headset stutter/latency in Teams/Zoom on managed Macs using safe radio-path and endpoint checks.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS Bluetooth Audio",
    environment: "macOS",
    severity: "Low",
    tags: ["macos", "bluetooth", "headset", "audio", "teams", "zoom"],
    symptoms: [
      "Audio stutters or cuts out during calls using Bluetooth headset.",
      "Call quality improves when using wired/USB headset.",
      "Issue appears in specific office/home interference zones."
    ],
    causes: [
      "Bluetooth interference and weak radio path to headset.",
      "Concurrent high-bandwidth wireless peripherals on same band.",
      "Firmware mismatch in headset or macOS Bluetooth stack."
    ],
    remediations: [
      "Test with reduced interference (distance, fewer nearby wireless devices).",
      "Validate selected input/output endpoints in meeting app and macOS sound settings.",
      "Compare behavior with wired/USB audio to isolate Bluetooth path.",
      "Capture reproducible conditions and headset firmware details for support."
    ],
    escalationCriteria: [
      "Fleet-wide impact on a common headset model after OS update.",
      "Firmware rollout is needed through managed accessory support.",
      "Critical meeting workflows cannot rely on current audio path."
    ]
  },
  {
    slug: "macos-webcam-not-detected-teams-zoom-after-permission-reset",
    title: "macOS Webcam Not Detected in Teams/Zoom After Permission Reset",
    description:
      "Troubleshoot webcam detection failures after privacy permission changes while preserving macOS TCC security policy.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS Camera Permissions",
    environment: "macOS",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["macos", "webcam", "camera", "teams", "zoom", "privacy", "tcc"],
    symptoms: [
      "Meeting apps cannot access camera after settings or OS changes.",
      "Camera works in one app but not another.",
      "Camera permission prompt no longer appears when expected."
    ],
    causes: [
      "TCC privacy entry missing, stale, or managed by profile.",
      "App path/signature changed after update and old permission no longer applies.",
      "External camera enumeration conflict through dock/hub path."
    ],
    remediations: [
      "Review Privacy & Security camera permissions for affected apps.",
      "Fully quit/relaunch app after permission changes and retest.",
      "Test built-in camera vs external USB camera to isolate hardware path.",
      "Escalate TCC/profile remediation through managed endpoint process."
    ],
    escalationCriteria: [
      "Permission controls are locked by MDM and require policy update.",
      "Issue affects many managed Macs after app/OS rollout.",
      "Users request disabling privacy controls as workaround."
    ]
  },
  {
    slug: "macos-ethernet-usb-c-adapter-no-ip-after-sleep",
    title: "macOS USB-C Ethernet Adapter Gets No IP After Sleep/Wake",
    description:
      "Fix post-sleep wired networking failures on USB-C Ethernet adapters with safe interface and DHCP path checks.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS Wired Networking",
    environment: "macOS",
    severity: "Medium",
    tags: ["macos", "ethernet", "usb-c", "sleep-wake", "dhcp", "adapter"],
    symptoms: [
      "Ethernet adapter shows connected but no usable IP after wake.",
      "Replugging adapter restores network temporarily.",
      "Issue recurs after repeated sleep/wake cycles."
    ],
    causes: [
      "Adapter interface state stale after power transition.",
      "DHCP lease/renew process fails on wake.",
      "Adapter firmware or macOS driver interaction issue."
    ],
    remediations: [
      "Capture adapter status and IP assignment immediately after wake.",
      "Toggle network service and retest DHCP assignment.",
      "Test alternate adapter/cable path and direct host connection.",
      "Escalate for adapter firmware/driver standard review."
    ],
    escalationCriteria: [
      "Issue affects multiple users on same adapter model.",
      "Network infrastructure lease behavior requires engineering review.",
      "Managed hardware standard needs update for reliable wired connectivity."
    ],
    commands: [
      {
        title: "Check interface and IP state after wake",
        shell: "Terminal",
        content: "ifconfig | grep -A4 en\nipconfig getifaddr en5 2>/dev/null || true"
      }
    ]
  },
  {
    slug: "macos-battery-health-degradation-remote-work-lifecycle",
    title: "macOS Battery Health Degradation and Remote Work Lifecycle Planning",
    description:
      "Assess Mac battery wear and runtime decline with safe diagnostics to inform replacement planning and reduce meeting/work interruption risk.",
    category: "macOS",
    productFamily: "Apple",
    product: "Mac Battery Health",
    environment: "macOS",
    severity: "Low",
    tags: ["macos", "battery-health", "remote-work", "runtime", "lifecycle", "power"],
    symptoms: [
      "Mac battery drains quickly during normal remote-work usage.",
      "Unexpected shutdowns occur at moderate battery percentages.",
      "Users rely on constant charging and lose mobility during meetings."
    ],
    causes: [
      "Battery cycle count and health have reached service threshold.",
      "High sustained workload raises thermal and power draw.",
      "Aging battery no longer supports expected runtime profile."
    ],
    remediations: [
      "Capture battery health metrics and cycle count from system diagnostics.",
      "Validate workload and background process impact on runtime expectations.",
      "Recommend replacement planning when health is below support threshold.",
      "Pair with UPS/power continuity guidance for critical remote users."
    ],
    escalationCriteria: [
      "Battery health is below policy threshold for business continuity.",
      "Large cohort of same model shows accelerated battery decline.",
      "Hardware refresh/replacement approval is required."
    ],
    commands: [
      {
        title: "Battery condition and cycle diagnostics",
        shell: "Terminal",
        content: "system_profiler SPPowerDataType | grep -E \"Cycle Count|Condition|Maximum Capacity\""
      }
    ]
  },
  {
    slug: "macos-home-wifi-channel-interference-video-call-instability",
    title: "macOS Home Wi-Fi Channel Interference During Video Calls",
    description:
      "Troubleshoot macOS call instability caused by home Wi-Fi congestion/interference using safe channel and placement optimization guidance.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS Wi-Fi",
    environment: "macOS",
    severity: "Low",
    tags: ["macos", "wifi", "interference", "video-calls", "remote-work", "router"],
    symptoms: [
      "Video calls drop frames and freeze at predictable times.",
      "Latency spikes occur when nearby devices are active.",
      "Issue improves when moving closer to router."
    ],
    causes: [
      "Channel congestion in apartment/high-density environments.",
      "Weak signal due to router placement and physical barriers.",
      "Mixed legacy/high-throughput device contention on same band."
    ],
    remediations: [
      "Capture affected time windows, app behavior, and signal quality context.",
      "Prefer 5 GHz/6 GHz where supported and reposition workstation for stronger signal.",
      "Tune router channel selection via vendor-recommended settings.",
      "Use wired/mesh backhaul for persistent high-impact call reliability issues."
    ],
    escalationCriteria: [
      "Call quality remains below business threshold after baseline tuning.",
      "Remote-work kit upgrade recommendations are required for impacted roles.",
      "Users request insecure bypasses of enterprise VPN/security controls."
    ]
  },
  {
    slug: "windows-rdp-lag-over-home-network-vpn",
    title: "Windows RDP Lag Over Home Network + VPN",
    description:
      "Troubleshoot remote desktop latency and session stutter for Windows users on VPN/home networks using safe evidence collection and routing checks.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows Remote Desktop",
    environment: "Windows",
    severity: "Medium",
    tags: ["windows", "rdp", "latency", "vpn", "remote-work", "network"],
    symptoms: [
      "RDP session input lags, freezes, or has delayed screen refresh.",
      "Performance worsens during peak home network usage.",
      "Issue improves when switching network path."
    ],
    causes: [
      "High jitter/packet loss on home Wi-Fi path.",
      "VPN overhead and routing path congestion.",
      "Display quality settings exceed available network capacity."
    ],
    remediations: [
      "Capture latency/jitter on both local and VPN-active paths.",
      "Use wired connection where possible and reduce RDP visual effects for testing.",
      "Validate VPN profile behavior and compare with approved alternate profile if available.",
      "Attach reproducible timing and network metrics to escalation ticket."
    ],
    escalationCriteria: [
      "Multiple remote users on same VPN profile are impacted.",
      "Routing or egress congestion requires network engineering review.",
      "Business-critical remote operations are blocked by sustained latency."
    ],
    commands: [
      {
        title: "RDP path latency diagnostics",
        shell: "CMD",
        content: "ping -n 20 <rdp-hostname>\ntracert <rdp-hostname>"
      }
    ]
  },
  {
    slug: "windows-laptop-thermal-throttling-during-video-meetings",
    title: "Windows Laptop Thermal Throttling During Video Meetings",
    description:
      "Diagnose meeting-time performance drops caused by thermal throttling on managed Windows laptops with safe workload and hardware checks.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows Device Performance",
    environment: "Windows",
    severity: "Medium",
    tags: ["windows", "thermal", "throttling", "video-calls", "cooling", "performance"],
    symptoms: [
      "CPU frequency drops and call quality degrades during long meetings.",
      "Fan noise spikes and system responsiveness declines.",
      "Issue is more noticeable when camera/screen share is active."
    ],
    causes: [
      "Thermal limits reached under sustained conferencing workload.",
      "Blocked airflow, dust buildup, or high ambient temperature.",
      "Background processes increasing heat during calls."
    ],
    remediations: [
      "Collect CPU/temperature trend during call workload with approved monitoring tools.",
      "Improve ventilation and use stable desk placement (avoid soft surfaces).",
      "Close non-essential high-load apps before meetings.",
      "Escalate for hardware servicing or workload-tier upgrade planning."
    ],
    escalationCriteria: [
      "Thermal throttling is repeatable across same device model cohort.",
      "Hardware health concern requires device repair/replacement workflow.",
      "User role needs higher-performance endpoint standard."
    ]
  },
  {
    slug: "windows-usb-c-dock-not-charging-laptop-consistently",
    title: "Windows USB-C Dock Not Charging Laptop Consistently",
    description:
      "Troubleshoot intermittent dock charging issues on Windows laptops with safe power-path, firmware, and cable validation.",
    category: "Windows",
    productFamily: "Windows",
    product: "USB-C Dock Power Delivery",
    environment: "Windows",
    severity: "Medium",
    tags: ["windows", "usb-c", "dock", "charging", "power-delivery", "adapter"],
    symptoms: [
      "Laptop battery drains while docked.",
      "Charging state toggles on/off during normal use.",
      "Issue varies by cable or dock port."
    ],
    causes: [
      "Dock power budget is insufficient for current workload/peripherals.",
      "USB-C cable does not support required PD wattage.",
      "Dock/BIOS/firmware compatibility issue."
    ],
    remediations: [
      "Verify dock wattage requirements against laptop power demand profile.",
      "Use certified PD-capable cable and approved power adapter path.",
      "Reduce high-power peripherals temporarily to validate power-budget hypothesis.",
      "Capture firmware/BIOS versions for endpoint escalation."
    ],
    escalationCriteria: [
      "Charging instability affects same dock model across users.",
      "Firmware/BIOS update rollout is required.",
      "Power-path workaround would violate approved hardware standard."
    ]
  },
  {
    slug: "windows-nvme-free-space-pressure-onedrive-cache-growth",
    title: "Windows NVMe Free Space Pressure from Sync/Cache Growth",
    description:
      "Address low free-space issues on Windows NVMe drives caused by sync/cache growth using safe cleanup and storage planning.",
    category: "Windows",
    productFamily: "Windows",
    product: "Windows Storage Management",
    environment: "Windows",
    severity: "Medium",
    tags: ["windows", "nvme", "storage", "onedrive", "cache", "free-space"],
    symptoms: [
      "System drive fills rapidly and apps fail updates/exports.",
      "OneDrive/cache-heavy workflows consume unexpectedly large space.",
      "Performance degrades under low free-space conditions."
    ],
    causes: [
      "Large sync scope with local pinning behavior.",
      "Application cache/temp growth without rotation.",
      "Device storage tier undersized for workload."
    ],
    remediations: [
      "Capture largest directories and identify business-critical vs temporary data.",
      "Apply approved cache cleanup and OneDrive files-on-demand policy guidance.",
      "Move large non-critical local artifacts to approved storage locations.",
      "Plan endpoint storage tier upgrade when workload consistently exceeds baseline."
    ],
    escalationCriteria: [
      "Low-space condition impacts multiple users in same role profile.",
      "Policy tuning for sync/cache behavior is required.",
      "Data-loss risk exists if users attempt ad hoc deletions."
    ],
    commands: [
      {
        title: "Largest directories quick scan",
        shell: "PowerShell",
        content:
          "Get-ChildItem C:\\ -Directory -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName; (Get-ChildItem $_.FullName -Recurse -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum }"
      }
    ]
  },
  {
    slug: "macos-airpods-microphone-switching-between-devices-calls",
    title: "macOS AirPods Microphone Switching Between Devices During Calls",
    description:
      "Troubleshoot AirPods input switching across Apple devices during meetings while maintaining approved conferencing standards.",
    category: "macOS",
    productFamily: "Apple",
    product: "AirPods / macOS Audio",
    environment: "macOS",
    severity: "Low",
    tags: ["macos", "airpods", "microphone", "bluetooth", "teams", "zoom", "audio"],
    symptoms: [
      "Microphone input switches away from Mac during live call.",
      "Call participants hear dropouts or sudden volume changes.",
      "Issue occurs when iPhone/iPad nearby receives notifications/calls."
    ],
    causes: [
      "Automatic device switching behavior across Apple ecosystem.",
      "Competing active audio sessions on nearby devices.",
      "Bluetooth path instability during roaming."
    ],
    remediations: [
      "Disable automatic switching for meeting-critical sessions where policy allows.",
      "Set fixed input/output devices in meeting app before joining calls.",
      "Keep non-essential paired devices idle during important meetings.",
      "Capture reproducible steps and device firmware details if persistent."
    ],
    escalationCriteria: [
      "Issue affects many users with same accessory firmware generation.",
      "Accessory standardization guidance is needed for meeting reliability.",
      "Business-critical conferencing quality remains below threshold."
    ]
  },
  {
    slug: "macos-thunderbolt-storage-disconnects-under-load",
    title: "macOS Thunderbolt Storage Disconnects Under Load",
    description:
      "Investigate intermittent Thunderbolt storage disconnects during large file operations with safe cable/power/path diagnostics.",
    category: "macOS",
    productFamily: "Apple",
    product: "Thunderbolt External Storage",
    environment: "macOS",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["macos", "thunderbolt", "storage", "disconnect", "external-drive", "transfer"],
    symptoms: [
      "Drive disconnects during large copy/export workloads.",
      "Finder reports device ejected improperly.",
      "Issue is worse with dock chains or bus-powered enclosures."
    ],
    causes: [
      "Cable or enclosure stability limits under sustained throughput.",
      "Power delivery insufficiency in dock/hub path.",
      "Controller/firmware compatibility regression."
    ],
    remediations: [
      "Test direct connection path with certified Thunderbolt cable.",
      "Validate enclosure power requirements and avoid overloaded hub chains.",
      "Capture disconnect timing against workload profile for engineering review.",
      "Preserve data safety by avoiding repeated forced reconnect cycles."
    ],
    escalationCriteria: [
      "Disconnects threaten data integrity on business-critical volumes.",
      "Hardware firmware issue affects multiple users/devices.",
      "Storage platform standard needs revision."
    ],
    commands: [
      {
        title: "Disk state before/after disconnect",
        shell: "Terminal",
        content: "diskutil list\nlog show --last 15m --predicate 'process == \"kernel\"' | grep -i -E \"thunderbolt|disk|eject\""
      }
    ]
  },
  {
    slug: "macos-fan-noise-high-during-teams-zoom-screen-share",
    title: "macOS Fan Noise High During Teams/Zoom Screen Share",
    description:
      "Reduce excessive fan activity and performance dips during screen sharing with safe workload and display settings tuning.",
    category: "macOS",
    productFamily: "Apple",
    product: "macOS Meeting Performance",
    environment: "macOS",
    severity: "Low",
    tags: ["macos", "fan-noise", "screen-share", "teams", "zoom", "performance"],
    symptoms: [
      "Fans ramp quickly when sharing screen in meetings.",
      "System responsiveness drops during long calls.",
      "Battery drains rapidly during conferencing."
    ],
    causes: [
      "Combined camera + screen encoding workload exceeds thermal envelope.",
      "High-resolution/refresh external display increases render load.",
      "Background indexing/sync processes add CPU pressure."
    ],
    remediations: [
      "Close heavy background apps before starting screen share sessions.",
      "Lower shared content resolution/frame complexity where acceptable.",
      "Use power adapter during long calls and maintain unobstructed airflow.",
      "Collect reproducible workload profile for endpoint performance tuning."
    ],
    escalationCriteria: [
      "Thermal/performance issues affect multiple users on same hardware tier.",
      "Meeting workload exceeds current endpoint profile standards.",
      "Hardware refresh planning is required for call-heavy roles."
    ]
  },
  {
    slug: "macos-displaylink-adapter-not-working-after-macos-upgrade",
    title: "macOS DisplayLink Adapter Not Working After macOS Upgrade",
    description:
      "Troubleshoot DisplayLink post-upgrade failures using safe permission and driver lifecycle checks in managed Mac environments.",
    category: "macOS",
    productFamily: "Apple",
    product: "DisplayLink Adapter",
    environment: "macOS",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["macos", "displaylink", "adapter", "monitor", "upgrade", "driver"],
    symptoms: [
      "External monitors via DisplayLink fail after macOS upgrade.",
      "Adapter is recognized but no video output appears.",
      "Screen recording permission prompts recur or never appear."
    ],
    causes: [
      "DisplayLink service/driver not compatible with new OS build.",
      "Required privacy permissions not retained post-upgrade.",
      "Managed software deployment lags behind OS update."
    ],
    remediations: [
      "Verify approved DisplayLink version for current macOS build.",
      "Check privacy permissions and relaunch service after updates.",
      "Test adapter path with certified cables and known-good monitor.",
      "Escalate package updates through endpoint software management."
    ],
    escalationCriteria: [
      "Fleet-wide monitor outage follows OS upgrade cycle.",
      "Managed package update is required for compatibility restoration.",
      "Users request unsupported driver bypass/install methods."
    ]
  },
  {
    slug: "photoshop-canvas-lag-gpu-acceleration-managed-device",
    title: "Photoshop Canvas Lag with GPU Acceleration (Managed Device)",
    description:
      "Troubleshoot Photoshop responsiveness issues linked to GPU acceleration settings on enterprise-managed creative endpoints.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Photoshop",
    environment: "Both",
    severity: "Medium",
    tags: ["adobe", "photoshop", "gpu", "canvas-lag", "performance", "creative-cloud"],
    symptoms: [
      "Brush strokes and pan/zoom feel delayed on large files.",
      "GPU-intensive features cause intermittent freezes.",
      "Performance changes after graphics driver or app update."
    ],
    causes: [
      "GPU driver compatibility issue with current Photoshop build.",
      "Insufficient VRAM/resources for active project complexity.",
      "Conflicting background graphics workloads."
    ],
    remediations: [
      "Capture Photoshop and GPU driver versions plus repro steps.",
      "Test approved performance preferences and GPU feature toggles.",
      "Validate endpoint workload suitability for creative tier standards.",
      "Escalate driver/package optimization through endpoint engineering."
    ],
    escalationCriteria: [
      "Issue appears after rollout and affects multiple creative users.",
      "Driver/profile change is required in managed fleet.",
      "Business-critical design workflows are materially blocked."
    ]
  },
  {
    slug: "lightroom-classic-catalog-slow-external-drive-workflow",
    title: "Lightroom Classic Catalog Slow on External Drive Workflow",
    description:
      "Improve Lightroom Classic catalog performance on external-drive workflows using safe storage path, cache, and preview management.",
    category: "Adobe",
    productFamily: "Adobe",
    product: "Adobe Lightroom Classic",
    environment: "Both",
    severity: "Medium",
    tags: ["adobe", "lightroom", "catalog", "external-drive", "performance", "storage"],
    symptoms: [
      "Catalog operations are slow when images are on external drives.",
      "Preview generation and module switching lag significantly.",
      "Performance degrades over time with large libraries."
    ],
    causes: [
      "External drive throughput/latency constraints.",
      "Catalog/preview cache on slow or constrained volume.",
      "Library size and preview settings not aligned to hardware tier."
    ],
    remediations: [
      "Capture catalog location, preview cache location, and storage interface details.",
      "Move catalog/preview cache to faster approved local storage when possible.",
      "Optimize previews/catalog per Adobe best-practice workflow.",
      "Validate external drive health and cable path stability."
    ],
    escalationCriteria: [
      "Performance constraints affect broad creative team workflows.",
      "Storage architecture changes are needed for photo production standards.",
      "Potential catalog corruption/data-integrity concerns emerge."
    ]
  },
  {
    slug: "figma-browser-tab-crashes-large-prototype-presentation",
    title: "Figma Browser Tab Crashes on Large Prototype Presentation",
    description:
      "Troubleshoot browser crashes on complex Figma prototypes using safe browser/GPU/resource checks and prototype optimization guidance.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma Web",
    environment: "Both",
    severity: "Medium",
    tags: ["figma", "browser", "crash", "prototype", "performance", "webgl"],
    symptoms: [
      "Browser tab crashes when opening or presenting large prototypes.",
      "Issue is more common on specific browsers/profiles.",
      "Design handoff reviews are disrupted by repeated reloads."
    ],
    causes: [
      "High memory/GPU load from large prototype assets/interactions.",
      "Browser profile/extension overhead increases instability.",
      "Graphics acceleration path conflict in current browser build."
    ],
    remediations: [
      "Reproduce in clean browser profile and compare against baseline browser.",
      "Reduce prototype complexity in presentation path (heavy embeds/videos/transitions).",
      "Capture browser crash context and hardware profile for support.",
      "Coordinate with design ops on prototype optimization patterns."
    ],
    escalationCriteria: [
      "Crashes affect many users across same browser version.",
      "GPU/browser policy tuning requires endpoint management changes.",
      "Critical design review timelines are impacted."
    ]
  },
  {
    slug: "figma-dev-mode-access-denied-org-permission-model",
    title: "Figma Dev Mode Access Denied (Org Permission Model)",
    description:
      "Resolve Figma Dev Mode access denials by validating org licensing, role assignments, and project-level permissions with least-privilege controls.",
    category: "Figma",
    productFamily: "Figma",
    product: "Figma Dev Mode",
    environment: "Both",
    severity: "Medium",
    accessLevel: "Admin Required",
    tags: ["figma", "dev-mode", "permissions", "access-denied", "licensing", "roles"],
    symptoms: [
      "Users can open files but Dev Mode is unavailable or denied.",
      "Team members have inconsistent Dev Mode access in same project.",
      "Access changed after org role/licensing updates."
    ],
    causes: [
      "Dev Mode entitlement missing for user role or team plan.",
      "Project permissions do not align with expected developer access.",
      "SSO/group mapping update removed required role assignment."
    ],
    remediations: [
      "Confirm expected user role and licensing entitlement for Dev Mode features.",
      "Validate team/project permission inheritance and explicit overrides.",
      "Reconcile SSO/group mappings with current org access model.",
      "Re-test access after controlled role update and document outcome."
    ],
    escalationCriteria: [
      "Org-wide entitlement mismatch affects engineering/design collaboration.",
      "License plan or procurement changes are required.",
      "Access request involves sensitive unreleased product assets."
    ]
  },
  {
    slug: "dns-filter-blocks-adobe-figma-endpoints-enterprise-network",
    title: "DNS Filter Blocks Adobe/Figma Endpoints on Enterprise Network",
    description:
      "Troubleshoot content-filter or DNS-policy blocks impacting Adobe and Figma workflows without bypassing security controls.",
    category: "Networking / VPN",
    productFamily: "Networking",
    product: "Enterprise DNS Filtering",
    environment: "Both",
    severity: "High",
    accessLevel: "Admin Required",
    tags: ["dns", "filtering", "adobe", "figma", "network", "security-policy"],
    symptoms: [
      "Creative apps fail sign-in/sync only on corporate network.",
      "Endpoints resolve to block pages or fail with DNS errors.",
      "Issue disappears on alternative approved network."
    ],
    causes: [
      "New DNS policy/category blocking required vendor domains.",
      "TLS inspection/filter path incompatible with app endpoint behavior.",
      "Resolver mismatch between VPN and local network context."
    ],
    remediations: [
      "Capture failing domain requests and timestamps from affected workflows.",
      "Compare DNS resolution and reachability on approved alternate path.",
      "Submit allowlist review request with least-privilege domain scope.",
      "Validate post-change behavior and monitor for over-broad exceptions."
    ],
    escalationCriteria: [
      "Policy block impacts broad design/creative teams.",
      "Security architecture approval is required for domain exceptions.",
      "Users request unmanaged DNS/VPN bypass workarounds."
    ],
    commands: [
      {
        title: "Compare DNS resolution for vendor endpoints",
        shell: "CLI",
        content:
          "# Windows\nnslookup adobe.com\nnslookup figma.com\n\n# macOS\nscutil --dns | head -80\nnslookup adobe.com\nnslookup figma.com"
      }
    ]
  },
  {
    slug: "home-mesh-wifi-roaming-causes-vpn-session-drops",
    title: "Home Mesh Wi-Fi Roaming Causes VPN Session Drops",
    description:
      "Diagnose VPN disconnects triggered by home mesh node roaming events and stabilize remote-work connectivity with safe configuration guidance.",
    category: "Networking / VPN",
    productFamily: "Networking",
    product: "Home Mesh Wi-Fi + VPN",
    environment: "Both",
    severity: "Medium",
    tags: ["mesh-wifi", "vpn", "roaming", "remote-work", "network", "stability"],
    symptoms: [
      "VPN disconnects when moving between rooms or mesh nodes.",
      "Calls and remote sessions drop during Wi-Fi handoff.",
      "Issue is repeatable in homes with multiple mesh access points."
    ],
    causes: [
      "Aggressive roaming/handoff behavior interrupts tunnel continuity.",
      "Node backhaul quality fluctuations increase packet loss.",
      "VPN keepalive sensitivity to short path interruptions."
    ],
    remediations: [
      "Capture disconnect timing relative to movement/roaming events.",
      "Prefer stable primary node connection for critical work sessions.",
      "Tune mesh roaming aggressiveness per vendor guidance where supported.",
      "Validate VPN profile resilience and reconnect behavior after network transitions."
    ],
    escalationCriteria: [
      "Role-critical users remain unstable after baseline mesh tuning.",
      "Remote-work network kit guidance requires update at scale.",
      "Users request disabling VPN protections to mask roaming issues."
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
