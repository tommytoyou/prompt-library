import {
  categories,
  categoryName,
  getPrompt,
  listPrompts,
  prompts,
  searchPrompts,
  subName,
} from "@/lib/library";
import { Prompt } from "@/types";

export const dynamic = "force-dynamic";

const SUPPORTED_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Accept",
  "Access-Control-Expose-Headers": "Mcp-Session-Id",
};

const INSTRUCTIONS =
  "AI Prompt Library: thousands of ready to use business prompts for solopreneurs and small businesses. " +
  "When the user wants help with a task, call search with a short description of the task, then fetch the best match. " +
  "Fill the [BRACKETED] variables with details the user has given, ask briefly for any you do not know, then run or show the finished prompt. " +
  "Always share the prompt's url so the user can find it again on the website.";

const readOnly = { readOnlyHint: true, openWorldHint: false, destructiveHint: false };

const TOOLS = [
  {
    name: "search",
    title: "Search prompts",
    description:
      "Search the AI Prompt Library for prompts matching a task, e.g. 'cold email to a new client', 'price my services', 'study plan for an exam'. Returns ids, titles, short descriptions, and urls. Use fetch with an id to get the full prompt.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "What the user wants to do, in plain words." },
        category: {
          type: "string",
          description: "Optional category id to narrow results. See list_categories.",
        },
        limit: { type: "number", description: "How many results, 1 to 25. Default 8." },
      },
      required: ["query"],
    },
    annotations: readOnly,
  },
  {
    name: "fetch",
    title: "Get a prompt",
    description:
      "Get one prompt by id with its full text, the [VARIABLES] to fill in, when to use it, and related prompts.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Prompt id from search or list_prompts." } },
      required: ["id"],
    },
    annotations: readOnly,
  },
  {
    name: "list_categories",
    title: "List categories",
    description: "List every category and subcategory in the library with prompt counts.",
    inputSchema: { type: "object", properties: {} },
    annotations: readOnly,
  },
  {
    name: "list_prompts",
    title: "List prompts in a category",
    description: "List the prompts in a category, or in one subcategory, by id and title.",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Category id from list_categories." },
        subcategory: { type: "string", description: "Optional subcategory id." },
      },
      required: ["category"],
    },
    annotations: readOnly,
  },
];

function promptUrl(origin: string, id: string) {
  return `${origin}/prompts/${id}`;
}

function text(t: string, isError = false) {
  return { content: [{ type: "text", text: t }], ...(isError ? { isError: true } : {}) };
}

function summary(p: Prompt, origin: string) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    category: categoryName(p.categoryId),
    subcategory: subName(p.categoryId, p.subcategoryId),
    bestWith: p.aiTool,
    url: promptUrl(origin, p.id),
  };
}

function callTool(name: string, args: Record<string, unknown>, origin: string) {
  switch (name) {
    case "search": {
      const query = String(args.query ?? "").trim();
      if (!query) return text("Please give a query describing the task.", true);
      const limit = typeof args.limit === "number" ? args.limit : 8;
      const results = searchPrompts(query, {
        category: typeof args.category === "string" ? args.category : undefined,
        limit,
      });
      return text(JSON.stringify({ results: results.map((p) => summary(p, origin)) }, null, 2));
    }
    case "fetch": {
      const id = String(args.id ?? "").trim();
      const p = getPrompt(id);
      if (!p) return text(`No prompt found with id "${id}". Use search to find valid ids.`, true);
      const related = p.relatedPromptIds
        .map((r) => getPrompt(r))
        .filter((r): r is Prompt => Boolean(r))
        .map((r) => ({ id: r.id, title: r.title }));
      return text(
        JSON.stringify(
          {
            id: p.id,
            title: p.title,
            url: promptUrl(origin, p.id),
            text: p.promptText,
            metadata: {
              description: p.description,
              whenToUse: p.useCase,
              variablesToFill: p.variables,
              category: categoryName(p.categoryId),
              subcategory: subName(p.categoryId, p.subcategoryId),
              bestWith: p.aiTool,
              related,
            },
          },
          null,
          2,
        ),
      );
    }
    case "list_categories": {
      const counts: Record<string, number> = {};
      for (const p of prompts) {
        const k = `${p.categoryId}/${p.subcategoryId}`;
        counts[k] = (counts[k] ?? 0) + 1;
      }
      const out = categories.map((c) => ({
        id: c.id,
        name: c.name,
        subcategories: c.subcategories.map((s) => ({
          id: s.id,
          name: s.name,
          prompts: counts[`${c.id}/${s.id}`] ?? 0,
        })),
      }));
      return text(JSON.stringify({ totalPrompts: prompts.length, categories: out }, null, 2));
    }
    case "list_prompts": {
      const category = String(args.category ?? "");
      const sub = typeof args.subcategory === "string" ? args.subcategory : undefined;
      const list = listPrompts(category, sub);
      if (!list.length)
        return text(`Nothing found for category "${category}". Use list_categories for valid ids.`, true);
      return text(
        JSON.stringify(
          {
            prompts: list.map((p) => ({
              id: p.id,
              title: p.title,
              subcategory: subName(p.categoryId, p.subcategoryId),
            })),
          },
          null,
          2,
        ),
      );
    }
    default:
      return null;
  }
}

type RpcParams = {
  protocolVersion?: string;
  name?: string;
  arguments?: Record<string, unknown>;
};
type RpcRequest = {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: RpcParams;
};

function handle(msg: RpcRequest, origin: string) {
  const { id, method, params } = msg;
  if (id === undefined || id === null) return null; // notification
  const ok = (result: unknown) => ({ jsonrpc: "2.0", id, result });
  const err = (code: number, message: string) => ({ jsonrpc: "2.0", id, error: { code, message } });

  switch (method) {
    case "initialize": {
      const requested = params?.protocolVersion;
      const protocolVersion =
        requested && SUPPORTED_VERSIONS.includes(requested) ? requested : SUPPORTED_VERSIONS[0];
      return ok({
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "ai-prompt-library", title: "AI Prompt Library", version: "1.0.0" },
        instructions: INSTRUCTIONS,
      });
    }
    case "ping":
      return ok({});
    case "tools/list":
      return ok({ tools: TOOLS });
    case "tools/call": {
      const result = callTool(params?.name ?? "", params?.arguments ?? {}, origin);
      if (!result) return err(-32602, `Unknown tool: ${params?.name}`);
      return ok(result);
    }
    case "resources/list":
      return ok({ resources: [] });
    case "prompts/list":
      return ok({ prompts: [] });
    default:
      return err(-32601, `Method not found: ${method}`);
  }
}

function originOf(req: Request) {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  const url = new URL(req.url);
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? url.host;
  const proto = req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  return host ? `${proto}://${host}` : fromEnv ?? "";
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
      { status: 400, headers: CORS },
    );
  }
  const origin = originOf(req);
  if (Array.isArray(body)) {
    const out = body.map((m) => handle(m as RpcRequest, origin)).filter(Boolean);
    if (!out.length) return new Response(null, { status: 202, headers: CORS });
    return Response.json(out, { headers: CORS });
  }
  const res = handle(body as RpcRequest, origin);
  if (!res) return new Response(null, { status: 202, headers: CORS });
  return Response.json(res, { headers: CORS });
}

export async function GET() {
  return new Response("AI Prompt Library MCP server. Connect with an MCP client using POST.", {
    status: 405,
    headers: { ...CORS, Allow: "POST, OPTIONS" },
  });
}

export async function DELETE() {
  return new Response(null, { status: 405, headers: { ...CORS, Allow: "POST, OPTIONS" } });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
