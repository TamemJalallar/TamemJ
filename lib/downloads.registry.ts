import { slugifyLabel } from "@/lib/slugs";
import type { DownloadEntry } from "@/types/download";

const downloadsRegistry: DownloadEntry[] = [
// ── Communication ──────────────────────────────────────────────────────────
{
  slug: "discord",
  name: "Discord",
  summary:
    "Voice, video, and text communication platform popular with gaming communities, developer teams, and study groups.",
  category: "Communication",
  audience: "Curated",
  developer: "Discord",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android", "Web"],
  tags: ["chat", "voice", "gaming", "community", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free",
  channels: [{ type: "Website", url: "https://discord.com/download" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://discord.com/api/downloads/distributions/app/installers/latest?channel=stable&platform=win&arch=x86",
      host: "Discord CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://discord.com/api/downloads/distributions/app/installers/latest?channel=stable&platform=osx&arch=x86",
      host: "Discord CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "slack",
  name: "Slack",
  summary:
    "Team messaging and collaboration platform with channels, threads, integrations, and file sharing for workplaces.",
  category: "Communication",
  audience: "Curated",
  developer: "Slack Technologies",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android", "Web"],
  tags: ["chat", "team", "work", "messaging", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://slack.com/downloads/" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/slack-for-desktop/id803453959" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9WZDNCRDK8DM" }
  ]
},
{
  slug: "zoom",
  name: "Zoom",
  summary:
    "Video conferencing and online meeting platform widely used for work calls, webinars, and remote collaboration.",
  category: "Communication",
  audience: "Curated",
  developer: "Zoom Video Communications",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
  tags: ["video", "meetings", "conferencing", "work", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free tier",
  channels: [{ type: "Website", url: "https://zoom.us/download" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://zoom.us/client/latest/ZoomInstallerFull.exe",
      host: "Zoom CDN",
      fileType: "EXE"
    },
    {
      label: "macOS PKG",
      platform: "macOS",
      url: "https://zoom.us/client/latest/Zoom.pkg",
      host: "Zoom CDN",
      fileType: "PKG"
    }
  ]
},
{
  slug: "telegram",
  name: "Telegram",
  summary:
    "Fast, cloud-based messaging app with large group chats, file sharing, bots, and optional end-to-end encrypted secret chats.",
  category: "Communication",
  audience: "Curated",
  developer: "Telegram",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android", "Web"],
  tags: ["messaging", "chat", "groups", "privacy", "free", "popular"],
  popularityLabel: "Popular",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://telegram.org/dl/" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NZTWSQNTD0S" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/telegram/id747648890" }
  ]
},
{
  slug: "microsoft-teams",
  name: "Microsoft Teams",
  summary:
    "Enterprise collaboration platform with meetings, chat, channels, and Microsoft 365 integration.",
  category: "Communication",
  audience: "Curated",
  developer: "Microsoft",
  platforms: ["Windows", "macOS", "iOS", "Android", "Web"],
  tags: ["team", "meetings", "microsoft", "enterprise", "free"],
  popularityLabel: "Most used",
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://www.microsoft.com/en-us/microsoft-teams/download-app" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/XP8BT8DW290MPQ" }
  ]
},

// ── Media ─────────────────────────────────────────────────────────────────
{
  slug: "spotify",
  name: "Spotify",
  summary:
    "Music and podcast streaming app with offline playback, curated playlists, and social listening features.",
  category: "Media",
  audience: "Curated",
  developer: "Spotify",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android", "Web"],
  tags: ["music", "streaming", "podcast", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://www.spotify.com/download/" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NCBCSZSJRSB" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580" }
  ]
},

// ── Productivity ──────────────────────────────────────────────────────────
{
  slug: "ticktick",
  name: "TickTick",
  summary:
    "Cross-platform task manager and to-do app with calendar view, habits, Pomodoro timer, and team sharing.",
  category: "Productivity",
  audience: "Curated",
  developer: "Appest",
  platforms: ["Windows", "macOS", "iOS", "Android", "Web"],
  tags: ["tasks", "to-do", "productivity", "calendar", "free"],
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://www.ticktick.com/about/download" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/ticktick-to-do-list-planner/id966085870" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9P7FRNXM8N1P" }
  ]
},
{
  slug: "todoist",
  name: "Todoist",
  summary:
    "Task and project manager with natural language input, recurring tasks, priorities, and team collaboration.",
  category: "Productivity",
  audience: "Curated",
  developer: "Doist",
  platforms: ["Windows", "macOS", "iOS", "Android", "Web"],
  tags: ["tasks", "to-do", "productivity", "projects", "free"],
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://todoist.com/downloads" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/todoist-to-do-list-tasks/id585829637" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NBLGGH5R558" }
  ]
},

// ── Utilities ─────────────────────────────────────────────────────────────
{
  slug: "7zip",
  name: "7-Zip",
  summary:
    "High-compression, open-source archive manager supporting 7z, ZIP, RAR, TAR, and dozens of other formats.",
  category: "Utilities",
  audience: "Curated",
  developer: "Igor Pavlov",
  platforms: ["Windows", "Linux"],
  tags: ["archive", "compression", "zip", "utility", "open-source", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free",
  channels: [{ type: "Website", url: "https://www.7-zip.org/download.html" }],
  directDownloads: [
    {
      label: "Windows installer (64-bit)",
      platform: "Windows",
      url: "https://www.7-zip.org/a/7z2408-x64.exe",
      host: "7-zip.org",
      fileType: "EXE"
    }
  ]
},
{
  slug: "qbittorrent",
  name: "qBittorrent",
  summary:
    "Lightweight, open-source BitTorrent client with a clean UI, RSS downloader, and no bundled adware.",
  category: "Utilities",
  audience: "Curated",
  developer: "qBittorrent Project",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["torrent", "bittorrent", "downloader", "open-source", "free"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/qbittorrent/qBittorrent",
  releaseNotesUrl: "https://github.com/qbittorrent/qBittorrent/releases/latest",
  license: "GPL-2.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.qbittorrent.org/download" },
    { type: "GitHub Releases", url: "https://github.com/qbittorrent/qBittorrent/releases/latest" },
    { type: "Source Code", url: "https://github.com/qbittorrent/qBittorrent" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/qbittorrent/qBittorrent/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/qbittorrent/qBittorrent/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},
{
  slug: "ventoy",
  name: "Ventoy",
  summary:
    "Open-source tool for creating bootable USB drives that supports multiple ISO files on a single drive without reformatting.",
  category: "Utilities",
  audience: "Curated",
  developer: "Ventoy",
  platforms: ["Windows", "Linux"],
  tags: ["usb", "bootable", "iso", "utility", "open-source", "free", "github"],
  featuredOnGitHub: true,
  popularityLabel: "Popular on GitHub",
  sourceCodeUrl: "https://github.com/ventoy/Ventoy",
  releaseNotesUrl: "https://github.com/ventoy/Ventoy/releases/latest",
  license: "GPL-3.0",
  pricing: "Free",
  channels: [
    { type: "GitHub Releases", url: "https://github.com/ventoy/Ventoy/releases/latest" },
    { type: "Source Code", url: "https://github.com/ventoy/Ventoy" }
  ],
  directDownloads: [
    {
      label: "Windows package",
      platform: "Windows",
      url: "https://github.com/ventoy/Ventoy/releases/latest",
      host: "GitHub Releases",
      fileType: "ZIP"
    }
  ]
},
{
  slug: "anydesk",
  name: "AnyDesk",
  summary:
    "Remote desktop software for fast, low-latency support sessions and unattended access across platforms.",
  category: "Utilities",
  audience: "Curated",
  developer: "AnyDesk Software",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
  tags: ["remote-desktop", "support", "access", "free"],
  pricing: "Free tier",
  channels: [{ type: "Website", url: "https://anydesk.com/en/downloads" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://download.anydesk.com/AnyDesk.exe",
      host: "AnyDesk CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://download.anydesk.com/anydesk.dmg",
      host: "AnyDesk CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "crystaldiskinfo",
  name: "CrystalDiskInfo",
  summary:
    "Windows disk health monitor that reads S.M.A.R.T. data to surface drive warnings and temperature trends before failure.",
  category: "Utilities",
  audience: "Curated",
  developer: "hiyohiyo",
  platforms: ["Windows"],
  tags: ["disk", "health", "smart", "windows", "utility", "free"],
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://crystalmark.info/en/software/crystaldiskinfo/" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NBLGGGZT0F5" }
  ]
},

// ── Security ──────────────────────────────────────────────────────────────
{
  slug: "proton-vpn",
  name: "Proton VPN",
  summary:
    "Privacy-focused VPN with a permanently free tier, strict no-logs policy, open-source clients, and servers in 90+ countries.",
  category: "Security",
  audience: "Curated",
  developer: "Proton AG",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
  tags: ["vpn", "privacy", "security", "proton", "open-source", "free"],
  popularityLabel: "Popular",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/ProtonVPN/win-app",
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://protonvpn.com/download/" },
    { type: "Source Code", url: "https://github.com/ProtonVPN/win-app" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://protonvpn.com/download/windows",
      host: "Proton CDN",
      fileType: "EXE"
    }
  ]
},
{
  slug: "malwarebytes",
  name: "Malwarebytes",
  summary:
    "Anti-malware scanner and threat removal tool for Windows and macOS with real-time protection available on paid tier.",
  category: "Security",
  audience: "Curated",
  developer: "Malwarebytes",
  platforms: ["Windows", "macOS", "iOS", "Android"],
  tags: ["antimalware", "security", "scanner", "windows", "free"],
  pricing: "Free tier",
  channels: [{ type: "Website", url: "https://www.malwarebytes.com/mwb-download" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://downloads.malwarebytes.com/file/mb-windows",
      host: "Malwarebytes CDN",
      fileType: "EXE"
    }
  ]
},

// ── Gaming ────────────────────────────────────────────────────────────────
{
  slug: "steam",
  name: "Steam",
  summary:
    "Valve's PC gaming platform for buying, downloading, and playing games with cloud saves, achievements, and community features.",
  category: "Gaming",
  audience: "Curated",
  developer: "Valve",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["gaming", "games", "valve", "launcher", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free",
  channels: [{ type: "Website", url: "https://store.steampowered.com/about/" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://cdn.akamai.steamstatic.com/client/installer/SteamSetup.exe",
      host: "Akamai CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://cdn.akamai.steamstatic.com/client/installer/steam.dmg",
      host: "Akamai CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "epic-games-launcher",
  name: "Epic Games Launcher",
  summary:
    "Game library and storefront from Epic Games with frequent free title giveaways and access to Fortnite and Unreal Engine.",
  category: "Gaming",
  audience: "Curated",
  developer: "Epic Games",
  platforms: ["Windows", "macOS"],
  tags: ["gaming", "games", "epic", "launcher", "free"],
  popularityLabel: "Popular",
  pricing: "Free",
  channels: [{ type: "Website", url: "https://store.epicgames.com/en-US/download" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://launcher-public-service-prod06.ol.epicgames.com/launcher/api/installer/download/EpicGamesLauncherInstaller.msi",
      host: "Epic CDN",
      fileType: "MSI"
    }
  ]
},

// ── Developer Tools ───────────────────────────────────────────────────────
{
  slug: "insomnia",
  name: "Insomnia",
  summary:
    "Open-source REST and GraphQL API client with environment management, collections, and request debugging tools.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "Kong",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["api", "developer", "rest", "graphql", "open-source", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/Kong/insomnia",
  releaseNotesUrl: "https://github.com/Kong/insomnia/releases/latest",
  license: "Apache-2.0",
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://insomnia.rest/download" },
    { type: "GitHub Releases", url: "https://github.com/Kong/insomnia/releases/latest" },
    { type: "Source Code", url: "https://github.com/Kong/insomnia" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/Kong/insomnia/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/Kong/insomnia/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},
{
  slug: "tableplus",
  name: "TablePlus",
  summary:
    "Modern database GUI for PostgreSQL, MySQL, SQLite, Redis, and more with a clean, native interface and query editor.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "TablePlus",
  platforms: ["Windows", "macOS", "iOS"],
  tags: ["database", "sql", "developer", "gui", "free"],
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://tableplus.com/download" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/tableplus/id1247542715" }
  ]
},
{
  slug: "httpie-desktop",
  name: "HTTPie Desktop",
  summary:
    "Human-friendly API testing client with a minimal UI, syntax-highlighted responses, and persistent session management.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "HTTPie",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["api", "developer", "http", "testing", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/httpie/desktop",
  releaseNotesUrl: "https://github.com/httpie/desktop/releases/latest",
  license: "BSD-3-Clause",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://httpie.io/desktop" },
    { type: "GitHub Releases", url: "https://github.com/httpie/desktop/releases/latest" },
    { type: "Source Code", url: "https://github.com/httpie/desktop" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/httpie/desktop/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/httpie/desktop/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},
{
  slug: "mitmproxy",
  name: "mitmproxy",
  summary:
    "Interactive HTTPS proxy for intercepting, inspecting, and modifying live web traffic during development and security testing.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "mitmproxy",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["proxy", "developer", "http", "security", "open-source", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/mitmproxy/mitmproxy",
  releaseNotesUrl: "https://github.com/mitmproxy/mitmproxy/releases/latest",
  license: "MIT",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://mitmproxy.org/downloads/" },
    { type: "GitHub Releases", url: "https://github.com/mitmproxy/mitmproxy/releases/latest" },
    { type: "Source Code", url: "https://github.com/mitmproxy/mitmproxy" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/mitmproxy/mitmproxy/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS package",
      platform: "macOS",
      url: "https://github.com/mitmproxy/mitmproxy/releases/latest",
      host: "GitHub Releases",
      fileType: "PKG"
    }
  ]
},
];

export function getDownloads(): DownloadEntry[] {
  return downloadsRegistry;
}

export function getDownloadCategories(): string[] {
  return [...new Set(downloadsRegistry.map((entry) => entry.category))].sort((a, b) => a.localeCompare(b));
}

export function getDownloadCategorySlug(category: string): string {
  return slugifyLabel(category);
}

export function getDownloadCategoryBySlug(slug: string): string | undefined {
  return getDownloadCategories().find((category) => getDownloadCategorySlug(category) === slug);
}

export function getDownloadsByCategory(categoryOrSlug: string): DownloadEntry[] {
  const resolvedCategory = getDownloadCategoryBySlug(categoryOrSlug) ?? categoryOrSlug;

  return downloadsRegistry
    .filter((entry) => entry.category === resolvedCategory)
    .sort((a, b) => a.name.localeCompare(b.name));
}
