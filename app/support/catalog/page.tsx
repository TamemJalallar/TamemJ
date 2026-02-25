import type { Metadata } from "next";
import { ServiceCatalogBrowser } from "@/components/support-portal/service-catalog-browser";
import { getCatalogItems } from "@/lib/support.catalog.registry";
import { buildSupportCatalogIndexMetadata } from "@/lib/support-portal.seo";

export const metadata: Metadata = buildSupportCatalogIndexMetadata();

export default function CatalogPage() {
  return <ServiceCatalogBrowser items={getCatalogItems()} />;
}
