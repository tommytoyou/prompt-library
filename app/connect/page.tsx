import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ConnectAI from "@/components/ConnectAI";
import promptsData from "@/data/prompts.json";

export const metadata: Metadata = {
  title: "Connect Your AI",
  description:
    "Connect the AI Prompt Library to ChatGPT, Claude, Gemini, Grok, or Manus and pull prompts straight into your chats.",
};

export default function ConnectPage() {
  return (
    <>
      <Nav />
      <main className="bg-stone-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-3">
              Connect your AI
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed">
              Add the library to your AI once. After that, ask for a prompt in any chat and your AI
              pulls it from all {promptsData.length.toLocaleString()} prompts.
            </p>
          </div>
          <ConnectAI />
        </div>
      </main>
      <Footer />
    </>
  );
}
