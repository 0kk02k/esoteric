import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkUsageLimit, incrementUsageCount } from "@/lib/usage-limits";
import { auth } from "@/auth";
import { logger } from "@/lib/logger";
import { chatCompletion } from "@/lib/ai";

const FOLLOWUP_SYSTEM_PROMPT = `Du bist ein empathischer, tiefgründiger Berater für symbolische Reflexion. Du knüpfst an eine bereits erstellte Tarot-/Astrologie-Deutung an und beantwortest Nachfragen des Ratsuchenden.

Regeln:
- Antworte direkt und auf die Frage fokussiert — kein neues vollständiges Reading.
- Beziehe dich auf die bereits gezogenen Karten und astrologischen Aspekte.
- Bleibe im Tonfall poetisch, aber klar.
- Keine deterministischen Vorhersagen.
- Antworte auf Deutsch.`;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    logger.info("ai", "Starting follow-up generation", { readingId: id });
    const session = await auth();
    const userId = session?.user?.id;
    const body = await request.json();
    const { question, sessionToken, history } = body as {
      question: string;
      sessionToken?: string;
      history?: { role: "user" | "assistant"; content: string }[];
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

    // Check usage limits for follow-up
    const limitCheck = await checkUsageLimit(
      { userId, sessionToken: sessionToken || reading.sessionToken || undefined },
      "followup"
    );

    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: "Follow-up limit reached",
          readingsRemaining: limitCheck.readingsRemaining,
          followupsRemaining: limitCheck.followupsRemaining,
          resetAt: limitCheck.resetAt,
        },
        { status: 429 },
      );
    }

    if (reading.userId) {
      // Reading belongs to a logged-in user — allow access without sessionToken check
    } else if (sessionToken && reading.sessionToken !== sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const cards = reading.tarotDraws.map((d) => {
      const orientation = d.upright ? "aufrecht" : "umgekehrt";
      return `${d.card.name} (${d.position}, ${orientation})`;
    }).join(", ");

    const contextBlock = `Ursprüngliche Frage: ${reading.question}\nGezogene Karten: ${cards}\n\nBisherige Deutung:\n${reading.readingText.slice(0, 2000)}`;

    const messages = [
      { role: "system" as const, content: FOLLOWUP_SYSTEM_PROMPT },
      { role: "system" as const, content: contextBlock },
      ...(history || []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: question },
    ];

    let text: string;
    try {
      // Reasoning-Modell: auch hier muss Reasoning + Antwort ins Budget passen
      const completion = await chatCompletion(messages, { maxTokens: 4096 });
      text = completion.text.trim();
    } catch (aiError) {
      const message = aiError instanceof Error ? aiError.message : String(aiError);
      logger.error("ai", "Follow-up generation failed", { readingId: id, error: message });
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const existingContext = reading.contextJson
      ? JSON.parse(reading.contextJson)
      : {};
    const updatedContext = {
      ...existingContext,
      followupHistory: [...(existingContext.followupHistory || []), { question, answer: text }],
    };

    await prisma.reading.update({
      where: { id },
      data: { contextJson: JSON.stringify(updatedContext) },
    });

    // Increment follow-up usage count
    await incrementUsageCount(
      { userId, sessionToken: sessionToken || reading.sessionToken || undefined },
      "followup"
    );

    logger.info("ai", "Follow-up generation successful", { readingId: id });

    // Restnachfragen für heute mitgeben (limitCheck lieferte den Stand VOR
    // dem Increment), damit die UI sie anzeigen kann, bevor das Limit greift.
    return NextResponse.json({
      text,
      followupsRemaining: Math.max(0, limitCheck.followupsRemaining - 1),
    });
  } catch (error) {
    logger.error("ai", "Follow-up generation failed", {
      readingId: (await params).id,
      error: error instanceof Error ? error.message : String(error),
    });
    console.error("Error generating follow-up:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
