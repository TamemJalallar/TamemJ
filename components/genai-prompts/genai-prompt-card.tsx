import Link from "next/link";
import type { GenAIPrompt } from "@/src/content/genai/genai-prompts.registry";

interface GenAIPromptCardProps {
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

export function GenAIPromptCard({ prompt }: GenAIPromptCardProps) {
  return (
    <article className="rounded-2xl border border-line/80 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeTone(prompt.platform)}`}>
          {prompt.platform}
        </span>
        <span className="rounded-full border border-line/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {prompt.tool}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
        <Link href={`/genai-prompts/${prompt.slug}/`} className="hover:underline">
          {prompt.title}
        </Link>
      </h3>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{prompt.summary}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-full border border-line/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {prompt.category}
        </span>
        <span className="rounded-full border border-line/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {prompt.complexity}
        </span>
        {prompt.tags.slice(0, 3).map((tag) => (
          <span
            key={`${prompt.slug}-${tag}`}
            className="rounded-full border border-line/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">Updated {new Date(prompt.updatedAt).toLocaleDateString()}</p>
        <Link href={`/genai-prompts/${prompt.slug}/`} className="btn-secondary !px-4 !py-1.5 text-xs">
          Open prompt
        </Link>
      </div>
    </article>
  );
}
