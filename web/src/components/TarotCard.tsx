"use client";

import { useState } from "react";
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
  
  const coreName = name.split("–")[0].trim();

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

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[10px] font-mono text-gold/60 tracking-[0.2em] uppercase"
      >
        {positionLabel}
      </motion.span>
      
      <div className="perspective-[1000px]">
        <motion.div
          onClick={!revealed ? onReveal : undefined}
          initial={false}
          animate={{ rotateY: revealed ? 180 : 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            mass: 1
          }}
          className={cn(
            "relative w-[120px] h-[190px] sm:w-[150px] sm:h-[240px] cursor-pointer preserve-3d transition-shadow duration-500",
            revealed ? "cursor-default" : "hover:shadow-[0_0_30px_rgba(200,164,93,0.2)]"
          )}
        >
          {/* Card Back (Engine Motif) */}
          <div className="absolute inset-0 backface-hidden rounded-[var(--radius-tarot)] border border-gold/30 bg-surface-raised flex items-center justify-center overflow-hidden">
             {/* Mechanical Inner Rings */}
             <div className="absolute inset-4 border border-gold/10 rounded-full" />
             <div className="absolute inset-8 border border-gold/5 rounded-full" />
             
             <div className="relative flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Sparkles className="w-5 h-5 text-gold/60" />
                </div>
                <span className="text-[10px] font-mono text-gold/40 tracking-widest uppercase">ESO</span>
             </div>

             {/* Corner Markers */}
             <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-gold/40" />
             <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-gold/40" />
             <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-gold/40" />
             <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-gold/40" />
          </div>

          {/* Card Front (Symbolic) */}
          <div className="absolute inset-0 backface-hidden rounded-[var(--radius-tarot)] border border-gold/50 bg-surface flex flex-col items-center justify-between overflow-hidden rotate-y-180">
            {/* Full-bleed image */}
            {!imageError ? (
              <img
                src={imagePath}
                alt={name}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gold/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-gold/40" />
                </div>
              </div>
            )}

            {/* Name overlay at bottom */}
            <div className="relative z-10 mt-auto w-full bg-gradient-to-t from-surface via-surface/80 to-transparent pt-8 pb-2 px-2 text-center">
              <h3 className="text-sm sm:text-base font-display font-medium text-text leading-tight">
                {name}
              </h3>
              <div className="flex flex-wrap gap-1.5 justify-center mt-1">
                <AnimatePresence>
                  {element && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[9px] font-mono text-violet bg-violet-deep/30 border border-violet/20 px-2 py-0.5 rounded-full"
                    >
                      {element}
                    </motion.span>
                  )}
                  {zodiacAssociation && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[9px] font-mono text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full"
                    >
                      {zodiacAssociation}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
