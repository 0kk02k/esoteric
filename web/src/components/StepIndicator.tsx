"use client";

type Step = "question" | "birth" | "drawing" | "generating" | "result";

const STEPS: { id: Step; label: string }[] = [
  { id: "question", label: "Frage" },
  { id: "birth", label: "Geburtsdaten" },
  { id: "drawing", label: "Karten" },
  { id: "generating", label: "Deutung" },
  { id: "result", label: "Ergebnis" },
];

export default function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Fortschritt" className="flex items-center gap-1">
      {STEPS.map((step, i) => {
        const active = i === currentIdx;
        const completed = i < currentIdx;
        return (
          <div key={step.id} className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                active
                  ? "bg-gold"
                  : completed
                    ? "bg-text-secondary"
                    : "bg-border"
              }`}
              aria-hidden="true"
            />
            <span
              className={`text-xs font-mono transition-colors ${
                active
                  ? "text-gold"
                  : completed
                    ? "text-text-secondary"
                    : "text-text-muted"
              }`}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="w-4 h-px bg-border mx-1" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
