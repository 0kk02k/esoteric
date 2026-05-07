"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import StepIndicator from "@/components/StepIndicator";
import TarotCard from "@/components/TarotCard";
import FeedbackForm from "@/components/FeedbackForm";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import { KineticBlueprint } from "@/components/KineticBlueprint";
import { Sparkles, ArrowLeft, RefreshCw, X, Info, LayoutGrid, MessageSquare } from "lucide-react";
import type { ReadingResponse } from "@/lib/ai";
import { getOrCreateSessionToken } from "@/lib/session";
import { cn } from "@/lib/utils";

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

  const createReading = useCallback(async (question: string, category: string, birthProfileId: string | null) => {
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
      const cards: DrawnCard[] = reading.tarotDraws.map((d: any) => ({
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
  }, [state.sessionToken]);

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
  }, [state.includeBirth, state.birthDate, state.birthTime, state.birthCity, state.question, state.questionCategory, createReading, state.sessionToken]);

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
    <div className="flex-1 px-4 py-8 sm:py-16 relative overflow-hidden">
      {/* Expanded Layout Wrapper */}
      <div className="mx-auto max-w-7xl flex flex-col gap-12 relative z-10">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gold/10 pb-8">
          <div className="flex flex-col gap-2">
             <h2 className="text-[10px] font-mono text-gold/60 uppercase tracking-[0.3em]">System-Ritual</h2>
             <h1 className="text-3xl sm:text-5xl font-display font-medium text-text">Prozess-Umgebung</h1>
             <div className="mt-4">
               <StepIndicator current={state.step} />
             </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-text-muted uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-success-muted animate-pulse" />
                Stream Aktiv
             </div>
             <Link
                href="/"
                className="group flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Abbrechen</span>
              </Link>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <AnimatePresence mode="wait">
             {state.error && (
               <motion.div
                 key="global-error"
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: "auto" }}
                 exit={{ opacity: 0, height: 0 }}
                 className="lg:col-span-12"
               >
                 <Panel className="border-danger-muted/40 bg-danger-muted/5">
                   <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-danger-muted mt-1.5 shrink-0" />
                      <p className="text-sm text-danger-muted font-mono leading-relaxed">{state.error}</p>
                   </div>
                 </Panel>
               </motion.div>
             )}

             {/* Dynamic Content Area */}
             <div 
                key="main-content-area"
                className={cn(
                  "lg:col-span-12 transition-all duration-700",
                  state.step === "result" ? "lg:col-span-8" : "lg:col-span-8 lg:col-start-3"
                )}
             >
                <AnimatePresence mode="wait">
                  {/* Step 1: Question */}
                  {state.step === "question" && (
                    <motion.div
                      key="question"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Panel className="p-8 sm:p-12">
                        <div className="flex items-center gap-4 mb-8">
                           <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-gold" />
                           </div>
                           <h2 className="font-display text-3xl sm:text-4xl text-text leading-tight">Was beschäftigt dich?</h2>
                        </div>
                        
                        <textarea
                          value={state.question}
                          onChange={(e) => setState((s) => ({ ...s, question: e.target.value }))}
                          placeholder="Beschreibe dein Thema oder stelle eine offene Frage..."
                          rows={6}
                          maxLength={500}
                          className="w-full bg-surface-raised/30 border border-gold/10 rounded-2xl px-6 py-5 text-xl text-text placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-all resize-none mb-8 shadow-inner"
                        />

                        <div className="mb-10">
                          <p className="text-[10px] font-mono text-gold/60 uppercase tracking-widest mb-6 px-1">Themenbereich</p>
                          <div className="flex flex-wrap gap-3">
                            {CATEGORIES.map((cat) => (
                              <button
                                key={cat.value}
                                type="button"
                                onClick={() => setState((s) => ({ ...s, questionCategory: cat.value }))}
                                className={cn(
                                   "text-xs font-mono px-6 py-3 rounded-full transition-all border",
                                   state.questionCategory === cat.value
                                     ? "bg-gold/20 text-gold border-gold/40 shadow-[0_0_15px_rgba(200,164,93,0.15)]"
                                     : "bg-surface-raised/40 text-text-muted border-gold/5 hover:border-gold/20 hover:text-text-secondary"
                                )}
                              >
                                {cat.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                          <Button
                            onClick={submitQuestion}
                            disabled={state.question.trim().length < 5}
                            className="w-full sm:w-auto min-w-[200px] h-14 text-lg"
                          >
                            Kontinuieren
                          </Button>
                          <div className="flex items-center gap-2 text-[11px] text-text-muted italic max-w-xs">
                             <Info className="w-4 h-4 shrink-0" />
                             Symbolische Reflexion als Brücke zur Selbsterkenntnis.
                          </div>
                        </div>
                      </Panel>
                    </motion.div>
                  )}

                  {/* Step 2: Birth data */}
                  {state.step === "birth" && (
                    <motion.div
                      key="birth"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Panel className="p-8 sm:p-12">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-gold" />
                           </div>
                           <h2 className="font-display text-3xl sm:text-4xl text-text">Himmelsmechanik</h2>
                        </div>
                        
                        <p className="text-xl text-text-secondary leading-relaxed mb-10 max-w-2xl">
                          Möchtest du dein persönliches Geburtshoroskop als zusätzliche Symbolschicht in die Deutung einfließen lassen?
                        </p>

                        <label className="group flex items-center gap-6 p-6 rounded-2xl border border-gold/10 hover:border-gold/30 hover:bg-gold/5 transition-all cursor-pointer mb-10 bg-surface-raised/20">
                          <div className={cn(
                             "w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center",
                             state.includeBirth ? 'bg-gold border-gold shadow-[0_0_15px_rgba(200,164,93,0.4)]' : 'border-gold/30'
                          )}>
                             {state.includeBirth && <div className="w-2.5 h-2.5 bg-bg rounded-full" />}
                          </div>
                          <input
                            type="checkbox"
                            checked={state.includeBirth}
                            onChange={(e) => setState((s) => ({ ...s, includeBirth: e.target.checked }))}
                            className="hidden"
                          />
                          <div className="flex flex-col">
                             <span className="text-lg text-text group-hover:text-gold transition-colors">Geburtsdaten präzisieren</span>
                             <span className="text-xs text-text-muted uppercase font-mono tracking-widest mt-1">Aktiviert Astronomische Berechnung</span>
                          </div>
                        </label>

                        {state.includeBirth && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex flex-col gap-8 mb-12"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                <label className="text-[10px] font-mono text-gold/60 uppercase tracking-[0.3em] px-1">Geburtsdatum</label>
                                <input
                                  type="date"
                                  value={state.birthDate}
                                  onChange={(e) => setState((s) => ({ ...s, birthDate: e.target.value }))}
                                  className="w-full bg-surface-raised/50 border border-gold/10 rounded-xl px-6 py-4 text-lg text-text focus:outline-none focus:border-gold/40 transition-all shadow-inner"
                                />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-mono text-gold/60 uppercase tracking-[0.3em] px-1">Geburtszeit (Optional)</label>
                                <input
                                  type="time"
                                  value={state.birthTime}
                                  onChange={(e) => setState((s) => ({ ...s, birthTime: e.target.value }))}
                                  className="w-full bg-surface-raised/50 border border-gold/10 rounded-xl px-6 py-4 text-lg text-text focus:outline-none focus:border-gold/40 transition-all shadow-inner"
                                />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-mono text-gold/60 uppercase tracking-[0.3em] px-1">Geburtsort</label>
                              <input
                                type="text"
                                value={state.birthCity}
                                onChange={(e) => setState((s) => ({ ...s, birthCity: e.target.value }))}
                                placeholder="z.B. Berlin, Deutschland"
                                className="w-full bg-surface-raised/50 border border-gold/10 rounded-xl px-6 py-4 text-lg text-text placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-all shadow-inner"
                              />
                            </div>
                          </motion.div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-6 pt-4">
                          <Button
                            onClick={submitBirth}
                            disabled={state.includeBirth && !state.birthDate}
                            className="w-full sm:w-auto min-w-[240px] h-14 text-lg"
                          >
                            {state.includeBirth ? "Berechnen & Weiter" : "Ohne Horoskop fortfahren"}
                          </Button>
                          <Button 
                            onClick={() => setState((s) => ({ ...s, step: "question" }))} 
                            variant="ghost"
                            className="w-full sm:w-auto h-14 px-8"
                          >
                            <ArrowLeft className="w-4 h-4 mr-3" /> Zurück
                          </Button>
                        </div>
                      </Panel>
                    </motion.div>
                  )}

                  {/* Step 3: Card drawing */}
                  {state.step === "drawing" && (
                    <motion.div
                      key="drawing"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      className="flex flex-col items-center gap-16 py-8"
                    >
                      <div className="text-center space-y-4">
                         <h2 className="font-display text-4xl sm:text-5xl text-text">Die Ziehung</h2>
                         <p className="text-xl text-text-secondary max-w-xl mx-auto leading-relaxed">
                           {state.cards.length === 0
                             ? "Die Mechanik wählt deine Symbole..."
                             : allRevealed
                               ? "Die Resonanz ist vollständig."
                               : "Aktiviere die Karten durch Berührung."}
                         </p>
                      </div>

                      <div className="relative w-full flex justify-center py-12">
                        {/* Visual Connector Lines (Kinetic) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent z-0" />
                        
                        {state.cards.length > 0 ? (
                          <div className="flex flex-wrap justify-center gap-12 sm:gap-20 relative z-10">
                            {state.cards.map((card, i) => (
                              <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="scale-110 sm:scale-125"
                              >
                                <TarotCard
                                  name={card.name}
                                  position={card.position}
                                  upright={card.upright}
                                  element={card.element}
                                  zodiacAssociation={card.zodiacAssociation}
                                  revealed={state.revealed[i]}
                                  onReveal={() => revealCard(i)}
                                />
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-[320px] flex items-center justify-center">
                             <RefreshCw className="w-16 h-16 text-gold/20 animate-spin" />
                          </div>
                        )}
                      </div>

                      <AnimatePresence>
                        {allRevealed && (
                          <motion.div 
                            key="start-button-reveal"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-6 mt-8"
                          >
                            <Button onClick={generateAIReading} className="px-16 h-16 text-xl shadow-[0_0_30px_rgba(200,164,93,0.3)]">
                              Synthese starten
                            </Button>
                            <p className="text-xs font-mono text-gold/60 uppercase tracking-[0.4em] text-center max-w-sm">
                              Synthetisiere Symbol-Vektoren
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* Step 4: Generating */}
                  {state.step === "generating" && (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-32"
                    >
                      <div className="relative w-48 h-48 mb-16">
                         <div className="absolute inset-0 border-2 border-violet/10 rounded-full animate-[spin_6s_linear_infinite]" />
                         <div className="absolute inset-8 border border-violet/30 rounded-full animate-[spin_4s_linear_infinite_reverse]" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-12 h-12 text-violet animate-pulse" />
                         </div>
                      </div>
                      <h2 className="font-display text-3xl text-text mb-4 uppercase tracking-widest">Synthese läuft</h2>
                      <p className="text-xl text-text-secondary text-center max-w-md leading-relaxed font-serif italic">
                        GPT-5.4 verwebt die symbolischen Fäden deiner Auswahl zu einem kohärenten Spiegelbild...
                      </p>
                    </motion.div>
                  )}

                  {/* Step 5: Result (Main Content) */}
                  {state.step === "result" && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-12"
                    >
                      <section className="relative">
                        <div className="bg-violet-deep/20 border-l border-violet/30 pl-8 mb-8 py-2">
                           <div className="flex items-center gap-3 mb-2">
                              <div className="w-2 h-2 rounded-full bg-violet shadow-[0_0_10px_rgba(124,92,255,0.8)]" />
                              <h3 className="text-[10px] font-mono text-violet tracking-[0.3em] uppercase">Interpretation Aktiv</h3>
                           </div>
                           <p className="text-[10px] font-mono text-violet/40 uppercase tracking-widest">
                             Provider: OpenAI · Model: GPT-5.4 · Entropy: 0.8
                           </p>
                        </div>
                        
                        {state.result ? (
                          <KineticBlueprint text={state.result.text} />
                        ) : (
                          <Panel className="border-danger-muted/30 py-12 text-center">
                             <p className="text-danger-muted font-serif italic text-lg mb-6">
                               Die symbolische Verbindung konnte nicht stabilisiert werden.
                             </p>
                             <Button onClick={() => setState(INITIAL_STATE)} variant="secondary">Ritual Neustarten</Button>
                          </Panel>
                        )}

                        <div className="flex items-center gap-6 mt-16 pt-8 border-t border-gold/10 text-[9px] font-mono text-text-muted uppercase tracking-widest">
                          <div className="flex items-center gap-2">
                             <LayoutGrid className="w-3 h-3" />
                             <span>Blueprint Engine v2.4</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <Sparkles className="w-3 h-3" />
                             <span>Symbolische Reflexion</span>
                          </div>
                        </div>
                      </section>

                      {/* Follow-up Section Embedded */}
                      {state.result && (
                        <div className="mt-20 pt-20 border-t border-gold/10">
                           {!state.followupResult ? (
                             <div className="space-y-8">
                                <div className="flex flex-col gap-2">
                                   <h3 className="text-xl font-display text-gold">Tiefer blicken</h3>
                                   <p className="text-sm text-text-muted">Gibt es einen Aspekt, den wir genauer beleuchten sollen?</p>
                                </div>
                                
                                <div className="flex gap-4">
                                  <input
                                    type="text"
                                    value={state.followupQuestion}
                                    onChange={(e) => setState((s) => ({ ...s, followupQuestion: e.target.value }))}
                                    placeholder="Präzisiere deine Intention..."
                                    className="flex-1 bg-surface-raised/20 border border-gold/10 rounded-full px-8 py-4 text-lg text-text focus:outline-none focus:border-gold/30 transition-all shadow-inner"
                                  />
                                  <Button
                                    onClick={submitFollowup}
                                    disabled={state.followupQuestion.trim().length < 3 || state.followupLoading}
                                    className="px-10 h-auto"
                                  >
                                    {state.followupLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Senden"}
                                  </Button>
                                </div>
                             </div>
                           ) : (
                             <motion.div 
                               initial={{ opacity: 0, y: 20 }}
                               animate={{ opacity: 1, y: 0 }}
                               className="space-y-6"
                             >
                                <div className="flex items-center gap-3">
                                   <MessageSquare className="w-4 h-4 text-gold/60" />
                                   <h3 className="text-[10px] font-mono text-gold uppercase tracking-[0.3em]">Präzisierung</h3>
                                </div>
                                <div className="text-text-secondary text-xl leading-relaxed whitespace-pre-wrap font-serif italic border-l-2 border-gold/20 pl-10 py-4 bg-gold/5 rounded-r-2xl">
                                  {state.followupResult}
                                </div>
                             </motion.div>
                           )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             {/* Right Sidebar (only in result step) */}
             <AnimatePresence>
               {state.step === "result" && (
                 <motion.aside
                    key="sidebar"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="lg:col-span-4 space-y-8"
                 >
                    <Panel className="bg-surface/20">
                       <h3 className="text-xs font-mono text-gold/60 uppercase tracking-[0.2em] mb-8">Symbol-Inventar</h3>
                       <div className="flex flex-col gap-8">
                          {state.cards.map((card, i) => (
                             <div key={i} className="flex items-center gap-6 group">
                                <div className="w-16 h-24 shrink-0 border border-gold/20 rounded-lg overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500">
                                   <div className="absolute inset-0 bg-gold/5" />
                                   <div className="absolute inset-0 flex items-center justify-center">
                                      <Sparkles className="w-6 h-6 text-gold/20" />
                                   </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                   <span className="text-[10px] font-mono text-gold/40 uppercase">{card.position}</span>
                                   <h4 className="text-lg font-display text-text group-hover:text-gold transition-colors">{card.name}</h4>
                                   <div className="flex gap-2 mt-1">
                                      {card.element && (
                                         <span className="text-[9px] font-mono text-violet px-2 py-0.5 rounded bg-violet-deep/20 border border-violet/10">{card.element}</span>
                                      )}
                                      {card.zodiacAssociation && (
                                         <span className="text-[9px] font-mono text-gold px-2 py-0.5 rounded bg-gold/5 border border-gold/10">{card.zodiacAssociation}</span>
                                      )}
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </Panel>

                    <Panel className="bg-bg/40">
                       <h3 className="text-xs font-mono text-gold/60 uppercase tracking-[0.2em] mb-6">Resonanz</h3>
                       <FeedbackForm readingId={state.readingId!} />
                    </Panel>

                    <div className="flex flex-col gap-4">
                       <Button onClick={() => setState(INITIAL_STATE)} className="w-full h-14">
                          Neues Ritual
                       </Button>
                       <div className="flex justify-between px-2">
                          <Link href="/readings" className="text-[10px] font-mono text-text-muted hover:text-gold uppercase tracking-widest transition-colors">Archiv</Link>
                          <Link href="/" className="text-[10px] font-mono text-text-muted hover:text-gold uppercase tracking-widest transition-colors">Home</Link>
                       </div>
                    </div>
                 </motion.aside>
               )}
             </AnimatePresence>
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
