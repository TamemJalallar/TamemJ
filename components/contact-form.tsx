"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const openMailClient = () => {
    const subject = `Contact from tamemj.com${name ? ` - ${name}` : ""}`;
    const body = [
      `Name: ${name || "(not provided)"}`,
      `Email: ${email || "(not provided)"}`,
      "",
      message || "(Message)"
    ].join("\n");

    const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <div className="surface-card-strong p-6 sm:p-8">
      <h2 className="text-lg font-semibold sm:text-xl">Send a Message</h2>
      <p className="mt-2 text-sm">
        This form uses a `mailto:` flow and does not require a backend service.
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          openMailClient();
        }}
      >
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-slate-900">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-slate-900">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-slate-900">
            Message
          </label>
          <textarea
            id="contact-message"
            rows={7}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="How can I help?"
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
