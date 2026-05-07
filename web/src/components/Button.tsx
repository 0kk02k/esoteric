"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({
  variant = "primary",
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-sans font-medium px-6 min-h-[44px] rounded-[var(--radius-input)] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-b from-gold-soft to-gold text-background hover:shadow-[0_0_20px_rgba(200,164,93,0.35)] active:scale-[0.97]",
    secondary:
      "bg-transparent border border-border text-text-secondary hover:border-gold hover:text-gold active:scale-[0.97]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
