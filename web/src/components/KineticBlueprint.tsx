"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import type { ChartResponse } from "@/lib/astrology";
import {
  parseSynthesisBlocks,
  preparePlaque,
  type SynthesisBlock,
} from "@/lib/astroPlaque";
import { cn } from "@/lib/utils";
import AstroPlaque from "./AstroPlaque";
import RadixWheel from "./RadixWheel";
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
  chart?: ChartResponse | null;
  className?: string;
}

/**
 * Rendert Inline-Markdown (**fett**) als echtes <strong>, statt es zu strippen.
 * Exportiert, damit auch der Follow-up-Thread dieselbe Behandlung nutzt.
 */
export function renderInline(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-text font-semibold not-italic">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export const KineticBlueprint = ({ text, cards, chart, className }: KineticTextProps) => {
  const sections = text.includes("**")
    ? text.split(/\n(?=\*\*)/)
    : text.split(/\n\n+/);

  return (
    <div className={cn("space-y-16 py-4", className)}>
      {sections.map((section, index) => (
        <BlueprintSection key={index} content={section} index={index} cards={cards} chart={chart} />
      ))}
    </div>
  );
};

const BlueprintSection = ({ content, cards, chart }: { content: string; index: number; cards?: DrawnCard[]; chart?: ChartResponse | null }) => {
  const match = content.match(/^\s*\*\*([\s\S]*?)\*\*\s*:?\s*([\s\S]*)/);
  const title = match ? match[1] : null;
  const body = match ? match[2] : content;

  const isSynthesis = Boolean(title && /synthese/i.test(title) && /astrolog/i.test(title));
  const synthesis = isSynthesis ? parseSynthesisBlocks(body) : null;

  if (isSynthesis && synthesis && synthesis.blocks.length > 0) {
    return (
      <SynthesisSection title={title} synthesis={synthesis} chart={chart} />
    );
  }

  if (title === "Die Karten" && cards) {
    const cardSegments = body.split(/\n(?=###)/);
    return (
      <div className="space-y-10">
        <SectionHeader title={title} variant="gold" />
        <div className="grid grid-cols-1 gap-12">
          {cardSegments.map((segment, i) => {
            const cardMatch = segment.match(/### (.*?) \((.*?)\)\n([\s\S]*)/);
            if (!cardMatch) return <p key={i} className="text-text-secondary font-serif pl-8">{renderInline(segment)}</p>;

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
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col md:flex-row items-center gap-10 pl-8"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-lg font-display text-gold font-medium">
                      {cardName} <span className="text-text-muted text-sm">({orientation})</span>
                    </h4>
                    {cardData?.element && (
                      <SymbolChip variant="violet" className="opacity-80">
                        {cardData.element}
                      </SymbolChip>
                    )}
                  </div>
                  <div className="text-text-secondary text-xl leading-[1.85] font-serif border-l border-gold/10 pl-6">
                    {renderInline(cardBody)}
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
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <Sidebar variant="violet" />

      <div className="pl-8 space-y-6">
        {title && <SectionHeader title={title} showLine={true} variant="violet" />}

        <div className="relative">
          <div className="text-text-secondary text-xl leading-[1.85] font-serif border-l border-violet/10 pl-6">
            {body.split("\n").map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              const isList = trimmed.startsWith("-") || trimmed.startsWith("·") || /^\d+\./.test(trimmed);
              const isSubHeading = trimmed.startsWith(">>");
              const clean = isList ? trimmed.replace(/^[-·\d.]+\s*/, '') : trimmed;

              if (isSubHeading) {
                return (
                  <p key={i} className="text-violet-soft font-mono text-[11px] uppercase tracking-[0.3em] mt-8 first:mt-0 mb-2">
                    {clean.replace(/^>>\s*/, '')}
                  </p>
                );
              }

              return (
                <p key={i} className={cn(
                  "mb-4 last:mb-0",
                  isList && "pl-6 relative before:content-[''] before:absolute before:left-0 before:top-4 before:w-2 before:h-[1px] before:bg-violet/40"
                )}>
                  {renderInline(clean)}
                </p>
              );
            })}
          </div>

          <BottomLine variant="violet" />
        </div>
      </div>
    </motion.div>
  );
};

const SynthesisPlaque = ({ block, index, chart, onOpenChange }: { block: SynthesisBlock; index: number; chart?: ChartResponse | null; onOpenChange?: (open: boolean) => void }) => {
  const plaque = preparePlaque(block, chart);

  return (
    <AstroPlaque
      glyph={plaque.glyph}
      title={plaque.title}
      dataLine={plaque.dataLine}
      teaser={renderInline(plaque.teaser)}
      index={index}
      accent={plaque.accent}
      symbols={plaque.symbols}
      onOpenChange={onOpenChange}
    >
      {plaque.rest.map((paragraph, i) => (
        <p key={i}>{renderInline(paragraph)}</p>
      ))}
    </AstroPlaque>
  );
};

/**
 * Die Synthese-Sektion: Radix-Kreis über den Plaketten. Keine Plakette offen →
 * alle genannten Symbole leuchten; wird eine geöffnet, zieht sich das Licht auf
 * ihre Symbole zusammen (data-astro-symbols für spätere Verfeinerung).
 */
const SynthesisSection = ({ title, synthesis, chart }: { title: string | null; synthesis: NonNullable<ReturnType<typeof parseSynthesisBlocks>>; chart?: ChartResponse | null }) => {
  const [openSymbols, setOpenSymbols] = useState<string[] | null>(null);

  const namedSymbols = Array.from(
    new Set(synthesis.blocks.flatMap((block) => preparePlaque(block, chart).symbols)),
  );
  const activeSymbols = openSymbols ?? namedSymbols;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <Sidebar variant="violet" />

      <div className="pl-8 space-y-6">
        {title && <SectionHeader title={title} showLine={true} variant="violet" />}

        {synthesis.intro.map((paragraph, i) => (
          <p key={i} className="text-text-secondary text-xl leading-[1.85] font-serif">
            {renderInline(paragraph)}
          </p>
        ))}

        {chart && chart.planets.length > 0 && (
          <RadixWheel chart={chart} activeSymbols={activeSymbols} />
        )}

        <div className="space-y-6 pt-2">
          {synthesis.blocks.map((block, i) => (
            <SynthesisPlaque
              key={i}
              block={block}
              index={i}
              chart={chart}
              onOpenChange={(open) => setOpenSymbols(open ? preparePlaque(block, chart).symbols : null)}
            />
          ))}
        </div>

        <BottomLine variant="violet" />
      </div>
    </motion.div>
  );
};

const SectionHeader = ({ title, showLine = false, variant = "violet" }: { title: string; showLine?: boolean; variant?: "gold" | "violet" }) => (
  <div className="flex items-center gap-6">
    <h3 className={cn(
      "text-[11px] font-mono uppercase tracking-[0.4em] font-bold",
      variant === "gold" ? "text-gold" : "text-violet-soft"
    )}>
      {title}
    </h3>
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
      whileInView={{ height: "100%" }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: "easeOut" }}
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
    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
    className={cn(
      "absolute -bottom-4 left-0 h-[0.5px] bg-gradient-to-r to-transparent",
      variant === "gold"
        ? "from-gold/20 via-gold/10"
        : "from-violet/20 via-violet/10"
    )}
  />
);
