"use client";

import { cn } from "@/lib/utils";

type CrystalSpinnerProps = {
  className?: string;
  /** Text below the spinner */
  label?: string;
};

/**
 * A crystalline loading indicator: 4 small diamond shards orbiting
 * a central pulsing point, with counter-rotating directions.
 */
export function CrystalSpinner({ className, label }: CrystalSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative w-12 h-12">
        {/* Central pulse */}
        <div
          className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold/40"
          style={{
            animation: "crystal-pulse 2s ease-in-out infinite",
            boxShadow: "0 0 12px rgba(200,164,93,0.3)",
          }}
        />

        {/* Orbiting shard 1 — clockwise */}
        <div
          className="absolute inset-0"
          style={{ animation: "crystal-orbit 2.5s linear infinite" }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2.5 rotate-45"
            style={{
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              background: "linear-gradient(135deg, rgba(200,215,230,0.3), rgba(200,164,93,0.15))",
              border: "0.5px solid rgba(200,164,93,0.3)",
              boxShadow: "0 0 6px rgba(200,164,93,0.2)",
            }}
          />
        </div>

        {/* Orbiting shard 2 — counter-clockwise */}
        <div
          className="absolute inset-0"
          style={{ animation: "crystal-orbit-reverse 3s linear infinite" }}
        >
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-2 rotate-45"
            style={{
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              background: "linear-gradient(135deg, rgba(180,200,240,0.3), rgba(124,92,255,0.15))",
              border: "0.5px solid rgba(124,92,255,0.3)",
              boxShadow: "0 0 6px rgba(124,92,255,0.2)",
            }}
          />
        </div>

        {/* Orbiting shard 3 — clockwise, slower */}
        <div
          className="absolute inset-[-4px]"
          style={{ animation: "crystal-orbit 4s linear infinite" }}
        >
          <div
            className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 rotate-45"
            style={{
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              background: "linear-gradient(135deg, rgba(200,220,240,0.25), rgba(200,164,93,0.1))",
              border: "0.5px solid rgba(200,164,93,0.25)",
              boxShadow: "0 0 4px rgba(200,164,93,0.15)",
            }}
          />
        </div>

        {/* Orbiting shard 4 — counter-clockwise, medium */}
        <div
          className="absolute inset-[-2px]"
          style={{ animation: "crystal-orbit-reverse 3.5s linear infinite" }}
        >
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-2 rotate-45"
            style={{
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              background: "linear-gradient(135deg, rgba(180,190,230,0.3), rgba(124,92,255,0.1))",
              border: "0.5px solid rgba(124,92,255,0.2)",
              boxShadow: "0 0 4px rgba(124,92,255,0.15)",
            }}
          />
        </div>
      </div>

      {label && (
        <p className="text-[10px] font-mono text-gold/50 uppercase tracking-widest">
          {label}
        </p>
      )}
    </div>
  );
}
