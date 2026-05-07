import { getAffiliateLinksByKeys, type AffiliateLink } from "@/lib/affiliate-links";

export type MonetizationContext =
  | "homepage"
  | "downloads"
  | "download-assets"
  | "guides"
  | "support"
  | "corporate-fixes";

export type AdSenseSlotKind = "display" | "inArticle" | "multiplex";

function normalizePath(path: string | null | undefined): string {
  if (!path) return "/";
  const clean = path.split("?")[0]?.split("#")[0] ?? "/";
  if (clean === "/") return "/";
  return clean.endsWith("/") ? clean : `${clean}/`;
}

function cleanEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

const contextAffiliateKeys: Record<MonetizationContext, string[]> = {
  homepage: [
    "amazon-it-gear",
    "surfshark-affiliate",
    "amazon-pick-raspberry-pi-5-starter-kit-pro"
  ],
  downloads: [
    "amazon-it-gear",
    "amazon-pick-brother-ptd210-label-maker-bundle",
    "amazon-pick-delamu-cable-management-raceway"
  ],
  "download-assets": [
    "amazon-it-gear",
    "onepassword-affiliate",
    "malwarebytes-affiliate"
  ],
  guides: [
    "onepassword-affiliate",
    "surfshark-affiliate",
    "malwarebytes-affiliate"
  ],
  support: [
    "onepassword-affiliate",
    "malwarebytes-affiliate",
    "surfshark-affiliate"
  ],
  "corporate-fixes": [
    "amazon-it-gear",
    "onepassword-affiliate",
    "malwarebytes-affiliate"
  ]
};

export const monetizationConfig = {
  adsenseClient: cleanEnv(process.env.NEXT_PUBLIC_ADSENSE_CLIENT) || "ca-pub-8852243900182779",
  adsenseSlots: {
    display: cleanEnv(process.env.NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT) || "2157838864",
    inArticle: cleanEnv(process.env.NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT) || "7933384424",
    multiplex: cleanEnv(process.env.NEXT_PUBLIC_ADSENSE_MULTIPLEX_SLOT)
  },
  disclosure:
    "Some links may be affiliate links. If you buy through them, this site may earn a commission at no extra cost to you."
} as const;

export function getAdSenseSlot(kind: AdSenseSlotKind): string {
  return monetizationConfig.adsenseSlots[kind];
}

export function canRenderAdSenseOnPath(path: string): boolean {
  const normalized = normalizePath(path);

  if (normalized.startsWith("/support/tickets/") && normalized !== "/support/tickets/") {
    return true;
  }

  if (normalized.startsWith("/downloads/assets/") && normalized !== "/downloads/assets/") {
    return true;
  }

  if (normalized.startsWith("/downloads/") && normalized !== "/downloads/") {
    return true;
  }

  if (normalized.startsWith("/guides/") && normalized !== "/guides/") {
    return true;
  }

  if (normalized.startsWith("/corporate-tech-fixes/") && normalized !== "/corporate-tech-fixes/") {
    return true;
  }

  return false;
}

export function getMonetizationRecommendations(
  context: MonetizationContext,
  limit = 3
): AffiliateLink[] {
  const links = getAffiliateLinksByKeys(contextAffiliateKeys[context]);
  return [
    ...links.filter((link) => link.status === "Active"),
    ...links.filter((link) => link.status !== "Active")
  ].slice(0, limit);
}
