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
  
  // Format the name exactly like the python script to find the generated image
  const coreName = name.split("–")[0].trim();
  const cleanImageName = coreName.replace(/ /g, "_").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").toLowerCase() + ".png";
  const imagePath = `/tarot/cards/${cleanImageName}`;
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
          <div className="absolute inset-0 backface-hidden rounded-[var(--radius-tarot)] border border-gold/50 bg-surface p-4 flex flex-col items-center justify-between text-center rotate-y-180">
            <div className="flex flex-col items-center gap-2">
              <span className={cn(
                "text-[9px] font-mono tracking-widest uppercase",
                upright ? "text-success-muted/80" : "text-danger-muted/80"
              )}>
                {!upright && "△ "}
                {upright ? "aufrecht" : "umgekehrt"}
              </span>
              
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent my-2" />
            </div>

            <div className="flex flex-col items-center gap-4 flex-1 justify-center w-full relative">
               {!imageError ? (
                 <div className="absolute inset-0 top-[-20px] bottom-[-20px] left-[-10px] right-[-10px] overflow-hidden rounded-md opacity-90 mix-blend-luminosity">
                    <img 
                      src={imagePath} 
                      alt={name} 
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                 </div>
               ) : (
                 <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gold/20 flex items-center justify-center relative z-10">
                    <Sparkles className="w-8 h-8 text-gold/40" />
                    {/* Rotating orbital */}
                    <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold/60" />
                    </div>
                 </div>
               )}
               
               <h3 className="text-sm sm:text-base font-display font-medium text-text leading-tight px-1 z-10 bg-surface/80 p-1 rounded-sm mt-auto">
                 {name}
               </h3>
            </div>

            <div className="w-full space-y-3">
               <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
               
               <div className="flex flex-wrap gap-1.5 justify-center">
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
