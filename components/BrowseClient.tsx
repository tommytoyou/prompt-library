"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Fuse from "fuse.js";
import PromptCard from "@/components/PromptCard";
import { Category, Prompt, AiTool } from "@/types";

const AI_TOOLS: AiTool[] = ["ChatGPT", "Claude", "Gemini", "Midjourney"];

const toolDots: Record<AiTool, string> = {
  ChatGPT: "bg-emerald-500",
  Claude: "bg-orange-500",
  Gemini: "bg-blue-500",
  Midjourney: "bg-violet-500",
};

const toolActiveBadge: Record<AiTool, string> = {
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

const FUSE_OPTIONS = {
  keys: [
    { name: "title", weight: 3 },
    { name: "description", weight: 2 },
    { name: "aiTool", weight: 1.5 },
    { name: "categoryName", weight: 1 },
    { name: "subcategoryName", weight: 1 },
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
};

type SearchablePrompt = Prompt & { categoryName: string; subcategoryName: string };

interface Props {
  allPrompts: Prompt[];
  allCategories: Category[];
}

export default function BrowseClient({ allPrompts, allCategories }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const didMount = useRef(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ── Lookup maps ──────────────────────────────────────────────────────────
  const categoryMap = useMemo(
    () => Object.fromEntries(allCategories.map((c) => [c.id, c.name])),
    [allCategories]
  );
  const subcategoryNameMap = useMemo(
    () =>
      Object.fromEntries(
        allCategories.flatMap((c) => c.subcategories.map((s) => [s.id, s.name]))
      ),
    [allCategories]
  );

  // ── Filter state (initialised from URL) ──────────────────────────────────
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    () => searchParams.get("category")?.split(",").filter(Boolean) ?? []
  );
  const [selectedTools, setSelectedTools] = useState<AiTool[]>(
    () => (searchParams.get("tool")?.split(",").filter(Boolean) ?? []) as AiTool[]
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    () => searchParams.get("sub")?.split(",").filter(Boolean) ?? []
  );

  // ── Subcategories visible for the current category selection ─────────────
  const visibleSubcategories = useMemo(
    () =>
      selectedCategories.length > 0
        ? allCategories
            .filter((c) => selectedCategories.includes(c.id))
            .flatMap((c) => c.subcategories)
        : [],
    [allCategories, selectedCategories]
  );

  // Drop subcategory selections that no longer belong to a selected category
  useEffect(() => {
    if (selectedSubcategories.length === 0) return;
    const valid = new Set(visibleSubcategories.map((s) => s.id));
    setSelectedSubcategories((prev) => prev.filter((id) => valid.has(id)));
    // intentionally only [visibleSubcategories] — functional setter avoids stale closure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleSubcategories]);

  // ── Fuse index ───────────────────────────────────────────────────────────
  const searchableData = useMemo<SearchablePrompt[]>(
    () =>
      allPrompts.map((p) => ({
        ...p,
        categoryName: categoryMap[p.categoryId] ?? "",
        subcategoryName: subcategoryNameMap[p.subcategoryId] ?? "",
      })),
    [allPrompts, categoryMap, subcategoryNameMap]
  );

  const fuse = useMemo(() => new Fuse(searchableData, FUSE_OPTIONS), [searchableData]);

  // ── Filtered results (search + all filters AND-ed) ───────────────────────
  const filteredPrompts = useMemo(() => {
    const base = query.trim()
      ? fuse.search(query.trim()).map((r) => r.item)
      : searchableData;

    return base.filter((p) => {
      if (selectedCategories.length && !selectedCategories.includes(p.categoryId)) return false;
      if (selectedSubcategories.length && !selectedSubcategories.includes(p.subcategoryId))
        return false;
      if (selectedTools.length && !selectedTools.includes(p.aiTool as AiTool)) return false;
      return true;
    });
  }, [query, fuse, searchableData, selectedCategories, selectedSubcategories, selectedTools]);

  // ── Sync state → URL (300 ms debounce, skip initial mount) ───────────────
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const id = setTimeout(() => {
      const p = new URLSearchParams();
      if (query) p.set("q", query);
      if (selectedCategories.length) p.set("category", selectedCategories.join(","));
      if (selectedTools.length) p.set("tool", selectedTools.join(","));
      if (selectedSubcategories.length) p.set("sub", selectedSubcategories.join(","));
      const qs = p.toString();
      router.replace(qs ? `/browse?${qs}` : "/browse", { scroll: false });
    }, 300);
    return () => clearTimeout(id);
  }, [query, selectedCategories, selectedTools, selectedSubcategories, router]);

  // ── Toggle helpers ───────────────────────────────────────────────────────
  const toggleCategory = (id: string) =>
    setSelectedCategories((p) => (p.includes(id) ? p.filter((c) => c !== id) : [...p, id]));

  const toggleTool = (tool: AiTool) =>
    setSelectedTools((p) => (p.includes(tool) ? p.filter((t) => t !== tool) : [...p, tool]));

  const toggleSubcategory = (id: string) =>
    setSelectedSubcategories((p) => (p.includes(id) ? p.filter((s) => s !== id) : [...p, id]));

  const clearAll = () => {
    setQuery("");
    setSelectedCategories([]);
    setSelectedTools([]);
    setSelectedSubcategories([]);
  };

  const activeFilterCount =
    (query ? 1 : 0) +
    selectedCategories.length +
    selectedTools.length +
    selectedSubcategories.length;
  const hasFilters = activeFilterCount > 0;

  // ── Empty state copy ─────────────────────────────────────────────────────
  const emptyHeading = query.trim()
    ? `No results for "${query.trim()}"`
    : "No prompts match your filters";
  const emptyHint = query.trim()
    ? "Try a shorter keyword, a different term, or clear your filters."
    : "Remove a filter to see more prompts.";

  // ── Sidebar filter section (shared between desktop + mobile) ─────────────
  const FilterSections = (
    <>
      {/* Category */}
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

      {/* Subcategory — appears only when a category is selected */}
      {visibleSubcategories.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
            Subcategory
          </p>
          <div className="space-y-0.5">
            {visibleSubcategories.map((sub) => {
              const active = selectedSubcategories.includes(sub.id);
              return (
                <button
                  key={sub.id}
                  onClick={() => toggleSubcategory(sub.id)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    active
                      ? "bg-amber-50 text-amber-700 font-semibold"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <span className="truncate">{sub.name}</span>
                  {active && <span className="ml-auto text-amber-500 text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Tool */}
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
    </>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Page header with inline search ── */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-1">Browse Prompts</h1>
              <p className="text-stone-500 text-sm">
                {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""}
                {hasFilters ? " matching your filters" : " in the library"}
              </p>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-stone-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search prompts…"
                className="w-full bg-stone-100 border border-stone-200 text-stone-900 placeholder-stone-400 rounded-lg pl-9 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-2.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 items-start">

          {/* ── Desktop sidebar ── */}
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
            {FilterSections}
          </aside>

          {/* ── Main content ── */}
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

                {/* Active filter pills */}
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-stone-800 text-white"
                  >
                    &ldquo;{query}&rdquo; <span className="ml-0.5 opacity-70">×</span>
                  </button>
                )}
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
                    className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border ${toolActiveBadge[tool]}`}
                  >
                    {tool} <span className="ml-0.5 opacity-60">×</span>
                  </button>
                ))}
              </div>

              {/* Mobile filter panel */}
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
                  <div className="flex flex-wrap gap-2 mb-4">
                    {allCategories.map((cat) => {
                      const active = selectedCategories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => toggleCategory(cat.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            active
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-stone-50 text-stone-600 border-stone-200"
                          }`}
                        >
                          {categoryEmoji[cat.id]} {cat.name}
                        </button>
                      );
                    })}
                  </div>

                  {visibleSubcategories.length > 0 && (
                    <>
                      <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2.5">
                        Subcategory
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {visibleSubcategories.map((sub) => {
                          const active = selectedSubcategories.includes(sub.id);
                          return (
                            <button
                              key={sub.id}
                              onClick={() => toggleSubcategory(sub.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                active
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-stone-50 text-stone-600 border-stone-200"
                              }`}
                            >
                              {sub.name}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

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
                              : "bg-stone-50 text-stone-600 border-stone-200"
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

            {/* ── Grid / empty state ── */}
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
                <h3 className="font-semibold text-stone-900 text-lg mb-2">{emptyHeading}</h3>
                <p className="text-stone-500 text-sm max-w-xs mx-auto mb-6">{emptyHint}</p>
                {hasFilters && (
                  <button
                    onClick={clearAll}
                    className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
