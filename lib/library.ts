import promptsData from "@/data/prompts.json";
import categoriesData from "@/data/categories.json";
import { Category, Prompt } from "@/types";

export const prompts = promptsData as Prompt[];
export const categories = categoriesData as Category[];

const promptById = new Map(prompts.map((p) => [p.id, p]));
const categoryById = new Map(categories.map((c) => [c.id, c]));
const subcategoryName = new Map<string, string>();
for (const c of categories) {
  for (const s of c.subcategories) subcategoryName.set(`${c.id}/${s.id}`, s.name);
}

export function getPrompt(id: string): Prompt | undefined {
  return promptById.get(id);
}

export function categoryName(id: string): string {
  return categoryById.get(id)?.name ?? id;
}

export function subName(categoryId: string, subId: string): string {
  return subcategoryName.get(`${categoryId}/${subId}`) ?? subId;
}

const STOP = new Set([
  "a", "an", "and", "the", "for", "to", "of", "in", "on", "my", "me", "i", "is", "it",
  "with", "about", "prompt", "prompts", "help", "want", "need", "some", "that", "this",
  "how", "what", "can", "you", "your", "find", "give", "get", "write", "make", "create",
]);

function stem(word: string): string {
  let w = word;
  for (const suf of ["ing", "ies", "es", "ed", "s"]) {
    if (w.length > suf.length + 2 && w.endsWith(suf)) {
      w = w.slice(0, -suf.length);
      break;
    }
  }
  if (w.length > 4 && w.endsWith("e")) w = w.slice(0, -1);
  return w;
}

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map(stem);
}

type Indexed = {
  p: Prompt;
  title: string;
  desc: string;
  use: string;
  text: string;
  sub: string;
  cat: string;
};

const index: Indexed[] = prompts.map((p) => ({
  p,
  title: p.title.toLowerCase(),
  desc: p.description.toLowerCase(),
  use: p.useCase.toLowerCase(),
  text: p.promptText.toLowerCase(),
  sub: subName(p.categoryId, p.subcategoryId).toLowerCase(),
  cat: categoryName(p.categoryId).toLowerCase(),
}));

export type SearchOptions = {
  category?: string;
  aiTool?: string;
  limit?: number;
};

export function searchPrompts(query: string, opts: SearchOptions = {}): Prompt[] {
  const limit = Math.min(Math.max(opts.limit ?? 5, 1), 25);
  const qTokens = tokens(query);
  const phrase = query.toLowerCase().trim();
  const cat = opts.category?.toLowerCase();
  const tool = opts.aiTool?.toLowerCase();

  const scored: { p: Prompt; s: number }[] = [];
  for (const row of index) {
    if (cat && row.p.categoryId !== cat && row.cat !== cat) continue;
    if (tool && row.p.aiTool.toLowerCase() !== tool) continue;
    let s = 0;
    for (const t of qTokens) {
      if (row.title.includes(t)) s += 6;
      if (row.sub.includes(t)) s += 4;
      if (row.desc.includes(t)) s += 3;
      if (row.cat.includes(t)) s += 2;
      if (row.use.includes(t)) s += 1;
      if (row.text.includes(t)) s += 0.5;
    }
    if (phrase.length > 3 && row.title.includes(phrase)) s += 10;
    if (qTokens.length === 0) s = 1;
    if (s > 0) scored.push({ p: row.p, s });
  }
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, limit).map((x) => x.p);
}

export function listPrompts(categoryId: string, subcategoryId?: string): Prompt[] {
  return prompts.filter(
    (p) => p.categoryId === categoryId && (!subcategoryId || p.subcategoryId === subcategoryId),
  );
}
