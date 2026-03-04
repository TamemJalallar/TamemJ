"use client";

import { useMemo, useState } from "react";
import {
  aiAgentPlatforms,
  buildAiAgentPromptForPlatform,
  type AiAgentPlatform,
  type AiAgentPrompt
} from "@/lib/aiAgents.registry";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

async function copyText(value: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function AiAgentDetail({ agent }: { agent: AiAgentPrompt }) {
  const [selectedPlatform, setSelectedPlatform] = useState<AiAgentPlatform>("ChatGPT");
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");

  const platformPrompt = useMemo(
    () => buildAiAgentPromptForPlatform(agent, selectedPlatform),
    [agent, selectedPlatform]
  );

  async function handleCopy() {
    const copied = await copyText(platformPrompt);
    setCopyState(copied ? "success" : "error");
  }

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">
          Platform-Optimized Prompt
        </h2>
        <button type="button" onClick={handleCopy} className="btn-primary !px-4 !py-2 text-xs sm:text-sm">
          {copyState === "success" ? "Copied" : copyState === "error" ? "Copy Failed" : "Copy Prompt"}
        </button>
      </div>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Select a platform to generate a prompt variant tuned for that model's response behavior.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {aiAgentPlatforms.map((platform) => (
          <button
            key={platform}
            type="button"
            onClick={() => {
              setSelectedPlatform(platform);
              setCopyState("idle");
            }}
            className={cx(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              selectedPlatform === platform
                ? "border-slate-300 bg-slate-900 text-white dark:border-slate-200 dark:bg-slate-100 dark:text-slate-900"
                : "border-line/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            )}
          >
            {platform}
          </button>
        ))}
      </div>

      <pre className="mt-4 max-h-[42rem] overflow-auto whitespace-pre-wrap rounded-xl border border-line/80 bg-slate-950 px-4 py-4 font-mono text-xs leading-6 text-slate-100 dark:border-slate-700">
        {platformPrompt}
      </pre>
    </section>
  );
}
