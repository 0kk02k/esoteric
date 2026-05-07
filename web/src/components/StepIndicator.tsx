"use client";

import { cn } from "@/lib/utils";

type Step = "question" | "birth" | "drawing" | "generating" | "result";

const STEPS: { id: Step; label: string }[] = [
  { id: "question", label: "Fokus" },
  { id: "birth", label: "Kosmos" },
  { id: "drawing", label: "Ziehung" },
  { id: "generating", label: "Synthese" },
  { id: "result", label: "Spiegel" },
];

export default function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Fortschritt" className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const active = i === currentIdx;
        const completed = i < currentIdx;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
               <div
                 className={cn(
                   "w-1.5 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(200,164,93,0)]",
                   active ? "bg-gold scale-125 shadow-[0_0_10px_rgba(200,164,93,0.6)]" : 
                   completed ? "bg-gold/40" : "bg-gold/10"
                 )}
                 aria-hidden="true"
               />
               <span
                 className={cn(
                   "text-[9px] font-mono transition-colors tracking-tighter uppercase",
                   active ? "text-gold" : 
                   completed ? "text-gold/40" : "text-gold/20"
                 )}
               >
                 {step.label}
               </span>
            </div>
            {i < STEPS.length - 1 && (
              <div 
                className={cn(
                  "w-4 sm:w-8 h-[0.5px] mb-4 mx-1 transition-colors duration-500",
                  completed ? "bg-gold/30" : "bg-gold/10"
                )} 
                aria-hidden="true" 
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
