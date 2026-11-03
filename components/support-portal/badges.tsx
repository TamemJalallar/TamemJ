import type {
  SupportAccessLevel,
  SupportEnvironment,
  SupportSeverity,
  Ticket,
  TicketPriority,
  TicketStatus,
  TicketType
} from "@/types/support";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function BaseBadge({ label, className }: { label: string; className: string }) {
  return (
    <span className={cx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", className)}>
      {label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: SupportSeverity }) {
  const styles: Record<SupportSeverity, string> = {
    Low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200",
    Medium: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200",
    High: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200"
  };
  return <BaseBadge label={`Severity: ${severity}`} className={styles[severity]} />;
}

export function AccessLevelBadge({ accessLevel }: { accessLevel: SupportAccessLevel }) {
  return (
    <BaseBadge
      label={accessLevel}
      className={
        accessLevel === "Admin Required"
          ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-200"
          : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      }
    />
  );
}

export function EnvironmentBadge({ environment }: { environment: SupportEnvironment }) {
  return (
    <BaseBadge
      label={`Env: ${environment}`}
      className="border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-200"
    />
  );
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  const styles: Record<TicketStatus, string> = {
    New: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200",
    "In Progress": "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200",
    "Waiting on User": "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-900/60 dark:bg-fuchsia-950/30 dark:text-fuchsia-200",
    Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200",
    Closed: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
  };
  return <BaseBadge label={status} className={styles[status]} />;
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const styles: Record<TicketPriority, string> = {
    P1: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200",
    P2: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/30 dark:text-orange-200",
    P3: "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900/60 dark:bg-yellow-950/30 dark:text-yellow-200",
    P4: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
  };
  return <BaseBadge label={priority} className={styles[priority]} />;
}

export function TicketTypeBadge({ type }: { type: TicketType }) {
  return (
    <BaseBadge
      label={type}
      className={
        type === "Incident"
          ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200"
          : "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-indigo-200"
      }
    />
  );
}

export function TicketBadgeRow({ ticket }: { ticket: Ticket }) {
  return (
    <div className="flex flex-wrap gap-2">
      <TicketTypeBadge type={ticket.type} />
      <StatusBadge status={ticket.status} />
      <PriorityBadge priority={ticket.priority} />
    </div>
  );
}
