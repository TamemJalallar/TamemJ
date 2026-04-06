import type { GenAIPrompt } from "@/src/content/genai/genai-prompts.registry";
import type { GenAIFilterState, GenAISort } from "@/lib/genai-prompts";

interface GenAIFiltersProps {
  filters: GenAIFilterState;
  onFiltersChange: (next: GenAIFilterState) => void;
  sort: GenAISort;
  onSortChange: (sort: GenAISort) => void;
  categories: string[];
  tools: GenAIPrompt["tool"][];
}

function updateFilters(
  filters: GenAIFilterState,
  onFiltersChange: (next: GenAIFilterState) => void,
  key: keyof GenAIFilterState,
  value: string
) {
  onFiltersChange({ ...filters, [key]: value as GenAIFilterState[keyof GenAIFilterState] });
}

export function GenAIFilters({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  categories,
  tools
}: GenAIFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <label className="space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Platform</span>
        <select
          value={filters.platform}
          onChange={(event) => updateFilters(filters, onFiltersChange, "platform", event.target.value)}
          className="form-select h-10 px-2.5"
        >
          <option value="All">All</option>
          <option value="MetaAI">Meta AI</option>
          <option value="AdobeGenAI">Adobe GenAI</option>
          <option value="Both">Both</option>
        </select>
      </label>

      <label className="space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Tool</span>
        <select
          value={filters.tool}
          onChange={(event) => updateFilters(filters, onFiltersChange, "tool", event.target.value)}
          className="form-select h-10 px-2.5"
        >
          <option value="All">All</option>
          {tools.map((tool) => (
            <option key={tool} value={tool}>
              {tool}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Complexity</span>
        <select
          value={filters.complexity}
          onChange={(event) => updateFilters(filters, onFiltersChange, "complexity", event.target.value)}
          className="form-select h-10 px-2.5"
        >
          <option value="All">All</option>
          <option value="Simple">Simple</option>
          <option value="Advanced">Advanced</option>
        </select>
      </label>

      <label className="space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Category</span>
        <select
          value={filters.category}
          onChange={(event) => updateFilters(filters, onFiltersChange, "category", event.target.value)}
          className="form-select h-10 px-2.5"
        >
          <option value="All">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Sort</span>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as GenAISort)}
          className="form-select h-10 px-2.5"
        >
          <option value="newest">Newest</option>
          <option value="a-z">A–Z</option>
        </select>
      </label>

      <div className="flex items-end">
        <button
          type="button"
          onClick={() =>
            onFiltersChange({
              platform: "All",
              tool: "All",
              complexity: "All",
              category: "All"
            })
          }
          className="btn-secondary w-full !rounded-xl !px-4 !py-2 text-sm"
        >
          Reset filters
        </button>
      </div>
    </div>
  );
}
