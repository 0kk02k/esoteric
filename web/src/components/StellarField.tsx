"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Particle = {
  id: string;
  x: number; // 0-100 (percentage)
  y: number; // 0-100 (percentage)
  size: number; // base size in px
  brightness: number; // 0-1
  pulseOffset: number; // random offset for subtle shimmer
};

type StellarFieldProps = {
  cardIds: string[];
  onComplete: (selectedCardIds: string[]) => void;
};

const POSITION_LABELS = ["Gegenwart", "Spannung", "Impuls"];

/**
 * Generates deterministic particle positions from card IDs.
 * Uses a seeded distribution to avoid clustering.
 */
function generateParticles(cardIds: string[]): Particle[] {
  const particles: Particle[] = [];
  const gridCols = 9;
  const gridRows = Math.ceil(cardIds.length / gridCols);

  for (let i = 0; i < cardIds.length; i++) {
    const col = i % gridCols;
    const row = Math.floor(i / gridCols);

    // Base grid position with jitter for organic feel
    const baseX = ((col + 0.5) / gridCols) * 100;
    const baseY = ((row + 0.5) / gridRows) * 100;

    // Pseudo-random jitter from card ID hash
    const hash = cardIds[i]!.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const jitterX = ((hash % 37) - 18) * 0.8;
    const jitterY = ((hash % 29) - 14) * 0.8;

    particles.push({
      id: cardIds[i]!,
      x: Math.max(4, Math.min(96, baseX + jitterX)),
      y: Math.max(4, Math.min(96, baseY + jitterY)),
      size: 3 + (hash % 5) * 0.5,
      brightness: 0.3 + (hash % 40) / 100,
      pulseOffset: (hash % 100) / 100,
    });
  }

  return particles;
}

