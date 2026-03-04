export const aiPromptProviders = [
  "ChatGPT",
  "Claude",
  "Adobe GenAI",
  "Perplexity",
  "Grok/xAI",
  "Meta AI"
] as const;

export type AiPromptProvider = (typeof aiPromptProviders)[number];

export const aiPromptExpertiseLevels = [
  "Beginner",
  "Hobbyist",
  "Intermediate",
  "Expert"
] as const;

export type AiPromptExpertise = (typeof aiPromptExpertiseLevels)[number];

export interface AiPromptField {
  key: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  required: boolean;
  multiline?: boolean;
}

export interface AiPromptTemplate {
  slug: string;
  title: string;
  description: string;
  objective: string;
  fields: AiPromptField[];
  outputRequirements: string[];
}

const providerGuidanceByModel: Record<AiPromptProvider, string> = {
  ChatGPT:
    "Use clear sections, provide actionable options, and include concise rationale for each recommendation.",
  Claude:
    "Prioritize structured reasoning, edge-case awareness, and safe implementation steps with explicit tradeoffs.",
  "Adobe GenAI":
    "Emphasize creative direction, UX clarity, and visual communication quality where relevant to the task.",
  Perplexity:
    "Use source-backed reasoning; include trustworthy references or search paths when factual claims are made.",
  "Grok/xAI":
    "Be direct and pragmatic, challenge weak assumptions, and present concise implementation alternatives.",
  "Meta AI":
    "Use plain language, high readability, and concise step-by-step instructions suitable for quick execution."
};

const expertiseGuidanceByLevel: Record<AiPromptExpertise, string> = {
  Beginner:
    "Explain terminology in plain language, avoid assumed context, and provide step-by-step implementation checkpoints.",
  Hobbyist:
    "Use practical examples and moderate depth, with optional advanced notes separated from the core path.",
  Intermediate:
    "Assume baseline technical knowledge, focus on tradeoffs, and provide implementation-ready detail.",
  Expert:
    "Keep response concise and technical, focus on architecture-level decisions, edge cases, and risk controls."
};

