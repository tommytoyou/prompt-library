import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the PromptLibrary team.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="bg-stone-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-10">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">Contact</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2 mb-4">
              Get in touch
            </h1>
            <p className="text-stone-500 text-lg leading-relaxed">
              PromptLibrary is a small independent project. We&apos;d love to hear from you.
            </p>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="font-bold text-stone-900 text-sm mb-2">General enquiries</h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-3">
                For questions, feedback, or anything else, email us at:
              </p>
              <a
                href="mailto:hello@promptlibrary.com"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
              >
                hello@promptlibrary.com
              </a>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="font-bold text-stone-900 text-sm mb-2">Suggest a prompt</h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                Have a prompt idea that would be useful for solopreneurs and small business owners?
                Send it to the email above with the subject line{" "}
                <span className="font-mono text-xs bg-stone-100 px-1.5 py-0.5 rounded">
                  Prompt suggestion
                </span>
                . Include the task it solves and any variables it needs.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="font-bold text-stone-900 text-sm mb-2">Advertising</h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                For advertising enquiries, email us at the address above with the subject line{" "}
                <span className="font-mono text-xs bg-stone-100 px-1.5 py-0.5 rounded">
                  Advertising
                </span>
                .
              </p>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="font-bold text-stone-900 text-sm mb-2">Privacy questions</h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                For questions about how we handle data, please read our{" "}
                <Link href="/privacy" className="text-amber-600 hover:text-amber-700 font-medium">
                  Privacy Policy
                </Link>{" "}
                first. If your question isn&apos;t answered there, email us.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
