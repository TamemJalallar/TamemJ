export const aiAgentEditorialIntros: Record<string, string> = {
  "front-end-developer-agent":
    "Most teams using a front-end agent want faster delivery without sacrificing maintainability. This prompt is tuned for real product work: component architecture, performance budgets, accessibility checks, and release-readiness criteria. Use it when you need clear implementation steps, practical tradeoffs, and code-review style quality gates instead of generic coding advice.",
  "react-specialist-agent":
    "React work often fails when teams skip state strategy, rendering discipline, and upgrade-safe patterns. This prompt focuses on production React decisions: component boundaries, data-fetching approaches, hydration concerns, and reliability under growth. Use it for migration planning, bug triage, and clean refactors where correctness and shipping speed both matter.",
  "node-js-backend-engineer-agent":
    "Node.js backends are easy to start and easy to overcomplicate. This prompt helps with API design, error handling patterns, observability, and operational hardening so services remain stable in production. It is especially useful when turning prototype endpoints into dependable backend workflows with clear contracts and safer deployment paths.",
  "devops-engineer-agent":
    "DevOps outcomes improve when guidance is concrete: pipeline structure, rollback paths, and measurable reliability targets. This prompt is designed for practical CI/CD and infrastructure operations, not abstract theory. Use it to build deployment standards, reduce change failure rates, and align automation decisions with uptime and incident-response goals.",
  "cloud-architect-agent":
    "Cloud architecture decisions directly impact cost, resilience, and security posture. This prompt is written to support real architecture reviews, including service selection, network boundaries, identity controls, and multi-environment deployment patterns. Use it when you need clear tradeoffs between speed, reliability, and governance at enterprise scale.",
  "cybersecurity-analyst-agent":
    "Security guidance must be precise, defensible, and policy-aware. This prompt focuses on practical risk analysis, detection and response workflows, and prioritization by business impact. Use it for incident triage, control-gap reviews, and remediation planning where teams need actionable steps that improve posture without bypassing security controls.",
  "systems-administrator-agent":
    "System administration work is judged by stability and recovery speed. This prompt emphasizes operational hygiene: baseline configuration, patch cadence, service monitoring, and escalation criteria. Use it to standardize daily operations, reduce recurring outages, and build admin runbooks that are clear enough for helpdesk and junior staff execution.",
  "network-architect-agent":
    "Network architecture issues usually come from unclear segmentation and inconsistent policy design. This prompt helps map topology decisions to security, performance, and resilience requirements. Use it for office, hybrid, or cloud network planning where you need explicit routing, fault-domain, and observability recommendations that can be implemented safely.",
  "data-scientist-agent":
    "Data science outputs are only valuable when they are reproducible and decision-ready. This prompt centers on problem framing, data quality checks, model choice rationale, and communication of uncertainty. Use it for analytics projects where business stakeholders need interpretable recommendations rather than just model metrics.",
  "ai-engineer-agent":
    "AI engineering needs more than prompt ideas; it requires evaluation, guardrails, and production integration discipline. This prompt supports model selection, retrieval patterns, latency-cost tradeoffs, and monitoring design. Use it when converting experiments into reliable AI features with clear quality thresholds and operational controls.",
  "prompt-engineer-agent":
    "Prompt engineering becomes effective when prompts are treated as testable assets. This prompt focuses on structure, constraints, failure handling, and iteration loops that improve output consistency. Use it to design reusable prompt systems for support, operations, and content workflows where predictability matters as much as creativity.",
  "seo-strategist-agent":
    "SEO strategy works when technical structure and content intent are aligned. This prompt is tuned for SERP-focused planning: cluster design, internal links, schema, and search intent coverage. Use it to prioritize pages by business value, reduce cannibalization, and create ranking momentum in competitive technical niches.",
  "paid-ads-specialist-agent":
    "Paid media performance improves when strategy, measurement, and funnel quality are connected. This prompt helps with campaign architecture, targeting logic, creative testing plans, and budget efficiency controls. Use it for acquisition programs where you need actionable optimizations rather than broad marketing advice.",
  "content-marketing-expert-agent":
    "Content marketing scales when each piece has clear intent, audience mapping, and conversion purpose. This prompt guides topic selection, editorial structure, and internal linking so content supports both traffic and revenue goals. Use it for consistent publishing workflows where technical authority and monetization need to grow together.",
  "product-manager-agent":
    "Product management is mostly prioritization under constraints. This prompt helps define outcomes, sequence roadmap bets, and align stakeholders with delivery realities. Use it when you need cleaner requirement quality, faster decision cycles, and stronger alignment between engineering capacity and business impact.",
  "financial-analyst-agent":
    "Financial analysis is useful only when assumptions and risk exposure are explicit. This prompt supports planning models, variance analysis, and scenario-driven recommendations with transparent logic. Use it for budgeting, forecasting, and investment prioritization where teams need defensible numbers and clear decision pathways.",
  "cfo-advisor-agent":
    "CFO-level guidance should connect finance operations to strategic growth and risk control. This prompt focuses on capital allocation, cash-flow resilience, and governance-minded financial decisions. Use it when leadership needs concise, board-ready analysis that balances growth ambition with operational discipline.",
  "cpa-accountant-agent":
    "Accounting support needs accuracy, auditability, and process clarity. This prompt is designed for reconciliations, close cycles, and compliance-ready documentation workflows. Use it when teams need standardized accounting procedures that reduce rework, improve controls, and keep reporting timelines predictable.",
  "contract-analyst-agent":
    "Contract analysis should surface obligations, risk points, and negotiation leverage quickly. This prompt supports clause review, term comparison, and issue summarization in a structured format. Use it for vendor, customer, or partner agreement workflows where legal and operational stakeholders need fast clarity.",
  "compliance-officer-agent":
    "Compliance execution is strongest when controls are mapped to evidence and ownership. This prompt helps define policy requirements, testing routines, and remediation tracking with clear accountability. Use it for audit prep, control assessments, and ongoing governance programs that require repeatable, verifiable process discipline."
};

export function getAiAgentEditorialIntro(slug: string): string | undefined {
  return aiAgentEditorialIntros[slug];
}

export function getAiAgentEditorialIntroCount(): number {
  return Object.keys(aiAgentEditorialIntros).length;
}
