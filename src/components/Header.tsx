import Link from "next/link";

export function Header() {
  return (
    <header className="bg-gray-900">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-gray-500 py-6">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-2xl font-bold text-white">CardWise</span>
            </Link>
            <div className="ml-10 space-x-8">
              <Link
                href="/cards"
                className="text-base font-medium text-white hover:text-gray-300"
              >
                My Cards
              </Link>
              <Link
                href="/search"
                className="text-base font-medium text-white hover:text-gray-300"
              >
                Find Best Card
              </Link>
              <Link
                href="/insights"
                className="text-base font-medium text-white hover:text-gray-300"
              >
                Insights
              </Link>
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <Link
              href="/profile"
              className="inline-block rounded-md border border-transparent bg-gray-700 py-2 px-4 text-base font-medium text-white hover:bg-gray-600"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
