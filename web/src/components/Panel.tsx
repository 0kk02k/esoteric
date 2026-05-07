"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PanelProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "raised" | "ki";
  animate?: boolean;
}

export const Panel = ({ 
  children, 
  className, 
  variant = "default",
  animate = true 
}: PanelProps) => {
  const variants = {
    default: "glass-panel border-gold/10",
    raised: "glass-panel border-gold/30 bg-surface-raised/40",
    ki: "glass-panel border-violet/30 bg-violet-deep/20 shadow-[0_0_40px_rgba(124,92,255,0.1)]",
  };

  const Wrapper = animate ? motion.div : "div";

  return (
    <Wrapper
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      className={cn(
        "relative rounded-[var(--radius-card)] p-6 overflow-hidden",
        variants[variant],
        className
      )}
    >
      {/* Decorative Corner Lines */}
      <div className="absolute top-0 left-0 w-8 h-[1px] bg-gold/20" />
      <div className="absolute top-0 left-0 w-[1px] h-8 bg-gold/20" />
      <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-gold/20" />
      <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-gold/20" />
      
      <div className="relative z-10">
        {children}
      </div>
    </Wrapper>
  );
};
