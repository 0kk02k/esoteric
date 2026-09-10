// ---------------------------------------------------------------------------
// Symbol-Plaketten: reine Logik für den „Synthese aus Astrologie und Tarot“-
// Abschnitt der KI-Deutung. Zerlegt den LLM-Text in >>-Blöcke und verknüpft
// sie mit den exakten Chart-Daten (Swiss Ephemeris). Kein React — bewusst
// testbar gehalten. Ohne Chart oder ohne Match liefern die Matcher null:
// die Plakette rendert dann ohne Datenzeile, es wird nichts erfunden.
// ---------------------------------------------------------------------------

import type { Aspect, ChartResponse, PlanetPosition } from "./astrology";
import { aspectGlyph, planetGlyph } from "./astroGlyphs";

export type SynthesisBlock = {
  heading: string;
  paragraphs: string[];
};

export type ParsedSynthesis = {
  /** Absätze vor dem ersten >>-Block (LLM führt manchmal ein). */
  intro: string[];
  blocks: SynthesisBlock[];
};

export const PLANET_NAMES = ["Sonne", "Mond", "Merkur", "Venus", "Mars", "Jupiter", "Saturn"] as const;
export const ASPECT_TYPES = ["Konjunktion", "Opposition", "Trigon", "Quadrat", "Sextil"] as const;
export const ZODIAC_SIGNS = [
  "Widder",
  "Stier",
  "Zwillinge",
  "Krebs",
  "Löwe",
  "Jungfrau",
  "Waage",
  "Skorpion",
  "Schütze",
  "Steinbock",
  "Wassermann",
  "Fische",
] as const;

const TEASER_MAX_LENGTH = 200;
const TEASER_MAX_SENTENCES = 2;

/** Findet Namen als ganze Wörter (groß-/klein­unempfindlich), in Reihenfolge des Vorkommens. */
function findNames(text: string, names: readonly string[]): string[] {
  return names
    .map((name) => {
      const match = text.match(new RegExp(`\\b${name}\\b`, "i"));
      return match ? { name, index: match.index ?? 0 } : null;
    })
    .filter((entry): entry is { name: string; index: number } => entry !== null)
    .sort((a, b) => a.index - b.index)
    .map((entry) => entry.name);
}

function toParagraphs(lines: string[]): string[] {
  return lines
    .join("\n")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function parseSynthesisBlocks(body: string): ParsedSynthesis {
  const introLines: string[] = [];
  const blocks: { heading: string; lines: string[] }[] = [];

  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith(">>")) {
      blocks.push({ heading: trimmed.replace(/^>>\s*/, "").trim(), lines: [] });
      continue;
    }
    if (blocks.length > 0) {
      blocks[blocks.length - 1].lines.push(line);
    } else {
      introLines.push(line);
    }
  }

  return {
    intro: toParagraphs(introLines),
    blocks: blocks
      .filter((block) => block.heading.length > 0)
      .map((block) => ({ heading: block.heading, paragraphs: toParagraphs(block.lines) }))
      .filter((block) => block.paragraphs.length > 0),
  };
}

export function makeTeaser(paragraphs: string[]): { teaser: string; rest: string[] } {
  const [first, ...others] = paragraphs.filter(Boolean);
  if (!first) return { teaser: "", rest: [] };

  const sentences = first.split(/(?<=[.!?…])\s+/);
  let teaser = sentences[0] ?? "";
  let taken = 1;
  for (const sentence of sentences.slice(1, TEASER_MAX_SENTENCES)) {
    if (`${teaser} ${sentence}`.length > TEASER_MAX_LENGTH) break;
    teaser = `${teaser} ${sentence}`;
    taken += 1;
  }

  const restFirst = sentences.slice(taken).join(" ").trim();
  const rest = [restFirst, ...others].filter(Boolean);
  return { teaser: teaser.trim(), rest };
}

export function matchPlanet(heading: string, chart?: ChartResponse | null): PlanetPosition | null {
  if (!chart) return null;
  const [name] = findNames(heading, PLANET_NAMES);
  if (!name) return null;
  return chart.planets.find((planet) => planet.name.toLowerCase() === name.toLowerCase()) ?? null;
}

export function matchAspect(heading: string, chart?: ChartResponse | null): Aspect | null {
  if (!chart) return null;
  const [aspectType] = findNames(heading, ASPECT_TYPES);
  const planets = findNames(heading, PLANET_NAMES);
  if (!aspectType || planets.length < 2) return null;

  const [a, b] = planets;
  return (
    chart.aspects.find((aspect) => {
      const typeMatches = aspect.type.toLowerCase() === aspectType.toLowerCase();
      const pairMatches =
        (aspect.planet1.toLowerCase() === a.toLowerCase() && aspect.planet2.toLowerCase() === b.toLowerCase()) ||
        (aspect.planet1.toLowerCase() === b.toLowerCase() && aspect.planet2.toLowerCase() === a.toLowerCase());
      return typeMatches && pairMatches;
    }) ?? null
  );
}

export type HeadingSymbols = {
  planets: string[];
  sign?: string;
  aspectType?: string;
};

export function extractSymbols(heading: string): HeadingSymbols {
  const [sign] = findNames(heading, ZODIAC_SIGNS);
  const [aspectType] = findNames(heading, ASPECT_TYPES);
  return {
    planets: findNames(heading, PLANET_NAMES),
    sign,
    aspectType,
  };
}

export function formatOrb(orb: number): string {
  return `Orb ${orb.toFixed(1).replace(".", ",")}°`;
}

export type PreparedPlaque = {
  title: string;
  glyph?: string;
  dataLine: string | null;
  teaser: string;
  rest: string[];
  accent: "gold" | "violet";
  /** Beteiligte Symbolnamen — data-astro-symbols für Stufe 2 (Radix-Highlight). */
  symbols: string[];
};

/** Führt alle Schritte Block → Plakette zusammen (von SynthesisPlaque konsumiert). */
export function preparePlaque(block: SynthesisBlock, chart?: ChartResponse | null): PreparedPlaque {
  const symbols = extractSymbols(block.heading);
  const isAspect = Boolean(symbols.aspectType) && symbols.planets.length >= 2;

  const combinedGlyph = isAspect
    ? symbols.planets.map(planetGlyph).join(aspectGlyph(symbols.aspectType ?? ""))
    : planetGlyph(symbols.planets[0] ?? "");

  const { teaser, rest } = makeTeaser(block.paragraphs);

  return {
    title: block.heading,
    glyph: combinedGlyph || undefined,
    dataLine: buildDataLine(block.heading, chart),
    teaser,
    rest,
    accent: isAspect ? "violet" : "gold",
    symbols: [...symbols.planets, symbols.aspectType, symbols.sign].filter(
      (symbol): symbol is string => Boolean(symbol),
    ),
  };
}

export function buildDataLine(heading: string, chart?: ChartResponse | null): string | null {
  const aspect = matchAspect(heading, chart);
  if (aspect) return formatOrb(aspect.orb);

  const planet = matchPlanet(heading, chart);
  if (!planet) return null;
  return planet.house ? `${planet.sign} · Haus ${planet.house}` : planet.sign;
}
