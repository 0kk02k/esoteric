"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ChartResponse } from "@/lib/astrology";
import { SIGN_GLYPHS } from "@/lib/astroGlyphs";
import { ZODIAC_SIGNS } from "@/lib/astroPlaque";
import {
  aspectIsActive,
  houseCuspsForWheel,
  isTensionAspect,
  longitudeToXY,
  planetsForWheel,
} from "@/lib/radixWheel";
import { cn } from "@/lib/utils";

interface RadixWheelProps {
  chart: ChartResponse;
  /** Genannte Symbole (Planeten, Aspekttypen) — alles andere wird gedimmt. */
  activeSymbols?: string[];
  className?: string;
}

// Kreisradien im 220×220-ViewBox um (0,0)
const R_SIGNS = 102;
const R_OUTER = 93;
const R_PLANET = 81;
const R_ASPECT = 62;

const GOLD = "#C8A45D";
const VIOLET = "#7C5CFF";

/**
 * Der Himmel des Nutzers als kompaktes Mandala: zwölf Häuserzeiger, sieben
 * Planeten an ihren exakten Längengraden (Swiss Ephemeris), Aspektlinien
 * dazwischen — gold für harmonische, violett für Spannungsaspekte. Die
 * Symbole, die die Deutung nennt, sind entzündet; der Rest schläft.
 */
const RadixWheel = ({ chart, activeSymbols = [], className }: RadixWheelProps) => {
  const shouldReduceMotion = useReducedMotion();
  const planets = planetsForWheel(chart);
  if (planets.length === 0) return null;

  const cusps = houseCuspsForWheel(chart);
  const isActive = (name: string) => activeSymbols.includes(name);
  const aspectLines = chart.aspects
    .map((aspect) => {
      const p1 = planets.find((planet) => planet.name === aspect.planet1);
      const p2 = planets.find((planet) => planet.name === aspect.planet2);
      if (!p1 || !p2) return null;
      return {
        aspect,
        from: longitudeToXY(p1.longitude, R_ASPECT),
        to: longitudeToXY(p2.longitude, R_ASPECT),
        tension: isTensionAspect(aspect.type),
        active: aspectIsActive(aspect, activeSymbols),
      };
    })
    .filter((line): line is NonNullable<typeof line> => line !== null);

  const ariaLabel = `Radix: ${chart.planets
    .map((p) => `${p.name} in ${p.sign}${p.house ? `, Haus ${p.house}` : ""}`)
    .join("; ")}. ${chart.aspects.length} Aspekte.`;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex justify-center", className)}
    >
      <svg
        viewBox="-110 -110 220 220"
        role="img"
        aria-label={ariaLabel}
        className="w-64 md:w-80 h-auto"
      >
        {/* Häuserzeiger */}
        {cusps.map((cusp, i) => {
          const outer = longitudeToXY(cusp, R_OUTER);
          const inner = longitudeToXY(cusp, R_ASPECT + 8);
          return (
            <line
              key={`cusp-${i}`}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={VIOLET}
              strokeWidth="0.6"
              opacity="0.22"
            />
          );
        })}

        {/* Zeichen-Glyphen außen */}
        {ZODIAC_SIGNS.map((sign, i) => {
          const mid = i * 30 + 15;
          const pos = longitudeToXY(mid, R_SIGNS);
          return (
            <text
              key={sign}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="8"
              fill={GOLD}
              opacity="0.35"
              className="font-display"
            >
              {SIGN_GLYPHS[sign]}
            </text>
          );
        })}

        {/* Kreise */}
        <circle cx="0" cy="0" r={R_OUTER} fill="none" stroke={GOLD} strokeWidth="0.6" opacity="0.2" />
        <circle cx="0" cy="0" r={R_ASPECT} fill="none" stroke={GOLD} strokeWidth="0.4" opacity="0.1" />

        {/* Aspektlinien */}
        {aspectLines.map(({ aspect, from, to, tension, active }, i) => (
          <line
            key={`aspect-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={tension ? VIOLET : GOLD}
            strokeWidth={active ? 1.3 : 0.7}
            opacity={active ? (tension ? 0.65 : 0.55) : tension ? 0.16 : 0.12}
            className="transition-opacity duration-700"
          >
            <title>{`${aspect.planet1} ${aspect.type} ${aspect.planet2} · Orb ${aspect.orb.toFixed(1)}°`}</title>
          </line>
        ))}

        {/* Planeten: exakter Gradstrich + Glyphe an der entzerrten Position */}
        {planets.map((planet) => {
          const tick = longitudeToXY(planet.longitude, R_OUTER);
          const tickInner = longitudeToXY(planet.longitude, R_OUTER - 5);
          const pos = longitudeToXY(planet.displayLongitude, R_PLANET);
          const lit = isActive(planet.name);
          return (
            <g key={planet.name} className="transition-opacity duration-700" opacity={lit ? 1 : 0.3}>
              <line
                x1={tickInner.x}
                y1={tickInner.y}
                x2={tick.x}
                y2={tick.y}
                stroke={GOLD}
                strokeWidth={lit ? 1.2 : 0.7}
                opacity={lit ? 0.9 : 0.4}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fill={GOLD}
                className="font-display"
              >
                {planet.glyph || "·"}
                <title>{planet.name}</title>
              </text>
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
};

export default RadixWheel;
