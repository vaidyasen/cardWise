/**
 * Type definitions for Card and CardOffer data structures
 * Used across forms, validation, and API routes
 */

import { CardNetwork, CardType } from "@prisma/client";

/**
 * Card offer data for form submission (uses merchantCategory)
 */
export interface CardOfferFormData {
  merchantCategory: string;
  percentage: number;
  conditions?: string;
}

/**
 * Card form data for creating cards (matches CardForm component)
 */
export interface CardFormData {
  name: string;
  bankName: string;
  cardNumber: string; // Last 4 digits for display/validation
  cardNetwork: CardNetwork;
  cardType: CardType;
  expiryMonth: number;
  expiryYear: number;
  creditLimit?: number | null;
  offers: CardOfferFormData[];
}

/**
 * Partial card update data (all fields optional)
 */
export interface CardUpdateData extends Partial<CardFormData> {
  id?: string;
}

/**
 * Card offer data for API requests (includes merchant details)
 */
export interface CardOfferData {
  merchantName: string;
  merchantUrl?: string;
  offerPercentage: number;
  offerConditions?: string;
  validFrom?: string; // ISO date string
  validUntil?: string; // ISO date string
}

/**
 * Card response from API (includes database fields)
 */
export interface CardResponse {
  id: string;
  userId: string;
  name: string;
  bankName: string;
  lastFourDigits: string;
  expiryMonth: string;
  expiryYear: string;
  network: CardNetwork;
  cardType: CardType;
  createdAt: string;
  updatedAt: string;
  offers: CardOfferResponse[];
}

/**
 * Card offer response from API
 */
export interface CardOfferResponse {
  id: string;
  cardId: string;
  merchantId: string;
  offerPercentage: number;
  offerConditions?: string;
  validFrom?: string;
  validUntil?: string;
  merchant: {
    id: string;
    name: string;
    url?: string;
  };
}

