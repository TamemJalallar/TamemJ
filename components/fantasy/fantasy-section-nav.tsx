import Link from "next/link";

interface FantasySectionNavItem {
  id: string;
  label: string;
}

interface FantasySectionNavProps {
  items: FantasySectionNavItem[];
}

export function FantasySectionNav({ items }: FantasySectionNavProps) {
  return (
    <div className="sticky top-16 z-30 -mx-4 border-y border-line/70 bg-bg/85 backdrop-blur sm:-mx-6 lg:-mx-8">
      <div className="hide-scrollbar overflow-x-auto">
        <nav aria-label="Fantasy league sections" className="page-shell flex min-w-max items-center gap-2 py-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className="rounded-full border border-line/80 bg-card px-3 py-2 text-sm font-medium text-fg-secondary transition hover:-translate-y-0.5 hover:border-primary-300 hover:text-fg dark:bg-card/90"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
