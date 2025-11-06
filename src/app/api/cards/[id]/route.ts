import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminAuth } from "@/lib/firebase-admin";
import { validateCardData } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const cardId = params.id
    const data = await request.json()
    
    // Validate the request data
    const validationErrors = validateCardData(data)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validationErrors },
        { status: 400 }
      )
    }

    const { name, bankName, cardNumber, offers } = data

    // First, verify the card belongs to the user
    const existingCard = await prisma.card.findFirst({
      where: {
        id: cardId,
        userId: userId,
      },
    });

    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Delete existing offers
    await prisma.cardOffer.deleteMany({
      where: {
        cardId: cardId,
      },
    });

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
          create: offers.map((offer: any) => ({
            merchant: {
              create: {
                name: offer.merchantCategory,
                category: offer.merchantCategory,
              },
            },
            percentage: offer.percentage,
            conditions: offer.conditions,
            validFrom: new Date(),
          })),
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

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { error: "Failed to update card" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const cardId = params.id;

    // First, verify the card belongs to the user
    const existingCard = await prisma.card.findFirst({
      where: {
        id: cardId,
        userId: userId,
      },
    });

    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Delete the card (this will cascade delete the offers due to our schema)
    await prisma.card.delete({
      where: {
        id: cardId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { error: "Failed to delete card" },
      { status: 500 }
    );
  }
}
