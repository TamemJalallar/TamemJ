import type {
  CorporateFixAccessLevel,
  CorporateFixSeverity,
  CorporateFixStepType
} from "@/lib/corporate-fixes.registry";

interface ClassNameProps {
  className?: string;
}

function joinClasses(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function EnterpriseSupportBanner({ className }: ClassNameProps) {
  return (
    <div
      className={joinClasses(
        "rounded-2xl border border-cyan-200/80 bg-cyan-50 px-4 py-3 shadow-soft",
        "dark:border-cyan-900/60 dark:bg-cyan-950/40",
        className
      )}
      role="note"
      aria-label="Enterprise support banner"
    >
      <p className="text-sm font-medium text-cyan-900 dark:text-cyan-100">
        Designed for Enterprise IT Support &amp; Corporate Environments
      </p>
    </div>
  );
}

export function SeverityBadge({
  severity,
  className
}: { severity: CorporateFixSeverity } & ClassNameProps) {
  const severityStyles: Record<CorporateFixSeverity, string> = {
    Low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200",
    Medium:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200",
    High: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200"
  };

  return (
    <span
      className={joinClasses(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        severityStyles[severity],
        className
      )}
    >
      Severity: {severity}
    </span>
  );
}

export function AccessLevelBadge({
  accessLevel,
  className
}: { accessLevel: CorporateFixAccessLevel } & ClassNameProps) {
  const styles: Record<CorporateFixAccessLevel, string> = {
    "User Safe":
      "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
    "Admin Required":
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/70 dark:bg-violet-950/40 dark:text-violet-200"
  };

  return (
    <span
      className={joinClasses(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        styles[accessLevel],
        className
      )}
    >
      {accessLevel}
    </span>
  );
}

export function MetaPill({
  label,
  value,
  className
}: { label: string; value: string } & ClassNameProps) {
  return (
    <div
      className={joinClasses(
        "rounded-xl border border-line/80 bg-white/80 px-3 py-2 text-sm shadow-sm",
        "dark:border-slate-800 dark:bg-slate-900/70",
        className
      )}
    >
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

export function TagChip({
  label,
  active = false,
  onClick,
  asSpan = false
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  asSpan?: boolean;
}) {
  const classes = joinClasses(
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition",
    active
      ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
      : "border-line/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
  );

  if (asSpan) {
    return <span className={classes}>#{label}</span>;
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-pressed={active}>
      #{label}
    </button>
  );
}

export function StepTypeBadge({ type }: { type: CorporateFixStepType }) {
  const styles: Record<CorporateFixStepType, { label: string; className: string }> = {
    info: {
      label: "Info",
      className:
        "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-200"
    },
    command: {
      label: "Command",
      className:
        "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/40 dark:text-indigo-200"
    },
    warning: {
      label: "Warning",
      className:
        "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200"
    }
  };

  const style = styles[type];

  return (
    <span
      className={joinClasses(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        style.className
      )}
    >
      {style.label}
    </span>
  );
}

