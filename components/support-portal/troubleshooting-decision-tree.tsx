"use client";

import { useMemo } from "react";
import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";

type ScopeSelection = "single-user" | "multi-user";
type RecurrenceSelection = "intermittent" | "persistent";
type ImpactSelection = "degraded" | "blocked";

interface DecisionContext {
  symptom: string;
  scope: ScopeSelection | null;
  recurrence: RecurrenceSelection | null;
  impact: ImpactSelection | null;
}

type DecisionEvent =
  | { type: "SELECT_SYMPTOM"; symptom: string }
  | { type: "SELECT_SCOPE"; scope: ScopeSelection }
  | { type: "SELECT_RECURRENCE"; recurrence: RecurrenceSelection }
  | { type: "SELECT_IMPACT"; impact: ImpactSelection }
  | { type: "BACK" }
  | { type: "RESET" };

const initialContext: DecisionContext = {
  symptom: "",
  scope: null,
  recurrence: null,
  impact: null
};

const troubleshootingDecisionMachine = createMachine({
  types: {
    context: {} as DecisionContext,
    events: {} as DecisionEvent
  },
  context: initialContext,
  initial: "symptom",
  states: {
    symptom: {
      on: {
        SELECT_SYMPTOM: {
          target: "scope",
          actions: assign({
            symptom: ({ event }) => event.symptom,
            scope: () => null,
            recurrence: () => null,
            impact: () => null
          })
        },
        RESET: {
          actions: assign(() => initialContext)
        }
      }
    },
    scope: {
      on: {
        SELECT_SCOPE: {
          target: "recurrence",
          actions: assign({
            scope: ({ event }) => event.scope
          })
        },
        BACK: "symptom",
        RESET: {
          target: "symptom",
          actions: assign(() => initialContext)
        }
      }
    },
    recurrence: {
      on: {
        SELECT_RECURRENCE: {
          target: "impact",
          actions: assign({
            recurrence: ({ event }) => event.recurrence
          })
        },
        BACK: "scope",
        RESET: {
          target: "symptom",
          actions: assign(() => initialContext)
        }
      }
    },
    impact: {
      on: {
        SELECT_IMPACT: {
          target: "recommendation",
          actions: assign({
            impact: ({ event }) => event.impact
          })
        },
        BACK: "recurrence",
        RESET: {
          target: "symptom",
          actions: assign(() => initialContext)
        }
      }
    },
    recommendation: {
      on: {
        RESET: {
          target: "symptom",
          actions: assign(() => initialContext)
        }
      }
    }
  }
});

function getRecommendation(context: DecisionContext, accessLevel: string) {
  const needsAdmin = accessLevel === "Admin Required";

  if (context.scope === "multi-user" && context.impact === "blocked") {
    return {
      title: "Escalate Immediately",
      summary:
        "This pattern indicates broad user impact. Open a high-visibility incident and involve endpoint or identity owners before making broad policy changes.",
      actions: [
        "Capture exact timestamps and affected user count.",
        "Collect command output and error screenshots from at least one affected endpoint.",
        "Escalate to platform engineering and security duty contacts."
      ]
    };
  }

  if (context.scope === "multi-user") {
    return {
      title: "Treat as Shared Service Issue",
      summary:
        "Multiple users are affected. Validate assignment scope, service health, and recent policy changes before per-device remediation.",
      actions: [
        "Confirm whether failures are region-, group-, or platform-specific.",
        "Review deployment rings, assignment groups, and recent configuration rollouts.",
        "Escalate if the issue extends beyond one team or office."
      ]
    };
  }

  if (context.recurrence === "persistent" || context.impact === "blocked") {
    return {
      title: "Run Full Guided Remediation",
      summary:
        "This is likely a hard failure rather than transient behavior. Execute all resolution sections and diagnostics in order.",
      actions: [
        "Follow every accordion step in sequence and capture outputs.",
        "Run command snippets and attach results to the ticket.",
        needsAdmin
          ? "Coordinate with admin operators for managed profile or policy actions."
          : "Escalate if issue persists after documented remediation."
      ]
    };
  }

  return {
    title: "Apply Fast-Path Fix",
    summary:
      "Likely a localized transient issue. Use safe initial remediation and monitor for recurrence before escalating.",
    actions: [
      "Apply the first remediation steps only and re-test.",
      "Confirm user workflow is restored for at least one full session.",
      "Escalate if the symptom returns within the same business day."
    ]
  };
}

