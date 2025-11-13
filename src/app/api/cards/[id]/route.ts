import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminAuth } from "@/lib/firebase-admin";
import { validateCardData } from "@/lib/validation";
import { ApiError } from "@/lib/api-errors";
import logger from "@/lib/logger";
import { requireCsrfToken } from "@/lib/csrf";
import { requireRateLimit, RateLimitPresets } from "@/lib/rate-limit";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Apply moderate rate limiting for write endpoints
    const rateLimitResult = requireRateLimit(request, RateLimitPresets.API);
    if (rateLimitResult?.error) {
      return ApiError.rateLimit(rateLimitResult.error.message, rateLimitResult.error.headers);
    }

    // Validate CSRF token
    const csrfValid = await requireCsrfToken(request);
    if (!csrfValid) {
      return ApiError.csrf();
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return ApiError.unauthorized();
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { id: cardId } = await params;
    const data = await request.json();

    // Validate the request data
    const validationErrors = validateCardData(data);
    if (validationErrors.length > 0) {
      return ApiError.validation("Validation failed", validationErrors);
    }

    const { name, bankName, cardNumber, offers } = data;

    // First, verify the card belongs to the user
    const existingCard = await prisma.card.findFirst({
      where: {
        id: cardId,
        userId: userId,
      },
    });

    if (!existingCard) {
      return ApiError.notFound("Card");
    }

    // Delete existing offers
    await prisma.cardOffer.deleteMany({
      where: {
        cardId: cardId,
      },
    });

    // Process offers with merchant lookup/creation
    const offerCreates = await Promise.all(
      offers.map(async (offer: any) => {
        // Try to find existing merchant or create new one
        let merchant = await prisma.merchant.findFirst({
          where: {
            name: offer.merchantCategory,
          },
        });

        if (!merchant) {
          merchant = await prisma.merchant.create({
            data: {
              name: offer.merchantCategory,
              category: offer.merchantCategory,
            },
          });
        }

        return {
          merchantId: merchant.id,
          offerType: offer.offerType || "CASHBACK",
          percentage: offer.percentage,
          conditions: offer.conditions,
          validFrom: new Date(),
        };
      })
    );

    // Update the card and create new offers
    const updatedCard = await prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        name,
        bankName,
        cardNumber,
        offers: {
          create: offerCreates,
        },
      },
      include: {
        offers: {
          include: {
            merchant: true,
          },
        },
      },
    });

    // Transform the response to match the expected format
    const transformedCard = {
      ...updatedCard,
      offers: updatedCard.offers.map((offer) => ({
        merchantCategory: offer.merchant.name,
        percentage: offer.percentage,
        conditions: offer.conditions,
      })),
    };

    return NextResponse.json(transformedCard);
  } catch (error) {
    return ApiError.internal("Error updating card");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Apply moderate rate limiting for write endpoints
    const rateLimitResult = requireRateLimit(request, RateLimitPresets.API);
    if (rateLimitResult?.error) {
      return ApiError.rateLimit(rateLimitResult.error.message, rateLimitResult.error.headers);
    }

    // Validate CSRF token
    const csrfValid = await requireCsrfToken(request);
    if (!csrfValid) {
      return ApiError.csrf();
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return ApiError.unauthorized();
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { id: cardId } = await params;

    // First, verify the card belongs to the user
    const existingCard = await prisma.card.findFirst({
      where: {
        id: cardId,
        userId: userId,
      },
    });

    if (!existingCard) {
      return ApiError.notFound("Card");
    }

    // Delete the card (this will cascade delete the offers due to our schema)
    await prisma.card.delete({
      where: {
        id: cardId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return ApiError.internal("Error deleting card");
  }
}
