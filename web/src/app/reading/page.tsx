"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import StepIndicator from "@/components/StepIndicator";
import TarotCard from "@/components/TarotCard";
import FeedbackForm from "@/components/FeedbackForm";
import Panel from "@/components/Panel";
import Button from "@/components/Button";
import type { ReadingResponse } from "@/lib/ai";
import { getOrCreateSessionToken } from "@/lib/session";

type Step = "question" | "birth" | "drawing" | "generating" | "result";

type DrawnCard = {
  id: string;
  name: string;
  position: string;
  upright: boolean;
  element: string | null;
  zodiacAssociation: string | null;
};

type ReadingState = {
  step: Step;
  question: string;
  questionCategory: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  includeBirth: boolean;
  birthProfileId: string | null;
  readingId: string | null;
  cards: DrawnCard[];
  revealed: boolean[];
  result: ReadingResponse | null;
  error: string | null;
  sessionToken: string;
  readingsRemaining: number | null;
  followupQuestion: string;
  followupResult: string | null;
  followupLoading: boolean;
};

const INITIAL_STATE: ReadingState = {
  step: "question",
  question: "",
  questionCategory: "selbstreflexion",
  birthDate: "",
  birthTime: "",
  birthCity: "",
  includeBirth: false,
  birthProfileId: null,
  readingId: null,
  cards: [],
  revealed: [false, false, false],
  result: null,
  error: null,
  sessionToken: "",
  readingsRemaining: null,
  followupQuestion: "",
  followupResult: null,
  followupLoading: false,
};

const CATEGORIES = [
  { value: "beziehung", label: "Beziehung" },
  { value: "beruf", label: "Beruf" },
  { value: "selbstreflexion", label: "Selbstreflexion" },
  { value: "spirituell", label: "Spirituell" },
  { value: "sonstiges", label: "Sonstiges" },
];

