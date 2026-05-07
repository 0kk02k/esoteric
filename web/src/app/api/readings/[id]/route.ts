import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reading = await prisma.reading.findUnique({
      where: { id },
      include: {
        tarotDraws: {
          include: {
            card: true,
          },
        },
        feedback: true,
      },
    });

    if (!reading) {
      return NextResponse.json(
        { error: "Reading not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(reading);
  } catch (error) {
    console.error("Error fetching reading:", error);
    return NextResponse.json(
      { error: "Failed to fetch reading" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { status, readingText } = body as {
      status?: string;
      readingText?: string;
    };

    const existing = await prisma.reading.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Reading not found" },
        { status: 404 }
      );
    }

    const data: { status?: string; readingText?: string } = {};
    if (status !== undefined) data.status = status;
    if (readingText !== undefined) data.readingText = readingText;

    const updated = await prisma.reading.update({
      where: { id },
      data,
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
    console.error("Error updating reading:", error);
    return NextResponse.json(
      { error: "Failed to update reading" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get("sessionToken");

    const reading = await prisma.reading.findUnique({ where: { id } });
    if (!reading) {
      return NextResponse.json({ error: "Reading not found" }, { status: 404 });
    }

    if (sessionToken && reading.sessionToken !== sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.reading.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Error deleting reading:", error);
    return NextResponse.json({ error: "Failed to delete reading" }, { status: 500 });
  }
}
