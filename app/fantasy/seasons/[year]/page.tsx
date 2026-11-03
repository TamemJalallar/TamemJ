import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FantasySeasonRecapView } from "@/components/fantasy/fantasy-season-recap";
import { getFantasySeasonAnalyticsByYear } from "@/data/fantasy-season-analytics";
import {
  getFantasyLeague,
  getFantasySeasonRecapByYear,
  getFantasySeasonRecapYears
} from "@/data/fantasy-league";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

interface FantasySeasonRecapPageProps {
  params: Promise<{ year: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ year: string }>> {
  return getFantasySeasonRecapYears().map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: FantasySeasonRecapPageProps): Promise<Metadata> {
  const { year } = await params;
  const recap = getFantasySeasonRecapByYear(Number(year));

  if (!recap) {
    return { title: "Season Recap Not Found" };
  }

  const league = getFantasyLeague();
  const championTeam = league.teams.find((team) => team.id === recap.season.summary.championTeamId);
  const pagePath = `/fantasy/seasons/${recap.season.year}/`;
  const description = `${recap.season.year} ${league.league.name} season recap with standings, trades, draft steals, reaches, awards, and records.`;

  return {
    title: `${recap.season.year} Season Recap | ${league.league.name}`,
    description,
    keywords: [
      `${league.league.name} ${recap.season.year}`,
      `${recap.season.year} fantasy football season recap`,
      `${recap.season.year} fantasy football standings`,
      `${recap.season.year} fantasy football trades`,
      championTeam?.teamName ? `${championTeam.teamName} ${recap.season.year}` : `${recap.season.year} champion`
    ].filter(Boolean) as string[],
    alternates: {
      canonical: pagePath
    },
    robots: buildRobotsIndexRule(pagePath),
    openGraph: buildOpenGraph(`${recap.season.year} Season Recap | ${league.league.name}`, description, pagePath, "article"),
    twitter: buildTwitter(`${recap.season.year} Season Recap | ${league.league.name}`, description)
  };
}

export default async function FantasySeasonRecapPage({ params }: FantasySeasonRecapPageProps) {
  const { year } = await params;
  const yearNumber = Number(year);
  const recap = getFantasySeasonRecapByYear(yearNumber);
  const analytics = getFantasySeasonAnalyticsByYear(yearNumber);

  if (!recap || !analytics) {
    notFound();
  }

  const data = getFantasyLeague();
  const pagePath = `/fantasy/seasons/${recap.season.year}/`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Fantasy Football Hub", path: "/fantasy/" },
    { name: `${recap.season.year} Season Recap`, path: pagePath }
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${recap.season.year} ${data.league.name} season recap`,
    url: toAbsoluteUrl(pagePath),
    description: `${recap.season.year} league recap with standings, playoff finish, draft value, trade activity, awards, and records.`,
    about: {
      "@type": "SportsOrganization",
      name: data.league.name
    },
    author: {
      "@type": "Person",
      name: "Tamem J"
    }
  };

  return (
    <>
      <FantasySeasonRecapView data={data} recap={recap} analytics={analytics} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </>
  );
}
