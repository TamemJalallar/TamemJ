import type { Metadata } from "next";
import { KnowledgeBaseBrowser } from "@/components/support-portal/knowledge-base-browser";
import { getKBArticles } from "@/lib/support.kb.registry";
import { buildSupportKbIndexMetadata } from "@/lib/support-portal.seo";

export const metadata: Metadata = buildSupportKbIndexMetadata();

export default function KBPage() {
  const articles = getKBArticles();

  return <KnowledgeBaseBrowser articles={articles} />;
}
