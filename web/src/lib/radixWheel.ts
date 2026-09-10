// ---------------------------------------------------------------------------
// Radix-Kreis: reine Geometrie für das kompakte Himmels-Mandala über den
// Symbol-Plaketten (Stufe 2). Alle Winkel sind ekliptische Längengrade in
// Grad, 0° = 0° Widder. Auf dem Schirm liegt 0° Widder links, der Tierkreis
// läuft gegen den Uhrzeigersinn — wie im gedruckten Radix.
// Ohne Chart bzw. ohne passende Daten liefern die Funktionen neutrale
// Fallbacks; erfunden wird nichts.
// ---------------------------------------------------------------------------

import type { Aspect, ChartResponse } from "./astrology";
import { planetGlyph } from "./astroGlyphs";

export type WheelPoint = { x: number; y: number };

const SPREAD_PASSES = 40;

export function normalizeLongitude(longitude: number): number {
  return ((longitude % 360) + 360) % 360;
}

export function longitudeToXY(longitude: number, radius: number): WheelPoint {
  const theta = ((180 + normalizeLongitude(longitude)) * Math.PI) / 180;
  // Auf 4 Dezimalen gerundet: saubere SVG-Koordinaten, keine -0-Artefakte
  return {
    x: Math.round(radius * Math.cos(theta) * 1e4) / 1e4 + 0,
    y: Math.round(-radius * Math.sin(theta) * 1e4) / 1e4 + 0,
  };
}

export function circularGap(a: number, b: number): number {
  const diff = Math.abs(normalizeLongitude(a) - normalizeLongitude(b));
  return Math.min(diff, 360 - diff);
}

/**
 * Enge Konjunktionen würden im Kreis übereinander liegen. Entspannt die
 * Positionen paarweise, bis jeder Mindestabstand steht — symmetrisch zum
 * Schwerpunkt, Reihenfolge bleibt erhalten.
 */
export function spreadOverlaps(longitudes: number[], minGap: number): number[] {
  if (longitudes.length <= 1) return [...longitudes];

  // Sortierte Kreise mit Rückverweis auf den ursprünglichen Index
  const ring = longitudes
    .map((longitude, index) => ({ longitude: normalizeLongitude(longitude), index }))
    .sort((a, b) => a.longitude - b.longitude);

  for (let pass = 0; pass < SPREAD_PASSES; pass++) {
    let moved = false;
    for (let k = 0; k < ring.length; k++) {
      const a = ring[k];
      const b = ring[(k + 1) % ring.length];
      if (a === b) continue;
      const gap = circularGap(a.longitude, b.longitude);
      if (gap >= minGap) continue;
      const deficit = (minGap - gap) / 2;
      a.longitude = normalizeLongitude(a.longitude - deficit);
      b.longitude = normalizeLongitude(b.longitude + deficit);
      moved = true;
    }
    if (!moved) break;
  }

  const result = new Array<number>(longitudes.length);
  for (const entry of ring) result[entry.index] = entry.longitude;
  return result;
}

export type WheelPlanet = {
  name: string;
  glyph: string;
  longitude: number;
  displayLongitude: number;
};

const MIN_PLANET_GAP = 9;

export function planetsForWheel(chart: ChartResponse | null | undefined): WheelPlanet[] {
  if (!chart) return [];
  const planets = chart.planets.map((planet) => ({
    name: planet.name,
    glyph: planetGlyph(planet.name),
    longitude: normalizeLongitude(planet.longitude),
    displayLongitude: 0,
  }));
  const spread = spreadOverlaps(
    planets.map((planet) => planet.longitude),
    MIN_PLANET_GAP,
  );
  return planets.map((planet, i) => ({ ...planet, displayLongitude: spread[i] ?? planet.longitude }));
}

/** Zwölf Häuserspitzen; Fallbacks: Aszendent, sonst gleiche Sektoren ab 0° Widder. */
export function houseCuspsForWheel(chart: ChartResponse | null | undefined): number[] {
  if (chart?.houses?.length === 12) {
    return chart.houses.map((house) => normalizeLongitude(house.cuspLongitude));
  }
  const start = chart?.ascendant ? normalizeLongitude(chart.ascendant.longitude) : 0;
  return Array.from({ length: 12 }, (_, i) => normalizeLongitude(start + i * 30));
}

const TENSION_ASPECTS = new Set(["Quadrat", "Opposition"]);

export function isTensionAspect(type: string): boolean {
  return TENSION_ASPECTS.has(type);
}

export function aspectIsActive(aspect: Aspect, activeSymbols: string[]): boolean {
  return (
    activeSymbols.includes(aspect.type) &&
    activeSymbols.includes(aspect.planet1) &&
    activeSymbols.includes(aspect.planet2)
  );
}
