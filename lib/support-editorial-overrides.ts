export interface SupportEditorialOverride {
  editorialIntro: string;
  optimizedLeadParagraph: string;
}

export const supportEditorialOverrides: Record<string, SupportEditorialOverride> = {
  "outlook-sign-in-loop-mfa-prompts": {
    editorialIntro:
      "When Outlook keeps asking for a password or reopens the Microsoft sign-in prompt, the root cause is usually not the password itself. In managed environments, this pattern more often points to stale tokens, incomplete MFA registration, conditional access friction, or an account session that never finished refreshing cleanly.",
    optimizedLeadParagraph:
      "Use this guide when Outlook keeps prompting for credentials, MFA loops never settle, or desktop sign-in works only briefly before failing again. It walks through the safest checks first so you can separate account issues from local token and profile problems before escalating."
  },
  "teams-camera-not-detected": {
    editorialIntro:
      "A missing camera in Teams is one of those issues that feels random to the user but usually follows a short list of causes: privacy permissions, device handoff problems, dock or driver instability, or another app holding the camera open. The goal here is to confirm which layer is failing before anyone starts reinstalling Teams unnecessarily.",
    optimizedLeadParagraph:
      "Use this runbook when Teams cannot see the built-in webcam, an external camera disappears mid-meeting, or the camera works in one app but not in Teams. The steps stay enterprise-safe and help narrow the issue to permissions, hardware routing, or policy."
  },
  "vpn-connected-but-no-internet-or-internal-access": {
    editorialIntro:
      "VPN incidents are frustrating because the user often sees a reassuring \"connected\" status while everything they actually need is still broken. In practice, that usually means the tunnel came up but DNS, routing, split-tunnel behavior, or endpoint posture checks never lined up with the session.",
    optimizedLeadParagraph:
      "Follow this guide when the VPN shows connected but internal sites, shared drives, or even general internet traffic still fail. It helps you confirm whether the break is in DNS, routing, access policy, or the endpoint network stack before you reset the whole client."
  },
  "onedrive-processing-changes-or-stuck-syncing": {
    editorialIntro:
      "OneDrive getting stuck on \"Processing changes\" usually points to a sync queue problem rather than a total client failure. The useful next step is not guessing; it is checking whether the client is hung on a specific library, a known folder move dependency, a local file issue, or a stale sync session.",
    optimizedLeadParagraph:
      "Use this guide when OneDrive keeps spinning, never clears pending changes, or stops moving files between the desktop and Microsoft 365. It gives you a safe path to isolate file-level sync blockers before you jump to a reset."
  },
  "windows-printer-job-stuck-in-queue": {
    editorialIntro:
      "Print queues tend to fail in very visible ways: one document hangs, every job behind it stalls, and the user assumes the printer is dead. Most of the time the real problem is narrower, such as a jammed spooler, a stale job, or a workstation-specific queue issue that can be fixed without rebuilding the printer connection.",
    optimizedLeadParagraph:
      "Use this guide when Windows shows print jobs as stuck, deleting jobs does nothing, or a managed printer stays unavailable from one workstation. The sequence helps you clear the queue safely and decide when driver or print-server escalation is actually warranted."
  },
  "sharepoint-access-denied-site-library-file": {
    editorialIntro:
      "SharePoint access issues usually look simple from the outside: the user clicks a link and gets denied. The harder part is figuring out whether the block comes from inheritance, group membership delay, guest sharing boundaries, or a link that points to a location the user was never granted access to in the first place.",
    optimizedLeadParagraph:
      "Use this runbook when a user gets access denied in SharePoint, cannot open a library or file, or loses access after a permissions change. It keeps the investigation focused on identity, membership, and sharing scope before anyone starts granting broad access as a shortcut."
  },
  "intune-windows-device-not-checking-in-or-compliance-stale": {
    editorialIntro:
      "A stale Intune device record usually means the endpoint and the service stopped agreeing about the device state, not that the device vanished entirely. The safest approach is to confirm connectivity, Company Portal health, enrollment state, and policy refresh behavior before taking any action that could trigger a needless reenrollment.",
    optimizedLeadParagraph:
      "Use this guide when a Windows device stops checking in to Intune, stays noncompliant after the user is back online, or shows outdated policy status in the admin center. It helps you separate transient sync delay from a deeper enrollment or compliance problem."
  },
  "intune-autopilot-enrollment-fails-during-oobe": {
    editorialIntro:
      "Autopilot failures during OOBE create a lot of pressure because they block the user before the device is even in service. That makes it especially important to work methodically: confirm profile assignment, licensing, network reachability, and identity prerequisites before you restart the setup flow or wipe the machine again.",
    optimizedLeadParagraph:
      "Use this runbook when Windows Autopilot stalls, fails to complete enrollment, or throws setup errors during the out-of-box experience. The steps focus on proving whether the blocker is with profile assignment, licensing, connectivity, or device identity."
  },
  "okta-verify-push-not-received-or-delayed": {
    editorialIntro:
      "A delayed or missing Okta Verify push usually feels like an MFA outage to the user, but the cause is often more specific: notification permissions, device network conditions, mobile battery restrictions, or token state on the enrolled device. The right fix depends on knowing which of those layers is actually failing.",
    optimizedLeadParagraph:
      "Use this guide when Okta Verify pushes do not arrive, arrive late, or approve on the phone without completing sign-in on the desktop. It gives you a safe workflow to check device readiness, delivery conditions, and enrollment health before you reset MFA."
  },
  "entra-conditional-access-policy-blocking-legitimate-user": {
    editorialIntro:
      "Conditional Access is supposed to be strict, but from the user side it often looks arbitrary when a trusted person is suddenly blocked. The fastest way to make progress is to identify exactly which signal caused the policy decision: device compliance, location, MFA requirement, app scope, or session risk.",
    optimizedLeadParagraph:
      "Use this guide when Entra Conditional Access blocks a legitimate sign-in and the user needs a clear remediation path. It helps you confirm the failing policy condition first, then choose the least disruptive enterprise-safe fix."
  },
  "ny-cannabis-inventory-reconciliation-variance-requires-same-day-review": {
    editorialIntro:
      "In New York cannabis operations, inventory variances get more serious the longer they sit. What starts as a small package mismatch can quickly affect holds, transfers, destruction decisions, or management trust in the day’s numbers if nobody captures the first facts while they are still clear.",
    optimizedLeadParagraph:
      "Use this guide when a package count, package state, or system record does not match the physical inventory and the team needs a same-day reconciliation path. It helps operations document the discrepancy, pause the right activity, and route the decision through compliance before anyone forces a correction."
  },
  "ny-cannabis-package-hold-or-release-needs-compliance-signoff": {
    editorialIntro:
      "Package holds are where operations urgency and compliance caution collide. Teams usually know they need a decision quickly, but the real risk comes from releasing inventory before the reason for the hold, the package state, and the approving owner are fully understood and documented.",
    optimizedLeadParagraph:
      "Use this guide when a New York cannabis package is on hold and the team needs a defensible release or continue-hold decision. It helps confirm why the package is blocked, what supporting evidence is still missing, and when compliance signoff must happen before movement resumes."
  },
  "canix-lab-result-or-coa-is-not-linked-to-the-final-package": {
    editorialIntro:
      "Lab-result problems are easy to underestimate because the paperwork may exist somewhere, just not where operators need it. The practical issue is whether the final package can be shown, transferred, or sold with a clean and traceable connection between the COA, the package, and the system state the team is relying on.",
    optimizedLeadParagraph:
      "Use this guide when a COA exists but the final Canix package does not clearly show the linked lab result, testing evidence, or expected package status. It helps the team verify whether the issue is mapping, package lineage, or a deeper workflow gap before product moves again."
  },
  "ny-cannabis-delivery-manifest-exception-or-transport-incident": {
    editorialIntro:
      "Manifest exceptions are one of those moments where continuing to move product while the team 'figures it out' usually makes the recordkeeping problem worse. The safest move is to stabilize custody, compare the physical load to the manifest, and document who is approving the next step before the route changes again.",
    optimizedLeadParagraph:
      "Use this guide when a New York cannabis delivery or transport event no longer matches the manifest, route plan, or receiving expectation. It helps the team preserve chain of custody, capture the incident facts early, and decide whether the shipment holds, returns, or escalates."
  },
  "canix-audit-trail-does-not-clearly-show-who-made-the-inventory-change": {
    editorialIntro:
      "When an inventory change cannot be confidently tied back to the right person or integration account, the issue is bigger than a bad note in the audit trail. It affects how much the team can trust the correction history, whether access controls are working, and how quickly a variance can be resolved without creating a second problem.",
    optimizedLeadParagraph:
      "Use this guide when Canix history does not clearly show who performed a package edit, receive, transfer, or adjustment. It helps operations and compliance trace the last trustworthy state, confirm whether attribution is wrong or incomplete, and decide when access-control escalation is required."
  },
  "ny-cannabis-recall-or-market-withdrawal-requires-package-isolation": {
    editorialIntro:
      "Recall and market-withdrawal work gets messy when the product list changes faster than the incident notes. The first operational win is not writing the perfect report; it is isolating the right packages, freezing movement, and keeping one clean list of what is affected before anything else happens downstream.",
    optimizedLeadParagraph:
      "Use this guide when a recall, market withdrawal, or internal hold requires New York cannabis packages to be isolated immediately. It helps the team lock down the package list, preserve traceability, and confirm who owns the disposition decision before product is released, returned, or destroyed."
  },
  "ny-cannabis-destruction-workflow-cannot-proceed-until-package-state-is-reconciled": {
    editorialIntro:
      "Destruction workflows feel administrative until the package state is wrong, at which point they become a traceability risk. If counts, holds, recall status, or package lineage are still unclear, destruction is the wrong next step because it removes the product before the underlying discrepancy is settled.",
    optimizedLeadParagraph:
      "Use this guide when a destruction action is being considered but the package state, quantity, or upstream hold history is still unresolved. It helps the team prove the inventory is reconciled first, then document why destruction is allowed and who approved it."
  },
  "wurk-shift-close-attestation-or-manager-review-is-incomplete": {
    editorialIntro:
      "Shift-close issues in Wurk rarely fail in one dramatic way. More often, a few missed approvals, unresolved punches, and labor mapping problems quietly roll into the next day until payroll or management reporting starts breaking under the weight of those small misses.",
    optimizedLeadParagraph:
      "Use this guide when a manager closeout, shift attestation, or Wurk review step was not fully completed before the next day begins. It helps teams confirm what is still open, which items create payroll risk, and how to leave a cleaner documented handoff for the next review."
  }
};

export function getSupportEditorialOverride(slug: string): SupportEditorialOverride | undefined {
  return supportEditorialOverrides[slug];
}
