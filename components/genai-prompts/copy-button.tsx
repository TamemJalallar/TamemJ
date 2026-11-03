"use client";

import { useEffect, useState } from "react";

interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export function CopyButton({
  value,
  label = "Copy prompt",
  copiedLabel = "Copied",
  className = "btn-primary"
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (state === "idle") {
      return;
    }

    const timeout = window.setTimeout(() => setState("idle"), 1800);
    return () => window.clearTimeout(timeout);
  }, [state]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("error");
    }
  }

  return (
    <button type="button" onClick={handleCopy} className={className}>
      {state === "copied" ? copiedLabel : state === "error" ? "Copy failed" : label}
    </button>
  );
}
