import type { Metadata } from "next";
import { KnowledgeBaseBrowser } from "@/components/support-portal/knowledge-base-browser";
import { getKBArticles } from "@/lib/support.kb.registry";
import {
  buildBreadcrumbJsonLd,
  buildKbIndexJsonLd,
  buildSupportKbIndexMetadataWithArticles
} from "@/lib/support-portal.seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildSupportKbIndexMetadataWithArticles(getKBArticles());
}

export default function KBPage() {
  const articles = getKBArticles();
  const kbIndexSchema = buildKbIndexJsonLd(articles);
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Support Portal", path: "/support/" },
    { name: "Knowledge Base", path: "/support/kb/" }
  ]);

  return (
    <>
      <KnowledgeBaseBrowser articles={articles} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(kbIndexSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
