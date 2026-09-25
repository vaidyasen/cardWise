import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-[#d7d4ca] bg-[#f3f1e8]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2.5" aria-label="CardWise home">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171917] text-sm font-bold text-[#d9ff66]">
            C
          </span>
          <span className="text-lg font-semibold tracking-[-0.03em]">CardWise</span>
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/demo" className="hidden text-sm font-medium text-[#5f625d] transition hover:text-[#171917] sm:block">
            How it works
          </Link>
          <Link
            href="/demo"
            className="rounded-full bg-[#171917] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#343734] focus:outline-none focus:ring-2 focus:ring-[#171917] focus:ring-offset-2 focus:ring-offset-[#f3f1e8]"
          >
            Compare cards
          </Link>
        </div>
      </nav>
    </header>
  );
}
