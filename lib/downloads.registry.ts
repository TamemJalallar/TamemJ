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
