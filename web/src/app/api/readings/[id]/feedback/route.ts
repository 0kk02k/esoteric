import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createFeedbackSchema } from "@/lib/validation";

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
    const parsed = createFeedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { rating, tags, comment } = parsed.data;

    const feedback = await prisma.feedback.create({
      data: {
        readingId: id,
        rating,
        tags: tags ? JSON.stringify(tags) : null,
        comment: comment ?? null,
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "Failed to create feedback" },
      { status: 500 }
    );
  }
}
