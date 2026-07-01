import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-500 text-xl leading-none">⚡</span>
              <span className="font-bold text-white text-lg">PromptLibrary</span>
            </div>
            <p className="text-sm leading-relaxed">
              Ready-to-use AI prompts for solopreneurs and small business owners.
              Stop starting from scratch.
            </p>
          </div>
          <div className="flex gap-12 sm:gap-16">
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Explore</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/browse" className="hover:text-white transition-colors">
                    Browse Prompts
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-12 pt-8 text-xs text-center">
          © 2025 PromptLibrary. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
