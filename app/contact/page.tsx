import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { buildBreadcrumbJsonLd, buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Tamem J for enterprise IT partnerships, support questions, affiliate opportunities, or general inquiries.",
  keywords: [
    "contact tamemj",
    "enterprise it contact",
    "it partnership inquiries",
    "affiliate inquiries",
    "Tamem J contact",
    "support contact"
  ],
  alternates: {
    canonical: "/contact/"
  },
  openGraph: buildOpenGraph(
    "Contact | Tamem J",
    "Contact Tamem J for enterprise IT partnerships, support questions, affiliate opportunities, or general inquiries.",
    "/contact/"
  ),
  twitter: buildTwitter(
    "Contact | Tamem J",
    "Contact Tamem J for enterprise IT partnerships, support questions, affiliate opportunities, or general inquiries."
  )
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Tamem J",
    url: toAbsoluteUrl("/contact/"),
    description:
      "Contact Tamem J for enterprise IT partnerships, support questions, affiliate opportunities, or general inquiries."
  };
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact/" }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="surface-card-strong p-6 sm:p-8">
              <p className="eyebrow">Contact</p>
              <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Get in touch</h1>
              <p className="mt-4 text-sm sm:text-base">
                For enterprise IT questions, partnerships, affiliate opportunities, or general
                inquiries, send a message below or email directly.
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-line bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">General Email</p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="mt-1 inline-block text-sm text-slate-700 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
                  >
                    {siteConfig.email}
                  </a>
                </div>
                <div className="rounded-xl border border-line bg-white p-4">
                  <p className="text-sm font-medium text-slate-900">Support and Documentation</p>
                  <p className="mt-1 text-sm">
                    For faster troubleshooting help, use the <a href="/support" className="underline">Support page</a>{" "}
                    and include the affected platform, product, or workflow.
                  </p>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
