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
      slugs: [
        "usb-c-dock-dual-monitors-not-detected-windows-macos",
        "teams-usb-headset-microphone-not-detected-after-sleep",
        "home-office-ups-sizing-runtime-planning",
        "conference-room-usb-camera-flicker-freeze-teams-zoom",
        "docking-station-ethernet-not-detected-after-reboot",
        "teams-meeting-echo-audio-feedback-conference-room",
        "remote-worker-webcam-image-quality-low-light-noise",
        "secure-home-router-for-remote-work-connectivity",
        "windows-external-ssd-not-detected-usb-c-thunderbolt",
        "windows-bluetooth-headset-handsfree-low-audio-quality",
        "windows-webcam-not-detected-after-quality-update",
        "windows-multi-monitor-flicker-after-dock-firmware-update",
        "windows-ethernet-poor-speed-negotiation-on-dock",
        "windows-home-router-qos-for-teams-zoom-calls",
        "macos-thunderbolt-dock-dual-display-flicker-after-update",
        "macos-external-ssd-not-mounting-after-macos-update",
        "macos-bluetooth-headset-audio-stutter-in-meetings",
        "macos-webcam-not-detected-teams-zoom-after-permission-reset",
        "macos-ethernet-usb-c-adapter-no-ip-after-sleep",
        "macos-battery-health-degradation-remote-work-lifecycle",
        "macos-home-wifi-channel-interference-video-call-instability"
      ],
      categories: ["Windows", "macOS", "Networking / VPN", "Printers / Scanners", "AV / Conference Rooms"],
      tags: ["dock", "monitor", "keyboard", "printer", "usb", "adapter", "wifi", "network", "headset", "ups"]
    }
  },
  {
    affiliateKey: "adobe-affiliate",
    supportDocSlug: "adobe-affiliate-partnerize-setup-and-attribution-validation",
    priority: 100,
    rule: {
      slugs: [
        "premiere-pro-scratch-disk-full-export-fails-managed-device",
        "after-effects-disk-cache-growth-storage-pressure",
        "acrobat-pdf-too-large-for-email-or-upload-safe-reduction",
        "creative-cloud-desktop-update-stuck-download-loop"
      ],
      productFamilies: ["Adobe"],
      categories: ["Adobe"]
    }
  },
  {
    affiliateKey: "onepassword-affiliate",
    supportDocSlug: "onepassword-affiliate-cj-setup-and-conversion-testing",
    priority: 95,
    rule: {
      slugs: [
        "password-manager-autofill-not-working-chrome-edge-enterprise",
        "password-manager-shared-vault-access-not-updating",
        "password-manager-extension-blocked-by-browser-policy",
        "browser-password-breach-warning-corporate-account"
      ],
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
      slugs: [
        "endpoint-security-false-positive-blocking-business-app",
        "endpoint-security-agent-high-cpu-after-update",
        "ransomware-safe-onedrive-sharepoint-file-recovery",
        "phishing-link-clicked-immediate-containment-checklist",
        "browser-password-breach-warning-corporate-account"
      ],
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
      slugs: [
        "vpn-kill-switch-blocking-teams-outlook",
        "vpn-connected-saas-apps-blocked-ip-reputation-geo",
        "public-wifi-safe-remote-work-connectivity-checklist",
        "secure-home-router-for-remote-work-connectivity",
        "windows-home-router-qos-for-teams-zoom-calls",
        "macos-home-wifi-channel-interference-video-call-instability"
      ],
      categories: ["Networking / VPN", "Browsers"],
      tags: ["vpn", "privacy", "public-wifi", "remote-work", "network"]
    }
  },
  {
    affiliateKey: "proton-partners",
    supportDocSlug: "proton-partners-affiliate-setup-and-privacy-safe-messaging",
    priority: 75,
    rule: {
      slugs: [
        "public-wifi-safe-remote-work-connectivity-checklist",
        "vpn-connected-saas-apps-blocked-ip-reputation-geo",
        "ransomware-safe-onedrive-sharepoint-file-recovery",
        "browser-password-breach-warning-corporate-account",
        "secure-home-router-for-remote-work-connectivity"
      ],
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
      slugs: [
        "macos-thunderbolt-dock-dual-display-flicker-after-update",
        "macos-external-ssd-not-mounting-after-macos-update",
        "macos-bluetooth-headset-audio-stutter-in-meetings",
        "macos-webcam-not-detected-teams-zoom-after-permission-reset",
        "macos-ethernet-usb-c-adapter-no-ip-after-sleep",
        "macos-battery-health-degradation-remote-work-lifecycle",
        "macos-home-wifi-channel-interference-video-call-instability"
      ],
      tags: ["apple", "ios", "macos", "app-store", "thunderbolt", "battery-health", "webcam"]
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
