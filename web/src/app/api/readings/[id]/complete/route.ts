import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { completeReadingSchema } from "@/lib/validation";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reading = await prisma.reading.findUnique({ where: { id } });
    if (!reading) {
      return NextResponse.json(
        { error: "Reading not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = completeReadingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { readingText, modelUsed, tokensUsed, latencyMs, contextJson } =
      parsed.data;

    const updated = await prisma.reading.update({
      where: { id },
      data: {
        status: "completed",
        readingText,
        modelUsed: modelUsed ?? null,
        tokensUsed: tokensUsed ?? null,
        latencyMs: latencyMs ?? null,
        contextJson: contextJson ?? null,
      },
      include: {
        tarotDraws: {
          include: {
            card: true,
          },
        },
        feedback: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error completing reading:", error);
    return NextResponse.json(
      { error: "Failed to complete reading" },
      { status: 500 }
    );
  }
}
