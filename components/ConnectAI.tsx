"use client";

import { useEffect, useState } from "react";

const FALLBACK_ORIGIN = "https://prompt-library-gilt.vercel.app";

type AiKey = "chatgpt" | "claude" | "grok" | "manus";

const AIS: Record<
  AiKey,
  { label: string; open: { href: string; text: string }; steps: string[]; note?: string }
> = {
  chatgpt: {
    label: "ChatGPT",
    open: { href: "https://chatgpt.com/#settings/Connectors", text: "Open ChatGPT settings" },
    steps: [
      "In ChatGPT, open Settings, then Apps and Connectors.",
      "Under Advanced settings, turn on Developer mode.",
      "Click Create, name it AI Prompt Library, and paste the address below.",
      "Set authentication to No authentication, then save.",
    ],
    note: "Custom connectors in ChatGPT need developer mode, which is available on paid plans.",
  },
  claude: {
    label: "Claude",
    open: { href: "https://claude.ai/settings/connectors", text: "Open Claude connectors" },
    steps: [
      "In Claude, open Settings, then Connectors.",
      "Click Add custom connector.",
      "Name it AI Prompt Library and paste the address below.",
      "Click Add. It is ready to use in any chat.",
    ],
  },
  grok: {
    label: "Grok",
    open: { href: "https://grok.com/connectors", text: "Open Grok connectors" },
    steps: [
      "Go to grok.com/connectors.",
      "Click New Connector, then Custom.",
      "Paste the address below and save.",
      "Grok finds the library's tools automatically.",
    ],
  },
  manus: {
    label: "Manus",
    open: { href: "https://manus.im/app", text: "Open Manus" },
    steps: [
      "In Manus, open Settings, then Integrations.",
      "Choose Custom MCP Servers and click Add Server.",
      "Name it AI Prompt Library and paste the address below. No credentials are needed.",
      "Click Test, then save.",
    ],
  },
};

export default function ConnectAI() {
  const [origin, setOrigin] = useState(FALLBACK_ORIGIN);
  const [active, setActive] = useState<AiKey | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const url = `${origin}/api/mcp`;
  const ai = active ? AIS[active] : null;

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-2xl mx-auto mb-10 rounded-2xl border border-border bg-white p-5 sm:p-6 text-left shadow-sm">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-bold text-text">Connect your AI</h2>
        <p className="text-sm text-muted mt-1">
          Add the library to your AI once, then just ask it for a prompt in any chat.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(AIS) as AiKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActive(active === key ? null : key)}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold border transition-colors ${
              active === key
                ? "bg-primary text-white border-primary"
                : "bg-white text-text border-border hover:bg-surface"
            }`}
            aria-expanded={active === key}
          >
            {AIS[key].label}
          </button>
        ))}
      </div>

      {ai && (
        <div className="mt-5 border-t border-border pt-5">
          <ol className="space-y-2 text-sm text-text list-decimal pl-5">
            {ai.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <code className="flex-1 min-w-0 truncate rounded-lg bg-surface border border-border px-3 py-2.5 text-sm text-text">
              {url}
            </code>
            <button
              onClick={copy}
              className="rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2.5 transition-colors"
            >
              {copied ? "Copied" : "Copy address"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <a
              href={ai.open.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              {ai.open.text} →
            </a>
            <span className="text-muted">
              Then try: &ldquo;Find me a prompt for writing a cold email.&rdquo;
            </span>
          </div>

          {ai.note && <p className="mt-3 text-xs text-muted">{ai.note}</p>}
        </div>
      )}
    </div>
  );
}
