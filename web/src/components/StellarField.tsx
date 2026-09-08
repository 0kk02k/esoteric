"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import {
  constellationSegments,
  drawFreeStar,
  generateStars,
  nearestStar,
  POSITIONS,
  relaxStars,
  removeStar,
  REQUIRED_STARS,
  toggleStar,
} from "@/lib/stellar";

type StellarFieldProps = {
  cardIds: string[];
  /** Karten-ID → Name: gewählte Sterne und Live-Region können sie benennen. */
  cardNames?: Record<string, string>;
  /** Bereits getroffene Wahl (Restore/Retry) — bleibt bis zur Neuwahl bestehen. */
  initialSelectedCardIds?: string[];
  onComplete: (selectedCardIds: string[]) => void;
  /** Fehler der übergeordneten Erstellung: entriegelt das Feld zur Umwahl. */
  error?: string | null;
};

/**
 * Das Sternenfeld in seiner unified-Form: alle 78 Lichter sind Sterne und
 * damit direkt wählbar — kein Zonen-Raster mehr. Die Reihenfolge der Tipps
 * IST die Position (Gegenwart → Spannung → Impuls). Nach jedem Tipp zeichnet
 * sich die Linie zum vorherigen Stern; beim dritten schließt sich die Figur
 * zum ersten, alle Linien leuchten einmal auf — und die Wahl bestätigt sich
 * selbst (der dritte Tipp ist das Versprechen). Ein Fehler der Erstellung
 * entriegelt das Feld: umwählen, die nächste vollständige Figur zählt wieder.
 */
