import type { Metadata } from "next";
import { FantasyLeagueHub } from "@/components/fantasy/fantasy-league-hub";
import { getFantasyLeague } from "@/data/fantasy-league";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { isLocalYahooOAuthAllowed } from "@/lib/fantasy-yahoo";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOpenGraph,
  buildTwitter
} from "@/lib/seo";

const pagePath = "/fantasy/";
const leagueData = getFantasyLeague();

export const metadata: Metadata = {
  title: `${leagueData.league.name} Fantasy Football Hub`,
  description:
    "Fantasy football league hub with league history, draft results, keeper planning, standings, champions, records, and team profiles.",
  keywords: [
    "fantasy football league history",
    "fantasy football draft board",
    "fantasy football keeper tool",
    "league history page",
    "fantasy football standings archive",
    "fantasy football record book",
    `${leagueData.league.name} fantasy league`
  ],
  alternates: {
    canonical: pagePath
  },
  robots: buildRobotsIndexRule(pagePath),
  openGraph: buildOpenGraph(
    `${leagueData.league.name} Fantasy Football Hub | Tamem J`,
    "League legacy dashboard with draft history, keepers, standings, records, and team profiles.",
    pagePath
  ),
  twitter: buildTwitter(
    `${leagueData.league.name} Fantasy Football Hub | Tamem J`,
    "League legacy dashboard with draft history, keepers, standings, records, and team profiles."
  )
};

export default function FantasyPage() {
  const showLocalYahooSetup = isLocalYahooOAuthAllowed();
  const hasYahooRefreshToken = Boolean(process.env.YAHOO_REFRESH_TOKEN?.trim());

  const collectionSchema = buildCollectionPageJsonLd(
    `${leagueData.league.name} Fantasy Football Hub`,
    "League overview, draft results, keeper planning, history, records, and team profiles.",
    pagePath,
    [
      { name: "Overview", path: `${pagePath}#overview` },
      { name: "Draft Results", path: `${pagePath}#draft-results` },
      { name: "Keepers", path: `${pagePath}#keepers` },
      { name: "League History", path: `${pagePath}#league-history` },
      { name: "Records", path: `${pagePath}#records` },
      { name: "Teams", path: `${pagePath}#teams` }
    ]
  );

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Fantasy Football Hub", path: pagePath }
  ]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${leagueData.league.name} teams`,
    numberOfItems: leagueData.teams.length,
    itemListElement: leagueData.teams.map((team, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: team.teamName
    }))
  };

  return (
    <>
      {showLocalYahooSetup ? (
        <section className="mx-auto mb-6 w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-sky-400/20 bg-slate-950/70 p-5 shadow-[0_18px_48px_rgba(2,6,23,0.35)] backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <span className="inline-flex rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">
                  Local Yahoo Setup
                </span>
                <h2 className="text-xl font-semibold text-slate-50">Connect Yahoo data for this fantasy hub</h2>
                <p className="max-w-3xl text-sm leading-6 text-slate-300">
                  Run the local OAuth flow to capture the refresh token and resolve the exact Yahoo league key for live standings,
                  matchups, and roster sync work.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 lg:items-end">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Status: <span className={hasYahooRefreshToken ? "text-emerald-300" : "text-amber-300"}>{hasYahooRefreshToken ? "Connected locally" : "Needs OAuth"}</span>
                </p>
                <a
                  href="/api/fantasy/yahoo/start/"
                  className="inline-flex items-center justify-center rounded-full border border-sky-300/30 bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  {hasYahooRefreshToken ? "Reconnect Yahoo" : "Connect Yahoo"}
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}
      <FantasyLeagueHub data={leagueData} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </>
  );
}
