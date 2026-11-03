import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FantasyManagerProfileView } from "@/components/fantasy/fantasy-manager-profile";
import { getFantasyManagerProfileBySlug, getFantasyManagerProfileSlugs } from "@/data/fantasy-league";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";

interface FantasyManagerProfilePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getFantasyManagerProfileSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: FantasyManagerProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getFantasyManagerProfileBySlug(slug);

  if (!profile) {
    return { title: "Manager Profile Not Found" };
  }

  const pagePath = `/fantasy/managers/${profile.member.slug}/`;
  const latestTendency = profile.draftTendencies[0];

  return {
    title: `${profile.member.managerName} Draft Profile | ${profile.team.teamName}`,
    description:
      latestTendency?.summary ??
      `${profile.member.managerName} fantasy football manager profile with draft history, trades, titles, and season-by-season archive notes.`,
    keywords: [
      profile.member.managerName,
      profile.team.teamName,
      `${profile.member.managerName} fantasy draft profile`,
      `${profile.team.teamName} fantasy history`,
      "fantasy football manager profile",
      "fantasy football draft history",
      "fantasy football trade history"
    ],
    alternates: {
      canonical: pagePath
    },
    robots: buildRobotsIndexRule(pagePath),
    openGraph: buildOpenGraph(
      `${profile.member.managerName} Draft Profile | ${profile.team.teamName}`,
      latestTendency?.summary ?? `${profile.member.managerName}'s archived fantasy football draft and trade profile.`,
      pagePath,
      "article"
    ),
    twitter: buildTwitter(
      `${profile.member.managerName} Draft Profile | ${profile.team.teamName}`,
      latestTendency?.summary ?? `${profile.member.managerName}'s archived fantasy football draft and trade profile.`
    )
  };
}

export default async function FantasyManagerProfilePage({ params }: FantasyManagerProfilePageProps) {
  const { slug } = await params;
  const profile = getFantasyManagerProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  const pagePath = `/fantasy/managers/${profile.member.slug}/`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Fantasy Football Hub", path: "/fantasy/" },
    { name: profile.member.managerName, path: pagePath }
  ]);

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${profile.member.managerName} Draft Profile`,
    url: toAbsoluteUrl(pagePath),
    description: profile.member.bio,
    mainEntity: {
      "@type": "Person",
      name: profile.member.managerName,
      description: profile.member.bio,
      knowsAbout: ["Fantasy football", "Draft strategy", "League history"],
      memberOf: {
        "@type": "SportsOrganization",
        name: "New Uzbek Mafia Fantasy League"
      }
    }
  };

  return (
    <>
      <FantasyManagerProfileView profile={profile} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }} />
    </>
  );
}
