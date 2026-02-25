"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { FixBuilder } from "@/components/corporate-fixes/fix-builder";

const SESSION_KEY = "corporateTechFixes:builderUnlocked:v1";
const AUTH_MODE = (
  process.env.NEXT_PUBLIC_CORPORATE_FIXES_BUILDER_AUTH_MODE ?? "password"
)
  .trim()
  .toLowerCase();
const CONFIGURED_PASSWORD_HASH = (
  process.env.NEXT_PUBLIC_CORPORATE_FIXES_BUILDER_PASSWORD_SHA256 ?? ""
)
  .trim()
  .toLowerCase();

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
}

export function FixBuilderGate() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usesCloudflareAccess = useMemo(() => AUTH_MODE === "cloudflare-access", []);
  const hasPasswordConfigured = useMemo(() => CONFIGURED_PASSWORD_HASH.length === 64, []);
  const isDevelopment = process.env.NODE_ENV !== "production";

  useEffect(() => {
    if (typeof window === "undefined") {
      setCheckingSession(false);
      return;
    }

    if (usesCloudflareAccess) {
      setUnlocked(true);
      setCheckingSession(false);
      return;
    }

    if (!hasPasswordConfigured) {
      setCheckingSession(false);
      return;
    }

    try {
      const sessionValue = window.sessionStorage.getItem(SESSION_KEY);
      if (sessionValue && sessionValue === CONFIGURED_PASSWORD_HASH) {
        setUnlocked(true);
      }
    } catch {
      // Ignore sessionStorage access issues.
    } finally {
      setCheckingSession(false);
    }
  }, [hasPasswordConfigured, usesCloudflareAccess]);

  function persistUnlockSession() {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.sessionStorage.setItem(SESSION_KEY, CONFIGURED_PASSWORD_HASH);
    } catch {
      // Ignore session storage issues.
    }
  }

  function clearUnlockSession() {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore session storage issues.
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!hasPasswordConfigured) {
      setError("Builder password hash is not configured for this build.");
      return;
    }

    const trimmed = password.trim();
    if (!trimmed) {
      setError("Enter the builder password.");
      return;
    }

    if (typeof crypto === "undefined" || !crypto.subtle) {
      setError("This browser does not support Web Crypto. Try a modern browser.");
      return;
    }

    setSubmitting(true);

    try {
      const hash = await sha256Hex(trimmed);
      if (hash !== CONFIGURED_PASSWORD_HASH) {
        setError("Incorrect password.");
        return;
      }

      persistUnlockSession();
      setUnlocked(true);
      setPassword("");
    } catch {
      setError("Unable to verify password in this browser.");
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="surface-card p-6 dark:border-slate-800 dark:bg-slate-950/70 sm:p-8">
        <p className="text-sm text-slate-600 dark:text-slate-300">Checking builder access…</p>
      </div>
    );
  }

  if (!hasPasswordConfigured && !isDevelopment) {
    return (
      <div className="space-y-4">
        <div className="surface-card-strong p-6 dark:border-slate-800 dark:bg-slate-950/70 sm:p-8">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
            KB Builder Locked (Configuration Required)
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            This builder is configured to require a password, but no password hash was provided at
            build time. Set
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
              NEXT_PUBLIC_CORPORATE_FIXES_BUILDER_PASSWORD_SHA256
            </code>
            and redeploy.
          </p>
          <div className="mt-5 rounded-xl border border-line/80 bg-slate-50/70 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p className="font-semibold text-slate-900 dark:text-slate-100">SHA-256 hash example</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs leading-6 text-slate-100">
              <code>printf 'your-password' | shasum -a 256</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="space-y-4">
        <div className="surface-card-strong p-6 dark:border-slate-800 dark:bg-slate-950/70 sm:p-8">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
            Corporate Tech Fixes KB Builder
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Password required. This protects the builder UI from casual/public access on static
            hosting. Note: this is a client-side gate (not server-side authentication).
          </p>

          {!hasPasswordConfigured && isDevelopment ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              No password hash is configured for this local/development build.
              <button
                type="button"
                onClick={() => setUnlocked(true)}
                className="ml-2 inline-flex rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-xs font-semibold text-amber-800 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-200"
              >
                Open Builder (Dev Only)
              </button>
            </div>
          ) : null}

          {hasPasswordConfigured ? (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="corporate-fix-builder-password"
                  className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  Builder Password
                </label>
                <input
                  id="corporate-fix-builder-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  autoComplete="current-password"
                />
              </div>

              {error ? (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
                  {error}
                </p>
              ) : null}

              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Verifying…" : "Unlock Builder"}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {usesCloudflareAccess ? (
        <div className="surface-card p-4 dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Protected by Cloudflare Access
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This builder is expected to be gated externally by Cloudflare Zero Trust Access.
              Configure an Access application for
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
                /corporate-tech-fixes/builder*
              </code>
              on your site hostname.
            </p>
          </div>
        </div>
      ) : null}

      <div className="surface-card p-4 dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {usesCloudflareAccess ? "Builder Access Active" : "Builder Unlocked (Session)"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {usesCloudflareAccess
                ? "Authentication is enforced upstream by Cloudflare Access."
                : "Access remains unlocked for this browser tab/session until you lock it or close the tab."}
            </p>
          </div>
          {!usesCloudflareAccess ? (
            <button
              type="button"
              onClick={() => {
                clearUnlockSession();
                setUnlocked(false);
              }}
              className="btn-secondary"
            >
              Lock Builder
            </button>
          ) : null}
        </div>
      </div>

      <FixBuilder />
    </div>
  );
}
