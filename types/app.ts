export interface AppScreenshot {
  src: string;
  alt: string;
}

export interface IOSApp {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  shortDescription: string;
  description: string;
  featured: boolean;
  appStoreUrl: string;
  icon: string;
  screenshots: AppScreenshot[];
  features: string[];
  pricing: string;
  minIOSVersion: string;
  supportEmail?: string;
}
