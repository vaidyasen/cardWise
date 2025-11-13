import { useState } from "react";
import { validateCardData, ValidationError } from "@/lib/validation";

interface CardFormData {
  name: string;
  bankName: string;
  cardNumber: string;
  cardNetwork: "VISA" | "MASTERCARD" | "AMEX" | "RUPAY" | "DINERS" | "DISCOVER";
  cardType: "CREDIT" | "DEBIT";
  expiryMonth: number;
  expiryYear: number;
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
      cardNetwork: "VISA",
      cardType: "CREDIT",
      expiryMonth: new Date().getMonth() + 1,
      expiryYear: new Date().getFullYear(),
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

    // Clean form data - only send fields needed for validation/submission
    const cleanedData = {
      name: formData.name,
      bankName: formData.bankName,
      cardNumber: formData.cardNumber,
      cardNetwork: formData.cardNetwork,
      cardType: formData.cardType,
      expiryMonth: formData.expiryMonth,
      expiryYear: formData.expiryYear,
      offers: formData.offers.map((offer) => ({
        merchantCategory: offer.merchantCategory,
        percentage: offer.percentage,
        conditions: offer.conditions,
      })),
    };

    console.log("Form data before validation:", cleanedData);

    // Validate all fields
    const validationErrors = validateCardData(cleanedData);
    console.log("Validation errors:", validationErrors);
    
    if (validationErrors.length > 0) {
      const errorMap: { [key: string]: string } = {};
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message;
      });
      console.log("Form validation failed with errors:", errorMap);
      setErrors(errorMap);
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting form data:", cleanedData);
      await onSubmit(cleanedData);
      console.log("Form submitted successfully");
    } catch (error) {
      console.error("Form submission error:", error);
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
      {errors.submit && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{errors.submit}</p>
        </div>
      )}

      {Object.keys(errors).length > 0 && !errors.submit && (
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
          <p className="text-sm font-semibold text-yellow-400 mb-2">Please fix the following errors:</p>
          <ul className="text-sm text-yellow-300 list-disc list-inside">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="cardName" className="block text-sm font-medium text-gray-300 mb-2">
          Card Name
        </label>
        <input
          type="text"
          id="cardName"
          className={`block w-full rounded-lg border ${
            errors.name ? "border-red-500/50" : "border-white/10"
          } bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
          placeholder="e.g., My Rewards Card"
          value={formData.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          required
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="bankName" className="block text-sm font-medium text-gray-300 mb-2">
          Bank Name
        </label>
        <input
          type="text"
          id="bankName"
          className={`block w-full rounded-lg border ${
            errors.bankName ? "border-red-500/50" : "border-white/10"
          } bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
          placeholder="e.g., Chase"
          value={formData.bankName}
          onChange={(e) => handleFieldChange("bankName", e.target.value)}
          required
        />
        {errors.bankName && (
          <p className="mt-1 text-sm text-red-400">{errors.bankName}</p>
        )}
      </div>

      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-2">
          Card Number (last 4 digits)
        </label>
        <input
          type="text"
          id="cardNumber"
          maxLength={4}
          className={`block w-full rounded-lg border ${
            errors.cardNumber ? "border-red-500/50" : "border-white/10"
          } bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
          placeholder="1234"
          value={formData.cardNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            handleFieldChange("cardNumber", value);
          }}
          required
        />
        {errors.cardNumber && (
          <p className="mt-1 text-sm text-red-400">{errors.cardNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cardNetwork" className="block text-sm font-medium text-gray-300 mb-2">
            Card Network
          </label>
          <select
            id="cardNetwork"
            className={`block w-full rounded-lg border ${
              errors.cardNetwork ? "border-red-500/50" : "border-white/10"
            } bg-white/5 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            value={formData.cardNetwork}
            onChange={(e) => handleFieldChange("cardNetwork", e.target.value)}
            required
          >
            <option value="VISA">Visa</option>
            <option value="MASTERCARD">Mastercard</option>
            <option value="AMEX">American Express</option>
            <option value="RUPAY">RuPay</option>
            <option value="DINERS">Diners Club</option>
            <option value="DISCOVER">Discover</option>
          </select>
          {errors.cardNetwork && (
            <p className="mt-1 text-sm text-red-400">{errors.cardNetwork}</p>
          )}
        </div>

        <div>
          <label htmlFor="cardType" className="block text-sm font-medium text-gray-300 mb-2">
            Card Type
          </label>
          <select
            id="cardType"
            className={`block w-full rounded-lg border ${
              errors.cardType ? "border-red-500/50" : "border-white/10"
            } bg-white/5 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            value={formData.cardType}
            onChange={(e) => handleFieldChange("cardType", e.target.value)}
            required
          >
            <option value="CREDIT">Credit</option>
            <option value="DEBIT">Debit</option>
          </select>
          {errors.cardType && (
            <p className="mt-1 text-sm text-red-400">{errors.cardType}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-300 mb-2">
            Expiry Month
          </label>
          <select
            id="expiryMonth"
            className={`block w-full rounded-lg border ${
              errors.expiryMonth ? "border-red-500/50" : "border-white/10"
            } bg-white/5 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            value={formData.expiryMonth}
            onChange={(e) => handleFieldChange("expiryMonth", parseInt(e.target.value))}
            required
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {month.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
          {errors.expiryMonth && (
            <p className="mt-1 text-sm text-red-400">{errors.expiryMonth}</p>
          )}
        </div>

        <div>
          <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-300 mb-2">
            Expiry Year
          </label>
          <select
            id="expiryYear"
            className={`block w-full rounded-lg border ${
              errors.expiryYear ? "border-red-500/50" : "border-white/10"
            } bg-white/5 px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
            value={formData.expiryYear}
            onChange={(e) => handleFieldChange("expiryYear", parseInt(e.target.value))}
            required
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.expiryYear && (
            <p className="mt-1 text-sm text-red-400">{errors.expiryYear}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Card Offers</h3>
          <button
            type="button"
            onClick={addOffer}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-purple-500"
          >
            + Add Offer
          </button>
        </div>

        {formData.offers.map((offer, index) => (
          <div
            key={index}
            className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-medium text-white">Offer #{index + 1}</h4>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeOffer(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  ✕ Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="e.g., Dining"
                  value={offer.merchantCategory}
                  onChange={(e) =>
                    updateOffer(index, "merchantCategory", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cashback %</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="5.0"
                  value={offer.percentage || ""}
                  onChange={(e) =>
                    updateOffer(
                      index,
                      "percentage",
                      e.target.value === "" ? 0 : parseFloat(e.target.value)
                    )
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Conditions (optional)
              </label>
              <input
                type="text"
                className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="e.g., Min $50 spend"
                value={offer.conditions || ""}
                onChange={(e) =>
                  updateOffer(index, "conditions", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : (
          "Save Card"
        )}
      </button>
    </form>
  );
}
