"use client";

import { ReactNode } from "react";
import { Panel } from "./Panel";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ReadingPanelProps {
  loading?: boolean;
  children?: ReactNode;
  model?: string;
}

export default function ReadingPanel({
  loading = false,
  children,
  model,
}: ReadingPanelProps) {
  return (
    <Panel variant="ki" className="p-0 overflow-hidden">
      <div className="bg-violet-deep/30 border-b border-violet/20 px-6 py-3 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-violet shadow-[0_0_10px_rgba(124,92,255,0.8)]" />
            <h3 className="text-[9px] font-mono text-violet tracking-[0.2em] uppercase">KI-Deutung</h3>
         </div>
         {model && (
            <span className="text-[9px] font-mono text-violet/40 uppercase">{model}</span>
         )}
      </div>

      <div className="p-6 sm:p-8">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-10">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-full border border-violet/20 border-t-violet" 
            />
            <span className="text-sm font-mono text-violet/60 uppercase tracking-widest">Synthetisiere...</span>
          </div>
        ) : (
          <div className="text-text-secondary text-lg leading-relaxed whitespace-pre-wrap font-serif">
            {children}
          </div>
        )}
      </div>

      <div className="bg-bg/40 px-6 py-3 flex items-center gap-4 text-[9px] font-mono text-text-muted uppercase tracking-widest border-t border-gold/5">
        <Sparkles className="w-3 h-3" />
        <span>Symbolische Reflexion</span>
        <div className="ml-auto opacity-40">ESO ENGINE v1</div>
      </div>
    </Panel>
  );
}
