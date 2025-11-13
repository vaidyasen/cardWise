import { useState } from "react";
import { Card as CardType } from "@prisma/client";

interface CardDetailsProps {
  card: CardType & {
    offers: Array<{
      merchantCategory: string;
      percentage: number;
      conditions?: string | null;
    }>;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

const networkGradients: Record<string, string> = {
  VISA: "from-blue-600 to-blue-800",
  MASTERCARD: "from-orange-600 to-red-700",
  AMEX: "from-blue-500 to-blue-700",
  RUPAY: "from-green-600 to-emerald-700",
  DINERS: "from-gray-600 to-gray-800",
  DISCOVER: "from-orange-500 to-orange-700",
};

export function CardDetails({ card, onEdit, onDelete }: CardDetailsProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm && onDelete) {
      onDelete();
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const gradient = networkGradients[card.cardNetwork] || "from-purple-600 to-pink-600";

  return (
    <div className="group h-64 w-full perspective-1000">
      <div
        className={`relative h-full w-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of card */}
        <div className="absolute h-full w-full backface-hidden">
          <div
            className={`h-full w-full rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-xl transition-all hover:shadow-2xl cursor-pointer`}
            onClick={() => setIsFlipped(true)}
          >
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide opacity-80">
                    {card.cardType}
                  </p>
                  <h3 className="mt-1 text-xl font-bold">{card.name}</h3>
                  <p className="mt-1 text-sm opacity-90">{card.bankName}</p>
                </div>
                <div className="rounded-lg bg-white/20 px-3 py-1 backdrop-blur-sm">
                  <span className="text-xs font-bold">{card.cardNetwork}</span>
                </div>
              </div>

              <div>
                <p className="font-mono text-lg tracking-wider">
                  •••• •••• •••• {card.cardNumber}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="opacity-70">EXPIRES</p>
                    <p className="font-medium">
                      {String(card.expiryMonth).padStart(2, "0")}/{String(card.expiryYear).slice(-2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="opacity-70">
                      {card.offers.length} {card.offers.length === 1 ? "Offer" : "Offers"}
                    </p>
                    <p className="text-xs opacity-60">Click to view →</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute h-full w-full backface-hidden rotate-y-180">
          <div className={`h-full w-full rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-xl`}>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold">Card Offers</h4>
                <button
                  onClick={() => setIsFlipped(false)}
                  className="rounded-lg bg-white/20 px-3 py-1 text-sm backdrop-blur-sm transition-all hover:bg-white/30"
                >
                  ← Back
                </button>
              </div>

              <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
                {card.offers.map((offer, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-white/10 p-3 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {offer.merchantCategory}
                      </span>
                      <span className="text-lg font-bold text-green-300">
                        {offer.percentage}%
                      </span>
                    </div>
                    {offer.conditions && (
                      <p className="mt-1 text-xs opacity-80">
                        {offer.conditions}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="flex-1 rounded-lg bg-white/20 py-2 text-sm font-medium backdrop-blur-sm transition-all hover:bg-white/30"
                  >
                    Edit Card
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium backdrop-blur-sm transition-all ${
                      showDeleteConfirm
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    {showDeleteConfirm ? "Confirm?" : "Delete"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
