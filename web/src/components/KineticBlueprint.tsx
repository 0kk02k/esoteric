"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import TarotCard from "./TarotCard";
import SymbolChip from "./SymbolChip";

interface DrawnCard {
  id: string;
  name: string;
  position: string;
  upright: boolean;
  element: string | null;
  zodiacAssociation: string | null;
}

interface KineticTextProps {
  text: string;
  cards?: DrawnCard[];
  className?: string;
}

export const KineticBlueprint = ({ text, cards, className }: KineticTextProps) => {
  const sections = text.includes("**")
    ? text.split(/\n(?=\*\*)/)
    : text.split(/\n\n+/);

  return (
    <div className={cn("space-y-24 py-8", className)}>
      {sections.map((section, index) => (
        <BlueprintSection key={index} content={section} index={index} cards={cards} />
      ))}
    </div>
  );
};

const stripMarkdown = (s: string) => s.replace(/\*\*/g, '');

const BlueprintSection = ({ content, index, cards }: { content: string; index: number; cards?: DrawnCard[] }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsRendered(true), index * 1000);
    return () => clearTimeout(timer);
  }, [index]);

  if (!isRendered) return null;

  const match = content.match(/^\s*\*\*([\s\S]*?)\*\*\s*:?\s*([\s\S]*)/);
  const title = match ? match[1] : null;
  const body = match ? match[2] : content;

  if (title === "Die Karten" && cards) {
    const cardSegments = body.split(/\n(?=###)/);
    return (
      <div className="space-y-12">
        <SectionHeader title={title} variant="gold" />
        <div className="grid grid-cols-1 gap-16">
          {cardSegments.map((segment, i) => {
            const cardMatch = segment.match(/### (.*?) \((.*?)\)\n([\s\S]*)/);
            if (!cardMatch) return <p key={i} className="text-text-secondary italic pl-8">{segment}</p>;

            const cardName = cardMatch[1].trim();
            const orientation = cardMatch[2].trim();
            const cardBody = cardMatch[3].trim();

            const cardData = cards.find(c =>
              c.name.toLowerCase().includes(cardName.toLowerCase()) ||
              cardName.toLowerCase().includes(c.name.toLowerCase())
            );

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center gap-12 pl-8"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <h5 className="text-lg font-display text-gold font-medium italic">
                      {cardName} ({orientation})
                    </h5>
                    {cardData?.element && (
                      <SymbolChip variant="violet" className="opacity-80">
                        {cardData.element}
                      </SymbolChip>
                    )}
                  </div>
                  <div className="text-text-secondary text-xl sm:text-2xl leading-[1.7] font-serif italic border-l border-gold/10 pl-6">
                    {stripMarkdown(cardBody)}
                  </div>
                </div>
                {cardData && (
                  <div className="shrink-0 origin-top md:origin-right">
                    <TarotCard {...cardData} revealed={true} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <Sidebar variant="violet" />

      <div className="pl-8 space-y-6">
        {title && <SectionHeader title={title} showLine={true} variant="violet" />}

        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.6 }}
            className="text-text-secondary text-xl sm:text-2xl leading-[1.7] font-serif italic border-l border-violet/10 pl-6"
          >
            {body.split("\n").map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              const isList = trimmed.startsWith("-") || trimmed.startsWith("·") || /^\d+\./.test(trimmed);
              const isSubHeading = trimmed.startsWith(">>");
              const clean = stripMarkdown(isList ? trimmed.replace(/^[-·\d.]+\s*/, '') : trimmed);

              if (isSubHeading) {
                return (
                  <p key={i} className="text-violet/80 font-mono text-[11px] uppercase tracking-[0.3em] mt-8 first:mt-0 mb-2 not-italic">
                    {clean.replace(/^>>\s*/, '')}
                  </p>
                );
              }

              return (
                <p key={i} className={cn(
                  "mb-4 last:mb-0",
                  isList && "pl-6 relative before:content-[''] before:absolute before:left-0 before:top-4 before:w-2 before:h-[1px] before:bg-violet/40"
                )}>
                  {clean}
                </p>
              );
            })}
          </motion.div>

          <BottomLine variant="violet" />
        </div>
      </div>
    </motion.div>
  );
};

const SectionHeader = ({ title, showLine = false, variant = "violet" }: { title: string; showLine?: boolean; variant?: "gold" | "violet" }) => (
  <div className="flex items-center gap-6">
    <h4 className={cn(
      "text-[11px] font-mono uppercase tracking-[0.4em] font-bold",
      variant === "gold" ? "text-gold" : "text-violet"
    )}>
      {title}
    </h4>
    {showLine && <div className={cn(
      "h-[0.5px] flex-1 bg-gradient-to-r to-transparent",
      variant === "gold" ? "from-gold/30" : "from-violet/30"
    )} />}
  </div>
);

const Sidebar = ({ variant = "violet" }: { variant?: "gold" | "violet" }) => (
  <div className={cn(
    "absolute -left-8 top-0 bottom-0 w-[1px] transition-colors",
    variant === "gold" ? "bg-gold/10 group-hover:bg-gold/30" : "bg-violet/10 group-hover:bg-violet/30"
  )}>
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: "100%" }}
      transition={{ duration: 2.5, ease: "easeInOut" }}
      className={cn(
        "absolute top-0 left-0 w-full",
        variant === "gold" ? "bg-gold/40" : "bg-violet/40"
      )}
    />
    <div className={cn(
      "absolute top-0 -left-1 w-2 h-2 rounded-full border bg-bg",
      variant === "gold" ? "border-gold/40" : "border-violet/40"
    )} />
    <div className={cn(
      "absolute bottom-0 -left-1 w-2 h-2 rounded-full border bg-bg",
      variant === "gold" ? "border-gold/40" : "border-violet/40"
    )} />
  </div>
);

const BottomLine = ({ variant = "violet" }: { variant?: "gold" | "violet" }) => (
  <motion.div
    initial={{ width: 0 }}
    whileInView={{ width: "100%" }}
    viewport={{ once: true }}
    transition={{ duration: 1.5, delay: 0.4 }}
    className={cn(
      "absolute -bottom-4 left-0 h-[0.5px] bg-gradient-to-r to-transparent",
      variant === "gold"
        ? "from-gold/20 via-gold/10"
        : "from-violet/20 via-violet/10"
    )}
  />
);
