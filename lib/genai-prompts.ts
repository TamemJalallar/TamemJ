import { genaiPrompts, type GenAIPrompt } from "@/src/content/genai/genai-prompts.registry";

export type GenAISort = "newest" | "a-z";

// ---------------------------------------------------------------------------
// Category slug helpers (mirrors the AI Agents pattern)
// ---------------------------------------------------------------------------
function toGenAICategorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

const genAICategories = [...new Set(genaiPrompts.map((p) => p.category))].sort((a, b) =>
  a.localeCompare(b)
);
const genAICategorySlugMap = new Map(genAICategories.map((cat) => [toGenAICategorySlug(cat), cat]));

export interface GenAIFilterState {
  platform: "All" | GenAIPrompt["platform"];
  tool: "All" | GenAIPrompt["tool"];
  complexity: "All" | GenAIPrompt["complexity"];
  category: "All" | string;
}

export const defaultGenAIFilters: GenAIFilterState = {
  platform: "All",
  tool: "All",
  complexity: "All",
  category: "All"
};

export function getGenAIPrompts(): GenAIPrompt[] {
  return genaiPrompts.map((prompt) => ({
    ...prompt,
    tags: [...prompt.tags],
    variables: prompt.variables ? prompt.variables.map((variable) => ({ ...variable })) : undefined,
    bestPractices: prompt.bestPractices ? [...prompt.bestPractices] : undefined
  }));
}

export function getGenAIPromptBySlug(slug: string): GenAIPrompt | undefined {
  return genaiPrompts.find((prompt) => prompt.slug === slug);
}

export function getGenAICategories(): string[] {
  return [...genAICategories];
}

export function getGenAICategorySlug(category: string): string {
  return toGenAICategorySlug(category);
}

export function getGenAICategoryBySlug(slug: string): string | undefined {
  return genAICategorySlugMap.get(slug);
}

export function getGenAIPromptsByCategory(category: string): GenAIPrompt[] {
  return genaiPrompts
    .filter((prompt) => prompt.category === category)
    .map((prompt) => ({
      ...prompt,
      tags: [...prompt.tags],
      variables: prompt.variables ? prompt.variables.map((v) => ({ ...v })) : undefined,
      bestPractices: prompt.bestPractices ? [...prompt.bestPractices] : undefined
    }));
}

export function getGenAITools(): GenAIPrompt["tool"][] {
  return [...new Set(genaiPrompts.map((prompt) => prompt.tool))];
}

export function filterAndSortGenAIPrompts(
  prompts: GenAIPrompt[],
  query: string,
  filters: GenAIFilterState,
  sort: GenAISort
): GenAIPrompt[] {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = prompts.filter((prompt) => {
    if (filters.platform !== "All" && prompt.platform !== filters.platform) {
      return false;
    }

    if (filters.tool !== "All" && prompt.tool !== filters.tool) {
      return false;
    }

    if (filters.complexity !== "All" && prompt.complexity !== filters.complexity) {
      return false;
    }

    if (filters.category !== "All" && prompt.category !== filters.category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [prompt.title, prompt.summary, prompt.platform, prompt.tool, prompt.category, ...prompt.tags]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "a-z") {
      return a.title.localeCompare(b.title);
    }

    return b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title);
  });

  return sorted;
}

export function fillPromptVariables(promptText: string, values: Record<string, string>): string {
  return promptText.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_match, key) => {
    const value = values[key];
    if (!value) {
      return `{{${key}}}`;
    }

    return value;
  });
}

export function getRelatedGenAIPrompts(slug: string, limit = 6): GenAIPrompt[] {
  const current = getGenAIPromptBySlug(slug);
  if (!current) {
    return [];
  }

  const currentTags = new Set(current.tags);

  return getGenAIPrompts()
    .filter((prompt) => prompt.slug !== slug)
    .map((prompt) => {
      const sharedTags = prompt.tags.filter((tag) => currentTags.has(tag)).length;
      const sameCategory = prompt.category === current.category ? 1 : 0;
      const sameTool = prompt.tool === current.tool ? 1 : 0;
      const samePlatform = prompt.platform === current.platform ? 1 : 0;
      const score = sameCategory * 4 + sameTool * 3 + samePlatform * 2 + sharedTags;

      return { prompt, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.prompt.title.localeCompare(b.prompt.title))
    .slice(0, limit)
    .map((entry) => entry.prompt);
}
