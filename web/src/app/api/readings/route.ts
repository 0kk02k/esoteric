import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createReadingSchema } from "@/lib/validation";
import { checkUsageLimit } from "@/lib/usage-limits";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const body = await request.json();
    const parsed = createReadingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { question, birthProfileId, questionCategory, sessionToken } =
      parsed.data;

    const identifier = userId ? { userId } : { sessionToken: sessionToken || undefined };

    // Check usage limits
    const { allowed, readingsRemaining } = await checkUsageLimit(identifier);
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Daily reading limit reached",
          readingsRemaining,
        },
        { status: 429 }
      );
    }

    // Draw 3 random tarot cards
    const totalCount = await prisma.tarotCard.count();
    if (totalCount < 3) {
      return NextResponse.json(
        { error: "Not enough tarot cards in database" },
        { status: 500 }
      );
    }

    // Pick 3 unique random offsets for card selection
    const offsets: number[] = [];
    while (offsets.length < 3) {
      const offset = Math.floor(Math.random() * totalCount);
      if (!offsets.includes(offset)) {
        offsets.push(offset);
      }
    }

    const drawnCards = await Promise.all(
      offsets.map(async (offset) => {
        const cards = await prisma.tarotCard.findMany({
          take: 1,
          skip: offset,
        });
        return cards[0];
      })
    );

    const positions: string[] = ["gegenwart", "spannung", "impuls"];

    // Create reading with tarot draws
    const reading = await prisma.reading.create({
      data: {
        userId,
        question,
        questionCategory: questionCategory ?? null,
        birthProfileId: birthProfileId ?? null,
        sessionToken: userId ? null : (sessionToken ?? null),
        status: "pending",
        tarotDraws: {
          create: drawnCards.map((card: { id: string } | null, i: number) => ({
            cardId: card!.id,
            position: positions[i]!,
            upright: Math.random() > 0.3, // ~70% chance upright
          })),
        },
      },
      include: {
        tarotDraws: {
          include: {
            card: true,
          },
        },
      },
    });

    // Increment usage count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.usageLimit.updateMany({
      where: {
        userId,
        sessionToken: userId ? null : (sessionToken ?? undefined),
        periodStart: today,
        periodEnd: tomorrow,
      },
      data: {
        readingsCount: { increment: 1 },
      },
    });

    return NextResponse.json(reading, { status: 201 });
  } catch (error) {
    console.error("Error creating reading:", error);
    return NextResponse.json(
      { error: "Failed to create reading" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  const userIdFromAuth = session?.user?.id;

  try {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get("sessionToken");

    if (!userIdFromAuth && !sessionToken) {
      return NextResponse.json(
        { error: "Provide sessionToken or sign in" },
        { status: 400 }
      );
    }

    const where = userIdFromAuth 
      ? { userId: userIdFromAuth } 
      : { sessionToken: sessionToken!, userId: null };

    const readings = await prisma.reading.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        tarotDraws: {
          include: {
            card: true,
          },
        },
        feedback: true,
      },
    });

    return NextResponse.json(readings);
  } catch (error) {
    console.error("Error fetching readings:", error);
    return NextResponse.json(
      { error: "Failed to fetch readings" },
      { status: 500 }
    );
  }
}
