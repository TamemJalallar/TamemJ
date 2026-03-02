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
    category: "Code Editors",
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
    category: "Code Editors",
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
    category: "Code Editors",
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
    category: "Code Editors",
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
    popularityLabel: "Most used",
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.mozilla.org/firefox/new/" }]
  },
  {
    slug: "google-chrome",
    name: "Google Chrome",
    summary:
      "Widely used browser with strong performance, enterprise policy controls, and sync across desktop and mobile.",
    category: "Browsers",
    audience: "Curated",
    developer: "Google",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
    tags: ["browser", "google", "web", "sync", "free"],
    popularityLabel: "Most used",
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.google.com/chrome/" }]
  },
  {
    slug: "microsoft-edge",
    name: "Microsoft Edge",
    summary:
      "Chromium-based browser with Microsoft 365 integration, enterprise policy support, and security-focused defaults.",
    category: "Browsers",
    audience: "Curated",
    developer: "Microsoft",
    platforms: ["Windows", "macOS", "iOS", "Android"],
    tags: ["browser", "microsoft", "web", "enterprise", "free"],
    popularityLabel: "Most used",
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.microsoft.com/edge/download" }]
  },
  {
    slug: "opera-browser",
    name: "Opera Browser",
    summary:
      "Cross-platform browser with integrated sidebar tools, ad blocking, and desktop/mobile sync support.",
    category: "Browsers",
    audience: "Curated",
    developer: "Opera",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
    tags: ["browser", "opera", "web", "productivity", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.opera.com/download" }]
  },
  {
    slug: "vivaldi-browser",
    name: "Vivaldi Browser",
    summary:
      "Feature-rich browser focused on advanced tab management, customization, and productivity workflows.",
    category: "Browsers",
    audience: "Curated",
    developer: "Vivaldi Technologies",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
    tags: ["browser", "vivaldi", "web", "productivity", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://vivaldi.com/download/" }]
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
  },
  {
    slug: "brave-browser",
    name: "Brave Browser",
    summary:
      "Privacy-first browser with built-in ad/tracker blocking and cross-device sync across desktop and mobile.",
    category: "Browsers",
    audience: "Curated",
    developer: "Brave Software",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
    tags: ["browser", "privacy", "security", "web", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://brave.com/download/" }]
  },
  {
    slug: "bitwarden",
    name: "Bitwarden",
    summary:
      "Cross-platform password manager with secure vault sync, browser extensions, and desktop/mobile clients.",
    category: "Security",
    audience: "Curated",
    developer: "Bitwarden",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android", "Web"],
    tags: ["password-manager", "security", "privacy", "vault", "free"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/bitwarden/clients",
    pricing: "Free",
    channels: [
      { type: "Website", url: "https://bitwarden.com/download/" },
      { type: "Source Code", url: "https://github.com/bitwarden/clients" }
    ]
  },
  {
    slug: "obsidian",
    name: "Obsidian",
    summary:
      "Markdown knowledge base and note-taking app for linked notes, personal documentation, and project planning.",
    category: "Productivity",
    audience: "Curated",
    developer: "Obsidian",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
    tags: ["notes", "markdown", "knowledge-base", "productivity", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://obsidian.md/download" }]
  },
  {
    slug: "docker-desktop",
    name: "Docker Desktop",
    summary:
      "Local container development environment for building, testing, and running Docker images on desktop systems.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "Docker",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["containers", "docker", "developer", "devops", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.docker.com/products/docker-desktop/" }]
  },
  {
    slug: "postman",
    name: "Postman",
    summary:
      "API development and testing platform for collections, environment management, and request automation.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "Postman",
    platforms: ["Windows", "macOS", "Linux", "Web"],
    tags: ["api", "developer", "testing", "http", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.postman.com/downloads/" }]
  },
  {
    slug: "android-studio",
    name: "Android Studio",
    summary:
      "Official Android IDE with emulator, profiler, and Gradle-based tooling for mobile app development.",
    category: "Code Editors",
    audience: "Curated",
    developer: "Google",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["android", "ide", "developer", "mobile", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://developer.android.com/studio" }]
  },
  {
    slug: "dbeaver-community",
    name: "DBeaver Community",
    summary:
      "Universal SQL client and database administration tool supporting popular engines and JDBC sources.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "DBeaver",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["database", "sql", "developer", "db", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://dbeaver.io/download/" }]
  },
  {
    slug: "signal-desktop",
    name: "Signal Desktop",
    summary:
      "End-to-end encrypted messaging desktop companion with cross-platform clients and security-focused defaults.",
    category: "Security",
    audience: "Curated",
    developer: "Signal Messenger",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
    tags: ["messaging", "security", "privacy", "encrypted", "free"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/signalapp/Signal-Desktop",
    pricing: "Free",
    channels: [
      { type: "Website", url: "https://signal.org/download/" },
      { type: "Source Code", url: "https://github.com/signalapp/Signal-Desktop" }
    ]
  },
  {
    slug: "tailscale",
    name: "Tailscale",
    summary:
      "Secure mesh VPN built on WireGuard for private networking across devices and remote environments.",
    category: "Networking",
    audience: "Curated",
    developer: "Tailscale",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
    tags: ["vpn", "networking", "wireguard", "remote-access", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://tailscale.com/download" }]
  },
  {
    slug: "rustdesk",
    name: "RustDesk",
    summary:
      "Open-source remote desktop and remote support tool with self-hosted options and GitHub Releases binaries.",
    category: "Utilities",
    audience: "Curated",
    developer: "RustDesk",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
    tags: ["remote-desktop", "support", "self-hosted", "github", "free"],
    featuredOnGitHub: true,
    popularityLabel: "Popular on GitHub",
    sourceCodeUrl: "https://github.com/rustdesk/rustdesk",
    releaseNotesUrl: "https://github.com/rustdesk/rustdesk/releases/latest",
    license: "AGPL-3.0",
    pricing: "Free",
    channels: [
      { type: "Website", url: "https://rustdesk.com/" },
      { type: "GitHub Releases", url: "https://github.com/rustdesk/rustdesk/releases/latest" },
      { type: "Source Code", url: "https://github.com/rustdesk/rustdesk" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/rustdesk/rustdesk/releases/latest",
        host: "GitHub Releases",
        fileType: "EXE/MSI"
      },
      {
        label: "macOS DMG",
        platform: "macOS",
        url: "https://github.com/rustdesk/rustdesk/releases/latest",
        host: "GitHub Releases",
        fileType: "DMG"
      }
    ]
  },
  {
    slug: "diagrams-net-desktop",
    name: "diagrams.net Desktop",
    summary:
      "Desktop diagramming app for flowcharts, architecture diagrams, and documentation with offline support.",
    category: "Productivity",
    audience: "Curated",
    developer: "JGraph",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["diagramming", "documentation", "productivity", "github", "free"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/jgraph/drawio-desktop",
    releaseNotesUrl: "https://github.com/jgraph/drawio-desktop/releases/latest",
    license: "Apache-2.0",
    pricing: "Free",
    channels: [
      { type: "Website", url: "https://www.diagrams.net/" },
      { type: "GitHub Releases", url: "https://github.com/jgraph/drawio-desktop/releases/latest" },
      { type: "Source Code", url: "https://github.com/jgraph/drawio-desktop" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/jgraph/drawio-desktop/releases/latest",
        host: "GitHub Releases",
        fileType: "EXE"
      },
      {
        label: "macOS DMG",
        platform: "macOS",
        url: "https://github.com/jgraph/drawio-desktop/releases/latest",
        host: "GitHub Releases",
        fileType: "DMG"
      }
    ]
  },
  {
    slug: "wezterm",
    name: "WezTerm",
    summary:
      "GPU-accelerated terminal emulator with multiplexing, tabs, and strong cross-platform shell workflow support.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "wez",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["terminal", "developer", "shell", "github", "free"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/wez/wezterm",
    releaseNotesUrl: "https://github.com/wez/wezterm/releases/latest",
    license: "MIT",
    pricing: "Free",
    channels: [
      { type: "GitHub Releases", url: "https://github.com/wez/wezterm/releases/latest" },
      { type: "Source Code", url: "https://github.com/wez/wezterm" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/wez/wezterm/releases/latest",
        host: "GitHub Releases",
        fileType: "MSI"
      },
      {
        label: "macOS package",
        platform: "macOS",
        url: "https://github.com/wez/wezterm/releases/latest",
        host: "GitHub Releases",
        fileType: "ZIP"
      }
    ]
  },
  {
    slug: "alacritty",
    name: "Alacritty",
    summary:
      "Fast, GPU-powered terminal emulator with minimal defaults and configuration-driven customization.",
    category: "Developer Tools",
    audience: "Curated",
    developer: "Alacritty",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["terminal", "developer", "cli", "github", "free"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/alacritty/alacritty",
    releaseNotesUrl: "https://github.com/alacritty/alacritty/releases/latest",
    license: "Apache-2.0",
    pricing: "Free",
    channels: [
      { type: "GitHub Releases", url: "https://github.com/alacritty/alacritty/releases/latest" },
      { type: "Source Code", url: "https://github.com/alacritty/alacritty" }
    ],
    directDownloads: [
      {
        label: "Windows package",
        platform: "Windows",
        url: "https://github.com/alacritty/alacritty/releases/latest",
        host: "GitHub Releases",
        fileType: "ZIP"
      },
      {
        label: "macOS package",
        platform: "macOS",
        url: "https://github.com/alacritty/alacritty/releases/latest",
        host: "GitHub Releases",
        fileType: "TAR.GZ"
      }
    ]
  },
  {
    slug: "syncthing",
    name: "Syncthing",
    summary:
      "Peer-to-peer file synchronization tool for private, encrypted sync between desktops, laptops, and servers.",
    category: "Utilities",
    audience: "Curated",
    developer: "Syncthing",
    platforms: ["Windows", "macOS", "Linux", "Android"],
    tags: ["file-sync", "self-hosted", "privacy", "github", "free"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/syncthing/syncthing",
    releaseNotesUrl: "https://github.com/syncthing/syncthing/releases/latest",
    license: "MPL-2.0",
    pricing: "Free",
    channels: [
      { type: "Website", url: "https://syncthing.net/downloads/" },
      { type: "GitHub Releases", url: "https://github.com/syncthing/syncthing/releases/latest" },
      { type: "Source Code", url: "https://github.com/syncthing/syncthing" }
    ],
    directDownloads: [
      {
        label: "Windows package",
        platform: "Windows",
        url: "https://github.com/syncthing/syncthing/releases/latest",
        host: "GitHub Releases",
        fileType: "ZIP"
      },
      {
        label: "macOS package",
        platform: "macOS",
        url: "https://github.com/syncthing/syncthing/releases/latest",
        host: "GitHub Releases",
        fileType: "TAR.GZ"
      }
    ]
  },
  {
    slug: "veracrypt",
    name: "VeraCrypt",
    summary:
      "Disk encryption utility for protecting sensitive files, removable drives, and encrypted containers.",
    category: "Security",
    audience: "Curated",
    developer: "IDRIX",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["encryption", "security", "privacy", "disk", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.veracrypt.fr/en/Downloads.html" }]
  },
  {
    slug: "figma-desktop-app",
    name: "Figma Desktop App",
    summary:
      "Desktop client for Figma design and collaboration workflows with native windowing and performance tuning.",
    category: "Design",
    audience: "Curated",
    developer: "Figma",
    platforms: ["Windows", "macOS"],
    tags: ["figma", "design", "ui-ux", "collaboration", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.figma.com/downloads/" }]
  },
  {
    slug: "cursor-editor",
    name: "Cursor",
    summary:
      "AI-first code editor built on VS Code foundations with chat, inline edits, and multi-file refactors.",
    category: "Code Editors",
    audience: "Curated",
    developer: "Anysphere",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["code-editor", "developer", "ai", "ide", "free"],
    popularityLabel: "Popular",
    pricing: "Free tier",
    channels: [{ type: "Website", url: "https://www.cursor.com/downloads" }]
  },
  {
    slug: "zed-editor",
    name: "Zed",
    summary:
      "High-performance code editor focused on speed, collaborative workflows, and modern developer ergonomics.",
    category: "Code Editors",
    audience: "Curated",
    developer: "Zed Industries",
    platforms: ["macOS", "Linux"],
    tags: ["code-editor", "developer", "collaboration", "ide", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://zed.dev/download" }]
  },
  {
    slug: "vscodium",
    name: "VSCodium",
    summary:
      "Community-driven, telemetry-disabled builds of VS Code for users who want an open-source editor distribution.",
    category: "Code Editors",
    audience: "Curated",
    developer: "VSCodium",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["code-editor", "developer", "vscode", "open-source", "free"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/VSCodium/vscodium",
    releaseNotesUrl: "https://github.com/VSCodium/vscodium/releases/latest",
    license: "MIT",
    pricing: "Free",
    channels: [
      { type: "Website", url: "https://vscodium.com/" },
      { type: "GitHub Releases", url: "https://github.com/VSCodium/vscodium/releases/latest" },
      { type: "Source Code", url: "https://github.com/VSCodium/vscodium" }
    ],
    directDownloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/VSCodium/vscodium/releases/latest",
        host: "GitHub Releases",
        fileType: "EXE"
      },
      {
        label: "macOS package",
        platform: "macOS",
        url: "https://github.com/VSCodium/vscodium/releases/latest",
        host: "GitHub Releases",
        fileType: "ZIP"
      }
    ]
  },
  {
    slug: "sublime-text",
    name: "Sublime Text",
    summary:
      "Lightweight code editor with fast indexing, command palette workflows, and broad language/package support.",
    category: "Code Editors",
    audience: "Curated",
    developer: "Sublime HQ",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["code-editor", "developer", "text-editor", "productivity", "free"],
    pricing: "Free evaluation",
    channels: [{ type: "Website", url: "https://www.sublimetext.com/download" }]
  },
  {
    slug: "notion",
    name: "Notion",
    summary:
      "Connected workspace for notes, docs, databases, and project tracking across desktop, mobile, and web.",
    category: "Productivity",
    audience: "Curated",
    developer: "Notion Labs",
    platforms: ["Windows", "macOS", "iOS", "Android", "Web"],
    tags: ["notes", "docs", "project-management", "productivity", "free"],
    popularityLabel: "Popular",
    pricing: "Free tier",
    channels: [{ type: "Website", url: "https://www.notion.com/desktop" }]
  },
  {
    slug: "canva-desktop",
    name: "Canva",
    summary:
      "Design platform for social graphics, documents, presentations, and templates with fast browser and desktop workflows.",
    category: "Design",
    audience: "Curated",
    developer: "Canva",
    platforms: ["Windows", "macOS", "iOS", "Android", "Web"],
    tags: ["design", "templates", "graphics", "presentations", "free"],
    popularityLabel: "Popular",
    pricing: "Free tier",
    channels: [{ type: "Website", url: "https://www.canva.com/download/" }]
  },
  {
    slug: "penpot",
    name: "Penpot",
    summary:
      "Open-source design and prototyping platform with team collaboration and self-hosting options.",
    category: "Design",
    audience: "Curated",
    developer: "Kaleidos",
    platforms: ["Web"],
    tags: ["design", "prototyping", "open-source", "ui-ux", "free"],
    featuredOnGitHub: true,
    sourceCodeUrl: "https://github.com/penpot/penpot",
    releaseNotesUrl: "https://github.com/penpot/penpot/releases/latest",
    license: "MPL-2.0",
    pricing: "Free",
    channels: [
      { type: "Website", url: "https://penpot.app/" },
      { type: "Source Code", url: "https://github.com/penpot/penpot" }
    ]
  },
  {
    slug: "photopea",
    name: "Photopea",
    summary:
      "Web-based image editor with PSD support for quick edits, mockups, and layered design workflows.",
    category: "Design",
    audience: "Curated",
    developer: "Photopea",
    platforms: ["Web"],
    tags: ["image-editor", "design", "web", "psd", "free"],
    pricing: "Free (ad-supported)",
    channels: [{ type: "Website", url: "https://www.photopea.com/" }]
  },
  {
    slug: "lunacy",
    name: "Lunacy",
    summary:
      "Design app for vector UI work and rapid mockups, including built-in assets and collaboration features.",
    category: "Design",
    audience: "Curated",
    developer: "Icons8",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["design", "ui-ux", "vector", "mockups", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://icons8.com/lunacy" }]
  },
  {
    slug: "heif-image-extensions",
    name: "HEIF Image Extensions",
    summary:
      "Windows extension for viewing HEIF and HEIC image formats in Photos, File Explorer, and supported apps.",
    category: "Media",
    audience: "Curated",
    developer: "Microsoft",
    platforms: ["Windows"],
    tags: ["heic", "heif", "windows", "media", "free"],
    pricing: "Free",
    channels: [{ type: "Microsoft Store", url: "https://apps.microsoft.com/detail/9PMMSR1CGPWG" }]
  },
  {
    slug: "mpv-player",
    name: "mpv",
    summary:
      "Lightweight, scriptable media player for high-quality playback with strong format support and keyboard control.",
    category: "Media",
    audience: "Curated",
    developer: "mpv.io",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["media-player", "video", "audio", "open-source", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://mpv.io/installation/" }]
  },
  {
    slug: "shotcut",
    name: "Shotcut",
    summary:
      "Open-source video editor for timeline-based editing, color correction, transitions, and cross-platform export.",
    category: "Media",
    audience: "Curated",
    developer: "Meltytech",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["video-editor", "media", "editing", "open-source", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://shotcut.org/download/" }]
  },
  {
    slug: "kdenlive",
    name: "Kdenlive",
    summary:
      "Feature-rich non-linear video editor for multi-track editing, effects, and production workflows.",
    category: "Media",
    audience: "Curated",
    developer: "KDE Community",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["video-editor", "media", "kde", "open-source", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://kdenlive.org/en/download/" }]
  },
  {
    slug: "davinci-resolve",
    name: "DaVinci Resolve",
    summary:
      "Professional video editing, color, audio, and visual effects suite with a widely used free edition.",
    category: "Media",
    audience: "Curated",
    developer: "Blackmagic Design",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["video-editor", "color-grading", "media", "post-production", "free"],
    pricing: "Free tier",
    channels: [{ type: "Website", url: "https://www.blackmagicdesign.com/products/davinciresolve" }]
  },
  {
    slug: "plex-media-server",
    name: "Plex Media Server",
    summary:
      "Media server and streaming platform for organizing libraries and accessing media across devices.",
    category: "Media",
    audience: "Curated",
    developer: "Plex",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android", "Web"],
    tags: ["media-server", "streaming", "library", "video", "free"],
    pricing: "Free tier",
    channels: [{ type: "Website", url: "https://www.plex.tv/media-server-downloads/" }]
  },
  {
    slug: "wireguard",
    name: "WireGuard",
    summary:
      "Modern VPN protocol and clients with strong performance, straightforward setup, and broad platform support.",
    category: "Networking",
    audience: "Curated",
    developer: "WireGuard",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
    tags: ["vpn", "networking", "security", "wireguard", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.wireguard.com/install/" }]
  },
  {
    slug: "openvpn-connect",
    name: "OpenVPN Connect",
    summary:
      "Official OpenVPN client for secure remote access to enterprise and personal VPN profiles.",
    category: "Networking",
    audience: "Curated",
    developer: "OpenVPN Inc.",
    platforms: ["Windows", "macOS", "iOS", "Android"],
    tags: ["vpn", "networking", "security", "remote-access", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://openvpn.net/client/" }]
  },
  {
    slug: "putty",
    name: "PuTTY",
    summary:
      "Classic SSH and serial terminal client for Windows with lightweight deployment and broad protocol support.",
    category: "Networking",
    audience: "Curated",
    developer: "Simon Tatham",
    platforms: ["Windows"],
    tags: ["ssh", "terminal", "networking", "windows", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html" }]
  },
  {
    slug: "nmap",
    name: "Nmap",
    summary:
      "Network discovery and security auditing toolkit for host discovery, service enumeration, and troubleshooting.",
    category: "Networking",
    audience: "Curated",
    developer: "Nmap Project",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["networking", "security", "scanner", "diagnostics", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://nmap.org/download.html" }]
  },
  {
    slug: "filezilla-client",
    name: "FileZilla Client",
    summary:
      "Cross-platform FTP, FTPS, and SFTP client for file transfers, site management, and remote publishing.",
    category: "Networking",
    audience: "Curated",
    developer: "FileZilla Project",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["ftp", "sftp", "file-transfer", "networking", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://filezilla-project.org/download.php?type=client" }]
  },
  {
    slug: "angry-ip-scanner",
    name: "Angry IP Scanner",
    summary:
      "Fast open-source network scanner for identifying live hosts, open ports, and basic service data.",
    category: "Networking",
    audience: "Curated",
    developer: "Angry IP Scanner",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["networking", "scanner", "diagnostics", "open-source", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://angryip.org/" }]
  },
  {
    slug: "cloudflare-warp",
    name: "Cloudflare WARP",
    summary:
      "Client app for secure DNS and private traffic routing using Cloudflare's global network.",
    category: "Networking",
    audience: "Curated",
    developer: "Cloudflare",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
    tags: ["networking", "dns", "privacy", "vpn", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://one.one.one.one/" }]
  },
  {
    slug: "winscp",
    name: "WinSCP",
    summary:
      "Windows SFTP, SCP, and FTP client with scripting support and secure file transfer workflows.",
    category: "Networking",
    audience: "Curated",
    developer: "WinSCP",
    platforms: ["Windows"],
    tags: ["sftp", "scp", "ftp", "networking", "free"],
    pricing: "Free",
    channels: [{ type: "Website", url: "https://winscp.net/eng/download.php" }]
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

const iconBySlug: Record<string, string> = {
  "xcode": "https://cdn.simpleicons.org/xcode",
  "cursor-editor": "https://cdn.simpleicons.org/cursor",
  "zed-editor": "https://cdn.simpleicons.org/zedindustries",
  "vscodium": "https://cdn.simpleicons.org/vscodium",
  "sublime-text": "https://cdn.simpleicons.org/sublimetext",
  "notion": "https://cdn.simpleicons.org/notion",
  "canva-desktop": "https://cdn.simpleicons.org/canva",
  "penpot": "https://cdn.simpleicons.org/penpot",
  "photopea": "https://cdn.simpleicons.org/photopea",
  "lunacy": "https://cdn.simpleicons.org/icons8",
  "heif-image-extensions": "https://cdn.simpleicons.org/microsoft",
  "mpv-player": "https://cdn.simpleicons.org/mpv",
  "shotcut": "https://cdn.simpleicons.org/shotcut",
  "kdenlive": "https://cdn.simpleicons.org/kdenlive",
  "davinci-resolve": "https://cdn.simpleicons.org/davinciresolve",
  "plex-media-server": "https://cdn.simpleicons.org/plex",
  "wireguard": "https://cdn.simpleicons.org/wireguard",
  "openvpn-connect": "https://cdn.simpleicons.org/openvpn",
  "putty": "https://cdn.simpleicons.org/putty",
  "filezilla-client": "https://cdn.simpleicons.org/filezilla",
  "cloudflare-warp": "https://cdn.simpleicons.org/cloudflare",
  "google-chrome": "https://cdn.simpleicons.org/googlechrome",
  "microsoft-edge": "https://cdn.simpleicons.org/microsoftedge",
  "opera-browser": "https://cdn.simpleicons.org/opera",
  "vivaldi-browser": "https://cdn.simpleicons.org/vivaldi",
  "firefox": "https://cdn.simpleicons.org/firefoxbrowser",
  "thunderbird": "https://cdn.simpleicons.org/thunderbird",
  "wireshark": "https://cdn.simpleicons.org/wireshark",
  "inkscape": "https://cdn.simpleicons.org/inkscape",
  "krita": "https://cdn.simpleicons.org/krita",
  "blender": "https://cdn.simpleicons.org/blender",
  "gimp": "https://cdn.simpleicons.org/gimp",
  "libreoffice": "https://cdn.simpleicons.org/libreoffice",
  "vlc-media-player": "https://cdn.simpleicons.org/vlcmediaplayer",
  "brave-browser": "https://cdn.simpleicons.org/brave",
  "obsidian": "https://cdn.simpleicons.org/obsidian",
  "docker-desktop": "https://cdn.simpleicons.org/docker",
  "postman": "https://cdn.simpleicons.org/postman",
  "android-studio": "https://cdn.simpleicons.org/androidstudio",
  "dbeaver-community": "https://cdn.simpleicons.org/dbeaver",
  "tailscale": "https://cdn.simpleicons.org/tailscale",
  "veracrypt": "https://cdn.simpleicons.org/veracrypt",
  "figma-desktop-app": "https://cdn.simpleicons.org/figma"
};

function toGitHubOwnerAvatarUrl(sourceCodeUrl?: string): string | undefined {
  if (!sourceCodeUrl) {
    return undefined;
  }

  try {
    const parsed = new URL(sourceCodeUrl);
    if (parsed.hostname !== "github.com") {
      return undefined;
    }

    const [owner] = parsed.pathname.split("/").filter(Boolean);
    if (!owner) {
      return undefined;
    }

    return `https://github.com/${owner}.png?size=96`;
  } catch {
    return undefined;
  }
}

function applyIcon(entry: DownloadEntry): DownloadEntry {
  const explicitIcon = iconBySlug[entry.slug];
  const githubOwnerIcon = toGitHubOwnerAvatarUrl(entry.sourceCodeUrl);
  return {
    ...entry,
    iconUrl: entry.iconUrl ?? explicitIcon ?? githubOwnerIcon
  };
}

export function getDownloads(): DownloadEntry[] {
  return downloadEntries.map(applyReleaseMetadata).map(applyIcon).map(cloneEntry);
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
