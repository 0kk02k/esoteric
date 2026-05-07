import { NextRequest, NextResponse } from "next/server";
import { generateReading } from "@/lib/ai";
import type { TarotCard } from "@/lib/ai";
import type { ChartResult } from "@/lib/astrology";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, cards, chart } = body as {
      question: string;
      cards: TarotCard[];
      chart?: ChartResult;
    };

    if (!question || !cards?.length) {
      return NextResponse.json({ error: "question and cards required" }, { status: 400 });
    }

    const reading = await generateReading({ question, cards, chart });
    return NextResponse.json(reading);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
