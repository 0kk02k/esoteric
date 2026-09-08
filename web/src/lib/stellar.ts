/**
 * Reine Sternenfeld-Logik für die Kartenwahl — kein React, kein framer-motion,
 * damit die node-env-Tests ohne DOM laufen.
 *
 * Das Feld ist unified: alle 78 Lichter sind Sterne und damit direkt wählbar.
 * Die Reihenfolge der Tipps IST die Position (Gegenwart → Spannung → Impuls) —
 * die API mappt selectedCardIds per Index auf die Positionen.
 */

export type Star = { id: string; x: number; y: number; size: number; brightness: number };

export type FieldDimensions = { width: number; height: number };

export const REQUIRED_STARS = 3;

export const POSITIONS = [
  { id: "gegenwart", label: "Gegenwart", hint: "Wo du gerade stehst" },
  { id: "spannung", label: "Spannung", hint: "Was dich innerlich spannt" },
  { id: "impuls", label: "Impuls", hint: "Wohin es dich zieht" },
] as const;

/** Tipp-Radius in Pixeln — die ganze Fläche ist das Ziel, nicht der exakte Stern. */
export const TAP_RADIUS_PX = 64;

/**
 * Deterministische Sterne aus Karten-IDs (Grid + seeded Jitter).
 * Jede Karten-ID wird genau ein Stern — die Wahl im Feld ist eine echte Wahl.
 */
export function generateStars(cardIds: string[], gridCols = 9): Star[] {
  const stars: Star[] = [];
  const gridRows = Math.ceil(cardIds.length / gridCols);

  for (let i = 0; i < cardIds.length; i++) {
    const col = i % gridCols;
    const row = Math.floor(i / gridCols);

    const baseX = ((col + 0.5) / gridCols) * 100;
    const baseY = ((row + 0.5) / gridRows) * 100;

    const hash = cardIds[i]!.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const jitterX = ((hash % 37) - 18) * 0.8;
    const jitterY = ((hash % 29) - 14) * 0.8;

    stars.push({
      id: cardIds[i]!,
      x: Math.max(4, Math.min(96, baseX + jitterX)),
      y: Math.max(4, Math.min(96, baseY + jitterY)),
      size: 4 + (hash % 6) * 0.5,
      brightness: 0.3 + (hash % 40) / 100,
    });
  }

  return stars;
}

/** Kleinster Abstand zweier Sterne (in %-Einheiten); Infinity bei < 2. */
export function minPairDistance(stars: Star[]): number {
  let min = Infinity;
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i]!.x - stars[j]!.x;
      const dy = stars[i]!.y - stars[j]!.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < min) min = d;
    }
  }
  return min;
}

const clampField = (v: number) => Math.max(4, Math.min(96, v));

/**
 * Löst Kollisionen des Jitters deterministisch auf: Paare unter minDist
 * werden in Index-Reihenfolge auseinandergedrückt, danach geclampt.
 * Trifft ein Stern dabei den Feldrand, wandert der volle Push auf den
 * Partner — sonst würden Randsterne die 7 % nie halten.
 */
