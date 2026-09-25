import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-gray-900/80 backdrop-blur-lg">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex items-center gap-10">
            <Link href="/" className="group" aria-label="CardWise home">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent transition-all group-hover:from-purple-300 group-hover:to-pink-300">
                CardWise
              </span>
            </Link>
            <div className="hidden space-x-6 md:flex">
              <Link
                href="/demo"
                className="text-base font-medium text-gray-300 transition-colors hover:text-white"
                aria-label="Try the CardWise recommendation demo"
              >
                Live Demo
              </Link>
            </div>
          </div>
          <Link
            href="/demo"
            className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Compare my cards
          </Link>
        </div>
      </nav>
    </header>
  );
}
