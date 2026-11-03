import { create, insertMultiple, search } from "@orama/orama";
import type { AiAgentPrompt } from "@/lib/aiAgents.registry";
import type { GenAIPrompt } from "@/src/content/genai/genai-prompts.registry";

type AiAgentSearchDoc = {
  id: string;
  title: string;
  role: string;
  description: string;
  category: string;
  expertiseLevel: string;
  tags: string[];
};

type GenAIPromptSearchDoc = {
  id: string;
  title: string;
  summary: string;
  platform: string;
  tool: string;
  complexity: string;
  category: string;
  tags: string[];
};

let aiAgentDbPromise: Promise<unknown> | null = null;
let aiAgentSignature = "";

let genAIPromptDbPromise: Promise<unknown> | null = null;
let genAIPromptSignature = "";

function buildSignature(items: Array<{ id: string }>): string {
  if (items.length === 0) return "0";
  return `${items.length}:${items[0]?.id ?? ""}:${items[items.length - 1]?.id ?? ""}`;
}

async function getAiAgentDb(agents: AiAgentPrompt[]): Promise<unknown> {
  const signature = buildSignature(agents);
  if (aiAgentDbPromise && aiAgentSignature === signature) {
    return aiAgentDbPromise;
  }

  aiAgentSignature = signature;
  aiAgentDbPromise = (async () => {
    const db = await create({
      schema: {
        id: "string",
        title: "string",
        role: "string",
        description: "string",
        category: "string",
        expertiseLevel: "string",
        tags: "string[]"
      }
    });

    const documents: AiAgentSearchDoc[] = agents.map((agent) => ({
      id: agent.id,
      title: agent.title,
      role: agent.role,
      description: agent.description,
      category: agent.category,
      expertiseLevel: agent.expertiseLevel,
      tags: agent.tags
    }));

    await insertMultiple(db, documents, 200);
    return db;
  })();

  return aiAgentDbPromise;
}

async function getGenAIPromptDb(prompts: GenAIPrompt[]): Promise<unknown> {
  const signature = buildSignature(prompts);
  if (genAIPromptDbPromise && genAIPromptSignature === signature) {
    return genAIPromptDbPromise;
  }

  genAIPromptSignature = signature;
  genAIPromptDbPromise = (async () => {
    const db = await create({
      schema: {
        id: "string",
        title: "string",
        summary: "string",
        platform: "string",
        tool: "string",
        complexity: "string",
        category: "string",
        tags: "string[]"
      }
    });

    const documents: GenAIPromptSearchDoc[] = prompts.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      summary: prompt.summary,
      platform: prompt.platform,
      tool: prompt.tool,
      complexity: prompt.complexity,
      category: prompt.category,
      tags: prompt.tags
    }));

    await insertMultiple(db, documents, 200);
    return db;
  })();

  return genAIPromptDbPromise;
}

export async function searchAiAgentsOrama(
  query: string,
  agents: AiAgentPrompt[],
  limit = 700
): Promise<string[]> {
  const term = query.trim();
  if (!term) {
    return [];
  }

  try {
    const db = await getAiAgentDb(agents);
    const result = await search(db as any, {
      term,
      limit,
      properties: ["title", "role", "description", "category", "expertiseLevel", "tags"]
    });

    return result.hits.map((hit) => String((hit.document as { id: string }).id));
  } catch {
    return [];
  }
}

export async function searchGenAIPromptsOrama(
  query: string,
  prompts: GenAIPrompt[],
  limit = 500
): Promise<string[]> {
  const term = query.trim();
  if (!term) {
    return [];
  }

  try {
    const db = await getGenAIPromptDb(prompts);
    const result = await search(db as any, {
      term,
      limit,
      properties: ["title", "summary", "platform", "tool", "complexity", "category", "tags"]
    });

    return result.hits.map((hit) => String((hit.document as { id: string }).id));
  } catch {
    return [];
  }
}
