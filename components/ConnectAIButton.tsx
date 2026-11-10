import Image from "next/image";
import Link from "next/link";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-text shadow-sm">
      {children}
    </span>
  );
}

export default function ConnectAIButton() {
  return (
    <div className="mb-10 flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge>
          <Image src="/logos/openai.png" alt="" width={14} height={14} className="mr-1.5 h-3.5 w-auto" />
          ChatGPT
        </Badge>
        <Badge>
          <Image src="/logos/claude.png" alt="" width={14} height={14} className="mr-1.5 h-3.5 w-auto" />
          Claude
        </Badge>
        <Badge>
          <Image src="/logos/gemini.png" alt="" width={40} height={9} className="h-2.5 w-auto" />
        </Badge>
        <Badge>Grok</Badge>
        <Badge>Manus</Badge>
      </div>
      <Link
        href="/connect"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-white text-base font-semibold shadow-md hover:bg-primary-hover transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Connect your AI
      </Link>
      <p className="text-sm text-muted">Use the whole library from inside your own AI.</p>
    </div>
  );
}
