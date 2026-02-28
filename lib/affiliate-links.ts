export interface AffiliateLink {
  key: string;
  label: string;
  description: string;
  url: string;
  platform?: string;
}

export const affiliateLinks: AffiliateLink[] = [
  {
    key: "amazon-it-gear",
    label: "Amazon IT Gear Picks",
    description:
      "Recommended keyboards, docks, adapters, and accessories for enterprise support and productivity setups.",
    url: "https://amzn.to/4b1Cr3z",
    platform: "Amazon"
  }
];

export function getAffiliateLinkByKey(key: string): AffiliateLink | undefined {
  return affiliateLinks.find((entry) => entry.key === key);
}
