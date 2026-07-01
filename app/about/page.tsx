import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "PromptLibrary is a free collection of AI prompts for solopreneurs and small business owners. No account required.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="bg-stone-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-10">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
              About
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2 mb-4">
              What is PromptLibrary?
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed">
              A free, no-account-required library of ready-to-use AI prompts for solopreneurs
              and small business owners.
            </p>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="font-bold text-stone-900 text-sm mb-3">The problem it solves</h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                AI tools like ChatGPT, Claude, and Gemini are incredibly powerful, but getting
                useful output requires knowing how to ask. Most people get generic results because
                they use generic prompts.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed mt-3">
                PromptLibrary gives you prompts that are already structured for specific business
                tasks: writing cold emails, responding to reviews, creating content calendars,
                generating SOPs, and more. Fill in the bracketed variables and get a result
                that actually matches your business.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="font-bold text-stone-900 text-sm mb-3">Who it&apos;s for</h2>
              <ul className="space-y-2">
                {[
                  "Solopreneurs running their business without a full team",
                  "Small business owners who use AI but want better outputs",
                  "Freelancers and consultants who need to create content quickly",
                  "Anyone who wants to save time on repetitive writing tasks",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-stone-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="font-bold text-stone-900 text-sm mb-3">How to use it</h2>
              <ol className="space-y-3">
                {[
                  "Browse by category or search for what you need.",
                  "Open a prompt page and read the use case to confirm it fits.",
                  'Click "Copy Prompt" to copy the full prompt to your clipboard.',
                  "Paste it into ChatGPT, Claude, Gemini, or Midjourney.",
                  "Replace the bracketed [VARIABLES] with your specific details.",
                  "Run it and get a result tailored to your business.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-stone-600 text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="font-bold text-stone-900 text-sm mb-3">Free, always</h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                PromptLibrary is and will always be free to use. There are no accounts,
                no subscriptions, and no paywalls. The site is supported by Google AdSense
                advertising.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Browse the library
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
