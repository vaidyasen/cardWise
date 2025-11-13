import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminAuth } from "@/lib/firebase-admin";
import { validateCardData } from "@/lib/validation";
import logger from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      logger.warn("GET /api/cards - No authorization header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    logger.info({ userId }, "GET /api/cards - Fetching cards");

    const cards = await prisma.card.findMany({
      where: {
        userId: userId,
      },
      include: {
        offers: {
          include: {
            merchant: true,
          },
        },
      },
    });

    logger.info({ userId, count: cards.length }, "GET /api/cards - Cards fetched successfully");

    // Transform the response to match the expected format
    const transformedCards = cards.map((card) => ({
      ...card,
      offers: card.offers.map((offer) => ({
        merchantCategory: offer.merchant.name,
        percentage: offer.percentage,
        conditions: offer.conditions,
      })),
    }));

    return NextResponse.json(transformedCards);
  } catch (error) {
    logger.error({ error }, "GET /api/cards - Error fetching cards");
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      logger.warn("POST /api/cards - No authorization header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    logger.info({ userId }, "POST /api/cards - User authenticated");

    // Ensure user exists in database (create if not exists)
    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: userEmail || "",
        },
      });
      logger.info({ userId }, "POST /api/cards - User ensured in database");
    } catch (userError) {
      logger.error({ error: userError }, "POST /api/cards - Error ensuring user exists");
      // Continue anyway, the foreign key will catch if there's still an issue
    }

    const data = await request.json();
    logger.debug({ data }, "POST /api/cards - Request data");

    // Validate the request data
    const validationErrors = validateCardData(data);
    if (validationErrors.length > 0) {
      logger.warn({ validationErrors }, "POST /api/cards - Validation failed");
      return NextResponse.json(
        { error: "Validation failed", errors: validationErrors },
        { status: 400 }
      );
    }

    const { name, bankName, cardNumber, cardNetwork, cardType, expiryMonth, expiryYear, offers } = data;

    logger.info({ cardName: name, bankName, userId }, "POST /api/cards - Creating card");

    // Create or find merchants for offers first
    const merchantData = await Promise.all(
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
          percentage: offer.percentage,
          conditions: offer.conditions,
          offerType: offer.offerType || "CASHBACK",
          validFrom: new Date(),
        };
      })
    );

    const card = await prisma.card.create({
      data: {
        name,
        bankName,
        cardNumber,
        cardNetwork,
        cardType,
        expiryMonth,
        expiryYear,
        userId,
        offers: {
          create: merchantData,
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

    logger.info({ cardId: card.id, userId }, "POST /api/cards - Card created successfully");

    // Transform the response to match the expected format
    const transformedCard = {
      ...card,
      offers: card.offers.map((offer) => ({
        merchantCategory: offer.merchant.name,
        percentage: offer.percentage,
        conditions: offer.conditions,
      })),
    };

    return NextResponse.json(transformedCard);
  } catch (error) {
    logger.error({ error }, "POST /api/cards - Error creating card");
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 }
    );
  }
}
