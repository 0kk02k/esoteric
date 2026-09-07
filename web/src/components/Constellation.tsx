import { cn } from "@/lib/utils";

export type ConstellationPoint = { x: number; y: number };

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const VIEW_W = 120;
const VIEW_H = 56;
const PAD = 10;

/**
 * Deterministischer Dreipunkt aus den Karten-IDs einer Legung — dasselbe Reading
 * zeichnet stets dieselbe Konstellation. Im Flow entsteht sie aus den entzündeten
 * Lichtern des Resonanzfelds; im Archiv wird sie aus den IDs rekonstruiert, damit
 * auch gespeicherte Readings ihr Signet tragen.
 */
export function constellationPoints(cardIds: string[]): ConstellationPoint[] {
  return cardIds.slice(0, 3).map((id) => {
    const x = PAD + (hash(id) % 1000) / 1000 * (VIEW_W - 2 * PAD);
    const y = PAD + (hash(`${id}:y`) % 1000) / 1000 * (VIEW_H - 2 * PAD);
    return {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
    };
  });
}

/**
 * Das Signet einer Legung: drei goldene Lichter, verbunden durch eine
 * gestrichelte Linie — die verkleinerte Erinnerung an die Wahl im Feld.
 */
export function Constellation({ cardIds, className }: { cardIds: string[]; className?: string }) {
  const points = constellationPoints(cardIds);
  if (points.length < 2) return null;

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" className={cn("h-10 w-auto", className)}>
      {points.slice(1).map((p, i) => (
        <line
          key={`line-${i}`}
          x1={points[i]!.x}
          y1={points[i]!.y}
          x2={p.x}
          y2={p.y}
          stroke="rgba(200,164,93,0.5)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      ))}
      {points.map((p, i) => (
        <circle key={`point-${i}`} cx={p.x} cy={p.y} r={i === 0 ? 3.2 : 2.6} fill="#C8A45D" opacity={0.95 - i * 0.12} />
      ))}
    </svg>
  );
}
