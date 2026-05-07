"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { calculateNatalChart } from "@/lib/astrology";
import type { ChartResult } from "@/lib/astrology";
import { generateReading } from "@/lib/ai";
import type { ReadingResponse, TarotCard } from "@/lib/ai";
import ReadingPanel from "@/components/ReadingPanel";
import SymbolChip from "@/components/SymbolChip";
import Panel from "@/components/Panel";
import Button from "@/components/Button";

const TEST_BIRTH = new Date(1990, 2, 15, 14, 30);
const TEST_LAT = 47.3769;
const TEST_LON = 8.5417;
const TEST_QUESTION = "Was bedeutet dieser neue Lebensabschnitt für mich?";
const TEST_CARDS: TarotCard[] = [
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
      const chart = await calculateNatalChart(TEST_BIRTH, TEST_LAT, TEST_LON);
      const chartMs = Math.round(performance.now() - chartStart);

      setState((s) => ({ ...s, chart, chartMs, step: "context" }));

      const readingRequest = {
        question: TEST_QUESTION,
        cards: TEST_CARDS,
        chart,
      };
      const contextJson = JSON.stringify(readingRequest, null, 2);

      setState((s) => ({ ...s, contextJson, step: "reading" }));

      const reading = await generateReading(readingRequest);

      setState((s) => ({ ...s, reading, step: "done" }));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setState((s) => ({ ...s, error: message, step: "error" }));
    }
  }, []);

  const isRunning =
    state.step === "chart" ||
    state.step === "context" ||
    state.step === "reading";

  return (
    <div className="min-h-screen bg-surface px-4 py-8">
      <div className="mx-auto max-w-2xl flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-text tracking-tight">
            PoC Pipeline Test
          </h1>
          <Link
            href="/"
            className="text-sm text-text-muted hover:text-gold transition-colors"
          >
            Zurück
          </Link>
        </header>

        <section className="flex flex-col gap-4">
          <Panel>
            <h2 className="font-display text-sm tracking-wide text-gold mb-4">
              Testdaten
            </h2>
            <div className="flex flex-col gap-2 text-sm text-text-secondary">
              <p>
                <span className="text-text-muted">Geburtsdatum:</span>{" "}
                15.03.1990, 14:30 Uhr
              </p>
              <p>
                <span className="text-text-muted">Ort:</span> Zürich (47.3769,
                8.5417)
              </p>
              <p>
                <span className="text-text-muted">Frage:</span> {TEST_QUESTION}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {TEST_CARDS.map((card) => (
                  <SymbolChip key={card.name}>
                    {card.name} ({card.position})
                  </SymbolChip>
                ))}
              </div>
            </div>
          </Panel>

          <Button
            onClick={run}
            disabled={isRunning}
            variant="primary"
            className="self-start"
          >
            {isRunning ? "Pipeline läuft..." : "Pipeline starten"}
          </Button>
        </section>

        {state.step !== "idle" && (
          <PipelineSteps step={state.step} error={state.error} />
        )}

        {state.chart && (
          <Panel>
            <h2 className="font-display text-sm tracking-wide text-gold mb-4">
              Step 1: Natalchart
              {state.chartMs !== null && (
                <span className="ml-2 text-text-muted font-mono text-xs">
                  {state.chartMs} ms
                </span>
              )}
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {state.chart.planets.map((p) => (
                <SymbolChip key={p.name}>
                  {p.name} {p.sign} {p.degree}°
                </SymbolChip>
              ))}
            </div>
            {state.chart.ascendant && (
              <p className="text-sm text-text-secondary">
                <span className="text-text-muted">Aszendent:</span>{" "}
                {state.chart.ascendant.sign} {state.chart.ascendant.degree}°
              </p>
            )}
            {state.chart.aspects.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {state.chart.aspects.map((a, i) => (
                  <SymbolChip key={i}>
                    {a.planet1} {a.type} {a.planet2} ({a.orb}°)
                  </SymbolChip>
                ))}
              </div>
            )}
          </Panel>
        )}

        {state.contextJson && (
          <Panel>
            <button
              type="button"
              onClick={() => setContextOpen((v) => !v)}
              className="flex items-center gap-2 font-display text-sm tracking-wide text-gold w-full text-left"
            >
              <span
                className={`transition-transform ${contextOpen ? "rotate-90" : ""}`}
              >
                ▸
              </span>
              Step 2: Reading Context (JSON)
            </button>
            {contextOpen && (
              <pre className="mt-3 p-4 bg-surface-raised rounded-[var(--radius-card)] overflow-x-auto text-xs font-mono text-text-secondary leading-relaxed">
                {state.contextJson}
              </pre>
            )}
          </Panel>
        )}

        {(state.step === "reading" || state.step === "done") && (
          <ReadingPanel loading={state.step === "reading"}>
            {state.reading?.text}
          </ReadingPanel>
        )}

        {state.reading && (
          <Panel>
            <h2 className="font-display text-sm tracking-wide text-gold mb-4">
              Metriken
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <MetricItem label="Chart" value={`${state.chartMs} ms`} />
              <MetricItem
                label="AI Latenz"
                value={`${state.reading.latencyMs} ms`}
              />
              <MetricItem
                label="Tokens"
                value={String(state.reading.tokensUsed)}
              />
              <MetricItem label="Modell" value={state.reading.model} />
            </div>
          </Panel>
        )}

        {state.error && (
          <Panel className="border-red-500/40">
            <h2 className="font-display text-sm tracking-wide text-red-400 mb-2">
              Fehler
            </h2>
            <p className="text-sm text-text-secondary font-mono whitespace-pre-wrap">
              {state.error}
            </p>
          </Panel>
        )}
      </div>
    </div>
  );
}

function PipelineSteps({
  step,
  error,
}: {
  step: PipelineStep;
  error: string | null;
}) {
  const steps = [
    { id: "chart", label: "1. Chart berechnen" },
    { id: "context", label: "2. Context assemblieren" },
    { id: "reading", label: "3. AI Reading" },
    { id: "done", label: "4. Fertig" },
  ];

  const order: PipelineStep[] = [
    "chart",
    "context",
    "reading",
    "done",
    "error",
  ];
  const currentIdx = order.indexOf(step);

  return (
    <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
      {steps.map((s, i) => {
        const stepIdx = order.indexOf(s.id as PipelineStep);
        const active = currentIdx === stepIdx;
        const completed = currentIdx > stepIdx;

        return (
          <span
            key={s.id}
            className={
              active
                ? "text-gold"
                : completed
                  ? "text-text-secondary"
                  : ""
            }
          >
            {completed ? "✓" : active ? "●" : "○"} {s.label}
            {i < steps.length - 1 && (
              <span className="mx-1 text-text-muted">→</span>
            )}
          </span>
        );
      })}
      {error && (
        <span className="text-red-400 ml-2">
          Fehler: {error.slice(0, 60)}
        </span>
      )}
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-text-muted text-xs">{label}</span>
      <span className="text-text font-mono text-sm">{value}</span>
    </div>
  );
}
