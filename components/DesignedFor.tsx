import Image from "next/image";

export default function DesignedFor() {
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-sm font-medium text-stone-500">
        Designed for professionals using Claude, ChatGPT, and Gemini
      </p>
      <div className="flex items-center justify-center gap-8">
        <Image
          src="/logos/claude.png"
          alt="Claude"
          width={40}
          height={40}
          className="h-9 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
        />
        <Image
          src="/logos/openai.png"
          alt="ChatGPT"
          width={36}
          height={36}
          className="h-8 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
        />
        <Image
          src="/logos/gemini.png"
          alt="Gemini"
          width={120}
          height={27}
          className="h-6 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
        />
      </div>
    </div>
  );
}
