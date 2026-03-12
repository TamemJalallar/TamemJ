import type { GenAIPrompt } from "@/src/content/genai/genai-prompts.registry";
import { GenAIVariablesForm } from "@/components/genai-prompts/genai-variables-form";

interface GenAIPromptDetailProps {
  prompt: GenAIPrompt;
}

function badgeTone(platform: GenAIPrompt["platform"]): string {
  switch (platform) {
    case "MetaAI":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-100";
    case "AdobeGenAI":
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-900/40 dark:text-rose-100";
    default:
      return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-900/40 dark:text-violet-100";
  }
}

export function GenAIPromptDetail({ prompt }: GenAIPromptDetailProps) {
  return (
    <div className="space-y-5">
      <article className="surface-card-strong p-5 sm:p-6">
        <p className="eyebrow">Prompt Detail</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">{prompt.title}</h1>
        <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">{prompt.summary}</p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Last updated{" "}
          {new Date(prompt.updatedAt).toLocaleDateString("en-US", {
            dateStyle: "long"
          })}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeTone(prompt.platform)}`}>
            {prompt.platform}
          </span>
          <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {prompt.tool}
          </span>
          <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {prompt.complexity}
          </span>
          <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {prompt.category}
          </span>
          {prompt.outputFormat ? (
            <span className="rounded-full border border-line/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              Output: {prompt.outputFormat}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {prompt.tags.map((tag) => (
            <span
              key={`${prompt.slug}-${tag}`}
              className="rounded-full border border-line/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {prompt.bestPractices && prompt.bestPractices.length > 0 ? (
          <div className="mt-4 rounded-xl border border-line/80 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Best practices
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              {prompt.bestPractices.map((practice) => (
                <li key={`${prompt.slug}-${practice}`}>{practice}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {prompt.exampleUse ? (
          <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-slate-100">Example use:</span> {prompt.exampleUse}
          </p>
        ) : null}
      </article>

      <GenAIVariablesForm prompt={prompt} />
    </div>
  );
}
