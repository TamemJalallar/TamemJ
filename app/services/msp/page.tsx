import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { MspSectionNav } from "@/components/msp/msp-section-nav";
import {
  buildBreadcrumbJsonLd,
  buildOpenGraph,
  buildTwitter,
  toAbsoluteUrl
} from "@/lib/seo";
import { siteConfig } from "@/lib/site";

function uniqueKeywords(keywords: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const keyword of keywords) {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(keyword.trim());
  }

  return result;
}

type ListCard = {
  title: string;
  description: string;
  points: string[];
};

type SimplePoint = {
  title: string;
  description: string;
};

type PlatformGroup = {
  title: string;
  description: string;
  items: string[];
};

const pageTitle = "Managed IT & MSP Services";
const pageDescription =
  "Retained IT systems administration and support across Microsoft 365, Google Workspace, macOS, Windows, Linux, identity, collaboration, and business systems.";
const hourlyRatePlaceholder = "[Insert hourly rate]";
const inquirySubject = encodeURIComponent("Managed IT Retainer Inquiry");
const inquiryMailto = `mailto:${siteConfig.email}?subject=${inquirySubject}`;

const sectionNavItems = [
  { id: "service-areas", label: "Service Areas" },
  { id: "platforms", label: "Platforms" },
  { id: "retainer-model", label: "Retainer Model" },
  { id: "project-work", label: "Project Work" },
  { id: "why-work-with-me", label: "Why Me" },
  { id: "ideal-clients", label: "Ideal Clients" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" }
] as const;

const heroHighlights = [
  "Retained monthly support for administration, advisory work, and systems improvement",
  "Cross-platform coverage across Microsoft, Google, Apple, Windows, Linux, and cloud business tools",
  "Security-minded changes, cleaner documentation, and practical process standardization",
  "A technical partner who can support today's environment while continuing to expand platform coverage"
] as const;

const serviceAreas: ListCard[] = [
  {
    title: "Microsoft 365 & SharePoint Administration",
    description:
      "Steady tenant administration, collaboration platform support, and structure that holds up as teams grow.",
    points: [
      "Microsoft 365 tenant administration, licensing, permissions, and policy coordination",
      "SharePoint site architecture, library cleanup, governance, and day-to-day support",
      "Teams, OneDrive, and Exchange Online administration tied to real operational workflows"
    ]
  },
  {
    title: "Google Workspace Administration",
    description:
      "Support for organizations that rely on Google for email, files, identity, and collaboration.",
    points: [
      "Google Admin configuration, user lifecycle support, and permission hygiene",
      "Gmail, Drive, Shared Drives, groups, and collaboration setup",
      "Operational cleanup, standards, and mixed-environment support alongside Microsoft platforms"
    ]
  },
  {
    title: "macOS, Windows, and Endpoint Support",
    description:
      "Reliable endpoint administration for mixed fleets, user support, and policy-driven device management.",
    points: [
      "macOS and Windows support, troubleshooting, and standards alignment",
      "Endpoint configuration, enrollment readiness, and management platform coordination",
      "Device lifecycle support for onboarding, offboarding, and security-minded administration"
    ]
  },
  {
    title: "Linux Systems & Infrastructure Support",
    description:
      "Practical Linux support for internal tools, servers, lightweight infrastructure, and operational reliability.",
    points: [
      "Linux server administration, access control, and baseline hardening support",
      "Service health checks, update planning, and maintenance coordination",
      "Documentation and scripting support for repeatable administration tasks"
    ]
  },
  {
    title: "Identity & Access Management",
    description:
      "Access models that support security, clarity, and smoother onboarding across business systems.",
    points: [
      "User lifecycle design for onboarding, offboarding, and role changes",
      "Group-based access, MFA, SSO, and least-privilege administration",
      "Entra ID, Okta, and other identity platforms where the environment requires them"
    ]
  },
  {
    title: "Collaboration & File Platform Administration",
    description:
      "Day-to-day support for the platforms teams depend on to communicate, share files, and stay productive.",
    points: [
      "Teams, SharePoint, OneDrive, Google Drive, Shared Drives, and related governance",
      "Permissions cleanup, sharing controls, file structure, and collaboration design",
      "Support for mixed-platform environments where systems overlap instead of living in one stack"
    ]
  },
  {
    title: "Automation & Workflow Optimization",
    description:
      "Small, useful automations that reduce repetitive work and improve operational consistency.",
    points: [
      "PowerShell, shell scripting, and lightweight workflow automation",
      "Task reduction for onboarding, reporting, file operations, and routine admin work",
      "Process improvement that favors maintainability over fragile one-off complexity"
    ]
  },
  {
    title: "Documentation, Standards & Operational Improvement",
    description:
      "Support that leaves the environment more understandable, supportable, and scalable over time.",
    points: [
      "Runbooks, SOPs, support notes, and system ownership documentation",
      "Standards for permissions, naming, structure, and operational handoffs",
      "Continuous cleanup that reduces firefighting and improves day-to-day support quality"
    ]
  }
];

const platformGroups: PlatformGroup[] = [
  {
    title: "Productivity & Collaboration",
    description: "Core business systems for email, files, meetings, and team coordination.",
    items: [
      "Microsoft 365",
      "SharePoint",
      "Teams",
      "OneDrive",
      "Exchange Online",
      "Google Workspace",
      "Gmail",
      "Google Drive",
      "Google Admin"
    ]
  },
  {
    title: "Identity & Access",
    description: "Authentication, role design, policy alignment, and access control across platforms.",
    items: [
      "Entra ID / Azure AD",
      "Okta",
      "SSO",
      "MFA",
      "Conditional access planning",
      "User lifecycle management",
      "Role-based access",
      "Security groups"
    ]
  },
  {
    title: "Endpoints & Operating Systems",
    description: "Support for mixed device environments and the tools used to keep them manageable.",
    items: [
      "macOS",
      "Windows",
      "Linux",
      "Intune",
      "Jamf",
      "Kandji",
      "Endpoint hardening",
      "Device enrollment"
    ]
  },
  {
    title: "Automation & Business Systems",
    description: "Administration that connects SaaS tools, scripts, and operational workflows.",
    items: [
      "SaaS administration",
      "Business apps",
      "PowerShell",
      "Shell scripting",
      "Workflow automation",
      "Documentation systems",
      "Operational reporting",
      "Process standardization"
    ]
  }
];

const retainerSteps: SimplePoint[] = [
  {
    title: "Retain monthly capacity",
    description:
      "Clients retain a block of support, administration, and consulting hours each month so there is dependable time reserved for ongoing work."
  },
  {
    title: "Use hours where they matter most",
    description:
      "The retainer can be applied to day-to-day admin, support requests, systems cleanup, advisory guidance, and operational improvement."
  },
  {
    title: "Track time clearly",
    description:
      "Work is tracked against retained hours, giving clients a simple way to see where time is being used and what is driving value."
  },
  {
    title: "Extend or scope separately as needed",
    description:
      "Unused hours can roll over based on agreement terms, while larger initiatives or work beyond the retained block are handled separately."
  }
];

const separatelyBilledGroups: ListCard[] = [
  {
    title: "Migrations & Major Restructures",
    description:
      "Larger changes usually need their own scope, timeline, and risk planning rather than being absorbed into monthly support hours.",
    points: [
      "Tenant-to-tenant moves and major migrations",
      "Large SharePoint restructures or information architecture rebuilds",
      "Large Google Workspace reorganizations and file platform cleanup at scale"
    ]
  },
  {
    title: "Rollouts, Buildouts & Implementation Work",
    description:
      "Projects with deeper technical lift are typically quoted outside the retainer so they can be planned and delivered properly.",
    points: [
      "New environment buildouts and platform implementation work",
      "MDM rollouts, device management launches, and endpoint program changes",
      "Custom automation projects and scripting-heavy implementation work"
    ]
  },
  {
    title: "Advisory, Training & Special Engagements",
    description:
      "Some work is better treated as a discrete engagement when it requires focused time, special scheduling, or a different delivery format.",
    points: [
      "Major documentation overhauls and program-level cleanup efforts",
      "After-hours or emergency work that falls outside normal retained coverage",
      "Training sessions, workshops, and special project consulting"
    ]
  }
];

const valuePoints: SimplePoint[] = [
  {
    title: "Enterprise support mindset",
    description:
      "I approach environments with structure, change awareness, and an understanding that business systems need to stay stable while work keeps moving."
  },
  {
    title: "Cross-platform depth",
    description:
      "I am not limited to one vendor stack. I can support mixed Microsoft, Google, Apple, Windows, Linux, identity, and SaaS environments."
  },
  {
    title: "Security-aware administration",
    description:
      "Access, device settings, and collaboration controls are handled with a security-minded lens rather than convenience-only shortcuts."
  },
  {
    title: "Systems thinking",
    description:
      "I look at how tools connect across onboarding, permissions, devices, communication, and documentation instead of treating every issue in isolation."
  },
  {
    title: "Documentation that compounds value",
    description:
      "A good environment should become easier to support over time. I document decisions, repeatable steps, and standards so support quality improves."
  },
  {
    title: "Practical automation",
    description:
      "I use automation where it reduces friction and saves time, but I keep it maintainable so it remains useful after the initial implementation."
  },
  {
    title: "Continuous learning",
    description:
      "I keep expanding into adjacent tools and platforms so clients gain a partner who grows with their environment instead of staying narrowly fixed."
  }
];

const idealClientPoints = [
  "Small and midsize businesses that need reliable ongoing technical coverage without hiring a full internal IT team",
  "Creative agencies and client-service teams that depend on file platforms, collaboration tools, and quick operational turnaround",
  "Professional services firms that need dependable identity, documentation, and access management practices",
  "Growing companies that have outpaced ad hoc admin work and need cleaner systems ownership",
  "Organizations running mixed environments across Microsoft, Google, Apple, cloud tools, and business SaaS platforms"
] as const;

const commonScenarios = [
  "You need a steady technical partner for support, administration, and operational cleanup",
  "Your tools work, but permissions, file structure, onboarding, and standards need to mature",
  "You want someone who can support both end users and backend systems without siloed handoffs",
  "You need pragmatic help across multiple ecosystems instead of a single-platform specialist only",
  "You want systems improvements that reduce friction month after month, not just one-time fixes"
] as const;

const faqs = [
  {
    question: "What does the retainer usually cover?",
    answer:
      "The monthly retainer is meant for ongoing support, administration, consulting, and systems improvement work. That can include day-to-day platform administration, access changes, support escalations, documentation, workflow refinement, and advisory guidance across the client environment."
  },
  {
    question: "How are retained hours tracked?",
    answer:
      "Time is tracked against the retained monthly hours. For billing clarity, time is rounded up to the nearest whole hour. For example, 1.1 hours of work is billed as 2 hours."
  },
  {
    question: "Do unused hours roll over?",
    answer:
      "They can. Unused retained hours may roll over based on the terms of the agreement, which gives clients flexibility during lighter months while keeping the engagement predictable."
  },
  {
    question: "What happens when work goes beyond the retained hours?",
    answer:
      "Additional work beyond the standard retained hours is billed separately at a standard hourly rate. Separately scoped project work, such as migrations or major implementation efforts, is also billed outside the retainer."
  },
  {
    question: "Are you limited to Microsoft environments?",
    answer:
      "No. Microsoft 365 is one part of the picture, but I also support Google Workspace, macOS, Windows, Linux, identity platforms, endpoint management, SaaS administration, and broader operational systems work."
  }
];

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: uniqueKeywords([
    "managed IT services",
    "MSP services",
    "retained IT support",
    "fractional IT administration",
    "small business IT partner",
    "Microsoft 365 administration",
    "SharePoint administration",
    "Google Workspace administration",
    "macOS support",
    "Windows administration",
    "Linux systems support",
    "identity and access management",
    "endpoint management",
    "SaaS administration",
    "IT documentation",
    "workflow automation",
    "security minded systems administration",
    "Tamem J MSP services"
  ]),
  alternates: {
    canonical: "/services/msp/"
  },
  openGraph: buildOpenGraph(
    `${pageTitle} | ${siteConfig.name}`,
    pageDescription,
    "/services/msp/"
  ),
  twitter: buildTwitter(`${pageTitle} | ${siteConfig.name}`, pageDescription)
};

