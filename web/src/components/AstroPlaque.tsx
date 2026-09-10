"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ReactNode, useId, useState } from "react";
import { cn } from "@/lib/utils";

interface AstroPlaqueProps {
  /** Astro-Glyphe (Unicode) — rein deko, der Titel trägt die Information. */
  glyph?: string;
  /** z. B. „Sonne in Löwe“ oder „Venus-Saturn-Konjunktion“. */
  title: string;
  /** Exakte Datenzeile aus dem Chart, z. B. „Löwe · Haus 5“ / „Orb 2,1°“. */
  dataLine?: string | null;
  /** Sichtbarer Einstieg: erste 1–2 Sätze der Passage. */
  teaser: ReactNode;
  /** Rest der Passage — hinter „Vertiefen“ aufgeklappt. */
  children: ReactNode;
  /** Position in der Reihe, für den gestaffelten Scroll-Reveal. */
  index?: number;
  /** Beteiligte Symbolnamen (Stufe 2: Highlight-Verknüpfung mit dem Radix-Kreis). */
  symbols?: string[];
  /** Gold = Planetenposition, violett = Aspekt (KI-Farbsemantik). */
  accent?: "gold" | "violet";
}

/**
 * Plakette für einen >>-Block der Synthese: Titel + exakte Chart-Daten sichtbar,
 * Teaser-Satz sichtbar, volle Passage hinter „Vertiefen“. Gegenstück der
 * Tarotkarten-Objekte für die Astrologie — Textmenge pro Blick sinkt drastisch.
 */
const AstroPlaque = ({
  glyph,
  title,
  dataLine,
  teaser,
  children,
  index = 0,
  symbols,
  accent = "gold",
}: AstroPlaqueProps) => {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const panelId = useId();
  const buttonId = useId();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      data-astro-symbols={symbols?.join(",")}
      className={cn(
        "rounded-2xl border bg-surface-raised/30 px-6 py-5 backdrop-blur-sm",
        accent === "gold" ? "border-gold/10" : "border-violet/15",
      )}
    >
      <div className="flex items-start gap-4">
        {glyph && (
          <span
            aria-hidden="true"
            className={cn(
              "font-display text-2xl leading-none mt-1",
              accent === "gold" ? "text-gold/90" : "text-violet-soft",
            )}
          >
            {glyph}
          </span>
        )}
        <div className="min-w-0">
          <h4
            className={cn(
              "font-display text-lg font-medium leading-snug",
              accent === "gold" ? "text-gold" : "text-violet-soft",
            )}
          >
            {title}
          </h4>
          {dataLine && (
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted mt-1">
              {dataLine}
            </p>
          )}
        </div>
      </div>

      <p className="text-text-secondary text-xl leading-[1.85] font-serif mt-4">{teaser}</p>

      <button
        id={buttonId}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "ml-auto flex min-h-[44px] items-center gap-2 rounded-full border px-5 py-2",
          "font-mono text-[10px] uppercase tracking-[0.3em] transition-colors",
          "focus-visible:outline-none focus-visible:border-violet/60",
          accent === "gold"
            ? "border-gold/20 text-gold-soft hover:border-gold/40 hover:text-gold"
            : "border-violet/20 text-violet-soft hover:border-violet/40 hover:text-violet-soft",
        )}
      >
        {open ? "Zuklappen" : "Vertiefen"}
        <ChevronDown
          aria-hidden="true"
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="rest"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
            }
            className="overflow-hidden"
          >
            <div className="text-text-secondary text-xl leading-[1.85] font-serif border-l border-violet/10 pl-6 pt-4 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AstroPlaque;