export default function StellarField({ cardIds, onComplete }: StellarFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles] = useState<Particle[]>(() => generateParticles(cardIds));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const ATTRACTION_RADIUS = 12; // percentage units for gravitational effect

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isComplete) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });

      // Find closest unselected particle
      let closest: string | null = null;
      let minDist = Infinity;
      for (const p of particles) {
        if (selectedIds.includes(p.id)) continue;
        const dist = Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2);
        if (dist < minDist && dist < ATTRACTION_RADIUS) {
          minDist = dist;
          closest = p.id;
        }
      }
      setHoveredId(closest);
    },
    [particles, selectedIds, isComplete]
  );

  const handlePointerLeave = useCallback(() => {
    setMousePos(null);
    setHoveredId(null);
  }, []);

  const handleSelect = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isComplete) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Find closest unselected particle
      let closest: string | null = null;
      let minDist = Infinity;
      for (const p of particles) {
        if (selectedIds.includes(p.id)) continue;
        const dist = Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2);
        if (dist < minDist && dist < ATTRACTION_RADIUS * 1.5) {
          minDist = dist;
          closest = p.id;
        }
      }

      if (closest && selectedIds.length < 3) {
        const newSelected = [...selectedIds, closest];
        setSelectedIds(newSelected);
        setHoveredId(null);

        if (newSelected.length === 3) {
          setIsComplete(true);
          // Small delay before callback for animation
          setTimeout(() => onComplete(newSelected), 1200);
        }
      }
    },
    [particles, selectedIds, isComplete, onComplete]
  );

  // Calculate gravitational displacement for each particle
  const getParticleTransform = useCallback(
    (particle: Particle) => {
      if (!mousePos || selectedIds.includes(particle.id)) return { dx: 0, dy: 0, scale: 1 };

      const dist = Math.sqrt((particle.x - mousePos.x) ** 2 + (particle.y - mousePos.y) ** 2);

      if (dist > ATTRACTION_RADIUS) return { dx: 0, dy: 0, scale: 1 };

      // Gravitational pull toward cursor
      const strength = 1 - dist / ATTRACTION_RADIUS;
      const angle = Math.atan2(mousePos.y - particle.y, mousePos.x - particle.x);
      const pull = strength * 3; // max 3% displacement

      return {
        dx: Math.cos(angle) * pull,
        dy: Math.sin(angle) * pull,
        scale: 1 + strength * 0.8,
      };
    },
    [mousePos, selectedIds]
  );

  // Selected particle positions (left side slots)
  const getSlotPosition = (index: number) => {
    return { x: 15 + index * 35, y: 108 };
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Instruction */}
      <div className="text-center space-y-2">
        <p className="text-sm font-mono text-gold/70 uppercase tracking-[0.3em]">
          {selectedIds.length === 0
            ? "Berühre das Feld — spüre die Resonanz"
            : selectedIds.length < 3
              ? `${3 - selectedIds.length} ${selectedIds.length === 2 ? "Impuls" : "Impulse"} verbleibend`
              : "Die Konstellation ist gewählt"}
        </p>
      </div>

      {/* Position indicators */}
      <div className="flex justify-center gap-8 sm:gap-12 w-full max-w-md">
        {POSITION_LABELS.map((label, i) => (
          <div
            key={label}
            className={cn(
              "flex flex-col items-center gap-2 transition-all duration-500",
              i < selectedIds.length ? "opacity-100" : "opacity-40"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                i < selectedIds.length
                  ? "border-gold bg-gold/20 shadow-[0_0_20px_rgba(200,164,93,0.4)]"
                  : "border-gold/20 bg-surface-raised/30"
              )}
            >
              {i < selectedIds.length && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 rounded-full bg-gold"
                />
              )}
            </div>
            <span className="text-[9px] font-mono text-gold/60 uppercase tracking-widest">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* The Stellar Field */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerUp={handleSelect}
        className={cn(
          "relative w-full aspect-[4/3] sm:aspect-[16/9] max-w-3xl rounded-3xl overflow-hidden cursor-crosshair select-none touch-none",
          "bg-[radial-gradient(ellipse_at_center,rgba(58,37,79,0.3),rgba(9,8,13,0.95))]",
          "border border-violet/10",
          isComplete && "pointer-events-none"
        )}
      >
        {/* Background grid lines (subtle) */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="stellar-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="0.5" fill="#C8A45D" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stellar-grid)" />
          </svg>
        </div>

        {/* Cursor glow */}
        {mousePos && !isComplete && (
          <div
            className="absolute pointer-events-none transition-opacity duration-300"
            style={{
              left: `${mousePos.x}%`,
              top: `${mousePos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-32 h-32 rounded-full bg-violet/10 blur-xl" />
            <div className="absolute inset-1/4 rounded-full bg-gold/5 blur-lg" />
          </div>
        )}

        {/* Particles */}
        {particles.map((particle) => {
          const isSelected = selectedIds.includes(particle.id);
          const isHovered = hoveredId === particle.id;
          const transform = getParticleTransform(particle);
          const selectionIndex = selectedIds.indexOf(particle.id);

          if (isSelected) {
            return (
              <motion.div
                key={particle.id}
                initial={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  scale: 2,
                }}
                animate={{
                  scale: [2, 1.5, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
              >
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-gold shadow-[0_0_30px_rgba(200,164,93,0.8)]" />
                  <div className="absolute inset-0 rounded-full bg-gold animate-ping opacity-30" />
                </div>
              </motion.div>
            );
          }

          return (
            <div
              key={particle.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out"
              style={{
                left: `${particle.x + transform.dx}%`,
                top: `${particle.y + transform.dy}%`,
              }}
            >
              <div
                className={cn(
                  "rounded-full transition-all duration-200",
                  isHovered
                    ? "bg-gold shadow-[0_0_20px_rgba(200,164,93,0.7)] ring-2 ring-gold/40"
                    : "bg-white/60 shadow-[0_0_4px_rgba(255,255,255,0.2)]"
                )}
                style={{
                  width: `${particle.size * transform.scale}px`,
                  height: `${particle.size * transform.scale}px`,
                  opacity: isHovered ? 1 : particle.brightness + (transform.scale - 1) * 0.3,
                }}
              />
            </div>
          );
        })}

        {/* Selection burst effects */}
        <AnimatePresence>
          {selectedIds.map((id, index) => {
            const particle = particles.find((p) => p.id === id);
            if (!particle) return null;
            return (
              <motion.div
                key={`burst-${id}`}
                initial={{ opacity: 1, scale: 0 }}
                animate={{ opacity: 0, scale: 4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
              >
                <div className="w-8 h-8 rounded-full border border-gold/60" />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Connection lines between selected particles */}
        {selectedIds.length >= 2 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {selectedIds.slice(1).map((id, i) => {
              const prev = particles.find((p) => p.id === selectedIds[i]);
              const curr = particles.find((p) => p.id === id);
              if (!prev || !curr) return null;
              return (
                <motion.line
                  key={`line-${i}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 0.8 }}
                  x1={`${prev.x}%`}
                  y1={`${prev.y}%`}
                  x2={`${curr.x}%`}
                  y2={`${curr.y}%`}
                  stroke="#C8A45D"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}
          </svg>
        )}
      </div>

      {/* Completion message */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-2"
          >
            <p className="text-lg font-display text-gold">
              Drei Resonanzpunkte fixiert
            </p>
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
              Konstellation wird materialisiert...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
