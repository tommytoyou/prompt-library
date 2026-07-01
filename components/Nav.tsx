import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-amber-500 text-xl leading-none">⚡</span>
            <span className="font-bold text-stone-900 text-lg tracking-tight">
              PromptLibrary
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/browse"
              className="hidden sm:block text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Browse All
            </Link>
            <Link
              href="/browse"
              className="text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
