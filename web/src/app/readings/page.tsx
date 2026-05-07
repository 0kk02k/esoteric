"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getSessionToken } from "@/lib/session";
import Panel from "@/components/Panel";
import Button from "@/components/Button";
import SymbolChip from "@/components/SymbolChip";

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

  useEffect(() => {
    const token = getSessionToken();
    if (!token) {
      setLoading(false);
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
    <div className="min-h-screen bg-surface px-4 py-8">
      <div className="mx-auto max-w-xl flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <h1 className="font-display text-xl text-text">Deine Readings</h1>
          <div className="flex gap-3">
            <Link
              href="/reading"
              className="text-sm text-gold hover:text-gold-soft transition-colors"
            >
              Neues Reading
            </Link>
            <Link
              href="/"
              className="text-sm text-text-muted hover:text-gold transition-colors"
            >
              Startseite
            </Link>
          </div>
        </header>

        {loading && (
          <p className="text-sm text-text-muted">Wird geladen...</p>
        )}

        {error && (
          <Panel className="border-danger-muted/40">
            <p className="text-sm text-danger-muted">{error}</p>
          </Panel>
        )}

        {!loading && readings.length === 0 && (
          <Panel>
            <p className="text-sm text-text-secondary text-center py-4">
              Du hast noch keine Readings.
            </p>
            <div className="flex justify-center">
              <Link href="/reading">
                <Button variant="primary">Erstes Reading starten</Button>
              </Link>
            </div>
          </Panel>
        )}

        {readings.map((reading) => (
          <Panel key={reading.id}>
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-sm text-text truncate">{reading.question}</p>
                  <p className="text-xs text-text-muted font-mono">
                    {new Date(reading.createdAt).toLocaleDateString("de-DE")} · {reading.status}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === reading.id ? null : reading.id)}
                    className="text-xs text-gold hover:text-gold-soft transition-colors"
                  >
                    {expanded === reading.id ? "Schliessen" : "Details"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(reading.id)}
                    className="text-xs text-danger-muted hover:text-danger-muted/80 transition-colors"
                  >
                    Löschen
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {reading.tarotDraws.map((draw) => (
                  <SymbolChip key={draw.card.name}>
                    {draw.card.name}
                    {!draw.upright && " △"}
                  </SymbolChip>
                ))}
              </div>

              {expanded === reading.id && reading.readingText && (
                <div className="mt-2 pt-3 border-t border-border">
                  <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {reading.readingText}
                  </div>
                </div>
              )}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
