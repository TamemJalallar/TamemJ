import type { AffiliateLink } from "@/lib/affiliate-links";
import { getAffiliateLinkByKey, getAffiliateLinksByKeys } from "@/lib/affiliate-links";

export type AmazonStorefrontCategory = "Home Lab" | "Desk Setup" | "Networking" | "Power";

export interface AmazonStorefrontProduct {
  key: string;
  category: AmazonStorefrontCategory;
  highlight: string;
  storeBadge?: "Best Starter" | "Best Value" | "Best Premium";
  bestFor: string;
  priceBand: string;
  tags: string[];
  recommendation: string;
  usageNotes: string[];
  affiliate: AffiliateLink;
}

export interface AmazonStorefrontCollection {
  id: string;
  title: string;
  summary: string;
  audience: string;
  productKeys: readonly string[];
  products: AmazonStorefrontProduct[];
}

const storefrontProductMetadata: Omit<AmazonStorefrontProduct, "affiliate">[] = [
  {
    key: "amazon-pick-raspberry-pi-5-starter-kit-pro",
    category: "Home Lab",
    highlight: "Best starter lab",
    storeBadge: "Best Starter",
    bestFor: "Learning Linux, small automations, Pi-hole, and low-power service experiments.",
    priceBand: "$$",
    tags: ["home lab", "raspberry pi", "linux", "automation"],
    recommendation:
      "A practical starting point for low-cost lab work when you want to test ideas without committing to full desktop hardware.",
    usageNotes: [
      "Good fit for scripting practice, small Docker services, and network utilities.",
      "Easy recommendation for people building their first support-friendly home lab."
    ]
  },
  {
    key: "amazon-pick-synology-nas",
    category: "Home Lab",
    highlight: "Best private storage upgrade",
    storeBadge: "Best Premium",
    bestFor: "Backups, file sync, media staging, shared folders, and self-hosted storage workflows.",
    priceBand: "$$$$",
    tags: ["nas", "synology", "backup", "storage"],
    recommendation:
      "A clean path into centralized storage and backup workflows that still feels approachable for solo builders and small teams.",
    usageNotes: [
      "Useful for backup demos, file-versioning workflows, and private cloud storage.",
      "Pairs naturally with UPS protection and portable SSD staging drives."
    ]
  },
  {
    key: "amazon-pick-mini-pc-lab",
    category: "Home Lab",
    highlight: "Best compact virtualization host",
    storeBadge: "Best Value",
    bestFor: "Proxmox, lightweight VMs, container stacks, and quiet lab footprints.",
    priceBand: "$$$",
    tags: ["mini pc", "virtualization", "proxmox", "lab host"],
    recommendation:
      "A strong value move when you want more compute than a Pi but still want something compact, quiet, and easy to place on a shelf.",
    usageNotes: [
      "Good for Windows and Linux lab images without full tower noise or power draw.",
      "Useful stepping stone before investing in larger workstation-class gear."
    ]
  },
  {
    key: "amazon-pick-samsung-t7-ssd",
    category: "Home Lab",
    highlight: "Best portable storage add-on",
    bestFor: "Boot media, imaging kits, backup rotation, and fast file transfers between systems.",
    priceBand: "$$",
    tags: ["ssd", "portable storage", "backup", "field kit"],
    recommendation:
      "An easy recommendation for anyone who regularly moves installers, exports, backups, or media between devices.",
    usageNotes: [
      "Works well in support kits, creator setups, and migration prep workflows.",
      "Useful alongside docks, mini PCs, and NAS backup routines."
    ]
  },
  {
    key: "amazon-pick-brother-ptd210-label-maker-bundle",
    category: "Desk Setup",
    highlight: "Fastest operational win",
    storeBadge: "Best Starter",
    bestFor: "Desks, chargers, adapters, asset shelves, conference room bins, and onboarding kits.",
    priceBand: "$",
    tags: ["labeling", "organization", "inventory", "helpdesk"],
    recommendation:
      "Small purchase, immediate payoff. Clear labeling speeds swaps, keeps shared areas cleaner, and reduces routine friction.",
    usageNotes: [
      "Ideal for inventory bins, charger drawers, and desk drop organization.",
      "A low-cost tool that makes support spaces feel more disciplined."
    ]
  },
  {
    key: "amazon-pick-delamu-cable-management-raceway",
    category: "Desk Setup",
    highlight: "Cleanest visible upgrade",
    bestFor: "Dock-heavy desks, standing desks, dual-monitor setups, and visible client-facing workspaces.",
    priceBand: "$",
    tags: ["cable management", "workspace", "desk setup", "organization"],
    recommendation:
      "A simple way to reduce cable clutter, improve tracing, and make workstations look more deliberate on camera and in person.",
    usageNotes: [
      "Particularly useful for multi-device desks with docks, monitor arms, and external power bricks.",
      "Helps desk resets go faster after equipment changes."
    ]
  },
  {
    key: "amazon-pick-samsung-gaming-monitor-ls27fg500snxza",
    category: "Desk Setup",
    highlight: "Best mixed-use display",
    storeBadge: "Best Premium",
    bestFor: "Productivity, test environments, side projects, media, and smoother high-refresh workflows.",
    priceBand: "$$$",
    tags: ["monitor", "display", "productivity", "testing"],
    recommendation:
      "A versatile display pick when you want one screen to handle work, testing, and entertainment without feeling compromised.",
    usageNotes: [
      "Good for multi-window admin workflows and motion-heavy content.",
      "Useful bridge between basic office displays and full creator monitor setups."
    ]
  },
  {
    key: "amazon-pick-cyberpowerpc-gxivr8060a40",
    category: "Desk Setup",
    highlight: "Best ready-to-run workstation",
    bestFor: "Users who want a desktop quickly for gaming, editing, heavy multitasking, or local AI experiments.",
    priceBand: "$$$$",
    tags: ["desktop", "prebuilt", "workstation", "creator setup"],
    recommendation:
      "A sensible prebuilt option for people who want performance now and would rather skip sourcing every component individually.",
    usageNotes: [
      "Useful baseline when comparing a prebuilt workstation against a custom parts list.",
      "Pairs well with stronger displays, UPS protection, and cleaner cable management."
    ]
  },
  {
    key: "amazon-pick-usb-c-dock",
    category: "Desk Setup",
    highlight: "Best laptop desk anchor",
    storeBadge: "Best Value",
    bestFor: "Laptop swap workflows, multi-monitor desks, and USB-C-heavy daily driver setups.",
    priceBand: "$$$",
    tags: ["dock", "usb-c", "hybrid work", "productivity"],
    recommendation:
      "One of the easiest upgrades for people who dock and undock constantly and want fewer cable changes every day.",
    usageNotes: [
      "Great for hybrid users moving between office desks and home setups.",
      "Reduces friction when multiple devices share one workstation."
    ]
  },
  {
    key: "amazon-pick-mx-keys",
    category: "Desk Setup",
    highlight: "Best typing comfort upgrade",
    bestFor: "Long-form documentation, ticket queues, spreadsheets, and all-day keyboard use.",
    priceBand: "$$$",
    tags: ["keyboard", "typing", "productivity", "desk setup"],
    recommendation:
      "A reliable productivity pick when comfort, battery life, and multi-device switching matter more than gaming features.",
    usageNotes: [
      "Strong fit for admins, writers, and operators who live in documents and ticketing tools.",
      "Complements quieter, more minimal desk setups."
    ]
  },
  {
    key: "amazon-pick-mx-master",
    category: "Desk Setup",
    highlight: "Best all-day admin mouse",
    bestFor: "Spreadsheet work, browser-heavy research, dashboard navigation, and repetitive daily clicks.",
    priceBand: "$$$",
    tags: ["mouse", "ergonomics", "productivity", "workflow"],
    recommendation:
      "A comfort and control upgrade that tends to pay off quickly for people spending full days inside enterprise tooling.",
    usageNotes: [
      "Good for long work sessions and multi-device switching.",
      "Pairs naturally with productivity keyboards and dock-based setups."
    ]
  },
  {
    key: "amazon-pick-omada-router",
    category: "Networking",
    highlight: "Best network control jump",
    storeBadge: "Best Premium",
    bestFor: "Small office labs, VLAN experiments, better visibility, and cleaner Wi-Fi management.",
    priceBand: "$$$$",
    tags: ["networking", "router", "vpn", "small office"],
    recommendation:
      "A useful step up when you want more control and visibility than consumer gear without moving into overbuilt enterprise complexity.",
    usageNotes: [
      "Works well for segmenting lab traffic and improving network visibility.",
      "Makes sense for home offices that double as testing environments."
    ]
  },
  {
    key: "amazon-pick-managed-switch",
    category: "Networking",
    highlight: "Best wired network multiplier",
    storeBadge: "Best Value",
    bestFor: "VLAN practice, desk drops, uplinks, NAS connectivity, and expanding lab networks.",
    priceBand: "$$",
    tags: ["switch", "managed network", "ethernet", "vlan"],
    recommendation:
      "A practical way to grow beyond basic unmanaged networking when you want better control, separation, and wired stability.",
    usageNotes: [
      "Useful for separating trusted devices, lab hosts, and storage targets.",
      "Good companion to routers, mini PCs, and NAS gear."
    ]
  },
  {
    key: "amazon-pick-network-tester",
    category: "Networking",
    highlight: "Best troubleshooting time-saver",
    storeBadge: "Best Starter",
    bestFor: "Cable checks, port validation, desk deployments, and reducing guesswork during setup or troubleshooting.",
    priceBand: "$$",
    tags: ["tester", "ethernet", "troubleshooting", "field kit"],
    recommendation:
      "A small but credible support tool that shortens the time spent second-guessing cabling and wall drops.",
    usageNotes: [
      "Fits field kits, onboarding setups, and small network maintenance routines.",
      "Easy upsell for anyone managing their own office or creator workspace."
    ]
  },
  {
    key: "amazon-pick-ups",
    category: "Power",
    highlight: "Best infrastructure safety net",
    storeBadge: "Best Premium",
    bestFor: "Routers, NAS devices, lab hosts, workstations, and any setup that should not hard-drop on brief outages.",
    priceBand: "$$$",
    tags: ["ups", "battery backup", "power", "reliability"],
    recommendation:
      "One of the most practical infrastructure purchases on the page because it protects work, gear, and uptime all at once.",
    usageNotes: [
      "Especially useful for NAS devices, modems, routers, and desktop workstations.",
      "Supports cleaner shutdowns and fewer surprise interruptions."
    ]
  },
  {
    key: "amazon-pick-surge-protector",
    category: "Power",
    highlight: "Best low-cost safety layer",
    storeBadge: "Best Starter",
    bestFor: "Desks, AV carts, charging stations, power-dense setups, and small lab benches.",
    priceBand: "$",
    tags: ["surge protector", "power strip", "safety", "desk power"],
    recommendation:
      "A simple recommendation that helps power-heavy setups stay cleaner and less risky without adding much cost.",
    usageNotes: [
      "Good for organizing chargers, monitors, docks, and adapters on one strip.",
      "Useful first step before moving up to full battery backup."
    ]
  },
  {
    key: "amazon-pick-gan-charger",
    category: "Power",
    highlight: "Best travel kit upgrade",
    storeBadge: "Best Value",
    bestFor: "Mobile work kits, conference bags, creator travel, and cleaner charging on shared desks.",
    priceBand: "$$",
    tags: ["charger", "usb-c", "travel", "power"],
    recommendation:
      "A compact charger recommendation that reduces bulk and makes it easier to keep laptops, tablets, and phones topped off from one spot.",
    usageNotes: [
      "Good for travel kits, hot desks, and creator/mobile device staging.",
      "Pairs well with labeled cable kits and compact dock setups."
    ]
  }
];