const templates: AiPromptTemplate[] = [
  {
    slug: "app-development-plan",
    title: "App Development Plan",
    description:
      "Plan an application from scope to architecture, implementation milestones, and launch criteria.",
    objective:
      "Produce a practical software delivery plan with architecture decisions, development phases, and risk controls.",
    fields: [
      {
        key: "app_type",
        label: "App Type",
        placeholder: "Web app, mobile app, desktop utility, API service, etc.",
        defaultValue: "Web application",
        required: true
      },
      {
        key: "target_users",
        label: "Target Users",
        placeholder: "Who will use the app and in what context?",
        defaultValue: "IT administrators and support engineers",
        required: true
      },
      {
        key: "tech_stack",
        label: "Preferred Stack",
        placeholder: "Frameworks, languages, databases, and hosting choices",
        defaultValue: "Next.js, TypeScript, Tailwind, static hosting",
        required: true
      },
      {
        key: "must_have_features",
        label: "Must-Have Features",
        placeholder: "List required capabilities",
        defaultValue: "Authentication, role-based access, search, analytics",
        required: true,
        multiline: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Budget, timeline, compliance, deployment constraints",
        defaultValue: "GitHub Pages compatibility, low cost, enterprise-safe",
        required: false,
        multiline: true
      }
    ],
    outputRequirements: [
      "Return a phased plan (MVP, v1, v2) with clear deliverables per phase.",
      "Include architecture recommendation and key tradeoffs.",
      "Define security, testing, and observability baselines.",
      "Provide a prioritized backlog with effort estimates.",
      "Call out major risks and mitigation steps."
    ]
  },
  {
    slug: "it-troubleshooting-runbook",
    title: "IT Troubleshooting Runbook",
    description:
      "Generate an enterprise-safe runbook for a specific IT issue with escalation boundaries.",
    objective:
      "Create a structured troubleshooting guide that starts with user-safe checks and escalates safely.",
    fields: [
      {
        key: "issue_summary",
        label: "Issue Summary",
        placeholder: "Describe the incident or error",
        defaultValue: "VPN connected but no internet access",
        required: true
      },
      {
        key: "environment",
        label: "Environment",
        placeholder: "Windows, macOS, mobile, cloud tenant, etc.",
        defaultValue: "Windows and macOS endpoints in enterprise environment",
        required: true
      },
      {
        key: "impact_scope",
        label: "Impact Scope",
        placeholder: "Single user, team, department, all users, etc.",
        defaultValue: "Multiple users in one office location",
        required: true
      },
      {
        key: "known_constraints",
        label: "Security/Policy Constraints",
        placeholder: "Any rules that must be respected",
        defaultValue: "No policy bypass, no credential sharing, no unsafe registry changes",
        required: false,
        multiline: true
      }
    ],
    outputRequirements: [
      "Provide symptom validation and likely cause tree.",
      "Separate user-safe vs admin-required steps.",
      "Include diagnostic commands where appropriate.",
      "Define explicit escalation criteria for security/identity events.",
      "End with verification checks and rollback guidance."
    ]
  },
  {
    slug: "powershell-automation-script",
    title: "PowerShell Automation Script Design",
    description:
      "Design a production-safe PowerShell script with idempotent behavior and logging expectations.",
    objective:
      "Generate a safe script plan plus implementation skeleton suitable for corporate environments.",
    fields: [
      {
        key: "automation_goal",
        label: "Automation Goal",
        placeholder: "What should the script do?",
        defaultValue: "Export Entra ID MFA status report for all users",
        required: true
      },
      {
        key: "data_sources",
        label: "Data Sources/APIs",
        placeholder: "Graph API, AD module, Exchange Online, files, etc.",
        defaultValue: "Microsoft Graph with least-privilege scopes",
        required: true
      },
      {
        key: "execution_context",
        label: "Execution Context",
        placeholder: "Local admin, scheduled task, CI pipeline, Automation Account, etc.",
        defaultValue: "Scheduled task on managed admin workstation",
        required: true
      },
      {
        key: "safety_requirements",
        label: "Safety Requirements",
        placeholder: "Read-only mode, dry-run, approvals, logging policy",
        defaultValue: "Dry-run flag, structured logging, no destructive actions by default",
        required: true,
        multiline: true
      }
    ],
    outputRequirements: [
      "Provide script architecture (functions/modules) before code.",
      "Include parameter design and validation strategy.",
      "Include logging, error handling, and retry behavior.",
      "Call out required permissions and least-privilege recommendations.",
      "Provide test plan and rollout checklist."
    ]
  },
  {
    slug: "kb-article-authoring",
    title: "Knowledge Base Article Draft",
    description:
      "Draft a professional enterprise IT KB article with symptoms, causes, steps, and escalation criteria.",
    objective:
      "Create publication-ready KB content using enterprise-safe language and support-friendly structure.",
    fields: [
      {
        key: "kb_topic",
        label: "KB Topic",
        placeholder: "Main troubleshooting topic",
        defaultValue: "Outlook search not returning results",
        required: true
      },
      {
        key: "platform_scope",
        label: "Platform Scope",
        placeholder: "Windows, macOS, both, mobile, etc.",
        defaultValue: "Windows and macOS",
        required: true
      },
      {
        key: "access_level",
        label: "Access Level",
        placeholder: "User safe, admin required, mixed",
        defaultValue: "Mixed (user-safe first, admin escalation second)",
        required: true
      },
      {
        key: "required_commands",
        label: "Commands to Include",
        placeholder: "PowerShell/Terminal commands to include if applicable",
        defaultValue: "Indexing status checks and cache validation commands",
        required: false
      }
    ],
    outputRequirements: [
      "Use sections: Symptoms, Causes, Resolution Steps, Commands, Escalation Criteria, Verification.",
      "Mark each step as info/command/warning when applicable.",
      "Clearly label admin-required actions.",
      "Avoid unsafe advice or security bypass instructions.",
      "Include estimated time and severity guidance."
    ]
  },
  {
    slug: "incident-communication-draft",
    title: "Incident Communication Draft",
    description:
      "Generate internal and user-facing incident communications with clear next steps and status updates.",
    objective:
      "Produce concise status communication that is technically accurate and stakeholder-friendly.",
    fields: [
      {
        key: "incident_type",
        label: "Incident Type",
        placeholder: "Email outage, VPN issue, sign-in outage, etc.",
        defaultValue: "Microsoft 365 sign-in degradation",
        required: true
      },
      {
        key: "current_status",
        label: "Current Status",
        placeholder: "Investigation, mitigation in progress, resolved, etc.",
        defaultValue: "Mitigation in progress",
        required: true
      },
      {
        key: "affected_audience",
        label: "Affected Audience",
        placeholder: "Who is impacted?",
        defaultValue: "Users in North America region",
        required: true
      },
      {
        key: "next_update_time",
        label: "Next Update Time",
        placeholder: "When the next communication should be sent",
        defaultValue: "30 minutes",
        required: true
      }
    ],
    outputRequirements: [
      "Provide one internal update version and one end-user version.",
      "Keep language calm, specific, and non-speculative.",
      "Include current impact, mitigation in progress, and next update ETA.",
      "Include required user actions only if verified.",
      "Avoid exposing sensitive internal security details."
    ]
  }
];

