"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { getSessionToken } from "@/lib/session";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import SymbolChip from "@/components/SymbolChip";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Trash2, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { CrystalSpinner } from "@/components/CrystalSpinner";

type TarotDraw = {
  card: { name: string; element: string | null };
  position: string;
  upright: boolean;
};

type Reading = {
  id: string;
  question: string;
  questionCategory: string | null;
  status: string;
  createdAt: string;
  readingText: string | null;
  tarotDraws: TarotDraw[];
  feedback: { rating: string }[];
};

export default function ReadingsPage() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    const token = getSessionToken();
    if (!token) {
      requestAnimationFrame(() => {
        setLoading(false);
      });
      return;
    }
    
    fetch(`/api/readings?sessionToken=${encodeURIComponent(token)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Error: ${r.status}`);
        return r.json();
      })
      .then((data: Reading[]) => {
        setReadings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Fehler beim Laden");
        setLoading(false);
      });
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const token = getSessionToken();
    if (!token) return;
    try {
      const res = await fetch(
        `/api/readings/${id}?sessionToken=${encodeURIComponent(token)}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(`Delete error: ${res.status}`);
      setReadings((prev) => prev.filter((r) => r.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Löschen fehlgeschlagen");
    }
  }, [expanded]);

  return (
    <div className="flex-1 px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-3xl flex flex-col gap-12">
        
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
             <h2 className="text-[10px] font-mono text-gold/60 uppercase tracking-[0.3em]">Archiv</h2>
             <h1 className="font-display text-4xl text-text">Deine Readings</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/reading">
               <Button className="h-10 px-6 text-sm">Neues Reading</Button>
            </Link>
            <Link href="/">
               <Button variant="ghost" className="h-10 px-4 text-sm">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Home
               </Button>
            </Link>
          </div>
        </header>

        {loading && (
          <div className="py-20">
            <CrystalSpinner label="Initialisiere Archiv..." />
          </div>
        )}

        {error && (
          <Panel className="border-danger-muted/40 bg-danger-muted/5">
            <p className="text-sm text-danger-muted font-mono">{error}</p>
          </Panel>
        )}

        <div className="flex flex-col gap-6">
          {!loading && readings.length === 0 && (
            <Panel className="text-center py-16">
              <Sparkles className="w-12 h-12 text-gold/20 mx-auto mb-6" />
              <p className="text-text-secondary mb-8">
                Dein Archiv ist noch leer. Starte dein erstes Ritual, um deine Pfade zu dokumentieren.
              </p>
              <Link href="/reading">
                <Button>Erstes Reading starten</Button>
              </Link>
            </Panel>
          )}

          <AnimatePresence initial={false}>
            {readings.map((reading) => (
              <motion.div
                key={reading.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Panel className="group">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-2 min-w-0">
                        <div className="flex items-center gap-3">
                           <Calendar className="w-3 h-3 text-gold/40" />
                           <p className="text-[10px] text-gold/60 font-mono uppercase tracking-widest">
                             {new Date(reading.createdAt).toLocaleDateString("de-DE", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                           </p>
                           {reading.questionCategory && (
                              <SymbolChip className="text-[9px]">{reading.questionCategory}</SymbolChip>
                           )}
                        </div>
                        <h3 className="text-lg font-display text-text group-hover:text-gold transition-colors truncate pr-4">
                          {reading.question}
                        </h3>
                      </div>
                      
                      <div className="flex gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setExpanded(expanded === reading.id ? null : reading.id)}
                          className="p-2 rounded-lg bg-surface-raised/40 border border-gold/5 hover:border-gold/20 text-text-muted hover:text-gold transition-all"
                          title="Anzeigen"
                        >
                          {expanded === reading.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(reading.id)}
                          className="p-2 rounded-lg bg-surface-raised/40 border border-gold/5 hover:border-danger-muted/30 text-text-muted hover:text-danger-muted transition-all"
                          title="Löschen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {reading.tarotDraws.map((draw, i) => (
                        <SymbolChip key={i} variant="gold">
                          {draw.card.name}
                          {!draw.upright && " △"}
                        </SymbolChip>
                      ))}
                    </div>

                    <AnimatePresence>
                      {expanded === reading.id && reading.readingText && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-6 border-t border-gold/10"
                        >
                          <div className="text-base text-text-secondary leading-relaxed whitespace-pre-wrap font-serif italic border-l-2 border-gold/20 pl-6 py-2">
                            {reading.readingText}
                          </div>
                          
                          <div className="mt-8 flex justify-end">
                             <Link href={`/reading/${reading.id}`}>
                                <Button variant="ghost" className="text-xs h-8">Vollständiges Ritual ansehen</Button>
                             </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Panel>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
