"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import type { DownloadEventRecord, TrackDownloadInput, UserProfile } from "@/types/account";
import {
  type DatabaseDownloadEventRow,
  type DatabaseProfileRow,
  getSupabaseBrowserClient,
  isSupabaseConfigured
} from "@/lib/account.supabase";
import { getLocalDownloadEvents, trackLocalDownload } from "@/lib/account.storage";

interface AccountActionResult {
  ok: boolean;
  message: string;
}

interface AccountContextValue {
  authEnabled: boolean;
  status: "loading" | "ready";
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  recentDownloads: DownloadEventRecord[];
  signIn: (email: string, password: string) => Promise<AccountActionResult>;
  signUp: (input: { email: string; password: string; displayName: string }) => Promise<AccountActionResult>;
  signOut: () => Promise<AccountActionResult>;
  updateProfile: (patch: {
    displayName: string;
    company: string;
    role: string;
    bio: string;
  }) => Promise<AccountActionResult>;
  trackDownload: (input: TrackDownloadInput) => Promise<void>;
  refreshDownloads: () => Promise<void>;
}

const AccountContext = createContext<AccountContextValue | null>(null);

function mapProfileRow(row: DatabaseProfileRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name ?? "",
    company: row.company ?? "",
    role: row.role ?? "",
    bio: row.bio ?? "",
    avatarUrl: row.avatar_url ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapDownloadEventRow(row: DatabaseDownloadEventRow): DownloadEventRecord {
  return {
    id: row.id,
    userId: row.user_id,
    appSlug: row.app_slug,
    appName: row.app_name,
    channelLabel: row.channel_label,
    channelType: row.channel_type,
    platform: row.platform,
    url: row.url,
    createdAt: row.created_at
  };
}

async function ensureAndLoadProfile(user: User): Promise<UserProfile | null> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return null;
  }

  const nowIso = new Date().toISOString();
  const displayNameFromMetadata = String(user.user_metadata?.display_name ?? "").trim();

  const { data, error } = await client
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email ?? "",
        display_name: displayNameFromMetadata || null,
        updated_at: nowIso
      },
      {
        onConflict: "id"
      }
    )
    .select("*")
    .single();

  if (error || !data) {
    return null;
  }

  return mapProfileRow(data);
}

