import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { main as seedDatabase } from "../../../../../prisma/seed";

export async function GET(request: NextRequest) {
  try {
    const totalCount = await prisma.tarotCard.count();
    if (totalCount >= 78) {
      return NextResponse.json({ message: "Database already seeded", count: totalCount });
    }

    // Since seed.ts has process.exit(1) on error, we shouldn't call it directly if it might fail.
    // However, if we know the schema is correct, we can call it. But wait, seed.ts calls process.exit(1) in the catch block of the IIFE at the bottom.
    // The exported `main` function does not call process.exit.
    await seedDatabase();

    const newCount = await prisma.tarotCard.count();
    return NextResponse.json({ message: "Database seeded successfully", count: newCount });
  } catch (error) {
    console.error("Manual seed error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