export default function ManagedServicesPage() {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Managed IT & MSP Services", path: "/services/msp/" }
  ]);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: toAbsoluteUrl("/services/msp/")
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: pageTitle,
    serviceType: "Managed IT services",
    description: pageDescription,
    provider: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.email
    },
    areaServed: {
      "@type": "Country",
      name: "United States"
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: toAbsoluteUrl("/contact/")
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14 lg:pt-20">
        <div className="page-shell">
          <div className="surface-card-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,116,144,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.10),transparent_34%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="eyebrow">Managed IT &amp; MSP Services</span>
                <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                  Retained systems administration for teams that need steady, senior-level IT support
                </h1>
                <p className="mt-4 max-w-3xl text-base sm:text-lg">
                  I provide retained IT systems administration, platform support, systems
                  improvement, and operational guidance across Microsoft, Google, Apple, Linux,
                  Windows, identity, collaboration, and related business environments.
                </p>
                <p className="mt-4 max-w-3xl text-sm sm:text-base">
                  The focus is simple: keep core systems stable, make them easier to operate, and
                  help your team work more cleanly across the tools your business actually uses.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/contact" className="btn-primary">
                    Start a Conversation
                  </Link>
                  <Link href="#retainer-model" className="btn-secondary">
                    View Retainer Model
                  </Link>
                </div>
              </div>

              <div className="surface-card p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  What Clients Retain
                </p>
                <div className="mt-4 space-y-3">
                  {heroHighlights.map((item) => (
                    <div key={item} className="flex gap-3">
                      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <MetricTile
                    title="Administration"
                    description="Tenant, endpoint, collaboration, and access support"
                  />
                  <MetricTile
                    title="Improvement"
                    description="Documentation, cleanup, standards, and automation"
                  />
                  <MetricTile
                    title="Coverage"
                    description="Microsoft, Google, Apple, Linux, Windows, and SaaS"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-6 sm:pb-8">
        <div className="page-shell">
          <MspSectionNav items={[...sectionNavItems]} />
        </div>
      </section>

      <section id="service-areas" className="section-shell scroll-mt-28 pt-2">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Service Areas"
            title="Ongoing support that covers core business systems, not just one vendor stack"
            description="These are the areas I can support inside a monthly retainer, with room to adapt to the tools and workflows already in use."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {serviceAreas.map((area, index) => (
              <ListCardItem
                key={area.title}
                index={index + 1}
                title={area.title}
                description={area.description}
                points={area.points}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="platforms" className="section-shell scroll-mt-28 pt-0">
        <div className="page-shell">
          <div className="surface-card p-6 sm:p-8">
            <SectionHeading
              eyebrow="Platform Expertise"
              title="Built for mixed environments and the realities of modern business tooling"
              description="I can support the platforms below directly and continue to expand coverage as the environment evolves."
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {platformGroups.map((group) => (
                <div
                  key={group.title}
                  className="rounded-3xl border border-line/80 bg-white/90 p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {group.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
                    {group.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-line/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="retainer-model" className="section-shell scroll-mt-28 pt-0">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Retainer Model"
            title="A clear monthly support model without locking the relationship into rigid packages"
            description="The retainer is designed to give clients dependable access to administration and consulting time while keeping billing expectations clear and professional."
          />

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {retainerSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="surface-card h-full p-5 sm:p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                      0{index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="surface-card-strong p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Billing Clarity
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Consultant-grade structure, explained plainly
              </h3>
              <div className="mt-5 space-y-4">
                <BulletLine text="Clients retain a block of support, administration, and consulting hours each month." />
                <BulletLine text="Work is tracked against retained hours as tasks, support, and advisory work are completed." />
                <BulletLine text="Time is rounded up to the nearest whole hour." />
                <BulletLine text="Example: 1.1 hours of work is billed as 2 hours." />
                <BulletLine text="Unused retained hours can roll over based on agreement terms." />
                <BulletLine text="Additional work beyond retained hours is billed at a standard hourly rate." />
                <BulletLine text="Separately scoped project work is billed outside the retainer." />
              </div>

              <div className="mt-6 rounded-2xl border border-line/80 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Standard hourly rate
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {hourlyRatePlaceholder}
                </p>
              </div>

              <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
                This model keeps recurring support predictable while making room for rollover
                flexibility and clean handling of work that extends beyond the standard retained
                block.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="project-work" className="section-shell scroll-mt-28 pt-0">
        <div className="page-shell">
          <div className="surface-card p-6 sm:p-8">
            <SectionHeading
              eyebrow="Separately Billed Services"
              title="Larger initiatives are usually scoped outside the monthly retainer"
              description="The retainer is best for ongoing support, administration, and advisory work. Broader initiatives are usually quoted separately so scope, change management, and delivery expectations stay clean."
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {separatelyBilledGroups.map((group, index) => (
                <ListCardItem
                  key={group.title}
                  index={index + 1}
                  title={group.title}
                  description={group.description}
                  points={group.points}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="why-work-with-me" className="section-shell scroll-mt-28 pt-0">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Why Work With Me"
            title="Support that blends technical depth, operational discipline, and practical communication"
            description="The value is not only in resolving issues. It is in improving how the environment is administered, documented, and supported over time."
          />

          <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="surface-card-strong p-6 sm:p-8">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                A technical partner who can support both people and systems
              </h3>
              <p className="mt-4 text-sm sm:text-base">
                I bring an enterprise support mindset to smaller and growing organizations: clear
                communication, disciplined administration, good documentation, security-aware
                decisions, and systems thinking that looks beyond the immediate ticket.
              </p>
              <p className="mt-4 text-sm sm:text-base">
                That means fewer disconnected fixes, less avoidable friction, and a cleaner
                operational foundation as the business grows. It also means working across the
                platforms already in place instead of trying to force every client into a single
                tool ecosystem.
              </p>

              <div className="mt-6 rounded-3xl border border-line/80 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-900/70">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  A documentation-first operating style
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  If you want a feel for how I approach structured troubleshooting and operational
                  artifacts, browse the{" "}
                  <Link
                    href="/corporate-tech-fixes"
                    className="font-semibold text-accent hover:underline"
                  >
                    Corporate Tech Fixes
                  </Link>{" "}
                  library and the{" "}
                  <Link href="/downloads" className="font-semibold text-accent hover:underline">
                    Downloads
                  </Link>{" "}
                  section on this site.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {valuePoints.map((point) => (
                <div key={point.title} className="surface-card p-5">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {point.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ideal-clients" className="section-shell scroll-mt-28 pt-0">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Ideal Clients"
            title="A strong fit for organizations that need reliable systems support without overbuilding internal IT"
            description="This service works best when there is real operational complexity, but not necessarily a full internal team dedicated to every platform and process."
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="surface-card p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Best-fit organizations
              </h3>
              <div className="mt-5 space-y-4">
                {idealClientPoints.map((point) => (
                  <BulletLine key={point} text={point} />
                ))}
              </div>
            </div>

            <div className="surface-card p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Common situations
              </h3>
              <div className="mt-5 space-y-4">
                {commonScenarios.map((point) => (
                  <BulletLine key={point} text={point} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section-shell scroll-mt-28 pt-0">
        <div className="page-shell">
          <div className="surface-card p-6 sm:p-8">
            <SectionHeading
              eyebrow="FAQ"
              title="A few practical questions clients usually ask"
              description="Short answers to the engagement details that matter most before starting a retained relationship."
            />

            <div className="mt-8 space-y-3">
              {faqs.map((item, index) => (
                <details
                  key={item.question}
                  className="rounded-2xl border border-line/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/70"
                  open={index === 0}
                >
                  <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-slate-900 dark:text-slate-100">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section-shell scroll-mt-28 pt-0">
        <div className="page-shell">
          <div className="relative overflow-hidden rounded-[2rem] border border-line/70 bg-slate-900 p-6 shadow-card dark:bg-slate-100 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_36%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,116,144,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.10),transparent_36%)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200 dark:text-sky-700">
                  Retained Services Inquiries
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white dark:text-slate-900 sm:text-4xl">
                  Ready for a steadier IT operating partner?
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-200 dark:text-slate-700 sm:text-base">
                  If you need retained administration, support, and systems improvement across
                  Microsoft, Google, Apple, Linux, Windows, identity, and core business platforms,
                  let's talk through your environment and where ongoing support would add the most
                  value.
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300 dark:text-slate-700">
                  The best starting point is a short conversation about your current stack, the
                  support load you need covered, and whether the work fits a monthly retainer,
                  separate project scope, or a blend of both.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  Request Retainer Availability
                </Link>
                <a
                  href={inquiryMailto}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 dark:border-slate-300 dark:text-slate-900 dark:hover:bg-slate-900/10"
                >
                  Email Directly
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

function ListCardItem({
  description,
  index,
  points,
  title
}: {
  description: string;
  index: number;
  points: string[];
  title: string;
}) {
  return (
    <article className="surface-card h-full p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            0{index}
          </p>
          <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      <ul className="mt-5 space-y-3">
        {points.map((point) => (
          <li key={point} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span className="text-sm leading-6 text-slate-600 dark:text-slate-300">{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function MetricTile({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-line/80 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/80">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
      <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}

function BulletLine({ text }: { text: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}
