import type { DownloadEntry } from "@/types/download";

const downloadsRegistry: DownloadEntry[] = [
// ── Communication ──────────────────────────────────────────────────────────
{
  slug: "discord",
  name: "Discord",
  iconUrl: "https://www.google.com/s2/favicons?domain=discord.com&sz=64",
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
  iconUrl: "https://www.google.com/s2/favicons?domain=slack.com&sz=64",
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
  iconUrl: "https://www.google.com/s2/favicons?domain=zoom.us&sz=64",
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
  iconUrl: "https://www.google.com/s2/favicons?domain=telegram.org&sz=64",
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
  iconUrl: "https://www.google.com/s2/favicons?domain=teams.microsoft.com&sz=64",
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
{
  slug: "signal",
  name: "Signal",
  iconUrl: "https://www.google.com/s2/favicons?domain=signal.org&sz=64",
  summary:
    "End-to-end encrypted messaging app for text, voice, and video calls with a strong privacy-first design and no ads.",
  category: "Communication",
  audience: "Curated",
  developer: "Signal Foundation",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
  tags: ["messaging", "privacy", "encrypted", "secure", "free", "popular"],
  popularityLabel: "Popular",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/signalapp/Signal-Desktop",
  releaseNotesUrl: "https://github.com/signalapp/Signal-Desktop/releases/latest",
  license: "AGPL-3.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://signal.org/download/" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/signal-private-messenger/id874139669" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NSF9NMXN7F4" },
    { type: "Source Code", url: "https://github.com/signalapp/Signal-Desktop" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://signal.org/download/windows",
      host: "Signal CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://signal.org/download/macos",
      host: "Signal CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "whatsapp",
  name: "WhatsApp",
  iconUrl: "https://www.google.com/s2/favicons?domain=whatsapp.com&sz=64",
  summary:
    "Meta's messaging app for text, voice, and video calls with end-to-end encryption, group chats, and file sharing.",
  category: "Communication",
  audience: "Curated",
  developer: "Meta",
  platforms: ["Windows", "macOS", "iOS", "Android", "Web"],
  tags: ["messaging", "chat", "voice", "video", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.whatsapp.com/download" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NKSQGP7F2NH" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/whatsapp-desktop/id310633997" }
  ]
},

// ── Media ─────────────────────────────────────────────────────────────────
{
  slug: "spotify",
  name: "Spotify",
  iconUrl: "https://www.google.com/s2/favicons?domain=spotify.com&sz=64",
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
{
  slug: "vlc",
  name: "VLC Media Player",
  iconUrl: "https://www.google.com/s2/favicons?domain=videolan.org&sz=64",
  summary:
    "Open-source media player that plays virtually any video or audio format without extra codecs, on all major platforms.",
  category: "Media",
  audience: "Curated",
  developer: "VideoLAN",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
  tags: ["media", "video", "audio", "player", "open-source", "free", "popular"],
  popularityLabel: "Most used",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/videolan/vlc",
  license: "GPL-2.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.videolan.org/vlc/" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NBLGGH4VVNH" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/vlc-for-mobile/id650377962" },
    { type: "Source Code", url: "https://github.com/videolan/vlc" }
  ],
  directDownloads: [
    {
      label: "Windows installer (64-bit)",
      platform: "Windows",
      url: "https://get.videolan.org/vlc/last/win64/",
      host: "VideoLAN CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://get.videolan.org/vlc/last/macosx/",
      host: "VideoLAN CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "obs-studio",
  name: "OBS Studio",
  iconUrl: "https://www.google.com/s2/favicons?domain=obsproject.com&sz=64",
  summary:
    "Open-source screen recording and live streaming software with scene compositing, audio mixing, and plugin support.",
  category: "Media",
  audience: "Curated",
  developer: "OBS Project",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["streaming", "recording", "obs", "open-source", "free", "popular", "github"],
  popularityLabel: "Most used",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/obsproject/obs-studio",
  releaseNotesUrl: "https://github.com/obsproject/obs-studio/releases/latest",
  license: "GPL-2.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://obsproject.com/download" },
    { type: "GitHub Releases", url: "https://github.com/obsproject/obs-studio/releases/latest" },
    { type: "Source Code", url: "https://github.com/obsproject/obs-studio" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/obsproject/obs-studio/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS PKG",
      platform: "macOS",
      url: "https://github.com/obsproject/obs-studio/releases/latest",
      host: "GitHub Releases",
      fileType: "PKG"
    }
  ]
},
{
  slug: "handbrake",
  name: "HandBrake",
  iconUrl: "https://www.google.com/s2/favicons?domain=handbrake.fr&sz=64",
  summary:
    "Open-source video transcoder for converting video files to widely-supported codecs with batch processing and presets.",
  category: "Media",
  audience: "Curated",
  developer: "HandBrake Team",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["video", "transcoder", "converter", "open-source", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/HandBrake/HandBrake",
  releaseNotesUrl: "https://github.com/HandBrake/HandBrake/releases/latest",
  license: "GPL-2.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://handbrake.fr/downloads.php" },
    { type: "GitHub Releases", url: "https://github.com/HandBrake/HandBrake/releases/latest" },
    { type: "Source Code", url: "https://github.com/HandBrake/HandBrake" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/HandBrake/HandBrake/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/HandBrake/HandBrake/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},

// ── Productivity ──────────────────────────────────────────────────────────
{
  slug: "ticktick",
  name: "TickTick",
  iconUrl: "https://www.google.com/s2/favicons?domain=ticktick.com&sz=64",
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
  iconUrl: "https://www.google.com/s2/favicons?domain=todoist.com&sz=64",
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
{
  slug: "notion",
  name: "Notion",
  iconUrl: "https://www.google.com/s2/favicons?domain=notion.so&sz=64",
  summary:
    "All-in-one workspace for notes, wikis, databases, and project management with a flexible block-based editor.",
  category: "Productivity",
  audience: "Curated",
  developer: "Notion Labs",
  platforms: ["Windows", "macOS", "iOS", "Android", "Web"],
  tags: ["notes", "wiki", "database", "productivity", "free", "popular"],
  popularityLabel: "Popular",
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://www.notion.so/desktop" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/notion-notes-projects-wiki/id1559269364" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9P9TQF7MRM4R" }
  ]
},
{
  slug: "obsidian",
  name: "Obsidian",
  iconUrl: "https://www.google.com/s2/favicons?domain=obsidian.md&sz=64",
  summary:
    "Local-first markdown note-taking app with a graph view, backlinks, and a rich plugin ecosystem for knowledge management.",
  category: "Productivity",
  audience: "Curated",
  developer: "Obsidian",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
  tags: ["notes", "markdown", "knowledge", "pkm", "free"],
  pricing: "Free (personal)",
  channels: [
    { type: "Website", url: "https://obsidian.md/download" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/obsidian-connected-notes/id1557175442" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://obsidian.md/download",
      host: "Obsidian CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://obsidian.md/download",
      host: "Obsidian CDN",
      fileType: "DMG"
    }
  ]
},

// ── Utilities ─────────────────────────────────────────────────────────────
{
  slug: "7zip",
  name: "7-Zip",
  iconUrl: "https://www.google.com/s2/favicons?domain=7-zip.org&sz=64",
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
  iconUrl: "https://www.google.com/s2/favicons?domain=qbittorrent.org&sz=64",
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
  iconUrl: "https://www.google.com/s2/favicons?domain=ventoy.net&sz=64",
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
  iconUrl: "https://www.google.com/s2/favicons?domain=anydesk.com&sz=64",
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
  iconUrl: "https://www.google.com/s2/favicons?domain=crystalmark.info&sz=64",
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
{
  slug: "rufus",
  name: "Rufus",
  iconUrl: "https://www.google.com/s2/favicons?domain=rufus.ie&sz=64",
  summary:
    "Fast Windows utility for creating bootable USB drives from ISO images, including Windows, Linux, and UEFI installs.",
  category: "Utilities",
  audience: "Curated",
  developer: "Pete Batard",
  platforms: ["Windows"],
  tags: ["usb", "bootable", "iso", "utility", "open-source", "free", "github", "popular"],
  popularityLabel: "Most used",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/pbatard/rufus",
  releaseNotesUrl: "https://github.com/pbatard/rufus/releases/latest",
  license: "GPL-3.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://rufus.ie/" },
    { type: "GitHub Releases", url: "https://github.com/pbatard/rufus/releases/latest" },
    { type: "Source Code", url: "https://github.com/pbatard/rufus" }
  ],
  directDownloads: [
    {
      label: "Windows portable",
      platform: "Windows",
      url: "https://github.com/pbatard/rufus/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    }
  ]
},
{
  slug: "powertoys",
  name: "PowerToys",
  iconUrl: "https://www.google.com/s2/favicons?domain=learn.microsoft.com&sz=64",
  summary:
    "Microsoft's open-source utility suite for Windows power users, including FancyZones, PowerRename, Color Picker, and more.",
  category: "Utilities",
  audience: "Curated",
  developer: "Microsoft",
  platforms: ["Windows"],
  tags: ["windows", "utility", "productivity", "microsoft", "open-source", "free", "github", "popular"],
  popularityLabel: "Popular on GitHub",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/microsoft/PowerToys",
  releaseNotesUrl: "https://github.com/microsoft/PowerToys/releases/latest",
  license: "MIT",
  pricing: "Free",
  channels: [
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/XP89DCGQ3MK6R0" },
    { type: "GitHub Releases", url: "https://github.com/microsoft/PowerToys/releases/latest" },
    { type: "Source Code", url: "https://github.com/microsoft/PowerToys" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/microsoft/PowerToys/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    }
  ]
},
{
  slug: "balena-etcher",
  name: "Balena Etcher",
  iconUrl: "https://www.google.com/s2/favicons?domain=etcher.balena.io&sz=64",
  summary:
    "Simple, cross-platform tool for flashing OS images to SD cards and USB drives with built-in verification.",
  category: "Utilities",
  audience: "Curated",
  developer: "Balena",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["usb", "sd-card", "iso", "flash", "open-source", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/balena-io/etcher",
  releaseNotesUrl: "https://github.com/balena-io/etcher/releases/latest",
  license: "Apache-2.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://etcher.balena.io/" },
    { type: "GitHub Releases", url: "https://github.com/balena-io/etcher/releases/latest" },
    { type: "Source Code", url: "https://github.com/balena-io/etcher" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/balena-io/etcher/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/balena-io/etcher/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},

// ── Security ──────────────────────────────────────────────────────────────
{
  slug: "proton-vpn",
  name: "Proton VPN",
  iconUrl: "https://www.google.com/s2/favicons?domain=protonvpn.com&sz=64",
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
  iconUrl: "https://www.google.com/s2/favicons?domain=malwarebytes.com&sz=64",
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
{
  slug: "bitwarden",
  name: "Bitwarden",
  iconUrl: "https://www.google.com/s2/favicons?domain=bitwarden.com&sz=64",
  summary:
    "Open-source password manager with end-to-end encryption, cross-device sync, browser extensions, and self-hosting support.",
  category: "Security",
  audience: "Curated",
  developer: "Bitwarden",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android", "Web"],
  tags: ["password", "security", "privacy", "open-source", "free", "popular", "github"],
  popularityLabel: "Popular",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/bitwarden/clients",
  releaseNotesUrl: "https://github.com/bitwarden/clients/releases/latest",
  license: "GPL-3.0",
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://bitwarden.com/download/" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9PJSDV0VPK04" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/bitwarden-password-manager/id1352778147" },
    { type: "Source Code", url: "https://github.com/bitwarden/clients" }
  ]
},
{
  slug: "veracrypt",
  name: "VeraCrypt",
  iconUrl: "https://www.google.com/s2/favicons?domain=veracrypt.fr&sz=64",
  summary:
    "Open-source disk encryption software for creating encrypted containers and full-disk encryption on Windows, macOS, and Linux.",
  category: "Security",
  audience: "Curated",
  developer: "IDRIX",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["encryption", "security", "privacy", "disk", "open-source", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/veracrypt/VeraCrypt",
  releaseNotesUrl: "https://github.com/veracrypt/VeraCrypt/releases/latest",
  license: "Apache-2.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.veracrypt.fr/en/Downloads.html" },
    { type: "GitHub Releases", url: "https://github.com/veracrypt/VeraCrypt/releases/latest" },
    { type: "Source Code", url: "https://github.com/veracrypt/VeraCrypt" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/veracrypt/VeraCrypt/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/veracrypt/VeraCrypt/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},

// ── Gaming ────────────────────────────────────────────────────────────────
{
  slug: "steam",
  name: "Steam",
  iconUrl: "https://www.google.com/s2/favicons?domain=steampowered.com&sz=64",
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
  iconUrl: "https://www.google.com/s2/favicons?domain=epicgames.com&sz=64",
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
{
  slug: "gog-galaxy",
  name: "GOG Galaxy",
  iconUrl: "https://www.google.com/s2/favicons?domain=gog.com&sz=64",
  summary:
    "DRM-free game launcher from GOG that aggregates your Steam, Epic, and other game libraries into a single client.",
  category: "Gaming",
  audience: "Curated",
  developer: "CD Projekt",
  platforms: ["Windows", "macOS"],
  tags: ["gaming", "games", "drm-free", "launcher", "free"],
  pricing: "Free",
  channels: [{ type: "Website", url: "https://www.gog.com/galaxy" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://www.gog.com/galaxy",
      host: "GOG CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.gog.com/galaxy",
      host: "GOG CDN",
      fileType: "DMG"
    }
  ]
},

// ── Developer Tools ───────────────────────────────────────────────────────
{
  slug: "vscode",
  name: "Visual Studio Code",
  iconUrl: "https://www.google.com/s2/favicons?domain=code.visualstudio.com&sz=64",
  summary:
    "Microsoft's free, open-source code editor with IntelliSense, debugging, Git integration, and a massive extension marketplace.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "Microsoft",
  platforms: ["Windows", "macOS", "Linux", "Web"],
  tags: ["editor", "code", "developer", "microsoft", "open-source", "free", "popular", "github"],
  popularityLabel: "Most used",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/microsoft/vscode",
  releaseNotesUrl: "https://github.com/microsoft/vscode/releases/latest",
  license: "MIT",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://code.visualstudio.com/download" },
    { type: "GitHub Releases", url: "https://github.com/microsoft/vscode/releases/latest" },
    { type: "Source Code", url: "https://github.com/microsoft/vscode" }
  ],
  directDownloads: [
    {
      label: "Windows installer (64-bit)",
      platform: "Windows",
      url: "https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user",
      host: "Microsoft CDN",
      fileType: "EXE"
    },
    {
      label: "macOS Universal",
      platform: "macOS",
      url: "https://code.visualstudio.com/sha/download?build=stable&os=darwin-universal",
      host: "Microsoft CDN",
      fileType: "ZIP"
    },
    {
      label: "Linux .deb (64-bit)",
      platform: "Linux",
      url: "https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64",
      host: "Microsoft CDN",
      fileType: "DEB"
    }
  ]
},
{
  slug: "postman",
  name: "Postman",
  iconUrl: "https://www.google.com/s2/favicons?domain=postman.com&sz=64",
  summary:
    "API development and testing platform with request collections, environments, automated tests, and team collaboration.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "Postman",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["api", "developer", "rest", "testing", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free tier",
  channels: [{ type: "Website", url: "https://www.postman.com/downloads/" }],
  directDownloads: [
    {
      label: "Windows installer (64-bit)",
      platform: "Windows",
      url: "https://dl.pstmn.io/download/latest/win64",
      host: "Postman CDN",
      fileType: "EXE"
    },
    {
      label: "macOS Apple Silicon",
      platform: "macOS",
      url: "https://dl.pstmn.io/download/latest/osx_arm64",
      host: "Postman CDN",
      fileType: "ZIP"
    },
    {
      label: "Linux (64-bit)",
      platform: "Linux",
      url: "https://dl.pstmn.io/download/latest/linux_64",
      host: "Postman CDN",
      fileType: "TAR.GZ"
    }
  ]
},
{
  slug: "docker-desktop",
  name: "Docker Desktop",
  iconUrl: "https://www.google.com/s2/favicons?domain=docker.com&sz=64",
  summary:
    "Container development environment with a GUI for building, running, and managing Docker containers and Kubernetes clusters.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "Docker",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["docker", "containers", "devops", "developer", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free (personal)",
  channels: [{ type: "Website", url: "https://www.docker.com/products/docker-desktop/" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe",
      host: "Docker CDN",
      fileType: "EXE"
    },
    {
      label: "macOS Apple Silicon",
      platform: "macOS",
      url: "https://desktop.docker.com/mac/main/arm64/Docker.dmg",
      host: "Docker CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "insomnia",
  name: "Insomnia",
  iconUrl: "https://www.google.com/s2/favicons?domain=insomnia.rest&sz=64",
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
  iconUrl: "https://www.google.com/s2/favicons?domain=tableplus.com&sz=64",
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
  iconUrl: "https://www.google.com/s2/favicons?domain=httpie.io&sz=64",
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
  iconUrl: "https://www.google.com/s2/favicons?domain=mitmproxy.org&sz=64",
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

// ── AI Tools ──────────────────────────────────────────────────────────────
{
  slug: "ollama",
  name: "Ollama",
  iconUrl: "https://www.google.com/s2/favicons?domain=ollama.com&sz=64",
  summary:
    "Run large language models locally on your machine with a simple CLI and REST API. Supports Llama, Mistral, Gemma, and more.",
  category: "AI Tools",
  audience: "Curated",
  developer: "Ollama",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["ai", "llm", "local-ai", "open-source", "free", "popular", "github"],
  popularityLabel: "Popular on GitHub",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/ollama/ollama",
  releaseNotesUrl: "https://github.com/ollama/ollama/releases/latest",
  license: "MIT",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://ollama.com/download" },
    { type: "GitHub Releases", url: "https://github.com/ollama/ollama/releases/latest" },
    { type: "Source Code", url: "https://github.com/ollama/ollama" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://ollama.com/download/OllamaSetup.exe",
      host: "Ollama CDN",
      fileType: "EXE"
    },
    {
      label: "macOS",
      platform: "macOS",
      url: "https://ollama.com/download/Ollama-darwin.zip",
      host: "Ollama CDN",
      fileType: "ZIP"
    }
  ]
},
{
  slug: "lm-studio",
  name: "LM Studio",
  iconUrl: "https://www.google.com/s2/favicons?domain=lmstudio.ai&sz=64",
  summary:
    "Desktop app for discovering, downloading, and running open-source LLMs locally with a chat interface and OpenAI-compatible API server.",
  category: "AI Tools",
  audience: "Curated",
  developer: "LM Studio",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["ai", "llm", "local-ai", "chat", "free"],
  popularityLabel: "Popular",
  pricing: "Free",
  channels: [{ type: "Website", url: "https://lmstudio.ai/download" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://lmstudio.ai/download",
      host: "LM Studio CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://lmstudio.ai/download",
      host: "LM Studio CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "jan",
  name: "Jan",
  iconUrl: "https://www.google.com/s2/favicons?domain=jan.ai&sz=64",
  summary:
    "Open-source, offline-first AI assistant that runs local LLMs on your own hardware with a clean chat interface and model hub.",
  category: "AI Tools",
  audience: "Curated",
  developer: "Menlo Research",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["ai", "llm", "local-ai", "open-source", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/janhq/jan",
  releaseNotesUrl: "https://github.com/janhq/jan/releases/latest",
  license: "AGPL-3.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://jan.ai/download" },
    { type: "GitHub Releases", url: "https://github.com/janhq/jan/releases/latest" },
    { type: "Source Code", url: "https://github.com/janhq/jan" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/janhq/jan/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/janhq/jan/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},
{
  slug: "anythingllm",
  name: "AnythingLLM",
  iconUrl: "https://www.google.com/s2/favicons?domain=anythingllm.com&sz=64",
  summary:
    "All-in-one AI workspace for chatting with documents, running local agents, and connecting to any LLM provider or local model.",
  category: "AI Tools",
  audience: "Curated",
  developer: "Mintplex Labs",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["ai", "llm", "rag", "agents", "open-source", "free", "github"],
  popularityLabel: "Popular on GitHub",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/Mintplex-Labs/anything-llm",
  releaseNotesUrl: "https://github.com/Mintplex-Labs/anything-llm/releases/latest",
  license: "MIT",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://anythingllm.com/download" },
    { type: "GitHub Releases", url: "https://github.com/Mintplex-Labs/anything-llm/releases/latest" },
    { type: "Source Code", url: "https://github.com/Mintplex-Labs/anything-llm" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/Mintplex-Labs/anything-llm/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/Mintplex-Labs/anything-llm/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},
];

export function getDownloads(): DownloadEntry[] {
  return downloadsRegistry;
}
