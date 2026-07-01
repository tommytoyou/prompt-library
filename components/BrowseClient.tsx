"use client";

import { useState, useMemo } from "react";
import PromptCard from "@/components/PromptCard";
import { Category, Prompt, AiTool } from "@/types";

const AI_TOOLS: AiTool[] = ["ChatGPT", "Claude", "Gemini", "Midjourney"];

const toolDots: Record<AiTool, string> = {
  ChatGPT: "bg-emerald-500",
  Claude: "bg-orange-500",
  Gemini: "bg-blue-500",
  Midjourney: "bg-violet-500",
};

const toolActiveBadges: Record<AiTool, string> = {
  ChatGPT: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Claude: "bg-orange-100 text-orange-700 border-orange-200",
  Gemini: "bg-blue-100 text-blue-700 border-blue-200",
  Midjourney: "bg-violet-100 text-violet-700 border-violet-200",
};

const categoryEmoji: Record<string, string> = {
  marketing: "📣",
  sales: "💰",
  "content-creation": "✍️",
  "product-and-business-ideas": "💡",
  "customer-service": "💬",
  "productivity-and-operations": "⚙️",
  "visual-and-design": "🎨",
};

interface Props {
  allPrompts: Prompt[];
  allCategories: Category[];
  initialCategory: string | null;
}

export default function BrowseClient({ allPrompts, allCategories, initialCategory }: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedTools, setSelectedTools] = useState<AiTool[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categoryMap = useMemo(
    () => Object.fromEntries(allCategories.map((c) => [c.id, c.name])),
    [allCategories]
  );

  const filteredPrompts = useMemo(() => {
    return allPrompts.filter((p) => {
      const catOk = selectedCategories.length === 0 || selectedCategories.includes(p.categoryId);
      const toolOk = selectedTools.length === 0 || selectedTools.includes(p.aiTool);
      return catOk && toolOk;
    });
  }, [allPrompts, selectedCategories, selectedTools]);

  const toggleCategory = (id: string) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const toggleTool = (tool: AiTool) =>
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedTools([]);
  };

  const activeFilterCount = selectedCategories.length + selectedTools.length;
  const hasFilters = activeFilterCount > 0;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-1">Browse Prompts</h1>
          <p className="text-stone-500 text-sm">
            {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""}
            {hasFilters ? " matching your filters" : " in the library"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 items-start">
          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-stone-900 text-sm">Filters</h2>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                Category
              </p>
              <div className="space-y-0.5">
                {allCategories.map((cat) => {
                  const active = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                        active
                          ? "bg-amber-50 text-amber-700 font-semibold"
                          : "text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      <span className="text-base leading-none">{categoryEmoji[cat.id] ?? "📋"}</span>
                      <span className="truncate">{cat.name}</span>
                      {active && <span className="ml-auto text-amber-500 text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                AI Tool
              </p>
              <div className="space-y-0.5">
                {AI_TOOLS.map((tool) => {
                  const active = selectedTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      onClick={() => toggleTool(tool)}
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                        active
                          ? "bg-amber-50 text-amber-700 font-semibold"
                          : "text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${toolDots[tool]}`} />
                      {tool}
                      {active && <span className="ml-auto text-amber-500 text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter bar */}
            <div className="lg:hidden mb-5">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    hasFilters
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2" />
                  </svg>
                  Filters
                  {hasFilters && (
                    <span className="bg-white text-amber-600 font-bold rounded-full w-4 h-4 text-xs flex items-center justify-center leading-none">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {selectedCategories.map((id) => (
                  <button
                    key={id}
                    onClick={() => toggleCategory(id)}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200"
                  >
                    {categoryEmoji[id]} {categoryMap[id]}
                    <span className="ml-0.5 opacity-60">×</span>
                  </button>
                ))}
                {selectedTools.map((tool) => (
                  <button
                    key={tool}
                    onClick={() => toggleTool(tool)}
                    className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border ${toolActiveBadges[tool]}`}
                  >
                    {tool}
                    <span className="ml-0.5 opacity-60">×</span>
                  </button>
                ))}
              </div>

              {mobileFiltersOpen && (
                <div className="mt-3 bg-white rounded-xl border border-stone-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-stone-900 text-sm">Filters</span>
                    <div className="flex gap-4 items-center">
                      {hasFilters && (
                        <button
                          onClick={clearAll}
                          className="text-xs text-amber-600 font-medium hover:text-amber-700"
                        >
                          Clear all
                        </button>
                      )}
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="text-xs text-stone-500 hover:text-stone-700"
                      >
                        Done
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2.5">
                    Category
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {allCategories.map((cat) => {
                      const active = selectedCategories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => toggleCategory(cat.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            active
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300"
                          }`}
                        >
                          {categoryEmoji[cat.id]} {cat.name}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2.5">
                    AI Tool
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {AI_TOOLS.map((tool) => {
                      const active = selectedTools.includes(tool);
                      return (
                        <button
                          key={tool}
                          onClick={() => toggleTool(tool)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            active
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${toolDots[tool]}`} />
                          {tool}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Prompt grid */}
            {filteredPrompts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    categoryName={categoryMap[prompt.categoryId] ?? prompt.categoryId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-semibold text-stone-900 mb-2">No prompts found</h3>
                <p className="text-stone-500 text-sm mb-6">
                  Try adjusting your filters to see more results.
                </p>
                <button
                  onClick={clearAll}
                  className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
