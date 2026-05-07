"use client";

import { useState } from "react";

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

export default function TarotCardComponent({
  name,
  position,
  upright,
  element,
  zodiacAssociation,
  revealed,
  onReveal,
}: TarotCardProps) {
  const [flipping, setFlipping] = useState(false);

  const handleClick = () => {
    if (revealed || flipping) return;
    setFlipping(true);
    setTimeout(() => {
      onReveal?.();
      setFlipping(false);
    }, 400);
  };

  const positionLabel = POSITION_LABELS[position] ?? position;

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs font-mono text-gold tracking-wide uppercase">
        {positionLabel}
      </span>
      <div
        className="relative w-[140px] h-[220px] cursor-pointer"
        style={{ perspective: "800px" }}
        onClick={handleClick}
        role={revealed ? undefined : "button"}
        tabIndex={revealed ? undefined : 0}
        aria-label={revealed ? `${name} — ${positionLabel}` : `Karte aufdecken: ${positionLabel}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
      >
        <div
          className="absolute inset-0 transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: revealed || flipping ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Back */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-tarot)] border-2 border-gold/30 bg-surface-raised"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex flex-col items-center gap-2 text-gold/50">
              <span className="text-3xl">&#9734;</span>
              <span className="text-xs font-mono">ESO</span>
            </div>
          </div>

          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[var(--radius-tarot)] border-2 border-gold/50 bg-surface p-3 text-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="text-xs text-text-muted font-mono">
              {!upright && "△ "}
              {upright ? "aufrecht" : "umgekehrt"}
            </span>
            <span className="text-sm font-display font-semibold text-text leading-tight">
              {name}
            </span>
            {(element || zodiacAssociation) && (
              <div className="flex flex-wrap gap-1 justify-center mt-1">
                {element && (
                  <span className="text-[10px] font-mono text-violet bg-violet-deep px-2 py-0.5 rounded-full">
                    {element}
                  </span>
                )}
                {zodiacAssociation && (
                  <span className="text-[10px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                    {zodiacAssociation}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