const storefrontCollectionMetadata = [
  {
    id: "home-lab",
    title: "Home Lab",
    summary: "Starter infrastructure and compact hardware for testing, backups, and low-friction self-hosting.",
    audience: "Best for admins, tinkerers, and builders who want practical infrastructure they can grow over time.",
    productKeys: [
      "amazon-pick-raspberry-pi-5-starter-kit-pro",
      "amazon-pick-synology-nas",
      "amazon-pick-mini-pc-lab",
      "amazon-pick-samsung-t7-ssd"
    ]
  },
  {
    id: "desk-setup",
    title: "Desk Setup",
    summary: "Workstation and workspace recommendations that reduce friction, clutter, and daily switching overhead.",
    audience: "Good for helpdesk desks, hybrid workstations, creator setups, and admin-heavy daily work.",
    productKeys: [
      "amazon-pick-brother-ptd210-label-maker-bundle",
      "amazon-pick-delamu-cable-management-raceway",
      "amazon-pick-samsung-gaming-monitor-ls27fg500snxza",
      "amazon-pick-cyberpowerpc-gxivr8060a40",
      "amazon-pick-usb-c-dock",
      "amazon-pick-mx-keys",
      "amazon-pick-mx-master"
    ]
  },
  {
    id: "networking",
    title: "Networking",
    summary: "Core network gear and troubleshooting tools for stronger wired and wireless foundations.",
    audience: "Built for small office networking, home-office upgrades, and lab environments that need better visibility.",
    productKeys: [
      "amazon-pick-omada-router",
      "amazon-pick-managed-switch",
      "amazon-pick-network-tester"
    ]
  },
  {
    id: "power",
    title: "Power",
    summary: "Protective power gear for stability, cleaner charging, and safer equipment setups.",
    audience: "Useful for power-dense desks, labs, router closets, creator rigs, and workstation protection.",
    productKeys: [
      "amazon-pick-ups",
      "amazon-pick-surge-protector",
      "amazon-pick-gan-charger"
    ]
  }
] as const;

