export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  company: string;
  role: string;
  bio: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DownloadEventRecord {
  id: string;
  userId: string;
  appSlug: string;
  appName: string;
  channelLabel: string;
  channelType: string;
  platform: string | null;
  url: string;
  createdAt: string;
}

export interface TrackDownloadInput {
  appSlug: string;
  appName: string;
  channelLabel: string;
  channelType: string;
  platform?: string | null;
  url: string;
}
