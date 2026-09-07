"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { getSessionToken } from "@/lib/session";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import ReadingPanel from "@/components/ReadingPanel";
import TarotCard from "@/components/TarotCard";
import { Constellation } from "@/components/Constellation";
import { CrystalSpinner } from "@/components/CrystalSpinner";
import { ArrowLeft, Calendar, User, MessageCircle } from "lucide-react";

type TarotDraw = {
  card: { id?: string; name: string; element: string | null; zodiacAssociation: string | null };
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

/** Rohwerte aus der DB in deutscher UI-Sprache. */
const STATUS_LABELS: Record<string, string> = {
  pending: "Ausstehend",
  completed: "Abgeschlossen",
  failed: "Fehlgeschlagen",
};

export default function ReadingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [regenerating, setRegenerating] = useState(false);

  // Retry für ein Reading ohne Deutung — der Generate-Endpoint braucht keinen Body
  const regenerate = async () => {
    setRegenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/readings/${id}/generate`, { method: "POST" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
        throw new Error(typeof data.error === "string" ? data.error : `Fehler: ${res.status}`);
      }
      const token = getSessionToken();
      const r = await fetch(`/api/readings/${id}${token ? `?sessionToken=${encodeURIComponent(token)}` : ""}`);
      if (r.ok) setReading(await r.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Die Deutung konnte nicht erzeugt werden.");
    } finally {
      setRegenerating(false);
    }
  };

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

  const buildShareUrl = () => {
    const token = getSessionToken();
    // Der geteilte Link trägt denselben Session-Token wie der Abruf —
    // „Nur wer den Link hat" ist sonst ein Versprechen ohne Funktion.
    return `${window.location.origin}/readings/${id}${token ? `?sessionToken=${encodeURIComponent(token)}` : ""}`;
  };

  const copyLink = async () => {
    const url = buildShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
    } catch {
      // Clipboard kann verweigert werden — dann den Link wenigstens sichtbar machen
      setShareUrl(url);
      setCopyState("failed");
      return;
    }
    window.setTimeout(() => setCopyState("idle"), 2500);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <CrystalSpinner label="Rufe Ritual ab..." />
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
                 <div className="flex items-center gap-4 text-text-muted">
                    {/* Signet der Legung — dieselbe Konstellation wie im Flow */}
                    <Constellation
                      cardIds={reading.tarotDraws.map((d) => d.card.id ?? d.card.name)}
                      className="h-8"
                    />
                    <span className="flex items-center gap-3">
                       <Calendar className="w-4 h-4" />
                       <span className="text-xs font-mono uppercase tracking-widest">
                          {new Date(reading.createdAt).toLocaleDateString("de-DE", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </span>
                 </div>
                 <h1 className="font-display text-3xl sm:text-5xl text-text leading-tight">
                    {reading.question}
                 </h1>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-raised/40 border border-gold/10 rounded-full">
                 <User className="w-3 h-3 text-gold/60" />
                 <span className="text-[10px] font-mono text-gold/80 uppercase tracking-widest">
                    {STATUS_LABELS[reading.status] ?? reading.status}
                 </span>
              </div>

           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-12">
              <section>
                 {reading.readingText ? (
                    <ReadingPanel model={reading.model || "KI"}>
                       {reading.readingText}
                    </ReadingPanel>
                 ) : (
                    /* Kein Deutungstext ist ein eigener Zustand — kein leeres KI-Panel */
                    <Panel className="border-gold/20 bg-surface/40 py-12 text-center space-y-5">
                       <p className="text-text-secondary leading-relaxed max-w-md mx-auto">
                          Für dieses Reading wurde keine Deutung erzeugt — der Durchgang wurde vermutlich unterbrochen.
                          Deine Karten sind da.
                       </p>
                       {error && <p className="text-sm text-danger-muted">{error}</p>}
                       <Button onClick={regenerate} disabled={regenerating} className="h-11">
                          {regenerating ? "Deutung entsteht ..." : "Deutung jetzt erzeugen"}
                       </Button>
                    </Panel>
                 )}
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
                       <span className="text-xs font-mono text-success-muted uppercase">{STATUS_LABELS[reading.status] ?? reading.status}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gold/5 pb-2">
                       <span className="text-[10px] text-text-muted uppercase">Kategorie</span>
                       <span className="text-xs font-mono text-gold uppercase">{reading.questionCategory || "Allgemein"}</span>
                    </div>
                    {/* Nur belegen, was wirklich lief — KI-Transparenz verbietet
                        ein Modell, das nie gelaufen ist */}
                    {reading.model && (
                       <div className="flex justify-between items-center border-b border-gold/5 pb-2">
                          <span className="text-[10px] text-text-muted uppercase">KI-Modell</span>
                          <span className="text-xs font-mono text-violet-soft">{reading.model}</span>
                       </div>
                    )}
                 </div>
              </Panel>

              <Panel variant="raised" className="bg-gold/5 border-gold/20">
                 <h3 className="text-sm font-display text-gold mb-2">Teilen</h3>
                 <p className="text-xs text-text-muted mb-4 leading-relaxed">
                    Dieses Ritual ist privat. Wer den Link hat, kann es sehen — teile ihn nur mit Menschen, die es sehen dürfen.
                 </p>
                 <Button onClick={copyLink} variant="secondary" className="w-full text-xs h-11">
                    {copyState === "copied" ? "Link kopiert" : copyState === "failed" ? "Kopieren nicht möglich" : "Link kopieren"}
                 </Button>
                 {copyState === "failed" && shareUrl && (
                    <p className="text-[10px] font-mono text-text-muted mt-3 break-all" role="status">
                      {shareUrl}
                    </p>
                 )}
              </Panel>
           </aside>
        </div>
      </div>
    </div>
  );
}
