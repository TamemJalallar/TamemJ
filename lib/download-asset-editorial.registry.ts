export interface DownloadAssetEditorialOverride {
  metadataDescription?: string;
  heroLead: string;
  highlights: string[];
  usageParagraphs: string[];
  citationUseCases?: string[];
  quickStartGuideSlugs?: string[];
}

export const downloadAssetEditorialOverrides: Record<string, DownloadAssetEditorialOverride> = {
  "canix-audit-trail-variance-sop": {
    metadataDescription:
      "Practical Canix SOP for tracing package edits, reviewing audit history, and documenting same-day variance investigations in New York cannabis operations.",
    heroLead:
      "This SOP is for the moment a package history stops making sense and the team needs a defensible record before anyone edits inventory again. It gives operations and compliance leads a shared sequence for freezing activity, collecting evidence, and documenting what changed in Canix and Metrc before the discrepancy grows.",
    highlights: [
      "Use it when a package count, status, or user attribution in Canix does not line up with the physical inventory or matching Metrc history.",
      "The document keeps the first review grounded in evidence capture, owner assignment, and same-day compliance signoff instead of ad hoc notes in chat or email.",
      "It works well as a standard operating attachment to variance meetings, incident reviews, and end-of-day reconciliation handoffs.",
      "Because the structure is editable, teams can add facility-specific approvers, package fields, and escalation contacts without rebuilding the template from scratch."
    ],
    usageParagraphs: [
      "Open the SOP before anyone changes the affected package again. The strongest use case is a same-day review where operations needs to confirm what happened, who touched the package, and whether the discrepancy can be corrected or has to stay on hold.",
      "Pair it with the reconciliation log and incident log below so the evidence, disposition, and manager follow-up all live in one consistent record set instead of being scattered across different tools."
    ],
    citationUseCases: [
      "Use this page when the claim is about the Canix variance SOP itself or the recommended evidence-capture workflow.",
      "Best for linking a facility runbook, audit-trail review packet, or same-day discrepancy workflow from a broader compliance guide."
    ],
    quickStartGuideSlugs: ["canix-new-york-quick-start"]
  },
  "metrc-recall-destruction-checklist": {
    metadataDescription:
      "Free Metrc checklist for New York recall, hold, and destruction readiness with package isolation and traceability checkpoints.",
    heroLead:
      "This checklist is meant for the tense part of the workflow, when product may need to be held, recalled, or destroyed and nobody wants to lose traceability while deciding. It gives teams a short, disciplined sequence so they can stabilize the package list, preserve custody, and confirm what still has to happen before product moves again.",
    highlights: [
      "Best when a package is under hold, tied to a recall review, or being considered for destruction but the underlying state still needs to be verified.",
      "The checklist keeps operators focused on package isolation, traceability, and approval ownership instead of rushing straight to a destruction action.",
      "It is especially useful for shared reviews between inventory, compliance, and management when multiple packages or downstream locations may be affected.",
      "Because it is short and printable, teams can use it in vaults, receiving areas, and shift handoffs without rewriting the workflow each time."
    ],
    usageParagraphs: [
      "Run through the checklist before a package is released, destroyed, or returned to normal movement. The point is to prove the team understands the package state and downstream impact before taking the irreversible step.",
      "If the event is wider than a single package, pair this with the compliance incident log so the same issue can be tracked across locations, manifests, or management approvals."
    ],
    citationUseCases: [
      "Use this page when you need to reference the checklist itself, its hold/release sequence, or the direct download.",
      "Helpful when supporting recall-readiness, destruction-prep, or package-isolation content for New York cannabis operations."
    ],
    quickStartGuideSlugs: ["metrc-new-york-quick-start"]
  },
  "wurk-shift-close-compliance-checklist": {
    metadataDescription:
      "Free Wurk shift-close checklist for cannabis retail and operations teams covering time approvals, missed punches, labor mapping, and payroll-readiness.",
    heroLead:
      "This checklist is built for the end of the shift, when payroll risk usually shows up as a pile of small unresolved items instead of one obvious failure. It helps managers clear the queue, record what remains open, and leave a cleaner handoff for payroll and the next day’s operators.",
    highlights: [
      "Use it when managers need a repeatable closeout routine for time approvals, missed punches, exception hours, and labor mapping checks.",
      "The format is intentionally simple so it can work as a paper checklist, a screen-side aid, or an attachment to a nightly close packet.",
      "It supports cannabis retail teams that need visible ownership for payroll-risk items without waiting until final payroll cutoff to sort them out.",
      "It also pairs naturally with the manager closeout record if the site wants both a checklist and a retained signoff document."
    ],
    usageParagraphs: [
      "Use the checklist at the end of each shift before unresolved punches and approval gaps roll forward into the next day. The fastest wins come from turning it into a standing manager habit rather than an emergency payroll tool.",
      "If a location needs to retain signoff history, pair it with the manager closeout record so the checklist stays operational while the record captures who approved what and when."
    ],
    citationUseCases: [
      "Use this page when citing the Wurk checklist itself, its manager closeout sequence, or the hosted PDF download.",
      "Best for shift-close, timekeeping, and payroll-readiness references inside cannabis operations content."
    ],
    quickStartGuideSlugs: ["wurk-cannabis-operations-quick-start"]
  },
  "ny-cannabis-manifest-exception-sop": {
    metadataDescription:
      "Editable SOP for New York cannabis manifest exceptions, transport incidents, and chain-of-custody disruption response.",
    heroLead:
      "Manifest problems are the kind of issue that get worse if the team keeps moving while trying to figure them out. This SOP gives staff a controlled path for stopping movement, capturing custody details, comparing the physical load to the manifest, and documenting the decision on whether the shipment holds, returns, or escalates.",
    highlights: [
      "Best when a manifest, package list, or delivery handoff no longer matches the physical shipment in front of the team.",
      "The SOP keeps chain-of-custody documentation together with the first incident response instead of leaving transport details scattered across calls and texts.",
      "It works for dispensary, transport, and receiving teams that need a shared decision tree when a route or receiving event goes off-plan.",
      "Because the file is editable, each facility can drop in its own dispatcher, compliance, and transport escalation contacts."
    ],
    usageParagraphs: [
      "Use the SOP the moment a delivery or transport exception is confirmed. That preserves the initial facts while they are still clear and prevents the team from improvising its own hold or reroute process.",
      "If the exception becomes part of a wider incident, log it in the compliance incident template as well so the event can be tracked across follow-up actions and management review."
    ],
    citationUseCases: [
      "Use this page when referencing the manifest-exception SOP or its direct download for transport and chain-of-custody workflows.",
      "Helpful for delivery incident, receiving exception, or movement-hold content grounded in New York cannabis operations."
    ],
    quickStartGuideSlugs: ["metrc-new-york-quick-start"]
  },
  "ny-cannabis-reconciliation-variance-log": {
    metadataDescription:
      "Editable New York cannabis reconciliation log for package mismatches, variance investigations, same-day disposition, and compliance signoff.",
    heroLead:
      "This log is the operating record teams reach for after the first discrepancy is found and before the details start getting fuzzy. It gives one place to document what was counted, what the systems showed, who reviewed it, what hold status applied, and how the variance was ultimately resolved.",
    highlights: [
      "Best for daily reconciliation work where package counts, statuses, or transfer outcomes need more than a verbal handoff.",
      "The template captures both the variance itself and the management decisions around hold, investigation, correction, and signoff.",
      "It is useful for facilities that want a repeatable same-day variance record without forcing staff into a larger incident report for every mismatch.",
      "Because it is editable, sites can add columns for room, batch, package UID ranges, or local approver names without changing the basic structure."
    ],
    usageParagraphs: [
      "Use the log during daily or end-of-day reconciliation reviews. The strongest workflow is to record the discrepancy as soon as it is found, then update the same row with hold status, root cause notes, and the final approved disposition.",
      "Pair it with the Canix audit-trail SOP when the team also needs a formal evidence-gathering sequence around the same discrepancy."
    ],
    citationUseCases: [
      "Use this page when the reference is about the reconciliation log itself, not just a general variance-handling concept.",
      "Best for linking daily reconciliation, same-day review, and compliance signoff workflows."
    ],
    quickStartGuideSlugs: ["canix-new-york-quick-start", "metrc-new-york-quick-start"]
  },
  "ny-cannabis-compliance-incident-log": {
    metadataDescription:
      "Free compliance incident log for New York cannabis facilities covering holds, manifest exceptions, recall events, destruction blockers, and traceability-impacting escalations.",
    heroLead:
      "Not every operational issue needs a full narrative report, but every meaningful compliance event does need a reliable record. This incident log gives teams a shared place to track what happened, which packages or locations were affected, who owns the follow-up, and whether the event changed custody, movement, or sale status.",
    highlights: [
      "Use it for incidents that touch traceability, movement, custody, package state, holds, recalls, or destruction readiness.",
      "The template is structured to help operations and compliance speak from the same record instead of maintaining separate notes for the same event.",
      "It works well for recurring management review because each row can show status, owner, and unresolved blockers at a glance.",
      "Facilities can adapt it for internal audits, end-of-day compliance review, or weekly variance and incident meetings."
    ],
    usageParagraphs: [
      "Open the incident log when an event crosses beyond a simple correction and now needs tracked ownership, retained notes, or visible follow-up. That usually includes manifest exceptions, package holds, recall reviews, and unresolved inventory mismatches.",
      "If the incident starts from a count mismatch, link it back to the reconciliation log so the variance details and the broader incident trail stay connected."
    ],
    citationUseCases: [
      "Use this page when referencing the incident log template, its fields, or its direct download.",
      "Best for internal compliance review, incident ownership, and traceability-event logging workflows."
    ],
    quickStartGuideSlugs: ["canix-new-york-quick-start", "metrc-new-york-quick-start"]
  },
  "wurk-manager-closeout-record": {
    metadataDescription:
      "Editable Wurk manager closeout record for cannabis retail and operations teams tracking approvals, missed punches, carried exceptions, and payroll-risk notes.",
    heroLead:
      "This record is for teams that need more than a quick checklist at the end of the shift. It gives managers a retained signoff document for what was reviewed, what remained open, who owns follow-up, and whether any timekeeping or labor issues could still affect payroll or reporting the next day.",
    highlights: [
      "Best when leadership wants a retained daily closeout record instead of relying only on the live Wurk queue or a verbal handoff.",
      "The document keeps missed punches, pending approvals, labor mapping issues, and carry-forward exceptions in one place with manager attestation.",
      "It works well for multi-location cannabis retail teams that need consistent end-of-day documentation across different store managers.",
      "Because it is editable, sites can add store identifiers, supervisor names, payroll cutoff flags, and next-day follow-up columns without redesigning the whole template."
    ],
    usageParagraphs: [
      "Use the record after the checklist is complete, not before. The checklist helps the manager do the work; the record proves what was reviewed, what stayed open, and where payroll risk still exists.",
      "For the cleanest process, keep one record per shift or per location and review the open items again before payroll close so none of the carried exceptions are lost."
    ],
    citationUseCases: [
      "Use this page when citing the manager closeout record template, its signoff fields, or its direct download.",
      "Helpful for Wurk operations content focused on manager attestation, shift handoff, and payroll-risk visibility."
    ],
    quickStartGuideSlugs: ["wurk-cannabis-operations-quick-start"]
  }
};

export function getDownloadAssetEditorialOverride(slug: string): DownloadAssetEditorialOverride | undefined {
  return downloadAssetEditorialOverrides[slug];
}
