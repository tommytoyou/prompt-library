import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PromptCard from "@/components/PromptCard";
import SearchBar from "@/components/SearchBar";
import categoriesData from "@/data/categories.json";
import promptsData from "@/data/prompts.json";
import { Category, Prompt } from "@/types";

const categories = categoriesData as Category[];
const allPrompts = promptsData as Prompt[];

const categoryMeta: Record<string, { stripe: string; emoji: string }> = {
  marketing: { stripe: "bg-amber-400", emoji: "📣" },
  sales: { stripe: "bg-emerald-400", emoji: "💰" },
  "content-creation": { stripe: "bg-blue-400", emoji: "✍️" },
  "product-and-business-ideas": { stripe: "bg-violet-400", emoji: "💡" },
  "customer-service": { stripe: "bg-rose-400", emoji: "💬" },
  "productivity-and-operations": { stripe: "bg-indigo-400", emoji: "⚙️" },
  "visual-and-design": { stripe: "bg-fuchsia-400", emoji: "🎨" },
};

export default function HomePage() {
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const promptCounts = allPrompts.reduce<Record<string, number>>((acc, p) => {
    acc[p.categoryId] = (acc[p.categoryId] ?? 0) + 1;
    return acc;
  }, {});

  const popularPrompts = allPrompts.slice(0, 6);

  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="bg-stone-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-500/20 mb-4">
            ⚡ Today&apos;s count: {allPrompts.length.toLocaleString()} prompts and growing
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-3">
            The AI prompt library
            <br />
            <span className="text-amber-500">built for business.</span>
          </h1>
          <p className="text-stone-400 text-lg sm:text-xl max-w-2xl mx-auto mb-5 leading-relaxed">
            Ready-to-use prompts for marketing, sales, content, and operations.
            Copy, customize, and get better results from AI — in seconds.
          </p>

          <SearchBar />
          <p className="text-stone-600 text-xs mt-3">
            Search across all prompts by keyword, category, or AI tool
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-stone-50 pt-4 pb-16 sm:pt-5 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              Browse by Category
            </h2>
            <p className="text-stone-500">Seven areas of your business, covered.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const meta = categoryMeta[cat.id] ?? { stripe: "bg-stone-300", emoji: "📋" };
              const count = promptCounts[cat.id] ?? 0;
              return (
                <Link
                  key={cat.id}
                  href={`/browse?category=${cat.id}`}
                  className="bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all group overflow-hidden"
                >
                  <div className={`h-1 ${meta.stripe}`} />
                  <div className="p-5">
                    <div className="text-2xl mb-3 leading-none">{meta.emoji}</div>
                    <h3 className="font-semibold text-stone-900 text-sm leading-snug mb-1.5 group-hover:text-amber-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-stone-400 text-xs leading-relaxed line-clamp-2 mb-3">
                      {cat.description}
                    </p>
                    <span className="text-xs font-medium text-stone-400">
                      {count} prompt{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Prompts */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                Popular Prompts
              </h2>
              <p className="text-stone-500">The most-used prompts across the library.</p>
            </div>
            <Link
              href="/browse"
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors whitespace-nowrap ml-6"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                categoryName={categoryMap[prompt.categoryId] ?? prompt.categoryId}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
