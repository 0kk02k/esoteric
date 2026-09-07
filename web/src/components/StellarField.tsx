"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export type Particle = {
  id: string; // Karten-ID — das Licht IST die Karte
  x: number; // 0-100 (percentage)
  y: number; // 0-100 (percentage)
  size: number; // visual dot size in px
  brightness: number; // 0-1
};

type StellarFieldProps = {
  cardIds: string[];
  onComplete: (selectedCardIds: string[]) => void;
  /** Fehler der übergeordneten Materialisierung: gibt das Feld zur Wiederholung frei. */
  error?: string | null;
};

const ZONES = [
  { id: "gegenwart", label: "Gegenwart", hint: "Wo du gerade stehst" },
  { id: "spannung", label: "Spannung", hint: "Was dich innerlich spannt" },
  { id: "impuls", label: "Impuls", hint: "Wohin es dich zieht" },
] as const;
const REQUIRED_ZONES = 3;

/** Deterministischer Hash für Licht-Auswahl (Laravel-Style, ausreichend verteilt). */
function seededHash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Zone eines Lichtpunkts. Zwei Topologien, ein Konzept:
 * Mobile (Bänder untereinander) zählt nach Y, Desktop (Spalten) nach X.
 */
export function zoneOfParticle(p: Particle, wide: boolean): number {
  const slice = wide ? p.x : p.y;
  return Math.min(REQUIRED_ZONES - 1, Math.floor(slice / (100 / REQUIRED_ZONES)));
}

/** Alle Lichter einer Zone, in Feld-Reihenfolge. */
export function particlesOfZone(particles: Particle[], zoneIndex: number, wide: boolean): Particle[] {
  return particles.filter((p) => zoneOfParticle(p, wide) === zoneIndex);
}

/**
 * Das Licht, das eine Zone beim Wählen entzündet — deterministisch pro Deck,
 * damit dieselbe Wahl dasselbe Bild ergibt und kein Licht doppelt brennt
 * (Zonen partitionieren das Feld disjunkt).
 */
export function pickIgnitedParticle(particles: Particle[], zoneIndex: number, wide: boolean): Particle | null {
  const candidates = particlesOfZone(particles, zoneIndex, wide);
  if (candidates.length === 0) return null;
  return candidates[seededHash(`${zoneIndex}:${candidates.length}:${particles.length}`) % candidates.length] ?? null;
}

/**
 * Generiert deterministische Lichtpunkte aus Karten-IDs (gefilterte Verteilung).
 * Die 78 Lichter bleiben sichtbar als Textur des Felds — sie sind Sternehimmel,
 * keine Ziele mehr.
 */
function generateParticles(cardIds: string[]): Particle[] {
  const particles: Particle[] = [];
  const gridCols = 9;
  const gridRows = Math.ceil(cardIds.length / gridCols);

  for (let i = 0; i < cardIds.length; i++) {
    const col = i % gridCols;
    const row = Math.floor(i / gridCols);

    const baseX = ((col + 0.5) / gridCols) * 100;
    const baseY = ((row + 0.5) / gridRows) * 100;

    const hash = cardIds[i]!.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const jitterX = ((hash % 37) - 18) * 0.8;
    const jitterY = ((hash % 29) - 14) * 0.8;

    particles.push({
      id: cardIds[i]!,
      x: Math.max(4, Math.min(96, baseX + jitterX)),
      y: Math.max(4, Math.min(96, baseY + jitterY)),
      size: 3 + (hash % 5) * 0.5,
      brightness: 0.3 + (hash % 40) / 100,
    });
  }

  return particles;
}

/**
 * Position eines Lichts INNERHALB seiner Zone (0-100 je Achse, button-relativ) —
 * die Deko- und entzündeten Lichter rendern pro Zone, die SVG-Konstellation
 * rechnet feld-relativ.
 */
export function particlePosInZone(p: Particle, zoneIndex: number, wide: boolean): { left: number; top: number } {
  const slice = 100 / REQUIRED_ZONES;
  if (wide) return { left: p.x - zoneIndex * slice, top: p.y };
  return { left: p.x, top: p.y - zoneIndex * slice };
}

