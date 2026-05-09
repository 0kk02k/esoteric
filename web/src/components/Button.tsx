"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
}

export const Button = ({
  children,
  onClick,
  className,
  variant = "primary",
  type = "button",
  disabled = false,
}: ButtonProps) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, translateY: -1 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative h-12 px-8 font-display font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group",
        // Faceted shape: slightly clipped corners via clip-path
        "rounded-lg",
        variant === "primary" && [
          "bg-gradient-to-b from-gold via-gold to-[#a88a3e]",
          "text-background",
          "shadow-[0_2px_12px_rgba(200,164,93,0.25),0_0_24px_rgba(200,164,93,0.1)]",
          "hover:shadow-[0_4px_20px_rgba(200,164,93,0.35),0_0_40px_rgba(200,164,93,0.15)]",
        ],
        variant === "secondary" && [
          "bg-surface-raised/30 backdrop-blur-sm",
          "border border-gold/25",
          "text-gold",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_2px_8px_rgba(0,0,0,0.3)]",
          "hover:border-gold/45 hover:bg-gold/5",
          "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_16px_rgba(200,164,93,0.08)]",
        ],
        variant === "ghost" && [
          "text-text-muted",
          "hover:text-gold hover:bg-gold/5",
          "border border-transparent hover:border-gold/15",
        ],
        className
      )}
      style={variant === "primary" ? {
        clipPath: "polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)",
      } : variant === "secondary" ? {
        clipPath: "polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)",
      } : undefined}
    >
      {/* Top edge highlight — light catch */}
      {variant === "primary" && (
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
      )}
      {variant === "secondary" && (
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      )}

      {/* Inner refraction sweep on hover */}
      {(variant === "primary" || variant === "secondary") && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: variant === "primary"
                ? "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)"
                : "linear-gradient(105deg, transparent 40%, rgba(200,164,93,0.06) 50%, transparent 60%)",
            }}
          />
        </div>
      )}

      {/* Bottom edge shadow — depth */}
      {variant === "primary" && (
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black/20 pointer-events-none" />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};
