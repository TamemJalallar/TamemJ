import type { GenAIPrompt } from "@/src/content/genai/genai-prompts.registry";
import { GenAIVariablesForm } from "@/components/genai-prompts/genai-variables-form";

interface GenAIPromptDetailProps {
  prompt: GenAIPrompt;
}

function badgeTone(platform: GenAIPrompt["platform"]): string {
  switch (platform) {
    case "MetaAI":
      return "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-500/30 dark:bg-primary-500/12 dark:text-primary-200";
    case "AdobeGenAI":
      return "border-accent-200 bg-accent-50 text-accent-700 dark:border-accent-500/30 dark:bg-accent-500/12 dark:text-accent-200";
    default:
      return "border-line bg-card-2 text-fg-secondary dark:border-white/15 dark:bg-card-3 dark:text-fg-secondary";
  }
}

export function GenAIPromptDetail({ prompt }: GenAIPromptDetailProps) {
  return (
    <div className="space-y-5">
      <article className="surface-card-strong p-5 sm:p-6">
        <p className="eyebrow">Prompt Detail</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-fg sm:text-4xl">{prompt.title}</h1>
        <p className="mt-2 max-w-4xl text-sm leading-7 text-fg-secondary">{prompt.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeTone(prompt.platform)}`}>
            {prompt.platform}
          </span>
          <span className="filter-chip px-3 py-1 text-xs font-semibold">
            {prompt.tool}
          </span>
          <span className="filter-chip px-3 py-1 text-xs font-semibold">
            {prompt.complexity}
          </span>
          <span className="filter-chip px-3 py-1 text-xs font-semibold">
            {prompt.category}
          </span>
          {prompt.outputFormat ? (
            <span className="filter-chip px-3 py-1 text-xs font-semibold">
              Output: {prompt.outputFormat}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {prompt.tags.map((tag) => (
            <span
              key={`${prompt.slug}-${tag}`}
              className="filter-chip px-2 py-0.5 text-[11px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {prompt.bestPractices && prompt.bestPractices.length > 0 ? (
          <div className="mt-4 rounded-xl border border-line/80 bg-card-2/80 p-3 dark:bg-card/80">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Best practices
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-fg-secondary">
              {prompt.bestPractices.map((practice) => (
                <li key={`${prompt.slug}-${practice}`}>{practice}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {prompt.exampleUse ? (
          <p className="mt-4 text-sm text-fg-secondary">
            <span className="font-semibold text-fg">Example use:</span> {prompt.exampleUse}
          </p>
        ) : null}
      </article>

      <GenAIVariablesForm prompt={prompt} />
    </div>
  );
}
