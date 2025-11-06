import { useState } from "react";
import { validateCardData, ValidationError } from "@/lib/validation";

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case "name":
        if (!value) return "Card name is required";
        if (value.length < 3) return "Card name must be at least 3 characters";
        break;
      case "bankName":
        if (!value) return "Bank name is required";
        break;
      case "cardNumber":
        if (!value) return "Last 4 digits are required";
        if (!/^\d{4}$/.test(value)) return "Must be exactly 4 digits";
        break;
    }
    return "";
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validate all fields
    const validationErrors = validateCardData(formData);
    if (validationErrors.length > 0) {
      const errorMap: { [key: string]: string } = {};
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: "An unexpected error occurred" });
      }
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
    if (formData.offers.length === 1) {
      setErrors((prev) => ({
        ...prev,
        offers: "At least one offer is required",
      }));
      return;
    }

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

    // Validate offer fields
    let error = "";
    if (field === "merchantCategory" && !value) {
      error = "Category is required";
    }
    if (field === "percentage") {
      const numValue = parseFloat(value.toString());
      if (isNaN(numValue)) error = "Must be a number";
      else if (numValue < 0 || numValue > 100)
        error = "Must be between 0 and 100";
    }

    setErrors((prev) => ({
      ...prev,
      [`offers[${index}].${field}`]: error,
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
          className={`mt-1 block w-full rounded-md border ${
            errors.name ? "border-red-500" : "border-gray-700"
          } bg-gray-800 px-3 py-2 text-white focus:border-purple-500 focus:ring-purple-500`}
          value={formData.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          required
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="bankName" className="block text-sm font-medium">
          Bank Name
        </label>
        <input
          type="text"
          id="bankName"
          className={`mt-1 block w-full rounded-md border ${
            errors.bankName ? "border-red-500" : "border-gray-700"
          } bg-gray-800 px-3 py-2 text-white focus:border-purple-500 focus:ring-purple-500`}
          value={formData.bankName}
          onChange={(e) => handleFieldChange("bankName", e.target.value)}
          required
        />
        {errors.bankName && (
          <p className="mt-1 text-sm text-red-500">{errors.bankName}</p>
        )}
      </div>

      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium">
          Card Number (last 4 digits)
        </label>
        <input
          type="text"
          id="cardNumber"
          maxLength={4}
          className={`mt-1 block w-full rounded-md border ${
            errors.cardNumber ? "border-red-500" : "border-gray-700"
          } bg-gray-800 px-3 py-2 text-white focus:border-purple-500 focus:ring-purple-500`}
          value={formData.cardNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            handleFieldChange("cardNumber", value);
          }}
          required
        />
        {errors.cardNumber && (
          <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
        )}
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

      {errors.submit && (
        <div className="rounded-md bg-red-500 bg-opacity-10 p-3">
          <p className="text-sm text-red-500">{errors.submit}</p>
        </div>
      )}

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
