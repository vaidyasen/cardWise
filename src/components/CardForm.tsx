import { useState } from "react";

interface CardFormData {
  name: string;
  bankName: string;
  cardNumber: string;
  offers: {
    merchantCategory: string;
    percentage: number;
    conditions?: string;
  }[];
}

interface CardFormProps {
  onSubmit: (data: CardFormData) => Promise<void>;
  initialData?: CardFormData;
}

const defaultOffers = [{ merchantCategory: "", percentage: 0, conditions: "" }];

export function CardForm({ onSubmit, initialData }: CardFormProps) {
  const [formData, setFormData] = useState<CardFormData>(
    initialData ?? {
      name: "",
      bankName: "",
      cardNumber: "",
      offers: [...defaultOffers],
    }
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      setError("Failed to save card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addOffer = () => {
    setFormData((prev) => ({
      ...prev,
      offers: [
        ...prev.offers,
        { merchantCategory: "", percentage: 0, conditions: "" },
      ],
    }));
  };

  const removeOffer = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      offers: prev.offers.filter((_, i) => i !== index),
    }));
  };

  const updateOffer = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      offers: prev.offers.map((offer, i) =>
        i === index ? { ...offer, [field]: value } : offer
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="cardName" className="block text-sm font-medium">
          Card Name
        </label>
        <input
          type="text"
          id="cardName"
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-purple-500 focus:ring-purple-500"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <label htmlFor="bankName" className="block text-sm font-medium">
          Bank Name
        </label>
        <input
          type="text"
          id="bankName"
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-purple-500 focus:ring-purple-500"
          value={formData.bankName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, bankName: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium">
          Card Number (last 4 digits)
        </label>
        <input
          type="text"
          id="cardNumber"
          maxLength={4}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-purple-500 focus:ring-purple-500"
          value={formData.cardNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setFormData((prev) => ({ ...prev, cardNumber: value }));
          }}
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Card Offers</h3>
          <button
            type="button"
            onClick={addOffer}
            className="rounded-md bg-purple-600 px-3 py-1 text-sm font-semibold text-white hover:bg-purple-500"
          >
            Add Offer
          </button>
        </div>

        {formData.offers.map((offer, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-700 p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-medium">Offer #{index + 1}</h4>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeOffer(index)}
                  className="text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Category</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-purple-500 focus:ring-purple-500"
                  value={offer.merchantCategory}
                  onChange={(e) =>
                    updateOffer(index, "merchantCategory", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Cashback %</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-purple-500 focus:ring-purple-500"
                  value={offer.percentage}
                  onChange={(e) =>
                    updateOffer(index, "percentage", parseFloat(e.target.value))
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Conditions (optional)
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-purple-500 focus:ring-purple-500"
                value={offer.conditions || ""}
                onChange={(e) =>
                  updateOffer(index, "conditions", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Card"}
      </button>
    </form>
  );
}
