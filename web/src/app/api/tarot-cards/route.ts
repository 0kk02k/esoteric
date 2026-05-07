import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const arcana = searchParams.get("arcana");

    const where = arcana ? { arcana } : {};

    const cards = await prisma.tarotCard.findMany({
      where,
      orderBy: [{ arcana: "asc" }, { number: "asc" }],
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching tarot cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch tarot cards" },
      { status: 500 }
    );
  }
}
