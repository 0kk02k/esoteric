import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    
    // Check if user already has an active subscription
    const existingSub = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "active",
      },
    });

    if (existingSub) {
      return NextResponse.json({ message: "Already have an active subscription" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    await prisma.subscription.create({
      data: {
        userId,
        plan: "PLUS",
        status: "active",
        startDate,
        endDate,
        stripePriceId: "sim_plus_123",
        stripeSubId: "sim_sub_" + Math.random().toString(36).substring(7),
      },
    });

    return NextResponse.json({ message: "Subscription simulated successfully" });
  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json({ error: "Failed to simulate subscription" }, { status: 500 });
  }
}
