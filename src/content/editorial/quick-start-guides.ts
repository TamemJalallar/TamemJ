export interface QuickStartSource {
  label: string;
  href: string;
}

export interface QuickStartSection {
  title: string;
  description: string;
  bullets: string[];
}

export interface QuickStartGuide {
  slug: string;
  title: string;
  summary: string;
  product: string;
  audience: string;
  estimatedTime: string;
  tags: string[];
  caution: string;
  lastReviewed: string;
  officialSources: QuickStartSource[];
  relatedAssetSlugs: string[];
  relatedTicketSlugs: string[];
  sections: QuickStartSection[];
}

const quickStartGuides: QuickStartGuide[] = [
  {
    slug: "canix-new-york-quick-start",
    title: "Canix New York Quick Start",
    summary:
      "Basic setup guide for New York operators using Canix with Metrc. Covers facility setup, package workflows, manifests, finished goods, and the first compliance checks to complete before daily operations.",
    product: "Canix",
    audience: "Inventory leads, operations managers, and compliance coordinators",
    estimatedTime: "20-35 min",
    tags: ["canix", "new york", "metrc", "inventory", "dispensary", "processor"],
    caution:
      "This guide is operational setup guidance, not legal advice. When package state, testing state, manifests, or traceability do not line up, pause movement and confirm the next step with your compliance lead.",
    lastReviewed: "May 11, 2026",
    officialSources: [
      {
        label: "Canix New York Metrc Transition Guide",
        href: "https://help.canix.com/hc/en-us/articles/42230009976980-New-York-Metrc-Transition-Guide"
      },
      {
        label: "Canix Package Availability Status",
        href: "https://help.canix.com/hc/en-us/articles/9304488143124-Package-Availability-Status"
      },
      {
        label: "Canix Print Metrc Transfer Manifest",
        href: "https://help.canix.com/hc/en-us/articles/5946681274388-Print-Metrc-Transfer-Manifest"
      }
    ],
    relatedAssetSlugs: [
      "canix-audit-trail-variance-sop",
      "ny-cannabis-reconciliation-variance-log",
      "ny-cannabis-compliance-incident-log"
    ],
    relatedTicketSlugs: [
      "canix-metrc-data-sync-not-reflecting-recent-changes",
      "canix-package-status-stuck-unverified-needs-review-or-transfer-pending",
      "canix-finished-good-toggle-or-retail-item-id-missing-in-new-york",
      "canix-package-tag-prefix-is-wrong-for-new-york-license",
      "canix-transfer-created-but-manifest-or-acceptance-still-needs-metrc",
      "canix-actions-show-the-wrong-metrc-user-or-api-key-owner",
      "canix-lab-result-or-coa-is-not-linked-to-the-final-package",
      "canix-audit-trail-does-not-clearly-show-who-made-the-inventory-change"
    ],
    sections: [
      {
        title: "1. Confirm the operating context before setup",
        description:
          "Make sure the facility is working in the right New York license context before anyone starts building packages or transfers.",
        bullets: [
          "Confirm the exact facility, license, and operational role using Canix.",
          "Decide who owns Canix administration, Metrc administration, and day-to-day inventory operations.",
          "Make sure the team understands which actions still need to finish in Metrc even when the workflow starts in Canix.",
          "Document who approves package corrections, transfer holds, and compliance escalations."
        ]
      },
      {
        title: "2. Verify package and inventory foundations",
        description:
          "Package data issues get expensive quickly. Start with the inventory basics before daily use.",
        bullets: [
          "Confirm the correct package tag prefix is loaded for the facility before creating new packages.",
          "Review whether the packages you are building should stay bulk/intermediate or be marked as finished goods.",
          "If finished goods are being prepared for retail workflows, confirm the correct Retail Item IDs are available.",
          "Teach users what Unverified, Needs Review, Transfer Pending, and Transfer Accepted mean so they do not force inventory actions on the wrong state."
        ]
      },
      {
        title: "3. Set up transfer and manifest habits early",
        description:
          "Teams should learn the transfer handoff between Canix and Metrc before the first live shipment.",
        bullets: [
          "Build the transfer in Canix accurately, then register and print the manifest in Metrc before product leaves.",
          "Keep a standard checklist for sender, receiver, transfer ID, manifest status, and receive status.",
          "Train receivers to confirm the transfer state in Metrc before assuming inventory is editable in Canix.",
          "Store the final manifest copy with the shipment record and internal operations log."
        ]
      },
      {
        title: "4. Build a simple daily review routine",
        description:
          "A short daily review prevents most sync and package-state confusion from turning into bigger compliance problems.",
        bullets: [
          "Review recent package creations, edits, transfers, and receives at the beginning and end of the day.",
          "Compare any high-risk package or transfer in both Canix and Metrc before taking corrective action.",
          "Treat stale sync, wrong attribution, and status mismatches as same-day follow-up items.",
          "Pause sell, relabel, or transfer activity on any package whose state is unclear."
        ]
      }
    ]
  },
  {
    slug: "metrc-new-york-quick-start",
    title: "Metrc New York Quick Start",
    summary:
      "Basic setup guide for New York Metrc operations. Covers user access, beginning inventory awareness, finished goods, testing status, transfer readiness, and the minimum records teams should keep from day one.",
    product: "Metrc",
    audience: "Facility admins, compliance staff, inventory managers, and receiving teams",
    estimatedTime: "25-40 min",
    tags: ["metrc", "new york", "inventory", "retail item id", "testing", "transfers"],
    caution:
      "Do not use this guide to bypass or reinterpret state requirements. If package ownership, testing status, transfer state, or beginning inventory handling is uncertain, stop and route the decision through your compliance lead.",
    lastReviewed: "May 11, 2026",
    officialSources: [
      {
        label: "New York OCM Guidance for Adult-Use Retail Dispensaries",
        href: "https://cannabis.ny.gov/guidance-adult-use-retail-dispensaries-0"
      },
      {
        label: "New York OCM Metrc NYS Implementation Plan",
        href: "https://cannabis.ny.gov/metrc-nys-implementation-plan"
      },
      {
        label: "Metrc New York FAQ",
        href: "https://www.metrc.com/faq/new-york-faq/"
      }
    ],
    relatedAssetSlugs: [
      "metrc-recall-destruction-checklist",
      "ny-cannabis-manifest-exception-sop",
      "ny-cannabis-compliance-incident-log"
    ],
    relatedTicketSlugs: [
      "metrc-user-onboarding-or-credentialing-is-blocked",
      "metrc-dispensary-receive-workflow-is-held-during-beginning-inventory",
      "metrc-finished-goods-cannot-transfer-because-retail-item-ids-are-missing",
      "metrc-package-cannot-transfer-to-dispensary-without-testpassed-status",
      "ny-cannabis-inventory-reconciliation-variance-requires-same-day-review",
      "ny-cannabis-package-hold-or-release-needs-compliance-signoff",
      "ny-cannabis-delivery-manifest-exception-or-transport-incident",
      "ny-cannabis-recall-or-market-withdrawal-requires-package-isolation",
      "ny-cannabis-destruction-workflow-cannot-proceed-until-package-state-is-reconciled"
    ],
    sections: [
      {
        title: "1. Start with user access and role clarity",
        description:
          "Before operators transact in Metrc, the facility needs a clean user and permission model.",
        bullets: [
          "Identify who will administer employees, who will handle inventory, and who will approve transfer or compliance decisions.",
          "Confirm each user is onboarded with the correct email, facility, and permission scope.",
          "Reissue onboarding or credentialing steps immediately when the welcome flow stalls instead of letting teams share credentials.",
          "Record who is responsible for access reviews when staff move roles or leave the company."
        ]
      },
      {
        title: "2. Teach the team how inventory state affects movement",
        description:
          "Most early errors come from trying to move inventory before package state, testing, or identifiers are ready.",
        bullets: [
          "Explain the difference between beginning inventory, active retail inventory, and transfer-ready inventory.",
          "Confirm finished goods that need to move to dispensaries have the required Retail Item IDs before scheduling shipment.",
          "Make sure staff understand that a COA alone is not enough if the package itself does not carry the expected test status in the system.",
          "Hold any package whose testing or finished-good state is unclear."
        ]
      },
      {
        title: "3. Build the transfer process around documentation",
        description:
          "The right habit is to treat every transfer as both a system event and a physical recordkeeping event.",
        bullets: [
          "Before a shipment moves, confirm the transfer exists, the manifest is complete, and the sending license is correct.",
          "Before a receiving team accepts inventory, confirm whether any beginning inventory or onboarding constraint still requires a hold.",
          "Keep transfer numbers, manifest copies, package IDs, and receiving notes together in the same operational record.",
          "Teach staff that a rushed receive decision is a compliance risk, not just a workflow shortcut."
        ]
      },
      {
        title: "4. Create a same-day discrepancy routine",
        description:
          "The fastest way to stabilize a new Metrc workflow is to resolve mismatches the same day they are discovered.",
        bullets: [
          "Review blocked transfers, missing IDs, and testing-state issues at a fixed time each day.",
          "Escalate package-state mismatches before the team attempts workarounds in spreadsheets or side notes.",
          "Have one person own outbound vendor tickets and one person own internal compliance sign-off.",
          "Keep a short incident log for onboarding, transfer, and package-state issues so repeat problems are visible."
        ]
      }
    ]
  },
  {
    slug: "wurk-cannabis-operations-quick-start",
    title: "Wurk Cannabis Operations Quick Start",
    summary:
      "Basic setup guide for Wurk in cannabis operations. Covers employee profile basics, badge and location mapping, onboarding email flow, timekeeping approvals, and payroll-close readiness.",
    product: "Wurk",
    audience: "HR admins, store managers, payroll coordinators, and operations leads",
    estimatedTime: "20-30 min",
    tags: ["wurk", "payroll", "timekeeping", "onboarding", "badge", "cost center"],
    caution:
      "Treat employee, labor, and payroll data as controlled operational records. If shifts, approvals, or profile mappings are wrong near payroll cutoff, correct the source record first instead of forcing a last-minute workaround.",
    lastReviewed: "May 11, 2026",
    officialSources: [
      {
        label: "Wurk New Hire Notification Guidance",
        href: "https://wurkhelp.enjoywurk.com/help/pdfexport/id/614902637011e8c76f7b2500"
      }
    ],
    relatedAssetSlugs: [
      "wurk-shift-close-compliance-checklist",
      "wurk-manager-closeout-record"
    ],
    relatedTicketSlugs: [
      "wurk-new-hire-welcome-email-not-received",
      "wurk-cannabis-badge-or-cost-center-missing-from-employee-profile",
      "wurk-timesheets-pending-approval-are-blocking-payroll-close",
      "wurk-shift-close-attestation-or-manager-review-is-incomplete"
    ],
    sections: [
      {
        title: "1. Clean up the employee profile model first",
        description:
          "A lot of Wurk issues start because profile fields are incomplete or stored in the wrong place.",
        bullets: [
          "Decide which fields belong in work email, personal email, badge, location, department, and cost center before loading users in bulk.",
          "Use a single source of truth for employee IDs, facility locations, and labor reporting structure.",
          "Make sure managers know which fields employees can self-view versus which fields only admins should edit.",
          "Audit one employee profile from each location before onboarding everyone else."
        ]
      },
      {
        title: "2. Verify onboarding notifications and first-login flow",
        description:
          "New-hire email problems are easier to solve before the first day than during live scheduling or payroll work.",
        bullets: [
          "Confirm the account-created notification is enabled for the workflow you actually use.",
          "Check the employee’s work and personal email fields before resending invitations.",
          "Test one real onboarding flow end to end so the team knows what the first user experience looks like.",
          "Document who owns re-sends, bad-email cleanup, and first-login support."
        ]
      },
      {
        title: "3. Map badge, location, and labor buckets before timekeeping goes live",
        description:
          "Clock-in issues and bad payroll reporting usually trace back to profile mapping, not the final approval screen.",
        bullets: [
          "Confirm the employee is attached to the right location, department, and cost center before the first shift.",
          "If cannabis badges or facility-specific identifiers are used in operations, validate they are stored consistently and visible to the right admins.",
          "Test clock-in or scheduling against a small pilot group before opening it to the whole team.",
          "Treat any missing badge or location data as a same-day fix, not a payroll-close fix."
        ]
      },
      {
        title: "4. Build a payroll-close routine around approvals",
        description:
          "A small repeatable review process keeps the timekeeping queue from becoming a last-minute emergency.",
        bullets: [
          "Set a standard time for managers to review missed punches, time changes, and pending approvals before cutoff.",
          "Have payroll review the exception queue by location instead of relying only on one manager’s view.",
          "Use unresolved approval volume as an escalation trigger, not just a late reminder.",
          "Keep a final payroll-close checklist that confirms approvals, location mappings, and unusual adjustments are reviewed."
        ]
      }
    ]
  }
];

export function getQuickStartGuides(): QuickStartGuide[] {
  return quickStartGuides.map((guide) => ({
    ...guide,
    tags: [...guide.tags],
    officialSources: guide.officialSources.map((source) => ({ ...source })),
    relatedAssetSlugs: [...guide.relatedAssetSlugs],
    relatedTicketSlugs: [...guide.relatedTicketSlugs],
    sections: guide.sections.map((section) => ({
      ...section,
      bullets: [...section.bullets]
    }))
  }));
}

export function getQuickStartGuideBySlug(slug: string): QuickStartGuide | undefined {
  return quickStartGuides.find((guide) => guide.slug === slug);
}
