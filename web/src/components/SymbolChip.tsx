"use client";

import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SymbolChipProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "gold" | "violet" | "default";
}

export default function SymbolChip({
  className = "",
  children,
  variant = "default",
  ...props
}: SymbolChipProps) {
  const variants = {
    default: "bg-surface-raised/50 border-gold/10 text-text-muted",
    gold: "bg-gold/10 border-gold/30 text-gold",
    violet: "bg-violet-deep/20 border-violet/30 text-violet",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[10px] uppercase tracking-wider border rounded-full px-2.5 py-0.5",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
