import { Card as CardType } from "@prisma/client";
import { useState } from "react";

interface CardProps {
  card: CardType;
}

export default function Card({ card }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative h-56 w-96 cursor-pointer rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white shadow-xl transition-transform duration-500 hover:scale-105"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <h3 className="text-2xl font-bold">{card.bankName}</h3>
          <p className="mt-2 text-lg">{card.name}</p>
        </div>

        <div>
          <p className="text-lg">
            {card.cardNumber.replace(/(\d{4})/g, "$1 ").trim()}
          </p>
        </div>
      </div>
    </div>
  );
}
