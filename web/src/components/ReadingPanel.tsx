"use client";

import { ReactNode } from "react";
import Panel from "./Panel";

interface ReadingPanelProps {
  loading?: boolean;
  children?: ReactNode;
}

export default function ReadingPanel({
  loading = false,
  children,
}: ReadingPanelProps) {
  return (
    <Panel variant="ai">
      <div className="flex flex-col gap-4">
        <h3 className="font-display text-sm tracking-wide text-violet">
          KI-generierte Deutung
        </h3>

        {loading ? (
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-violet" />
            </span>
            <span className="text-sm text-text-muted">Deutung wird erstellt...</span>
          </div>
        ) : (
          <div className="text-text-secondary text-sm leading-relaxed">
            {children}
          </div>
        )}

        <p className="text-xs text-text-muted border-t border-border pt-3">
          Symbolische Reflexion, keine professionelle Beratung
        </p>
      </div>
    </Panel>
  );
}
