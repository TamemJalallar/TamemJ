"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site";

const teamSizeOptions = [
  "1-10 users",
  "11-25 users",
  "26-50 users",
  "51-100 users",
  "100+ users"
] as const;

const engagementTypeOptions = [
  "Ongoing monthly support",
  "Project work",
  "A blend of both"
] as const;

export function MspInquiryForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [teamSize, setTeamSize] = useState<string>(teamSizeOptions[1]);
  const [engagementType, setEngagementType] = useState<string>(engagementTypeOptions[0]);
  const [stack, setStack] = useState("");
  const [priorities, setPriorities] = useState("");

  const openMailClient = () => {
    const subjectParts = ["Managed IT Retainer Inquiry"];

    if (company.trim()) {
      subjectParts.push(company.trim());
    } else if (name.trim()) {
      subjectParts.push(name.trim());
    }

    const body = [
      `Name: ${name.trim() || "(not provided)"}`,
      `Company: ${company.trim() || "(not provided)"}`,
      `Email: ${email.trim() || "(not provided)"}`,
      `Team Size: ${teamSize}`,
      `Engagement Type: ${engagementType}`,
      "",
      "Current Stack / Platforms:",
      stack.trim() || "(not provided)",
      "",
      "Main Priorities / Pain Points:",
      priorities.trim() || "(not provided)"
    ].join("\n");

    const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subjectParts.join(" - "))}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <div className="surface-card-strong p-6 sm:p-8">
      <h3 className="font-display text-xl font-semibold text-fg sm:text-2xl">
        Retainer inquiry form
      </h3>
      <p className="mt-2 text-sm text-fg-secondary">
        This opens a pre-filled email draft so you can send a structured services inquiry without a
        backend form service.
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          openMailClient();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="msp-name" className="mb-2 block text-sm font-medium text-fg">
              Name
            </label>
            <input
              id="msp-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="msp-company" className="mb-2 block text-sm font-medium text-fg">
              Company
            </label>
            <input
              id="msp-company"
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Company name"
              className="form-input"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="msp-email" className="mb-2 block text-sm font-medium text-fg">
              Work email
            </label>
            <input
              id="msp-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="msp-team-size" className="mb-2 block text-sm font-medium text-fg">
              Team size
            </label>
            <select
              id="msp-team-size"
              value={teamSize}
              onChange={(event) => setTeamSize(event.target.value)}
              className="form-select"
            >
              {teamSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="msp-engagement-type" className="mb-2 block text-sm font-medium text-fg">
            What do you need help with?
          </label>
          <select
            id="msp-engagement-type"
            value={engagementType}
            onChange={(event) => setEngagementType(event.target.value)}
            className="form-select"
          >
            {engagementTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="msp-stack" className="mb-2 block text-sm font-medium text-fg">
            Current stack
          </label>
          <textarea
            id="msp-stack"
            rows={4}
            value={stack}
            onChange={(event) => setStack(event.target.value)}
            placeholder="Example: Microsoft 365, Google Workspace, macOS, Windows, SharePoint, Teams, Okta, Jamf, SaaS apps"
            className="form-textarea"
          />
        </div>

        <div>
          <label htmlFor="msp-priorities" className="mb-2 block text-sm font-medium text-fg">
            Main priorities or pain points
          </label>
          <textarea
            id="msp-priorities"
            rows={6}
            value={priorities}
            onChange={(event) => setPriorities(event.target.value)}
            placeholder="Tell me what needs attention right now: onboarding/offboarding, permissions, file structure, endpoint management, documentation, workflow issues, support backlog, or broader systems cleanup."
            className="form-textarea"
          />
        </div>

        <button type="submit" className="btn-primary w-full sm:w-auto">
          Open Inquiry Draft
        </button>
      </form>
    </div>
  );
}
