interface GenAISearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function GenAISearch({ value, onChange }: GenAISearchProps) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        Search prompts
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search title, summary, tags, tool..."
        className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
    </label>
  );
}
