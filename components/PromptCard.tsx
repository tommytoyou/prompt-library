"use client";

import { useState } from "react";
import Link from "next/link";
import { Prompt } from "@/types";

const categoryStripes: Record<string, string> = {
  marketing: "bg-amber-400",
  sales: "bg-emerald-400",
  "content-creation": "bg-blue-400",
  "product-and-business-ideas": "bg-violet-400",
  "customer-service": "bg-rose-400",
  "productivity-and-operations": "bg-indigo-400",
  "visual-and-design": "bg-fuchsia-400",
};

const categoryBadges: Record<string, string> = {
  marketing: "bg-amber-100 text-amber-700",
  sales: "bg-emerald-100 text-emerald-700",
  "content-creation": "bg-blue-100 text-blue-700",
  "product-and-business-ideas": "bg-violet-100 text-violet-700",
  "customer-service": "bg-rose-100 text-rose-700",
  "productivity-and-operations": "bg-indigo-100 text-indigo-700",
  "visual-and-design": "bg-fuchsia-100 text-fuchsia-700",
};

const toolBadges: Record<string, string> = {
  ChatGPT: "bg-emerald-100 text-emerald-700",
  Claude: "bg-orange-100 text-orange-700",
  Gemini: "bg-blue-100 text-blue-700",
  Midjourney: "bg-violet-100 text-violet-700",
};

interface Props {
  prompt: Prompt;
  categoryName: string;
}

export default function PromptCard({ prompt, categoryName }: Props) {
  const [copied, setCopied] = useState(false);

  const stripe = categoryStripes[prompt.categoryId] ?? "bg-stone-300";
  const catBadge = categoryBadges[prompt.categoryId] ?? "bg-stone-100 text-stone-700";
  const toolBadge = toolBadges[prompt.aiTool] ?? "bg-stone-100 text-stone-700";

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(prompt.promptText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
      <div className={`h-1 flex-shrink-0 ${stripe}`} />
      <Link
        href={`/prompts/${prompt.id}`}
        className="flex flex-col flex-1 p-5"
      >
        <h3 className="font-semibold text-stone-900 text-sm leading-snug mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
          {prompt.title}
        </h3>
        <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 flex-1">
          {prompt.description}
        </p>
        <div className="flex items-center gap-1.5 mt-4 flex-wrap">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catBadge}`}>
            {categoryName}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${toolBadge}`}>
            {prompt.aiTool}
          </span>
        </div>
      </Link>
      <div className="px-5 pb-5">
        <button
          onClick={handleCopy}
          className={`w-full text-xs font-semibold py-2 rounded-lg border transition-all ${
            copied
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-stone-100 text-stone-600 border-transparent hover:bg-amber-500 hover:text-white"
          }`}
        >
          {copied ? "✓ Copied!" : "Copy Prompt"}
        </button>
      </div>
    </div>
  );
}
