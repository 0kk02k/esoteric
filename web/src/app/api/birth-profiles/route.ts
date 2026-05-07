import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createBirthProfileSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createBirthProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { birthDate, birthTime, birthCity, birthLat, birthLon, timezone, sessionToken } =
      parsed.data;

    const profile = await prisma.birthProfile.create({
      data: {
        birthDate: new Date(birthDate),
        birthTime: birthTime ?? null,
        birthCity: birthCity ?? null,
        birthLat: birthLat ?? null,
        birthLon: birthLon ?? null,
        timezone: timezone ?? null,
        sessionToken: sessionToken ?? null,
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("Error creating birth profile:", error);
    return NextResponse.json(
      { error: "Failed to create birth profile" },
      { status: 500 }
    );
  }
}