/** Desktop-Spalten ab sm — der eine Holzweg zur Hydration: initial Mobile, Sync im Effekt. */
function useWideLayout(): boolean {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return wide;
}

/**
 * Das Resonanzfeld in seiner Zonen-Form (Shape-Brief 2026-09-09):
 * Drei Zonen — Gegenwart, Spannung, Impuls — sind die Ziele. Ein Tipp in eine
 * Zone entzündet eines ihrer Lichter und legt damit die Karte dieser Position
 * fest. Die Wahl ist reversibel und wird explizit bestätigt.
 */
export default function StellarField({ cardIds, onComplete, error }: StellarFieldProps) {
  const [particles] = useState<Particle[]>(() => generateParticles(cardIds));
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const wide = useWideLayout();
  const reduceMotion = useReducedMotion();

  const isComplete = selectedZones.length === REQUIRED_ZONES;
  // Erst bei Bestätigung sperren — und einen Fehler der Materialisierung wieder lösen
  const locked = submitted && !error;

  // Entzündete Lichter: pro Zone deterministisch, in Positionsreihenfolge
  const ignited = useMemo(
    () => ZONES.map((_, zoneIndex) => (selectedZones.includes(zoneIndex)
      ? pickIgnitedParticle(particles, zoneIndex, wide)
      : null)),
    [selectedZones, particles, wide]
  );

  const toggleZone = useCallback(
    (zoneIndex: number) => {
      if (locked) return;
      setSelectedZones((prev) =>
        prev.includes(zoneIndex) ? prev.filter((z) => z !== zoneIndex) : prev.length >= REQUIRED_ZONES ? prev : [...prev, zoneIndex],
      );
    },
    [locked]
  );

  const resetSelection = useCallback(() => {
    setSelectedZones([]);
  }, []);

  const confirmSelection = useCallback(() => {
    if (!isComplete || locked) return;
    const cardIdsInPositionOrder = ZONES.map((_, zoneIndex) => ignited[zoneIndex]?.id).filter(Boolean) as string[];
    setSubmitted(true);
    onComplete(cardIdsInPositionOrder);
  }, [isComplete, locked, ignited, onComplete]);

  const statusText = locked
    ? "Deine Wahl wird übernommen"
    : isComplete
      ? "Drei Zonen entzündet — bestätige deine Legung"
      : `${selectedZones.length} von ${REQUIRED_ZONES} Zonen entzündet`;

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Live status (screen readers announce every selection change) */}
      <div className="text-center space-y-2" aria-live="polite">
        <p className="text-sm font-mono text-gold/70 uppercase tracking-[0.3em]">
          {selectedZones.length === 0
            ? "Tippe in jede Zone — ein Licht entzündet deine Karte"
            : selectedZones.length < REQUIRED_ZONES
              ? `${REQUIRED_ZONES - selectedZones.length} ${selectedZones.length === 1 ? "Zone fehlt" : "Zonen fehlen"}`
              : "Konstellation vollständig"}
        </p>
        <p className="sr-only">{statusText}</p>
      </div>

      {/* The Stellar Field — Bänder auf Mobile, Spalten auf Desktop */}
      <div
        role="group"
        aria-label={`Resonanzfeld: wähle für ${ZONES.map((z) => z.label).join(", ")} je eine Karte`}
        className={cn(
          "relative w-full max-w-3xl rounded-3xl overflow-hidden border border-violet/10",
          "bg-[radial-gradient(ellipse_at_center,rgba(26,20,46,0.3),rgba(5,5,8,0.95))]",
          wide ? "aspect-[16/9] grid grid-cols-3 divide-x divide-violet/10" : "aspect-[4/5] flex flex-col divide-y divide-violet/10",
          locked && "pointer-events-none"
        )}
      >
        {/* Background grid lines (subtle) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <pattern id="stellar-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="0.5" fill="#C8A45D" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stellar-grid)" />
          </svg>
        </div>

        {/* Connection lines between ignited lights — die Konstellation */}
        {ignited.filter(Boolean).length >= 2 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" aria-hidden="true">
            {ignited
              .map((p, i) => ({ p, i }))
              .filter(({ p }) => p !== null)
              .slice(1)
              .map(({ p, i }, lineIndex) => {
                const prev = ignited[i - 1]!;
                if (!prev || !p) return null;
                return (
                  <motion.line
                    key={`line-${lineIndex}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ duration: 0.8 }}
                    x1={`${prev.x}%`}
                    y1={`${prev.y}%`}
                    x2={`${p.x}%`}
                    y2={`${p.y}%`}
                    stroke="#C8A45D"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                );
              })}
          </svg>
        )}

        {/* Zones — drei echte Buttons: ganze Fläche als Trefferziel */}
        {ZONES.map((zone, zoneIndex) => {
          const isSelected = selectedZones.includes(zoneIndex);
          const zoneParticles = particlesOfZone(particles, zoneIndex, wide);
          const lit = ignited[zoneIndex];

          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => toggleZone(zoneIndex)}
              disabled={locked}
              aria-pressed={isSelected}
              aria-label={
                isSelected
                  ? `Zone ${zone.label} gewählt (${zone.hint}) — abwählen`
                  : `Zone ${zone.label} — Karte für die ${zone.label} wählen (${zone.hint})`
              }
              className={cn(
                "group relative flex-1 min-h-0 text-left transition-colors duration-500",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-soft",
                isSelected ? "bg-gold/[0.07]" : "hover:bg-violet/[0.04]",
                locked && "cursor-default"
              )}
            >
              {/* Sternenhimmel dieser Zone — Dekoration, keine Ziele */}
              <span aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
                {zoneParticles.map((particle) => {
                  const pos = particlePosInZone(particle, zoneIndex, wide);
                  return (
                    <span
                      key={particle.id}
                      className="absolute rounded-full bg-white/60"
                      style={{
                        left: `${pos.left}%`,
                        top: `${pos.top}%`,
                        width: particle.size,
                        height: particle.size,
                        marginLeft: -particle.size / 2,
                        marginTop: -particle.size / 2,
                        opacity: 0.3 + particle.brightness * 0.6,
                      }}
                    />
                  );
                })}
              </span>

              {/* Entzündetes Licht — der gewählte Punkt der Zone */}
              {lit && (() => {
                const pos = particlePosInZone(lit, zoneIndex, wide);
                return (
                  <motion.span
                    aria-hidden="true"
                    initial={reduceMotion ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="absolute z-10 grid place-items-center pointer-events-none"
                    style={{
                      left: `${pos.left}%`,
                      top: `${pos.top}%`,
                      width: 44,
                      height: 44,
                      marginLeft: -22,
                      marginTop: -22,
                    }}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-gold shadow-[0_0_26px_rgba(200,164,93,0.95)] ring-2 ring-gold/40" />
                  </motion.span>
                );
              })()}

              {/* Positionslabel in der Zone — erklärt die Position von selbst */}
              <span className="absolute z-10 left-4 top-3 sm:left-6 sm:top-1/2 sm:-translate-y-1/2 flex flex-col gap-1 pointer-events-none">
                <span
                  className={cn(
                    "text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] transition-colors",
                    isSelected ? "text-gold" : "text-text-secondary group-hover:text-text"
                  )}
                >
                  {zone.label} {isSelected && "· entzündet"}
                </span>
                {/* Die Bedeutung der Zone steht auch mobil — das Ritual darf
                    nicht nur auf Desktop erklärbar sein */}
                <span className="text-[11px] text-text-muted max-w-[18ch] leading-snug">
                  {zone.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Confirm / reset — explizit, damit ein Fehlklick nichts zerstört */}
      <AnimatePresence>
        {isComplete && !locked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-lg font-display text-gold">Drei Lichter entzündet</p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button onClick={confirmSelection} className="px-12 h-14">
                Legung bestätigen
              </Button>
              <Button onClick={resetSelection} variant="ghost" className="px-8 h-14">
                Neu wählen
              </Button>
            </div>
          </motion.div>
        )}
        {locked && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-mono text-text-muted uppercase tracking-widest"
          >
            Karten werden gezogen...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
