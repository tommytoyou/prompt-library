import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "PromptLibrary privacy policy — what data we collect and how it's used.",
};

const LAST_UPDATED = "July 1, 2025";

const sections = [
  {
    title: "What we collect",
    body: `PromptLibrary does not require you to create an account and does not collect your name, email address, or any personally identifiable information directly.`,
  },
  {
    title: "Analytics",
    body: `We use Google Analytics to understand how visitors use the site. This collects aggregated, anonymized data including pages visited, approximate geographic region (country or city level), device type, browser, and referral source. No personally identifiable information is collected or stored by us.`,
  },
  {
    title: "Advertising",
    body: `We display Google AdSense advertisements to support the free operation of this site. Google may use cookies to serve ads based on your prior visits to this and other websites. You can review or opt out of personalized advertising at google.com/settings/ads.`,
  },
  {
    title: "Cookies",
    body: `Cookies may be placed by Google Analytics and Google AdSense as described above. These are third-party cookies we do not control directly. You can disable cookies in your browser settings or use a browser extension to block third-party cookies.`,
  },
  {
    title: "Third-party services",
    body: `Prompt text on this site references third-party AI tools including ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google), and Midjourney. We are not affiliated with these services and are not responsible for their privacy practices. When you copy a prompt and use it in one of these tools, you are subject to that service's terms and privacy policy.`,
  },
  {
    title: "Data security",
    body: `Since we do not collect personal data, there is no personal data to secure or breach. The site is served as a fully static website with no user database.`,
  },
  {
    title: "Children",
    body: `This site is not directed at children under 13. We do not knowingly collect information from children.`,
  },
  {
    title: "Changes to this policy",
    body: `We may update this privacy policy from time to time. The "last updated" date at the top of this page will reflect any changes. Continued use of the site after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "Contact",
    body: `Questions about this privacy policy? Visit the Contact page.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="bg-stone-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-10">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">Legal</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2 mb-3">
              Privacy Policy
            </h1>
            <p className="text-stone-400 text-sm">Last updated: {LAST_UPDATED}</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8 text-sm text-amber-800">
            <strong>Short version:</strong> We don&apos;t collect personal data. We use standard
            Google Analytics and Google AdSense. No account required, ever.
          </div>

          <div className="space-y-6">
            {sections.map(({ title, body }) => (
              <section key={title} className="bg-white rounded-xl border border-stone-200 p-6">
                <h2 className="font-bold text-stone-900 text-sm mb-2">{title}</h2>
                <p className="text-stone-600 text-sm leading-relaxed">{body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
