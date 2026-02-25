import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SupportPortalShell } from "@/components/support-portal/support-portal-shell";

export const metadata: Metadata = {
  title: {
    default: "Support Portal",
    template: "%s | Support Portal"
  },
  description:
    "ServiceNow-style IT support portal demo with a knowledge base, service catalog, incident intake, local ticketing, and analytics."
};

export default function SupportLayout({ children }: { children: ReactNode }) {
  return <SupportPortalShell>{children}</SupportPortalShell>;
}
