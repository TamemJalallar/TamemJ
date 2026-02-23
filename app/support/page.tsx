import type { Metadata } from "next";
import { SupportForm } from "@/components/support-form";
import { getApps } from "@/lib/apps";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: "Support page for iOS apps by Tamem J, including FAQ and contact instructions.",
  alternates: {
    canonical: "/support/"
  }
};

const faqs = [
  {
    question: "How do I restore a purchase?",
    answer:
      "Open the app settings and look for Restore Purchases. If the issue continues, send a support request with your app name and device iOS version."
  },
  {
    question: "Why is data not syncing across devices?",
    answer:
      "Make sure both devices use the same Apple ID and have iCloud enabled (if the app supports sync). Restarting the app can refresh sync status."
  },
  {
    question: "How do I report a bug or suggest a feature?",
    answer:
      "Use the support form below and include steps to reproduce the issue. Feature suggestions are welcome and help guide future updates."
  }
];

export default function SupportPage() {
  const apps = getApps();
  const hasApps = apps.length > 0;

  return (
    <section className="section-shell pt-10 sm:pt-14">
      <div className="page-shell">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="space-y-6">
            <div className="surface-card-strong p-6 sm:p-8">
              <p className="eyebrow">Support</p>
              <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">App Support</h1>
              <p className="mt-4 text-sm sm:text-base">
                {hasApps
                  ? "Need help with an app? Select the app, describe the issue, and send a support email. This page is designed to stay lightweight and easy to maintain."
                  : "No apps are published yet. This support page is ready and will become the user support hub as soon as the first app launches."}
              </p>
              <div className="mt-6 rounded-xl border border-line bg-slate-50 p-4 text-sm">
                <p className="font-medium text-slate-900">Support Email</p>
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="mt-1 inline-block text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                >
                  {siteConfig.supportEmail}
                </a>
              </div>
              <div className="mt-6 rounded-xl border border-line bg-white p-4">
                <p className="text-sm font-medium text-slate-900">Simple Support Instructions</p>
                <ol className="mt-3 space-y-2 text-sm text-slate-600">
                  {hasApps ? (
                    <>
                      <li>1. Choose the app from the dropdown.</li>
                      <li>2. Add a short subject and what happened.</li>
                      <li>3. Include device model, iOS version, and app version if possible.</li>
                    </>
                  ) : (
                    <>
                      <li>1. Use the contact email for general inquiries or launch updates.</li>
                      <li>2. App-specific support options will appear here after release.</li>
                    </>
                  )}
                </ol>
              </div>
            </div>

            <div className="surface-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold sm:text-xl">FAQ</h2>
              <div className="mt-4 space-y-3">
                {faqs.map((item) => (
                  <details key={item.question} className="rounded-xl border border-line bg-white p-4">
                    <summary className="cursor-pointer list-none pr-6 text-sm font-medium text-slate-900">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-sm">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {hasApps ? (
            <SupportForm apps={apps} />
          ) : (
            <div className="surface-card-strong p-6 sm:p-8">
              <h2 className="text-lg font-semibold sm:text-xl">Support Form Coming Soon</h2>
              <p className="mt-2 text-sm sm:text-base">
                Once an app is published, an app-specific support form will appear here.
              </p>
              <a href="/contact" className="btn-secondary mt-6">
                Contact
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