function StepButton({
  label,
  description,
  onClick
}: {
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-line/80 bg-white px-3 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800"
    >
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</p>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{description}</p>
    </button>
  );
}

export function TroubleshootingDecisionTree({
  symptoms,
  accessLevel
}: {
  symptoms: string[];
  accessLevel: string;
}) {
  const [state, send] = useMachine(troubleshootingDecisionMachine);

  const recommendation = useMemo(() => {
    if (!state.matches("recommendation")) return null;
    return getRecommendation(state.context, accessLevel);
  }, [accessLevel, state]);

  const topSymptoms = symptoms.slice(0, 4);

  return (
    <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Interactive Decision Tree</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            ITIL-style triage path powered by state machine logic.
          </p>
        </div>
        {!state.matches("symptom") ? (
          <button type="button" onClick={() => send({ type: "RESET" })} className="btn-secondary !px-4 !py-2">
            Reset
          </button>
        ) : null}
      </div>

      {state.matches("symptom") ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {topSymptoms.map((symptom) => (
            <StepButton
              key={symptom}
              label={symptom}
              description="Start triage with this symptom"
              onClick={() => send({ type: "SELECT_SYMPTOM", symptom })}
            />
          ))}
        </div>
      ) : null}

      {state.matches("scope") ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Scope check for: <span className="font-semibold">{state.context.symptom}</span>
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <StepButton
              label="Single User / Device"
              description="Issue appears isolated."
              onClick={() => send({ type: "SELECT_SCOPE", scope: "single-user" })}
            />
            <StepButton
              label="Multiple Users / Devices"
              description="Likely shared service or policy issue."
              onClick={() => send({ type: "SELECT_SCOPE", scope: "multi-user" })}
            />
          </div>
          <button type="button" onClick={() => send({ type: "BACK" })} className="btn-secondary !px-4 !py-2">
            Back
          </button>
        </div>
      ) : null}

      {state.matches("recurrence") ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Recurrence pattern
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <StepButton
              label="Intermittent"
              description="Issue comes and goes."
              onClick={() => send({ type: "SELECT_RECURRENCE", recurrence: "intermittent" })}
            />
            <StepButton
              label="Persistent"
              description="Issue reproduces every attempt."
              onClick={() => send({ type: "SELECT_RECURRENCE", recurrence: "persistent" })}
            />
          </div>
          <button type="button" onClick={() => send({ type: "BACK" })} className="btn-secondary !px-4 !py-2">
            Back
          </button>
        </div>
      ) : null}

      {state.matches("impact") ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">User impact level</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <StepButton
              label="Workflow Degraded"
              description="User can still operate with workaround."
              onClick={() => send({ type: "SELECT_IMPACT", impact: "degraded" })}
            />
            <StepButton
              label="Workflow Blocked"
              description="User cannot continue business workflow."
              onClick={() => send({ type: "SELECT_IMPACT", impact: "blocked" })}
            />
          </div>
          <button type="button" onClick={() => send({ type: "BACK" })} className="btn-secondary !px-4 !py-2">
            Back
          </button>
        </div>
      ) : null}

      {state.matches("recommendation") && recommendation ? (
        <div className="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{recommendation.title}</p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{recommendation.summary}</p>
          <ul className="mt-3 space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
            {recommendation.actions.map((action) => (
              <li key={action} className="list-disc">
                {action}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="#resolution-steps" className="btn-primary !px-4 !py-2">
              Go to Resolution Steps
            </a>
            <button type="button" onClick={() => send({ type: "RESET" })} className="btn-secondary !px-4 !py-2">
              Start Over
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
