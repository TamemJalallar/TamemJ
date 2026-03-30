import type { AiAgentPrompt } from "@/lib/aiAgents.registry";

export interface AiCategoryEditorial {
  introParagraphs: string[];
  useCases: string[];
  faq: Array<{ question: string; answer: string }>;
}

function toSentenceList(values: string[], limit = 4): string {
  const items = [...new Set(values.filter(Boolean))].slice(0, limit);
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function buildAiCategoryEditorial(
  category: string,
  agents: AiAgentPrompt[],
  platforms: readonly string[]
): AiCategoryEditorial {
  const roles = agents.map((agent) => agent.role);
  const tags = agents.flatMap((agent) => agent.tags);
  const expertiseLevels = [...new Set(agents.map((agent) => agent.expertiseLevel))];

  return {
    introParagraphs: [
      `${category} AI agent prompts work best when a user needs a repeatable operating model, not just a one-off answer. This category groups adjacent roles so visitors can compare agent scope, expertise level, and workflow fit from one landing page.`,
      roles.length > 0
        ? `The strongest roles in this category include ${toSentenceList(roles)}. That gives the page real topical breadth while still keeping the prompt library focused enough to rank around a coherent category intent.`
        : `This category is structured to keep related prompt roles close together and easier to browse.`,
      expertiseLevels.length > 0
        ? `These prompts currently cover ${toSentenceList(expertiseLevels)} execution paths and are available across ${toSentenceList(
            [...platforms]
          )}.`
        : `These prompts are available across ${toSentenceList([...platforms])}.`
    ],
    useCases: [
      `Use this category when you need to compare multiple ${category.toLowerCase()} roles before choosing a prompt to operationalize in ChatGPT, Claude, or another assistant.`,
      `Treat the category page as the discovery layer and the agent detail page as the execution layer. Visitors should be able to browse here, then copy a prompt only after matching it to the right workflow.`,
      tags.length > 0
        ? `The most recurring themes here include ${toSentenceList(tags)}. Those are the best terms to reinforce in intros, supporting links, and future editorial additions.`
        : `Future editorial additions should reinforce the roles and tasks most represented by this category.`
    ],
    faq: [
      {
        question: `What is the best way to use ${category} AI agent prompts?`,
        answer:
          "Start on the category page to compare roles, then open the detail page that best matches the user's real workflow, output format, and level of expertise needed."
      },
      {
        question: `Are these ${category} prompts useful across multiple AI platforms?`,
        answer: `Yes. The category is designed to support ${toSentenceList([...platforms])}, with each detail page exposing platform-tuned prompt variants.`
      },
      {
        question: `What makes this category useful for search visitors?`,
        answer:
          "A strong category page helps visitors compare prompt options, understand use cases, and move into the most relevant detail page without having to search the full library manually."
      }
    ]
  };
}
