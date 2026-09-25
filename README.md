# CardWise

CardWise is a focused credit card rewards comparison demo. Select the cards in your wallet, choose a purchase category, enter the amount, and see which card offers the highest estimated reward.

The demo is public and does not require an account. It does not collect or store card numbers, expiry dates, or personal financial information.

## What it demonstrates

- Select one or more cards you already own
- Compare rewards across online shopping, dining, groceries, travel, and bills
- See the best card for a purchase immediately
- Compare the winner with the next-best option
- Estimate the yearly reward for a repeated monthly purchase
- Use the experience on desktop or mobile

## Demo flow

1. Select the cards in your wallet.
2. Choose a purchase category.
3. Enter the purchase amount.
4. Review the recommended card and ranked comparison.

The current demo includes SBI Cashback, HDFC Millennia, Amazon Pay ICICI, and Axis Ace.

> Reward rates are illustrative and are used to demonstrate the recommendation workflow. Issuer terms, exclusions, and reward caps can change, so current terms should always be verified before making a financial decision.

## Tech stack

- [Next.js 16](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)

The app is statically rendered and has no database, authentication service, or required environment variables.

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```bash
git clone https://github.com/vaidyasen/cardWise.git
cd cardWise
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The interactive comparison is available at `/demo`.

## Production build

```bash
npm run build
npm start
```

## Project structure

```text
src/
├── app/
│   ├── demo/page.tsx       # Card selection and reward comparison
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout and metadata
│   └── page.tsx            # Product landing page
└── components/
    ├── ClientLayout.tsx    # Shared page shell
    └── Header.tsx          # Navigation
```

## How recommendations are calculated

For each selected card:

```text
estimated reward = purchase amount × category reward rate
```

CardWise ranks the results from highest to lowest and displays the top card. Calculations currently run entirely in the browser using the illustrative rates defined in the demo.

## Current scope

CardWise currently demonstrates one complete feature: choosing the best card from the cards a user already owns. Account creation, card storage, transaction tracking, and analytics are outside the current demo scope.
