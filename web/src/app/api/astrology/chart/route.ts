import { NextRequest, NextResponse } from "next/server";

import {
  calculateNatalChartFromRequest,
  validateNatalChartRequest,
} from "@/lib/astrology";
import type { NatalChartRequest, ChartResponse, ValidationError } from "@/lib/astrology";

export async function POST(request: NextRequest) {
  try {
    const body: Partial<NatalChartRequest> = await request.json();

    // --- Validate input -------------------------------------------------------
    const errors: ValidationError[] = validateNatalChartRequest(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Validierung fehlgeschlagen", details: errors },
        { status: 400 }
      );
    }

    const req = body as NatalChartRequest;

    // --- Calculate chart ------------------------------------------------------
    const chart: ChartResponse = await calculateNatalChartFromRequest(req);

    return NextResponse.json(chart, { status: 200 });
  } catch (error) {
    console.error("Error calculating natal chart:", error);
    return NextResponse.json(
      { error: "Fehler bei der Geburtschart-Berechnung" },
      { status: 500 }
    );
  }
}
