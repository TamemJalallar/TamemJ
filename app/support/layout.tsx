import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SupportPortalShell } from "@/components/support-portal/support-portal-shell";
import { buildSupportOpenGraph, buildSupportTwitter } from "@/lib/support-portal.seo";

export const metadata: Metadata = {
  title: {
    default: "Support Portal",
    template: "%s | Support Portal"
  },
  description:
    "ServiceNow-style IT support portal demo with an enterprise-safe knowledge base, service catalog, incident intake, local ticketing, and analytics.",
  keywords: [
    "support portal",
    "IT support knowledge base",
    "service catalog",
    "enterprise help desk",
    "IT incident management",
    "troubleshooting documentation",
    "affiliate operations",
    "affiliate link governance"
  ],
  openGraph: buildSupportOpenGraph(
    "Support Portal | Tamem J",
    "ServiceNow-style IT support portal demo with enterprise-safe troubleshooting docs, service catalog requests, and incident workflows.",
    "/support/"
  ),
  twitter: buildSupportTwitter(
    "Support Portal | Tamem J",
    "ServiceNow-style IT support portal demo with enterprise-safe troubleshooting docs, service catalog requests, and incident workflows."
  )
};

export default function SupportLayout({ children }: { children: ReactNode }) {
  return <SupportPortalShell>{children}</SupportPortalShell>;
}
