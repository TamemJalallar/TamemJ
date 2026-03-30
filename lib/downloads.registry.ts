import downloadReleaseMetadataStore from "@/data/download-release-metadata.json";
import type {
  DirectDownloadArtifact,
  DownloadEntry,
  DownloadPlatform,
  DownloadReleaseMetadataArtifact,
  DownloadReleaseMetadataEntry,
  DownloadReleaseMetadataStore
} from "@/types/download";

const downloadReleaseMetadata = downloadReleaseMetadataStore as DownloadReleaseMetadataStore;

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

{
  slug: "skype",
  name: "Skype",
  iconUrl: "https://www.google.com/s2/favicons?domain=skype.com&sz=64",
  summary:
    "Microsoft's video and voice calling app with screen sharing, chat, and international calling — one of the original cross-platform video chat apps.",
  category: "Communication",
  audience: "Curated",
  developer: "Microsoft",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android", "Web"],
  tags: ["video", "voice", "chat", "microsoft", "free"],
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.skype.com/en/get-skype/" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9WZDNCRFJ364" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/skype/id304878510" }
  ]
},
{
  slug: "element",
  name: "Element",
  iconUrl: "https://www.google.com/s2/favicons?domain=element.io&sz=64",
  summary:
    "Decentralised, end-to-end encrypted messaging app built on the Matrix protocol — federated, open-source, and self-hostable.",
  category: "Communication",
  audience: "Curated",
  developer: "Element",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android", "Web"],
  tags: ["messaging", "privacy", "encrypted", "matrix", "open-source", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/element-hq/element-desktop",
  releaseNotesUrl: "https://github.com/element-hq/element-desktop/releases/latest",
  license: "Apache-2.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://element.io/download" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/element-messenger/id1083446067" },
    { type: "GitHub Releases", url: "https://github.com/element-hq/element-desktop/releases/latest" },
    { type: "Source Code", url: "https://github.com/element-hq/element-desktop" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/element-hq/element-desktop/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/element-hq/element-desktop/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
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

{
  slug: "audacity",
  name: "Audacity",
  iconUrl: "https://www.google.com/s2/favicons?domain=audacityteam.org&sz=64",
  summary:
    "Open-source, multi-track audio editor and recorder for cutting, mixing, and applying effects to audio files on any platform.",
  category: "Media",
  audience: "Curated",
  developer: "Audacity Team",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["audio", "editor", "recording", "open-source", "free", "popular"],
  popularityLabel: "Most used",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/audacity/audacity",
  releaseNotesUrl: "https://github.com/audacity/audacity/releases/latest",
  license: "GPL-3.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.audacityteam.org/download/" },
    { type: "GitHub Releases", url: "https://github.com/audacity/audacity/releases/latest" },
    { type: "Source Code", url: "https://github.com/audacity/audacity" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/audacity/audacity/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/audacity/audacity/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},

{
  slug: "davinci-resolve",
  name: "DaVinci Resolve",
  iconUrl: "https://www.google.com/s2/favicons?domain=blackmagicdesign.com&sz=64",
  summary:
    "Professional-grade video editor, colour grader, and audio post tool — the free version is more capable than most paid alternatives.",
  category: "Media",
  audience: "Curated",
  developer: "Blackmagic Design",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["video", "editor", "colour-grading", "audio", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://www.blackmagicdesign.com/products/davinciresolve" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/davinci-resolve/id571213070" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://www.blackmagicdesign.com/products/davinciresolve",
      host: "Blackmagic CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.blackmagicdesign.com/products/davinciresolve",
      host: "Blackmagic CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "plex",
  name: "Plex",
  iconUrl: "https://www.google.com/s2/favicons?domain=plex.tv&sz=64",
  summary:
    "Personal media server that streams your movies, TV, and music to any device — with a free tier for local playback and optional Plex Pass for extras.",
  category: "Media",
  audience: "Curated",
  developer: "Plex",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
  tags: ["media", "streaming", "server", "movies", "music", "free"],
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://www.plex.tv/media-server-downloads/" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/plex-media-player/id1110446164" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NBLGGH4NN8G" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://www.plex.tv/media-server-downloads/",
      host: "Plex CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.plex.tv/media-server-downloads/",
      host: "Plex CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "kodi",
  name: "Kodi",
  iconUrl: "https://www.google.com/s2/favicons?domain=kodi.tv&sz=64",
  summary:
    "Open-source media centre for playing local videos, music, and photos with a TV-friendly interface, add-ons, and Raspberry Pi support.",
  category: "Media",
  audience: "Curated",
  developer: "XBMC Foundation",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
  tags: ["media", "home-theatre", "player", "open-source", "free"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/xbmc/xbmc",
  license: "GPL-2.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://kodi.tv/download/" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/kodi/id1588798917" },
    { type: "Source Code", url: "https://github.com/xbmc/xbmc" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://kodi.tv/download/",
      host: "Kodi CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://kodi.tv/download/",
      host: "Kodi CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "stremio",
  name: "Stremio",
  iconUrl: "https://www.google.com/s2/favicons?domain=stremio.com&sz=64",
  summary:
    "Modern media centre that aggregates streaming content from add-on providers into a unified, Netflix-style interface.",
  category: "Media",
  audience: "Curated",
  developer: "Smart Code Ltd",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
  tags: ["media", "streaming", "movies", "tv", "free"],
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.stremio.com/downloads" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/stremio/id1570838768" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9P6QQPM6SZPF" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://www.stremio.com/downloads",
      host: "Stremio CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.stremio.com/downloads",
      host: "Stremio CDN",
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

{
  slug: "joplin",
  name: "Joplin",
  iconUrl: "https://www.google.com/s2/favicons?domain=joplinapp.org&sz=64",
  summary:
    "Open-source note-taking app with markdown support, end-to-end encryption, and sync via Dropbox, OneDrive, Nextcloud, or self-hosted WebDAV.",
  category: "Productivity",
  audience: "Curated",
  developer: "Laurent Cozic",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
  tags: ["notes", "markdown", "open-source", "sync", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/laurent22/joplin",
  releaseNotesUrl: "https://github.com/laurent22/joplin/releases/latest",
  license: "MIT",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://joplinapp.org/download/" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/joplin/id1315599797" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9MVP74LQDWJ4" },
    { type: "GitHub Releases", url: "https://github.com/laurent22/joplin/releases/latest" },
    { type: "Source Code", url: "https://github.com/laurent22/joplin" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/laurent22/joplin/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/laurent22/joplin/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},
{
  slug: "logseq",
  name: "Logseq",
  iconUrl: "https://www.google.com/s2/favicons?domain=logseq.com&sz=64",
  summary:
    "Open-source, privacy-first knowledge management app with outlining, bidirectional links, journal-based capture, and a local-first data model.",
  category: "Productivity",
  audience: "Curated",
  developer: "Logseq",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
  tags: ["notes", "knowledge", "pkm", "markdown", "open-source", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/logseq/logseq",
  releaseNotesUrl: "https://github.com/logseq/logseq/releases/latest",
  license: "AGPL-3.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://logseq.com/downloads" },
    { type: "GitHub Releases", url: "https://github.com/logseq/logseq/releases/latest" },
    { type: "Source Code", url: "https://github.com/logseq/logseq" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/logseq/logseq/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/logseq/logseq/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},
{
  slug: "microsoft-todo",
  name: "Microsoft To Do",
  iconUrl: "https://www.google.com/s2/favicons?domain=todo.microsoft.com&sz=64",
  summary:
    "Microsoft's task management app with My Day smart lists, reminders, subtasks, and full Microsoft 365 integration.",
  category: "Productivity",
  audience: "Curated",
  developer: "Microsoft",
  platforms: ["Windows", "macOS", "iOS", "Android", "Web"],
  tags: ["tasks", "to-do", "productivity", "microsoft", "free"],
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://todo.microsoft.com/tasks/" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NBLGGH5R558" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/microsoft-to-do/id1274495053" }
  ]
},
{
  slug: "raycast",
  name: "Raycast",
  iconUrl: "https://www.google.com/s2/favicons?domain=raycast.com&sz=64",
  summary:
    "Blazing-fast macOS launcher that replaces Spotlight with app switching, script commands, clipboard history, and an AI assistant.",
  category: "Productivity",
  audience: "Curated",
  developer: "Raycast Technologies",
  platforms: ["macOS"],
  tags: ["launcher", "productivity", "macos", "ai", "free"],
  pricing: "Free tier",
  channels: [{ type: "Website", url: "https://www.raycast.com/download" }],
  directDownloads: [
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.raycast.com/download",
      host: "Raycast CDN",
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

{
  slug: "sharex",
  name: "ShareX",
  iconUrl: "https://www.google.com/s2/favicons?domain=getsharex.com&sz=64",
  summary:
    "Open-source Windows screen capture and recording tool with annotation, scrolling capture, OCR, and 80+ upload destinations.",
  category: "Utilities",
  audience: "Curated",
  developer: "ShareX Team",
  platforms: ["Windows"],
  tags: ["screenshot", "recording", "capture", "open-source", "free", "github", "popular"],
  popularityLabel: "Popular on GitHub",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/ShareX/ShareX",
  releaseNotesUrl: "https://github.com/ShareX/ShareX/releases/latest",
  license: "GPL-3.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://getsharex.com/downloads/" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NBLGGH4Z1SP" },
    { type: "GitHub Releases", url: "https://github.com/ShareX/ShareX/releases/latest" },
    { type: "Source Code", url: "https://github.com/ShareX/ShareX" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/ShareX/ShareX/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    }
  ]
},

{
  slug: "filezilla",
  name: "FileZilla",
  iconUrl: "https://www.google.com/s2/favicons?domain=filezilla-project.org&sz=64",
  summary:
    "Free, open-source FTP, FTPS, and SFTP client with a drag-and-drop interface, transfer queue, site manager, and large file support.",
  category: "Utilities",
  audience: "Curated",
  developer: "Tim Kosse",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["ftp", "sftp", "transfer", "open-source", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free",
  channels: [{ type: "Website", url: "https://filezilla-project.org/download.php?type=client" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://filezilla-project.org/download.php?type=client",
      host: "FileZilla CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://filezilla-project.org/download.php?type=client",
      host: "FileZilla CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "putty",
  name: "PuTTY",
  iconUrl: "https://www.google.com/s2/favicons?domain=putty.org&sz=64",
  summary:
    "Lightweight, free SSH and Telnet client for Windows — the go-to tool for connecting to remote Linux/Unix servers from a Windows machine.",
  category: "Utilities",
  audience: "Curated",
  developer: "Simon Tatham",
  platforms: ["Windows"],
  tags: ["ssh", "telnet", "remote", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.putty.org/" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9N8PDQ5BQ8QG" }
  ],
  directDownloads: [
    {
      label: "Windows installer (64-bit)",
      platform: "Windows",
      url: "https://the.earth.li/~sgtatham/putty/latest/w64/putty-64bit-installer.msi",
      host: "PuTTY CDN",
      fileType: "MSI"
    }
  ]
},
{
  slug: "everything",
  name: "Everything",
  iconUrl: "https://www.google.com/s2/favicons?domain=voidtools.com&sz=64",
  summary:
    "Instant file search for Windows that indexes your entire NTFS drive in seconds and finds any file or folder as you type.",
  category: "Utilities",
  audience: "Curated",
  developer: "voidtools",
  platforms: ["Windows"],
  tags: ["search", "files", "windows", "utility", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free",
  channels: [{ type: "Website", url: "https://www.voidtools.com/downloads/" }],
  directDownloads: [
    {
      label: "Windows installer (64-bit)",
      platform: "Windows",
      url: "https://www.voidtools.com/Everything-1.4.1.1026.x64-Setup.exe",
      host: "voidtools CDN",
      fileType: "EXE"
    }
  ]
},
{
  slug: "wireshark",
  name: "Wireshark",
  iconUrl: "https://www.google.com/s2/favicons?domain=wireshark.org&sz=64",
  summary:
    "The world's most widely-used network protocol analyser — captures and inspects live traffic at microscopic detail for debugging and security analysis.",
  category: "Utilities",
  audience: "Curated",
  developer: "Wireshark Foundation",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["network", "packet-capture", "security", "developer", "open-source", "free"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://gitlab.com/wireshark/wireshark",
  pricing: "Free",
  channels: [{ type: "Website", url: "https://www.wireshark.org/download.html" }],
  directDownloads: [
    {
      label: "Windows installer (64-bit)",
      platform: "Windows",
      url: "https://www.wireshark.org/download.html",
      host: "Wireshark CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.wireshark.org/download.html",
      host: "Wireshark CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "cpu-z",
  name: "CPU-Z",
  iconUrl: "https://www.google.com/s2/favicons?domain=cpuid.com&sz=64",
  summary:
    "Free Windows utility that displays detailed specs for your CPU, motherboard, memory, and GPU — the go-to app for hardware identification.",
  category: "Utilities",
  audience: "Curated",
  developer: "CPUID",
  platforms: ["Windows"],
  tags: ["hardware", "cpu", "system-info", "windows", "free"],
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.cpuid.com/softwares/cpu-z.html" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NBLGGGZDLJF" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://download.cpuid.com/cpu-z/cpu-z_2.13-en.exe",
      host: "CPUID CDN",
      fileType: "EXE"
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

{
  slug: "keepass",
  name: "KeePass",
  iconUrl: "https://www.google.com/s2/favicons?domain=keepass.info&sz=64",
  summary:
    "Lightweight, open-source password manager that stores your credentials in an encrypted local database — no cloud, no subscription.",
  category: "Security",
  audience: "Curated",
  developer: "Dominik Reichl",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["password", "security", "open-source", "local", "free"],
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://keepass.info/download.html" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9N8VCVGH1ZNN" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://keepass.info/download.html",
      host: "KeePass CDN",
      fileType: "MSI"
    }
  ]
},
{
  slug: "tor-browser",
  name: "Tor Browser",
  iconUrl: "https://www.google.com/s2/favicons?domain=torproject.org&sz=64",
  summary:
    "Privacy browser that routes traffic through the Tor anonymity network, stripping trackers and preventing surveillance by design.",
  category: "Security",
  audience: "Curated",
  developer: "Tor Project",
  platforms: ["Windows", "macOS", "Linux", "Android"],
  tags: ["browser", "privacy", "anonymity", "tor", "open-source", "free"],
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.torproject.org/download/" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://www.torproject.org/download/",
      host: "Tor CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.torproject.org/download/",
      host: "Tor CDN",
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

{
  slug: "battlenet",
  name: "Battle.net",
  iconUrl: "https://www.google.com/s2/favicons?domain=battle.net&sz=64",
  summary:
    "Blizzard's game launcher and social platform giving access to World of Warcraft, Overwatch, Diablo, Hearthstone, and StarCraft.",
  category: "Gaming",
  audience: "Curated",
  developer: "Blizzard Entertainment",
  platforms: ["Windows", "macOS"],
  tags: ["gaming", "games", "blizzard", "launcher", "free"],
  pricing: "Free",
  channels: [{ type: "Website", url: "https://www.blizzard.com/en-us/apps/battle.net/desktop" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://www.battle.net/download/getInstallerForGame?os=win&locale=enUS&version=LIVE&gameProgram=BATTLE_NET_APP",
      host: "Blizzard CDN",
      fileType: "EXE"
    }
  ]
},
{
  slug: "ubisoft-connect",
  name: "Ubisoft Connect",
  iconUrl: "https://www.google.com/s2/favicons?domain=ubisoft.com&sz=64",
  summary:
    "Ubisoft's game launcher and reward ecosystem for accessing Assassin's Creed, Far Cry, Rainbow Six, and all Ubisoft titles.",
  category: "Gaming",
  audience: "Curated",
  developer: "Ubisoft",
  platforms: ["Windows"],
  tags: ["gaming", "games", "ubisoft", "launcher", "free"],
  pricing: "Free",
  channels: [{ type: "Website", url: "https://www.ubisoft.com/en-gb/help/ubisoft-connect/article/downloading-and-installing-ubisoft-connect/000025522" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://ubistatic3-a.akamaihd.net/orbit/launcher_installer/UbisoftConnectInstaller.exe",
      host: "Ubisoft CDN",
      fileType: "EXE"
    }
  ]
},
{
  slug: "ea-app",
  name: "EA App",
  iconUrl: "https://www.google.com/s2/favicons?domain=ea.com&sz=64",
  summary:
    "Electronic Arts' PC game client replacing Origin, providing access to EA titles, EA Play subscriptions, and online multiplayer.",
  category: "Gaming",
  audience: "Curated",
  developer: "Electronic Arts",
  platforms: ["Windows"],
  tags: ["gaming", "games", "ea", "launcher", "free"],
  pricing: "Free",
  channels: [{ type: "Website", url: "https://www.ea.com/ea-app" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://origin-a.akamaihd.net/EA-Desktop-Client-Download/installer-releases/EAappInstaller.exe",
      host: "EA CDN",
      fileType: "EXE"
    }
  ]
},
{
  slug: "xbox-app",
  name: "Xbox App",
  iconUrl: "https://www.google.com/s2/favicons?domain=xbox.com&sz=64",
  summary:
    "Microsoft's PC gaming hub for Game Pass, cloud gaming, Xbox social features, and installing games from the Microsoft Store.",
  category: "Gaming",
  audience: "Curated",
  developer: "Microsoft",
  platforms: ["Windows"],
  tags: ["gaming", "games", "xbox", "microsoft", "game-pass", "free"],
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.xbox.com/en-US/apps/xbox-app-for-pc" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9MV0B1WTXCLE" }
  ]
},
{
  slug: "heroic-games-launcher",
  name: "Heroic Games Launcher",
  iconUrl: "https://www.google.com/s2/favicons?domain=heroicgameslauncher.com&sz=64",
  summary:
    "Open-source game launcher for Epic Games, GOG, and Amazon Prime Gaming libraries — with Wine/Proton support for running Windows games on Linux and macOS.",
  category: "Gaming",
  audience: "Curated",
  developer: "Heroic Games Launcher",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["gaming", "games", "epic", "gog", "open-source", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher",
  releaseNotesUrl: "https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/releases/latest",
  license: "GPL-3.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://heroicgameslauncher.com/" },
    { type: "GitHub Releases", url: "https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/releases/latest" },
    { type: "Source Code", url: "https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},
{
  slug: "playnite",
  name: "Playnite",
  iconUrl: "https://www.google.com/s2/favicons?domain=playnite.link&sz=64",
  summary:
    "Open-source game library manager that unifies Steam, Epic, GOG, Xbox, and 30+ other sources into one searchable, customizable interface.",
  category: "Gaming",
  audience: "Curated",
  developer: "Josef Nemec",
  platforms: ["Windows"],
  tags: ["gaming", "library", "manager", "open-source", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/JosefNemec/Playnite",
  releaseNotesUrl: "https://github.com/JosefNemec/Playnite/releases/latest",
  license: "MIT",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://playnite.link/" },
    { type: "GitHub Releases", url: "https://github.com/JosefNemec/Playnite/releases/latest" },
    { type: "Source Code", url: "https://github.com/JosefNemec/Playnite" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/JosefNemec/Playnite/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    }
  ]
},

// ── Developer Tools ───────────────────────────────────────────────────────
{
  slug: "cursor",
  name: "Cursor",
  iconUrl: "https://www.google.com/s2/favicons?domain=cursor.com&sz=64",
  summary:
    "AI-first code editor built on VS Code with an integrated LLM chat, inline edits, multi-file context, and agent mode for autonomous coding tasks.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "Anysphere",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["editor", "ai", "code", "developer", "free", "popular"],
  popularityLabel: "Popular",
  pricing: "Free tier",
  channels: [{ type: "Website", url: "https://www.cursor.com/download" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://www.cursor.com/download",
      host: "Cursor CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.cursor.com/download",
      host: "Cursor CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "github-desktop",
  name: "GitHub Desktop",
  iconUrl: "https://www.google.com/s2/favicons?domain=desktop.github.com&sz=64",
  summary:
    "Official GitHub client for managing repositories, commits, branches, and pull requests with a clean visual interface — no command line needed.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "GitHub",
  platforms: ["Windows", "macOS"],
  tags: ["git", "github", "developer", "open-source", "free", "popular"],
  popularityLabel: "Popular",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/desktop/desktop",
  releaseNotesUrl: "https://github.com/desktop/desktop/releases/latest",
  license: "MIT",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://desktop.github.com/" },
    { type: "GitHub Releases", url: "https://github.com/desktop/desktop/releases/latest" },
    { type: "Source Code", url: "https://github.com/desktop/desktop" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://central.github.com/deployments/desktop/desktopapp/latest/win32",
      host: "GitHub CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://central.github.com/deployments/desktop/desktopapp/latest/darwin",
      host: "GitHub CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "dbeaver",
  name: "DBeaver Community",
  iconUrl: "https://www.google.com/s2/favicons?domain=dbeaver.io&sz=64",
  summary:
    "Free, open-source universal database tool supporting PostgreSQL, MySQL, SQLite, MongoDB, and 80+ other databases with a full SQL editor.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "DBeaver Corp",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["database", "sql", "developer", "open-source", "free"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/dbeaver/dbeaver",
  releaseNotesUrl: "https://github.com/dbeaver/dbeaver/releases/latest",
  license: "Apache-2.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://dbeaver.io/download/" },
    { type: "GitHub Releases", url: "https://github.com/dbeaver/dbeaver/releases/latest" },
    { type: "Source Code", url: "https://github.com/dbeaver/dbeaver" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/dbeaver/dbeaver/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/dbeaver/dbeaver/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},
{
  slug: "warp",
  name: "Warp",
  iconUrl: "https://www.google.com/s2/favicons?domain=warp.dev&sz=64",
  summary:
    "Modern AI-powered terminal with IDE-style editing, command history search, collaborative sessions, and an integrated AI assistant.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "Warp",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["terminal", "ai", "developer", "free", "popular"],
  popularityLabel: "Popular",
  pricing: "Free tier",
  channels: [{ type: "Website", url: "https://www.warp.dev/download" }],
  directDownloads: [
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.warp.dev/download",
      host: "Warp CDN",
      fileType: "DMG"
    },
    {
      label: "Linux",
      platform: "Linux",
      url: "https://www.warp.dev/download",
      host: "Warp CDN",
      fileType: "DEB"
    }
  ]
},
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

{
  slug: "notepadplusplus",
  name: "Notepad++",
  iconUrl: "https://www.google.com/s2/favicons?domain=notepad-plus-plus.org&sz=64",
  summary:
    "Free, open-source Windows text and code editor with syntax highlighting for 80+ languages, macros, multi-document tabs, and plugins.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "Don Ho",
  platforms: ["Windows"],
  tags: ["editor", "text", "code", "windows", "open-source", "free", "popular"],
  popularityLabel: "Most used",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/notepad-plus-plus/notepad-plus-plus",
  releaseNotesUrl: "https://github.com/notepad-plus-plus/notepad-plus-plus/releases/latest",
  license: "GPL-3.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://notepad-plus-plus.org/downloads/" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NQ2BKBTDC9H" },
    { type: "GitHub Releases", url: "https://github.com/notepad-plus-plus/notepad-plus-plus/releases/latest" },
    { type: "Source Code", url: "https://github.com/notepad-plus-plus/notepad-plus-plus" }
  ],
  directDownloads: [
    {
      label: "Windows installer (64-bit)",
      platform: "Windows",
      url: "https://github.com/notepad-plus-plus/notepad-plus-plus/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    }
  ]
},
{
  slug: "sublime-text",
  name: "Sublime Text",
  iconUrl: "https://www.google.com/s2/favicons?domain=sublimetext.com&sz=64",
  summary:
    "Lightweight, fast code editor with a powerful command palette, multiple cursors, split editing, and a rich package ecosystem.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "Sublime HQ",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["editor", "code", "developer", "free"],
  pricing: "Free (evaluation)",
  channels: [{ type: "Website", url: "https://www.sublimetext.com/download" }],
  directDownloads: [
    {
      label: "Windows installer (64-bit)",
      platform: "Windows",
      url: "https://www.sublimetext.com/download_thanks?target=win-x64",
      host: "Sublime HQ CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.sublimetext.com/download_thanks?target=mac",
      host: "Sublime HQ CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "jetbrains-toolbox",
  name: "JetBrains Toolbox",
  iconUrl: "https://www.google.com/s2/favicons?domain=jetbrains.com&sz=64",
  summary:
    "Free app manager for all JetBrains IDEs — installs, updates, and rolls back IntelliJ IDEA, PyCharm, WebStorm, Rider, and more from one place.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "JetBrains",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["ide", "developer", "java", "kotlin", "python", "free"],
  pricing: "Free",
  channels: [{ type: "Website", url: "https://www.jetbrains.com/toolbox-app/" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://www.jetbrains.com/toolbox-app/download/download-thanks.html?platform=windows",
      host: "JetBrains CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.jetbrains.com/toolbox-app/download/download-thanks.html?platform=mac",
      host: "JetBrains CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "android-studio",
  name: "Android Studio",
  iconUrl: "https://www.google.com/s2/favicons?domain=developer.android.com&sz=64",
  summary:
    "Google's official IDE for Android app development with a visual layout editor, emulator, profiler, and full Kotlin/Java toolchain.",
  category: "Developer Tools",
  audience: "Curated",
  developer: "Google",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["android", "ide", "developer", "google", "kotlin", "java", "free"],
  pricing: "Free",
  channels: [{ type: "Website", url: "https://developer.android.com/studio" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://developer.android.com/studio",
      host: "Google CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://developer.android.com/studio",
      host: "Google CDN",
      fileType: "DMG"
    }
  ]
},

// ── Browsers ──────────────────────────────────────────────────────────────
{
  slug: "brave",
  name: "Brave Browser",
  iconUrl: "https://www.google.com/s2/favicons?domain=brave.com&sz=64",
  summary:
    "Privacy-focused Chromium browser with built-in ad blocking, fingerprint protection, and an optional crypto rewards system.",
  category: "Browsers",
  audience: "Curated",
  developer: "Brave Software",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
  tags: ["browser", "privacy", "ad-blocker", "chromium", "free", "popular"],
  popularityLabel: "Popular",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/brave/brave-browser",
  releaseNotesUrl: "https://github.com/brave/brave-browser/releases/latest",
  license: "MPL-2.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://brave.com/download/" },
    { type: "Source Code", url: "https://github.com/brave/brave-browser" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://laptop-updates.brave.com/latest/winx64",
      host: "Brave CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://laptop-updates.brave.com/latest/osx",
      host: "Brave CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "firefox",
  name: "Firefox",
  iconUrl: "https://www.google.com/s2/favicons?domain=firefox.com&sz=64",
  summary:
    "Mozilla's open-source browser with strong privacy defaults, extensive extensions, and no ties to a big-tech advertising ecosystem.",
  category: "Browsers",
  audience: "Curated",
  developer: "Mozilla",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
  tags: ["browser", "privacy", "open-source", "free", "popular"],
  popularityLabel: "Most used",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/mozilla/gecko-dev",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.mozilla.org/en-US/firefox/new/" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/firefox-private-safe-browser/id989804926" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NZVDKPMR9RD" },
    { type: "Source Code", url: "https://github.com/mozilla/gecko-dev" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://download.mozilla.org/?product=firefox-latest-ssl&os=win64&lang=en-US",
      host: "Mozilla CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://download.mozilla.org/?product=firefox-latest-ssl&os=osx&lang=en-US",
      host: "Mozilla CDN",
      fileType: "DMG"
    }
  ]
},

{
  slug: "arc",
  name: "Arc Browser",
  iconUrl: "https://www.google.com/s2/favicons?domain=arc.net&sz=64",
  summary:
    "Chromium browser reimagined with Spaces, Easels, and a sidebar — designed for power users who live in their browser all day.",
  category: "Browsers",
  audience: "Curated",
  developer: "The Browser Company",
  platforms: ["Windows", "macOS", "iOS"],
  tags: ["browser", "chromium", "productivity", "free"],
  popularityLabel: "Popular",
  pricing: "Free",
  channels: [{ type: "Website", url: "https://arc.net/download" }],
  directDownloads: [
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://releases.arc.net/release/Arc-latest.dmg",
      host: "Arc CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "opera-gx",
  name: "Opera GX",
  iconUrl: "https://www.google.com/s2/favicons?domain=opera.com&sz=64",
  summary:
    "Gaming-focused browser with CPU/RAM limiters, GX Corner for game news, Twitch integration, and a customisable dark aesthetic.",
  category: "Browsers",
  audience: "Curated",
  developer: "Opera",
  platforms: ["Windows", "macOS", "iOS", "Android"],
  tags: ["browser", "gaming", "chromium", "free"],
  pricing: "Free",
  channels: [{ type: "Website", url: "https://www.opera.com/gx/download" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://net.geo.opera.com/opera_gx/stable/windows",
      host: "Opera CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://net.geo.opera.com/opera_gx/stable/macos",
      host: "Opera CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "librewolf",
  name: "LibreWolf",
  iconUrl: "https://www.google.com/s2/favicons?domain=librewolf.net&sz=64",
  summary:
    "Hardened Firefox fork with telemetry removed, strict privacy defaults, uBlock Origin pre-installed, and no Mozilla account required.",
  category: "Browsers",
  audience: "Curated",
  developer: "LibreWolf Community",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["browser", "privacy", "firefox", "open-source", "free"],
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://librewolf.net/installation/" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://librewolf.net/installation/windows/",
      host: "LibreWolf CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://librewolf.net/installation/macos/",
      host: "LibreWolf CDN",
      fileType: "DMG"
    }
  ]
},

// ── Design ─────────────────────────────────────────────────────────────────
{
  slug: "figma",
  name: "Figma",
  iconUrl: "https://www.google.com/s2/favicons?domain=figma.com&sz=64",
  summary:
    "Collaborative interface design tool with real-time multiplayer, components, prototyping, and a large community plugin library.",
  category: "Design",
  audience: "Curated",
  developer: "Figma",
  platforms: ["Windows", "macOS", "Web"],
  tags: ["design", "ui", "ux", "prototyping", "collaboration", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://www.figma.com/downloads/" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/figma/id1152002983" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9P8NPM3CJZLH" }
  ]
},
{
  slug: "gimp",
  name: "GIMP",
  iconUrl: "https://www.google.com/s2/favicons?domain=gimp.org&sz=64",
  summary:
    "Free, open-source image editor with layers, masks, filters, and scripting — a capable alternative to Photoshop for most tasks.",
  category: "Design",
  audience: "Curated",
  developer: "GIMP Team",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["image-editor", "design", "photo", "open-source", "free"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://gitlab.gnome.org/GNOME/gimp",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.gimp.org/downloads/" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://www.gimp.org/downloads/",
      host: "GIMP CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.gimp.org/downloads/",
      host: "GIMP CDN",
      fileType: "DMG"
    }
  ]
},

{
  slug: "blender",
  name: "Blender",
  iconUrl: "https://www.google.com/s2/favicons?domain=blender.org&sz=64",
  summary:
    "Free, open-source 3D creation suite covering modelling, rigging, animation, simulation, rendering, compositing, and motion tracking.",
  category: "Design",
  audience: "Curated",
  developer: "Blender Foundation",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["3d", "animation", "modelling", "open-source", "free", "popular"],
  popularityLabel: "Most used",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/blender/blender",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.blender.org/download/" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9PP3C07GTVRH" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/blender/id1415736492" },
    { type: "Source Code", url: "https://github.com/blender/blender" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://www.blender.org/download/",
      host: "Blender CDN",
      fileType: "MSI"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.blender.org/download/",
      host: "Blender CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "inkscape",
  name: "Inkscape",
  iconUrl: "https://www.google.com/s2/favicons?domain=inkscape.org&sz=64",
  summary:
    "Professional open-source vector graphics editor compatible with SVG, with tools for illustration, logos, diagrams, and icon design.",
  category: "Design",
  audience: "Curated",
  developer: "Inkscape Community",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["vector", "svg", "design", "illustration", "open-source", "free"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://gitlab.com/inkscape/inkscape",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://inkscape.org/release/" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9PD9BHGLFC7H" }
  ],
  directDownloads: [
    {
      label: "Windows installer (64-bit)",
      platform: "Windows",
      url: "https://inkscape.org/release/",
      host: "Inkscape CDN",
      fileType: "MSI"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://inkscape.org/release/",
      host: "Inkscape CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "krita",
  name: "Krita",
  iconUrl: "https://www.google.com/s2/favicons?domain=krita.org&sz=64",
  summary:
    "Free, open-source digital painting app built for concept artists, illustrators, and animators — with a huge brush library and non-destructive layers.",
  category: "Design",
  audience: "Curated",
  developer: "Krita Foundation",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["painting", "illustration", "design", "open-source", "free"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/KDE/krita",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://krita.org/en/download/" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9N6X57ZGRW96" },
    { type: "Source Code", url: "https://github.com/KDE/krita" }
  ],
  directDownloads: [
    {
      label: "Windows installer (64-bit)",
      platform: "Windows",
      url: "https://krita.org/en/download/",
      host: "Krita CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://krita.org/en/download/",
      host: "Krita CDN",
      fileType: "DMG"
    }
  ]
},

// ── Office ─────────────────────────────────────────────────────────────────
{
  slug: "libreoffice",
  name: "LibreOffice",
  iconUrl: "https://www.google.com/s2/favicons?domain=libreoffice.org&sz=64",
  summary:
    "Powerful open-source office suite with Writer, Calc, Impress, Draw, Base, and Math — a full Microsoft Office alternative with no subscription.",
  category: "Office",
  audience: "Curated",
  developer: "The Document Foundation",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["office", "word-processor", "spreadsheet", "presentation", "open-source", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free",
  channels: [{ type: "Website", url: "https://www.libreoffice.org/download/libreoffice/" }],
  directDownloads: [
    {
      label: "Windows installer (64-bit)",
      platform: "Windows",
      url: "https://www.libreoffice.org/download/libreoffice/",
      host: "TDF CDN",
      fileType: "MSI"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.libreoffice.org/download/libreoffice/",
      host: "TDF CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "onlyoffice",
  name: "ONLYOFFICE",
  iconUrl: "https://www.google.com/s2/favicons?domain=onlyoffice.com&sz=64",
  summary:
    "Office suite with high Microsoft Office compatibility — edit .docx, .xlsx, and .pptx files natively with a modern ribbon UI.",
  category: "Office",
  audience: "Curated",
  developer: "Ascensio System SIA",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["office", "word-processor", "spreadsheet", "presentation", "free"],
  pricing: "Free (desktop)",
  channels: [{ type: "Website", url: "https://www.onlyoffice.com/download-desktop.aspx" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://www.onlyoffice.com/download-desktop.aspx",
      host: "ONLYOFFICE CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://www.onlyoffice.com/download-desktop.aspx",
      host: "ONLYOFFICE CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "wps-office",
  name: "WPS Office",
  iconUrl: "https://www.google.com/s2/favicons?domain=wps.com&sz=64",
  summary:
    "Lightweight office suite with Writer, Spreadsheets, and Presentation — strong Microsoft Office compatibility and a clean modern interface.",
  category: "Office",
  audience: "Curated",
  developer: "Kingsoft",
  platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
  tags: ["office", "word-processor", "spreadsheet", "presentation", "free"],
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://www.wps.com/download/" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/wps-office-pdf-word-sheet/id1468073139" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NBLGGH5XHKM" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://www.wps.com/download/",
      host: "WPS CDN",
      fileType: "EXE"
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
  slug: "open-webui",
  name: "Open WebUI",
  iconUrl: "https://www.google.com/s2/favicons?domain=openwebui.com&sz=64",
  summary:
    "Self-hosted, feature-rich web interface for interacting with Ollama and OpenAI-compatible models, with RAG, tools, and user management.",
  category: "AI Tools",
  audience: "Curated",
  developer: "Open WebUI",
  platforms: ["Windows", "macOS", "Linux", "Web"],
  tags: ["ai", "llm", "self-hosted", "open-source", "free", "popular", "github"],
  popularityLabel: "Popular on GitHub",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/open-webui/open-webui",
  releaseNotesUrl: "https://github.com/open-webui/open-webui/releases/latest",
  license: "MIT",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://openwebui.com/" },
    { type: "GitHub Releases", url: "https://github.com/open-webui/open-webui/releases/latest" },
    { type: "Source Code", url: "https://github.com/open-webui/open-webui" }
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
{
  slug: "chatgpt-desktop",
  name: "ChatGPT",
  iconUrl: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=64",
  summary:
    "OpenAI's official desktop app for ChatGPT with voice mode, Vision, file uploads, and quick access via hotkey from any screen.",
  category: "AI Tools",
  audience: "Curated",
  developer: "OpenAI",
  platforms: ["Windows", "macOS", "iOS", "Android"],
  tags: ["ai", "chatgpt", "openai", "chat", "free", "popular"],
  popularityLabel: "Most used",
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://openai.com/chatgpt/download/" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/chatgpt/id6448311069" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NT1R1C2HH7J" }
  ],
  directDownloads: [
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://persistent.oaistatic.com/sidekick/public/ChatGPT_Desktop_public_latest.dmg",
      host: "OpenAI CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "claude-desktop",
  name: "Claude",
  iconUrl: "https://www.google.com/s2/favicons?domain=claude.ai&sz=64",
  summary:
    "Anthropic's official desktop app for Claude with file and image uploads, project memory, and MCP server support for agentic workflows.",
  category: "AI Tools",
  audience: "Curated",
  developer: "Anthropic",
  platforms: ["Windows", "macOS"],
  tags: ["ai", "claude", "anthropic", "chat", "agents", "free", "popular"],
  popularityLabel: "Popular",
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://claude.ai/download" }
  ],
  directDownloads: [
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://claude.ai/download",
      host: "Anthropic CDN",
      fileType: "DMG"
    },
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://claude.ai/download",
      host: "Anthropic CDN",
      fileType: "EXE"
    }
  ]
},
{
  slug: "windsurf",
  name: "Windsurf",
  iconUrl: "https://www.google.com/s2/favicons?domain=windsurf.com&sz=64",
  summary:
    "AI-powered code editor by Codeium with Cascade — a deep agentic coding assistant that understands full repo context and can take multi-step actions.",
  category: "AI Tools",
  audience: "Curated",
  developer: "Codeium",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["ai", "editor", "code", "developer", "free", "popular"],
  popularityLabel: "Popular",
  pricing: "Free tier",
  channels: [{ type: "Website", url: "https://windsurf.com/download" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://windsurf.com/download",
      host: "Windsurf CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://windsurf.com/download",
      host: "Windsurf CDN",
      fileType: "DMG"
    }
  ]
},
{
  slug: "perplexity",
  name: "Perplexity",
  iconUrl: "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=64",
  summary:
    "AI-powered answer engine that searches the web in real time and synthesises cited, up-to-date answers with follow-up conversation.",
  category: "AI Tools",
  audience: "Curated",
  developer: "Perplexity AI",
  platforms: ["Windows", "macOS", "iOS", "Android", "Web"],
  tags: ["ai", "search", "chat", "free", "popular"],
  popularityLabel: "Popular",
  pricing: "Free tier",
  channels: [
    { type: "Website", url: "https://www.perplexity.ai/hub/app" },
    { type: "Mac App Store", url: "https://apps.apple.com/us/app/perplexity-ask-anything/id1668000334" },
    { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9NB0NB3MLQTM" }
  ]
},
{
  slug: "gpt4all",
  name: "GPT4All",
  iconUrl: "https://www.google.com/s2/favicons?domain=gpt4all.io&sz=64",
  summary:
    "Free, privacy-first desktop app for running open-source LLMs locally with no internet required — supports CPU and GPU inference.",
  category: "AI Tools",
  audience: "Curated",
  developer: "Nomic AI",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["ai", "llm", "local-ai", "privacy", "open-source", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/nomic-ai/gpt4all",
  releaseNotesUrl: "https://github.com/nomic-ai/gpt4all/releases/latest",
  license: "MIT",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.nomic.ai/gpt4all" },
    { type: "GitHub Releases", url: "https://github.com/nomic-ai/gpt4all/releases/latest" },
    { type: "Source Code", url: "https://github.com/nomic-ai/gpt4all" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/nomic-ai/gpt4all/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/nomic-ai/gpt4all/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},
{
  slug: "pinokio",
  name: "Pinokio",
  iconUrl: "https://www.google.com/s2/favicons?domain=pinokio.computer&sz=64",
  summary:
    "AI app browser and one-click installer for running Stable Diffusion, ComfyUI, Open WebUI, and hundreds of other AI projects locally.",
  category: "AI Tools",
  audience: "Curated",
  developer: "Pinokio",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["ai", "installer", "local-ai", "stable-diffusion", "open-source", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/pinokiocomputer/pinokio",
  releaseNotesUrl: "https://github.com/pinokiocomputer/pinokio/releases/latest",
  license: "MIT",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://pinokio.computer/" },
    { type: "GitHub Releases", url: "https://github.com/pinokiocomputer/pinokio/releases/latest" },
    { type: "Source Code", url: "https://github.com/pinokiocomputer/pinokio" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/pinokiocomputer/pinokio/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://github.com/pinokiocomputer/pinokio/releases/latest",
      host: "GitHub Releases",
      fileType: "DMG"
    }
  ]
},
{
  slug: "comfyui",
  name: "ComfyUI",
  iconUrl: "https://www.google.com/s2/favicons?domain=comfy.org&sz=64",
  summary:
    "Powerful node-based UI for Stable Diffusion and other image/video generation models, with fine-grained workflow control and a huge extension ecosystem.",
  category: "AI Tools",
  audience: "Curated",
  developer: "Comfy Org",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["ai", "image-generation", "stable-diffusion", "open-source", "free", "popular", "github"],
  popularityLabel: "Popular on GitHub",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/comfyanonymous/ComfyUI",
  releaseNotesUrl: "https://github.com/comfyanonymous/ComfyUI/releases/latest",
  license: "GPL-3.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://www.comfy.org/download" },
    { type: "GitHub Releases", url: "https://github.com/comfyanonymous/ComfyUI/releases/latest" },
    { type: "Source Code", url: "https://github.com/comfyanonymous/ComfyUI" }
  ],
  directDownloads: [
    {
      label: "Windows (standalone)",
      platform: "Windows",
      url: "https://github.com/comfyanonymous/ComfyUI/releases/latest",
      host: "GitHub Releases",
      fileType: "ZIP"
    }
  ]
},
{
  slug: "flowise",
  name: "Flowise",
  iconUrl: "https://www.google.com/s2/favicons?domain=flowiseai.com&sz=64",
  summary:
    "Open-source drag-and-drop tool for building LLM apps, RAG pipelines, and AI agents visually — self-hostable with 100+ integrations.",
  category: "AI Tools",
  audience: "Curated",
  developer: "FlowiseAI",
  platforms: ["Windows", "macOS", "Linux", "Web"],
  tags: ["ai", "llm", "agents", "rag", "no-code", "open-source", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/FlowiseAI/Flowise",
  releaseNotesUrl: "https://github.com/FlowiseAI/Flowise/releases/latest",
  license: "Apache-2.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://flowiseai.com/" },
    { type: "GitHub Releases", url: "https://github.com/FlowiseAI/Flowise/releases/latest" },
    { type: "Source Code", url: "https://github.com/FlowiseAI/Flowise" }
  ]
},
{
  slug: "n8n",
  name: "n8n",
  iconUrl: "https://www.google.com/s2/favicons?domain=n8n.io&sz=64",
  summary:
    "Fair-code workflow automation platform with 400+ integrations, AI agent nodes, and self-hosting — build complex automations visually or in code.",
  category: "AI Tools",
  audience: "Curated",
  developer: "n8n GmbH",
  platforms: ["Windows", "macOS", "Linux", "Web"],
  tags: ["ai", "automation", "workflow", "agents", "open-source", "free", "github"],
  popularityLabel: "Popular on GitHub",
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/n8n-io/n8n",
  releaseNotesUrl: "https://github.com/n8n-io/n8n/releases/latest",
  license: "SEE LICENSE",
  pricing: "Free (self-hosted)",
  channels: [
    { type: "Website", url: "https://n8n.io/download/" },
    { type: "GitHub Releases", url: "https://github.com/n8n-io/n8n/releases/latest" },
    { type: "Source Code", url: "https://github.com/n8n-io/n8n" }
  ]
},
{
  slug: "invoke-ai",
  name: "InvokeAI",
  iconUrl: "https://www.google.com/s2/favicons?domain=invoke.com&sz=64",
  summary:
    "Professional open-source Stable Diffusion toolkit with a node-based canvas, ControlNet, IP-Adapter, model management, and a polished UI.",
  category: "AI Tools",
  audience: "Curated",
  developer: "Invoke AI",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["ai", "image-generation", "stable-diffusion", "open-source", "free", "github"],
  featuredOnGitHub: true,
  sourceCodeUrl: "https://github.com/invoke-ai/InvokeAI",
  releaseNotesUrl: "https://github.com/invoke-ai/InvokeAI/releases/latest",
  license: "Apache-2.0",
  pricing: "Free",
  channels: [
    { type: "Website", url: "https://invoke.com/downloads" },
    { type: "GitHub Releases", url: "https://github.com/invoke-ai/InvokeAI/releases/latest" },
    { type: "Source Code", url: "https://github.com/invoke-ai/InvokeAI" }
  ],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://github.com/invoke-ai/InvokeAI/releases/latest",
      host: "GitHub Releases",
      fileType: "EXE"
    },
    {
      label: "macOS PKG",
      platform: "macOS",
      url: "https://github.com/invoke-ai/InvokeAI/releases/latest",
      host: "GitHub Releases",
      fileType: "PKG"
    }
  ]
},
{
  slug: "msty",
  name: "Msty",
  iconUrl: "https://www.google.com/s2/favicons?domain=msty.app&sz=64",
  summary:
    "Offline-first AI chat app that runs local models via Ollama alongside cloud APIs — compare multiple models side-by-side in a clean interface.",
  category: "AI Tools",
  audience: "Curated",
  developer: "Msty",
  platforms: ["Windows", "macOS", "Linux"],
  tags: ["ai", "llm", "local-ai", "chat", "free"],
  pricing: "Free",
  channels: [{ type: "Website", url: "https://msty.app/" }],
  directDownloads: [
    {
      label: "Windows installer",
      platform: "Windows",
      url: "https://msty.app/",
      host: "Msty CDN",
      fileType: "EXE"
    },
    {
      label: "macOS DMG",
      platform: "macOS",
      url: "https://msty.app/",
      host: "Msty CDN",
      fileType: "DMG"
    }
  ]
},
];

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function inferPlatform(label?: string, assetName?: string): DownloadPlatform | null {
  const haystack = normalizeText(`${label ?? ""} ${assetName ?? ""}`);

  if (haystack.includes("mac") || haystack.includes("osx")) return "macOS";
  if (haystack.includes("windows") || haystack.includes("win64") || haystack.includes("win32")) {
    return "Windows";
  }
  if (haystack.includes("linux")) return "Linux";
  if (haystack.includes("android")) return "Android";
  if (haystack.includes(" ios ") || haystack.startsWith("ios ") || haystack.endsWith(" ios")) {
    return "iOS";
  }
  if (haystack.includes("web")) return "Web";

  return null;
}

function inferFileType(assetName?: string): string | undefined {
  if (!assetName) return undefined;

  const lower = assetName.toLowerCase();
  if (lower.endsWith(".tar.gz")) return "TAR.GZ";
  if (lower.endsWith(".msixbundle")) return "MSIXBUNDLE";
  if (lower.endsWith(".appimage")) return "APPIMAGE";

  const extension = lower.split(".").pop();
  return extension ? extension.toUpperCase() : undefined;
}

function cloneReleaseMetadataEntry(
  releaseMetadata?: DownloadReleaseMetadataEntry
): DownloadReleaseMetadataEntry | undefined {
  if (!releaseMetadata) {
    return undefined;
  }

  return {
    ...releaseMetadata,
    artifacts: Object.fromEntries(
      Object.entries(releaseMetadata.artifacts).map(([label, artifact]) => [label, { ...artifact }])
    )
  };
}

function getReleaseMetadataEntry(slug: string): DownloadReleaseMetadataEntry | undefined {
  return downloadReleaseMetadata.entries?.[slug];
}

function getReleaseArtifactMatch(
  artifact: DirectDownloadArtifact,
  releaseMetadata?: DownloadReleaseMetadataEntry
): DownloadReleaseMetadataArtifact | undefined {
  if (!releaseMetadata) {
    return undefined;
  }

  const releaseArtifacts = Object.entries(releaseMetadata.artifacts);
  if (releaseArtifacts.length === 0) {
    return undefined;
  }

  const normalizedLabel = normalizeText(artifact.label);
  const exactMatch = releaseArtifacts.find(([label]) => normalizeText(label) === normalizedLabel);
  if (exactMatch) {
    return exactMatch[1];
  }

  const platformMatches = releaseArtifacts.filter((entry) => {
    const [label, currentArtifact] = entry;
    return inferPlatform(label, currentArtifact.assetName) === artifact.platform;
  });

  if (platformMatches.length === 1) {
    return platformMatches[0][1];
  }

  const normalizedFileType = normalizeText(artifact.fileType ?? "");
  if (normalizedFileType) {
    const typedPlatformMatches = platformMatches.filter((entry) => {
      const fileType = inferFileType(entry[1].assetName);
      return normalizeText(fileType ?? "") === normalizedFileType;
    });

    if (typedPlatformMatches.length === 1) {
      return typedPlatformMatches[0][1];
    }
  }

  return undefined;
}

function hydrateDirectDownloadArtifact(
  artifact: DirectDownloadArtifact,
  releaseMetadata?: DownloadReleaseMetadataEntry
): DirectDownloadArtifact {
  const matchedReleaseArtifact = getReleaseArtifactMatch(artifact, releaseMetadata);

  return {
    ...artifact,
    url: matchedReleaseArtifact?.resolvedUrl ?? artifact.url,
    version: matchedReleaseArtifact?.version ?? artifact.version,
    fileType: artifact.fileType ?? inferFileType(matchedReleaseArtifact?.assetName),
    fileSize: matchedReleaseArtifact?.fileSize ?? artifact.fileSize,
    checksumSha256: matchedReleaseArtifact?.checksumSha256 ?? artifact.checksumSha256
  };
}

function cloneDownloadEntry(entry: DownloadEntry): DownloadEntry {
  return {
    ...entry,
    platforms: [...entry.platforms],
    tags: [...entry.tags],
    channels: entry.channels.map((channel) => ({ ...channel })),
    directDownloads: entry.directDownloads?.map((artifact) => ({ ...artifact })),
    releaseMetadata: cloneReleaseMetadataEntry(entry.releaseMetadata)
  };
}

function hydrateDownloadEntry(entry: DownloadEntry): DownloadEntry {
  const releaseMetadata = getReleaseMetadataEntry(entry.slug);

  return {
    ...entry,
    platforms: [...entry.platforms],
    tags: [...entry.tags],
    channels: entry.channels.map((channel) => ({ ...channel })),
    directDownloads: entry.directDownloads?.map((artifact) =>
      hydrateDirectDownloadArtifact(artifact, releaseMetadata)
    ),
    releaseMetadata: cloneReleaseMetadataEntry(releaseMetadata)
  };
}

const hydratedDownloadsRegistry = downloadsRegistry.map((entry) => hydrateDownloadEntry(entry));

export function getDownloads(): DownloadEntry[] {
  return hydratedDownloadsRegistry.map((entry) => cloneDownloadEntry(entry));
}

export function getDownloadBySlug(slug: string): DownloadEntry | undefined {
  const match = hydratedDownloadsRegistry.find((entry) => entry.slug === slug);
  return match ? cloneDownloadEntry(match) : undefined;
}

export function getDownloadCategories(): string[] {
  return [...new Set(hydratedDownloadsRegistry.map((entry) => entry.category))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function getRelatedDownloads(entry: DownloadEntry, limit = 6): DownloadEntry[] {
  const currentTags = new Set(entry.tags.map((tag) => normalizeText(tag)));

  return hydratedDownloadsRegistry
    .filter((candidate) => candidate.slug !== entry.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => currentTags.has(normalizeText(tag))).length;
      const sameCategory = candidate.category === entry.category ? 1 : 0;
      const sharedPlatforms = candidate.platforms.filter((platform) => entry.platforms.includes(platform)).length;
      const githubBonus = candidate.featuredOnGitHub && entry.featuredOnGitHub ? 1 : 0;
      const score = sameCategory * 5 + sharedTags * 2 + sharedPlatforms + githubBonus;

      return {
        candidate,
        score
      };
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.candidate.name.localeCompare(right.candidate.name)
    )
    .slice(0, limit)
    .map((entry) => cloneDownloadEntry(entry.candidate));
}
