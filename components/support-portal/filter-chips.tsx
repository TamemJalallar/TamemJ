"use client";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

interface FilterChipOption {
  label: string;
  value: string;
}

interface FilterChipsProps {
  options: FilterChipOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  allowMultiple?: boolean;
  className?: string;
}

export function FilterChips({
  options,
  selected,
  onChange,
  allowMultiple = true,
  className
}: FilterChipsProps) {
  function toggle(value: string) {
    if (allowMultiple) {
      onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
      return;
    }

    onChange(selected.includes(value) ? [] : [value]);
  }

  return (
    <div className={cx("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const active = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(option.value)}
            className={cx(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              active
                ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                : "border-line/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
