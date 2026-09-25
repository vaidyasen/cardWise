import Link from "next/link";

const sampleCards = [
  { name: "SBI Cashback", rate: "5%", color: "#d9ff66" },
  { name: "HDFC Millennia", rate: "4%", color: "#b8c7ff" },
  { name: "Amazon Pay ICICI", rate: "3%", color: "#ffc978" },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20 lg:pb-28">
        <div>
          <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#62655f]">
            <span className="h-2 w-2 rounded-full bg-[#171917]" />
            Spend with intent
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-7xl lg:text-[5.5rem]">
            Use the card that pays you back.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#5f625d] sm:text-xl">
            Pick the cards already in your wallet. CardWise shows which one earns the most for your next purchase.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link
              href="/demo"
              className="rounded-full bg-[#171917] px-7 py-3.5 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#343734] focus:outline-none focus:ring-2 focus:ring-[#171917] focus:ring-offset-2 focus:ring-offset-[#f3f1e8]"
            >
              Compare my cards
            </Link>
            <span className="text-sm text-[#6d706a]">No sign-up. No card details.</span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#cfccc1] bg-[#faf9f4] p-4 shadow-[0_24px_70px_rgba(32,35,31,0.08)] sm:p-6">
          <div className="rounded-[1.4rem] bg-[#171917] p-6 text-white sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a8aca5]">Best card for online shopping</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">SBI Cashback</h2>
              </div>
              <span className="rounded-full bg-[#d9ff66] px-3 py-1.5 text-sm font-bold text-[#171917]">₹175</span>
            </div>

            <div className="mt-10 space-y-5">
              {sampleCards.map((card, index) => (
                <div key={card.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className={index === 0 ? "font-semibold text-white" : "text-[#b9bcb6]"}>{card.name}</span>
                    <span className="font-medium">{card.rate}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full" style={{ width: `${100 - index * 20}%`, backgroundColor: card.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex items-center justify-between border-t border-white/15 pt-5 text-sm">
              <span className="text-[#a8aca5]">Purchase</span>
              <span className="font-semibold">₹3,500</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d7d4ca] bg-[#ebe8dd]">
        <div className="mx-auto grid max-w-7xl divide-y divide-[#d1cec3] px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            ["01", "Choose your cards", "Select from the cards you already own. Nothing sensitive is collected."],
            ["02", "Describe the purchase", "Choose a category and enter the amount you expect to spend."],
            ["03", "Use the winner", "See the estimated return for every card and pick the strongest option."],
          ].map(([number, title, copy]) => (
            <article key={number} className="py-10 md:px-8 md:py-14 md:first:pl-0 md:last:pr-0">
              <p className="font-mono text-xs text-[#7b7e77]">{number}</p>
              <h2 className="mt-8 text-xl font-semibold tracking-[-0.03em]">{title}</h2>
              <p className="mt-3 max-w-sm leading-7 text-[#62655f]">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] bg-[#171917] p-8 text-white sm:p-12 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium text-[#d9ff66]">Ready when you are</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Make the next purchase work harder.
            </h2>
          </div>
          <Link href="/demo" className="shrink-0 rounded-full bg-[#d9ff66] px-7 py-3.5 font-semibold text-[#171917] transition hover:bg-[#e5ff98]">
            Start comparing →
          </Link>
        </div>
      </section>
    </div>
  );
}
