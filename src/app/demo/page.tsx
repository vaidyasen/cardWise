"use client";

import { useMemo, useState } from "react";

type Category = "online" | "dining" | "groceries" | "travel" | "utilities";

type DemoCard = {
  id: string;
  name: string;
  bank: string;
  accent: string;
  bestFor: string;
  rates: Record<Category, number>;
};

const categories: Array<{ id: Category; label: string; example: string }> = [
  { id: "online", label: "Online shopping", example: "Amazon, Flipkart, Myntra" },
  { id: "dining", label: "Dining", example: "Restaurants and food delivery" },
  { id: "groceries", label: "Groceries", example: "Supermarkets and grocery apps" },
  { id: "travel", label: "Travel", example: "Flights, hotels and cabs" },
  { id: "utilities", label: "Bills", example: "Electricity, mobile and broadband" },
];

const demoCards: DemoCard[] = [
  {
    id: "sbi-cashback",
    name: "SBI Cashback",
    bank: "SBI Card",
    accent: "from-blue-500 to-cyan-400",
    bestFor: "online purchases",
    rates: { online: 5, dining: 1, groceries: 1, travel: 1, utilities: 1 },
  },
  {
    id: "hdfc-millennia",
    name: "HDFC Millennia",
    bank: "HDFC Bank",
    accent: "from-violet-500 to-fuchsia-400",
    bestFor: "everyday rewards",
    rates: { online: 4, dining: 2, groceries: 2, travel: 1, utilities: 1 },
  },
  {
    id: "amazon-pay-icici",
    name: "Amazon Pay ICICI",
    bank: "ICICI Bank",
    accent: "from-amber-400 to-orange-500",
    bestFor: "shopping and bills",
    rates: { online: 3, dining: 1, groceries: 1, travel: 1, utilities: 2 },
  },
  {
    id: "axis-ace",
    name: "Axis Ace",
    bank: "Axis Bank",
    accent: "from-emerald-400 to-teal-500",
    bestFor: "utility payments",
    rates: { online: 1.5, dining: 4, groceries: 1.5, travel: 1.5, utilities: 5 },
  },
];

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function DemoPage() {
  const [category, setCategory] = useState<Category>("online");
  const [amount, setAmount] = useState(3500);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>(
    demoCards.map((card) => card.id),
  );

  const results = useMemo(
    () =>
      demoCards
        .filter((card) => selectedCardIds.includes(card.id))
        .map((card) => ({
          ...card,
          rate: card.rates[category],
          reward: (amount * card.rates[category]) / 100,
        }))
        .sort((a, b) => b.reward - a.reward),
    [amount, category, selectedCardIds],
  );

  const winner = results[0];
  const runnerUp = results[1];
  const selectedCategory = categories.find((item) => item.id === category)!;
  const extraReward = winner && runnerUp ? winner.reward - runnerUp.reward : 0;

  function toggleCard(cardId: string) {
    setSelectedCardIds((current) =>
      current.includes(cardId)
        ? current.filter((id) => id !== cardId)
        : [...current, cardId],
    );
  }

  return (
    <div className="min-h-screen bg-[#08090d] text-white">
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-300">
            Interactive product demo
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            Which card should you use right now?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            Select the cards in your wallet, enter a purchase, and CardWise tells you which one earns the most.
            Your selection stays in this browser session and is never stored.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-gray-400">1. Which cards do you have?</p>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCardIds(
                      selectedCardIds.length === demoCards.length
                        ? []
                        : demoCards.map((card) => card.id),
                    )
                  }
                  className="text-xs font-semibold text-purple-300 transition hover:text-purple-200"
                >
                  {selectedCardIds.length === demoCards.length ? "Clear all" : "Select all"}
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {demoCards.map((card) => {
                  const active = selectedCardIds.includes(card.id);
                  return (
                    <button
                      key={card.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleCard(card.id)}
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? "border-purple-400 bg-purple-500/15 shadow-lg shadow-purple-950/30"
                          : "border-white/10 bg-black/20 hover:border-white/25 hover:bg-white/[0.06]"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                          active ? "border-purple-400 bg-purple-500 text-white" : "border-white/20 text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      <span>
                        <span className="block font-semibold text-white">{card.name}</span>
                        <span className="mt-1 block text-xs leading-5 text-gray-500">{card.bank}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-gray-400">2. What are you paying for?</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {categories.map((item) => {
                  const active = item.id === category;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCategory(item.id)}
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? "border-purple-400 bg-purple-500/15"
                          : "border-white/10 bg-black/20 hover:border-white/25 hover:bg-white/[0.06]"
                      }`}
                    >
                      <span className="block font-semibold text-white">{item.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-gray-500">{item.example}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <label htmlFor="purchase-amount" className="text-sm font-medium text-gray-400">
                3. Purchase amount
              </label>
              <div className="mt-3 flex items-center rounded-2xl border border-white/10 bg-black/25 px-4 focus-within:border-purple-400">
                <span className="text-xl text-gray-500">₹</span>
                <input
                  id="purchase-amount"
                  type="number"
                  min="100"
                  max="1000000"
                  step="100"
                  value={amount}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setAmount(Number.isFinite(value) ? Math.max(0, value) : 0);
                  }}
                  className="w-full bg-transparent px-3 py-4 text-2xl font-semibold outline-none"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {[1500, 3500, 10000, 25000].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(value)}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-400 transition hover:border-white/30 hover:text-white"
                  >
                    {rupees.format(value)}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-purple-400/30 bg-gradient-to-br from-purple-950/70 via-gray-900 to-gray-950 shadow-2xl shadow-purple-950/30">
            {winner ? (
              <>
            <div className="border-b border-white/10 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Best match
                </span>
                <span className="text-sm text-gray-400">For {selectedCategory.label.toLowerCase()}</span>
              </div>

              <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm text-gray-400">Use</p>
                  <h2 className="mt-1 text-3xl font-bold sm:text-4xl">{winner.name}</h2>
                  <p className="mt-2 text-gray-400">{winner.bank} · Best for {winner.bestFor}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm text-gray-400">Estimated reward</p>
                  <p className="mt-1 text-4xl font-bold text-emerald-300">{rupees.format(winner.reward)}</p>
                  <p className="mt-1 text-sm text-gray-400">at {winner.rate}%</p>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/[0.06] p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500">Compared with next best</p>
                  <p className="mt-2 text-xl font-semibold">
                    {runnerUp ? `+${rupees.format(extraReward)}` : "Add another card"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/[0.06] p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500">If repeated monthly</p>
                  <p className="mt-2 text-xl font-semibold">{rupees.format(winner.reward * 12)} / year</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Card comparison</h3>
                <span className="text-xs text-gray-500">Reward per purchase</span>
              </div>
              <div className="mt-6 space-y-5">
                {results.map((card, index) => (
                  <div key={card.id}>
                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="w-5 text-gray-600">{index + 1}</span>
                        <span className="truncate font-medium text-gray-200">{card.name}</span>
                      </div>
                      <span className="shrink-0 font-semibold text-white">{rupees.format(card.reward)}</span>
                    </div>
                    <div className="ml-8 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${card.accent}`}
                        style={{ width: `${winner.reward > 0 ? (card.reward / winner.reward) * 100 : 0}%` }}
                      />
                    </div>
                    <p className="ml-8 mt-1 text-xs text-gray-600">{card.rate}% estimated reward</p>
                  </div>
                ))}
              </div>
            </div>
              </>
            ) : (
              <div className="flex min-h-[520px] items-center justify-center p-8 text-center">
                <div className="max-w-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/15 text-2xl">💳</div>
                  <h2 className="mt-5 text-2xl font-bold">Select at least one card</h2>
                  <p className="mt-3 leading-7 text-gray-400">
                    Choose the cards you own to see the best option for this purchase.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-gray-400 sm:flex-row sm:items-center">
          <p>
            Demo uses illustrative reward rates to show the recommendation workflow. Always verify current issuer terms.
          </p>
          <p className="shrink-0 font-medium text-gray-300">Amount × category rate = estimated reward</p>
        </div>
      </section>
    </div>
  );
}
