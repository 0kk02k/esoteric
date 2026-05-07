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
  const variants = {
    primary: "bg-gold text-background hover:bg-gold-soft shadow-[0_0_20px_rgba(200,164,93,0.2)]",
    secondary: "border border-gold/30 text-gold hover:bg-gold/5",
    ghost: "text-text-muted hover:text-gold transition-colors",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, translateY: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative h-12 px-8 rounded-full font-display font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group",
        variants[variant],
        className
      )}
    >
      {/* Inner Mechanical Lines */}
      {variant === "primary" && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-white" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white" />
        </div>
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};
