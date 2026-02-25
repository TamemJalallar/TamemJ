import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import type { CatalogItem, KBArticle } from "@/types/support";

type BreadcrumbItem = {
  name: string;
  path?: string;
};

const supportPortalBaseKeywords = [
  "enterprise IT support",
  "IT troubleshooting guides",
  "knowledge base",
  "service catalog",
  "IT support portal",
  "ServiceNow style portal",
  "corporate IT documentation",
  "help desk runbooks"
];

function uniqueKeywords(keywords: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const keyword of keywords) {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(keyword.trim());
  }

  return result;
}

export function toAbsoluteSupportUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export function buildSupportOpenGraph(
  title: string,
  description: string,
  path: string,
  type: "website" | "article" = "website"
): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    url: path,
    type,
    siteName: "Tamem J Support Portal",
    images: [
      {
        url: "/images/site/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Tamem J Support Portal knowledge base and IT support documentation"
      }
    ]
  };
}

export function buildSupportTwitter(title: string, description: string): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/site/og-image.svg"]
  };
}

export function buildSupportKbIndexMetadata(): Metadata {
  const title = "Knowledge Base";
  const description =
    "Enterprise-safe troubleshooting guides for Microsoft 365, Adobe, Figma, Okta, Windows, macOS, iOS, Android, networking, browsers, and printers.";

  return {
    title,
    description,
    keywords: uniqueKeywords([
      ...supportPortalBaseKeywords,
      "IT knowledge base",
      "Microsoft 365 troubleshooting",
      "Adobe troubleshooting",
      "Figma troubleshooting",
      "Okta troubleshooting",
      "mobile device support",
      "Windows support",
      "macOS support"
    ]),
    alternates: { canonical: "/support/kb/" },
    openGraph: buildSupportOpenGraph(`${title} | Support Portal`, description, "/support/kb/"),
    twitter: buildSupportTwitter(`${title} | Support Portal`, description)
  };
}

export function buildSupportCatalogIndexMetadata(): Metadata {
  const title = "Service Catalog";
  const description =
    "Request common IT services including software installs, access requests, mailbox changes, VPN access, device support, and conference room assistance.";

  return {
    title,
    description,
    keywords: uniqueKeywords([
      ...supportPortalBaseKeywords,
      "IT service catalog",
      "software install request",
      "VPN access request",
      "shared mailbox request",
      "device replacement request"
    ]),
    alternates: { canonical: "/support/catalog/" },
    openGraph: buildSupportOpenGraph(`${title} | Support Portal`, description, "/support/catalog/"),
    twitter: buildSupportTwitter(`${title} | Support Portal`, description)
  };
}

export function buildKbArticleMetadata(article: KBArticle): Metadata {
  const title = article.title;
  const description = article.description;
  const path = `/support/kb/${article.slug}/`;
  const keywords = uniqueKeywords([
    ...supportPortalBaseKeywords,
    ...article.tags,
    article.product,
    article.productFamily,
    article.category,
    `${article.product} troubleshooting`,
    `${article.productFamily} support`
  ]);

  return {
    title,
    description,
    category: article.category,
    keywords,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: buildSupportOpenGraph(`${title} | Support Portal KB`, description, path, "article"),
    twitter: buildSupportTwitter(`${title} | Support Portal KB`, description),
    other: {
      "support:severity": article.severity,
      "support:access-level": article.accessLevel,
      "support:environment": article.environment,
      "support:estimated-time": article.estimatedTime,
      "support:product": article.product,
      "support:product-family": article.productFamily
    }
  };
}

export function buildCatalogItemMetadata(item: CatalogItem): Metadata {
  const title = item.title;
  const description = item.description;
  const path = `/support/catalog/${item.slug}/`;

  return {
    title,
    description,
    category: item.category,
    keywords: uniqueKeywords([
      ...supportPortalBaseKeywords,
      ...item.tags,
      item.category,
      item.product,
      "service request",
      "IT request form"
    ]),
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: buildSupportOpenGraph(`${title} | Support Catalog`, description, path),
    twitter: buildSupportTwitter(`${title} | Support Catalog`, description),
    other: {
      "support:catalog-category": item.category,
      "support:product": item.product,
      "support:expected-fulfillment-time": item.expectedFulfillmentTime
    }
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path
        ? {
            item: toAbsoluteSupportUrl(item.path)
          }
        : {})
    }))
  };
}

export function buildKbArticleJsonLd(article: KBArticle): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.description,
    url: toAbsoluteSupportUrl(`/support/kb/${article.slug}/`),
    mainEntityOfPage: toAbsoluteSupportUrl(`/support/kb/${article.slug}/`),
    articleSection: article.category,
    keywords: uniqueKeywords([...article.tags, article.product, article.productFamily]).join(", "),
    about: [
      { "@type": "Thing", name: article.product },
      { "@type": "Thing", name: article.productFamily }
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Enterprise IT support and end users"
    },
    proficiencyLevel: article.accessLevel === "Admin Required" ? "Advanced" : "Beginner",
    isPartOf: {
      "@type": "WebSite",
      name: "Tamem J Support Portal",
      url: toAbsoluteSupportUrl("/support/")
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    inLanguage: "en",
    abstract: article.description
  };
}

export function buildCatalogItemJsonLd(item: CatalogItem): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: item.title,
    description: item.description,
    category: item.category,
    serviceType: `IT support request: ${item.product}`,
    url: toAbsoluteSupportUrl(`/support/catalog/${item.slug}/`),
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    audience: {
      "@type": "Audience",
      audienceType: "Corporate employees"
    },
    offers: {
      "@type": "Offer",
      description: `Expected fulfillment time: ${item.expectedFulfillmentTime}`
    }
  };
}

