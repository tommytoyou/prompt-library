import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PromptCard from "@/components/PromptCard";
import CopyButton from "@/components/CopyButton";
import promptsData from "@/data/prompts.json";
import categoriesData from "@/data/categories.json";
import { Category, Prompt } from "@/types";

const allPrompts = promptsData as Prompt[];
const allCategories = categoriesData as Category[];

// ── Static generation ─────────────────────────────────────────────────────────

export function generateStaticParams() {
  return allPrompts.map((p) => ({ id: p.id }));
}

export const dynamicParams = false;

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const prompt = allPrompts.find((p) => p.id === params.id);
  if (!prompt) return {};
  return {
    title: `${prompt.title} — Free AI Prompt for Solopreneurs`,
    description: prompt.description,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const toolBadge: Record<string, string> = {
  ChatGPT: "bg-emerald-100 text-emerald-700",
  Claude: "bg-orange-100 text-orange-700",
  Gemini: "bg-blue-100 text-blue-700",
  Midjourney: "bg-violet-100 text-violet-700",
};

const categoryBadge: Record<string, string> = {
  marketing: "bg-amber-100 text-amber-700",
  sales: "bg-emerald-100 text-emerald-700",
  "content-creation": "bg-blue-100 text-blue-700",
  "product-and-business-ideas": "bg-violet-100 text-violet-700",
  "customer-service": "bg-rose-100 text-rose-700",
  "productivity-and-operations": "bg-indigo-100 text-indigo-700",
  "visual-and-design": "bg-fuchsia-100 text-fuchsia-700",
};

// Escape < > & so user content can't break the inline <script> tag
function safeJson(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

// Split prompt text into plain spans and [VARIABLE] spans for highlighting
function parsePromptText(text: string) {
  const parts: Array<{ type: "text" | "var"; content: string }> = [];
  let cursor = 0;
  const re = /\[([^\]]+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > cursor) parts.push({ type: "text", content: text.slice(cursor, m.index) });
    parts.push({ type: "var", content: m[0] });
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) parts.push({ type: "text", content: text.slice(cursor) });
  return parts;
}

// "YOUR PRODUCT" → "your product"
function varLabel(v: string) {
  return v.toLowerCase();
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PromptPage({ params }: { params: { id: string } }) {
  const prompt = allPrompts.find((p) => p.id === params.id);
  if (!prompt) notFound();

  const categoryMap = Object.fromEntries(allCategories.map((c) => [c.id, c]));
  const subcategoryNameMap = Object.fromEntries(
    allCategories.flatMap((c) => c.subcategories.map((s) => [s.id, s.name]))
  );
  const promptMap = Object.fromEntries(allPrompts.map((p) => [p.id, p]));

  const category = categoryMap[prompt.categoryId];
  const subcategoryName = subcategoryNameMap[prompt.subcategoryId] ?? "";
  const relatedPrompts = prompt.relatedPromptIds
    .map((id) => promptMap[id])
    .filter((p): p is Prompt => !!p);
  const parsedText = parsePromptText(prompt.promptText);

  // ── JSON-LD ──────────────────────────────────────────────────────────────

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home" },
      { "@type": "ListItem", position: 2, name: category?.name ?? "Browse" },
      ...(subcategoryName
        ? [{ "@type": "ListItem", position: 3, name: subcategoryName }]
        : []),
      {
        "@type": "ListItem",
        position: subcategoryName ? 4 : 3,
        name: prompt.title,
      },
    ],
  };

  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use: ${prompt.title}`,
    description: prompt.useCase,
    tool: [{ "@type": "HowToTool", name: prompt.aiTool }],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: `Open ${prompt.aiTool}`,
        text: `Open ${prompt.aiTool} or your preferred AI chat interface.`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Copy the prompt",
        text: "Copy the full prompt text and paste it in.",
      },
      ...prompt.variables.map((v, i) => ({
        "@type": "HowToStep",
        position: i + 3,
        name: `Fill in [${v}]`,
        text: `Replace [${v}] with your ${varLabel(v)}.`,
      })),
      {
        "@type": "HowToStep",
        position: prompt.variables.length + 3,
        name: "Run the prompt",
        text: "Submit the prompt and review the AI output.",
      },
    ],
  };

  return (
    <>
      <Nav />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(howToLd) }}
      />

      <main className="bg-stone-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

          {/* ── Breadcrumb ── */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-400 mb-8 flex-wrap">
            <Link href="/" className="hover:text-stone-700 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/browse?category=${prompt.categoryId}`}
              className="hover:text-stone-700 transition-colors"
            >
              {category?.name ?? prompt.categoryId}
            </Link>
            {subcategoryName && (
              <>
                <span>/</span>
                <Link
                  href={`/browse?category=${prompt.categoryId}&sub=${prompt.subcategoryId}`}
                  className="hover:text-stone-700 transition-colors"
                >
                  {subcategoryName}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-stone-600 font-medium truncate max-w-[180px] sm:max-w-none">
              {prompt.title}
            </span>
          </nav>

          {/* ── Header ── */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  categoryBadge[prompt.categoryId] ?? "bg-stone-100 text-stone-700"
                }`}
              >
                {category?.name ?? prompt.categoryId}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  toolBadge[prompt.aiTool] ?? "bg-stone-100 text-stone-700"
                }`}
              >
                {prompt.aiTool}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight mb-3">
              {prompt.title}
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed max-w-2xl">
              {prompt.description}
            </p>
          </div>

          {/* ── Prompt text box ── */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-3 gap-4">
              <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
                The Prompt
              </h2>
              <CopyButton text={prompt.promptText} />
            </div>
            <div className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
              <div className="flex items-center gap-1.5 px-5 py-3 border-b border-stone-800">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-stone-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-stone-700" />
                <span className="ml-3 text-xs text-stone-600 font-mono">
                  {prompt.aiTool} prompt
                </span>
              </div>
              <div className="p-5 sm:p-7 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed text-stone-300 whitespace-pre-wrap break-words m-0">
                  {parsedText.map((part, i) =>
                    part.type === "var" ? (
                      <span
                        key={i}
                        className="text-amber-300 font-semibold bg-amber-400/10 rounded px-0.5"
                      >
                        {part.content}
                      </span>
                    ) : (
                      <span key={i}>{part.content}</span>
                    )
                  )}
                </pre>
              </div>
            </div>
          </section>

          {/* ── Use case + Variables ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <section>
              <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">
                When to Use This
              </h2>
              <div className="bg-white rounded-xl border border-stone-200 p-5 h-full">
                <p className="text-stone-600 text-sm leading-relaxed">{prompt.useCase}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">
                Variables to Fill In
              </h2>
              <div className="bg-white rounded-xl border border-stone-200 p-5 h-full">
                {prompt.variables.length > 0 ? (
                  <ul className="space-y-3">
                    {prompt.variables.map((v) => (
                      <li key={v} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <code className="font-mono text-xs text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                          [{v}]
                        </code>
                        <span className="text-stone-500 text-sm leading-snug">
                          Replace with your{" "}
                          <span className="text-stone-700 font-medium">{varLabel(v)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-stone-400 text-sm">
                    No variables — this prompt is ready to use as-is.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* ── Related Prompts ── */}
          {relatedPrompts.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-5">
                Related Prompts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedPrompts.map((related) => (
                  <PromptCard
                    key={related.id}
                    prompt={related}
                    categoryName={categoryMap[related.categoryId]?.name ?? related.categoryId}
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