export function getAiPromptTemplates(): AiPromptTemplate[] {
  return templates.map((template) => ({
    ...template,
    fields: template.fields.map((field) => ({ ...field })),
    outputRequirements: [...template.outputRequirements]
  }));
}

export function getAiPromptTemplateBySlug(slug: string): AiPromptTemplate | undefined {
  return templates.find((template) => template.slug === slug);
}

export function createPromptInputDefaults(template: AiPromptTemplate): Record<string, string> {
  return template.fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.key] = field.defaultValue;
    return acc;
  }, {});
}

interface BuildAiPromptInput {
  template: AiPromptTemplate;
  provider: AiPromptProvider;
  expertise: AiPromptExpertise;
  values: Record<string, string>;
}

function getFieldValue(field: AiPromptField, values: Record<string, string>): string {
  const value = (values[field.key] ?? "").trim();
  if (value) return value;
  if (field.required) return "[NEEDS INPUT]";
  return "Not provided";
}

export function buildAiPrompt({ template, provider, expertise, values }: BuildAiPromptInput): string {
  const contextLines = template.fields.map((field) => `- ${field.label}: ${getFieldValue(field, values)}`);
  const requiredMissing = template.fields
    .filter((field) => field.required && getFieldValue(field, values) === "[NEEDS INPUT]")
    .map((field) => field.label);

  const requirements = template.outputRequirements.map((item, index) => `${index + 1}. ${item}`);
  const missingFieldsLine =
    requiredMissing.length > 0
      ? `\nMissing required context fields: ${requiredMissing.join(", ")}. Ask focused follow-up questions before final output.`
      : "";

  return [
    `You are my ${provider} assistant.`,
    `Task: ${template.title}`,
    "",
    `Primary objective: ${template.objective}`,
    `User expertise level: ${expertise}`,
    `Expertise guidance: ${expertiseGuidanceByLevel[expertise]}`,
    `Model guidance: ${providerGuidanceByModel[provider]}`,
    "",
    "Project context:",
    ...contextLines,
    "",
    "Output requirements:",
    ...requirements,
    "",
    "Execution rules:",
    "- Keep the response practical and implementation-ready.",
    "- Use concise section headings and ordered steps where possible.",
    "- If assumptions are required, label them clearly.",
    "- If there are security or policy risks, call them out explicitly.",
    missingFieldsLine
  ]
    .filter(Boolean)
    .join("\n");
}

export interface AiPromptLibraryItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  tags: string[];
}

interface AiPromptLibraryItemSeed {
  slug: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  tags: string[];
}

function normalizePromptTag(tag: string): string {
  return tag.trim().toLowerCase();
}

function createLibraryItem(seed: AiPromptLibraryItemSeed): AiPromptLibraryItem {
  return {
    ...seed,
    tags: [...new Set(seed.tags.map(normalizePromptTag).filter(Boolean))]
  };
}

