"use client";

import { useMemo, useState } from "react";

type Category = "online" | "dining" | "groceries" | "travel" | "utilities";

type DemoCard = {
  id: string;
  name: string;
  bank: string;
  color: string;
  bestFor: string;
  rates: Record<Category, number>;
};

const categories: Array<{ id: Category; label: string; example: string }> = [
  { id: "online", label: "Online", example: "Shopping and marketplaces" },
  { id: "dining", label: "Dining", example: "Restaurants and delivery" },
  { id: "groceries", label: "Groceries", example: "Stores and grocery apps" },
  { id: "travel", label: "Travel", example: "Flights, hotels and cabs" },
  { id: "utilities", label: "Bills", example: "Mobile, power and broadband" },
];

const demoCards: DemoCard[] = [
  {
    id: "sbi-cashback",
    name: "SBI Cashback",
    bank: "SBI Card",
    color: "#d9ff66",
    bestFor: "online purchases",
    rates: { online: 5, dining: 1, groceries: 1, travel: 1, utilities: 1 },
  },
  {
    id: "hdfc-millennia",
    name: "HDFC Millennia",
    bank: "HDFC Bank",
    color: "#b8c7ff",
    bestFor: "everyday rewards",
    rates: { online: 4, dining: 2, groceries: 2, travel: 1, utilities: 1 },
  },
  {
    id: "amazon-pay-icici",
    name: "Amazon Pay ICICI",
    bank: "ICICI Bank",
    color: "#ffc978",
    bestFor: "shopping and bills",
    rates: { online: 3, dining: 1, groceries: 1, travel: 1, utilities: 2 },
  },
  {
    id: "axis-ace",
    name: "Axis Ace",
    bank: "Axis Bank",
    color: "#8fd8c7",
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
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>(demoCards.map((card) => card.id));

  const results = useMemo(
    () =>
      demoCards
        .filter((card) => selectedCardIds.includes(card.id))
        .map((card) => ({ ...card, rate: card.rates[category], reward: (amount * card.rates[category]) / 100 }))
        .sort((a, b) => b.reward - a.reward),
    [amount, category, selectedCardIds],
  );

  const winner = results[0];
  const runnerUp = results[1];
  const selectedCategory = categories.find((item) => item.id === category)!;
  const extraReward = winner && runnerUp ? winner.reward - runnerUp.reward : 0;

  function toggleCard(cardId: string) {
    setSelectedCardIds((current) =>
      current.includes(cardId) ? current.filter((id) => id !== cardId) : [...current, cardId],
    );
  }

  return (
    <div className="pb-20">
      <section className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
        <div className="grid gap-6 border-b border-[#cfccc1] pb-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b6e68]">Card comparison</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
              Find the best card for this purchase.
            </h1>
          </div>
          <p className="max-w-xl text-base leading-7 text-[#666963] lg:justify-self-end">
            Choose the cards in your wallet, add a purchase, and compare the estimated return. Your choices stay in this browser session.
          </p>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[1.75rem] border border-[#cfccc1] bg-[#faf9f4] p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-[#85877f]">01</p>
                <h2 className="mt-2 text-lg font-semibold">Cards in your wallet</h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSelectedCardIds(selectedCardIds.length === demoCards.length ? [] : demoCards.map((card) => card.id))
                }
                className="text-sm font-semibold underline decoration-[#a3a69e] underline-offset-4 transition hover:decoration-[#171917]"
              >
                {selectedCardIds.length === demoCards.length ? "Clear all" : "Select all"}
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {demoCards.map((card) => {
                const active = selectedCardIds.includes(card.id);
                return (
                  <button
                    key={card.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleCard(card.id)}
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-[#171917] bg-[#171917] text-white"
                        : "border-[#d7d4ca] bg-white text-[#171917] hover:border-[#8f928b]"
                    }`}
                  >
                    <span className="h-9 w-2 shrink-0 rounded-full" style={{ backgroundColor: card.color }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{card.name}</span>
                      <span className={`mt-0.5 block text-xs ${active ? "text-[#aeb1ab]" : "text-[#777a74]"}`}>{card.bank}</span>
                    </span>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${active ? "border-[#d9ff66] bg-[#d9ff66] text-[#171917]" : "border-[#babdb5] text-transparent"}`}>✓</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 border-t border-[#dedbd1] pt-7">
              <p className="font-mono text-xs text-[#85877f]">02</p>
              <h2 className="mt-2 text-lg font-semibold">Purchase category</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((item) => {
                  const active = item.id === category;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      title={item.example}
                      onClick={() => setCategory(item.id)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "border-[#171917] bg-[#d9ff66] text-[#171917]"
                          : "border-[#cfccc1] bg-transparent text-[#62655f] hover:border-[#83867f] hover:text-[#171917]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 border-t border-[#dedbd1] pt-7">
              <label htmlFor="purchase-amount" className="block">
                <span className="font-mono text-xs text-[#85877f]">03</span>
                <span className="mt-2 block text-lg font-semibold">Purchase amount</span>
              </label>
              <div className="mt-4 flex items-center rounded-2xl border border-[#cfccc1] bg-white px-4 focus-within:border-[#171917] focus-within:ring-1 focus-within:ring-[#171917]">
                <span className="text-xl text-[#777a74]">₹</span>
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
                    className="rounded-full border border-[#d5d2c8] px-3 py-1.5 text-xs text-[#666963] transition hover:border-[#898c85] hover:text-[#171917]"
                  >
                    {rupees.format(value)}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[1.75rem] bg-[#171917] text-white shadow-[0_24px_70px_rgba(32,35,31,0.12)]">
            {winner ? (
              <>
                <div className="p-6 sm:p-9">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-[#d9ff66] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#171917]">Best match</span>
                    <span className="text-sm text-[#aeb1ab]">{selectedCategory.label} · {rupees.format(amount)}</span>
                  </div>

                  <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm text-[#9fa29c]">Pay with</p>
                      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">{winner.name}</h2>
                      <p className="mt-3 text-[#aeb1ab]">{winner.bank} · Best for {winner.bestFor}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-[#9fa29c]">Estimated reward</p>
                      <p className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-[#d9ff66]">{rupees.format(winner.reward)}</p>
                      <p className="mt-1 text-sm text-[#aeb1ab]">at {winner.rate}%</p>
                    </div>
                  </div>

                  <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
                    <div className="bg-[#222522] p-5">
                      <p className="text-xs uppercase tracking-[0.12em] text-[#8f938c]">Ahead of next best</p>
                      <p className="mt-2 text-xl font-semibold">{runnerUp ? `+${rupees.format(extraReward)}` : "Add another card"}</p>
                    </div>
                    <div className="bg-[#222522] p-5">
                      <p className="text-xs uppercase tracking-[0.12em] text-[#8f938c]">Repeated monthly</p>
                      <p className="mt-2 text-xl font-semibold">{rupees.format(winner.reward * 12)} / year</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 p-6 sm:p-9">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">All selected cards</h3>
                    <span className="text-xs text-[#8f938c]">Reward per purchase</span>
                  </div>
                  <div className="mt-7 space-y-6">
                    {results.map((card, index) => (
                      <div key={card.id}>
                        <div className="mb-2.5 flex items-center justify-between gap-4 text-sm">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="font-mono text-xs text-[#71756e]">0{index + 1}</span>
                            <span className={index === 0 ? "truncate font-semibold text-white" : "truncate text-[#c2c5bf]"}>{card.name}</span>
                          </div>
                          <span className="shrink-0 font-semibold">{rupees.format(card.reward)}</span>
                        </div>
                        <div className="ml-8 h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${winner.reward > 0 ? (card.reward / winner.reward) * 100 : 0}%`, backgroundColor: card.color }}
                          />
                        </div>
                        <p className="ml-8 mt-1.5 text-xs text-[#777b74]">{card.rate}% estimated reward</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[640px] items-center justify-center p-8 text-center">
                <div className="max-w-sm">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d9ff66] text-lg font-bold text-[#171917]">+</span>
                  <h2 className="mt-5 text-2xl font-semibold">Select at least one card</h2>
                  <p className="mt-3 leading-7 text-[#9fa29c]">Choose a card from your wallet to start the comparison.</p>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-[#cfccc1] pt-5 text-sm text-[#70736d] sm:flex-row sm:items-center">
          <p>Illustrative rates only. Always verify current issuer terms, exclusions, and reward caps.</p>
          <p className="shrink-0 font-mono text-xs">amount × category rate = estimate</p>
        </div>
      </section>
    </div>
  );
}
