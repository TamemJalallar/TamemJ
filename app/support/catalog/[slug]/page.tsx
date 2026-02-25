import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogItemRequestView } from "@/components/support-portal/catalog-item-request-view";
import { getCatalogItemBySlug, getCatalogItems } from "@/lib/support.catalog.registry";

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

  return {
    title: item.title,
    description: item.description,
    keywords: [...item.tags, item.category, item.product, "service catalog"],
    alternates: { canonical: `/support/catalog/${item.slug}/` }
  };
}

export default async function CatalogDetailPage({ params }: CatalogDetailPageProps) {
  const { slug } = await params;
  const item = getCatalogItemBySlug(slug);

  if (!item) {
    notFound();
  }

  return <CatalogItemRequestView item={item} />;
}
