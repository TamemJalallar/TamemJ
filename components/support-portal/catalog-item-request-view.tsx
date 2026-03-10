"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { CatalogField, CatalogItem } from "@/types/support";
import { SupportPageHeader } from "@/components/support-portal/page-header";
import { TurnstileWidget } from "@/components/support-portal/turnstile-widget";
import { createTicket } from "@/lib/support-portal.storage";
import { calculateTicketPriority } from "@/lib/support-portal.priority";
import { trackCatalogSubmit } from "@/lib/support-portal.analytics";
import {
  sendSupportTicketEmail,
  supportTicketEmailEndpoint,
  supportTicketEmailRecipient
} from "@/lib/support-ticket-email";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

type FormValue = string | boolean | string[];

function initFieldValue(field: CatalogField): FormValue {
  if (field.type === "checkbox") return false;
  if (field.type === "multiselect") return [];
  return "";
}

function stringifyValue(value: FormValue): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function CatalogItemRequestView({ item }: { item: CatalogItem }) {
  const initialValues = useMemo(() => {
    return Object.fromEntries(item.requiredFields.map((field) => [field.id, initFieldValue(field)]));
  }, [item.requiredFields]);

  const [requesterName, setRequesterName] = useState("");
  const [requesterPhone, setRequesterPhone] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [values, setValues] = useState<Record<string, FormValue>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [emailSendState, setEmailSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [emailStatusMessage, setEmailStatusMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetCounter, setTurnstileResetCounter] = useState(0);

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

  function setFieldValue(fieldId: string, next: FormValue) {
    setValues((current) => ({ ...current, [fieldId]: next }));
    setErrors((current) => {
      if (!current[fieldId]) return current;
      const copy = { ...current };
      delete copy[fieldId];
      return copy;
    });
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

    for (const field of item.requiredFields) {
      if (!field.required) continue;
      const value = values[field.id];
      if (field.type === "checkbox") {
        continue;
      }
      if (field.type === "multiselect") {
        if (!Array.isArray(value) || value.length === 0) {
          nextErrors[field.id] = "This field is required.";
        }
        continue;
      }
      if (typeof value !== "string" || value.trim() === "") {
        nextErrors[field.id] = "This field is required.";
      }
    }
    if (supportTicketEmailEndpoint && !turnstileToken) {
      nextErrors.turnstile = "Complete the security check before submitting.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function renderField(field: CatalogField) {
    const value = values[field.id] ?? initFieldValue(field);
    const error = errors[field.id];
    const baseClass = cx(
      "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition",
      error ? "border-rose-300" : "border-line focus:border-slate-300 focus:shadow-soft",
      "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    );

    if (field.type === "textarea") {
      return (
        <textarea
          id={field.id}
          rows={4}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => setFieldValue(field.id, event.target.value)}
          placeholder={field.placeholder}
          className={baseClass}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          id={field.id}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => setFieldValue(field.id, event.target.value)}
          className={baseClass}
        >
          <option value="">Select an option</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "checkbox") {
      return (
        <label className="inline-flex items-center gap-3 rounded-xl border border-line/80 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900">
          <input
            id={field.id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => setFieldValue(field.id, event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          <span className="text-slate-700 dark:text-slate-200">Yes</span>
        </label>
      );
    }

    return (
      <input
        id={field.id}
        type="text"
        value={typeof value === "string" ? value : ""}
        onChange={(event) => setFieldValue(field.id, event.target.value)}
        placeholder={field.placeholder}
        className={baseClass}
      />
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    const firstField = item.requiredFields[0];
    const firstFieldValue = firstField ? values[firstField.id] : "";
    const summarySuffix =
      typeof firstFieldValue === "string" && firstFieldValue.trim()
        ? ` - ${firstFieldValue.trim()}`
        : "";

    const ticket = createTicket({
      requesterName,
      requesterPhone,
      requesterEmail,
      type: "Request",
      impact: "Medium",
      urgency: "Medium",
      priority: calculateTicketPriority("Medium", "Medium"),
      category: item.category,
      subcategory: item.title,
      product: item.product,
      summary: `${item.title}${summarySuffix}`,
      description: [
        item.description,
        "",
        "Submitted Catalog Fields:",
        ...item.requiredFields.map((field) =>
          `${field.label}: ${stringifyValue(values[field.id] ?? initFieldValue(field))}`
        )
      ].join("\n"),
      preferredContactMethod: "Email",
      attachments: [],
      catalogItemSlug: item.slug,
      requestedFields: {
        requesterName,
        requesterPhone,
        requesterEmail,
        ...Object.fromEntries(
          Object.entries(values).map(([key, val]) => [key, Array.isArray(val) ? [...val] : val])
        )
      }
    });

    trackCatalogSubmit({
      slug: item.slug,
      title: item.title,
      category: item.category,
      product: item.product
    });

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
  }

  return (
    <div className="space-y-5">
      <SupportPageHeader
        title={item.title}
        description={item.description}
        breadcrumbs={[
          { label: "Support Portal", href: "/support" },
          { label: "Service Catalog", href: "/support/catalog" },
          { label: item.title }
        ]}
        actions={
          <div className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p className="font-semibold text-slate-900 dark:text-slate-100">Expected fulfillment</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.expectedFulfillmentTime}</p>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Request Form</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Submit creates a local ticket and sends ticket details to {supportTicketEmailRecipient}.
          </p>

          {createdTicketId ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <p className="font-semibold text-emerald-800 dark:text-emerald-200">Request Submitted</p>
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
              <Link href="/support/my-tickets" className="mt-3 inline-flex rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-200">
                View My Tickets
              </Link>
            </div>
          ) : null}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div className="rounded-2xl border border-line/70 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">User Information</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="request-requester-name" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
                    Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="request-requester-name"
                    type="text"
                    value={requesterName}
                    onChange={(event) => setRequesterName(event.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                  {errors.requesterName ? <p className="mt-1 text-xs text-rose-600">{errors.requesterName}</p> : null}
                </div>
                <div>
                  <label htmlFor="request-requester-phone" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
                    Phone # <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="request-requester-phone"
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
                <label htmlFor="request-requester-email" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
                  Email <span className="text-rose-600">*</span>
                </label>
                <input
                  id="request-requester-email"
                  type="email"
                  value={requesterEmail}
                  onChange={(event) => setRequesterEmail(event.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                {errors.requesterEmail ? <p className="mt-1 text-xs text-rose-600">{errors.requesterEmail}</p> : null}
              </div>
            </div>

            {item.requiredFields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
                  {field.label}
                  {field.required ? <span className="ml-1 text-rose-600">*</span> : null}
                </label>
                {renderField(field)}
                {field.helpText ? (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{field.helpText}</p>
                ) : null}
                {errors[field.id] ? <p className="mt-1 text-xs text-rose-600">{errors[field.id]}</p> : null}
              </div>
            ))}

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
              {emailSendState === "sending" ? "Submitting..." : "Submit Request Ticket"}
            </button>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Approval Note</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.approvalNote}</p>
          </div>

          <div className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Workflow Summary</h2>
            <ol className="mt-3 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
              {item.workflowSummary.map((step) => (
                <li key={step} className="list-decimal leading-7">
                  {step}
                </li>
              ))}
            </ol>
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
