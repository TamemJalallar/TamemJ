"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { SupportImpact, SupportUrgency } from "@/types/support";
import { SupportPageHeader } from "@/components/support-portal/page-header";
import { calculateTicketPriority } from "@/lib/support-portal.priority";
import { createTicket } from "@/lib/support-portal.storage";
import { trackIncidentSubmit } from "@/lib/support-portal.analytics";
import { PriorityBadge } from "@/components/support-portal/badges";

const incidentTaxonomy = {
  "Microsoft 365": {
    subcategories: ["Outlook", "Teams", "OneDrive", "SharePoint", "Office Apps"],
    products: ["Outlook", "Teams", "OneDrive", "SharePoint", "Microsoft Office"]
  },
  "Identity / MFA / SSO": {
    subcategories: ["MFA", "SSO", "Conditional Access", "Password / Sign-In"],
    products: ["Microsoft Entra ID", "Authenticator", "Corporate SSO"]
  },
  Adobe: {
    subcategories: ["Creative Cloud Desktop", "Acrobat", "Licensing", "Performance"],
    products: ["Adobe Creative Cloud", "Adobe Acrobat", "Photoshop", "Premiere Pro", "After Effects"]
  },
  Figma: {
    subcategories: ["Desktop App", "Browser", "SSO", "Permissions", "Performance"],
    products: ["Figma Desktop App", "Figma Web", "Figma SSO", "Figma Permissions"]
  },
  Networking: {
    subcategories: ["VPN", "Wi-Fi", "DNS", "Proxy"],
    products: ["Corporate VPN", "Corporate Wi-Fi", "Proxy / Secure Web Gateway"]
  },
  Endpoint: {
    subcategories: ["Windows", "macOS", "Printing", "Hardware"],
    products: ["Windows", "macOS", "Printer / Scanner", "Laptop / Dock"]
  }
} as const;

type IncidentCategory = keyof typeof incidentTaxonomy;

const impactOptions: SupportImpact[] = ["Low", "Medium", "High"];
const urgencyOptions: SupportUrgency[] = ["Low", "Medium", "High"];

export function IncidentForm() {
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [category, setCategory] = useState<IncidentCategory>("Microsoft 365");
  const [subcategory, setSubcategory] = useState<string>(
    incidentTaxonomy["Microsoft 365"].subcategories[0]
  );
  const [product, setProduct] = useState<string>(incidentTaxonomy["Microsoft 365"].products[0]);
  const [impact, setImpact] = useState<SupportImpact>("Medium");
  const [urgency, setUrgency] = useState<SupportUrgency>("Medium");
  const [preferredContactMethod, setPreferredContactMethod] = useState<"Email" | "Teams" | "Phone">("Email");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const priority = useMemo(() => calculateTicketPriority(impact, urgency), [impact, urgency]);
  const categoryConfig = incidentTaxonomy[category];

  function handleCategoryChange(next: IncidentCategory) {
    setCategory(next);
    setSubcategory(incidentTaxonomy[next].subcategories[0]);
    setProduct(incidentTaxonomy[next].products[0]);
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!shortDescription.trim()) nextErrors.shortDescription = "Short description is required.";
    if (!detailedDescription.trim()) nextErrors.detailedDescription = "Detailed description is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    const ticket = createTicket({
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

    setShortDescription("");
    setDetailedDescription("");
    setAttachments([]);
    setErrors({});
  }

  return (
    <div className="space-y-5">
      <SupportPageHeader
        title="Submit Incident"
        description="Create a demo incident ticket using an ITIL-lite intake form. Priority is calculated automatically from impact and urgency." 
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
            Demo-only workflow. Submissions are stored locally in this browser and appear under My Tickets.
          </p>

          {createdTicketId ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <p className="font-semibold text-emerald-800 dark:text-emerald-200">Incident Submitted</p>
              <p className="mt-1 text-emerald-700 dark:text-emerald-300">Created demo ticket: {createdTicketId}</p>
              <Link href="/support/tickets" className="mt-3 inline-flex rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-200">
                View My Tickets
              </Link>
            </div>
          ) : null}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
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
                <label htmlFor="incident-subcategory" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Subcategory</label>
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
                <label htmlFor="incident-product" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Product</label>
                <select
                  id="incident-product"
                  value={product}
                  onChange={(event) => setProduct(event.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {categoryConfig.products.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            <div>
              <label htmlFor="incident-attachments" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">Attachments (mock: filenames only)</label>
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

            <button type="submit" className="btn-primary">
              Submit Incident (Demo Ticket)
            </button>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Priority Matrix (Demo)</h2>
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
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Intake Guidance</h2>
            <ul className="mt-3 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
              <li className="list-disc leading-7">Include exact error messages, timestamps, and screenshots where possible.</li>
              <li className="list-disc leading-7">Use the KB first for known issues; this improves local analytics and triage quality.</li>
              <li className="list-disc leading-7">Security-related incidents (account compromise, suspicious MFA prompts) should be escalated immediately.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
