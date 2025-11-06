import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/firebase";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

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

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const data = await request.json();
    const { name, bankName, cardNumber, offers } = data;

    const card = await prisma.card.create({
      data: {
        name,
        bankName,
        cardNumber,
        userId,
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

    return NextResponse.json(card);
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 }
    );
  }
}