export default function StellarField({
  cardIds,
  cardNames = {},
  initialSelectedCardIds = [],
  onComplete,
  error,
}: StellarFieldProps) {
  const stars = useMemo(() => relaxStars(generateStars(cardIds)), [cardIds]);
  const [selected, setSelected] = useState<string[]>(() =>
    initialSelectedCardIds.filter((id) => cardIds.includes(id)),
  );
  const [submitted, setSubmitted] = useState(false);
  const [glow, setGlow] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const lastPickAt = useRef(0);
  const submitTimer = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  const reduceMotion = useReducedMotion();

  // `error` entriegelt: gesperrt bleibt nur, was erfolgreich übernommen wurde
  const locked = submitted && !error;

  const selectedStars = useMemo(() => {
    const byId = new Map(stars.map((s) => [s.id, s]));
    return selected
      .map((id) => byId.get(id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
  }, [stars, selected]);

  const segments = useMemo(() => constellationSegments(stars, selected), [stars, selected]);
  const isComplete = selected.length === REQUIRED_STARS;

  // Immer die aktuelle Callback-Instanz (der Submit-Timer feuert verzögert)
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  useEffect(
    () => () => {
      if (submitTimer.current) window.clearTimeout(submitTimer.current);
    },
    [],
  );

  const commit = (next: string[]) => {
    setSelected(next);
    if (next.length < REQUIRED_STARS) {
      setGlow(false);
      return;
    }
    // Auto-Bestätigung: die geschlossene Figur ist das Versprechen. Ein
    // vorheriger Fehler (`error` gesetzt) hat die Wahl wieder geöffnet.
    if (next.length === REQUIRED_STARS && (!submitted || error)) {
      setSubmitted(true);
      if (reduceMotion) {
        onCompleteRef.current(next);
        return;
      }
      // Schlussstrich + Glow-Puls bekommen ihren Moment, dann läuft der POST
      submitTimer.current = window.setTimeout(() => onCompleteRef.current(next), 1100);
    }
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (locked) return;
    const now = Date.now();
    if (now - lastPickAt.current < 250) return; // Doppel-Tap-Schutz
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    const star = nearestStar(
      stars,
      ((e.clientX - rect.left) / rect.width) * 100,
      ((e.clientY - rect.top) / rect.height) * 100,
      { width: rect.width, height: rect.height },
    );
    if (!star) return;
    lastPickAt.current = now;
    commit(toggleStar(selected, star.id));
  };

  const drawRandom = () => {
    if (locked || isComplete) return;
    const star = drawFreeStar(stars, selected);
    if (star) commit(toggleStar(selected, star.id));
  };

  const undoLast = () => {
    if (locked || selected.length === 0) return;
    commit(removeStar(selected, selected[selected.length - 1]!));
  };

  const counterText =
    selected.length === 0
      ? "Berühre drei Sterne — ihre Reihenfolge ist deine Legung"
      : isComplete
        ? "Konstellation geschlossen"
        : `${selected.length} von ${REQUIRED_STARS} Sternen gewählt`;

  const statusText =
    selected.length === 0
      ? "Noch kein Stern gewählt. Der erste steht für deine Gegenwart."
      : selected
          .map((id, i) => `${i + 1}. ${POSITIONS[i]?.label ?? "Position"}: ${cardNames[id] ?? "ein Stern"}`)
          .join(". ") +
        (isComplete
          ? ". Konstellation geschlossen — deine Legung wird erstellt."
          : POSITION_SELECT_HINTS[selected.length]);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Live status (screen readers announce every selection change) —
          Mindesthöhe, damit kein Textwachstum das Feld unter dem Finger wegschiebt */}
      <div className="flex min-h-[40px] items-center justify-center text-center" aria-live="polite">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-gold/70">{counterText}</p>
        <p className="sr-only">{statusText}</p>
      </div>

      {/* Das Feld — eine Fläche, jeder Stern antippbar (Nearest-Pick) */}
      <div
        ref={fieldRef}
        role="group"
        onClick={handleTap}
        aria-label={`Sternenfeld. Berühre drei Sterne — ihre Reihenfolge ist deine Legung: ${POSITIONS.map((p) => p.label).join(", ")}.`}
        className={cn(
          "relative aspect-[4/5] w-full max-w-3xl touch-manipulation cursor-pointer overflow-hidden rounded-3xl sm:aspect-[16/9]",
          "border border-violet/10 bg-[radial-gradient(ellipse_at_center,rgba(26,20,46,0.3),rgba(5,5,8,0.95))]",
          locked && "pointer-events-none cursor-default",
        )}
      >
        {/* Background grid lines (subtle) */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <pattern id="stellar-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="0.5" fill="#C8A45D" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stellar-grid)" />
          </svg>
        </div>

        {/* Der Sternenhimmel — jedes Licht ist eine Karte */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {stars.map((star) => (
            <span
              key={star.id}
              className="absolute rounded-full bg-white/60"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                marginLeft: -star.size / 2,
                marginTop: -star.size / 2,
                opacity: 0.3 + star.brightness * 0.6,
              }}
            />
          ))}
        </span>

        {/* Die Konstellation — Linien zwischen den gewählten Sternen, die
            dritte schließt zum ersten; das Aufleuchten kommt mit dem Schluss */}
        <svg
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-10 h-full w-full transition-[filter] duration-500",
            glow && "drop-shadow-[0_0_6px_rgba(200,164,93,0.9)]",
          )}
        >
          {segments.map((seg) => (
            <motion.line
              key={`${seg.from.id}-${seg.to.id}-${seg.closing ? "closing" : "open"}`}
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: glow ? 1 : 0.55 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              onAnimationComplete={seg.closing && !reduceMotion ? () => setGlow(true) : undefined}
              x1={`${seg.from.x}%`}
              y1={`${seg.from.y}%`}
              x2={`${seg.to.x}%`}
              y2={`${seg.to.y}%`}
              stroke="#C8A45D"
              strokeWidth={glow ? 2.5 : 1.5}
              strokeDasharray="4 4"
            />
          ))}
        </svg>

        {/* Gewählte Sterne — nummeriert in Wahl-Reihenfolge */}
        {selectedStars.map((star, i) => (
          <motion.span
            key={star.id}
            aria-hidden="true"
            initial={reduceMotion ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="absolute z-20 grid place-items-center"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: 32,
              height: 32,
              marginLeft: -16,
              marginTop: -16,
            }}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-gold font-mono text-[10px] text-[color:var(--color-bg)] shadow-[0_0_22px_rgba(200,164,93,0.85)] ring-2 ring-gold/40">
              {i + 1}
            </span>
          </motion.span>
        ))}
      </div>

      {/* Positions-Chips — unter dem Feld: ihr Wachstum verschiebt nichts, was
          gerade angetippt wird */}
      <ol className="flex min-h-[30px] flex-wrap items-center justify-center gap-2" aria-hidden="true">
        {POSITIONS.map((pos, i) => {
          const starId = selected[i];
          return (
            <li
              key={pos.id}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
                starId
                  ? "border-gold/40 bg-gold/5 text-gold"
                  : "border-gold/10 text-text-muted",
              )}
            >
              {starId ? `${i + 1} · ${pos.label}${cardNames[starId] ? ` — ${cardNames[starId]}` : ""}` : pos.label}
            </li>
          );
        })}
      </ol>

      {/* Tastatur-/Screenreader-Pfad: Blindwahl + Zurücknehmen statt 78 Tabstopps */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {!isComplete && (
          <Button onClick={drawRandom} disabled={locked} className="h-14 px-10">
            Stern ziehen
          </Button>
        )}
        {selected.length > 0 && !locked && (
          <Button onClick={undoLast} variant="ghost" className="h-14 px-8">
            Zurücknehmen
          </Button>
        )}
      </div>

      {locked && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-xs uppercase tracking-widest text-text-muted"
          role="status"
        >
          Karten werden gezogen...
        </motion.p>
      )}
    </div>
  );
}

const POSITION_SELECT_HINTS = [
  "",
  " Als Nächstes: Spannung.",
  " Als Nächstes: Impuls.",
];
