"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { SupportImpact, SupportUrgency } from "@/types/support";
import { SupportPageHeader } from "@/components/support-portal/page-header";
import { calculateTicketPriority } from "@/lib/support-portal.priority";
import { createTicket } from "@/lib/support-portal.storage";
import { trackIncidentSubmit } from "@/lib/support-portal.analytics";
import { PriorityBadge } from "@/components/support-portal/badges";
import { TurnstileWidget } from "@/components/support-portal/turnstile-widget";
import {
  sendSupportTicketEmail,
  supportTicketEmailEndpoint,
  supportTicketEmailRecipient
} from "@/lib/support-ticket-email";

const incidentTaxonomy = {
  "Microsoft 365": {
    subcategories: [
      "Outlook",
      "Teams",
      "OneDrive",
      "SharePoint",
      "Word",
      "Excel",
      "PowerPoint",
      "OneNote",
      "Exchange Online",
      "Intune"
    ]
  },
  "Identity / MFA / SSO": {
    subcategories: [
      "Microsoft Entra ID",
      "Authenticator",
      "Okta",
      "Duo",
      "SSO Portal",
      "Conditional Access",
      "MFA Recovery"
    ]
  },
  Adobe: {
    subcategories: [
      "Creative Cloud Desktop",
      "Acrobat",
      "Photoshop",
      "Illustrator",
      "InDesign",
      "Premiere Pro",
      "After Effects",
      "Lightroom"
    ]
  },
  Figma: {
    subcategories: [
      "Figma Desktop App",
      "Figma Web",
      "FigJam",
      "Figma Fonts",
      "Figma Dev Mode",
      "Figma SSO"
    ]
  },
  Networking: {
    subcategories: [
      "Corporate VPN",
      "Wi-Fi",
      "DNS",
      "Proxy / SWG",
      "ZTNA Client",
      "Ethernet / Docking"
    ]
  },
  Endpoint: {
    subcategories: [
      "Windows 11",
      "Windows 10",
      "macOS",
      "iOS",
      "Android",
      "Printer / Scanner",
      "Conference Room AV"
    ]
  }
} as const;

type IncidentCategory = keyof typeof incidentTaxonomy;

