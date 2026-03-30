import type { ContentCluster, PillarContentIdea } from "@/lib/seo-content.registry";
import type { DownloadAsset } from "@/types/download";
import type { KBArticle } from "@/types/support";

export interface PillarGuideFaq {
  question: string;
  answer: string;
}

export interface PillarGuideEditorial {
  introParagraphs: string[];
  playbookSteps: string[];
  coverageHighlights: string[];
  faq: PillarGuideFaq[];
}

function toSentenceList(values: string[], limit = 3): string {
  const items = values.filter(Boolean).slice(0, limit);
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function buildPillarGuideEditorial(
  pillar: PillarContentIdea,
  cluster: ContentCluster | undefined,
  relatedKBArticles: KBArticle[],
  relatedAssets: DownloadAsset[]
): PillarGuideEditorial {
  const focusAreas = cluster?.focusAreas ?? [];
  const topTicketTitles = relatedKBArticles.slice(0, 3).map((article) => article.title);
  const topAssetTitles = relatedAssets.slice(0, 3).map((asset) => asset.title);
  const highlightedKeywords = pillar.targetKeywords.slice(0, 4);

  return {
    introParagraphs: [
      `${pillar.title} is designed as a working hub for ${cluster?.title ?? "enterprise IT"} topics, not just a list of links. It brings together exact-match troubleshooting searches, related support tickets, and practical download assets so teams can move from search intent to resolution faster.`,
      highlightedKeywords.length > 0
        ? `The highest-value demand around this topic currently clusters around searches like ${toSentenceList(
            highlightedKeywords
          )}. This page helps connect those searches to stable internal resources instead of leaving the topic fragmented across disconnected pages.`
        : `This page is meant to consolidate fragmented searches and route them into a stronger, more crawlable resource hub.`,
      focusAreas.length > 0
        ? `Use this pillar when the underlying issue touches adjacent areas such as ${toSentenceList(
            focusAreas
          )}. That cross-linking matters because these problems often share the same operational root causes and remediation workflow.`
        : `Use this pillar when the same issue shows up under multiple products, teams, or troubleshooting paths and you need a single navigation layer.`
    ],
    playbookSteps: [
      `Start with the linked ticket pages that most closely match the user's exact symptom or error phrase, then branch out only if the first-line fix does not resolve the issue.`,
      relatedAssets.length > 0
        ? `Pull in supporting assets like ${toSentenceList(topAssetTitles)} to turn one-off troubleshooting into repeatable operational documentation.`
        : `Translate recurring fixes into reusable documentation so the topic matures from ad hoc support into a maintained operational playbook.`,
      `Use the keyword and opportunity sections on this page to identify which related searches still need tighter content coverage, stronger intros, or clearer supporting links.`
    ],
    coverageHighlights: [
      topTicketTitles.length > 0
        ? `Best starting tickets: ${toSentenceList(topTicketTitles)}.`
        : "This pillar is ready for linked support coverage as more ticket pages are added.",
      relatedAssets.length > 0
        ? `Supporting asset coverage includes ${toSentenceList(topAssetTitles)}.`
        : "There is room to expand this pillar with supporting templates, scripts, and runbooks.",
      focusAreas.length > 0
        ? `Operational scope: ${toSentenceList(focusAreas)}.`
        : "Operational scope expands as more linked resources are added."
    ],
    faq: [
      {
        question: `What problems should ${pillar.title} help me solve first?`,
        answer:
          highlightedKeywords.length > 0
            ? `Start with exact-match problems close to ${toSentenceList(highlightedKeywords)}. Those are the clearest search and troubleshooting entry points for this hub.`
            : `Start with the ticket pages linked from this guide, then use the rest of the pillar to broaden the remediation path.`
      },
      {
        question: `How should I use this pillar page with the linked tickets?`,
        answer:
          "Use the pillar as the decision layer. Open the ticket that matches the exact symptom, complete that fix path, then return here to move into adjacent articles, operational assets, or broader cluster coverage."
      },
      {
        question: `Does this guide include reusable operational assets?`,
        answer:
          relatedAssets.length > 0
            ? `Yes. This guide currently links assets such as ${toSentenceList(topAssetTitles)} so teams can turn recurring troubleshooting into repeatable documentation and tooling.`
            : "Not yet in a major way. The structure is ready for linked assets, and adding scripts, checklists, or templates would make this hub stronger."
      }
    ]
  };
}
