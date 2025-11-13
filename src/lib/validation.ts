import {
  detectCardNetwork,
  isExpiryValid,
  validateOffer,
} from "./card-validation";
import { CardFormData } from "@/types/card";

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationErrors extends Error {
  errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super("Validation failed");
    this.errors = errors;
  }
}

export function validateCardData(data: Partial<CardFormData>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Card Name validation
  if (!data.name) {
    errors.push({
      field: "name",
      message: "Card name is required",
    });
  } else if (data.name.length < 3) {
    errors.push({
      field: "name",
      message: "Card name must be at least 3 characters long",
    });
  }

  // Bank Name validation
  if (!data.bankName) {
    errors.push({
      field: "bankName",
      message: "Bank name is required",
    });
  }

  // Card Number validation (last 4 digits only)
  if (!data.cardNumber) {
    errors.push({
      field: "cardNumber",
      message: "Card number is required",
    });
  } else if (!/^\d{4}$/.test(data.cardNumber)) {
    errors.push({
      field: "cardNumber",
      message: "Card number must be exactly 4 digits",
    });
  }

  // Card Network validation
  if (!data.cardNetwork) {
    errors.push({
      field: "cardNetwork",
      message: "Card network is required",
    });
  } else if (
    !["VISA", "MASTERCARD", "AMEX", "RUPAY", "DINERS", "DISCOVER"].includes(
      data.cardNetwork
    )
  ) {
    errors.push({
      field: "cardNetwork",
      message: "Invalid card network",
    });
  }

  // Card Type validation
  if (!data.cardType) {
    errors.push({
      field: "cardType",
      message: "Card type is required",
    });
  } else if (!["CREDIT", "DEBIT"].includes(data.cardType)) {
    errors.push({
      field: "cardType",
      message: "Invalid card type",
    });
  }

  // Expiry validation
  if (!data.expiryMonth || !data.expiryYear) {
    errors.push({
      field: "expiry",
      message: "Expiry date is required",
    });
  } else {
    const month = typeof data.expiryMonth === 'string' ? parseInt(data.expiryMonth) : data.expiryMonth;
    const year = typeof data.expiryYear === 'string' ? parseInt(data.expiryYear) : data.expiryYear;

    if (isNaN(month) || month < 1 || month > 12) {
      errors.push({
        field: "expiryMonth",
        message: "Invalid expiry month",
      });
    }

    if (isNaN(year) || year < new Date().getFullYear()) {
      errors.push({
        field: "expiryYear",
        message: "Invalid expiry year",
      });
    }

    if (!isExpiryValid(month, year)) {
      errors.push({
        field: "expiry",
        message: "Card has expired",
      });
    }
  }

  // Credit Limit validation (optional)
  if (data.creditLimit !== undefined && data.creditLimit !== null) {
    if (typeof data.creditLimit !== "number" || data.creditLimit <= 0) {
      errors.push({
        field: "creditLimit",
        message: "Credit limit must be a positive number",
      });
    }
  }

  // Offers validation
  if (!Array.isArray(data.offers) || data.offers.length === 0) {
    errors.push({
      field: "offers",
      message: "At least one offer is required",
    });
  } else {
    data.offers.forEach((offer, index) => {
      const offerErrors = validateOffer(offer);
      offerErrors.forEach((error) => {
        errors.push({
          field: `offers[${index}]`,
          message: error,
        });
      });
    });
  }

  return errors;
}

export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return "";

  if (errors.length === 1) {
    return errors[0].message;
  }

  return errors.map((error) => `• ${error.message}`).join("\n");
}
