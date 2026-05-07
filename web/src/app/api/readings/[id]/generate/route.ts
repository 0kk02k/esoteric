import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateReading } from "@/lib/ai";
import type { TarotCard as AITarotCard } from "@/lib/ai";
import type { ChartResult } from "@/lib/astrology";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const reading = await prisma.reading.findUnique({
      where: { id },
      include: {
        tarotDraws: { include: { card: true } },
        birthProfile: true,
      },
    });

    if (!reading) {
      return NextResponse.json({ error: "Reading not found" }, { status: 404 });
    }

    if (reading.status === "completed") {
      return NextResponse.json(
        { error: "Reading already completed" },
        { status: 409 },
      );
    }

    const cards: AITarotCard[] = reading.tarotDraws.map((draw) => ({
      name: draw.card.name,
      position: draw.position,
      upright: draw.upright,
    }));

    let chart: ChartResult | undefined;
    if (reading.birthProfile?.birthLat != null && reading.birthProfile?.birthLon != null) {
      const bp = reading.birthProfile;
      const bd = new Date(bp.birthDate);
      try {
        const chartRes = await fetch(`${request.nextUrl.origin}/api/astrology/chart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year: bd.getFullYear(),
            month: bd.getMonth() + 1,
            day: bd.getDate(),
            hour: 12,
            minute: 0,
            latitude: bp.birthLat,
            longitude: bp.birthLon,
            timezoneOffset: -(bd.getTimezoneOffset() / 60),
            timeUnknown: !bp.birthTime,
          }),
        });
        if (chartRes.ok) {
          chart = await chartRes.json();
        }
      } catch (err) {
        console.warn("[generate] Chart fetch failed, proceeding without chart:", err);
      }
    }

    const result = await generateReading({
      question: reading.question,
      cards,
      chart,
      sessionToken: reading.sessionToken ?? undefined,
    });

    await prisma.reading.update({
      where: { id },
      data: {
        status: "completed",
        readingText: result.text,
        modelUsed: result.model,
        tokensUsed: result.tokensUsed,
        latencyMs: result.latencyMs,
        promptVersion: result.promptVersion,
        safetyVersion: result.safetyVersion,
        contextJson: JSON.stringify({ cards, chart: chart ? "included" : null }),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating reading:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
