"use client";

import { HTMLAttributes, ReactNode } from "react";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "ai";
  children: ReactNode;
}

export default function Panel({
  variant = "default",
  className = "",
  children,
  ...props
}: PanelProps) {
  const base =
    "rounded-[var(--radius-card)] border border-border p-6";

  const ai =
    variant === "ai"
      ? "bg-[var(--color-violet-deep)] border-violet/30 shadow-[0_0_30px_rgba(124,92,255,0.08)]"
      : "bg-surface";

  return (
    <div className={`${base} ${ai} ${className}`} {...props}>
      {children}
    </div>
  );
}
