"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { getSessionToken } from "@/lib/session";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import ReadingPanel from "@/components/ReadingPanel";
import TarotCard from "@/components/TarotCard";
import { ArrowLeft, Calendar, User, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

type TarotDraw = {
  card: { name: string; element: string | null; zodiacAssociation: string | null };
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
  model: string | null;
};

export default function ReadingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getSessionToken();
    fetch(`/api/readings/${id}${token ? `?sessionToken=${encodeURIComponent(token)}` : ""}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Error: ${r.status}`);
        return r.json();
      })
      .then((data: Reading) => {
        setReading(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Fehler beim Laden");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 rounded-full border-2 border-gold/20 border-t-gold animate-spin mb-4" />
        <p className="text-xs font-mono text-gold/40 uppercase tracking-[0.3em]">Rufe Ritual ab...</p>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <Panel className="max-w-md border-danger-muted/30">
          <p className="text-danger-muted mb-6 text-center">{error || "Reading nicht gefunden"}</p>
          <Link href="/readings">
            <Button variant="secondary" className="w-full">Zum Archiv</Button>
          </Link>
        </Panel>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-4xl flex flex-col gap-12">
        <header className="flex flex-col gap-6">
           <Link href="/readings" className="group flex items-center gap-2 text-xs font-mono text-gold/60 hover:text-gold uppercase tracking-widest transition-colors w-fit">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Zurück zum Archiv
           </Link>
           
           <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="space-y-3">
                 <div className="flex items-center gap-3 text-text-muted">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase tracking-widest">
                       {new Date(reading.createdAt).toLocaleDateString("de-DE", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                 </div>
                 <h1 className="font-display text-3xl sm:text-5xl text-text leading-tight">
                    {reading.question}
                 </h1>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-raised/40 border border-gold/10 rounded-full">
                 <User className="w-3 h-3 text-gold/60" />
                 <span className="text-[10px] font-mono text-gold/80 uppercase tracking-widest">Reading #{reading.id.slice(-4)}</span>
              </div>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-12">
              <section>
                 <ReadingPanel model={reading.model || "KI"}>
                    {reading.readingText}
                 </ReadingPanel>
              </section>

              <section className="space-y-6">
                 <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-gold/40" />
                    <h3 className="text-xs font-mono text-gold/60 uppercase tracking-[0.2em]">Symbolischer Kontext</h3>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {reading.tarotDraws.map((draw, i) => (
                       <TarotCard 
                          key={i}
                          name={draw.card.name}
                          position={draw.position}
                          upright={draw.upright}
                          element={draw.card.element}
                          zodiacAssociation={draw.card.zodiacAssociation}
                          revealed={true}
                       />
                    ))}
                 </div>
              </section>
           </div>

           <aside className="space-y-8">
              <Panel className="bg-surface/30">
                 <h3 className="text-xs font-mono text-gold/60 uppercase tracking-[0.2em] mb-4">Metadaten</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gold/5 pb-2">
                       <span className="text-[10px] text-text-muted uppercase">Status</span>
                       <span className="text-xs font-mono text-success-muted uppercase">{reading.status}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gold/5 pb-2">
                       <span className="text-[10px] text-text-muted uppercase">Kategorie</span>
                       <span className="text-xs font-mono text-gold uppercase">{reading.questionCategory || "General"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gold/5 pb-2">
                       <span className="text-[10px] text-text-muted uppercase">Provider</span>
                       <span className="text-xs font-mono text-violet/60">ANTHROPIC</span>
                    </div>
                 </div>
              </Panel>

              <Panel variant="raised" className="bg-gold/5 border-gold/20">
                 <h3 className="text-sm font-display text-gold mb-2">Teilen</h3>
                 <p className="text-xs text-text-muted mb-4 leading-relaxed">Dieses Ritual ist privat. Nur Personen mit Zugriff auf deine Session können es sehen.</p>
                 <Button variant="secondary" className="w-full text-xs h-9">Link kopieren</Button>
              </Panel>
           </aside>
        </div>
      </div>
    </div>
  );
}
