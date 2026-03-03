import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { buildOpenGraph, buildTwitter, toAbsoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
  keywords: [
    "IT troubleshooting guides",
    "enterprise IT support",
    "corporate tech fixes",
    "Microsoft 365 troubleshooting",
    "PowerShell scripts",
    "IT knowledge base",
    "helpdesk resources",
    "sysadmin tools"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: buildOpenGraph(siteConfig.title, siteConfig.description, "/"),
  twitter: buildTwitter(siteConfig.title, siteConfig.description)
};

const stats = [
  { value: "210+", label: "Troubleshooting Guides" },
  { value: "11", label: "IT Categories" },
  { value: "76+", label: "Curated Downloads" },
  { value: "Free", label: "No Sign-Up Required" }
];

const quickLinks = [
  {
    href: "/corporate-tech-fixes",
    title: "Corporate Tech Fixes",
    description: "Enterprise-safe troubleshooting guides for Microsoft 365, Intune, Entra, Jamf, and more.",
    eyebrow: "Knowledge Base"
  },
  {
    href: "/support/kb",
    title: "KB Articles",
    description: "Searchable knowledge base articles with symptoms, causes, and step-by-step remediations.",
    eyebrow: "Support Portal"
  },
  {
    href: "/downloads",
    title: "Software Downloads",
    description: "Curated, verified download links for productivity, developer, and IT tools.",
    eyebrow: "Downloads"
  },
  {
    href: "/pc-build-guides",
    title: "PC Build Guides",
    description: "Hardware recommendations and build configurations for workstation and gaming setups.",
    eyebrow: "Hardware"
  }
];

export default function HomePage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: quickLinks.map((link, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: link.title,
        url: toAbsoluteUrl(link.href)
      }))
    }
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14 lg:pt-20">
        <div className="page-shell">
          <div className="surface-card-strong overflow-hidden p-6 sm:p-8 lg:p-12">
            <div className="max-w-3xl">
              <span className="eyebrow">IT Knowledge Base & Tools</span>
              <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Enterprise IT Troubleshooting Guides
              </h1>
              <p className="mt-4 text-balance text-lg text-slate-700 dark:text-slate-300 sm:text-xl">
                {siteConfig.tagline}
              </p>
              <p className="mt-6 max-w-xl text-base sm:text-lg">
                Step-by-step fixes for Microsoft 365, Intune, Entra ID, Jamf, Okta, and
                endpoint management — built for helpdesk engineers and sysadmins.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/corporate-tech-fixes" className="btn-primary">
                  Browse Tech Fixes
                </Link>
                <Link href="/support/kb" className="btn-secondary">
                  Search KB Articles
                </Link>
                <Link href="/downloads" className="btn-secondary">
                  Downloads
                </Link>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="surface-card p-4 text-center">
                  <p className="text-2xl font-bold text-accent sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-4 sm:pt-6">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Explore"
            title="Everything in one place"
            description="Troubleshooting guides, knowledge base articles, curated downloads, and hardware build guides."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="surface-card group p-6 transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                  {link.eyebrow}
                </p>
                <h2 className="mt-2 text-lg font-semibold group-hover:text-accent">
                  {link.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell pt-2">
        <div className="page-shell">
          <div className="surface-card p-6 sm:p-8">
            <SectionHeading
              eyebrow="About"
              title="Built for IT professionals"
              description="A centralized resource hub for enterprise IT troubleshooting, maintained by an IT Solutions Engineer."
            />
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm sm:text-base">
                Every guide is written from real-world support experience with enterprise
                environments — Microsoft 365, endpoint management, identity providers, and
                beyond.
              </p>
              <Link href="/contact" className="btn-secondary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
    </>
  );
}
