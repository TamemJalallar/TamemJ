import type { PCBuildGuide, PCPartRecommendation } from "@/types/pc-build";
import { getAffiliateLinkByKey } from "@/lib/affiliate-links";

export type PCPurchaseLinkType = "affiliate" | "direct";

export interface PCPurchaseLink {
  label: string;
  url: string;
  type: PCPurchaseLinkType;
  status: "Active" | "Applied" | "Direct";
  note: string;
}

interface DirectVendorTemplate {
  label: string;
  note: string;
  type?: PCPurchaseLinkType;
  status?: PCPurchaseLink["status"];
  buildUrl: (query: string) => string;
}

const neweggAffiliateSid = (process.env.NEXT_PUBLIC_NEWEGG_AFFILIATE_SID ?? "").trim();

const directVendors: DirectVendorTemplate[] = [
  {
    label: "Newegg",
    note: neweggAffiliateSid ? "Affiliate link" : "Direct store search",
    type: neweggAffiliateSid ? "affiliate" : "direct",
    status: neweggAffiliateSid ? "Active" : "Direct",
    buildUrl: (query) => {
      const base = `https://www.newegg.com/p/pl?d=${encodeURIComponent(query)}`;
      return neweggAffiliateSid
        ? `${base}&SID=${encodeURIComponent(neweggAffiliateSid)}`
        : base;
    }
  },
  {
    label: "B&H Photo",
    note: "Direct store search",
    buildUrl: (query) => `https://www.bhphotovideo.com/c/search?q=${encodeURIComponent(query)}`
  },
  {
    label: "Micro Center",
    note: "Direct store search",
    buildUrl: (query) =>
      `https://www.microcenter.com/search/search_results.aspx?Ntt=${encodeURIComponent(query)}`
  }
];

function normalizeSearchQuery(guide: PCBuildGuide, part: PCPartRecommendation): string {
  const tagHint = guide.tags.slice(0, 2).join(" ");
  const raw = `${part.partType} ${part.whatToBuy} ${tagHint}`;

  return raw.replace(/\s+/g, " ").trim();
}

function dedupeLinks(links: PCPurchaseLink[]): PCPurchaseLink[] {
  const seen = new Set<string>();

  return links.filter((link) => {
    const key = `${link.label}::${link.url}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function getPurchaseLinksForPart(
  guide: PCBuildGuide,
  part: PCPartRecommendation
): PCPurchaseLink[] {
  const links: PCPurchaseLink[] = [];
  const searchQuery = normalizeSearchQuery(guide, part);
  const amazon = getAffiliateLinkByKey("amazon-it-gear");

  if (amazon) {
    links.push({
      label: "Amazon Picks",
      url: amazon.url,
      type: "affiliate",
      status: amazon.status,
      note:
        amazon.status === "Active"
          ? "Affiliate link"
          : "Affiliate program pending"
    });
  }

  for (const vendor of directVendors) {
    links.push({
      label: vendor.label,
      url: vendor.buildUrl(searchQuery),
      type: vendor.type ?? "direct",
      status: vendor.status ?? "Direct",
      note: vendor.note
    });
  }

  return dedupeLinks(links);
}
