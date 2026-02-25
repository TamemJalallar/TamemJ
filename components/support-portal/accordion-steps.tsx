"use client";

import type { KBResolutionStep } from "@/types/support";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function StepKindBadge({ type }: { type: KBResolutionStep["type"] }) {
  const styleMap: Record<KBResolutionStep["type"], string> = {
    info: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-200",
    command: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-indigo-200",
    warning: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200"
  };

  return (
    <span className={cx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", styleMap[type])}>
      {type === "info" ? "Info" : type === "command" ? "Command" : "Warning"}
    </span>
  );
}

export function AccordionSteps({ steps }: { steps: KBResolutionStep[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={`${step.title}-${index}`}>
          <details className="support-accordion-step group overflow-hidden rounded-2xl border border-line/80 bg-white dark:border-slate-800 dark:bg-slate-900" open={index === 0}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-4 sm:px-5">
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">{step.title}</h3>
                    <StepKindBadge type={step.type} />
                    {step.requiresAdmin ? (
                      <span className="text-xs font-medium text-violet-700 dark:text-violet-300">Admin required</span>
                    ) : null}
                  </div>
                </div>
              </div>
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line/70 text-slate-500 transition group-open:rotate-180 dark:border-slate-700 dark:text-slate-400 print:hidden">
                v
              </span>
            </summary>
            <div className={cx(
              "support-accordion-content border-t px-4 py-4 sm:px-5 sm:py-5",
              step.type === "warning"
                ? "border-rose-200/80 bg-rose-50/70 dark:border-rose-900/50 dark:bg-rose-950/20"
                : "border-line/70 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/70"
            )}>
              <div className="space-y-3">
                {step.content.split(/\n{2,}/).map((block) => (
                  <div key={block}>
                    {block.split("\n").every((line) => line.trimStart().startsWith("- ")) ? (
                      <ul className="space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200 sm:text-base">
                        {block
                          .split("\n")
                          .filter(Boolean)
                          .map((line) => (
                            <li key={line} className="list-disc leading-7">
                              {line.replace(/^-\s*/, "")}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-base">
                        {block}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}
