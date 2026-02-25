import type { Metadata } from "next";
import { KnowledgeBaseBrowser } from "@/components/support-portal/knowledge-base-browser";
import { getKBArticles } from "@/lib/support.kb.registry";

export const metadata: Metadata = {
  title: "Knowledge Base",
  description:
    "Enterprise-safe knowledge base articles for Microsoft 365, Adobe, Figma, Windows, macOS, networking, and browser support scenarios.",
  alternates: { canonical: "/support/kb/" }
};

export default function KBPage() {
  const articles = getKBArticles();

  return <KnowledgeBaseBrowser articles={articles} />;
}
