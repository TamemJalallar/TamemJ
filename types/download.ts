export type DownloadPlatform = "macOS" | "Windows" | "Linux" | "iOS" | "Android" | "Web";

export type DownloadChannelType =
  | "Mac App Store"
  | "Microsoft Store"
  | "GitHub Releases"
  | "Direct Download"
  | "Website"
  | "Source Code";

export type DownloadAudience = "Portfolio" | "Curated";

export interface DownloadChannelLink {
  type: DownloadChannelType;
  url: string;
  label?: string;
}

export interface DirectDownloadArtifact {
  label: string;
  platform: DownloadPlatform;
  url: string;
  host: string;
  version?: string;
  fileType?: string;
  fileSize?: string;
  checksumSha256?: string;
  notes?: string;
}

export interface DownloadReleaseMetadataArtifact {
  assetName?: string;
  resolvedUrl?: string;
  version?: string;
  fileSize?: string;
  fileSizeBytes?: number;
  checksumSha256?: string;
}

export interface DownloadReleaseMetadataEntry {
  repo: string;
  releaseTag?: string;
  releaseName?: string;
  releaseUrl?: string;
  publishedAt?: string;
  artifacts: Record<string, DownloadReleaseMetadataArtifact>;
}

export interface DownloadReleaseMetadataStore {
  version: 1;
  generatedAt: string | null;
  entries: Record<string, DownloadReleaseMetadataEntry>;
}

export interface DownloadEntry {
  slug: string;
  name: string;
  iconUrl?: string;
  summary: string;
  category: string;
  audience: DownloadAudience;
  developer?: string;
  platforms: DownloadPlatform[];
  tags: string[];
  featuredOnGitHub?: boolean;
  popularityLabel?: string;
  sourceCodeUrl?: string;
  releaseNotesUrl?: string;
  license?: string;
  pricing?: string;
  channels: DownloadChannelLink[];
  directDownloads?: DirectDownloadArtifact[];
  releaseMetadata?: DownloadReleaseMetadataEntry;
}

export type DownloadAssetFormat = "ps1" | "xlsx" | "pdf" | "docx";
export type DownloadAssetCategory = "Scripts" | "Templates" | "Checklists" | "Runbooks";
export type DownloadAssetAccess = "Free" | "Email gate" | "Premium";
export type DownloadAssetSearchDemand = "High" | "Medium" | "Low";

export interface DownloadAsset {
  slug: string;
  title: string;
  description: string;
  format: DownloadAssetFormat;
  category: DownloadAssetCategory;
  access: DownloadAssetAccess;
  monetization: string;
  searchDemand: DownloadAssetSearchDemand;
  priceLabel?: string;
  tags: string[];
}

export interface DownloadAssetBundle {
  slug: string;
  title: string;
  description: string;
  itemSlugs: string[];
  access: DownloadAssetAccess;
  monetization: string;
  priceLabel?: string;
}
