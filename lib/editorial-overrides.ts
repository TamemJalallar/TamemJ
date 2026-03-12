export interface EditorialOverride {
  primaryKeyword?: string;
  editorialIntro: string;
  optimizedLeadParagraph: string;
}

const kbEditorialOverrides: Record<string, EditorialOverride> = {
  "outlook-search-not-working-windows-macos": {
    primaryKeyword: "outlook search not working",
    editorialIntro:
      "Outlook search failures usually get reported as a vague productivity issue, but in enterprise environments the root cause is often specific: stale indexing, OST corruption, profile drift, or a policy-controlled search component falling out of sync. This page is written for support teams that need to restore search without jumping straight to destructive profile rebuilds.",
    optimizedLeadParagraph:
      "Use this Outlook search troubleshooting guide to verify indexing health, separate local profile issues from mailbox-side problems, and apply the lowest-risk remediation path first on Windows or macOS before escalating to Microsoft 365 or endpoint engineering."
  },
  "teams-microphone-not-detected-enterprise": {
    primaryKeyword: "teams microphone not detected",
    editorialIntro:
      "When Teams stops seeing a microphone, the fastest fix is rarely reinstalling the app. In managed environments, audio failures usually sit at one of three layers: endpoint permissions, device routing after docking or Bluetooth changes, or policy and driver interactions. This runbook is aimed at isolating the failing layer quickly so support can avoid random trial-and-error.",
    optimizedLeadParagraph:
      "Follow this Microsoft Teams microphone troubleshooting guide to confirm hardware state, validate Windows or macOS privacy controls, test device selection inside Teams, and determine when the issue should move to endpoint support instead of staying in the service desk queue."
  },
  "teams-camera-not-detected": {
    primaryKeyword: "teams camera not working",
    editorialIntro:
      "Teams camera incidents often present like a simple hardware problem, but enterprise support usually has to account for privacy permissions, conferencing-room peripherals, USB controller instability, and recent OS or driver changes. This guide is structured to restore video safely while preserving security and privacy controls.",
    optimizedLeadParagraph:
      "Use this Teams camera troubleshooting workflow to confirm camera permissions, rule out device-path problems, validate Teams settings, and identify when the incident belongs with endpoint engineering or AV support rather than general helpdesk triage."
  },
  "teams-stuck-on-loading-or-signing-in": {
    primaryKeyword: "conditional access blocking sign in",
    editorialIntro:
      "A Teams sign-in loop is rarely just a 'clear cache and try again' problem in a corporate tenant. Authentication tokens, device compliance, Conditional Access, and workstation identity state can all produce the same user-facing symptom. This page is designed to help support teams separate local cache noise from true identity-control failures.",
    optimizedLeadParagraph:
      "Work through this Teams loading and sign-in runbook to test token refresh, confirm compliance state, identify Conditional Access or modern-authentication blockers, and gather the right evidence before escalating to Entra ID or security administrators."
  },
  "onedrive-processing-changes-or-stuck-syncing": {
    primaryKeyword: "onedrive processing changes",
    editorialIntro:
      "OneDrive 'processing changes' issues can drag on for days if support does not narrow the failure to a specific sync scope. In most enterprise cases the client is stuck on a problematic file, a path-length conflict, a SharePoint library mismatch, or a tenant policy blocking upload behavior. This guide is built to keep the fix safe and auditable.",
    optimizedLeadParagraph:
      "Use this OneDrive stuck-sync troubleshooting guide to verify the affected library, isolate problematic files, apply a safe client reset only when appropriate, and recognize when SharePoint, retention, or DLP policy needs Microsoft 365 admin review."
  },
  "onedrive-files-on-demand-not-working": {
    primaryKeyword: "onedrive files on demand not working",
    editorialIntro:
      "Files On-Demand problems are high-friction because users experience them as missing content, yet the actual cause can be policy enforcement, disk-state issues, or a client that never received the right hydration signals. The goal here is to confirm what the device should be doing before changing sync settings or rehydrating large libraries unnecessarily.",
    optimizedLeadParagraph:
      "Use this Files On-Demand support guide to confirm policy state, verify local disk and sync health, restore expected online-only behavior, and avoid unnecessary full downloads on managed devices with storage or compliance requirements."
  },
  "sharepoint-access-denied-site-library-file": {
    primaryKeyword: "sharepoint access denied",
    editorialIntro:
      "SharePoint access-denied incidents are often permissions incidents masquerading as sync or browser problems. The right support move is to identify whether the break is at the site, library, item, guest-access, or token layer before anyone changes inheritance or grants broad access in production. This article is written to support that safer workflow.",
    optimizedLeadParagraph:
      "Use this SharePoint access troubleshooting guide to confirm the affected scope, test the user’s effective permissions, identify inheritance or sharing issues, and collect the right evidence before site owners or Microsoft 365 admins make permission changes."
  },
  "sharepoint-library-not-syncing-onedrive-client": {
    primaryKeyword: "sharepoint library not syncing",
    editorialIntro:
      "A SharePoint library that refuses to sync is usually a boundary problem between SharePoint Online and the local OneDrive client, not a generic network failure. Libraries with permission changes, unsupported names, path depth issues, or stale local relationships tend to break first. This guide helps support teams isolate the boundary cleanly.",
    optimizedLeadParagraph:
      "Use this SharePoint library sync runbook to confirm library eligibility, inspect local OneDrive state, identify naming or permission blockers, and decide when to re-establish the sync relationship versus when to escalate to SharePoint administration."
  },
  "intune-windows-device-not-checking-in-or-compliance-stale": {
    primaryKeyword: "intune device not compliant",
    editorialIntro:
      "A stale Intune check-in is a management signal problem first and a user issue second. Devices can look healthy to the employee while being effectively invisible to policy, compliance, and remediation workflows. This page is meant to help support teams prove whether the break is enrollment, identity, MDM channel, or network path before they attempt re-enrollment.",
    optimizedLeadParagraph:
      "Use this Intune Windows check-in runbook to verify management channel health, confirm device registration and enrollment state, test connectivity to Microsoft endpoints, and decide when a repair action is justified instead of masking the issue with a local reboot."
  },
  "entra-hybrid-join-state-invalid-dsregcmd-errors": {
    primaryKeyword: "hybrid join failed error 0x801c03f2",
    editorialIntro:
      "Hybrid join failures are easy to misdiagnose because the visible error is often just the last failing step in a longer registration sequence. DNS, SCP discovery, device objects, and token acquisition can all break hybrid join while producing similar symptoms. This guide is geared toward support teams that need to gather evidence before resetting device identity.",
    optimizedLeadParagraph:
      "Follow this Entra hybrid join troubleshooting guide to validate dsregcmd output, confirm device object state, test line-of-sight to registration services, and determine when the incident belongs with identity engineering rather than desktop support."
  },
  "vpn-connected-but-no-internet-or-internal-access": {
    primaryKeyword: "vpn connected but no internet",
    editorialIntro:
      "A VPN session that shows as connected but passes no useful traffic is one of the most common remote-work incidents because the failure can sit in routing, DNS, split-tunnel policy, local firewall state, or endpoint security posture. This article is designed to help support teams prove which path is broken instead of treating every case like a client reinstall.",
    optimizedLeadParagraph:
      "Use this VPN troubleshooting guide to validate tunnel establishment, inspect DNS and route behavior, confirm whether internal resources or internet traffic are impacted, and gather escalation evidence for the network or security team without weakening remote-access controls."
  },
  "windows-bitlocker-recovery-prompt-managed-device": {
    primaryKeyword: "bitlocker recovery key not found",
    editorialIntro:
      "A managed Windows device unexpectedly asking for a BitLocker recovery key is a high-risk support event because the wrong response can lead to data-loss decisions, identity confusion, or improper recovery-key handling. This guide prioritizes verification, recovery-source validation, and escalation boundaries before any destructive action is taken.",
    optimizedLeadParagraph:
      "Use this BitLocker recovery runbook to confirm why the prompt appeared, locate the approved recovery source, validate device identity, and escalate correctly if the key is not escrowed instead of improvising unsupported bypass steps."
  },
  "mfa-device-lost-account-recovery-enterprise": {
    primaryKeyword: "mfa device lost account recovery",
    editorialIntro:
      "Lost-device MFA incidents are not just account-lockout requests. They are identity-verification events with fraud risk, especially when the user is remote, traveling, or requesting a same-day reset from an untrusted network. This guide is written to help support teams restore access while keeping the recovery flow inside enterprise policy.",
    optimizedLeadParagraph:
      "Use this MFA recovery guide to verify user identity through approved methods, document the reason for reset, remove or replace the old factor safely, and escalate to IT security whenever the request carries fraud or takeover indicators."
  },
  "outlook-shared-mailbox-missing-or-not-updating": {
    primaryKeyword: "shared mailbox missing outlook",
    editorialIntro:
      "Shared mailbox incidents tend to waste time when support assumes the mailbox has disappeared from Exchange. In practice, the gap is often automapping behavior, cached-mode lag, permission propagation, or a profile that never refreshed its mailbox list correctly. This page is meant to resolve that distinction quickly.",
    optimizedLeadParagraph:
      "Use this shared mailbox troubleshooting guide to confirm access rights, check automapping and cached-mode state, determine whether the issue is client-only or service-side, and escalate only when Exchange permissions or directory propagation are actually at fault."
  }
};

