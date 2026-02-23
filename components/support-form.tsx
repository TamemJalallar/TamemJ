"use client";

import { useEffect, useState } from "react";
import type { IOSApp } from "@/types/app";
import { siteConfig } from "@/lib/site";

interface SupportFormProps {
  apps: IOSApp[];
}

export function SupportForm({ apps }: SupportFormProps) {
  const [selectedApp, setSelectedApp] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const appParam = params.get("app");
    if (appParam) {
      setSelectedApp(appParam);
    }
  }, []);

  const openMailClient = () => {
    const appName = apps.find((app) => app.slug === selectedApp)?.name ?? "App";
    const finalSubject = subject || `${appName} Support Request`;
    const finalBody = [
      `App: ${appName}`,
      `Reply Email: ${email || "(add your email)"}`,
      "",
      "Issue details:",
      message || "(Describe what happened, expected behavior, device model, iOS version, and app version.)"
    ].join("\n");

    const mailto = `mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(finalBody)}`;
    window.location.href = mailto;
  };

  return (
    <div className="surface-card-strong p-6 sm:p-8">
      <h2 className="text-lg font-semibold sm:text-xl">Send a Support Request</h2>
      <p className="mt-2 text-sm">
        No backend is used here. Submitting opens your email app with the details prefilled.
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          openMailClient();
        }}
      >
        <div>
          <label htmlFor="support-app" className="mb-2 block text-sm font-medium text-slate-900">
            App
          </label>
          <select
            id="support-app"
            value={selectedApp}
            onChange={(event) => setSelectedApp(event.target.value)}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
          >
            <option value="">Select an app</option>
            {apps.map((app) => (
              <option key={app.slug} value={app.slug}>
                {app.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="support-email" className="mb-2 block text-sm font-medium text-slate-900">
            Your Email
          </label>
          <input
            id="support-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </div>

        <div>
          <label htmlFor="support-subject" className="mb-2 block text-sm font-medium text-slate-900">
            Subject
          </label>
          <input
            id="support-subject"
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Short summary of the issue"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </div>

        <div>
          <label htmlFor="support-message" className="mb-2 block text-sm font-medium text-slate-900">
            Message
          </label>
          <textarea
            id="support-message"
            rows={6}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Explain the issue and how to reproduce it."
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </div>

        <button type="submit" className="btn-primary w-full sm:w-auto">
          Open Email Draft
        </button>
      </form>
    </div>
  );
}
