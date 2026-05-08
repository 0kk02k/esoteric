import { NextResponse } from "next/server";
import prisma from "@/lib/db";

/**
 * GET /api/tarot/shuffle
 * Returns all 78 tarot card IDs in a cryptographically shuffled order.
 * Used by the StellarField component to map particles to cards.
 */
export async function GET() {
  try {
    const cards = await prisma.tarotCard.findMany({
      select: { id: true },
    });

    // Fisher-Yates shuffle
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }

    return NextResponse.json({
      cardIds: shuffled.map((c) => c.id),
      total: shuffled.length,
    });
  } catch (error) {
    console.error("Error shuffling tarot cards:", error);
    return NextResponse.json(
      { error: "Failed to shuffle cards" },
      { status: 500 }
    );
  }
}
