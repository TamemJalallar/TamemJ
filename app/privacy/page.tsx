import type { Metadata } from "next";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for tamemj.com and apps developed by Tamem J, including planning, productivity, and support-related applications such as Wedding Planner.",
  keywords: [
    "privacy policy",
    "website privacy policy",
    "app privacy policy",
    "wedding planner app privacy policy",
    "download privacy",
    "support portal privacy",
    "Tamem J privacy"
  ],
  alternates: {
    canonical: "/privacy/"
  },
  openGraph: buildOpenGraph(
    "Privacy Policy | Tamem J",
    "Privacy policy for tamemj.com and apps developed by Tamem J, including planning, productivity, and support-related applications such as Wedding Planner.",
    "/privacy/"
  ),
  twitter: buildTwitter(
    "Privacy Policy | Tamem J",
    "Privacy policy for tamemj.com and apps developed by Tamem J, including planning, productivity, and support-related applications such as Wedding Planner."
  )
};

const sections = [
  {
    title: "Introduction",
    body: [
      "This Privacy Policy explains how tamemj.com, downloadable resources, support services, and apps developed and published by Tamem J handle information.",
      "It applies to current and future apps released by Tamem J unless an app includes a separate product-specific privacy notice. This includes planning, productivity, and utility apps, including apps such as Wedding Planner."
    ]
  },
  {
    title: "Apps Covered by This Policy",
    body: [
      "This policy covers apps developed by Tamem J for iPhone, iPad, or related Apple platforms, as well as connected website features used for support, privacy, and contact workflows.",
      "If an app is released under a distinct brand or includes unique data practices, its App Store listing or in-app disclosures may provide additional details that supplement this policy."
    ]
  },
  {
    title: "Information You Provide in Apps",
    body: [
      "Apps may allow you to enter or manage information needed for the app's core purpose. For a planning app such as Wedding Planner, this can include event details, schedules, task lists, budget items, guest information, notes, vendor details, and reminder preferences.",
      "This information is used only to provide the requested app functionality. Tamem J does not sell personal data entered into the app."
    ]
  },
  {
    title: "Device Permissions and Sensitive Access",
    body: [
      "Some apps may request access to device features such as notifications, photos, files, calendar data, camera access, or contacts. Access is requested only when needed for a user-initiated feature.",
      "For example, a planning app may request notification access for reminders, photo or file access for attachments or inspiration boards, or calendar access to help users export event milestones. If you deny permission, the related feature may not work, but the rest of the app should continue to function where possible."
    ]
  },
  {
    title: "Storage, Sync, and Backups",
    body: [
      "App data may be stored locally on your device, in Apple-provided storage tied to your account such as iCloud, or in another user-controlled storage context depending on the feature set of the app.",
      "If cloud sync or backup features are offered, synced data is used to keep your information available across your own devices and is not used for unrelated advertising or data resale."
    ]
  },
  {
    title: "Analytics, Diagnostics, and Third-Party Services",
    body: [
      "Some apps or website features may use third-party providers for analytics, crash reporting, authentication, hosting, advertising, or payment processing. These providers may receive limited technical data such as device type, app version, usage diagnostics, or transaction-related metadata.",
      "Where third-party services are used, they operate under their own privacy terms. Tamem J uses these services to improve reliability, support functionality, and app operations, not to sell your private in-app content."
    ]
  },
  {
    title: "Purchases, Subscriptions, and Donations",
    body: [
      "Payments for apps, subscriptions, donations, or other services may be processed by Apple, PayPal, Buy Me a Coffee, crypto networks, or other third-party platforms. Payment card or wallet credentials are not stored directly by Tamem J.",
      "Purchase status, entitlement state, or subscription information may be used only to unlock features, confirm access, process support requests, or maintain the service you requested."
    ]
  },
  {
    title: "Data Retention and Deletion",
    body: [
      "Information is retained only as long as needed to provide the app or service, comply with legal obligations, resolve disputes, or maintain basic operational records.",
      "If an app stores information only on your device or in your own Apple account, you can typically delete that data by removing it within the app, disabling sync, or deleting the app and its associated local data. For support or account-related deletion requests, contact the support email listed below."
    ]
  },
  {
    title: "Children's Privacy",
    body: [
      "Apps developed by Tamem J are not intended to knowingly collect personal information from children in violation of applicable law.",
      "If you believe a child has provided personal information through an app or website workflow, contact Tamem J so the issue can be reviewed and addressed."
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
    title: "Changes to This Policy",
    body: [
      "This policy may be updated from time to time to reflect new app releases, feature changes, legal requirements, or service provider updates.",
      "The latest version will always be published on this page and should be treated as the current privacy notice for apps and services covered here."
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
      "Privacy policy for tamemj.com and apps developed by Tamem J, including planning, productivity, and support-related applications such as Wedding Planner."
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
