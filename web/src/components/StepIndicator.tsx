"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Step = "question" | "birth" | "stellar" | "drawing" | "generating" | "result";

const STEPS: { id: Step; label: string }[] = [
  { id: "question", label: "Fokus" },
  { id: "birth", label: "Kosmos" },
  { id: "stellar", label: "Feld" },
  { id: "drawing", label: "Enthüllung" },
  { id: "generating", label: "Synthese" },
  { id: "result", label: "Spiegel" },
];

export default function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Fortschritt" className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1 -mb-1">
      {STEPS.map((step, i) => {
        const active = i === currentIdx;
        const completed = i < currentIdx;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              {/* Faceted diamond indicator */}
              <div className="relative">
                <motion.div
                  animate={active ? {
                    boxShadow: [
                      "0 0 8px rgba(200,164,93,0.4), inset 0 0 4px rgba(200,164,93,0.2)",
                      "0 0 16px rgba(200,164,93,0.6), inset 0 0 8px rgba(200,164,93,0.3)",
                      "0 0 8px rgba(200,164,93,0.4), inset 0 0 4px rgba(200,164,93,0.2)",
                    ],
                  } : {}}
                  transition={active ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}
                  className={cn(
                    "w-3 h-3 rotate-45 transition-all duration-500 border",
                    active
                      ? "bg-gold/30 border-gold/80 scale-[1.6]"
                      : completed
                        ? "bg-gold/20 border-gold/40 backdrop-blur-sm"
                        : "bg-surface-raised/40 border-gold/10"
                  )}
                  style={{
                    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                  }}
                  aria-hidden="true"
                />
                {/* Glass fill for completed steps */}
                {completed && (
                  <div
                    className="absolute inset-0 w-3 h-3 rotate-45"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                      background: "linear-gradient(135deg, rgba(200,164,93,0.3), rgba(200,164,93,0.1))",
                    }}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-[9px] sm:text-[10px] font-mono transition-all duration-500 tracking-wider uppercase",
                  active ? "text-gold text-shadow-gold" :
                  completed ? "text-gold/50" : "text-gold/15"
                )}
              >
                {step.label}
              </span>
            </div>
            {/* Energy connector line */}
            {i < STEPS.length - 1 && (
              <div className="relative w-5 sm:w-10 h-[2px] mb-5 mx-1 overflow-hidden">
                {/* Base line */}
                <div
                  className={cn(
                    "absolute inset-0 transition-all duration-700",
                    completed
                      ? "bg-gradient-to-r from-gold/40 via-gold/20 to-gold/40"
                      : "bg-gradient-to-r from-gold/8 via-gold/4 to-gold/8"
                  )}
                />
                {/* Traveling energy pulse on completed connectors */}
                {completed && (
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                    className="absolute inset-y-0 w-1/3"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(200,164,93,0.6), transparent)",
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
