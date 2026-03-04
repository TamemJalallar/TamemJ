"use client";

import { useMemo, useState } from "react";
import type { GenAIPrompt } from "@/src/content/genai/genai-prompts.registry";
import { fillPromptVariables } from "@/lib/genai-prompts";
import { CopyButton } from "@/components/genai-prompts/copy-button";

interface GenAIVariablesFormProps {
  prompt: GenAIPrompt;
}

export function GenAIVariablesForm({ prompt }: GenAIVariablesFormProps) {
  const variables = prompt.variables ?? [];
  const [values, setValues] = useState<Record<string, string>>({});

  const filledPrompt = useMemo(() => fillPromptVariables(prompt.prompt, values), [prompt.prompt, values]);

  function updateValue(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Prompt Variables + Preview</h2>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={prompt.prompt} label="Copy original" className="btn-secondary !px-4 !py-2 text-xs" />
          <CopyButton value={filledPrompt} label="Copy with variables" className="btn-primary !px-4 !py-2 text-xs" />
        </div>
      </div>

      {variables.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {variables.map((variable) => (
            <label key={`${prompt.slug}-${variable.key}`} className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                {variable.label}
                {variable.required ? " *" : ""}
              </span>
              <input
                value={values[variable.key] ?? ""}
                onChange={(event) => updateValue(variable.key, event.target.value)}
                placeholder={variable.placeholder}
                className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">This prompt does not define variables.</p>
      )}

      <div className="mt-5 rounded-xl border border-line/80 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          Live prompt preview
        </p>
        <pre className="mt-2 max-h-[30rem] overflow-auto whitespace-pre-wrap rounded-lg border border-line/70 bg-slate-950 px-3 py-2 font-mono text-xs leading-6 text-slate-100 dark:border-slate-700">
          {filledPrompt}
        </pre>
      </div>

      {prompt.negativePrompt ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/30">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-200">
            Negative prompt
          </p>
          <p className="mt-1 text-sm text-amber-800 dark:text-amber-100">{prompt.negativePrompt}</p>
        </div>
      ) : null}
    </section>
  );
}
