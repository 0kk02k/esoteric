import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateReading } from "@/lib/ai";
import type { TarotCard as AITarotCard } from "@/lib/ai";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { question, sessionToken } = body as {
      question: string;
      sessionToken?: string;
    };

    if (!question || question.trim().length < 3) {
      return NextResponse.json(
        { error: "Follow-up question required (min 3 chars)" },
        { status: 400 },
      );
    }

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

    if (!reading.readingText) {
      return NextResponse.json(
        { error: "Reading must be completed before follow-up" },
        { status: 409 },
      );
    }

    if (sessionToken && reading.sessionToken !== sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const cards: AITarotCard[] = reading.tarotDraws.map((draw) => ({
      name: draw.card.name,
      position: draw.position,
      upright: draw.upright,
    }));

    const followupQuestion = `${reading.question}\n\nNachfrage: ${question}\n\nBisherige Deutung (darauf aufbauend antworten):\n${reading.readingText.slice(0, 1000)}`;

    const result = await generateReading({
      question: followupQuestion,
      cards,
      sessionToken: reading.sessionToken ?? undefined,
    });

    const existingContext = reading.contextJson
      ? JSON.parse(reading.contextJson)
      : {};
    const updatedContext = {
      ...existingContext,
      followup: question,
      followupResponse: result.text,
    };

    await prisma.reading.update({
      where: { id },
      data: { contextJson: JSON.stringify(updatedContext) },
    });

    return NextResponse.json({ text: result.text, model: result.model });
  } catch (error) {
    console.error("Error generating follow-up:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
