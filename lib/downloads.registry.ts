import downloadReleaseMetadataJson from "@/data/download-release-metadata.json";
import type { DownloadEntry, DownloadReleaseMetadataStore } from "@/types/download";

const downloadEntries: DownloadEntry[] = [
  {
    slug: "windows-terminal",
    name: "Windows Terminal",
    summary:
      "Modern terminal for Windows with tabs, panes, and profiles. Available in Microsoft Store and GitHub Releases.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "Microsoft",
    platforms: ["Windows"],
    tags: ["terminal", "windows", "developer", "microsoft", "github"],
    featuredOnGitHub: true,
    popularityLabel: "Popular on GitHub",
    sourceCodeUrl: "https://github.com/microsoft/terminal",
    releaseNotesUrl: "https://github.com/microsoft/terminal/releases/latest",
    license: "MIT",
    pricing: "Free",
    channels: [
      { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9N0DX20HK701" },
      { type: "GitHub Releases", url: "https://github.com/microsoft/terminal/releases/latest" },
      { type: "Source Code", url: "https://github.com/microsoft/terminal" }
    ],
    directDownloads: [
      {
        label: "Windows MSIX bundle",
        platform: "Windows",
        url: "https://github.com/microsoft/terminal/releases/latest",
        host: "GitHub Releases",
        fileType: "MSIXBUNDLE",
        notes: "Synced to the latest stable Windows Terminal MSIX bundle asset when metadata is refreshed."
      }
    ]
  },
  {
    slug: "xcode",
    name: "Xcode",
    summary:
      "Apple's IDE for macOS and Apple platform development. Distributed through the Mac App Store.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "Apple",
    platforms: ["macOS"],
    tags: ["macos", "developer", "apple", "xcode", "mac-app-store"],
    pricing: "Free",
    channels: [{ type: "Mac App Store", url: "https://apps.apple.com/us/app/xcode/id497799835?mt=12" }]
  },
  {
    slug: "localsend",
    name: "LocalSend",
    summary:
      "Cross-platform local file transfer app. Easy example of a GitHub Releases direct-download distribution model.",
    category: "Utilities",
    audience: "Curated",
    developer: "LocalSend",
    platforms: ["macOS", "Windows", "Linux", "Android", "iOS"],
    tags: ["file-transfer", "cross-platform", "github", "direct-download"],
    featuredOnGitHub: true,
    popularityLabel: "Popular on GitHub",
    sourceCodeUrl: "https://github.com/localsend/localsend",
    releaseNotesUrl: "https://github.com/localsend/localsend/releases/latest",
    license: "Apache-2.0",
    pricing: "Free",
    channels: [
      { type: "GitHub Releases", url: "https://github.com/localsend/localsend/releases/latest" },
      { type: "Source Code", url: "https://github.com/localsend/localsend" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/localsend/localsend/releases/latest",
        host: "GitHub Releases",
        fileType: "EXE/MSIX",
        notes: "Synced to the latest Windows installer asset from GitHub Releases."
      },
      {
        label: "macOS DMG",
        platform: "macOS",
        url: "https://github.com/localsend/localsend/releases/latest",
        host: "GitHub Releases",
        fileType: "DMG",
        notes: "Synced to the latest macOS DMG asset from GitHub Releases."
      }
    ]
  },
  {
    slug: "keepassxc",
    name: "KeePassXC",
    summary:
      "Open-source password manager with desktop builds for macOS, Windows, and Linux published on GitHub Releases.",
    category: "Security",
    audience: "Curated",
    developer: "KeePassXC Team",
    platforms: ["macOS", "Windows", "Linux"],
    tags: ["password-manager", "security", "github", "desktop"],
    featuredOnGitHub: true,
    popularityLabel: "Popular on GitHub",
    sourceCodeUrl: "https://github.com/keepassxreboot/keepassxc",
    releaseNotesUrl: "https://github.com/keepassxreboot/keepassxc/releases/latest",
    license: "GPL-2.0",
    pricing: "Free",
    channels: [
      { type: "GitHub Releases", url: "https://github.com/keepassxreboot/keepassxc/releases/latest" },
      { type: "Source Code", url: "https://github.com/keepassxreboot/keepassxc" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/keepassxreboot/keepassxc/releases/latest",
        host: "GitHub Releases",
        fileType: "MSI/EXE"
      },
      {
        label: "macOS DMG",
        platform: "macOS",
        url: "https://github.com/keepassxreboot/keepassxc/releases/latest",
        host: "GitHub Releases",
        fileType: "DMG"
      }
    ]
  },
  {
    slug: "iina",
    name: "IINA",
    summary:
      "Native macOS media player with modern interface and frequent GitHub Releases distribution.",
    category: "Media",
    audience: "Curated",
    developer: "IINA",
    platforms: ["macOS"],
    tags: ["macos", "media-player", "github", "direct-download"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/iina/iina",
    releaseNotesUrl: "https://github.com/iina/iina/releases/latest",
    license: "GPL-3.0",
    pricing: "Free",
    channels: [
      { type: "GitHub Releases", url: "https://github.com/iina/iina/releases/latest" },
      { type: "Source Code", url: "https://github.com/iina/iina" }
    ],
    directDownloads: [
      {
        label: "macOS DMG",
        platform: "macOS",
        url: "https://github.com/iina/iina/releases/latest",
        host: "GitHub Releases",
        fileType: "DMG"
      }
    ]
  },
  {
    slug: "sharex",
    name: "ShareX",
    summary:
      "Windows screenshot and screen recording utility distributed through GitHub Releases.",
    category: "Productivity",
    audience: "Curated",
    developer: "ShareX Team",
    platforms: ["Windows"],
    tags: ["windows", "screenshot", "screen-recording", "github"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/ShareX/ShareX",
    releaseNotesUrl: "https://github.com/ShareX/ShareX/releases/latest",
    license: "GPL-3.0",
    pricing: "Free",
    channels: [
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
    slug: "flow-launcher",
    name: "Flow Launcher",
    summary:
      "Windows launcher and productivity search tool. GitHub Releases-based direct download example.",
    category: "Productivity",
    audience: "Curated",
    developer: "Flow Launcher Team",
    platforms: ["Windows"],
    tags: ["windows", "launcher", "productivity", "github"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/Flow-Launcher/Flow.Launcher",
    releaseNotesUrl: "https://github.com/Flow-Launcher/Flow.Launcher/releases/latest",
    license: "MIT",
    pricing: "Free",
    channels: [
      { type: "GitHub Releases", url: "https://github.com/Flow-Launcher/Flow.Launcher/releases/latest" },
      { type: "Source Code", url: "https://github.com/Flow-Launcher/Flow.Launcher" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/Flow-Launcher/Flow.Launcher/releases/latest",
        host: "GitHub Releases",
        fileType: "EXE"
      }
    ]
  },
  {
    slug: "flameshot",
    name: "Flameshot",
    summary:
      "Cross-platform screenshot tool with GitHub Releases downloads for desktop platforms.",
    category: "Productivity",
    audience: "Curated",
    developer: "Flameshot",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["screenshot", "cross-platform", "github", "desktop"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/flameshot-org/flameshot",
    releaseNotesUrl: "https://github.com/flameshot-org/flameshot/releases/latest",
    license: "GPL-3.0",
    pricing: "Free",
    channels: [
      { type: "GitHub Releases", url: "https://github.com/flameshot-org/flameshot/releases/latest" },
      { type: "Source Code", url: "https://github.com/flameshot-org/flameshot" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/flameshot-org/flameshot/releases/latest",
        host: "GitHub Releases",
        fileType: "EXE/MSI",
        notes: "Synced to the latest Windows installer asset from GitHub Releases."
      },
      {
        label: "macOS DMG",
        platform: "macOS",
        url: "https://github.com/flameshot-org/flameshot/releases/latest",
        host: "GitHub Releases",
        fileType: "DMG",
        notes: "Synced to the latest macOS DMG asset from GitHub Releases."
      }
    ]
  },
  {
    slug: "joplin",
    name: "Joplin",
    summary:
      "Open-source notes app with desktop installers distributed on GitHub Releases.",
    category: "Productivity",
    audience: "Curated",
    developer: "Joplin",
    platforms: ["Windows", "macOS", "Linux", "Android", "iOS"],
    tags: ["notes", "productivity", "github", "sync"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/laurent22/joplin",
    releaseNotesUrl: "https://github.com/laurent22/joplin/releases/latest",
    license: "AGPL-3.0",
    pricing: "Free",
    channels: [
      { type: "GitHub Releases", url: "https://github.com/laurent22/joplin/releases/latest" },
      { type: "Source Code", url: "https://github.com/laurent22/joplin" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/laurent22/joplin/releases/latest",
        host: "GitHub Releases",
        fileType: "EXE",
        notes: "Synced to the latest Windows desktop installer from GitHub Releases."
      },
      {
        label: "macOS DMG",
        platform: "macOS",
        url: "https://github.com/laurent22/joplin/releases/latest",
        host: "GitHub Releases",
        fileType: "DMG",
        notes: "Synced to the latest macOS desktop DMG from GitHub Releases."
      }
    ]
  },
  {
    slug: "obs-studio",
    name: "OBS Studio",
    summary:
      "Streaming and recording software with open-source repo and GitHub Releases downloads.",
    category: "Media",
    audience: "Curated",
    developer: "OBS Project",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["streaming", "recording", "obs", "github", "video"],
    featuredOnGitHub: true,
    popularityLabel: "Popular on GitHub",
    sourceCodeUrl: "https://github.com/obsproject/obs-studio",
    releaseNotesUrl: "https://github.com/obsproject/obs-studio/releases/latest",
    license: "GPL-2.0",
    pricing: "Free",
    channels: [
      { type: "GitHub Releases", url: "https://github.com/obsproject/obs-studio/releases/latest" },
      { type: "Source Code", url: "https://github.com/obsproject/obs-studio" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/obsproject/obs-studio/releases/latest",
        host: "GitHub Releases",
        fileType: "EXE",
        notes: "Synced to the latest Windows installer asset from GitHub Releases."
      },
      {
        label: "macOS installer",
        platform: "macOS",
        url: "https://github.com/obsproject/obs-studio/releases/latest",
        host: "GitHub Releases",
        fileType: "PKG/DMG",
        notes: "Synced to the latest macOS installer asset from GitHub Releases."
      }
    ]
  },
  {
    slug: "powertoys",
    name: "Microsoft PowerToys",
    summary:
      "Advanced Windows productivity utilities from Microsoft, including FancyZones, PowerRename, and quick launcher features.",
    category: "Productivity",
    audience: "Curated",
    developer: "Microsoft",
    platforms: ["Windows"],
    tags: ["windows", "productivity", "powertoys", "microsoft", "github"],
    featuredOnGitHub: true,
    popularityLabel: "Popular on GitHub",
    sourceCodeUrl: "https://github.com/microsoft/PowerToys",
    releaseNotesUrl: "https://github.com/microsoft/PowerToys/releases/latest",
    license: "MIT",
    pricing: "Free",
    channels: [
      { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/XP89DCGQ3K6VLD" },
      { type: "GitHub Releases", url: "https://github.com/microsoft/PowerToys/releases/latest" },
      { type: "Source Code", url: "https://github.com/microsoft/PowerToys" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/microsoft/PowerToys/releases/latest",
        host: "GitHub Releases",
        fileType: "EXE",
        notes: "Synced to the latest user installer asset from GitHub Releases."
      }
    ]
  },
  {
    slug: "audacity",
    name: "Audacity",
    summary:
      "Free audio editor and recorder with cross-platform installers and frequent open-source releases.",
    category: "Media",
    audience: "Curated",
    developer: "Audacity",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["audio", "editor", "recording", "github", "free"],
    featuredOnGitHub: true,
    popularityLabel: "Popular on GitHub",
    sourceCodeUrl: "https://github.com/audacity/audacity",
    releaseNotesUrl: "https://github.com/audacity/audacity/releases/latest",
    license: "GPL-3.0",
    pricing: "Free",
    channels: [
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
    slug: "handbrake",
    name: "HandBrake",
    summary:
      "Open-source video transcoder for converting media files with broad codec and preset support.",
    category: "Media",
    audience: "Curated",
    developer: "HandBrake Team",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["video", "transcoding", "encoder", "github", "free"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/HandBrake/HandBrake",
    releaseNotesUrl: "https://github.com/HandBrake/HandBrake/releases/latest",
    license: "GPL-2.0",
    pricing: "Free",
    channels: [
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
    slug: "neovim",
    name: "Neovim",
    summary:
      "Modern extensible Vim-based editor with strong plugin ecosystem and cross-platform builds.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "Neovim",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["editor", "developer", "neovim", "github", "cli"],
    featuredOnGitHub: true,
    popularityLabel: "Popular on GitHub",
    sourceCodeUrl: "https://github.com/neovim/neovim",
    releaseNotesUrl: "https://github.com/neovim/neovim/releases/latest",
    license: "Apache-2.0",
    pricing: "Free",
    channels: [
      { type: "GitHub Releases", url: "https://github.com/neovim/neovim/releases/latest" },
      { type: "Source Code", url: "https://github.com/neovim/neovim" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/neovim/neovim/releases/latest",
        host: "GitHub Releases",
        fileType: "MSI"
      },
      {
        label: "macOS package",
        platform: "macOS",
        url: "https://github.com/neovim/neovim/releases/latest",
        host: "GitHub Releases",
        fileType: "TAR.GZ"
      }
    ]
  },
  {
    slug: "ripgrep",
    name: "ripgrep",
    summary:
      "Ultra-fast recursive text search tool used in many developer workflows and editor integrations.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "BurntSushi",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["search", "developer", "terminal", "github", "cli"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/BurntSushi/ripgrep",
    releaseNotesUrl: "https://github.com/BurntSushi/ripgrep/releases/latest",
    license: "MIT OR Unlicense",
    pricing: "Free",
    channels: [
      { type: "GitHub Releases", url: "https://github.com/BurntSushi/ripgrep/releases/latest" },
      { type: "Source Code", url: "https://github.com/BurntSushi/ripgrep" }
    ],
    directDownloads: [
      {
        label: "Windows package",
        platform: "Windows",
        url: "https://github.com/BurntSushi/ripgrep/releases/latest",
        host: "GitHub Releases",
        fileType: "ZIP"
      },
      {
        label: "macOS package",
        platform: "macOS",
        url: "https://github.com/BurntSushi/ripgrep/releases/latest",
        host: "GitHub Releases",
        fileType: "TAR.GZ"
      }
    ]
  },
  {
    slug: "bat",
    name: "bat",
    summary:
      "Cat clone with syntax highlighting and Git integration; popular utility for terminal-heavy workflows.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "sharkdp",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["terminal", "developer", "syntax-highlighting", "github", "cli"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/sharkdp/bat",
    releaseNotesUrl: "https://github.com/sharkdp/bat/releases/latest",
    license: "MIT OR Apache-2.0",
    pricing: "Free",
    channels: [
      { type: "GitHub Releases", url: "https://github.com/sharkdp/bat/releases/latest" },
      { type: "Source Code", url: "https://github.com/sharkdp/bat" }
    ],
    directDownloads: [
      {
        label: "Windows package",
        platform: "Windows",
        url: "https://github.com/sharkdp/bat/releases/latest",
        host: "GitHub Releases",
        fileType: "ZIP"
      },
      {
        label: "macOS package",
        platform: "macOS",
        url: "https://github.com/sharkdp/bat/releases/latest",
        host: "GitHub Releases",
        fileType: "TAR.GZ"
      }
    ]
  },
  {
    slug: "visual-studio-code",
    name: "Visual Studio Code",
    summary:
      "Free cross-platform code editor with rich extension ecosystem and strong support for modern web and cloud workflows.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "Microsoft",
    platforms: ["Windows", "macOS", "Linux", "Web"],
    tags: ["editor", "developer", "microsoft", "extensions", "free"],
    featuredOnGitHub: true,
    popularityLabel: "Popular",
    sourceCodeUrl: "https://github.com/microsoft/vscode",
    releaseNotesUrl: "https://code.visualstudio.com/updates",
    license: "MIT",
    pricing: "Free",
    channels: [
      { type: "Microsoft Store", url: "https://apps.microsoft.com/detail/xp9khm4bk9fz7q" },
      { type: "Website", url: "https://code.visualstudio.com/download" },
      { type: "Source Code", url: "https://github.com/microsoft/vscode" }
    ]
  },
  {
    slug: "github-desktop",
    name: "GitHub Desktop",
    summary:
      "Graphical Git and GitHub client for local repositories, pull requests, and collaborative review workflows.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "GitHub",
    platforms: ["Windows", "macOS"],
    tags: ["git", "github", "desktop", "developer", "free"],
    featuredOnGitHub: true,
    popularityLabel: "Popular on GitHub",
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
        url: "https://github.com/desktop/desktop/releases/latest",
        host: "GitHub Releases",
        fileType: "EXE"
      },
      {
        label: "macOS package",
        platform: "macOS",
        url: "https://github.com/desktop/desktop/releases/latest",
        host: "GitHub Releases",
        fileType: "ZIP"
      }
    ]
  },
  {
    slug: "notepad-plus-plus",
    name: "Notepad++",
    summary:
      "Lightweight Windows source editor with tabbed editing, plugin support, and strong performance on older hardware.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "Notepad++ Team",
    platforms: ["Windows"],
    tags: ["windows", "editor", "notepad++", "github", "free"],
    featuredOnGitHub: true,
    popularityLabel: "Popular on GitHub",
    sourceCodeUrl: "https://github.com/notepad-plus-plus/notepad-plus-plus",
    releaseNotesUrl: "https://github.com/notepad-plus-plus/notepad-plus-plus/releases/latest",
    license: "GPL-3.0",
    pricing: "Free",
    channels: [
      {
        type: "GitHub Releases",
        url: "https://github.com/notepad-plus-plus/notepad-plus-plus/releases/latest"
      },
      { type: "Source Code", url: "https://github.com/notepad-plus-plus/notepad-plus-plus" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/notepad-plus-plus/notepad-plus-plus/releases/latest",
        host: "GitHub Releases",
        fileType: "EXE"
      }
    ]
  },
  {
    slug: "git-for-windows",
    name: "Git for Windows",
    summary:
      "Official Git distribution for Windows with command-line tooling, credential manager, and shell integration.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "Git for Windows",
    platforms: ["Windows"],
    tags: ["git", "windows", "developer", "version-control", "free"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/git-for-windows/git",
    releaseNotesUrl: "https://github.com/git-for-windows/git/releases/latest",
    license: "GPL-2.0",
    pricing: "Free",
    channels: [
      { type: "Website", url: "https://gitforwindows.org/" },
      { type: "GitHub Releases", url: "https://github.com/git-for-windows/git/releases/latest" },
      { type: "Source Code", url: "https://github.com/git-for-windows/git" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/git-for-windows/git/releases/latest",
        host: "GitHub Releases",
        fileType: "EXE"
      }
    ]
  },
  {
    slug: "fd",
    name: "fd",
    summary:
      "Fast, user-friendly find alternative for terminal workflows, commonly used with ripgrep and modern shell setups.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "sharkdp",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["terminal", "developer", "search", "cli", "github"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/sharkdp/fd",
    releaseNotesUrl: "https://github.com/sharkdp/fd/releases/latest",
    license: "MIT OR Apache-2.0",
    pricing: "Free",
    channels: [
      { type: "GitHub Releases", url: "https://github.com/sharkdp/fd/releases/latest" },
      { type: "Source Code", url: "https://github.com/sharkdp/fd" }
    ],
    directDownloads: [
      {
        label: "Windows package",
        platform: "Windows",
        url: "https://github.com/sharkdp/fd/releases/latest",
        host: "GitHub Releases",
        fileType: "ZIP"
      },
      {
        label: "macOS package",
        platform: "macOS",
        url: "https://github.com/sharkdp/fd/releases/latest",
        host: "GitHub Releases",
        fileType: "TAR.GZ"
      }
    ]
  },
  {
    slug: "starship",
    name: "Starship",
    summary:
      "Cross-shell prompt focused on speed and developer context, with prebuilt binaries for major desktop platforms.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "Starship",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["terminal", "prompt", "developer", "cli", "github"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/starship/starship",
    releaseNotesUrl: "https://github.com/starship/starship/releases/latest",
    license: "ISC",
    pricing: "Free",
    channels: [
      { type: "GitHub Releases", url: "https://github.com/starship/starship/releases/latest" },
      { type: "Source Code", url: "https://github.com/starship/starship" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/starship/starship/releases/latest",
        host: "GitHub Releases",
        fileType: "MSI"
      },
      {
        label: "macOS package",
        platform: "macOS",
        url: "https://github.com/starship/starship/releases/latest",
        host: "GitHub Releases",
        fileType: "TAR.GZ"
      }
    ]
  },
  {
    slug: "godot-engine",
    name: "Godot Engine",
    summary:
      "Open-source game engine for 2D and 3D projects with lightweight editor builds and broad community plugin support.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "Godot Engine",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["game-dev", "engine", "developer", "open-source", "github"],
    featuredOnGitHub: true,
    popularityLabel: "Popular on GitHub",
    sourceCodeUrl: "https://github.com/godotengine/godot",
    releaseNotesUrl: "https://github.com/godotengine/godot/releases/latest",
    license: "MIT",
    pricing: "Free",
    channels: [
      { type: "Website", url: "https://godotengine.org/download/" },
      { type: "GitHub Releases", url: "https://github.com/godotengine/godot/releases/latest" },
      { type: "Source Code", url: "https://github.com/godotengine/godot" }
    ],
    directDownloads: [
      {
        label: "Windows package",
        platform: "Windows",
        url: "https://github.com/godotengine/godot/releases/latest",
        host: "GitHub Releases",
        fileType: "ZIP"
      },
      {
        label: "macOS package",
        platform: "macOS",
        url: "https://github.com/godotengine/godot/releases/latest",
        host: "GitHub Releases",
        fileType: "ZIP"
      }
    ]
  },
  {
    slug: "balena-etcher",
    name: "balenaEtcher",
    summary:
      "Free image flasher for USB drives and SD cards with signed installers and open-source release channel.",
    category: "Utilities",
    audience: "Curated",
    developer: "balena",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["usb", "sd-card", "imaging", "utility", "github"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/balena-io/etcher",
    releaseNotesUrl: "https://github.com/balena-io/etcher/releases/latest",
    license: "Apache-2.0",
    pricing: "Free",
    channels: [
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
    slug: "firefox",
    name: "Mozilla Firefox",
    summary:
      "Popular privacy-focused browser with enterprise controls, profile sync, and extension support.",
    category: "Browsers",
    audience: "Curated",
    developer: "Mozilla",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
    tags: ["browser", "privacy", "mozilla", "web", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.mozilla.org/firefox/new/" }]
  },
  {
    slug: "thunderbird",
    name: "Mozilla Thunderbird",
    summary:
      "Free desktop email client with calendar support and multi-account management across major desktop platforms.",
    category: "Productivity",
    audience: "Curated",
    developer: "MZLA Technologies",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["email", "calendar", "productivity", "mozilla", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.thunderbird.net/en-US/download/" }]
  },
  {
    slug: "wireshark",
    name: "Wireshark",
    summary:
      "Industry-standard network protocol analyzer used for packet capture, diagnostics, and network troubleshooting.",
    category: "Networking",
    audience: "Curated",
    developer: "Wireshark Foundation",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["networking", "diagnostics", "packets", "security", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.wireshark.org/download.html" }]
  },
  {
    slug: "inkscape",
    name: "Inkscape",
    summary:
      "Vector graphics editor for illustrations, diagrams, and SVG editing with extensive export options.",
    category: "Design",
    audience: "Curated",
    developer: "Inkscape Project",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["vector", "svg", "design", "illustration", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://inkscape.org/release/" }]
  },
  {
    slug: "krita",
    name: "Krita",
    summary:
      "Open-source digital painting and illustration tool popular for concept art, comics, and texture workflows.",
    category: "Design",
    audience: "Curated",
    developer: "Krita Foundation",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["painting", "illustration", "design", "art", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://krita.org/en/download/" }]
  },
  {
    slug: "blender",
    name: "Blender",
    summary:
      "Free, open-source 3D creation suite for modeling, rendering, animation, and motion graphics.",
    category: "Design",
    audience: "Curated",
    developer: "Blender Foundation",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["3d", "design", "animation", "rendering", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.blender.org/download/" }]
  },
  {
    slug: "gimp",
    name: "GIMP",
    summary:
      "Free cross-platform image editor for photo retouching, composition, and design workflows.",
    category: "Design",
    audience: "Curated",
    developer: "GIMP Team",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["image-editor", "design", "graphics", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.gimp.org/downloads/" }]
  },
  {
    slug: "libreoffice",
    name: "LibreOffice",
    summary:
      "Free and open-source office suite with Writer, Calc, Impress, and strong document compatibility.",
    category: "Productivity",
    audience: "Curated",
    developer: "The Document Foundation",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["office-suite", "documents", "spreadsheets", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.libreoffice.org/download/download-libreoffice/" }]
  },
  {
    slug: "vlc-media-player",
    name: "VLC Media Player",
    summary:
      "Free, open-source media player supporting a wide range of codecs and formats across major platforms.",
    category: "Media",
    audience: "Curated",
    developer: "VideoLAN",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
    tags: ["media-player", "video", "audio", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.videolan.org/vlc/" }]
  }
];

function toHumanFileSize(bytes: number): string | undefined {
  if (!Number.isFinite(bytes) || bytes < 0) return undefined;
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = -1;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value >= 100 ? value.toFixed(0) : value >= 10 ? value.toFixed(1) : value.toFixed(2)} ${units[unitIndex]}`;
}

function normalizeVersion(version?: string): string | undefined {
  if (!version) return undefined;
  return version.replace(/^v/i, "").trim() || undefined;
}

function normalizeReleaseMetadataStore(value: unknown): DownloadReleaseMetadataStore {
  const fallback: DownloadReleaseMetadataStore = {
    version: 1,
    generatedAt: null,
    entries: {}
  };

  if (!value || typeof value !== "object") {
    return fallback;
  }

  const candidate = value as Partial<DownloadReleaseMetadataStore> & { entries?: unknown };
  if (candidate.version !== 1 || typeof candidate.entries !== "object" || candidate.entries === null) {
    return fallback;
  }

  return {
    version: 1,
    generatedAt: typeof candidate.generatedAt === "string" ? candidate.generatedAt : null,
    entries: candidate.entries as DownloadReleaseMetadataStore["entries"]
  };
}

const downloadReleaseMetadataStore = normalizeReleaseMetadataStore(downloadReleaseMetadataJson);

function applyReleaseMetadata(entry: DownloadEntry): DownloadEntry {
  const releaseMeta = downloadReleaseMetadataStore.entries[entry.slug];
  if (!releaseMeta) {
    return entry;
  }

  return {
    ...entry,
    releaseNotesUrl: releaseMeta.releaseUrl ?? entry.releaseNotesUrl,
    channels: entry.channels.map((channel) =>
      channel.type === "GitHub Releases" && releaseMeta.releaseUrl
        ? { ...channel, url: releaseMeta.releaseUrl }
        : channel
    ),
    directDownloads: entry.directDownloads?.map((artifact) => {
      const artifactMeta = releaseMeta.artifacts[artifact.label];
      if (!artifactMeta) return artifact;

      return {
        ...artifact,
        url: artifactMeta.resolvedUrl ?? artifact.url,
        version: artifact.version ?? normalizeVersion(artifactMeta.version),
        fileSize:
          artifact.fileSize ??
          artifactMeta.fileSize ??
          (typeof artifactMeta.fileSizeBytes === "number"
            ? toHumanFileSize(artifactMeta.fileSizeBytes)
            : undefined),
        checksumSha256: artifact.checksumSha256 ?? artifactMeta.checksumSha256
      };
    })
  };
}

function cloneEntry(entry: DownloadEntry): DownloadEntry {
  return {
    ...entry,
    platforms: [...entry.platforms],
    tags: [...entry.tags],
    channels: entry.channels.map((channel) => ({ ...channel })),
    directDownloads: entry.directDownloads?.map((artifact) => ({ ...artifact }))
  };
}

export function getDownloads(): DownloadEntry[] {
  return downloadEntries.map(applyReleaseMetadata).map(cloneEntry);
}

export function getFeaturedGitHubDownloads(): DownloadEntry[] {
  return getDownloads().filter((entry) => entry.featuredOnGitHub);
}

export function getStoreLinkedDownloads(): DownloadEntry[] {
  return getDownloads().filter((entry) =>
    entry.channels.some(
      (channel) => channel.type === "Mac App Store" || channel.type === "Microsoft Store"
    )
  );
}

export function getDirectDownloads(): DownloadEntry[] {
  return getDownloads().filter((entry) => (entry.directDownloads?.length ?? 0) > 0);
}
