import Link from "next/link";
import type { GenAIPrompt } from "@/src/content/genai/genai-prompts.registry";

interface RelatedGenAIPromptsProps {
  prompts: GenAIPrompt[];
}

export function RelatedGenAIPrompts({ prompts }: RelatedGenAIPromptsProps) {
  if (prompts.length === 0) {
    return null;
  }

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Related Prompts</h2>
        <Link href="/genai-prompts/" className="text-sm font-semibold text-accent hover:underline">
          Browse all
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {prompts.map((prompt) => (
          <Link
            key={prompt.slug}
            href={`/genai-prompts/${prompt.slug}/`}
            className="rounded-xl border border-line/80 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              {prompt.platform} • {prompt.tool} • {prompt.complexity}
            </p>
            <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{prompt.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{prompt.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
