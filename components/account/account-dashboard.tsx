"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "@/components/account/account-provider";

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

type AuthMode = "sign-in" | "sign-up";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function AccountDashboard() {
  const {
    authEnabled,
    status,
    user,
    profile,
    recentDownloads,
    signIn,
    signUp,
    signOut,
    updateProfile
  } = useAccount();

  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(profile?.displayName ?? "");
    setCompany(profile?.company ?? "");
    setRole(profile?.role ?? "");
    setBio(profile?.bio ?? "");
  }, [profile]);

  if (status === "loading") {
    return (
      <section className="surface-card p-6">
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="mt-2 text-sm">Loading account state...</p>
      </section>
    );
  }

  if (!authEnabled) {
    return (
      <section className="surface-card p-6 sm:p-7">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Accounts Setup Required</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          To enable real user accounts, sign-in, profiles, and cross-device download tracking, configure Supabase.
        </p>

        <div className="mt-5 rounded-xl border border-line/80 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Required Environment Variables
          </p>
          <ul className="mt-3 space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-200">
            <li className="list-disc"><code>NEXT_PUBLIC_SUPABASE_URL</code></li>
            <li className="list-disc"><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
          </ul>
        </div>

        <div className="mt-5 rounded-xl border border-line/80 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Supabase SQL (run once)
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-100">
            <code>{`create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  company text,
  role text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.download_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  app_slug text not null,
  app_name text not null,
  channel_label text not null,
  channel_type text not null,
  platform text,
  url text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.download_events enable row level security;

create policy "users own profile read" on public.profiles
for select using (auth.uid() = id);
create policy "users own profile upsert" on public.profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "users own download events read" on public.download_events
for select using (auth.uid() = user_id);
create policy "users own download events insert" on public.download_events
for insert with check (auth.uid() = user_id);`}</code>
          </pre>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="surface-card p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Account</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("sign-in")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                mode === "sign-in"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "border border-line bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("sign-up")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                mode === "sign-up"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "border border-line bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Sign in to sync your profile and download history across devices.
        </p>

        <form
          className="mt-5 grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError(null);
            setMessage(null);

            if (!isValidEmail(email)) {
              setError("Enter a valid email address.");
              return;
            }
            if (password.length < 8) {
              setError("Password must be at least 8 characters.");
              return;
            }

            setLoading(true);
            const result =
              mode === "sign-in"
                ? await signIn(email, password)
                : await signUp({ email, password, displayName });
            setLoading(false);

            if (result.ok) {
              setMessage(result.message);
              if (mode === "sign-up") {
                setMode("sign-in");
              }
            } else {
              setError(result.message);
            }
          }}
        >
          {mode === "sign-up" ? (
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Display Name
              </span>
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your name"
                className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
          ) : null}

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}

          <button type="submit" className="btn-primary w-fit" disabled={loading}>
            {loading ? "Please wait..." : mode === "sign-in" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="surface-card p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Profile</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Signed in as <span className="font-semibold">{user.email}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              const result = await signOut();
              setMessage(result.ok ? result.message : null);
              setError(result.ok ? null : result.message);
            }}
            className="btn-secondary"
          >
            Sign Out
          </button>
        </div>

        <form
          className="mt-5 grid gap-4 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            setError(null);
            setMessage(null);
            setLoading(true);
            const result = await updateProfile({
              displayName,
              company,
              role,
              bio
            });
            setLoading(false);
            if (result.ok) {
              setMessage(result.message);
            } else {
              setError(result.message);
            }
          }}
        >
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Display Name
            </span>
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Your name"
              className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Company
            </span>
            <input
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Company"
              className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Role
            </span>
            <input
              type="text"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="IT Support Engineer"
              className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Bio
            </span>
            <textarea
              rows={3}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Short professional bio"
              className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          {error ? <p className="text-sm text-rose-600 md:col-span-2">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-600 md:col-span-2">{message}</p> : null}

          <button type="submit" className="btn-primary w-fit md:col-span-2" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </section>

      <section className="surface-card p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Download History</h2>
          <Link href="/downloads" className="btn-secondary !px-4 !py-2">
            Browse Downloads
          </Link>
        </div>
        {recentDownloads.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {recentDownloads.slice(0, 25).map((event) => (
              <li
                key={event.id}
                className="rounded-xl border border-line/80 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/70"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{event.appName}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {event.channelLabel}
                      {event.platform ? ` • ${event.platform}` : ""}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatTimestamp(event.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            No tracked downloads yet. Start from the Downloads page and your history will appear here.
          </p>
        )}
      </section>

      <section className="surface-card p-6 sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recommended Next Features</h2>
        <ul className="mt-3 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
          <li className="list-disc">Saved collections: let users build and name app bundles by workflow.</li>
          <li className="list-disc">Release alerts: notify users when tracked apps publish new versions.</li>
          <li className="list-disc">Device profile: OS + architecture preferences to pre-filter download links.</li>
          <li className="list-disc">Download health checks: file signature/checksum verification status history.</li>
          <li className="list-disc">Private notes: user notes on compatibility, install steps, and rollback versions.</li>
        </ul>
      </section>
    </div>
  );
}
