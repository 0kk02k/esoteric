import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

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

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter followup error:", response.status, err);
      return NextResponse.json({ error: `AI error: ${response.status}` }, { status: 502 });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() ?? "";

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

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error generating follow-up:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
