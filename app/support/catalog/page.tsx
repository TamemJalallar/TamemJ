import type { Metadata } from "next";
import { ServiceCatalogBrowser } from "@/components/support-portal/service-catalog-browser";
import { getCatalogItems } from "@/lib/support.catalog.registry";
import {
  buildBreadcrumbJsonLd,
  buildCatalogIndexJsonLd,
  buildSupportCatalogIndexMetadataWithItems
} from "@/lib/support-portal.seo";

export async function generateMetadata(): Promise<Metadata> {
  const base = buildSupportCatalogIndexMetadataWithItems(getCatalogItems());
  return {
    ...base,
    robots: { index: false, follow: false }
  };
}

export default function CatalogPage() {
  const items = getCatalogItems();
  const catalogIndexJsonLd = buildCatalogIndexJsonLd(items);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Support Portal", path: "/support/" },
    { name: "Service Catalog", path: "/support/catalog/" }
  ]);

  return (
    <>
      <ServiceCatalogBrowser items={items} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogIndexJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
