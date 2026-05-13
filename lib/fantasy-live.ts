import type { FantasyLiveLeagueEnvelope } from "@/types/fantasy-live";

export const FANTASY_PUBLIC_LEAGUE_PATH = "/api/fantasy/league";

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function resolveFantasyLiveLeagueUrl(): string | null {
  const configuredBase = process.env.NEXT_PUBLIC_FANTASY_API_BASE_URL?.trim();
  if (configuredBase) {
    return `${trimTrailingSlash(configuredBase)}${FANTASY_PUBLIC_LEAGUE_PATH}`;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const { hostname, origin } = window.location;
  if (hostname === "tamemj.com" || hostname === "www.tamemj.com") {
    return `${origin}${FANTASY_PUBLIC_LEAGUE_PATH}`;
  }

  return null;
}

export function isFantasyLiveLeagueEnvelope(value: unknown): value is FantasyLiveLeagueEnvelope {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  const data = record.data as Record<string, unknown> | undefined;
  const meta = record.meta as Record<string, unknown> | undefined;

  return Boolean(
    typeof record.ok === "boolean" &&
      data &&
      typeof data === "object" &&
      data.league &&
      Array.isArray(data.standings) &&
      Array.isArray(data.matchups) &&
      meta &&
      typeof meta.cachedAt === "string"
  );
}
