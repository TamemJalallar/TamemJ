import type { Metadata } from "next";
import { buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for iOS apps developed by Tamem J.",
  keywords: ["privacy policy", "iOS app privacy", "app data handling", "Tamem J privacy"],
  alternates: {
    canonical: "/privacy/"
  },
  openGraph: buildOpenGraph(
    "Privacy Policy | Tamem J",
    "Privacy policy for iOS apps developed by Tamem J.",
    "/privacy/"
  ),
  twitter: buildTwitter("Privacy Policy | Tamem J", "Privacy policy for iOS apps developed by Tamem J.")
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
    title: "Data Collection",
    body: [
      "Apps are designed to collect only the minimum data needed to provide core functionality.",
      "Depending on the app, this may include user-entered content (such as tasks, budgets, or planning details) stored locally on the device or in user-controlled cloud storage features."
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
    description: "Privacy policy for iOS apps developed by Tamem J."
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-4xl">
          <div className="surface-card-strong p-6 sm:p-8 lg:p-10">
            <p className="eyebrow">Legal</p>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Privacy Policy</h1>
            <p className="mt-4 text-sm sm:text-base">
              Last updated: February 23, 2026. This template is intentionally structured so it can
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
    </>
  );
}
