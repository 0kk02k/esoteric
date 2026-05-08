"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { ChartResult } from "@/lib/astrology";
import type { ReadingResponse, TarotCard as TarotCardType } from "@/lib/ai";
import ReadingPanel from "@/components/ReadingPanel";
import SymbolChip from "@/components/SymbolChip";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import { ArrowLeft, Play, Database, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

const TEST_BIRTH = new Date(1990, 2, 15, 14, 30);
const TEST_LAT = 47.3769;
const TEST_LON = 8.5417;
const TEST_QUESTION = "Was bedeutet dieser neue Lebensabschnitt für mich?";
const TEST_CARDS: TarotCardType[] = [
  { name: "Der Narr", position: "Gegenwart", upright: true },
  { name: "Der Turm", position: "Spannung", upright: true },
  { name: "Die Sterne", position: "Impuls", upright: true },
];

type PipelineStep = "idle" | "chart" | "context" | "reading" | "done" | "error";

type PipelineState = {
  step: PipelineStep;
  chart: ChartResult | null;
  chartMs: number | null;
  reading: ReadingResponse | null;
  contextJson: string | null;
  error: string | null;
};

export default function TestPage() {
  const [state, setState] = useState<PipelineState>({
    step: "idle",
    chart: null,
    chartMs: null,
    reading: null,
    contextJson: null,
    error: null,
  });
  const [contextOpen, setContextOpen] = useState(false);

  const run = useCallback(async () => {
    setState({
      step: "chart",
      chart: null,
      chartMs: null,
      reading: null,
      contextJson: null,
      error: null,
    });
    setContextOpen(false);

    try {
      const chartStart = performance.now();
      const chartRes = await fetch("/api/astrology/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: TEST_BIRTH.toISOString(),
          lat: TEST_LAT,
          lon: TEST_LON,
        }),
      });
      if (!chartRes.ok) throw new Error("Chart calculation failed");
      const chartData = await chartRes.json();
      const chartEnd = performance.now();

      setState((s) => ({
        ...s,
        step: "reading",
        chart: chartData,
        chartMs: Math.round(chartEnd - chartStart),
      }));

      const readingRes = await fetch("/api/test/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: TEST_QUESTION,
          chart: chartData,
          cards: TEST_CARDS,
        }),
      });
      if (!readingRes.ok) throw new Error("Reading generation failed");
      const readingData = await readingRes.json();

      setState((s) => ({
        ...s,
        step: "done",
        reading: readingData.reading,
        contextJson: JSON.stringify(readingData.context, null, 2),
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        step: "error",
        error: err instanceof Error ? err.message : String(err),
      }));
    }
  }, []);

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl flex flex-col gap-8">
        <header className="flex items-center justify-between">
           <div className="space-y-1">
              <h1 className="font-display text-2xl text-text">Pipeline Diagnostik</h1>
              <p className="text-xs font-mono text-gold/40 uppercase tracking-widest">System-Test-Umgebung</p>
           </div>
           <Link href="/" passHref legacyBehavior>
              <Button variant="ghost" className="h-9 px-4 text-xs">
                 <ArrowLeft className="w-4 h-4 mr-2" /> Home
              </Button>
           </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Panel className="md:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-sm font-mono text-gold/60 uppercase tracking-widest">Test-Szenario</h2>
                 <Button 
                    onClick={run} 
                    disabled={state.step !== "idle" && state.step !== "done" && state.step !== "error"}
                    className="h-9 px-4 text-xs"
                 >
                    <Play className="w-3 h-3 mr-2 fill-current" /> Test-Lauf starten
                 </Button>
              </div>

              <div className="space-y-4">
                 <div className="p-4 rounded-lg bg-surface-raised/40 border border-gold/5 space-y-2">
                    <p className="text-[10px] text-gold/40 uppercase font-mono tracking-widest">Frage</p>
                    <p className="text-sm text-text italic">&quot;{TEST_QUESTION}&quot;</p>
                 </div>
                 
                 <div className="p-4 rounded-lg bg-surface-raised/40 border border-gold/5 space-y-3">
                    <p className="text-[10px] text-gold/40 uppercase font-mono tracking-widest">Karten</p>
                    <div className="flex gap-2">
                       {TEST_CARDS.map(c => (
                          <SymbolChip key={c.name} variant="gold">{c.name}</SymbolChip>
                       ))}
                    </div>
                 </div>
              </div>

              {state.reading && (
                 <div className="mt-8 space-y-4">
                    <h3 className="text-xs font-mono text-violet uppercase tracking-widest">Output</h3>
                    <ReadingPanel model={state.reading.model}>
                       {state.reading.text}
                    </ReadingPanel>
                 </div>
              )}

              {state.error && (
                 <Panel className="border-danger-muted/30 bg-danger-muted/5">
                    <p className="text-danger-muted font-mono text-xs">{state.error}</p>
                 </Panel>
              )}
           </Panel>

           <div className="space-y-6">
              <Panel variant="raised">
                 <div className="flex items-center gap-2 mb-4">
                    <Database className="w-4 h-4 text-gold/40" />
                    <h3 className="text-xs font-mono text-gold/60 uppercase tracking-widest">Status</h3>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-text-muted">Phase</span>
                       <span className={cn(
                          "font-mono uppercase px-2 py-0.5 rounded-full bg-gold/5",
                          state.step === "done" ? "text-success-muted" : "text-gold"
                       )}>{state.step}</span>
                    </div>
                    {state.chartMs && (
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-text-muted">Astro Latency</span>
                          <span className="font-mono text-gold">{state.chartMs}ms</span>
                       </div>
                    )}
                 </div>
              </Panel>

              {state.contextJson && (
                 <Panel>
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-gold/40" />
                          <h3 className="text-xs font-mono text-gold/60 uppercase tracking-widest">Context</h3>
                       </div>
                       <button 
                          onClick={() => setContextOpen(!contextOpen)}
                          className="text-[10px] font-mono text-gold hover:underline"
                       >
                          {contextOpen ? "Verbergen" : "Anzeigen"}
                       </button>
                    </div>
                    {contextOpen && (
                       <pre className="text-[10px] text-text-muted font-mono leading-tight max-h-60 overflow-y-auto bg-black/40 p-3 rounded border border-gold/5">
                          {state.contextJson}
                       </pre>
                    )}
                 </Panel>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
