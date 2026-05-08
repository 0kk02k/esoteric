import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, maxReadings } = await request.json();
    if (!email || !maxReadings) {
      return NextResponse.json({ error: "email and maxReadings required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = await prisma.usageLimit.updateMany({
      where: { userId: user.id },
      data: { maxReadings },
    });

    return NextResponse.json({ updated: result.count, userId: user.id, maxReadings });
  } catch (error) {
    console.error("set-limit error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
