import type { Metadata } from "next";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for apps and products developed by Tamem J, including EverAfter Planner, GigTracker, and Fantasy Football OBS Overlay.",
  keywords: [
    "privacy policy",
    "iOS app privacy",
    "software product privacy",
    "app data handling",
    "Tamem J privacy",
    "GigTracker privacy policy",
    "EverAfter Planner privacy policy",
    "Fantasy Football OBS Overlay privacy policy"
  ],
  alternates: {
    canonical: "/privacy/"
  },
  robots: buildRobotsIndexRule("/privacy/"),
  openGraph: buildOpenGraph(
    "Privacy Policy | Tamem J",
    "Privacy policy for apps and products developed by Tamem J, including EverAfter Planner, GigTracker, and Fantasy Football OBS Overlay.",
    "/privacy/"
  ),
  twitter: buildTwitter(
    "Privacy Policy | Tamem J",
    "Privacy policy for apps and products developed by Tamem J, including EverAfter Planner, GigTracker, and Fantasy Football OBS Overlay."
  )
};

const sections = [
  {
    title: "Introduction",
    body: [
      "This Privacy Policy explains how apps published by Tamem J handle information. The goal is to provide clear, simple disclosure for App Store users.",
      "Different apps may have different data requirements. App-specific behavior can be noted in the app listing or in-app disclosures when applicable."
    ]
  },
  {
    title: "Apps Covered by This Policy",
    body: [
      "This policy applies to apps and products developed and published by Tamem J, including EverAfter Planner, GigTracker, Fantasy Football OBS Overlay, and future releases under the same publisher identity unless a separate product-specific policy is provided.",
      "EverAfter Planner is designed for wedding planning workflows such as budgets, checklists, guest lists, RSVPs, vendors, and reminders. GigTracker is designed for mileage tracking, trip organization, earnings review, expense logging, invoice drafting, reporting, and related business workflows. Fantasy Football OBS Overlay is designed as a local-first broadcast overlay tool for OBS with provider integrations, setup tooling, admin controls, and stream-ready overlay routes."
    ]
  },
  {
    title: "Data Collection",
    body: [
      "Apps are designed to collect only the minimum data needed to provide core functionality.",
      "Depending on the app or product, this may include user-entered content such as tasks, budgets, planning details, guest RSVP information, trip logs, earnings records, expense entries, invoice details, overlay settings, provider configuration details, and related notes.",
      "For RSVP features, collected data may include guest names, phone numbers, RSVP status, and related event notes submitted by users.",
      "For GigTracker features, collected data may include trip details, mileage records, earnings information, expense records, invoice information, and business workflow notes entered or reviewed by the user.",
      "For Fantasy Football OBS Overlay features, locally stored configuration may include league identifiers, provider settings, overlay scene settings, runtime preferences, cached matchup data, and optional integration details required to connect Yahoo, ESPN, Sleeper, OBS WebSocket, or webhook destinations."
    ]
  },
  {
    title: "EverAfter Planner RSVP Data Processing",
    body: [
      "RSVP submissions are processed through a Cloudflare-hosted RSVP backend to support invite and response workflows.",
      "This Cloudflare-hosted RSVP processing may handle guest RSVP data, including names and phone numbers, for the purpose of delivering RSVP functionality."
    ]
  },
  {
    title: "GigTracker Device Access and Business Data",
    body: [
      "If GigTracker uses features such as automatic trip tracking, receipt capture, notifications, widgets, or Apple Watch support, the app may request access to device capabilities needed to provide those features. This can include permissions such as location, notifications, camera, photos, or motion-related access, depending on the specific feature being used.",
      "Business data entered into GigTracker may include mileage history, trip classification, earnings, expenses, invoice details, and workflow follow-up items. Access requests are intended to support app functionality and are subject to user control through iOS settings."
    ]
  },
  {
    title: "Fantasy Football OBS Overlay Local Data and Integrations",
    body: [
      "Fantasy Football OBS Overlay is designed as a local-first product. Configuration, cache data, event history, and setup details may be stored locally on the host machine running the tool.",
      "If Yahoo authentication or other provider integrations are configured, the product may handle tokens, league identifiers, or related provider credentials needed to fetch fantasy data. Depending on configuration, these may be stored in local settings, environment variables, or operating-system-backed secure storage options described by the product.",
      "Optional integrations such as OBS WebSocket connections, Discord or Slack webhooks, and exported diagnostics are intended to support broadcast workflows and are controlled by the product operator."
    ]
  },
  {
    title: "Third Party Services (e.g. Google AdMob)",
    body: [
      "Some apps may use third-party services such as analytics, crash reporting, or advertising providers (for example, Google AdMob) to improve reliability and app performance.",
      "These providers may collect device identifiers, usage data, or diagnostic information in accordance with their own privacy policies."
    ]
  },
  {
    title: "In-App Purchases",
    body: [
      "In-app purchases are processed by Apple through the App Store. Payment details are not received or stored by Tamem J.",
      "Purchase status and entitlement information may be used within the app to unlock premium features."
    ]
  },
  {
    title: "Contact Information",
    body: [
      `For privacy-related questions, contact ${siteConfig.supportEmail} or use the contact page on tamemj.com.`,
      "Requests are reviewed and answered as promptly as possible."
    ]
  },
  {
    title: "Changes to Policy",
    body: [
      "This policy may be updated from time to time to reflect app changes, legal requirements, or service provider updates.",
      "The latest version will always be published on this page."
    ]
  }
];

export default function PrivacyPage() {
  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    url: toAbsoluteUrl("/privacy/"),
    description: "Privacy policy for apps and products developed by Tamem J, including EverAfter Planner, GigTracker, and Fantasy Football OBS Overlay."
  };
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy/" }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-4xl">
          <div className="surface-card-strong p-6 sm:p-8 lg:p-10">
            <p className="eyebrow">Legal</p>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Privacy Policy</h1>
            <p className="mt-4 text-sm sm:text-base">
              Last updated: April 14, 2026. This template is intentionally structured so it can
              be updated quickly as apps or services change.
            </p>

            <div className="mt-8 space-y-8">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-lg font-semibold sm:text-xl">{section.title}</h2>
                  <div className="mt-3 space-y-3">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-sm sm:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
