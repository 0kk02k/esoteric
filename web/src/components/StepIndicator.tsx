"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

type Step = "question" | "birth" | "stellar" | "drawing" | "generating" | "result";

const STEPS: { id: Step; label: string }[] = [
  { id: "question", label: "Frage" },
  { id: "birth", label: "Geburtsdaten" },
  { id: "stellar", label: "Kartenwahl" },
  { id: "drawing", label: "Enthüllung" },
  { id: "generating", label: "Synthese" },
  { id: "result", label: "Deutung" },
];

export default function StepIndicator({
  current,
  skipped = [],
}: {
  current: Step;
  /** Schritte, die bewusst übersprungen wurden — werden nicht als erledigt markiert. */
  skipped?: Step[];
}) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);
  const activeRef = useRef<HTMLLIElement>(null);
  const reduceMotion = useReducedMotion();

  // Aktiven Schritt sichtbar halten (die Leiste läuft auf schmalen Screens über)
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [current, reduceMotion]);

  return (
    <nav aria-label="Fortschritt im Reading">
      <ol className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1 -mb-1">
        {STEPS.map((step, i) => {
          const active = i === currentIdx;
          const skippedStep = skipped.includes(step.id);
          const completed = i < currentIdx && !skippedStep;
          return (
            <li
              key={step.id}
              ref={active ? activeRef : undefined}
              aria-current={active ? "step" : undefined}
              className="flex items-center"
            >
              <div className="flex flex-col items-center gap-1.5">
                {/* Faceted diamond indicator */}
                <div className="relative">
                  <motion.div
                    animate={active && !reduceMotion ? {
                      boxShadow: [
                        "0 0 8px rgba(200,164,93,0.4), inset 0 0 4px rgba(200,164,93,0.2)",
                        "0 0 16px rgba(200,164,93,0.6), inset 0 0 8px rgba(200,164,93,0.3)",
                        "0 0 8px rgba(200,164,93,0.4), inset 0 0 4px rgba(200,164,93,0.2)",
                      ],
                    } : {}}
                    transition={active && !reduceMotion ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}
                    className={cn(
                      "w-3 h-3 rotate-45 transition-all duration-500 border",
                      active
                        ? "bg-gold/30 border-gold/80 scale-[1.6]"
                        : completed
                          ? "bg-gold/20 border-gold/40 backdrop-blur-sm"
                          : "bg-surface-raised/40 border-gold/25"
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
                    "text-[9px] sm:text-[10px] font-mono transition-all duration-500 tracking-wider uppercase whitespace-nowrap",
                    active ? "text-gold text-shadow-gold" :
                    completed ? "text-gold/70" :
                    skippedStep ? "text-text-muted line-through decoration-text-muted/60" : "text-text-muted"
                  )}
                  title={skippedStep ? "übersprungen" : undefined}
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
                        : "bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20"
                    )}
                  />
                  {/* Traveling energy pulse on completed connectors */}
                  {completed && !reduceMotion && (
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
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
