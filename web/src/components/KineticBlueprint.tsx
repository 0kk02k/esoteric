"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface KineticTextProps {
  text: string;
  className?: string;
}

export const KineticBlueprint = ({ text, className }: KineticTextProps) => {
  // Split text into sections based on the specified format (Einstieg, Kernthema, etc.)
  // If not formatted, split by double newlines
  const sections = text.includes("**") 
    ? text.split(/\n(?=\*\*)/) 
    : text.split(/\n\n+/);

  return (
    <div className={cn("space-y-16 py-8", className)}>
      {sections.map((section, index) => (
        <BlueprintSection key={index} content={section} index={index} />
      ))}
    </div>
  );
};

const BlueprintSection = ({ content, index }: { content: string; index: number }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Staggered appearance
    const timer = setTimeout(() => setIsRendered(true), index * 1000);
    return () => clearTimeout(timer);
  }, [index]);

  if (!isRendered) return null;

  // Extract title if it's in **Title** format
  const match = content.match(/^\s*\*\*([\s\S]*?)\*\*\s*:?\s*([\s\S]*)/);
  const title = match ? match[1] : null;
  const body = match ? match[2] : content;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      {/* Mechanical Sidebar Indicator */}
      <div className="absolute -left-8 top-0 bottom-0 w-[1px] bg-gold/10 group-hover:bg-gold/30 transition-colors">
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full bg-gold/40" 
        />
        <div className="absolute top-0 -left-1 w-2 h-2 rounded-full border border-gold/40 bg-bg" />
        <div className="absolute bottom-0 -left-1 w-2 h-2 rounded-full border border-gold/40 bg-bg" />
      </div>

      <div className="pl-8 space-y-6">
        {title && (
          <div className="flex items-center gap-6">
            <h4 className="text-[11px] font-mono text-gold uppercase tracking-[0.4em] font-bold">
              {title}
            </h4>
            <div className="h-[0.5px] flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
          </div>
        )}
        
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.6 }}
            className="text-text-secondary text-xl sm:text-2xl leading-relaxed font-serif italic tracking-tight"
          >
            {body.split("\n").map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                
                const isList = trimmed.startsWith("-") || trimmed.startsWith("·") || /^\d+\./.test(trimmed);
                
                return (
                  <p key={i} className={cn(
                    "mb-6 last:mb-0",
                    isList && "pl-6 relative before:content-[''] before:absolute before:left-0 before:top-4 before:w-2 before:h-[1px] before:bg-gold/40"
                  )}>
                    {isList ? trimmed.replace(/^[-·\d.]+\s*/, '') : trimmed}
                  </p>
                );
            })}
          </motion.div>

          {/* Blueprint Line Animation on appear */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="absolute -bottom-4 left-0 h-[0.5px] bg-gradient-to-r from-gold/20 via-gold/10 to-transparent"
          />
        </div>
      </div>
    </motion.div>
  );
};
