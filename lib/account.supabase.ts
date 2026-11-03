import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface DatabaseProfileRow {
  id: string;
  email: string;
  display_name: string | null;
  company: string | null;
  role: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseDownloadEventRow {
  id: string;
  user_id: string;
  app_slug: string;
  app_name: string;
  channel_label: string;
  channel_type: string;
  platform: string | null;
  url: string;
  created_at: string;
}

let browserClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
  }

  return browserClient;
}
