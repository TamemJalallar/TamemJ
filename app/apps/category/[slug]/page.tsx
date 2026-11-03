import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppCard } from "@/components/app-card";
import { buildRobotsIndexRule } from "@/lib/adsense-review-mode";
import {
  getAppCategories,
  getAppCategoryBySlug,
  getAppsByCategorySlug,
  isPublishedApp
} from "@/lib/apps";
import { appsSectionEnabled } from "@/lib/apps-visibility";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildOpenGraph, buildTwitter } from "@/lib/seo";

const STATIC_EXPORT_PLACEHOLDER_SLUG = "__site-build-placeholder__";

interface AppCategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  if (!appsSectionEnabled) {
    return [{ slug: STATIC_EXPORT_PLACEHOLDER_SLUG }];
  }

  const categories = getAppCategories();
  if (categories.length === 0) {
    return [{ slug: STATIC_EXPORT_PLACEHOLDER_SLUG }];
  }

  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: AppCategoryPageProps): Promise<Metadata> {
  const resolved = await params;
  const category = getAppCategoryBySlug(resolved.slug);

  if (!appsSectionEnabled || !category || resolved.slug === STATIC_EXPORT_PLACEHOLDER_SLUG) {
    return {
      title: "App Category",
      robots: { index: false, follow: false }
    };
  }

  const title = `${category.name} Apps`;
  const description = `${category.description} Browse ${category.count} product ${category.count === 1 ? "page" : "pages"} in this category.`;
  const path = `/apps/category/${category.slug}/`;

  return {
    title,
    description,
    keywords: [
      `${category.name} apps`,
      `${category.name} products`,
      "Tamem J apps",
      "software product catalog",
      "developer products"
    ],
    alternates: { canonical: path },
    robots: buildRobotsIndexRule(path),
    openGraph: buildOpenGraph(`${title} | Tamem J`, description, path),
    twitter: buildTwitter(`${title} | Tamem J`, description)
  };
}

export default async function AppCategoryPage({ params }: AppCategoryPageProps) {
  if (!appsSectionEnabled) {
    notFound();
  }

  const resolved = await params;
  const category = getAppCategoryBySlug(resolved.slug);

  if (!category || resolved.slug === STATIC_EXPORT_PLACEHOLDER_SLUG) {
    notFound();
  }

  const apps = getAppsByCategorySlug(category.slug);
  const publishedCount = apps.filter(isPublishedApp).length;
  const path = `/apps/category/${category.slug}/`;
  const collectionSchema = buildCollectionPageJsonLd(
    `${category.name} Apps by Tamem J`,
    category.description,
    path,
    apps.map((app) => ({
      name: app.name,
      path: `/apps/${app.slug}/`
    }))
  );
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Apps", path: "/apps/" },
    { name: category.name, path }
  ]);

  return (
    <>
      <section className="section-shell pt-10 sm:pt-14">
        <div className="page-shell space-y-6">
          <div>
            <Link href="/apps" className="text-sm font-medium text-fg-secondary transition hover:text-fg">
              ← Back to Apps
            </Link>
          </div>

          <section className="hero-surface p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-16 top-0 h-52 w-52 rounded-full bg-primary-300/15 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="eyebrow text-primary-100">App Category</p>
                <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {category.name} apps and products
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-primary-100/90 sm:text-base">
                  {category.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#category-products" className="btn-primary">
                    View Products
                  </a>
                  <Link href="/apps" className="btn-secondary">
                    Full Catalog
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Products</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{apps.length}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Products in this category</p>
                </article>
                <article className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100/80">Published</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">{publishedCount}</p>
                  <p className="mt-1 text-sm text-primary-100/85">Released products available now</p>
                </article>
              </div>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6" id="category-products">
            <div>
              <p className="eyebrow">Category Products</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-fg">{category.name}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-fg-secondary">
                Browse the products currently grouped under {category.name.toLowerCase()}.
              </p>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {apps.map((app) => (
                <AppCard key={app.slug} app={app} />
              ))}
            </div>
          </section>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
