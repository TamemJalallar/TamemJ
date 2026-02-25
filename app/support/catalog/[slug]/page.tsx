import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogItemRequestView } from "@/components/support-portal/catalog-item-request-view";
import { getCatalogItemBySlug, getCatalogItems } from "@/lib/support.catalog.registry";
import {
  buildBreadcrumbJsonLd,
  buildCatalogItemJsonLd,
  buildCatalogItemMetadata
} from "@/lib/support-portal.seo";

interface CatalogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getCatalogItems().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: CatalogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getCatalogItemBySlug(slug);

  if (!item) {
    return { title: "Catalog Item Not Found" };
  }

  return buildCatalogItemMetadata(item);
}

export default async function CatalogDetailPage({ params }: CatalogDetailPageProps) {
  const { slug } = await params;
  const item = getCatalogItemBySlug(slug);

  if (!item) {
    notFound();
  }

  const itemJsonLd = buildCatalogItemJsonLd(item);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Support Portal", path: "/support/" },
    { name: "Service Catalog", path: "/support/catalog/" },
    { name: item.title, path: `/support/catalog/${item.slug}/` }
  ]);

  return (
    <>
      <CatalogItemRequestView item={item} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
