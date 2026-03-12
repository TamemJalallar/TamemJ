import type { Metadata } from "next";
import type {
  BreadcrumbList,
  CollectionPage,
  FAQPage,
  HowTo,
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
  "support tickets",
  "ticket library",
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

function parseEstimatedMinutes(value: string): number | null {
  const matches = value.match(/\d+/g);
  if (!matches || matches.length === 0) {
    return null;
  }

  const first = Number(matches[0]);
  if (!Number.isFinite(first) || first <= 0) {
    return null;
  }

  if (matches.length === 1) {
    return Math.round(first);
  }

  const second = Number(matches[1]);
  if (!Number.isFinite(second) || second <= 0) {
    return Math.round(first);
  }

  return Math.round((first + second) / 2);
}

function toIso8601DurationFromMinutes(value: string): string | undefined {
  const minutes = parseEstimatedMinutes(value);
  if (!minutes || minutes <= 0) {
    return undefined;
  }

  return `PT${minutes}M`;
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
    url: toAbsoluteSupportUrl(path),
    type,
    siteName: "Tamem J Support Portal",
    locale: "en_US",
    images: [
      {
        url: toAbsoluteSupportUrl("/images/site/og-image.svg"),
        width: 1200,
        height: 630,
        alt: "Tamem J Support Portal tickets and IT support documentation"
      }
    ]
  };
}

export function buildSupportTwitter(title: string, description: string): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [toAbsoluteSupportUrl("/images/site/og-image.svg")]
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

  const title = "Tickets";
  const description =
    articleCount > 0
      ? `Browse ${articleCount} enterprise-safe troubleshooting guides for Microsoft 365, Adobe, Figma, Okta, Windows, macOS, iOS, Android, networking, browsers, printers, and affiliate operations.`
      : "Enterprise-safe troubleshooting guides for Microsoft 365, Adobe, Figma, Okta, Windows, macOS, iOS, Android, networking, browsers, printers, and affiliate operations.";

  return {
    title,
    description,
    keywords: uniqueKeywords([
      ...supportPortalBaseKeywords,
      "IT support tickets",
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
    alternates: { canonical: "/support/tickets/" },
    openGraph: buildSupportOpenGraph(`${title} | Support Portal`, description, "/support/tickets/"),
    twitter: buildSupportTwitter(`${title} | Support Portal`, description)
  };
}

export function buildKbIndexJsonLd(articles: KBArticle[]): WithContext<CollectionPage> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Support Tickets",
    description: `Enterprise-safe IT troubleshooting ticket library with ${articles.length} guides.`,
    url: toAbsoluteSupportUrl("/support/tickets/"),
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
          url: toAbsoluteSupportUrl(`/support/tickets/${article.slug}/`),
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
  const path = `/support/tickets/${article.slug}/`;
  const normalizedLastVerified = normalizeDateInput(article.lastVerified);
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
    openGraph: {
      ...buildSupportOpenGraph(`${title} | Support Portal Tickets`, description, path, "article"),
      ...(normalizedLastVerified
        ? {
            publishedTime: normalizedLastVerified,
            modifiedTime: normalizedLastVerified
          }
        : {})
    },
    twitter: buildSupportTwitter(`${title} | Support Portal Tickets`, description),
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
    url: toAbsoluteSupportUrl(`/support/tickets/${article.slug}/`),
    mainEntityOfPage: toAbsoluteSupportUrl(`/support/tickets/${article.slug}/`),
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

export function buildKbHowToJsonLd(article: KBArticle): WithContext<HowTo> {
  const totalTime = toIso8601DurationFromMinutes(article.estimatedTime);

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: article.title,
    description: article.description,
    url: toAbsoluteSupportUrl(`/support/tickets/${article.slug}/`),
    ...(totalTime ? { totalTime } : {}),
    step: article.resolutionSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.content,
      url: toAbsoluteSupportUrl(`/support/tickets/${article.slug}/#step-${index + 1}`)
    }))
  };
}

export function buildKbFaqJsonLd(article: KBArticle): WithContext<FAQPage> {
  const symptomsText = article.symptoms.map((item) => `- ${item}`).join("\n");
  const causesText = article.causes.map((item) => `- ${item}`).join("\n");
  const escalationText = article.escalationCriteria.map((item) => `- ${item}`).join("\n");

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What symptoms indicate ${article.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: symptomsText
        }
      },
      {
        "@type": "Question",
        name: `What usually causes ${article.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: causesText
        }
      },
      {
        "@type": "Question",
        name: "When should this issue be escalated to IT or security?",
        acceptedAnswer: {
          "@type": "Answer",
          text: escalationText
        }
      }
    ]
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
