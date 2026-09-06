"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

type TarotCardProps = {
  name: string;
  position: string;
  upright: boolean;
  element?: string | null;
  zodiacAssociation?: string | null;
  revealed: boolean;
  onReveal?: () => void;
};

const POSITION_LABELS: Record<string, string> = {
  gegenwart: "Gegenwart",
  spannung: "Spannung",
  impuls: "Impuls",
};

export default function TarotCard({
  name,
  position,
  upright,
  element,
  zodiacAssociation,
  revealed,
  onReveal,
}: TarotCardProps) {
  const positionLabel = POSITION_LABELS[position] ?? position;
  const [zoomed, setZoomed] = useState(false);

  const coreName = name.split(/[–-]/)[0].trim();

  const clean = (s: string) =>
    s.replace(/ /g, "_").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
      .replace(/ß/g, "ss").toLowerCase();

  const IMAGE_OVERRIDES: Record<string, string> = {
    "Das Glücksrad": "das_rad_des_schicksals",
    "Gerechtigkeit": "die_gerechtigkeit",
    "Mässigkeit": "die_maessigkeit",
  };

  const ARTICLE_PREFIX: Record<string, string> = {
    Ass: "das", Bube: "der", Ritter: "der", Königin: "die", König: "der",
  };

  let imageFile: string;
  if (IMAGE_OVERRIDES[coreName]) {
    imageFile = IMAGE_OVERRIDES[coreName] + ".png";
  } else {
    const firstWord = coreName.split(" ")[0];
    const article = ARTICLE_PREFIX[firstWord];
    const fullName = article ? `${article} ${coreName}` : coreName;
    imageFile = clean(fullName) + ".png";
  }

  const imagePath = `/tarot/cards/${imageFile}`;
  const [imageError, setImageError] = useState(false);

  // Click logic: unrevealed → reveal, revealed → zoom toggle
  const handleClick = () => {
    if (!revealed) {
      onReveal?.();
    } else {
      setZoomed((z) => !z);
    }
  };

  // Escape closes the zoom overlay
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed]);

  const orientationLabel = upright ? "aufrecht" : "umgekehrt";

  return (
    <>
      {/* Zoom overlay backdrop */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${name} in Großansicht`}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
            onClick={() => setZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="w-[55vh] max-w-[480px] rounded-[var(--radius-tarot)] border border-gold/50 overflow-hidden aspect-[5/9]"
              onClick={(e) => { e.stopPropagation(); setZoomed(false); }}
            >
              {!imageError ? (
                <img
                  src={imagePath}
                  alt={name}
                  className="w-full h-full object-cover object-bottom"
                />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center">
                  <Sparkles className="w-14 h-14 text-gold/30" />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-3">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-mono text-gold/80 tracking-[0.2em] uppercase"
        >
          {positionLabel}
        </motion.span>

        <div className="perspective-[1000px]">
          <motion.button
            type="button"
            onClick={handleClick}
            initial={false}
            animate={{
              rotateY: revealed ? 180 : 0,
              rotateZ: revealed && !upright ? 180 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 1,
            }}
            aria-label={
              revealed
                ? `${name}, ${orientationLabel}, Position ${positionLabel}${zoomed ? " — Großansicht schließen" : " — Großansicht öffnen"}`
                : `Verdeckte Karte aufdecken (Position ${positionLabel})`
            }
            className={cn(
              // Responsive Spread-Maße: drei Karten passen in EINE Reihe auf
              // allen Screens (Mobile ~26vw, Desktop 240px) — die Konstellation
              // mit Gegenwart/Spannung/Impuls bleibt als Set lesbar.
              "relative block w-[26vw] max-w-[200px] sm:w-[200px] lg:w-[240px] aspect-[5/9] bg-transparent border-none p-0 cursor-pointer preserve-3d transition-shadow duration-500 appearance-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-soft",
              revealed && "hover:shadow-[0_0_30px_rgba(200,164,93,0.2)]"
            )}
          >
            {/* Card Back (decorativ — der Button selbst trägt das aria-label) */}
            <div
              aria-hidden="true"
              className="absolute inset-0 backface-hidden rounded-[var(--radius-tarot)] border border-gold/30 bg-surface-raised flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-4 border border-gold/10 rounded-full" />
              <div className="absolute inset-8 border border-gold/5 rounded-full" />

              <div className="relative flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold/60" />
                </div>
                <span className="text-[10px] font-mono text-gold/40 tracking-widest uppercase">ESO</span>
              </div>

              <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-gold/40" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-gold/40" />
              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-gold/40" />
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-gold/40" />
            </div>

            {/* Card Front — full artwork */}
            <div className="absolute inset-0 backface-hidden rounded-[var(--radius-tarot)] border border-gold/50 overflow-hidden rotate-y-180">
              {!imageError ? (
                <img
                  src={imagePath}
                  alt={name}
                  className="w-full h-full object-cover object-bottom"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-gold/30" />
                </div>
              )}
            </div>
          </motion.button>
        </div>

        {/* Element chips below card — visible after reveal.
            Umgekehrte Karten werden TEXTLICH gekennzeichnet (die Chips selbst
            bleiben lesbar; die Rotation gehört nur der Kartenillustration). */}
        <AnimatePresence>
          {revealed && (element || zodiacAssociation || !upright) && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-1.5 justify-center"
            >
              {!upright && (
                <span className="text-[9px] font-mono text-violet-soft bg-violet-deep/30 border border-violet/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Umgekehrt
                </span>
              )}
              {element && (
                <span className="text-[9px] font-mono text-violet-soft bg-violet-deep/30 border border-violet/20 px-2 py-0.5 rounded-full">
                  {element}
                </span>
              )}
              {zodiacAssociation && (
                <span className="text-[9px] font-mono text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full">
                  {zodiacAssociation}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
