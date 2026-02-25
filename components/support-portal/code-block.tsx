"use client";

import { useState } from "react";

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

function highlightLine(line: string) {
  if (!line.trim()) {
    return <span>&nbsp;</span>;
  }

  if (line.trimStart().startsWith("#")) {
    return <span className="text-emerald-300">{line}</span>;
  }

  const parts = line.split(/(\s+)/);
  let firstTokenDone = false;

  return parts.map((part, index) => {
    if (!part) return null;
    if (/^\s+$/.test(part)) return <span key={`${line}-${index}`}>{part}</span>;

    let className = "text-slate-100";
    if (!firstTokenDone) {
      className = "text-cyan-300";
      firstTokenDone = true;
    } else if (part.startsWith("-")) {
      className = "text-fuchsia-300";
    } else if (part.startsWith("$")) {
      className = "text-amber-300";
    } else if (part.includes("://")) {
      className = "text-sky-300";
    } else if (/^[0-9]+$/.test(part)) {
      className = "text-orange-300";
    }

    return (
      <span key={`${line}-${index}`} className={className}>
        {part}
      </span>
    );
  });
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
      <pre className="overflow-x-auto p-3 text-xs leading-6 sm:text-sm print:whitespace-pre-wrap print:break-words">
        <code>
          {content.split("\n").map((line, index) => (
            <div key={`${title}-${index}`} className="min-h-5 whitespace-pre">
              {highlightLine(line)}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
