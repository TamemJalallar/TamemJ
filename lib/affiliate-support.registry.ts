import type { KBArticle } from "@/types/support";
import type { AffiliateLink } from "@/lib/affiliate-links";
import { getAffiliateLinkByKey } from "@/lib/affiliate-links";

interface AffiliateMatchRule {
  slugs?: string[];
  productFamilies?: KBArticle["productFamily"][];
  categories?: KBArticle["category"][];
  tags?: string[];
}

interface AffiliateSupportMapping {
  affiliateKey: string;
  supportDocSlug: string;
  priority: number;
  rule: AffiliateMatchRule;
}

export interface KBRecommendedAffiliate {
  affiliate: AffiliateLink;
  supportDocSlug: string;
  score: number;
  rationale: string[];
}

const affiliateSupportMappings: AffiliateSupportMapping[] = [
  {
    affiliateKey: "amazon-it-gear",
    supportDocSlug: "amazon-associates-affiliate-setup-and-link-compliance",
    priority: 70,
    rule: {
      categories: ["Windows", "macOS", "Networking / VPN", "Printers / Scanners", "AV / Conference Rooms"],
      tags: ["dock", "monitor", "keyboard", "printer", "usb", "adapter", "wifi", "network"]
    }
  },
  {
    affiliateKey: "adobe-affiliate",
    supportDocSlug: "adobe-affiliate-partnerize-setup-and-attribution-validation",
    priority: 100,
    rule: {
      productFamilies: ["Adobe"],
      categories: ["Adobe"]
    }
  },
  {
    affiliateKey: "onepassword-affiliate",
    supportDocSlug: "onepassword-affiliate-cj-setup-and-conversion-testing",
    priority: 95,
    rule: {
      categories: ["Identity / MFA / SSO"],
      tags: ["mfa", "identity", "security", "password", "credential", "sso"],
      productFamilies: ["Microsoft", "Okta"]
    }
  },
  {
    affiliateKey: "malwarebytes-affiliate",
    supportDocSlug: "malwarebytes-affiliate-setup-and-security-safe-promotion",
    priority: 90,
    rule: {
      categories: ["Windows", "macOS", "Browsers", "Identity / MFA / SSO"],
      tags: ["security", "malware", "phishing", "browser", "endpoint", "threat"]
    }
  },
  {
    affiliateKey: "grammarly-affiliate",
    supportDocSlug: "grammarly-affiliate-impact-setup-and-link-governance",
    priority: 60,
    rule: {
      categories: ["Microsoft 365", "Adobe", "Figma", "Business / Partnerships"],
      tags: ["documentation", "writing", "communication", "policy", "template"]
    }
  },
  {
    affiliateKey: "surfshark-affiliate",
    supportDocSlug: "surfshark-affiliate-placement-and-policy-compliant-positioning",
    priority: 65,
    rule: {
      categories: ["Networking / VPN", "Browsers"],
      tags: ["vpn", "privacy", "public-wifi", "remote-work", "network"]
    }
  },
  {
    affiliateKey: "proton-partners",
    supportDocSlug: "proton-partners-affiliate-setup-and-privacy-safe-messaging",
    priority: 75,
    rule: {
      categories: ["Identity / MFA / SSO", "Networking / VPN", "Business / Partnerships"],
      tags: ["privacy", "security", "email", "encryption"]
    }
  },
  {
    affiliateKey: "apple-performance-partners",
    supportDocSlug: "apple-services-performance-partners-onboarding-and-approval-notes",
    priority: 55,
    rule: {
      productFamilies: ["Apple", "Mobile"],
      categories: ["macOS", "iOS", "Business / Partnerships"],
      tags: ["apple", "ios", "macos", "app-store"]
    }
  }
];

function getRuleScore(article: KBArticle, rule: AffiliateMatchRule): { score: number; rationale: string[] } {
  let score = 0;
  const rationale: string[] = [];

  if (rule.slugs?.includes(article.slug)) {
    score += 120;
    rationale.push("Exact article mapping");
  }
  if (rule.productFamilies?.includes(article.productFamily)) {
    score += 50;
    rationale.push(`Product family match: ${article.productFamily}`);
  }
  if (rule.categories?.includes(article.category)) {
    score += 40;
    rationale.push(`Category match: ${article.category}`);
  }

  const lowerTags = article.tags.map((tag) => tag.toLowerCase());
  const matchedTags = (rule.tags ?? []).filter((tag) => lowerTags.includes(tag.toLowerCase()));
  if (matchedTags.length > 0) {
    score += matchedTags.length * 12;
    rationale.push(`Tag match: ${matchedTags.join(", ")}`);
  }

  return { score, rationale };
}

export function getAffiliateSupportMappings(): AffiliateSupportMapping[] {
  return affiliateSupportMappings.map((mapping) => ({
    ...mapping,
    rule: {
      slugs: mapping.rule.slugs ? [...mapping.rule.slugs] : undefined,
      productFamilies: mapping.rule.productFamilies ? [...mapping.rule.productFamilies] : undefined,
      categories: mapping.rule.categories ? [...mapping.rule.categories] : undefined,
      tags: mapping.rule.tags ? [...mapping.rule.tags] : undefined
    }
  }));
}

export function getRecommendedAffiliatesForKBArticle(article: KBArticle): KBRecommendedAffiliate[] {
  const matches = affiliateSupportMappings
    .map((mapping) => {
      const affiliate = getAffiliateLinkByKey(mapping.affiliateKey);
      if (!affiliate) return null;

      const { score, rationale } = getRuleScore(article, mapping.rule);
      if (score <= 0) return null;

      return {
        affiliate,
        supportDocSlug: mapping.supportDocSlug,
        score: score + mapping.priority,
        rationale
      } satisfies KBRecommendedAffiliate;
    })
    .filter((item): item is KBRecommendedAffiliate => Boolean(item))
    .sort((a, b) => b.score - a.score || a.affiliate.label.localeCompare(b.affiliate.label));

  return matches.slice(0, 3);
}

export function getAffiliateSupportDocSlugs(): string[] {
  return [...new Set(affiliateSupportMappings.map((mapping) => mapping.supportDocSlug))];
}