const downloadAssetEditorialOverrides: Record<string, EditorialOverride> = {
  "entra-app-audit-script": {
    primaryKeyword: "entra app registration audit script",
    editorialIntro:
      "App registration sprawl becomes a security problem long before most teams notice it. This script is useful because it turns Entra application inventory, permissions, and secret hygiene into something an admin can actually review on a schedule instead of during an incident.",
    optimizedLeadParagraph:
      "Download this Entra app audit script to export app registrations, review expiring secrets and certificates, and build a repeatable governance workflow for enterprise identity teams."
  },
  "incident-response-checklist": {
    primaryKeyword: "incident response checklist pdf",
    editorialIntro:
      "An incident checklist only earns its place if it reduces hesitation when an alert becomes real. This version is structured around the operational sequence support and security teams actually need: confirm the event, contain impact, preserve evidence, recover service, and close with follow-up actions that are easy to miss under pressure.",
    optimizedLeadParagraph:
      "Use this incident response checklist to standardize detection, containment, eradication, recovery, and post-incident review steps across helpdesk, security, and IT operations teams."
  },
  "it-asset-inventory-template": {
    primaryKeyword: "it asset inventory template",
    editorialIntro:
      "An asset inventory template matters because most support teams still lose time on basic ownership questions during audits, refresh planning, and incident triage. This worksheet is designed to make devices, licenses, and assignment data usable operationally instead of just collecting static fields for the sake of compliance.",
    optimizedLeadParagraph:
      "Download this IT asset inventory template to track hardware, software, warranty, lifecycle, and assigned-user data in one place for support, compliance, and refresh planning."
  },
  "m365-license-tracker": {
    primaryKeyword: "microsoft 365 license tracker",
    editorialIntro:
      "Microsoft 365 licensing turns messy fast when support, finance, and identity teams all need different views of the same tenant. This tracker is built to make assignment status, SKU usage, and renewal exposure visible enough to support both operations and cost reviews without pulling new reports every time.",
    optimizedLeadParagraph:
      "Use this Microsoft 365 license tracker to monitor SKU assignment, reclaim unused seats, track renewals, and improve license visibility across Entra ID and admin operations."
  },
  "it-onboarding-checklist": {
    primaryKeyword: "new hire it onboarding checklist",
    editorialIntro:
      "Onboarding failures usually show up as day-one access issues, but the real weakness is almost always process coverage. This checklist gives support teams a repeatable sequence for provisioning accounts, hardware, MFA, and baseline software so new starters do not become emergency tickets on their first morning.",
    optimizedLeadParagraph:
      "Download this IT onboarding checklist to standardize device setup, account creation, security enrollment, and first-week validation steps for new hire readiness."
  },
  "ad-user-audit-script": {
    primaryKeyword: "ad user audit script",
    editorialIntro:
      "User audits are often treated as one-off reporting exercises, but they are most valuable when they become part of routine access review, stale-account cleanup, and incident preparation. This script is aimed at administrators who need a safe, export-first way to capture user state and recent activity from Active Directory.",
    optimizedLeadParagraph:
      "Use this Active Directory user audit script to export account status, last logon details, and group membership data for access reviews, cleanup projects, and security investigations."
  },
  "m365-bulk-license-script": {
    primaryKeyword: "bulk m365 license assignment powershell",
    editorialIntro:
      "Bulk license changes are one of the easiest ways to create avoidable user impact if they are handled manually or without clear validation. This script supports a safer pattern: structured input, repeatable actions, and visible execution flow so admins can make large changes with less guesswork.",
    optimizedLeadParagraph:
      "Download this bulk Microsoft 365 licensing script to assign or remove SKUs through Microsoft Graph with a repeatable PowerShell workflow suited for tenant administration."
  },
  "mailbox-permission-audit": {
    primaryKeyword: "exchange online mailbox permission audit",
    editorialIntro:
      "Mailbox permission visibility matters because access sprawl in Exchange Online is hard to spot until an audit, executive request, or security incident forces a review. This script helps teams move from reactive mailbox checks to a consistent export they can compare, document, and clean up over time.",
    optimizedLeadParagraph:
      "Use this mailbox permission audit script to export Full Access, Send As, and Send on Behalf permissions from Exchange Online for governance, cleanup, and access-review workflows."
  },
  "sharepoint-migration-checklist": {
    primaryKeyword: "sharepoint migration checklist",
    editorialIntro:
      "SharePoint migrations usually fail in the planning phase, not on cutover day. Missing permission mapping, weak cleanup, and unclear validation criteria create the biggest post-migration surprises. This checklist is structured to keep project teams focused on the preparation tasks that reduce that risk.",
    optimizedLeadParagraph:
      "Download this SharePoint migration checklist to plan discovery, clean up content, map permissions, validate pilot waves, and confirm post-cutover readiness in a structured sequence."
  },
  "windows-hardening-checklist": {
    primaryKeyword: "windows hardening checklist",
    editorialIntro:
      "Hardening work stalls when teams try to jump from a baseline gap directly to full enforcement. This checklist is meant to support staged rollout: verify the current state, prioritize the most meaningful controls, and document implementation in a way that operational teams can support after the change window closes.",
    optimizedLeadParagraph:
      "Use this Windows hardening checklist to review baseline security settings, identity protections, logging, and endpoint controls before rolling changes into production support standards."
  }
};

export function getKBEditorialOverrideBySlug(slug: string): EditorialOverride | undefined {
  return kbEditorialOverrides[slug];
}

export function getDownloadAssetEditorialOverrideBySlug(slug: string): EditorialOverride | undefined {
  return downloadAssetEditorialOverrides[slug];
}