const impactOptions: SupportImpact[] = ["Low", "Medium", "High"];
const urgencyOptions: SupportUrgency[] = ["Low", "Medium", "High"];

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function IncidentForm() {
  const [requesterName, setRequesterName] = useState("");
  const [requesterPhone, setRequesterPhone] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [category, setCategory] = useState<IncidentCategory>("Microsoft 365");
  const [subcategory, setSubcategory] = useState<string>(
    incidentTaxonomy["Microsoft 365"].subcategories[0]
  );
  const [impact, setImpact] = useState<SupportImpact>("Medium");
  const [urgency, setUrgency] = useState<SupportUrgency>("Medium");
  const [preferredContactMethod, setPreferredContactMethod] = useState<"Email" | "Teams" | "Phone">("Email");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [emailSendState, setEmailSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [emailStatusMessage, setEmailStatusMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetCounter, setTurnstileResetCounter] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const priority = useMemo(() => calculateTicketPriority(impact, urgency), [impact, urgency]);
  const categoryConfig = incidentTaxonomy[category];

  useEffect(() => {
    if (!turnstileToken) {
      return;
    }

    setErrors((current) => {
      if (!current.turnstile) {
        return current;
      }

      const next = { ...current };
      delete next.turnstile;
      return next;
    });
  }, [turnstileToken]);

  function handleCategoryChange(next: IncidentCategory) {
    setCategory(next);
    setSubcategory(incidentTaxonomy[next].subcategories[0]);
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};

    if (!requesterName.trim()) nextErrors.requesterName = "Name is required.";
    if (!requesterPhone.trim()) nextErrors.requesterPhone = "Phone number is required.";
    if (!requesterEmail.trim()) {
      nextErrors.requesterEmail = "Email is required.";
    } else if (!isValidEmail(requesterEmail)) {
      nextErrors.requesterEmail = "Enter a valid email address.";
    }

    if (!shortDescription.trim()) nextErrors.shortDescription = "Short description is required.";
    if (!detailedDescription.trim()) nextErrors.detailedDescription = "Detailed description is required.";
    if (supportTicketEmailEndpoint && !turnstileToken) {
      nextErrors.turnstile = "Complete the security check before submitting.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    const product = subcategory;

    const ticket = createTicket({
      requesterName,
      requesterPhone,
      requesterEmail,
      type: "Incident",
      priority,
      impact,
      urgency,
      category,
      subcategory,
      product,
      summary: shortDescription,
      description: detailedDescription,
      preferredContactMethod,
      attachments
    });

    trackIncidentSubmit({ category, subcategory, product, priority });
    setCreatedTicketId(ticket.id);

    setEmailSendState("sending");
    const emailResult = await sendSupportTicketEmail(ticket, { turnstileToken });
    setTurnstileToken(null);
    setTurnstileResetCounter((current) => current + 1);

    if (emailResult.ok) {
      setEmailSendState("sent");
      setEmailStatusMessage(emailResult.message);
    } else {
      setEmailSendState("error");
      setEmailStatusMessage(emailResult.message);
    }

    setShortDescription("");
    setDetailedDescription("");
    setAttachments([]);
    setErrors({});
  }

  return (
    <div className="space-y-5">
      <SupportPageHeader
        title="Submit Incident"
        description="Create an incident ticket using an ITIL-lite intake form. Priority is calculated automatically from impact and urgency."
        breadcrumbs={[{ label: "Support Portal", href: "/support" }, { label: "Submit Incident" }]}
        actions={
          <div className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Calculated Priority</p>
            <div className="mt-2"><PriorityBadge priority={priority} /></div>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Incident Intake Form</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Submit creates a local ticket and sends ticket details to {supportTicketEmailRecipient}.
          </p>

          {createdTicketId ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <p className="font-semibold text-emerald-800 dark:text-emerald-200">Incident Submitted</p>
              <p className="mt-1 text-emerald-700 dark:text-emerald-300">Created ticket: {createdTicketId}</p>
              {emailSendState === "sending" ? (
                <p className="mt-1 text-emerald-700 dark:text-emerald-300">Sending ticket email...</p>
              ) : null}
              {emailStatusMessage ? (
                <p
                  className={`mt-1 ${
                    emailSendState === "sent"
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-rose-700 dark:text-rose-300"
                  }`}
                >
                  {emailStatusMessage}
                </p>
              ) : null}
              <Link href="/support/tickets" className="mt-3 inline-flex rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-200">
                View My Tickets
              </Link>
            </div>
          ) : null}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div className="rounded-2xl border border-line/70 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">User Information</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="incident-requester-name" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Name <span className="text-rose-600">*</span></label>
                  <input
                    id="incident-requester-name"
                    type="text"
                    value={requesterName}
                    onChange={(event) => setRequesterName(event.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                  {errors.requesterName ? <p className="mt-1 text-xs text-rose-600">{errors.requesterName}</p> : null}
                </div>
                <div>
                  <label htmlFor="incident-requester-phone" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Phone # <span className="text-rose-600">*</span></label>
                  <input
                    id="incident-requester-phone"
                    type="tel"
                    value={requesterPhone}
                    onChange={(event) => setRequesterPhone(event.target.value)}
                    placeholder="+1 (555) 555-5555"
                    className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                  {errors.requesterPhone ? <p className="mt-1 text-xs text-rose-600">{errors.requesterPhone}</p> : null}
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="incident-requester-email" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Email <span className="text-rose-600">*</span></label>
                <input
                  id="incident-requester-email"
                  type="email"
                  value={requesterEmail}
                  onChange={(event) => setRequesterEmail(event.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                {errors.requesterEmail ? <p className="mt-1 text-xs text-rose-600">{errors.requesterEmail}</p> : null}
              </div>
            </div>

            <div>
              <label htmlFor="incident-short-description" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Short Description <span className="text-rose-600">*</span></label>
              <input
                id="incident-short-description"
                type="text"
                value={shortDescription}
                onChange={(event) => setShortDescription(event.target.value)}
                placeholder="Brief summary of the issue"
                className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              {errors.shortDescription ? <p className="mt-1 text-xs text-rose-600">{errors.shortDescription}</p> : null}
            </div>

            <div>
              <label htmlFor="incident-detailed-description" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Detailed Description <span className="text-rose-600">*</span></label>
              <textarea
                id="incident-detailed-description"
                rows={5}
                value={detailedDescription}
                onChange={(event) => setDetailedDescription(event.target.value)}
                placeholder="What happened, when it started, what is impacted, and any error messages"
                className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              {errors.detailedDescription ? <p className="mt-1 text-xs text-rose-600">{errors.detailedDescription}</p> : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="incident-category" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Category</label>
                <select
                  id="incident-category"
                  value={category}
                  onChange={(event) => handleCategoryChange(event.target.value as IncidentCategory)}
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {Object.keys(incidentTaxonomy).map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="incident-subcategory" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Application</label>
                <select
                  id="incident-subcategory"
                  value={subcategory}
                  onChange={(event) => setSubcategory(event.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {categoryConfig.subcategories.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="incident-contact" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Preferred Contact Method</label>
                <select
                  id="incident-contact"
                  value={preferredContactMethod}
                  onChange={(event) => setPreferredContactMethod(event.target.value as "Email" | "Teams" | "Phone")}
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="Email">Email</option>
                  <option value="Teams">Teams</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>
              <div>
                <label htmlFor="incident-impact" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Impact</label>
                <select
                  id="incident-impact"
                  value={impact}
                  onChange={(event) => setImpact(event.target.value as SupportImpact)}
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {impactOptions.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="incident-urgency" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Urgency</label>
                <select
                  id="incident-urgency"
                  value={urgency}
                  onChange={(event) => setUrgency(event.target.value as SupportUrgency)}
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {urgencyOptions.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="incident-attachments" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Attachments (filenames only)</label>
                <input
                  id="incident-attachments"
                  type="file"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    setAttachments(files.map((file) => file.name));
                  }}
                  className="block w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
                {attachments.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    {attachments.map((name) => (
                      <li key={name}>• {name}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-line/70 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Security Verification</h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Complete this challenge to prevent spam and unauthorized ticket email submissions.
              </p>
              <div className="mt-3">
                <TurnstileWidget onTokenChange={setTurnstileToken} resetCounter={turnstileResetCounter} />
              </div>
              {errors.turnstile ? <p className="mt-2 text-xs text-rose-600">{errors.turnstile}</p> : null}
            </div>

            <button type="submit" disabled={emailSendState === "sending"} className="btn-primary disabled:cursor-not-allowed disabled:opacity-70">
              {emailSendState === "sending" ? "Submitting..." : "Submit Incident Ticket"}
            </button>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Priority Matrix</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-line/70 dark:border-slate-800">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Impact \\ Urgency</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Low</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Medium</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">High</th>
                  </tr>
                </thead>
                <tbody>
                  {impactOptions.map((impactValue) => (
                    <tr key={impactValue} className="border-t border-line/60 dark:border-slate-800">
                      <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-200">{impactValue}</td>
                      {urgencyOptions.map((urgencyValue) => (
                        <td key={`${impactValue}-${urgencyValue}`} className="px-3 py-2 text-slate-600 dark:text-slate-300">
                          {calculateTicketPriority(impactValue, urgencyValue)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Email Service Status</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {supportTicketEmailEndpoint
                ? "Automatic email sending is enabled."
                : "Automatic email sending is not configured. Set NEXT_PUBLIC_SUPPORT_TICKET_EMAIL_ENDPOINT in your build environment."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
