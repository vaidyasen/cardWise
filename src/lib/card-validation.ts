export type CardNetwork =
  | "VISA"
  | "MASTERCARD"
  | "AMEX"
  | "RUPAY"
  | "DINERS"
  | "DISCOVER";
export type CardType = "CREDIT" | "DEBIT";
export type OfferType = "CASHBACK" | "REWARD_POINTS" | "MILES" | "DISCOUNT";

interface CardInfo {
  network: CardNetwork;
  type?: CardType;
  isValid: boolean;
}

const CARD_PATTERNS = {
  VISA: /^4[0-9]{12}(?:[0-9]{3})?$/,
  MASTERCARD: /^5[1-5][0-9]{14}$/,
  AMEX: /^3[47][0-9]{13}$/,
  RUPAY: /^6[0-9]{15}$/,
  DINERS: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  DISCOVER: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
};

export function detectCardNetwork(cardNumber: string): CardInfo {
  // Remove spaces and non-numeric characters
  const normalized = cardNumber.replace(/\D/g, "");

  for (const [network, pattern] of Object.entries(CARD_PATTERNS)) {
    if (pattern.test(normalized)) {
      return {
        network: network as CardNetwork,
        isValid: validateLuhn(normalized),
      };
    }
  }

  return {
    network: "VISA", // Default to VISA if unknown
    isValid: validateLuhn(normalized),
  };
}

// Luhn algorithm for card number validation
function validateLuhn(cardNumber: string): boolean {
  const digits = cardNumber.split("").map(Number);
  const checkDigit = digits.pop()!;

  const sum = digits
    .reverse()
    .map((digit, index) => {
      if (index % 2 === 0) {
        const doubled = digit * 2;
        return doubled > 9 ? doubled - 9 : doubled;
      }
      return digit;
    })
    .reduce((acc, digit) => acc + digit, 0);

  return (sum + checkDigit) % 10 === 0;
}

export function isExpiryValid(month: number, year: number): boolean {
  const today = new Date();
  const cardDate = new Date(year, month - 1); // month is 0-based in Date

  // Set to last day of month to allow full month usage
  cardDate.setMonth(cardDate.getMonth() + 1, 0);

  return cardDate > today;
}

export function validateOffer(offer: any) {
  const errors: string[] = [];

  // Basic offer validation
  if (!offer.offerType) {
    errors.push("Offer type is required");
  } else if (
    !["CASHBACK", "REWARD_POINTS", "MILES", "DISCOUNT"].includes(
      offer.offerType
    )
  ) {
    errors.push("Invalid offer type");
  }

  if (
    typeof offer.percentage !== "number" ||
    offer.percentage < 0 ||
    offer.percentage > 100
  ) {
    errors.push("Percentage must be between 0 and 100");
  }

  // Validate amounts if present
  if (
    offer.maxAmount !== undefined &&
    (typeof offer.maxAmount !== "number" || offer.maxAmount <= 0)
  ) {
    errors.push("Maximum amount must be a positive number");
  }

  if (
    offer.minSpend !== undefined &&
    (typeof offer.minSpend !== "number" || offer.minSpend <= 0)
  ) {
    errors.push("Minimum spend must be a positive number");
  }

  // Validate dates
  if (!offer.validFrom) {
    errors.push("Valid from date is required");
  }

  if (
    offer.validUntil &&
    new Date(offer.validUntil) <= new Date(offer.validFrom)
  ) {
    errors.push("Valid until date must be after valid from date");
  }

  // Validate recurring offer details
  if (offer.isRecurring) {
    if (offer.dayOfMonth && (offer.dayOfMonth < 1 || offer.dayOfMonth > 31)) {
      errors.push("Day of month must be between 1 and 31");
    }

    if (offer.daysOfWeek) {
      try {
        const days = JSON.parse(offer.daysOfWeek);
        const validDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
        if (
          !Array.isArray(days) ||
          !days.every((day) => validDays.includes(day))
        ) {
          errors.push("Invalid days of week format");
        }
      } catch {
        errors.push("Invalid days of week format");
      }
    }

    if (
      offer.maxUsesPerMonth !== undefined &&
      (typeof offer.maxUsesPerMonth !== "number" || offer.maxUsesPerMonth < 1)
    ) {
      errors.push("Maximum uses per month must be a positive number");
    }
  }

  // Validate reward points specific fields
  if (
    offer.offerType === "REWARD_POINTS" &&
    (typeof offer.pointsPerRupee !== "number" || offer.pointsPerRupee <= 0)
  ) {
    errors.push(
      "Points per rupee must be a positive number for reward point offers"
    );
  }

  return errors;
}

export function formatCardNumber(
  cardNumber: string,
  network: CardNetwork
): string {
  const normalized = cardNumber.replace(/\D/g, "");

  switch (network) {
    case "AMEX":
      return normalized.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3");
    default:
      return normalized.replace(/(\d{4})/g, "$1 ").trim();
  }
}
