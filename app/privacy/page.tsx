import type { Metadata } from "next";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for tamemj.com, published apps, downloadable resources, and support services operated by Tamem J.",
  keywords: [
    "privacy policy",
    "website privacy policy",
    "download privacy",
    "support portal privacy",
    "Tamem J privacy"
  ],
  alternates: {
    canonical: "/privacy/"
  },
  openGraph: buildOpenGraph(
    "Privacy Policy | Tamem J",
    "Privacy policy for tamemj.com, published apps, downloadable resources, and support services operated by Tamem J.",
    "/privacy/"
  ),
  twitter: buildTwitter(
    "Privacy Policy | Tamem J",
    "Privacy policy for tamemj.com, published apps, downloadable resources, and support services operated by Tamem J."
  )
};

const sections = [
  {
    title: "Introduction",
    body: [
      "This Privacy Policy explains how tamemj.com, downloadable resources, support services, and apps published by Tamem J handle information.",
      "Different services may have different data requirements. Service-specific behavior can be noted in the relevant app listing, download page, or support workflow when applicable."
    ]
  },
  {
    title: "Data Collection",
    body: [
      "The site and related resources are designed to collect only the minimum data needed to provide core functionality.",
      "Depending on the service, this may include contact form submissions, support intake details, account information, locally stored preferences, or user-entered content stored in user-controlled tools."
    ]
  },
  {
    title: "Third Party Services (e.g. Google AdMob)",
    body: [
      "Some services may use third-party providers such as analytics, authentication, hosting, crash reporting, advertising, or payment services to improve reliability and operations.",
      "These providers may collect device identifiers, usage data, diagnostic information, or transaction-related metadata in accordance with their own privacy policies."
    ]
  },
  {
    title: "Payments and Purchases",
    body: [
      "Payments for apps, donations, or other services may be processed by third-party platforms such as Apple, PayPal, Buy Me a Coffee, or crypto networks. Payment card details are not stored directly by Tamem J.",
      "Transaction status, purchase state, or entitlement information may be used only to deliver the requested feature, product, or service."
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
    dateModified: "2026-03-12T00:00:00.000Z",
    description:
      "Privacy policy for tamemj.com, downloadable resources, support services, and published apps operated by Tamem J."
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
              Last updated: March 12, 2026. This template is intentionally structured so it can
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
