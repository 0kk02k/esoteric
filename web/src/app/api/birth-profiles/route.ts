import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createBirthProfileSchema } from "@/lib/validation";
import { geocodeCity } from "@/lib/geocoding";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.birthProfile.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching birth profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch birth profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const body = await request.json();
    const parsed = createBirthProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { birthDate, birthTime, birthCity, timezone, sessionToken } =
      parsed.data;
    let { birthLat, birthLon } = parsed.data;

    // Automatically geocode city if coordinates are missing
    if (birthCity && (birthLat == null || birthLon == null)) {
      const geo = await geocodeCity(birthCity);
      if (geo) {
        birthLat = geo.lat;
        birthLon = geo.lon;
      }
    }

    const profile = await prisma.birthProfile.create({
      data: {
        userId,
        sessionToken: userId ? undefined : sessionToken,
        birthDate: new Date(birthDate),
        birthTime,
        birthCity,
        birthLat,
        birthLon,
        timezone,
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

