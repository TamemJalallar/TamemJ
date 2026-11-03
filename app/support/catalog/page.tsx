import type { Metadata } from "next";
import { AdSenseSlot } from "@/components/monetization/adsense-slot";
import { getAdSenseSlot, monetizationConfig } from "@/lib/monetization";
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
      <div className="section-shell pb-6 pt-2">
        <div className="page-shell">
          <AdSenseSlot
            client={monetizationConfig.adsenseClient}
            slot={getAdSenseSlot("display")}
            label="Advertisement"
          />
        </div>
      </div>
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
