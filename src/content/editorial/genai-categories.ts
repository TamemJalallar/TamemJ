import type { GenAIPrompt } from "@/src/content/genai/genai-prompts.registry";

export interface GenAICategoryEditorial {
  introParagraphs: string[];
  workflowHighlights: string[];
  faq: Array<{ question: string; answer: string }>;
}

function toSentenceList(values: string[], limit = 4): string {
  const items = [...new Set(values.filter(Boolean))].slice(0, limit);
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function buildGenAICategoryEditorial(
  category: string,
  prompts: GenAIPrompt[]
): GenAICategoryEditorial {
  const tools = prompts.map((prompt) => prompt.tool);
  const platforms = prompts.map((prompt) => prompt.platform);
  const complexities = [...new Set(prompts.map((prompt) => prompt.complexity))];
  const tags = prompts.flatMap((prompt) => prompt.tags);

  return {
    introParagraphs: [
      `${category} AI prompts should feel like a practical workflow shelf, not just a tag archive. This landing page is strongest when it helps users understand which prompt pattern to use first, what tool it belongs to, and how the category fits a real creative or production task.`,
      tools.length > 0
        ? `Within this category, the main workflow types include ${toSentenceList(tools)}. That mix gives the page room to satisfy both broad category intent and narrower tool-specific searches.`
        : `Within this category, the prompt set supports multiple generative AI workflows.`,
      complexities.length > 0
        ? `The prompt set currently spans ${toSentenceList(complexities)} complexity paths across ${toSentenceList(
            platforms
          )}.`
        : `The prompt set spans multiple platform and workflow combinations.`
    ],
    workflowHighlights: [
      `Use this category page to choose the right workflow before copying a prompt. That reduces bounce risk and makes the landing page more useful to search visitors who are still comparing options.`,
      tags.length > 0
        ? `The strongest supporting terms here include ${toSentenceList(tags)}. Those are good candidates for stronger subheads, internal links, and future editorial sections.`
        : `This category will benefit from stronger supporting terms and subtopics as the prompt library grows.`,
      `Once a user identifies the right prompt family, the detail page should become the execution step with variables, copy actions, and related prompts.`
    ],
    faq: [
      {
        question: `What are ${category} AI prompts best used for?`,
        answer:
          tools.length > 0
            ? `${category} prompts in this library are designed for workflows such as ${toSentenceList(tools)}.`
            : `${category} prompts in this library are designed to cover multiple practical generative AI workflows.`
      },
      {
        question: `Can I use these ${category} prompts across multiple GenAI platforms?`,
        answer: `Yes. This category currently supports ${toSentenceList(platforms)}, with prompt detail pages tuned to the specific platform and tool.`
      },
      {
        question: `How should I navigate this category page?`,
        answer:
          "Start with the prompt whose workflow and tool match your immediate need, then use related categories and prompt detail pages to branch into adjacent use cases."
      }
    ]
  };
}