function getAmazonAffiliateOrThrow(key: string): AffiliateLink {
  const link = getAffiliateLinkByKey(key);

  if (!link) {
    throw new Error(`Missing Amazon affiliate link for key "${key}".`);
  }

  return link;
}

export function getAmazonStorefrontHeroLink(): AffiliateLink | undefined {
  return getAffiliateLinkByKey("amazon-it-gear");
}

export function getAmazonStorefrontProducts(): AmazonStorefrontProduct[] {
  return storefrontProductMetadata.map((product) => ({
    ...product,
    affiliate: getAmazonAffiliateOrThrow(product.key)
  }));
}

export function getAmazonStorefrontFeaturedPicks(): AmazonStorefrontProduct[] {
  const orderedKeys = storefrontProductMetadata.map((product) => product.key);
  const orderedLinks = getAffiliateLinksByKeys(orderedKeys);
  const productMap = new Map(getAmazonStorefrontProducts().map((product) => [product.key, product]));

  return orderedLinks
    .map((link) => productMap.get(link.key))
    .filter((product): product is AmazonStorefrontProduct => Boolean(product));
}

export function getAmazonStorefrontCollections(): AmazonStorefrontCollection[] {
  const productMap = new Map(getAmazonStorefrontProducts().map((product) => [product.key, product]));

  return storefrontCollectionMetadata.map((collection) => ({
    ...collection,
    products: collection.productKeys
      .map((key) => productMap.get(key))
      .filter((product): product is AmazonStorefrontProduct => Boolean(product))
  }));
}