async function loadRemoteDownloadEvents(userId: string): Promise<DownloadEventRecord[]> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from("download_events")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(80);

  if (error || !data) {
    return [];
  }

  return data.map(mapDownloadEventRow);
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const authEnabled = isSupabaseConfigured();
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentDownloads, setRecentDownloads] = useState<DownloadEventRecord[]>([]);

  const refreshDownloads = useCallback(async () => {
    if (!authEnabled || !user) {
      setRecentDownloads(getLocalDownloadEvents(user?.id ?? null));
      return;
    }

    const events = await loadRemoteDownloadEvents(user.id);
    setRecentDownloads(events);
  }, [authEnabled, user]);

  useEffect(() => {
    if (!authEnabled) {
      setRecentDownloads(getLocalDownloadEvents(null));
      setStatus("ready");
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) {
      setStatus("ready");
      return;
    }

    let active = true;

    void client.auth.getSession().then(async ({ data }) => {
      if (!active) {
        return;
      }

      const nextSession = data.session ?? null;
      const nextUser = nextSession?.user ?? null;
      setSession(nextSession);
      setUser(nextUser);

      if (nextUser) {
        const nextProfile = await ensureAndLoadProfile(nextUser);
        if (!active) {
          return;
        }
        setProfile(nextProfile);
        const events = await loadRemoteDownloadEvents(nextUser.id);
        if (!active) {
          return;
        }
        setRecentDownloads(events);
      } else {
        setProfile(null);
        setRecentDownloads(getLocalDownloadEvents(null));
      }

      setStatus("ready");
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      const nextUser = nextSession?.user ?? null;
      setSession(nextSession);
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setRecentDownloads(getLocalDownloadEvents(null));
        setStatus("ready");
        return;
      }

      void ensureAndLoadProfile(nextUser).then((nextProfile) => {
        if (!active) {
          return;
        }
        setProfile(nextProfile);
      });

      void loadRemoteDownloadEvents(nextUser.id).then((events) => {
        if (!active) {
          return;
        }
        setRecentDownloads(events);
      });

      setStatus("ready");
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [authEnabled]);

  const signIn = useCallback(async (email: string, password: string): Promise<AccountActionResult> => {
    if (!authEnabled) {
      return {
        ok: false,
        message: "Authentication is not configured. Add Supabase environment variables first."
      };
    }

    const client = getSupabaseBrowserClient();
    if (!client) {
      return { ok: false, message: "Supabase client is unavailable." };
    }

    const { error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "Signed in successfully." };
  }, [authEnabled]);

  const signUp = useCallback(
    async (input: { email: string; password: string; displayName: string }): Promise<AccountActionResult> => {
      if (!authEnabled) {
        return {
          ok: false,
          message: "Authentication is not configured. Add Supabase environment variables first."
        };
      }

      const client = getSupabaseBrowserClient();
      if (!client) {
        return { ok: false, message: "Supabase client is unavailable." };
      }

      const { data, error } = await client.auth.signUp({
        email: input.email.trim(),
        password: input.password,
        options: {
          data: {
            display_name: input.displayName.trim()
          }
        }
      });

      if (error) {
        return { ok: false, message: error.message };
      }

      if (data.user && !data.session) {
        return {
          ok: true,
          message: "Account created. Check your email to confirm your account before signing in."
        };
      }

      return { ok: true, message: "Account created and signed in." };
    },
    [authEnabled]
  );

  const signOut = useCallback(async (): Promise<AccountActionResult> => {
    if (!authEnabled) {
      return { ok: true, message: "Signed out." };
    }

    const client = getSupabaseBrowserClient();
    if (!client) {
      return { ok: false, message: "Supabase client is unavailable." };
    }

    const { error } = await client.auth.signOut();
    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "Signed out." };
  }, [authEnabled]);

  const updateProfile = useCallback(
    async (patch: {
      displayName: string;
      company: string;
      role: string;
      bio: string;
    }): Promise<AccountActionResult> => {
      if (!authEnabled || !user) {
        return { ok: false, message: "Sign in to update your profile." };
      }

      const client = getSupabaseBrowserClient();
      if (!client) {
        return { ok: false, message: "Supabase client is unavailable." };
      }

      const { data, error } = await client
        .from("profiles")
        .update({
          display_name: patch.displayName.trim() || null,
          company: patch.company.trim() || null,
          role: patch.role.trim() || null,
          bio: patch.bio.trim() || null,
          email: user.email ?? "",
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id)
        .select("*")
        .single();

      if (error || !data) {
        return { ok: false, message: error?.message ?? "Unable to update profile." };
      }

      setProfile(mapProfileRow(data));
      return { ok: true, message: "Profile updated." };
    },
    [authEnabled, user]
  );

  const trackDownload = useCallback(
    async (input: TrackDownloadInput) => {
      const localEvent = trackLocalDownload(user?.id ?? null, input);

      if (!authEnabled || !user) {
        setRecentDownloads((current) => [localEvent, ...current].slice(0, 80));
        return;
      }

      const client = getSupabaseBrowserClient();
      if (!client) {
        setRecentDownloads((current) => [localEvent, ...current].slice(0, 80));
        return;
      }

      const { data, error } = await client
        .from("download_events")
        .insert({
          user_id: user.id,
          app_slug: input.appSlug,
          app_name: input.appName,
          channel_label: input.channelLabel,
          channel_type: input.channelType,
          platform: input.platform ?? null,
          url: input.url
        })
        .select("*")
        .single();

      if (error || !data) {
        setRecentDownloads((current) => [localEvent, ...current].slice(0, 80));
        return;
      }

      const nextEvent = mapDownloadEventRow(data);
      setRecentDownloads((current) => [nextEvent, ...current].slice(0, 80));
    },
    [authEnabled, user]
  );

  const value = useMemo<AccountContextValue>(
    () => ({
      authEnabled,
      status,
      user,
      session,
      profile,
      recentDownloads,
      signIn,
      signUp,
      signOut,
      updateProfile,
      trackDownload,
      refreshDownloads
    }),
    [
      authEnabled,
      profile,
      recentDownloads,
      refreshDownloads,
      session,
      signIn,
      signOut,
      signUp,
      status,
      trackDownload,
      updateProfile,
      user
    ]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const value = useContext(AccountContext);
  if (!value) {
    throw new Error("useAccount must be used within AccountProvider");
  }

  return value;
}
