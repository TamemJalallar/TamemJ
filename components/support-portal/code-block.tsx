"use client";

import { useEffect, useMemo, useState } from "react";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

async function copyText(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function shellToLanguage(shell: string): string {
  if (shell === "PowerShell") return "powershell";
  if (shell === "CMD") return "bat";
  if (shell === "Terminal") return "bash";
  if (shell === "CLI") return "bash";
  return "text";
}

let shikiHighlighterPromise: Promise<import("shiki").HighlighterGeneric<any, any>> | null = null;

async function getShikiHighlighter() {
  if (!shikiHighlighterPromise) {
    shikiHighlighterPromise = import("shiki").then(({ createHighlighter }) =>
      createHighlighter({
        themes: ["github-dark-default"],
        langs: ["powershell", "bat", "bash", "shell", "text", "json"]
      })
    );
  }

  return shikiHighlighterPromise;
}

async function highlightCode(content: string, shell: string): Promise<string> {
  const highlighter = await getShikiHighlighter();
  const lang = shellToLanguage(shell);

  try {
    return highlighter.codeToHtml(content, {
      lang,
      theme: "github-dark-default"
    });
  } catch {
    return highlighter.codeToHtml(content, {
      lang: "text",
      theme: "github-dark-default"
    });
  }
}

export function CodeBlock({
  title,
  shell,
  content,
  requiresAdmin = false,
  className
}: {
  title: string;
  shell: string;
  content: string;
  requiresAdmin?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  const fallbackText = useMemo(() => content, [content]);

  useEffect(() => {
    let cancelled = false;
    setHighlightedHtml(null);

    void highlightCode(content, shell).then((html) => {
      if (cancelled) {
        return;
      }
      setHighlightedHtml(html);
    });

    return () => {
      cancelled = true;
    };
  }, [content, shell]);

  async function handleCopy() {
    const success = await copyText(content);
    if (!success) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={cx("overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-inner", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{title}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {shell}
            {requiresAdmin ? " • Admin required" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="overflow-x-auto p-3 text-xs leading-6 sm:text-sm print:whitespace-pre-wrap print:break-words">
        {highlightedHtml ? (
          <div
            className="[&_pre]:m-0 [&_pre]:rounded-xl [&_pre]:bg-transparent [&_pre]:p-0 [&_code]:font-mono"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className="whitespace-pre text-slate-100">{fallbackText}</pre>
        )}
      </div>
    </div>
  );
}
