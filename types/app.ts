export interface AppScreenshot {
  src: string;
  alt: string;
  orientation?: "portrait" | "landscape";
}

export interface ProductAppLink {
  label: string;
  href: string;
}

export interface IOSApp {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  shortDescription: string;
  description: string;
  featured: boolean;
  status?: "published" | "in-development";
  appStoreUrl: string;
  primaryUrl?: string;
  primaryUrlLabel?: string;
  repositoryUrl?: string;
  secondaryLinks?: ProductAppLink[];
  icon: string;
  screenshots: AppScreenshot[];
  features: string[];
  pricing: string;
  minIOSVersion: string;
  compatibility?: string;
  supportEmail?: string;
}
