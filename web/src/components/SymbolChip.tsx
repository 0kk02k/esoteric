"use client";

import { HTMLAttributes, ReactNode } from "react";

interface SymbolChipProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export default function SymbolChip({
  className = "",
  children,
  ...props
}: SymbolChipProps) {
  return (
    <span
      className={`inline-flex items-center font-mono text-xs text-text-secondary bg-surface-raised rounded-[var(--radius-chip)] px-3 py-1 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
