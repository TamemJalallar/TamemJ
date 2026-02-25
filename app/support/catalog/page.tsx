import type { Metadata } from "next";
import { ServiceCatalogBrowser } from "@/components/support-portal/service-catalog-browser";
import { getCatalogItems } from "@/lib/support.catalog.registry";

export const metadata: Metadata = {
  title: "Service Catalog",
  description:
    "Request common IT services including software installs, access requests, mailbox changes, VPN access, and device support.",
  alternates: { canonical: "/support/catalog/" }
};

export default function CatalogPage() {
  return <ServiceCatalogBrowser items={getCatalogItems()} />;
}