const libraryItems: AiPromptLibraryItem[] = [
  // App Development (12)
  createLibraryItem({
    slug: "prd-from-idea",
    title: "PRD From a Raw Idea",
    description: "Turn a rough app idea into a complete product requirements document.",
    category: "App Development",
    prompt:
      "Convert this idea into a full PRD with problem statement, target users, success metrics, feature scope, non-goals, constraints, and MVP acceptance criteria. Include assumptions and open questions.",
    tags: ["product", "prd", "mvp", "planning"]
  }),
  createLibraryItem({
    slug: "mvp-scope-cutter",
    title: "MVP Scope Cutter",
    description: "Reduce an oversized feature list into a realistic MVP scope.",
    category: "App Development",
    prompt:
      "Given this feature list, identify what to keep for MVP, what to defer, and what to drop. Provide rationale based on user impact, effort, risk, and time-to-value.",
    tags: ["mvp", "scope", "prioritization", "roadmap"]
  }),
  createLibraryItem({
    slug: "architecture-decision-record",
    title: "Architecture Decision Record",
    description: "Generate ADRs with alternatives and tradeoff analysis.",
    category: "App Development",
    prompt:
      "Create an ADR for this architecture choice. Include context, decision, alternatives considered, consequences, operational risks, and rollback path.",
    tags: ["architecture", "adr", "tradeoffs", "engineering"]
  }),
  createLibraryItem({
    slug: "api-contract-design",
    title: "API Contract Design",
    description: "Design REST API endpoints with validation and error standards.",
    category: "App Development",
    prompt:
      "Design an API contract for this feature: endpoints, request/response schemas, validation rules, error codes, pagination, auth model, and versioning strategy.",
    tags: ["api", "backend", "contracts", "rest"]
  }),
  createLibraryItem({
    slug: "database-schema-review",
    title: "Database Schema Review",
    description: "Review schema design for scale, consistency, and maintainability.",
    category: "App Development",
    prompt:
      "Review this schema and suggest improvements for normalization, indexing, query performance, data integrity, and migration safety. Include a migration rollout order.",
    tags: ["database", "schema", "sql", "performance"]
  }),
  createLibraryItem({
    slug: "feature-breakdown-sprints",
    title: "Feature Breakdown to Sprints",
    description: "Break a complex feature into implementation tasks and sprint phases.",
    category: "App Development",
    prompt:
      "Break this feature into epics, stories, and engineering tasks. Include dependencies, estimates, risk level, and a sprint plan with milestones.",
    tags: ["sprints", "project-management", "estimation", "delivery"]
  }),
  createLibraryItem({
    slug: "bug-reproduction-playbook",
    title: "Bug Reproduction Playbook",
    description: "Create a deterministic bug triage and reproduction plan.",
    category: "App Development",
    prompt:
      "Given this bug report, produce a reproduction playbook: likely causes, minimal repro setup, instrumentation to add, logs to capture, and a fix verification checklist.",
    tags: ["debugging", "bugs", "triage", "qa"]
  }),
  createLibraryItem({
    slug: "test-strategy-plan",
    title: "Test Strategy Plan",
    description: "Design test coverage for frontend, backend, and integration paths.",
    category: "App Development",
    prompt:
      "Create a test strategy for this system with unit, integration, e2e, and regression coverage. Include critical paths, flaky-test prevention, and release gates.",
    tags: ["testing", "qa", "quality", "automation"]
  }),
  createLibraryItem({
    slug: "code-review-checklist",
    title: "Code Review Checklist",
    description: "Generate a practical code review checklist for a pull request.",
    category: "App Development",
    prompt:
      "Create a code review checklist tailored to this PR. Cover correctness, edge cases, security, performance, maintainability, accessibility, and rollback impact.",
    tags: ["code-review", "quality", "security", "performance"]
  }),
  createLibraryItem({
    slug: "performance-optimization-plan",
    title: "Performance Optimization Plan",
    description: "Create a prioritized optimization plan from performance symptoms.",
    category: "App Development",
    prompt:
      "Given these performance symptoms, produce an optimization plan with instrumentation steps, bottleneck hypotheses, experiment design, and prioritized fixes.",
    tags: ["performance", "profiling", "optimization", "observability"]
  }),
  createLibraryItem({
    slug: "release-readiness-check",
    title: "Release Readiness Check",
    description: "Evaluate if a release candidate is safe to ship.",
    category: "App Development",
    prompt:
      "Assess release readiness from these notes. Provide go/no-go recommendation, blocking issues, mitigations, and launch-day monitoring checklist.",
    tags: ["release", "qa", "deployment", "risk"]
  }),
  createLibraryItem({
    slug: "postmortem-template",
    title: "Postmortem Template Builder",
    description: "Generate incident postmortem content with actionable follow-ups.",
    category: "App Development",
    prompt:
      "Draft a postmortem from this incident summary: timeline, root cause, contributing factors, customer impact, detection gaps, and corrective actions with owners.",
    tags: ["postmortem", "incident", "reliability", "operations"]
  }),

  // IT Support (14)
  createLibraryItem({
    slug: "outlook-sync-incident-runbook",
    title: "Outlook Sync Incident Runbook",
    description: "Create a structured enterprise-safe Outlook sync troubleshooting runbook.",
    category: "IT Support",
    prompt:
      "Write a runbook for Outlook sync failure across Windows and macOS with user-safe checks first, admin escalation next, and clear verification criteria.",
    tags: ["outlook", "m365", "runbook", "enterprise-it"]
  }),
  createLibraryItem({
    slug: "teams-meeting-av-triage",
    title: "Teams Meeting AV Triage",
    description: "Create fast triage steps for Teams audio/video failures.",
    category: "IT Support",
    prompt:
      "Build a triage flow for Teams mic/camera/speaker failures including device checks, permissions, app cache, and escalation signals.",
    tags: ["teams", "audio", "video", "troubleshooting"]
  }),
  createLibraryItem({
    slug: "onedrive-sync-conflict-resolution",
    title: "OneDrive Sync Conflict Resolution",
    description: "Generate a OneDrive conflict and stuck-sync troubleshooting guide.",
    category: "IT Support",
    prompt:
      "Create a troubleshooting guide for OneDrive processing changes, sync conflicts, and duplicate files with safe remediation and escalation path.",
    tags: ["onedrive", "sync", "files", "m365"]
  }),
  createLibraryItem({
    slug: "sharepoint-access-denied-diagnosis",
    title: "SharePoint Access Denied Diagnosis",
    description: "Diagnose SharePoint permissions and inheritance issues.",
    category: "IT Support",
    prompt:
      "Produce a diagnosis checklist for SharePoint access denied incidents: permission inheritance, group membership, external sharing policy, and tenant constraints.",
    tags: ["sharepoint", "permissions", "access", "microsoft-365"]
  }),
  createLibraryItem({
    slug: "intune-device-not-compliant-triage",
    title: "Intune Device Not Compliant Triage",
    description: "Triage Intune compliance issues with safe remediation sequencing.",
    category: "IT Support",
    prompt:
      "Create a triage runbook for Intune noncompliance with policy mapping, check-in validation, remediation sequence, and escalation criteria.",
    tags: ["intune", "compliance", "endpoint", "microsoft"]
  }),
  createLibraryItem({
    slug: "entra-conditional-access-block-analysis",
    title: "Entra Conditional Access Block Analysis",
    description: "Analyze and resolve legitimate sign-ins blocked by Conditional Access.",
    category: "IT Support",
    prompt:
      "Generate a safe analysis workflow for Conditional Access sign-in blocks with log signals, policy trace method, and secure escalation recommendations.",
    tags: ["entra", "conditional-access", "identity", "security"]
  }),
  createLibraryItem({
    slug: "jamf-policy-not-running-analysis",
    title: "Jamf Policy Not Running Analysis",
    description: "Troubleshoot Jamf policy execution failures on managed Macs.",
    category: "IT Support",
    prompt:
      "Create a Jamf policy troubleshooting playbook: scope checks, trigger validation, logs, profile conflicts, and remediation options.",
    tags: ["jamf", "macos", "mdm", "endpoint-management"]
  }),
  createLibraryItem({
    slug: "kandji-device-not-checking-in",
    title: "Kandji Device Not Checking In",
    description: "Troubleshoot Kandji check-in and policy assignment issues.",
    category: "IT Support",
    prompt:
      "Draft a Kandji troubleshooting guide for stale check-in status, lost MDM trust, and blueprint assignment problems.",
    tags: ["kandji", "mdm", "macos", "it-support"]
  }),
  createLibraryItem({
    slug: "vpn-connected-no-internet-diagnostics",
    title: "VPN Connected, No Internet Diagnostics",
    description: "Create a corporate-safe diagnostics and escalation flow for VPN path issues.",
    category: "IT Support",
    prompt:
      "Build a diagnostic flow for VPN connected/no internet incidents including DNS checks, route validation, split-tunnel behavior, and escalation boundaries.",
    tags: ["vpn", "networking", "dns", "connectivity"]
  }),
  createLibraryItem({
    slug: "dns-resolution-enterprise-troubleshooting",
    title: "Enterprise DNS Resolution Troubleshooting",
    description: "Diagnose DNS failures impacting internal and SaaS resources.",
    category: "IT Support",
    prompt:
      "Generate a DNS troubleshooting runbook for enterprise endpoints with resolver diagnostics, cache behavior, and policy-aware remediation.",
    tags: ["dns", "network", "troubleshooting", "enterprise"]
  }),
  createLibraryItem({
    slug: "printer-queue-stuck-enterprise-fix",
    title: "Printer Queue Stuck (Enterprise)",
    description: "Create safe remediation steps for print queue and spooler issues.",
    category: "IT Support",
    prompt:
      "Write a printer-queue incident guide with user-safe checks, spooler diagnostics, driver validation, and admin escalation criteria.",
    tags: ["printers", "spooler", "windows", "helpdesk"]
  }),
  createLibraryItem({
    slug: "wifi-slowness-office-network",
    title: "Office WiFi Slowness Investigation",
    description: "Generate a troubleshooting framework for corporate WiFi performance issues.",
    category: "IT Support",
    prompt:
      "Create a WiFi performance runbook for office environments: RF interference checks, roaming behavior, throughput tests, and evidence capture for escalation.",
    tags: ["wifi", "network", "performance", "office"]
  }),
  createLibraryItem({
    slug: "ios-managed-device-compliance",
    title: "iOS Managed Device Compliance Support",
    description: "Build support steps for iOS compliance and managed app issues.",
    category: "IT Support",
    prompt:
      "Produce an iOS support guide for compliance and managed-app issues in enterprise MDM contexts with safe user actions and admin handoff criteria.",
    tags: ["ios", "mdm", "intune", "mobile"]
  }),
  createLibraryItem({
    slug: "android-work-profile-incident",
    title: "Android Work Profile Incident Guide",
    description: "Create troubleshooting steps for Android work profile failures.",
    category: "IT Support",
    prompt:
      "Write a troubleshooting guide for Android work profile setup/sync failures including policy sync checks, app restrictions, and escalation rules.",
    tags: ["android", "work-profile", "enterprise", "mobile"]
  }),

  // Automation & Scripting (10)
  createLibraryItem({
    slug: "powershell-script-hardening",
    title: "PowerShell Script Hardening Plan",
    description: "Harden a PowerShell script for enterprise production use.",
    category: "Automation & Scripting",
    prompt:
      "Given this script objective, design a hardened script pattern including parameters, validation, logging, error handling, idempotency, and dry-run mode.",
    tags: ["powershell", "automation", "security", "scripting"]
  }),
  createLibraryItem({
    slug: "graph-api-bulk-automation",
    title: "Graph API Bulk Automation Design",
    description: "Design safe bulk automations using Microsoft Graph APIs.",
    category: "Automation & Scripting",
    prompt:
      "Design a Microsoft Graph bulk automation workflow with paging, throttling strategy, retries, and least-privilege permission mapping.",
    tags: ["graph-api", "microsoft", "bulk-ops", "automation"]
  }),
  createLibraryItem({
    slug: "exchange-mailbox-permission-audit-script",
    title: "Exchange Mailbox Permission Audit Script",
    description: "Generate implementation guidance for mailbox permission audits.",
    category: "Automation & Scripting",
    prompt:
      "Create a script plan for Exchange mailbox permission auditing (Full Access, Send As, Send on Behalf) with output schema and remediation notes.",
    tags: ["exchange-online", "audit", "powershell", "permissions"]
  }),
  createLibraryItem({
    slug: "ad-stale-objects-cleanup-script",
    title: "AD Stale Objects Cleanup Script",
    description: "Draft safe cleanup automation with reporting and approval gates.",
    category: "Automation & Scripting",
    prompt:
      "Design an AD stale object cleanup script with report-only mode, inactivity thresholds, exception lists, and staged disable/delete safeguards.",
    tags: ["active-directory", "cleanup", "powershell", "identity"]
  }),
  createLibraryItem({
    slug: "log-parsing-and-summary-script",
    title: "Log Parsing and Summary Script",
    description: "Generate a robust log parser design for support operations.",
    category: "Automation & Scripting",
    prompt:
      "Create a script blueprint that parses logs, extracts key signals, classifies severity, and outputs analyst-ready summaries.",
    tags: ["logs", "parsing", "automation", "observability"]
  }),
  createLibraryItem({
    slug: "scheduled-task-runbook",
    title: "Scheduled Task Operations Runbook",
    description: "Create a runbook for scheduled script jobs in enterprise endpoints.",
    category: "Automation & Scripting",
    prompt:
      "Build an operations runbook for scheduled automation jobs including credential handling, retries, monitoring, and failure escalation.",
    tags: ["scheduled-task", "operations", "automation", "runbook"]
  }),
  createLibraryItem({
    slug: "github-actions-failure-diagnosis",
    title: "GitHub Actions Failure Diagnosis",
    description: "Generate a CI troubleshooting checklist for failed workflows.",
    category: "Automation & Scripting",
    prompt:
      "Create a CI troubleshooting checklist for this failed GitHub Actions workflow. Include dependency, environment, secret, and build artifact diagnostics.",
    tags: ["github-actions", "ci-cd", "debugging", "devops"]
  }),
  createLibraryItem({
    slug: "wrangler-worker-deployment-checklist",
    title: "Wrangler Worker Deployment Checklist",
    description: "Design a safe deployment checklist for Cloudflare Workers.",
    category: "Automation & Scripting",
    prompt:
      "Write a Cloudflare Worker deployment checklist using Wrangler with environment variables, secret handling, rollback steps, and post-deploy validation.",
    tags: ["cloudflare", "wrangler", "workers", "deployment"]
  }),
  createLibraryItem({
    slug: "csv-to-dashboard-automation",
    title: "CSV to Dashboard Automation",
    description: "Create an automation flow to transform CSV exports into reporting dashboards.",
    category: "Automation & Scripting",
    prompt:
      "Design a pipeline that ingests CSV exports, validates schema, transforms data, and publishes dashboard-ready output on a schedule.",
    tags: ["csv", "reporting", "etl", "automation"]
  }),
  createLibraryItem({
    slug: "incident-ticket-priority-classifier-prompt",
    title: "Incident Ticket Priority Classifier",
    description: "Generate classification logic for IT incidents by impact and urgency.",
    category: "Automation & Scripting",
    prompt:
      "Create a classification framework that maps incident impact and urgency to priority (P1-P4) and recommends first-response actions.",
    tags: ["incident", "itil", "priority", "ticketing"]
  }),

  // Security & Identity (8)
  createLibraryItem({
    slug: "least-privilege-access-review",
    title: "Least-Privilege Access Review",
    description: "Generate an access-review checklist for privileged accounts and roles.",
    category: "Security & Identity",
    prompt:
      "Draft a least-privilege access review process with role inventory, high-risk permission checks, remediation process, and evidence tracking.",
    tags: ["least-privilege", "access-review", "security", "identity"]
  }),
  createLibraryItem({
    slug: "mfa-recovery-policy-draft",
    title: "MFA Recovery Policy Draft",
    description: "Create a policy draft for MFA device loss and account recovery.",
    category: "Security & Identity",
    prompt:
      "Write an MFA recovery policy with identity verification requirements, temporary access controls, abuse prevention, and audit logging requirements.",
    tags: ["mfa", "policy", "identity", "security"]
  }),
  createLibraryItem({
    slug: "phishing-incident-response-communication",
    title: "Phishing Incident Communications",
    description: "Generate internal and end-user communication drafts for phishing incidents.",
    category: "Security & Identity",
    prompt:
      "Create communication templates for a phishing incident: analyst update, leadership summary, and end-user advisory with required actions.",
    tags: ["phishing", "incident-response", "communications", "security"]
  }),
  createLibraryItem({
    slug: "ransomware-containment-checklist",
    title: "Ransomware Containment Checklist",
    description: "Build a containment-first checklist for ransomware response.",
    category: "Security & Identity",
    prompt:
      "Generate a ransomware containment checklist prioritizing isolation, evidence preservation, service continuity, and escalation to security leadership.",
    tags: ["ransomware", "containment", "security", "incident-response"]
  }),
  createLibraryItem({
    slug: "endpoint-hardening-gap-analysis",
    title: "Endpoint Hardening Gap Analysis",
    description: "Analyze endpoint hardening posture and remediation priorities.",
    category: "Security & Identity",
    prompt:
      "Produce a hardening gap analysis for Windows and macOS endpoints with critical controls, current-state assumptions, and prioritized remediation plan.",
    tags: ["endpoint-security", "hardening", "windows", "macos"]
  }),
  createLibraryItem({
    slug: "sso-mapping-validation-okta-entra",
    title: "SSO Mapping Validation (Okta/Entra)",
    description: "Validate SSO mappings, claims, and app-assignment behavior.",
    category: "Security & Identity",
    prompt:
      "Create a validation plan for Okta/Entra SSO mappings including claims, group assignment logic, access policy interactions, and troubleshooting steps.",
    tags: ["okta", "entra", "sso", "identity"]
  }),
  createLibraryItem({
    slug: "cloudflare-access-policy-design",
    title: "Cloudflare Access Policy Design",
    description: "Design app access policies with secure default controls.",
    category: "Security & Identity",
    prompt:
      "Design Cloudflare Access policies for this app: identity provider mapping, allow rules, deny rules, session settings, and operational rollback plan.",
    tags: ["cloudflare", "zero-trust", "access", "policy"]
  }),
  createLibraryItem({
    slug: "third-party-tool-security-review",
    title: "Third-Party Tool Security Review",
    description: "Create a security evaluation checklist for external SaaS tools.",
    category: "Security & Identity",
    prompt:
      "Build a security review checklist for evaluating a new SaaS tool, covering data handling, auth controls, auditability, compliance, and incident response obligations.",
    tags: ["vendor-risk", "security-review", "saas", "compliance"]
  }),

  // Content & Growth (6)
  createLibraryItem({
    slug: "error-message-article-writer",
    title: "Error Message Article Writer",
    description: "Create SEO-focused troubleshooting article drafts for exact error strings.",
    category: "Content & Growth",
    prompt:
      "Write a troubleshooting article targeting this exact error message. Lead with a 30-second fix, then include root causes, full remediation steps, and escalation guidance.",
    tags: ["seo", "content", "error-message", "troubleshooting"]
  }),
  createLibraryItem({
    slug: "pillar-page-outline-generator",
    title: "Pillar Page Outline Generator",
    description: "Generate content outlines for cluster pillar pages with internal links.",
    category: "Content & Growth",
    prompt:
      "Create a pillar page outline for this topic cluster with heading structure, section goals, internal link targets, and conversion CTA placements.",
    tags: ["pillar", "seo", "content-strategy", "internal-links"]
  }),
  createLibraryItem({
    slug: "comparison-article-framework",
    title: "Comparison Article Framework",
    description: "Draft high-intent comparison content for affiliate conversion.",
    category: "Content & Growth",
    prompt:
      "Build a neutral comparison framework for these tools including criteria matrix, scenario-based recommendations, and compliance/safety considerations.",
    tags: ["comparison", "affiliate", "buyer-guide", "seo"]
  }),
  createLibraryItem({
    slug: "affiliate-disclosure-compliance-check",
    title: "Affiliate Disclosure Compliance Check",
    description: "Audit article copy and placement for affiliate compliance clarity.",
    category: "Content & Growth",
    prompt:
      "Review this page for affiliate disclosure compliance. Suggest placement, wording, and link attributes to reduce legal and trust risk while preserving conversion.",
    tags: ["affiliate", "compliance", "disclosure", "policy"]
  }),
  createLibraryItem({
    slug: "email-newsletter-draft-it-audience",
    title: "IT Audience Newsletter Draft",
    description: "Generate a weekly newsletter edition for IT support audiences.",
    category: "Content & Growth",
    prompt:
      "Draft a concise weekly newsletter for IT admins with top fixes, one script/template spotlight, and one tool recommendation with clear CTA.",
    tags: ["newsletter", "email", "audience", "growth"]
  }),
  createLibraryItem({
    slug: "micro-saas-feature-spec",
    title: "Micro-SaaS Feature Spec",
    description: "Create feature specs for productizing site capabilities into SaaS.",
    category: "Content & Growth",
    prompt:
      "Create a feature spec for this micro-SaaS idea with target persona, user workflows, pricing hypothesis, MVP boundaries, and build milestones.",
    tags: ["micro-saas", "productization", "spec", "monetization"]
  })
];

export function getAiPromptLibraryItems(): AiPromptLibraryItem[] {
  return libraryItems.map((item) => ({
    ...item,
    tags: [...item.tags]
  }));
}

export function getAiPromptLibraryCategories(): string[] {
  return [...new Set(libraryItems.map((item) => item.category))].sort((a, b) => a.localeCompare(b));
}

interface BuildAiLibraryPromptInput {
  item: AiPromptLibraryItem;
  provider: AiPromptProvider;
  expertise: AiPromptExpertise;
}

export function buildAiLibraryPrompt({
  item,
  provider,
  expertise
}: BuildAiLibraryPromptInput): string {
  return [
    `You are my ${provider} assistant.`,
    `Task: ${item.title}`,
    `Category: ${item.category}`,
    "",
    `User expertise level: ${expertise}`,
    `Expertise guidance: ${expertiseGuidanceByLevel[expertise]}`,
    `Model guidance: ${providerGuidanceByModel[provider]}`,
    "",
    "Prompt:",
    item.prompt,
    "",
    "Output requirements:",
    "1. Provide a practical, implementation-ready response.",
    "2. Use clear sections and ordered steps.",
    "3. Call out assumptions and security/policy risks explicitly.",
    "4. End with a concise action plan."
  ].join("\n");
}
