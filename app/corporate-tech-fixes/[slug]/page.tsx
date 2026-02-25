import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FixGuide } from "@/components/corporate-fixes/fix-guide";
import { EnterpriseSupportBanner } from "@/components/corporate-fixes/fix-shared";
import { getCorporateFixBySlug, getCorporateFixes } from "@/lib/corporate-fixes.registry";
import { siteConfig } from "@/lib/site";

interface CorporateFixPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getCorporateFixes().map((fix) => ({ slug: fix.slug }));
}

export async function generateMetadata({
  params
}: CorporateFixPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fix = getCorporateFixBySlug(slug);

  if (!fix) {
    return {
      title: "Fix Not Found"
    };
  }

  return {
    title: `${fix.title} | Corporate Tech Fixes`,
    description: fix.description,
    keywords: [...fix.tags, fix.category, "corporate IT", "enterprise support"],
    alternates: {
      canonical: `/corporate-tech-fixes/${fix.slug}/`
    },
    openGraph: {
      title: `${fix.title} | Corporate Tech Fixes`,
      description: fix.description,
      url: `${siteConfig.url}/corporate-tech-fixes/${fix.slug}/`,
      type: "article",
      images: [
        {
          url: "/images/site/og-image.svg",
          alt: `${fix.title} guide`
        }
      ]
    }
  };
}

export default async function CorporateFixDetailPage({ params }: CorporateFixPageProps) {
  const { slug } = await params;
  const fix = getCorporateFixBySlug(slug);

  if (!fix) {
    notFound();
  }

  return (
    <section className="section-shell pt-10 sm:pt-14">
      <div className="page-shell max-w-5xl">
        <div className="mb-5 print:hidden">
          <Link
            href="/corporate-tech-fixes"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            ← Back to Corporate Tech Fixes
          </Link>
        </div>

        <EnterpriseSupportBanner className="mb-5" />
        <FixGuide fix={fix} />
      </div>
    </section>
  );
}

