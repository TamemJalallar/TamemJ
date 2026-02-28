import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

const defaultOgImage = "/images/site/og-image.svg";

export type SeoPageType = "website" | "article";

export interface BreadcrumbSeoItem {
  name: string;
  path?: string;
}

export function toAbsoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export function buildOpenGraph(
  title: string,
  description: string,
  path: string,
  type: SeoPageType = "website"
): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    url: path,
    type,
    siteName: "Tamem J",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${title} | Tamem J`
      }
    ]
  };
}

export function buildTwitter(
  title: string,
  description: string
): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [defaultOgImage]
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbSeoItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: toAbsoluteUrl(item.path) } : {})
    }))
  };
}

export function buildCollectionPageJsonLd(
  name: string,
  description: string,
  path: string,
  items: Array<{ name: string; path: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: toAbsoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.title,
      url: siteConfig.url
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: toAbsoluteUrl(item.path)
      }))
    }
  };
}