export function relaxStars(stars: Star[], minDist = 7, iterations = 64): Star[] {
  const relaxed = stars.map((s) => ({ ...s }));
  const apply = (s: Star, dx: number, dy: number) => {
    const beforeX = s.x;
    const beforeY = s.y;
    s.x = clampField(s.x + dx);
    s.y = clampField(s.y + dy);
    // Wie viel hat der Rand vom Push verschluckt?
    return { absorbedX: dx - (s.x - beforeX), absorbedY: dy - (s.y - beforeY) };
  };
  for (let iter = 0; iter < iterations; iter++) {
    let moved = false;
    for (let i = 0; i < relaxed.length; i++) {
      for (let j = i + 1; j < relaxed.length; j++) {
        const a = relaxed[i]!;
        const b = relaxed[j]!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= minDist) continue;
        const push = (minDist - dist) / 2;
        let ux = dx / dist;
        let uy = dy / dist;
        if (dist === 0) {
          // Deckungsgleich: deterministisch diagonal auseinander
          ux = i % 2 === 0 ? 0.7071 : -0.7071;
          uy = 0.7071;
        }
        const absorbedA = apply(a, -ux * push, -uy * push);
        apply(b, ux * push, uy * push);
        // Vom Rand verschluckter Push wandert auf den Partner
        if (Math.abs(absorbedA.absorbedX) > 1e-9 || Math.abs(absorbedA.absorbedY) > 1e-9) {
          apply(b, ux * Math.abs(absorbedA.absorbedX) + ux * Math.abs(absorbedA.absorbedY), uy * Math.abs(absorbedA.absorbedX) + uy * Math.abs(absorbedA.absorbedY));
        }
        moved = true;
      }
    }
    if (!moved) break;
  }
  return relaxed;
}

/**
 * Nächstgelegener Stern zu einem Tipp — Distanz in PIXELN, denn bei einem
 * 4:5-Feld lügen Prozent-Differenzen (Y dehnt sich stärker aus).
 * null, wenn kein Stern innerhalb maxRadiusPx liegt.
 */
export function nearestStar(
  stars: Star[],
  xPct: number,
  yPct: number,
  dims: FieldDimensions,
  maxRadiusPx = TAP_RADIUS_PX,
): Star | null {
  let best: Star | null = null;
  let bestDist = Infinity;
  for (const star of stars) {
    const dx = ((star.x - xPct) / 100) * dims.width;
    const dy = ((star.y - yPct) / 100) * dims.height;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < bestDist) {
      bestDist = dist;
      best = star;
    }
  }
  if (!best || bestDist > maxRadiusPx) return null;
  return best;
}

/** Blindwahl: ein zufällig-freier Stern (Tastatur/Screenreader-Pfad). */
export function drawFreeStar(
  stars: Star[],
  selectedIds: string[],
  rand: () => number = Math.random,
): Star | null {
  const chosen = new Set(selectedIds);
  const free = stars.filter((s) => !chosen.has(s.id));
  if (free.length === 0) return null;
  return free[Math.floor(rand() * free.length)] ?? null;
}

/** Enthalten → entfernen; sonst anhängen, solange Platz ist. Nie Duplikate. */
export function toggleStar(selectedIds: string[], id: string, max = REQUIRED_STARS): string[] {
  if (selectedIds.includes(id)) return selectedIds.filter((s) => s !== id);
  if (selectedIds.length >= max) return selectedIds;
  return [...selectedIds, id];
}

/** Entfernt einen Stern, relative Reihenfolge der restlichen bleibt. */
export function removeStar(selectedIds: string[], id: string): string[] {
  return selectedIds.filter((s) => s !== id);
}

export function isConstellationComplete(selectedIds: string[]): boolean {
  return selectedIds.length === REQUIRED_STARS;
}

export type Segment = { from: Star; to: Star; closing: boolean };

/**
 * Linien der Konstellation in Wahl-Reihenfolge; bei drei Sternen schließt
 * das letzte Segment die Figur zurück zum ersten Punkt.
 */
export function constellationSegments(stars: Star[], selectedIds: string[]): Segment[] {
  const byId = new Map(stars.map((s) => [s.id, s]));
  const chosen = selectedIds
    .map((id) => byId.get(id))
    .filter((s): s is Star => Boolean(s))
    .slice(0, REQUIRED_STARS);

  const segments: Segment[] = [];
  for (let i = 1; i < chosen.length; i++) {
    segments.push({ from: chosen[i - 1]!, to: chosen[i]!, closing: false });
  }
  if (chosen.length === REQUIRED_STARS) {
    segments.push({ from: chosen[chosen.length - 1]!, to: chosen[0]!, closing: true });
  }
  return segments;
}
