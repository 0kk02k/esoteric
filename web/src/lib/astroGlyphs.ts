// ---------------------------------------------------------------------------
// Astro-Glyphen (Unicode) für Planeten, Tierkreiszeichen und Aspekte.
// Glyphen sind Deko: Die Information steht immer zusätzlich als Mono-Text
// daneben (design.md — keine Information nur über Symbole).
// ---------------------------------------------------------------------------

export const PLANET_GLYPHS: Record<string, string> = {
  Sonne: "☉",
  Mond: "☽",
  Merkur: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
};

export const SIGN_GLYPHS: Record<string, string> = {
  Widder: "♈",
  Stier: "♉",
  Zwillinge: "♊",
  Krebs: "♋",
  Löwe: "♌",
  Jungfrau: "♍",
  Waage: "♎",
  Skorpion: "♏",
  Schütze: "♐",
  Steinbock: "♑",
  Wassermann: "♒",
  Fische: "♓",
};

export const ASPECT_GLYPHS: Record<string, string> = {
  Konjunktion: "☌",
  Opposition: "☍",
  Trigon: "△",
  Quadrat: "□",
  Sextil: "✶",
};

export function planetGlyph(name: string): string {
  return PLANET_GLYPHS[name] ?? "";
}

export function signGlyph(name: string): string {
  return SIGN_GLYPHS[name] ?? "";
}

export function aspectGlyph(name: string): string {
  return ASPECT_GLYPHS[name] ?? "";
}
