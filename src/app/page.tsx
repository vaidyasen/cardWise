import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white sm:text-6xl md:text-7xl">
            Maximize Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Credit Card Rewards
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-300">
            CardWise helps you track all your credit cards and merchant offers in one place. 
            Get instant recommendations on which card to use for maximum rewards.
          </p>
          
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-purple-500/50"
            >
              Get Started Free
            </Link>
            <Link
              href="/signin"
              className="rounded-lg border-2 border-purple-400 bg-transparent px-8 py-3 text-lg font-semibold text-purple-400 transition-all hover:bg-purple-400/10"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white/5 p-8 backdrop-blur-sm border border-white/10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Track All Your Cards</h3>
            <p className="mt-2 text-gray-400">
              Add all your credit cards with their specific merchant offers and rewards in one central location.
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-8 backdrop-blur-sm border border-white/10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Smart Recommendations</h3>
            <p className="mt-2 text-gray-400">
              Get instant suggestions on which card offers the best rewards for your purchase.
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-8 backdrop-blur-sm border border-white/10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Insights & Analytics</h3>
            <p className="mt-2 text-gray-400">
              Understand your spending patterns and discover opportunities to earn more rewards.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to optimize your rewards?
          </h2>
          <p className="mt-4 text-lg text-purple-100">
            Join CardWise today and never miss out on rewards again.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-lg font-semibold text-purple-600 shadow-lg transition-all hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </main>
    </div>
  );
}
