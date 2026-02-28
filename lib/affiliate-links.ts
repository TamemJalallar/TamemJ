export interface AffiliateLink {
  key: string;
  program: string;
  label: string;
  description: string;
  url: string;
  network: string;
  status: "Active" | "Applied";
  platform?: string;
}

export const affiliateLinks: AffiliateLink[] = [
  {
    key: "amazon-it-gear",
    program: "Amazon Associates",
    label: "Amazon IT Gear Picks",
    description:
      "Recommended keyboards, docks, adapters, and accessories for enterprise support and productivity setups.",
    url: "https://amzn.to/4b1Cr3z",
    network: "Amazon Associates",
    status: "Active",
    platform: "Amazon"
  },
  {
    key: "adobe-affiliate",
    program: "Adobe Affiliate",
    label: "Adobe Creative Cloud",
    description:
      "Creative Cloud and Acrobat offers for design, PDF, and enterprise collaboration workflows.",
    url: "https://www.adobe.com/affiliates.html",
    network: "Partnerize",
    status: "Applied",
    platform: "Adobe"
  },
  {
    key: "onepassword-affiliate",
    program: "1Password Affiliate",
    label: "1Password Business",
    description: "Enterprise password manager recommendations for identity and endpoint hygiene.",
    url: "https://1password.com/affiliate/",
    network: "CJ",
    status: "Applied",
    platform: "1Password"
  },
  {
    key: "malwarebytes-affiliate",
    program: "Malwarebytes Affiliate",
    label: "Malwarebytes",
    description: "Endpoint protection and remediation tools for malware and threat cleanup workflows.",
    url: "https://www.malwarebytes.com/affiliates",
    network: "Partnerize",
    status: "Applied",
    platform: "Malwarebytes"
  },
  {
    key: "grammarly-affiliate",
    program: "Grammarly Affiliate",
    label: "Grammarly",
    description: "Writing and communication productivity tooling for business documentation workflows.",
    url: "https://www.grammarly.com/affiliates",
    network: "Impact",
    status: "Applied",
    platform: "Grammarly"
  },
  {
    key: "surfshark-affiliate",
    program: "Surfshark Affiliate",
    label: "Surfshark",
    description: "Consumer VPN and online privacy tooling for remote work and safe browsing guidance.",
    url: "https://surfshark.com/affiliate",
    network: "Impact",
    status: "Applied",
    platform: "Surfshark"
  },
  {
    key: "proton-partners",
    program: "Proton Partners",
    label: "Proton",
    description: "Privacy-first email and security tools aligned with security-aware support audiences.",
    url: "https://proton.me/partners/affiliates",
    network: "Proton Partners",
    status: "Applied",
    platform: "Proton"
  },
  {
    key: "apple-performance-partners",
    program: "Apple Services Performance Partners",
    label: "Apple Services",
    description: "Apple services partner program for approved promotional placements and campaigns.",
    url: "https://performance-partners.apple.com/home",
    network: "Apple Services Performance Partners",
    status: "Applied",
    platform: "Apple"
  }
];

export function getAffiliateLinkByKey(key: string): AffiliateLink | undefined {
  return affiliateLinks.find((entry) => entry.key === key);
}
