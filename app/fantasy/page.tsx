import type { Metadata } from "next";
import { FantasyLeagueHub } from "@/components/fantasy/fantasy-league-hub";
import { getFantasyLeague } from "@/data/fantasy-league";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
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
      <FantasyLeagueHub data={leagueData} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </>
  );
}
