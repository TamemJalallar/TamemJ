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
        <h2 className="font-display text-xl font-semibold text-fg">Prompt Variables + Preview</h2>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={prompt.prompt} label="Copy original" className="btn-secondary !px-4 !py-2 text-xs" />
          <CopyButton value={filledPrompt} label="Copy with variables" className="btn-primary !px-4 !py-2 text-xs" />
        </div>
      </div>

      {variables.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {variables.map((variable) => (
            <label key={`${prompt.slug}-${variable.key}`} className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                {variable.label}
                {variable.required ? " *" : ""}
              </span>
              <input
                value={values[variable.key] ?? ""}
                onChange={(event) => updateValue(variable.key, event.target.value)}
                placeholder={variable.placeholder}
                className="form-input h-10 px-3"
              />
            </label>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-fg-secondary">This prompt does not define variables.</p>
      )}

      <div className="mt-5 rounded-xl border border-line/80 bg-card-2/80 p-3 dark:bg-card/80">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          Live prompt preview
        </p>
        <pre className="mt-2 max-h-[30rem] overflow-auto whitespace-pre-wrap rounded-lg border border-line/70 bg-neutral-950 px-3 py-2 font-mono text-xs leading-6 text-neutral-50 dark:bg-neutral-950">
          {filledPrompt}
        </pre>
      </div>

      {prompt.negativePrompt ? (
        <div className="alert-warning mt-4 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em]">
            Negative prompt
          </p>
          <p className="mt-1 text-sm">{prompt.negativePrompt}</p>
        </div>
      ) : null}
    </section>
  );
}
