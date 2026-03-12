import type { Metadata } from "next";
import type { BreadcrumbList, CollectionPage, WithContext } from "schema-dts";
import { siteConfig } from "@/lib/site";

const defaultOgImage = "/images/site/og-image.png";

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
    url: toAbsoluteUrl(path),
    type,
    siteName: siteConfig.title,
    locale: "en_US",
    images: [
      {
        url: toAbsoluteUrl(defaultOgImage),
        width: 1200,
        height: 630,
        alt: `${title} | Tamem J`
      }
    ]
  };
}

export function buildArticleOpenGraph(
  title: string,
  description: string,
  path: string,
  options: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    section?: string;
    tags?: string[];
  } = {}
): NonNullable<Metadata["openGraph"]> {
  return {
    ...buildOpenGraph(title, description, path, "article"),
    ...(options.publishedTime ? { publishedTime: options.publishedTime } : {}),
    ...(options.modifiedTime ? { modifiedTime: options.modifiedTime } : {}),
    ...(options.authors && options.authors.length > 0 ? { authors: options.authors } : {}),
    ...(options.section ? { section: options.section } : {}),
    ...(options.tags && options.tags.length > 0 ? { tags: options.tags } : {})
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
    images: [toAbsoluteUrl(defaultOgImage)]
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbSeoItem[]): WithContext<BreadcrumbList> {
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
): WithContext<CollectionPage> {
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
