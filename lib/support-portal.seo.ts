import type { Metadata } from "next";
import type {
  BreadcrumbList,
  CollectionPage,
  Service,
  TechArticle,
  WithContext
} from "schema-dts";
import { getTopSeoKeywordOpportunities } from "@/lib/seo-content.registry";
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

function normalizeDateInput(value: string): string | undefined {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return undefined;
  }

  return new Date(parsed).toISOString();
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
  return buildSupportKbIndexMetadataWithArticles([]);
}

export function buildSupportKbIndexMetadataWithArticles(articles: KBArticle[]): Metadata {
  const productFamilies = [...new Set(articles.map((article) => article.productFamily))];
  const categories = [...new Set(articles.map((article) => article.category))];
  const articleCount = articles.length;
  const seoOpportunityKeywords = getTopSeoKeywordOpportunities(40).map((entry) => entry.keyword);

  const title = "Knowledge Base";
  const description =
    articleCount > 0
      ? `Browse ${articleCount} enterprise-safe troubleshooting guides for Microsoft 365, Adobe, Figma, Okta, Windows, macOS, iOS, Android, networking, browsers, printers, and affiliate operations.`
      : "Enterprise-safe troubleshooting guides for Microsoft 365, Adobe, Figma, Okta, Windows, macOS, iOS, Android, networking, browsers, printers, and affiliate operations.";

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
      "macOS support",
      "affiliate operations support",
      "affiliate link governance",
      ...seoOpportunityKeywords,
      ...productFamilies.map((family) => `${family} support`),
      ...categories.map((category) => `${category} troubleshooting`)
    ]),
    alternates: { canonical: "/support/kb/" },
    openGraph: buildSupportOpenGraph(`${title} | Support Portal`, description, "/support/kb/"),
    twitter: buildSupportTwitter(`${title} | Support Portal`, description)
  };
}

export function buildKbIndexJsonLd(articles: KBArticle[]): WithContext<CollectionPage> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Support Knowledge Base",
    description: `Enterprise-safe IT troubleshooting knowledge base with ${articles.length} guides.`,
    url: toAbsoluteSupportUrl("/support/kb/"),
    isPartOf: {
      "@type": "WebSite",
      name: "Tamem J Support Portal",
      url: toAbsoluteSupportUrl("/support/")
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "TechArticle",
          headline: article.title,
          description: article.description,
          url: toAbsoluteSupportUrl(`/support/kb/${article.slug}/`),
          articleSection: article.category,
          keywords: uniqueKeywords([article.product, article.productFamily, ...article.tags]).join(", ")
        }
      }))
    }
  };
}

export function buildSupportCatalogIndexMetadata(): Metadata {
  return buildSupportCatalogIndexMetadataWithItems([]);
}

export function buildSupportCatalogIndexMetadataWithItems(items: CatalogItem[]): Metadata {
  const categories = [...new Set(items.map((item) => item.category))];
  const products = [...new Set(items.map((item) => item.product))];
  const itemCount = items.length;

  const title = "Service Catalog";
  const description =
    itemCount > 0
      ? `Request IT services from ${itemCount} catalog items, including software installs, mailbox and access changes, VPN support, device lifecycle requests, and conference room assistance.`
      : "Request common IT services including software installs, access requests, mailbox changes, VPN access, device support, and conference room assistance.";

  return {
    title,
    description,
    keywords: uniqueKeywords([
      ...supportPortalBaseKeywords,
      "IT service catalog",
      "software install request",
      "VPN access request",
      "shared mailbox request",
      "device replacement request",
      ...categories.map((category) => `${category} service request`),
      ...products.map((product) => `${product} support request`)
    ]),
    alternates: { canonical: "/support/catalog/" },
    openGraph: buildSupportOpenGraph(`${title} | Support Portal`, description, "/support/catalog/"),
    twitter: buildSupportTwitter(`${title} | Support Portal`, description)
  };
}

export function buildCatalogIndexJsonLd(items: CatalogItem[]): WithContext<CollectionPage> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Support Service Catalog",
    description: `IT service catalog with ${items.length} request templates.`,
    url: toAbsoluteSupportUrl("/support/catalog/"),
    isPartOf: {
      "@type": "WebSite",
      name: "Tamem J Support Portal",
      url: toAbsoluteSupportUrl("/support/")
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Service",
          name: item.title,
          description: item.description,
          category: item.category,
          serviceType: item.product,
          url: toAbsoluteSupportUrl(`/support/catalog/${item.slug}/`)
        }
      }))
    }
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
    authors: [{ name: article.author.name }],
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
      "support:product-family": article.productFamily,
      "support:last-verified": article.lastVerified,
      "support:tested-on": article.testedOn.join(", ")
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

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): WithContext<BreadcrumbList> {
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

export function buildKbArticleJsonLd(article: KBArticle): WithContext<TechArticle> {
  const isoLastVerified = normalizeDateInput(article.lastVerified);

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
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.title
    },
    dateModified: isoLastVerified,
    datePublished: isoLastVerified,
    inLanguage: "en",
    abstract: article.description
  };
}

export function buildCatalogItemJsonLd(item: CatalogItem): WithContext<Service> {
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
