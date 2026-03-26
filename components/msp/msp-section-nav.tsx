import Link from "next/link";

interface MspSectionNavItem {
  id: string;
  label: string;
}

interface MspSectionNavProps {
  items: MspSectionNavItem[];
}

export function MspSectionNav({ items }: MspSectionNavProps) {
  return (
    <div className="sticky top-16 z-30 -mx-4 border-y border-line/70 bg-bg/85 backdrop-blur sm:-mx-6 lg:-mx-8">
      <div className="hide-scrollbar overflow-x-auto">
        <nav
          aria-label="Managed IT services sections"
          className="page-shell flex min-w-max items-center gap-2 py-3"
        >
          {items.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className="rounded-full border border-line/80 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
