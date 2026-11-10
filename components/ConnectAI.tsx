"use client";

import { useEffect, useState } from "react";

const FALLBACK_ORIGIN = "https://prompt-library-gilt.vercel.app";

export type AiKey = "chatgpt" | "claude" | "gemini" | "grok" | "manus";

export const AI_ORDER: AiKey[] = ["chatgpt", "claude", "gemini", "grok", "manus"];

export const AIS: Record<
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
  gemini: {
    label: "Gemini",
    open: { href: "https://gemini.google.com/apps", text: "Open Gemini connected apps" },
    steps: [
      "In Gemini, open Settings and help, then Connected Apps.",
      "Choose the Other tab and scroll to the bottom.",
      "Select Add a custom app and paste the address below.",
      "Click Next, then turn the app on in your chat.",
    ],
    note: "Google currently offers custom apps in Gemini on the Google AI Ultra plan with a personal Google account.",
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

export default function ConnectAI({ initial = "claude" }: { initial?: AiKey }) {
  const [origin, setOrigin] = useState(FALLBACK_ORIGIN);
  const [active, setActive] = useState<AiKey>(initial);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
    const fromHash = window.location.hash.replace("#", "") as AiKey;
    if (AI_ORDER.includes(fromHash)) setActive(fromHash);
  }, []);

  const url = `${origin}/api/mcp`;
  const ai = AIS[active];

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 sm:p-7 shadow-sm">
      <p className="text-sm font-medium text-muted mb-3">Choose your AI</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {AI_ORDER.map((key) => (
          <button
            key={key}
            onClick={() => {
              setActive(key);
              history.replaceState(null, "", `#${key}`);
            }}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold border transition-colors ${
              active === key
                ? "bg-primary text-white border-primary"
                : "bg-white text-text border-border hover:bg-surface"
            }`}
            aria-pressed={active === key}
          >
            {AIS[key].label}
          </button>
        ))}
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <h2 className="text-lg font-bold text-text mb-3">Connect {ai.label}</h2>
        <ol className="space-y-2 text-sm text-text list-decimal pl-5">
          {ai.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>

        <div className="mt-5 flex flex-col sm:flex-row gap-2">
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

        <a
          href={ai.open.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          {ai.open.text} →
        </a>

        {ai.note && <p className="mt-3 text-xs text-muted">{ai.note}</p>}
      </div>

      <div className="mt-6 rounded-xl bg-surface border border-border p-4 text-sm text-text">
        <p className="font-semibold mb-1">Then just ask your AI</p>
        <p className="text-muted">
          &ldquo;Find me a prompt for writing a cold email to a new client.&rdquo; Your AI searches the
          library, fills in the blanks with your details, and links you to the prompt.
        </p>
      </div>
    </div>
  );
}
