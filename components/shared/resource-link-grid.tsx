import Link from "next/link";

export interface ResourceLinkItem {
  href: string;
  title: string;
  description: string;
  eyebrow?: string;
  meta?: string;
  external?: boolean;
}

export function ResourceLinkGrid({
  title,
  description,
  items,
  cta
}: {
  title: string;
  description?: string;
  items: ResourceLinkItem[];
  cta?: { href: string; label: string };
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-fg sm:text-2xl">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-7 text-fg-secondary sm:text-base">{description}</p>
          ) : null}
        </div>
        {cta ? (
          <Link href={cta.href} className="btn-secondary !px-4 !py-2 text-xs">
            {cta.label}
          </Link>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const className =
            "surface-card-interactive rounded-2xl p-4 transition hover:-translate-y-0.5 hover:shadow-soft";

          if (item.external) {
            return (
              <a
                key={`${item.href}-${item.title}`}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={className}
              >
                {item.eyebrow ? <p className="eyebrow">{item.eyebrow}</p> : null}
                <h3 className="mt-2 text-base font-semibold text-fg">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-fg-secondary">{item.description}</p>
                {item.meta ? <p className="mt-3 text-xs text-muted">{item.meta}</p> : null}
              </a>
            );
          }

          return (
            <Link key={`${item.href}-${item.title}`} href={item.href} className={className}>
              {item.eyebrow ? <p className="eyebrow">{item.eyebrow}</p> : null}
              <h3 className="mt-2 text-base font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-fg-secondary">{item.description}</p>
              {item.meta ? <p className="mt-3 text-xs text-muted">{item.meta}</p> : null}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
