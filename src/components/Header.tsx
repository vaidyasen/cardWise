"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      // Error logging out - handled silently
    }
  };

  return (
    <header className="border-b border-white/10 bg-gray-900/80 backdrop-blur-lg">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex items-center gap-10">
            <Link href="/" className="group">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent transition-all group-hover:from-purple-300 group-hover:to-pink-300">
                CardWise
              </span>
            </Link>
            {user && (
              <div className="hidden space-x-6 md:flex">
                <Link
                  href="/cards"
                  className="text-base font-medium text-gray-300 transition-colors hover:text-white"
                >
                  My Cards
                </Link>
                <Link
                  href="/search"
                  className="text-base font-medium text-gray-300 transition-colors hover:text-white"
                >
                  Find Best Card
                </Link>
                <Link
                  href="/insights"
                  className="text-base font-medium text-gray-300 transition-colors hover:text-white"
                >
                  Insights
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-400 transition-all hover:border-purple-500/50 hover:bg-purple-500/20"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-purple-500 hover:to-pink-500"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-400 transition-all hover:border-purple-500/50 hover:bg-purple-500/20"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-purple-500 hover:to-pink-500"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