export default function ReadingPage() {
  const [state, setState] = useState<ReadingState>(INITIAL_STATE);

  useEffect(() => {
    const token = getOrCreateSessionToken();
    setState((s) => ({ ...s, sessionToken: token }));
  }, []);

  const submitQuestion = () => {
    if (state.question.trim().length < 5) return;
    setState((s) => ({ ...s, step: "birth", error: null }));
  };

  const submitBirth = useCallback(async () => {
    if (!state.includeBirth) {
      setState((s) => ({ ...s, step: "drawing" }));
      createReading(state.question, state.questionCategory, null);
      return;
    }

    try {
      const bpRes = await fetch("/api/birth-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: state.birthDate,
          birthTime: state.birthTime || undefined,
          birthCity: state.birthCity || undefined,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          sessionToken: state.sessionToken || undefined,
        }),
      });
      if (!bpRes.ok) throw new Error(`Birth profile error: ${bpRes.status}`);
      const bp = await bpRes.json();
      setState((s) => ({ ...s, birthProfileId: bp.id, step: "drawing" }));
      createReading(state.question, state.questionCategory, bp.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setState((s) => ({ ...s, error: msg }));
    }
  }, [state.includeBirth, state.birthDate, state.birthTime, state.birthCity, state.question, state.questionCategory, state.sessionToken]);

  const createReading = async (question: string, category: string, birthProfileId: string | null) => {
    try {
      const res = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          questionCategory: category,
          birthProfileId: birthProfileId ?? undefined,
          sessionToken: state.sessionToken || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        if (res.status === 429) {
          setState((s) => ({ ...s, error: `Tageslimit erreicht. ${err.readingsRemaining ?? 0} Readings übrig.`, readingsRemaining: 0 }));
          return;
        }
        throw new Error(err.error || `Reading error: ${res.status}`);
      }
      const reading = await res.json();
      const cards: DrawnCard[] = reading.tarotDraws.map((d: { card: { id: string; name: string; element: string | null; zodiacAssociation: string | null }; position: string; upright: boolean }) => ({
        id: d.card.id,
        name: d.card.name,
        position: d.position,
        upright: d.upright,
        element: d.card.element,
        zodiacAssociation: d.card.zodiacAssociation,
      }));
      setState((s) => ({ ...s, readingId: reading.id, cards }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setState((s) => ({ ...s, error: msg }));
    }
  };

  const revealCard = (index: number) => {
    setState((s) => {
      const revealed = [...s.revealed];
      revealed[index] = true;
      return { ...s, revealed };
    });
  };

  const allRevealed = state.revealed.every(Boolean);

  const generateAIReading = useCallback(async () => {
    if (!state.readingId) return;
    setState((s) => ({ ...s, step: "generating", error: null }));

    try {
      const res = await fetch(`/api/readings/${state.readingId}/generate`, {
        method: "POST",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Generation error: ${res.status}`);
      }
      const result: ReadingResponse = await res.json();
      setState((s) => ({ ...s, result, step: "result" }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setState((s) => ({ ...s, error: msg, step: "result" }));
    }
  }, [state.readingId]);

  const submitFollowup = useCallback(async () => {
    if (!state.readingId || !state.followupQuestion.trim()) return;
    setState((s) => ({ ...s, followupLoading: true }));
    try {
      const res = await fetch(`/api/readings/${state.readingId}/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: state.followupQuestion,
          sessionToken: state.sessionToken,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Follow-up error: ${res.status}`);
      }
      const data = await res.json();
      setState((s) => ({ ...s, followupResult: data.text, followupQuestion: "", followupLoading: false }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setState((s) => ({ ...s, error: msg, followupLoading: false }));
    }
  }, [state.readingId, state.followupQuestion, state.sessionToken]);

  return (
    <div className="min-h-screen bg-surface px-4 py-8">
      <div className="mx-auto max-w-xl flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <StepIndicator current={state.step} />
          <Link
            href="/"
            className="text-sm text-text-muted hover:text-gold transition-colors"
          >
            Abbrechen
          </Link>
        </header>

        {state.error && (
          <Panel className="border-danger-muted/40">
            <p className="text-sm text-danger-muted font-mono">{state.error}</p>
          </Panel>
        )}

        {/* Step 1: Question */}
        {state.step === "question" && (
          <Panel>
            <h2 className="font-display text-lg text-text mb-4">
              Was beschäftigt dich?
            </h2>
            <textarea
              value={state.question}
              onChange={(e) => setState((s) => ({ ...s, question: e.target.value }))}
              placeholder="Stelle deine Frage oder beschreibe dein Thema..."
              rows={3}
              maxLength={500}
              className="w-full bg-surface-raised border border-border rounded-[var(--radius-input)] px-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-gold/50 resize-none mb-4"
            />
            <p className="text-xs text-text-muted mb-4">
              Symbolische Reflexion, keine professionelle Beratung.
            </p>

            <div className="mb-6">
              <p className="text-xs text-text-muted mb-2">Themenbereich</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setState((s) => ({ ...s, questionCategory: cat.value }))}
                    className={`text-xs font-mono px-3 py-1 rounded-full transition-all ${
                      state.questionCategory === cat.value
                        ? "bg-gold/20 text-gold border border-gold/30"
                        : "bg-surface-raised text-text-muted border border-transparent hover:border-border"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={submitQuestion}
              disabled={state.question.trim().length < 5}
              variant="primary"
            >
              Weiter
            </Button>
          </Panel>
        )}

        {/* Step 2: Birth data */}
        {state.step === "birth" && (
          <Panel>
            <h2 className="font-display text-lg text-text mb-2">
              Geburtsdaten
              <span className="text-sm text-text-muted font-sans ml-2">optional</span>
            </h2>
            <p className="text-sm text-text-muted mb-4">
              Mit Geburtsdatum und -ort können wir dein Geburtshoroskop als zusätzliche Symbolschicht einbeziehen.
            </p>

            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={state.includeBirth}
                onChange={(e) => setState((s) => ({ ...s, includeBirth: e.target.checked }))}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-sm text-text-secondary">
                Geburtsdaten angeben
              </span>
            </label>

            {state.includeBirth && (
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Geburtsdatum *</label>
                  <input
                    type="date"
                    value={state.birthDate}
                    onChange={(e) => setState((s) => ({ ...s, birthDate: e.target.value }))}
                    max={new Date().toISOString().split("T")[0]}
                    min="1900-01-01"
                    className="w-full bg-surface-raised border border-border rounded-[var(--radius-input)] px-4 py-2.5 text-sm text-text focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">
                    Geburtszeit
                    <span className="text-text-muted"> — unbekannt? Freilassen.</span>
                  </label>
                  <input
                    type="time"
                    value={state.birthTime}
                    onChange={(e) => setState((s) => ({ ...s, birthTime: e.target.value }))}
                    className="w-full bg-surface-raised border border-border rounded-[var(--radius-input)] px-4 py-2.5 text-sm text-text focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted mb-1 block">Geburtsort</label>
                  <input
                    type="text"
                    value={state.birthCity}
                    onChange={(e) => setState((s) => ({ ...s, birthCity: e.target.value }))}
                    placeholder="z.B. Berlin"
                    className="w-full bg-surface-raised border border-border rounded-[var(--radius-input)] px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={() => setState((s) => ({ ...s, step: "question" }))} variant="secondary">
                Zurück
              </Button>
              <Button
                onClick={submitBirth}
                disabled={state.includeBirth && !state.birthDate}
                variant="primary"
              >
                Weiter
              </Button>
            </div>
          </Panel>
        )}

        {/* Step 3: Card drawing */}
        {state.step === "drawing" && (
          <Panel>
            <h2 className="font-display text-lg text-text mb-2">
              Deine Karten
            </h2>
            <p className="text-sm text-text-muted mb-6">
              {state.cards.length === 0
                ? "Karten werden gezogen..."
                : allRevealed
                  ? "Deine drei Karten sind aufgedeckt."
                  : "Tippe auf jede Karte, um sie aufzudecken."}
            </p>

            {state.cards.length > 0 && (
              <div className="flex justify-center gap-4 sm:gap-6 mb-6">
                {state.cards.map((card, i) => (
                  <TarotCard
                    key={card.id}
                    name={card.name}
                    position={card.position}
                    upright={card.upright}
                    element={card.element}
                    zodiacAssociation={card.zodiacAssociation}
                    revealed={state.revealed[i]}
                    onReveal={() => revealCard(i)}
                  />
                ))}
              </div>
            )}

            {allRevealed && (
              <div className="flex flex-col items-center gap-3">
                <Button onClick={generateAIReading} variant="primary">
                  Deutung erstellen
                </Button>
                <p className="text-xs text-text-muted">
                  Deine Frage wird mit den drei Karten und ggf. deinem Horoskop verknüpft.
                </p>
              </div>
            )}
          </Panel>
        )}

        {/* Step 4: Generating */}
        {state.step === "generating" && (
          <Panel variant="ai">
            <div className="flex flex-col items-center gap-4 py-8">
              <span className="relative flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet opacity-60" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-violet" />
              </span>
              <p className="text-sm text-text-secondary">
                Deine Deutung wird erstellt...
              </p>
              <p className="text-xs text-text-muted">
                Die KI verknüpft deine Frage, die Karten und ggf. dein Horoskop.
              </p>
            </div>
          </Panel>
        )}

        {/* Step 5: Result */}
        {state.step === "result" && (
          <>
            <Panel variant="ai">
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-sm tracking-wide text-violet">
                  Deine Deutung
                </h3>
                {state.result ? (
                  <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                    {state.result.text}
                  </div>
                ) : (
                  <p className="text-sm text-danger-muted">
                    Die Deutung konnte nicht erstellt werden. Bitte versuche es später erneut.
                  </p>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-text-muted border-t border-border pt-3">
                  <span>Symbolische Reflexion</span>
                  <span>·</span>
                  <span>Keine professionelle Beratung</span>
                  {state.result && (
                    <>
                      <span>·</span>
                      <span className="font-mono">{state.result.model}</span>
                    </>
                  )}
                </div>
              </div>
            </Panel>

            {/* Follow-up */}
            {state.result && !state.followupResult && (
              <Panel>
                <h3 className="font-display text-sm tracking-wide text-gold mb-3">
                  Nachfrage
                </h3>
                <p className="text-xs text-text-muted mb-3">
                  Eine Nachfrage pro Reading ist kostenlos.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={state.followupQuestion}
                    onChange={(e) => setState((s) => ({ ...s, followupQuestion: e.target.value }))}
                    placeholder="Was möchtest du genauer wissen?"
                    maxLength={300}
                    className="flex-1 bg-surface-raised border border-border rounded-[var(--radius-input)] px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-gold/50"
                  />
                  <Button
                    onClick={submitFollowup}
                    disabled={state.followupQuestion.trim().length < 3 || state.followupLoading}
                    variant="secondary"
                  >
                    {state.followupLoading ? "..." : "Fragen"}
                  </Button>
                </div>
              </Panel>
            )}

            {state.followupResult && (
              <Panel variant="ai">
                <h3 className="font-display text-sm tracking-wide text-violet mb-3">
                  Nachfrage — Antwort
                </h3>
                <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                  {state.followupResult}
                </div>
              </Panel>
            )}

            {state.readingId && (
              <Panel>
                <h3 className="font-display text-sm tracking-wide text-gold mb-4">
                  Feedback
                </h3>
                <FeedbackForm readingId={state.readingId} />
              </Panel>
            )}

            <div className="flex flex-col items-center gap-3">
              <Link
                href="/reading"
                className="text-sm text-gold hover:text-gold-soft transition-colors"
                onClick={() => setState(INITIAL_STATE)}
              >
                Neues Reading starten
              </Link>
              <Link
                href="/readings"
                className="text-sm text-text-muted hover:text-gold transition-colors"
              >
                Meine Readings
              </Link>
              <p className="text-xs text-text-muted">
                3 kostenlose Readings pro Tag
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
