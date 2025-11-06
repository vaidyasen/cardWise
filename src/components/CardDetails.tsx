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

export function CardDetails({ card, onEdit, onDelete }: CardDetailsProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm && onDelete) {
      onDelete();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className="max-w-md rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-1">
      <div className="relative h-full rounded-lg bg-gray-900 p-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{card.name}</h3>
            <p className="text-gray-400">{card.bankName}</p>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="rounded bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className={`rounded px-3 py-1 text-sm ${
                  showDeleteConfirm
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {showDeleteConfirm ? "Confirm Delete" : "Delete"}
              </button>
            )}
          </div>
        </div>

        <div
          className="mt-4 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {!isFlipped ? (
            <div className="space-y-2">
              <p className="text-lg text-gray-300">
                •••• •••• •••• {card.cardNumber}
              </p>
              <p className="text-sm text-gray-500">Click to see offers →</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Card Offers</h4>
              <div className="space-y-2">
                {card.offers.map((offer, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-700 p-3"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-gray-300">
                        {offer.merchantCategory}
                      </span>
                      <span className="text-lg font-bold text-green-500">
                        {offer.percentage}%
                      </span>
                    </div>
                    {offer.conditions && (
                      <p className="mt-1 text-sm text-gray-500">
                        {offer.conditions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
