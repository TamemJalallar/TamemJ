import type { CatalogItem } from "@/types/support";

const catalogItems: CatalogItem[] = [
  {
    slug: "request-software-install-adobe-figma-office-addin",
    title: "Request Software Install (Adobe / Figma / Office Add-in)",
    description:
      "Submit a request for approved software installation or add-ins on a managed device. Includes business justification and device details for packaging/desktop support review.",
    category: "Software",
    product: "Desktop Applications",
    expectedFulfillmentTime: "1-3 business days",
    approvalNote:
      "Manager approval and software entitlement validation may be required. Installation must use approved enterprise packaging and licensing.",
    tags: ["software", "install", "adobe", "figma", "office-addin"],
    workflowSummary: [
      "Request is reviewed for entitlement, device compatibility, and approval requirements.",
      "Desktop/endpoint team schedules or pushes installation using approved packaging.",
      "User is notified when install is complete or more information is required."
    ],
    requiredFields: [
      { id: "softwareName", label: "Software / Add-in Name", type: "text", required: true, placeholder: "e.g., Adobe Acrobat Pro, Figma Desktop, Outlook Add-in" },
      { id: "deviceAsset", label: "Device Asset Tag or Hostname", type: "text", required: true, placeholder: "e.g., LPT-12345" },
      { id: "businessJustification", label: "Business Justification", type: "textarea", required: true, placeholder: "Why this software is needed for your role" },
      { id: "neededBy", label: "Needed By Date", type: "text", required: false, placeholder: "YYYY-MM-DD (optional)" }
    ]
  },
  {
    slug: "request-shared-mailbox-access",
    title: "Request Shared Mailbox Access",
    description:
      "Request Full Access, Send As, or Send on Behalf permissions for a shared mailbox in Microsoft 365. Includes mailbox and approval details.",
    category: "Access Request",
    product: "Outlook",
    expectedFulfillmentTime: "1-2 business days",
    approvalNote:
      "Mailbox owner or manager approval is typically required. Access requests are granted using least privilege and may require compliance review for sensitive mailboxes.",
    tags: ["outlook", "shared-mailbox", "access", "m365"],
    workflowSummary: [
      "Identity/messaging team validates approvals and mailbox ownership.",
      "Permissions are applied in Exchange Online.",
      "User is asked to restart Outlook and verify access."
    ],
    requiredFields: [
      { id: "mailboxName", label: "Shared Mailbox Address", type: "text", required: true, placeholder: "sharedmailbox@company.com" },
      {
        id: "accessType",
        label: "Requested Access Type",
        type: "select",
        required: true,
        options: [
          { label: "Full Access", value: "Full Access" },
          { label: "Send As", value: "Send As" },
          { label: "Send on Behalf", value: "Send on Behalf" },
          { label: "Full Access + Send As", value: "Full Access + Send As" }
        ]
      },
      { id: "managerApproval", label: "Manager or Mailbox Owner Approval Reference", type: "text", required: true, placeholder: "Ticket ID, email approval, or approver name" },
      { id: "businessReason", label: "Business Reason", type: "textarea", required: true }
    ]
  },
  {
    slug: "request-distribution-list-or-m365-group",
    title: "Request Distribution List / Microsoft 365 Group",
    description:
      "Create or modify a distribution list or Microsoft 365 group for business communication and collaboration, with owner and naming information.",
    category: "Collaboration",
    product: "Microsoft 365 Groups",
    expectedFulfillmentTime: "2-4 business days",
    approvalNote:
      "Naming standards, ownership requirements, and lifecycle rules apply. Some requests may require collaboration governance approval.",
    tags: ["distribution-list", "m365-group", "outlook", "teams", "collaboration"],
    workflowSummary: [
      "Request is validated against naming, ownership, and lifecycle standards.",
      "Group/list is created or updated by messaging/collaboration admin.",
      "Owners receive confirmation and management guidance."
    ],
    requiredFields: [
      { id: "requestType", label: "Request Type", type: "select", required: true, options: [
        { label: "New Distribution List", value: "new-dl" },
        { label: "New Microsoft 365 Group", value: "new-m365-group" },
        { label: "Modify Existing", value: "modify-existing" }
      ] },
      { id: "groupName", label: "Requested Name", type: "text", required: true },
      { id: "owners", label: "Owner(s)", type: "text", required: true, placeholder: "Primary owner(s) email(s)" },
      { id: "members", label: "Initial Members (optional)", type: "textarea", required: false },
      { id: "businessUse", label: "Business Use", type: "textarea", required: true }
    ]
  },
  {
    slug: "request-onedrive-restore",
    title: "Request OneDrive Restore (Files / Version Recovery)",
    description:
      "Submit a request for OneDrive file restore, folder restore, or version recovery after deletion, overwrite, or ransomware-safe recovery workflow.",
    category: "Data Recovery",
    product: "OneDrive",
    expectedFulfillmentTime: "4-24 hours (depending on scope)",
    approvalNote:
      "Recovery requests may require data owner approval and timeline/details of the incident. Security review is required for suspected malware or ransomware events.",
    tags: ["onedrive", "restore", "recovery", "version-history", "data"],
    workflowSummary: [
      "Support confirms incident type (delete, overwrite, sync issue, ransomware suspicion).",
      "Recovery options are reviewed (version history, recycle bin, account restore).",
      "Changes are documented and user validates restored content."
    ],
    requiredFields: [
      { id: "affectedPath", label: "Affected File/Folder Path", type: "text", required: true },
      { id: "incidentTime", label: "Approximate Time of Issue", type: "text", required: true, placeholder: "YYYY-MM-DD HH:MM" },
      { id: "recoveryType", label: "Recovery Needed", type: "select", required: true, options: [
        { label: "Single File Restore", value: "file-restore" },
        { label: "Folder Restore", value: "folder-restore" },
        { label: "Version Recovery", value: "version-recovery" },
        { label: "Unsure - need assessment", value: "assessment" }
      ] },
      { id: "suspectedSecurityIncident", label: "Possible malware/ransomware involved", type: "checkbox", required: false }
    ]
  },
  {
    slug: "request-vpn-access",
    title: "Request VPN Access",
    description:
      "Request remote access/VPN entitlement for approved business use, including justification, manager approval, and device details.",
    category: "Access Request",
    product: "VPN",
    expectedFulfillmentTime: "1-2 business days",
    approvalNote:
      "VPN access is controlled by security policy. Manager approval and role validation are required. Additional MFA or device compliance steps may apply.",
    tags: ["vpn", "access", "remote-work", "security"],
    workflowSummary: [
      "Request is reviewed for role eligibility and manager approval.",
      "Security/network team provisions VPN profile/access policy.",
      "User receives connection instructions and MFA/device compliance guidance."
    ],
    requiredFields: [
      { id: "businessNeed", label: "Business Need", type: "textarea", required: true },
      { id: "systemsNeeded", label: "Systems/Resources Needed", type: "textarea", required: true, placeholder: "e.g., File shares, ERP, intranet" },
      { id: "managerApproval", label: "Manager Approval Reference", type: "text", required: true },
      { id: "deviceType", label: "Device Type", type: "select", required: true, options: [
        { label: "Corporate Windows Device", value: "corp-windows" },
        { label: "Corporate Mac", value: "corp-mac" },
        { label: "Other (requires review)", value: "other" }
      ] }
    ]
  },
  {
    slug: "request-device-replacement",
    title: "Request Device Replacement",
    description:
      "Request replacement of a failing or end-of-life laptop/device with justification, issue summary, and business impact details.",
    category: "Hardware",
    product: "End User Device",
    expectedFulfillmentTime: "3-7 business days",
    approvalNote:
      "Subject to asset lifecycle policy, stock availability, and manager approval. Data backup/migration readiness may be required before replacement.",
    tags: ["hardware", "laptop", "replacement", "device", "asset"],
    workflowSummary: [
      "Support validates issue severity, warranty/lifecycle status, and troubleshooting history.",
      "Replacement request is approved and device is allocated when available.",
      "User receives swap/migration guidance and scheduling."
    ],
    requiredFields: [
      { id: "assetTag", label: "Current Device Asset Tag", type: "text", required: true },
      { id: "issueSummary", label: "Issue Summary", type: "textarea", required: true },
      { id: "businessImpact", label: "Business Impact", type: "textarea", required: true },
      { id: "managerApproval", label: "Manager Approval Reference", type: "text", required: false }
    ]
  },
  {
    slug: "request-conference-room-av-support",
    title: "Request Conference Room AV Support",
    description:
      "Request on-site or scheduled support for conference room AV issues, meeting setup assistance, or recurring room equipment problems.",
    category: "AV / Facilities IT",
    product: "Conference Room AV",
    expectedFulfillmentTime: "Same day to next business day (severity dependent)",
    approvalNote:
      "Urgent live-meeting support may be prioritized. Planned events should be submitted in advance with room and meeting details.",
    tags: ["av", "conference-room", "meeting-room", "support"],
    workflowSummary: [
      "AV/helpdesk reviews room, device, and time details.",
      "Support is scheduled or dispatched based on urgency and availability.",
      "Ticket is updated with findings and any follow-up remediation needed."
    ],
    requiredFields: [
      { id: "roomName", label: "Room Name / Location", type: "text", required: true },
      { id: "meetingTime", label: "Meeting Time", type: "text", required: true },
      { id: "issueType", label: "Issue Type", type: "select", required: true, options: [
        { label: "Audio", value: "audio" },
        { label: "Video / Camera", value: "video" },
        { label: "Screen Share / Display", value: "display" },
        { label: "Room PC / Controller", value: "room-device" },
        { label: "Pre-event setup assistance", value: "setup" }
      ] },
      { id: "details", label: "Details", type: "textarea", required: true }
    ]
  },
  {
    slug: "request-mailbox-or-folder-permission-review",
    title: "Request Mailbox / Folder Permission Review",
    description:
      "Request a permissions review for a mailbox or folder where access appears incorrect but the exact change needed is not yet clear.",
    category: "Access Review",
    product: "Outlook / Exchange Online",
    expectedFulfillmentTime: "1-3 business days",
    approvalNote:
      "Mailbox owner approval may be required. Sensitive mailboxes may require compliance/security review before access changes.",
    tags: ["outlook", "exchange", "permissions", "review", "mailbox"],
    workflowSummary: [
      "Messaging support reviews current access and requested business outcome.",
      "Approvals are validated before any permission change recommendation.",
      "Ticket is updated with findings and next-step actions."
    ],
    requiredFields: [
      { id: "targetMailboxOrFolder", label: "Mailbox / Folder", type: "text", required: true },
      { id: "requestedOutcome", label: "Requested Outcome", type: "textarea", required: true, placeholder: "What should the user be able to do?" },
      { id: "affectedUsers", label: "Affected User(s)", type: "textarea", required: true },
      { id: "approver", label: "Approver / Data Owner", type: "text", required: false }
    ]
  }
];

export function getCatalogItems(): CatalogItem[] {
  return catalogItems.map((item) => ({
    ...item,
    tags: [...item.tags],
    workflowSummary: [...item.workflowSummary],
    requiredFields: item.requiredFields.map((field) => ({
      ...field,
      options: field.options ? field.options.map((option) => ({ ...option })) : undefined
    }))
  }));
}

export function getCatalogItemBySlug(slug: string): CatalogItem | undefined {
  return catalogItems.find((item) => item.slug === slug);
}

export function getCatalogCategories(): string[] {
  return [...new Set(catalogItems.map((item) => item.category))].sort((a, b) => a.localeCompare(b));
}

export function getCatalogTags(): string[] {
  return [...new Set(catalogItems.flatMap((item) => item.tags))].sort((a, b) => a.localeCompare(b));
}
