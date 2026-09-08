"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import StepIndicator from "@/components/StepIndicator";
import TarotCard from "@/components/TarotCard";
import StellarField from "@/components/StellarField";
import FeedbackForm from "@/components/FeedbackForm";
import SymbolChip from "@/components/SymbolChip";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import { KineticBlueprint, renderInline } from "@/components/KineticBlueprint";
import { CrystalShard } from "@/components/CrystalShard";
import { CrystalSpinner } from "@/components/CrystalSpinner";
import { Constellation } from "@/components/Constellation";
import { Sparkles, ArrowLeft, X, Info, MessageSquare, ArrowRight, Phone } from "lucide-react";
import type { ReadingResponse } from "@/lib/ai";
import type { ChartResponse } from "@/lib/astrology";
import { getOrCreateSessionToken } from "@/lib/session";
import { birthTimezoneOffset, cn } from "@/lib/utils";
import { api, toUserError, type ErrorKind } from "@/lib/api-client";
import { CRISIS_INTRO, CRISIS_OUTRO, CRISIS_LINES } from "@/lib/crisis-resources";

type Step = "question" | "birth" | "stellar" | "drawing" | "generating" | "result";

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
  chart: ChartResponse | null;
  shuffledDeck: string[];
  selectedCardIds: string[];
  cards: DrawnCard[];
  cardNames: Record<string, string>;
  revealed: boolean[];
  result: ReadingResponse | null;
  geoWarning: string | null;
  error: string | null;
  errorKind: ErrorKind;
  sessionToken: string;
  plan: string;
  deep: boolean;
  readingsRemaining: number | null;
  followupsRemaining: number | null;
  followupQuestion: string;
  followupMessages: { role: "user" | "assistant"; content: string }[];
  followupLoading: boolean;
  followupError: string | null;
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
  chart: null,
  shuffledDeck: [],
  selectedCardIds: [],
  cards: [],
  cardNames: {},
  revealed: [false, false, false],
  result: null,
  geoWarning: null,
  error: null,
  errorKind: null,
  sessionToken: "",
  plan: "FREE",
  deep: false,
  readingsRemaining: null,
  followupsRemaining: null,
  followupQuestion: "",
  followupMessages: [],
  followupLoading: false,
  followupError: null,
};

const CATEGORIES = [
  { value: "beziehung", label: "Beziehung" },
  { value: "beruf", label: "Beruf" },
  { value: "selbstreflexion", label: "Selbstreflexion" },
  { value: "spirituell", label: "Spirituell" },
  { value: "sonstiges", label: "Sonstiges" },
];

/** Beispielthemen als Chips — design.md: Cold-Start-Erleichterung für die Frage-Eingabe. */
const TOPIC_SUGGESTIONS = [
  "Eine Entscheidung, die vor mir liegt",
  "Meine aktuelle Lebensphase",
  "Was eine Beziehung in mir bewegt",
  "Worauf ich meinen Fokus richten will",
];

const STORAGE_KEY = "eso.reading.state.v1";
// Kimi K3 denkt vor der Antwort — gemessene Läufe liegen bei 30–70 s
const GENERATE_TIMEOUT_MS = 150_000;
const CREATE_TIMEOUT_MS = 45_000;
const SHUFFLE_TIMEOUT_MS = 20_000;
const TIMEOUT_MESSAGE =
  "Das hat zu lange gedauert — die Verbindung war zu langsam. Deine Auswahl ist noch da; versuche es erneut.";

function restorePersistedState(): ReadingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Partial<ReadingState>;
    if (!saved || typeof saved !== "object" || !saved.step) return null;
    // Ein unterbrochener Generierungs-Lauf wird auf den vorherigen Schritt
    // zurückgesetzt — die Karten sind da, die Synthese lässt sich neu starten.
    let step: Step = saved.step;
    if (step === "generating") step = "drawing";
    if (step === "result" && !saved.result) step = "drawing";
    return {
      ...INITIAL_STATE,
      ...saved,
      step,
      error: null,
      errorKind: null,
      followupLoading: false,
      followupError: null,
      followupQuestion: "",
    };
  } catch {
    return null;
  }
}

export default function ReadingPage() {
  const [state, setState] = useState<ReadingState>(INITIAL_STATE);
  const [confirmAbort, setConfirmAbort] = useState(false);
  // Feedback eingeklappt: die Resonanz darf der Schlussakt des Rituals nicht sein
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  // Info-Blase zum Plus-Upgrade (Tipp auf Mobile, wo es kein Hover gibt)
  const [deepBubbleOpen, setDeepBubbleOpen] = useState(false);
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);
  const tokenInitialized = useRef(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();

  /** true, wenn der laufende Abort vom Timeout (nicht vom Unmount) kam. */
  const timedOut = () => abortRef.current?.signal.reason === "timeout";

  // Zustand über Reloads und Unterbrechungen retten (Casey: Mobile, Tab-Wechsel).
  // Bewusst setState-im-Effect: der Restore darf erst nach der Hydration laufen,
  // damit Server-Render und Client-Start nicht auseinanderlaufen.
  useEffect(() => {
    const restored = restorePersistedState();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- einmaliger Hydrations-Restore
    if (restored) setState(restored);
  }, []);

  // Debounced Persistenz: nicht bei jedem Tastenschlag den vollen State schreiben
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const persistable = { ...state, followupLoading: false, followupError: null, error: null, errorKind: null };
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
      } catch {
        /* Speicher voll oder blockiert — kein Grund, den Flow zu stören */
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [state]);

  // Laufende Anfragen beim Verlassen abbrechen
  useEffect(() => () => abortRef.current?.abort(), []);

  const requestSignal = (timeoutMs?: number): AbortSignal => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    if (timeoutMs) window.setTimeout(() => controller.abort("timeout"), timeoutMs);
    return controller.signal;
  };

  // Bei Schrittwechsel zurück zum Seitenanfang UND Fokus auf die neue
  // Step-Headline — Screenreader- und Tastaturnutzer erfahren den Wechsel.
  const prevStep = useRef<Step>(state.step);
  useEffect(() => {
    if (prevStep.current !== state.step) {
      prevStep.current = state.step;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      stepHeadingRef.current?.focus({ preventScroll: true });
    }
  }, [state.step, reduceMotion]);

  // Fehler in den Viewport holen — sie erscheinen über dem aktuellen Schritt
  useEffect(() => {
    if (state.error && errorRef.current) {
      errorRef.current.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
      errorRef.current.focus({ preventScroll: true });
    }
  }, [state.error, reduceMotion]);

  useEffect(() => {
    if (tokenInitialized.current) return;
    const token = getOrCreateSessionToken();
    setState((s) => ({ ...s, sessionToken: token }));
    tokenInitialized.current = true;

    // Fetch latest birth profile for user if logged in
    fetch("/api/birth-profiles")
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(profile => {
        if (profile) {
          setState(s => ({
            ...s,
            birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : "",
            birthTime: profile.birthTime || "",
            birthCity: profile.birthCity || "",
            includeBirth: true,
            birthProfileId: profile.id
          }));
        }
      })
      .catch(err => console.error("Error loading birth profile:", err));
  }, []);

  const submitQuestion = () => {
    if (state.question.trim().length < 5) return;
    setState((s) => ({ ...s, step: "birth", error: null, errorKind: null }));
  };

  const createReading = useCallback(async (question: string, category: string, birthProfileId: string | null, selectedCardIds: string[]) => {
    try {
      const reading = await api<{
        id: string;
        plan?: string;
        tarotDraws: { card: { id: string; name: string; element: string | null; zodiacAssociation: string | null }; position: string; upright: boolean }[];
      }>("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: requestSignal(CREATE_TIMEOUT_MS),
        body: JSON.stringify({
          question,
          questionCategory: category,
          birthProfileId: birthProfileId ?? undefined,
          sessionToken: state.sessionToken || undefined,
          selectedCardIds,
        }),
      });
      const cards: DrawnCard[] = reading.tarotDraws.map((d) => ({
        id: d.card.id,
        name: d.card.name,
        position: d.position,
        upright: d.upright,
        element: d.card.element,
        zodiacAssociation: d.card.zodiacAssociation,
      }));
      setState((s) => ({ ...s, readingId: reading.id, cards, plan: reading.plan ?? s.plan, step: "drawing", error: null, errorKind: null }));
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Timeout: das Feld entsperren und eine Handlung anbieten statt Stillstand
        if (timedOut()) {
          setState((s) => ({ ...s, error: TIMEOUT_MESSAGE, errorKind: null }));
        }
        return;
      }
      const { message, kind } = toUserError(err);
      setState((s) => ({ ...s, error: message, errorKind: kind }));
    }
  }, [state.sessionToken]);

  const fetchShuffledDeck = useCallback(async () => {
    try {
      const data = await api<{ cardIds: string[]; cards?: { id: string; name: string }[] }>("/api/tarot/shuffle", {
        signal: requestSignal(SHUFFLE_TIMEOUT_MS),
      });
      setState((s) => ({
        ...s,
        shuffledDeck: data.cardIds,
        cardNames: Object.fromEntries((data.cards ?? []).map((c) => [c.id, c.name])),
        step: "stellar",
      }));
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        if (timedOut()) {
          // Zurück zum Geburtsdaten-Schritt — dort greift der existierende Retry-Pfad,
          // statt einen Dead-End mit endlosem Spinner zu hinterlassen
          setState((s) => ({ ...s, error: TIMEOUT_MESSAGE, errorKind: null, step: "birth" }));
        }
        return;
      }
      const { message, kind } = toUserError(err);
      setState((s) => ({ ...s, error: message, errorKind: kind, step: "birth" }));
    }
  }, []);

  const submitBirth = useCallback(async () => {
    if (!state.includeBirth) {
      setState((s) => ({ ...s, step: "stellar", geoWarning: null }));
      fetchShuffledDeck();
      return;
    }

    try {
      const bp = await api<{ id: string; birthLat: number | null; birthLon: number | null }>("/api/birth-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: requestSignal(),
        body: JSON.stringify({
          birthDate: state.birthDate,
          birthTime: state.birthTime || undefined,
          birthCity: state.birthCity || undefined,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          sessionToken: state.sessionToken || undefined,
        }),
      });

      // Ortssuche ist still fehlgeschlagen? Aussprechen, statt stumm das Radix zu verlieren.
      const geoFailed = state.birthCity.trim().length > 0 && (bp.birthLat == null || bp.birthLon == null);
      const geoWarning = geoFailed
        ? `Der Ort „${state.birthCity.trim()}" konnte nicht eindeutig gefunden werden. Die Deutung läuft ohne astrologischen Kontext — du kannst zurückgehen und die Schreibweise anpassen.`
        : null;

      // Calculate chart
      const bd = new Date(state.birthDate);
      const chartData = await api<ChartResponse>("/api/astrology/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: requestSignal(),
        body: JSON.stringify({
          year: bd.getFullYear(),
          month: bd.getMonth() + 1,
          day: bd.getDate(),
          hour: state.birthTime ? parseInt(state.birthTime.split(":")[0]) : 12,
          minute: state.birthTime ? parseInt(state.birthTime.split(":")[1]) : 0,
          latitude: bp.birthLat,
          longitude: bp.birthLon,
          timezoneOffset: birthTimezoneOffset(state.birthDate),
          timeUnknown: !state.birthTime,
        }),
      }).catch(() => null);

      setState((s) => ({ ...s, birthProfileId: bp.id, chart: chartData, geoWarning }));
      fetchShuffledDeck();
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      const { message, kind } = toUserError(err);
      setState((s) => ({ ...s, error: message, errorKind: kind }));
    }
  }, [state.includeBirth, state.birthDate, state.birthTime, state.birthCity, state.sessionToken, fetchShuffledDeck]);

  const handleStellarComplete = useCallback((selectedCardIds: string[]) => {
    setState((s) => ({ ...s, selectedCardIds }));
    createReading(state.question, state.questionCategory, state.birthProfileId, selectedCardIds);
  }, [state.question, state.questionCategory, state.birthProfileId, createReading]);

  const revealCard = (index: number) => {
    setState((s) => {
      const revealed = [...s.revealed];
      revealed[index] = true;
      return { ...s, revealed };
    });
  };

  const allRevealed = state.revealed.every(Boolean);

  // Auto-Enthüllung: die Karten drehen sich nach Ankunft nacheinander von
  // selbst — das dokumentierte Ritual-Reveal (einzige Ausnahme von „keine
  // setTimeout-Kaskaden", design.md). Ein Tipp auf eine verdeckte Karte
  // bleibt der manuelle Skip. Bei reduced-motion drehen sie sich sofort.
  const revealTimers = useRef<number[]>([]);
  useEffect(() => {
    if (state.step !== "drawing" || state.cards.length === 0) return;
    const hidden = state.cards.map((_, i) => i).filter((i) => !state.revealed[i]);
    if (hidden.length === 0) return;
    const reveal = (index: number) =>
      setState((s) => {
        if (s.revealed[index]) return s;
        const revealed = [...s.revealed];
        revealed[index] = true;
        return { ...s, revealed };
      });
    if (reduceMotion) {
      const t = window.setTimeout(() => hidden.forEach(reveal), 0);
      revealTimers.current.push(t);
      return () => window.clearTimeout(t);
    }
    hidden.forEach((cardIndex, order) => {
      revealTimers.current.push(window.setTimeout(() => reveal(cardIndex), 900 + order * 750));
    });
    return () => {
      revealTimers.current.forEach((t) => window.clearTimeout(t));
      revealTimers.current = [];
    };
    // `revealed` bewusst nicht in den deps: ein manueller Skip darf die
    // Sequenz nicht neu starten; verdeckt gebliebene Karten laufen weiter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step, state.cards.length, reduceMotion]);

  const generateAIReading = useCallback(async () => {
    if (!state.readingId) return;
    setState((s) => ({ ...s, step: "generating", error: null, errorKind: null }));

    try {
      const result = await api<ReadingResponse>(`/api/readings/${state.readingId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deep: state.deep }),
        signal: requestSignal(GENERATE_TIMEOUT_MS),
      });
      setState((s) => ({ ...s, result, step: "result" }));
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Timeout ist ein behandelter Fehler: zurück zu den Karten, Retry per Klick
        if (timedOut()) {
          setState((s) => ({
            ...s,
            error: "Die Synthese hat zu lange gedauert. Deine Karten sind noch da — versuche es erneut.",
            errorKind: null,
            step: "drawing",
          }));
        }
        return;
      }
      const { message, kind } = toUserError(err);
      // Bleibe im drawing-Schritt: Karten und Auswahl bleiben, Retry ist ein Klick.
      setState((s) => ({ ...s, error: message, errorKind: kind, step: "drawing" }));
    }
  }, [state.readingId, state.deep]);

  const submitFollowup = useCallback(async () => {
    if (!state.readingId || !state.followupQuestion.trim()) return;
    const question = state.followupQuestion;
    setState((s) => ({
      ...s,
      followupLoading: true,
      followupError: null,
      followupQuestion: "",
      followupMessages: [...s.followupMessages, { role: "user", content: question }],
    }));
    try {
      const data = await api<{ text: string; followupsRemaining?: number }>(`/api/readings/${state.readingId}/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: requestSignal(),
        body: JSON.stringify({
          question,
          sessionToken: state.sessionToken,
          history: state.followupMessages,
          deep: state.deep,
        }),
      });
      setState((s) => ({
        ...s,
        followupMessages: [...s.followupMessages, { role: "assistant", content: data.text }],
        followupsRemaining: typeof data.followupsRemaining === "number" ? data.followupsRemaining : s.followupsRemaining,
        followupLoading: false,
      }));
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        if (timedOut()) {
          setState((s) => ({
            ...s,
            followupError: "Die Nachfrage hat zu lange gedauert. Sie steht noch im Feld — versuche es erneut.",
            followupLoading: false,
          }));
        }
        return;
      }
      const { message } = toUserError(err);
      // Die getippte Frage zurück ins Feld — keine Eingabe geht verloren.
      setState((s) => ({
        ...s,
        followupError: message,
        followupLoading: false,
        followupQuestion: question,
      }));
    }
  }, [state.readingId, state.followupQuestion, state.sessionToken, state.followupMessages, state.deep]);

  const resetRitual = useCallback(() => {
    abortRef.current?.abort();
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* egal — frischer Zustand reicht */
    }
    setConfirmAbort(false);
    setState(INITIAL_STATE);
  }, []);

  const isCrisis =
    state.result?.safetyAction === "crisis_response" || state.result?.safetyAction === "block";

  // Retry je Schritt: nur dort, wo der Fehler tatsächlich wiederholbar ist.
  const canRetry =
    (state.step === "drawing" && !!state.readingId) ||
    state.step === "birth" ||
    state.step === "stellar";
  const retryCurrentStep = () => {
    if (state.step === "drawing") generateAIReading();
    else if (state.step === "birth") submitBirth();
    else if (state.step === "stellar") {
      // Die getroffene Wahl bleibt — nur der fehlgeschlagene Lauf wird wiederholt
      createReading(state.question, state.questionCategory, state.birthProfileId, state.selectedCardIds);
    }
  };

  const todayMax = new Date().toISOString().split("T")[0];
  const questionMinMet = state.question.trim().length >= 5;
  const questionHint = !questionMinMet
    ? "Noch kurze Sätze genügen — mindestens 5 Zeichen."
    : `${500 - state.question.length} Zeichen verbleibend`;

  return (
    <div className="flex-1 px-4 py-8 sm:py-16 relative overflow-hidden">
      <h1 className="sr-only">Dein ESO Reading</h1>
      {/* Expanded Layout Wrapper */}
      <div className="mx-auto max-w-7xl flex flex-col gap-12 relative z-10">

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gold/10 pb-8">
          <div className="flex flex-col gap-3">
             <span className="text-xs font-mono text-gold/80 uppercase tracking-[0.3em]">Kybernetisches Grimoire</span>
             {/* „skipped“ erst, wenn die Entscheidung gefallen ist — vorher steht ihr
                 Ergebnis im Fortschrittsbalken, bevor der Nutzer entschieden hat. */}
             <StepIndicator
               current={state.step}
               skipped={!state.includeBirth && state.step !== "question" && state.step !== "birth" ? ["birth"] : []}
             />
          </div>

          <div className="flex flex-col items-end gap-6">
             {confirmAbort ? (
               <div className="flex items-center gap-3 text-sm">
                  <span className="text-text-secondary">Reading verwerfen?</span>
                  <button
                    type="button"
                    onClick={resetRitual}
                    className="text-danger-muted hover:text-text font-medium px-3 py-2 rounded-lg hover:bg-danger-muted/10 transition-colors"
                  >
                    Ja, verwerfen
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmAbort(false)}
                    className="text-gold hover:text-gold-soft font-medium px-3 py-2 rounded-lg hover:bg-gold/10 transition-colors"
                  >
                    Weitermachen
                  </button>
               </div>
             ) : (
               <button
                 type="button"
                 onClick={() => setConfirmAbort(true)}
                 className="group flex items-center gap-2 text-sm min-h-[44px] text-text-muted hover:text-gold transition-colors px-2 -mx-2 rounded-lg"
               >
                 <X className="w-4 h-4" />
                 <span>Abbrechen</span>
               </button>
             )}
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <AnimatePresence>
             {state.error && (
               <motion.div
                 key="global-error"
                 ref={errorRef}
                 tabIndex={-1}
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: "auto" }}
                 exit={{ opacity: 0, height: 0 }}
                 className="lg:col-span-12 focus:outline-none"
                 role="alert"
               >
                 <Panel className={cn(
                   "border-danger-muted/40 bg-danger-muted/5",
                   state.errorKind && "border-gold/30 bg-gold/5"
                 )}>
                   <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-start gap-3">
                         <div className={cn(
                           "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                           state.errorKind ? "bg-gold shadow-[0_0_8px_rgba(200,164,93,0.6)]" : "bg-danger-muted"
                         )} />
                         <div className="space-y-1">
                            <p className={cn(
                              "text-sm leading-relaxed",
                              state.errorKind ? "text-gold" : "text-danger-muted"
                            )}>{state.error}</p>
                            {state.errorKind === "limit" && (
                              <p className="text-[11px] text-text-secondary">
                                Free umfasst drei Readings pro Tag. Plus erweitert auf zwanzig.
                              </p>
                            )}
                         </div>
                      </div>

                      {/* Retry gehört zur Meldung, nicht zum errorKind — ein Fehler
                          ohne Handlung ist die unerfüllbare Aufforderung „versuche es erneut". */}
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {canRetry && (
                          <Button onClick={retryCurrentStep} variant="secondary" className="h-10 px-6 text-xs whitespace-nowrap">
                            Erneut versuchen
                          </Button>
                        )}
                        {state.errorKind && (
                          <>
                            <Link href="/pricing">
                              <Button variant="secondary" className="h-10 px-6 text-xs whitespace-nowrap group">
                                Plus entdecken
                                <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                            <Button onClick={resetRitual} variant="ghost" className="h-10 px-6 text-xs whitespace-nowrap">
                              Neues Ritual beginnen
                            </Button>
                          </>
                        )}
                      </div>
                   </div>
                 </Panel>
               </motion.div>
             )}

             {/* Dynamic Content Area */}
             <div
                key="main-content-area"
                className={cn(
                  "lg:col-span-12 transition-all duration-700",
                  state.step === "result" || state.step === "drawing" ? "lg:col-span-12" : "lg:col-span-8 lg:col-start-3"
                )}
             >
                <AnimatePresence mode="wait">
                  {/* Step 1: Question */}
                  {state.step === "question" && (
                    <motion.div
                      key="question"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                    >
                      <Panel className="p-5 pb-44 sm:p-8 sm:pb-8 lg:p-12">
                         <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center">
                               <Sparkles className="w-5 h-5 text-gold" />
                            </div>
                            <h2
                              ref={stepHeadingRef}
                              tabIndex={-1}
                              className="font-display text-3xl sm:text-4xl text-text leading-tight heading-glow focus:outline-none"
                            >
                              Was beschäftigt dich?
                            </h2>
                         </div>

                        <textarea
                          value={state.question}
                          onChange={(e) => setState((s) => ({ ...s, question: e.target.value }))}
                          placeholder="Beschreibe dein Thema oder stelle eine offene Frage..."
                          aria-label="Deine Frage oder dein Thema"
                          rows={6}
                          maxLength={500}
                          aria-describedby="question-counter"
                          className="w-full glass-input rounded-2xl px-6 py-5 text-xl text-text resize-none mb-6"
                        />

                        <div className="flex flex-wrap gap-2 mb-8">
                          {TOPIC_SUGGESTIONS.map((topic) => (
                            <button
                              key={topic}
                              type="button"
                              title="Als Ausgangspunkt übernehmen"
                              onClick={() =>
                                setState((s) => ({
                                  ...s,
                                  // Nie kommentarlos überschreiben: angehängt statt ersetzt
                                  question: s.question.trim() ? `${s.question.trim()} ${topic}` : topic,
                                }))
                              }
                              className="crystal-chip text-xs px-4 py-2 min-h-[44px] flex items-center rounded-xl text-text-secondary hover:text-text transition-colors"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>

                        <div className="mb-10">
                          <p className="text-[11px] font-mono text-gold/80 uppercase tracking-widest mb-4 px-1">Themenbereich</p>
                          <div className="flex flex-wrap gap-3">
                            {CATEGORIES.map((cat) => (
                              <button
                                key={cat.value}
                                type="button"
                                aria-pressed={state.questionCategory === cat.value}
                                onClick={() => setState((s) => ({ ...s, questionCategory: cat.value }))}
                                className={cn(
                                   "text-xs font-mono px-6 py-3 min-h-[44px] flex items-center rounded-xl transition-all",
                                   state.questionCategory === cat.value
                                     ? "crystal-chip crystal-chip-active text-gold"
                                     : "crystal-chip text-text-secondary hover:text-text"
                                )}
                              >
                                {cat.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 pt-4">
                          <p
                            id="question-counter"
                            className={cn(
                              "text-[11px]",
                              questionMinMet ? "text-text-muted" : "text-text-secondary"
                            )}
                          >
                            {questionHint}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-text-muted max-w-xs">
                             <Info className="w-4 h-4 shrink-0" />
                             <span>
                               Kostenlos: drei Readings pro Tag. Symbolische Reflexion statt Beratung.
                             </span>
                          </div>
                          {/* Mobil lebt der CTA in der fixen Leiste unterhalb */}
                          <Button
                            onClick={submitQuestion}
                            disabled={!questionMinMet}
                            className="w-full sm:w-auto sm:min-w-[200px] h-14 text-lg mt-4 max-sm:hidden"
                          >
                            Weiter
                          </Button>
                        </div>
                      </Panel>

                      {/* design.md:201 — prominenter Primär-CTA, mobil fix im Daumenbereich
                          (gemessen lag „Weiter" 163 px unter dem Fold) */}
                      <div className="sm:hidden fixed inset-x-0 bottom-0 z-30 border-t border-gold/10 bg-surface/95 backdrop-blur-md px-4 pt-3 [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom))]">
                        <p className={cn("text-[11px] mb-2", questionMinMet ? "text-text-muted" : "text-text-secondary")}>
                          {questionHint}
                        </p>
                        <Button onClick={submitQuestion} disabled={!questionMinMet} className="w-full h-14 text-lg">
                          Weiter
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Birth data */}
                  {state.step === "birth" && (
                    <motion.div
                      key="birth"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                    >
                      <Panel className="p-5 pb-40 sm:p-8 sm:pb-8 lg:p-12">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center">
                               <Sparkles className="w-5 h-5 text-gold" />
                            </div>
                            <h2
                              ref={stepHeadingRef}
                              tabIndex={-1}
                              className="font-display text-3xl sm:text-4xl text-text heading-glow focus:outline-none"
                            >
                              Deine Geburtsdaten
                            </h2>
                        </div>

                        <p className="text-xl text-text-secondary leading-relaxed mb-6 max-w-2xl">
                          Möchtest du dein persönliches Geburtshoroskop als zusätzliche Symbolschicht in die Deutung einfließen lassen?
                        </p>

                        <div className="bg-gold/5 border border-gold/10 rounded-2xl p-6 mb-10">
                          <h3 className="text-xs font-mono text-gold uppercase tracking-widest mb-3">Warum Geburtsdaten?</h3>
                          {/* Datenschutz zuerst — er war vorher unter acht Zeilen kosmischer Prosa versteckt */}
                          <p className="text-xs text-text-muted leading-relaxed mb-3">
                            Deine Angaben werden nur für diese Berechnung genutzt — die Nutzung bleibt auch ohne Account anonym.
                          </p>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            Das Geburtsdatum verwebt die Signatur deines Geburtshimmels mit der Symbolik der Karten —
                            so entsteht ein Spiegelbild, das auf dich persönlich zugeschnitten ist.
                          </p>
                        </div>

                        <label className="group flex items-center gap-6 p-6 rounded-2xl border border-gold/10 hover:border-gold/30 hover:bg-gold/5 transition-all cursor-pointer mb-10 bg-surface-raised/20 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-soft">
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
                            className="sr-only"
                          />
                          <div className="flex flex-col">
                             <span className="text-lg text-text group-hover:text-gold transition-colors">Geburtsdaten präzisieren</span>
                             <span className="text-xs text-text-muted mt-1">Verwebt dein Geburtshoroskop mit den Karten</span>
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
                                <label htmlFor="birth-date" className="block text-[11px] font-mono text-gold/80 uppercase tracking-[0.3em] px-1">Geburtsdatum</label>
                                <input
                                  id="birth-date"
                                  type="date"
                                  value={state.birthDate}
                                  max={todayMax}
                                  min="1900-01-01"
                                  onChange={(e) => setState((s) => ({ ...s, birthDate: e.target.value }))}
                                  className="w-full glass-input rounded-xl px-6 py-4 text-lg text-text"
                                />
                              </div>
                              <div className="space-y-3">
                                <label htmlFor="birth-time" className="block text-[11px] font-mono text-gold/80 uppercase tracking-[0.3em] px-1">Geburtszeit (Optional)</label>
                                <input
                                  id="birth-time"
                                  type="time"
                                  value={state.birthTime}
                                  onChange={(e) => setState((s) => ({ ...s, birthTime: e.target.value }))}
                                  aria-describedby="birth-time-hint"
                                  className="w-full glass-input rounded-xl px-6 py-4 text-lg text-text"
                                />
                                <p id="birth-time-hint" className="text-xs text-text-muted leading-relaxed">
                                  Ohne Geburtszeit rechnen wir mit 12:00 Uhr mittags — Aszendent und Häuser sind dann ungenau, Sonne und Mond bleiben verlässlich.
                                </p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <label htmlFor="birth-city" className="block text-[11px] font-mono text-gold/80 uppercase tracking-[0.3em] px-1">Geburtsort</label>
                              <input
                                id="birth-city"
                                type="text"
                                value={state.birthCity}
                                onChange={(e) => setState((s) => ({ ...s, birthCity: e.target.value }))}
                                placeholder="z.B. Berlin, Deutschland"
                                className="w-full glass-input rounded-xl px-6 py-4 text-lg text-text"
                              />
                              {state.geoWarning && (
                                <p className="text-xs text-gold/90 leading-relaxed" role="status">
                                  {state.geoWarning}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-6 pt-4 max-sm:hidden">
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
                        {state.includeBirth && !state.birthDate && (
                          <p className="text-[11px] text-text-secondary mt-4 max-sm:hidden" aria-live="polite">
                            Für die Berechnung braucht es ein Geburtsdatum — oder du fährst ohne Horoskop fort.
                          </p>
                        )}
                      </Panel>

                      {/* Mobil fix im Daumenbereich — gleiche Begründung wie beim Frage-Schritt */}
                      <div className="sm:hidden fixed inset-x-0 bottom-0 z-30 border-t border-gold/10 bg-surface/95 backdrop-blur-md px-4 pt-3 [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom))]">
                        {state.includeBirth && !state.birthDate && (
                          <p className="text-[11px] text-text-secondary mb-2" aria-live="polite">
                            Für die Berechnung braucht es ein Geburtsdatum — oder du fährst ohne Horoskop fort.
                          </p>
                        )}
                        <div className="flex gap-4">
                          <Button
                            onClick={submitBirth}
                            disabled={state.includeBirth && !state.birthDate}
                            className="flex-1 h-14 text-lg"
                          >
                            {state.includeBirth ? "Berechnen & Weiter" : "Ohne Horoskop fortfahren"}
                          </Button>
                          <Button
                            onClick={() => setState((s) => ({ ...s, step: "question" }))}
                            variant="ghost"
                            className="h-14 px-6"
                          >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Zurück
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Stellar Field — interactive card selection */}
                  {state.step === "stellar" && (
                    <motion.div
                      key="stellar"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.03 }}
                      className="flex flex-col items-center gap-10 py-8"
                    >
                      <div className="text-center space-y-4">
                        <h2
                          ref={stepHeadingRef}
                          tabIndex={-1}
                          className="font-display text-4xl sm:text-5xl text-text heading-glow focus:outline-none"
                        >
                          Das Energiefeld
                        </h2>
                        {/* Die Anweisung lebt in StellarFields Live-Region — hier steht das Warum, nicht das Wie */}
                        <p className="text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
                          Jedes Licht ist eine der 78 Karten. Berühre drei Sterne — der erste
                          steht für deine Gegenwart, der zweite für deine Spannung, der dritte
                          für deinen Impuls.
                        </p>
                      </div>

                       {state.shuffledDeck.length > 0 ? (
                        <StellarField
                          cardIds={state.shuffledDeck}
                          cardNames={state.cardNames}
                          initialSelectedCardIds={state.selectedCardIds}
                          onComplete={handleStellarComplete}
                          error={state.error}
                        />
                      ) : (
                        <div className="h-[400px] flex items-center justify-center">
                          <CrystalSpinner label="Feld wird geladen..." />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 4: Card reveal */}
                  {state.step === "drawing" && (
                    <motion.div
                      key="drawing"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.03 }}
                      className="flex flex-col items-center gap-12 py-8"
                    >
                      <div className="text-center space-y-4">
                         <h2
                           ref={stepHeadingRef}
                           tabIndex={-1}
                           className="font-display text-4xl sm:text-5xl text-text heading-glow focus:outline-none"
                         >
                           Deine Karten
                         </h2>
                         <p className="text-xl text-text-secondary max-w-xl mx-auto leading-relaxed" aria-live="polite">
                           {state.cards.length === 0
                             ? "Deine Resonanzpunkte werden zu Karten..."
                             : allRevealed
                               ? "Deine Legung ist vollständig."
                               : "Deine Karten enthüllen sich — schau ihnen zu oder berühre sie für den schnellen Blick."}
                         </p>
                      </div>

                      {state.chart && (
                        <motion.div
                          initial={{ opacity: 0, y: -16 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-full max-w-2xl mx-auto -mb-4"
                        >
                          <Panel className="bg-surface-raised/30 border-gold/10 py-6 px-8 relative overflow-hidden group">
                            <div className="flex flex-col items-center gap-4 relative z-10">
                               <div className="flex flex-col items-center gap-2 mb-2">
                                  <span className="text-[11px] font-mono text-gold/80 uppercase tracking-[0.3em]">Dein Radix</span>
                                  <div className="w-12 h-[1px] bg-gold/20" />
                               </div>

                               <div className="flex flex-wrap justify-center gap-8 items-center">
                                  <div className="flex flex-col items-center gap-2">
                                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Sonne</span>
                                    <SymbolChip variant="gold" className="px-4 py-1">
                                      {state.chart.planets.find(p => p.name === "Sonne")?.sign}
                                    </SymbolChip>
                                  </div>
                                  <div className="flex flex-col items-center gap-2">
                                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Mond</span>
                                    <SymbolChip variant="gold" className="px-4 py-1">
                                      {state.chart.planets.find(p => p.name === "Mond")?.sign}
                                    </SymbolChip>
                                  </div>
                                  {state.chart.ascendant && (
                                    <div className="flex flex-col items-center gap-2">
                                      <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Aszendent</span>
                                      <SymbolChip variant="gold" className="px-4 py-1">
                                        {state.chart.ascendant.sign}
                                      </SymbolChip>
                                    </div>
                                  )}
                               </div>
                            </div>
                          </Panel>
                        </motion.div>
                      )}

                      <div className="relative w-full flex justify-center py-10">
                        {/* Visual Connector Lines (Kinetic) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent z-0" aria-hidden="true" />

                        {state.cards.length > 0 ? (
                          <div className="flex flex-nowrap justify-center items-start gap-4 sm:gap-10 lg:gap-14 relative z-10">
                            {state.cards.map((card, i) => (
                              <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
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
                            <CrystalSpinner label="Karten werden offenbart..." />
                          </div>
                        )}
                      </div>

                      <AnimatePresence>
                        {allRevealed && state.cards.length > 0 && (
                          <motion.div
                            key="start-button-reveal"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-5 mt-4"
                          >
                            {/* Vertiefte Deutung: Plus schaltet die Denkphase zu —
                                serverseitig am Plan gegated, der Button erklärt Free
                                per Info-Blase (Tipp statt Hover auf Mobile) */}
                            {state.plan === "PLUS" ? (
                              <div className="flex flex-col items-center gap-1">
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={state.deep}
                                  onClick={() => setState((s) => ({ ...s, deep: !s.deep }))}
                                  className="flex items-center gap-3 min-h-[44px] px-4 text-sm text-text-secondary hover:text-text transition-colors"
                                >
                                  <span
                                    aria-hidden="true"
                                    className={cn(
                                      "relative w-9 h-5 rounded-full transition-colors",
                                      state.deep ? "bg-gold/70" : "bg-surface-raised border border-gold/20"
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "absolute top-0.5 w-4 h-4 rounded-full transition-all",
                                        state.deep ? "left-[18px] bg-gold" : "left-0.5 bg-text-muted"
                                      )}
                                    />
                                  </span>
                                  Vertiefte Deutung
                                </button>
                                <p className="text-[11px] text-text-muted">
                                  Das Modell denkt vor der Antwort — tiefer verwoben, etwas länger.
                                </p>
                              </div>
                            ) : (
                              <div className="relative group flex flex-col items-center gap-1">
                                <button
                                  type="button"
                                  aria-disabled="true"
                                  aria-expanded={deepBubbleOpen}
                                  onClick={() => setDeepBubbleOpen((o) => !o)}
                                  className="flex items-center gap-3 min-h-[44px] px-4 text-sm text-text-muted cursor-not-allowed"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="relative w-9 h-5 rounded-full bg-surface-raised border border-gold/20 opacity-60"
                                  >
                                    <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-text-muted" />
                                  </span>
                                  Vertiefte Deutung
                                  <Info className="w-3.5 h-3.5 text-gold/70" aria-hidden="true" />
                                </button>
                                <div
                                  id="deep-plus-bubble"
                                  role="note"
                                  className={cn(
                                    "absolute bottom-full mb-2 w-72 z-20 rounded-xl border border-gold/20 bg-surface p-4 text-left shadow-[0_12px_32px_rgba(0,0,0,0.5)]",
                                    deepBubbleOpen ? "block" : "hidden group-hover:block"
                                  )}
                                >
                                  <p className="text-xs text-text-secondary leading-relaxed">
                                    Plus schaltet die vertiefte Deutung frei: Das Modell denkt vor
                                    der Antwort und verwebt deine Symbole in mehreren Gedankengängen.
                                  </p>
                                  <Link
                                    href="/pricing"
                                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-soft"
                                  >
                                    Plus entdecken
                                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                                  </Link>
                                </div>
                                <p className="text-[11px] text-text-muted">Plus-Feature</p>
                              </div>
                            )}
                            <Button onClick={generateAIReading} className="px-14 h-16 text-xl shadow-[0_0_30px_rgba(200,164,93,0.3)]">
                              Synthese starten
                            </Button>
                            <p className="text-xs text-text-muted text-center max-w-sm">
                              Die KI verwebt deine drei Karten mit deinem Geburtskontext.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* Step 5: Generating — Immersive Violet Stage */}
                  {state.step === "generating" && (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center min-h-[70vh] relative overflow-hidden"
                    >
                      {/* Full-bleed violet atmosphere — eine Ebene genügt */}
                      <div className="absolute inset-0 synthesis-glow pointer-events-none" aria-hidden="true" />

                      <div className="relative z-10 flex flex-col items-center text-center px-4" aria-live="polite">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        >
                          <CrystalShard variant="violet" synthesizing className="w-56 h-56 sm:w-72 sm:h-72 mb-10" />
                        </motion.div>

                        <h2
                          ref={stepHeadingRef}
                          tabIndex={-1}
                          className="font-display text-4xl sm:text-5xl lg:text-6xl text-gradient-violet mb-6 uppercase tracking-widest focus:outline-none"
                        >
                          Synthese läuft
                        </h2>

                        <p className="text-xl sm:text-2xl text-text-secondary max-w-lg leading-relaxed font-serif mb-8">
                          Der Kristall bricht das Licht deiner Symbole in ein kohärentes Spiegelbild...
                        </p>

                        {/* Ehrliche Wartezeit: keine Fake-Prozent, aber eine Erwartung und ein Status */}
                        <div className="w-full max-w-md space-y-4" role="status">
                          <div className="h-[2px] w-full bg-violet/10 rounded-full overflow-hidden relative progress-shimmer" />
                          <p className="text-sm text-text-secondary">
                            {state.deep
                              ? "Vertiefte Deutung: das Modell denkt zuerst — das kann etwas länger dauern. Bitte lasse den Tab dabei offen."
                              : "Deine Deutung wird gewoben — das dauert meist 20 bis 60 Sekunden. Bitte lasse den Tab dabei offen."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 6: Result */}
                  {state.step === "result" && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-10"
                    >
                      {isCrisis ? (
                        /* Krisenfall: ruhige, klare Hilfe — kein mystischer Rahmen, keine Karten, kein Feedback. */
                        <Panel className="border-danger-muted/40 bg-bg/60 max-w-3xl mx-auto">
                          <div className="space-y-8">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-danger-muted shrink-0" />
                              <h2 ref={stepHeadingRef} tabIndex={-1} className="font-display text-3xl text-text focus:outline-none">Hilfe ist näher, als du denkst</h2>
                            </div>
                            <p className="text-lg text-text-secondary leading-relaxed">
                              {CRISIS_INTRO}
                            </p>
                            <ul className="space-y-5">
                              {CRISIS_LINES.map((line) => (
                                <li key={line.country} className="border border-danger-muted/20 rounded-2xl p-5">
                                  <p className="text-[11px] font-mono text-text-muted uppercase tracking-widest mb-2">
                                    {line.country} · {line.serviceName}
                                  </p>
                                  <a
                                    href={line.telHref}
                                    aria-label={`${line.country}: ${line.serviceName}, Nummer ${line.number}`}
                                    className="inline-flex items-center gap-3 text-2xl font-display text-text hover:text-gold-soft transition-colors"
                                  >
                                    <Phone className="w-5 h-5 text-danger-muted" aria-hidden="true" />
                                    {line.number}
                                  </a>
                                  {line.hint && <p className="text-sm text-text-muted mt-1">{line.hint}</p>}
                                </li>
                              ))}
                            </ul>
                            <p className="text-lg text-text-secondary leading-relaxed">{CRISIS_OUTRO}</p>
                            <div className="pt-4 border-t border-danger-muted/20">
                              {/* Tatsächlich zur Startseite — resetRitual allein warf
                                  zurück ins Frage-Formular von /reading */}
                              <button
                                type="button"
                                onClick={() => {
                                  resetRitual();
                                  router.push("/");
                                }}
                                className="text-sm text-text-muted hover:text-text transition-colors"
                              >
                                Zurück zur Startseite
                              </button>
                            </div>
                          </div>
                        </Panel>
                      ) : (
                        <div className="mx-auto w-full max-w-3xl">
                          {/* KI-Transparenz: Label, Rahmen und Quellen — Pflicht nach design.md */}
                          <section>
                            <div className="border-l-2 border-violet/40 pl-6 mb-2 py-1">
                               <div className="flex items-center gap-3 mb-2">
                                  <div className="w-2 h-2 rounded-full bg-violet shadow-[0_0_10px_rgba(124,92,255,0.8)]" aria-hidden="true" />
                                  <h2
                                    ref={stepHeadingRef}
                                    tabIndex={-1}
                                    className="text-xs font-mono text-violet-soft tracking-[0.3em] uppercase focus:outline-none"
                                  >
                                    KI-generierte Deutung
                                  </h2>
                               </div>
                               <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
                                 Diese Deutung wurde von KI erzeugt und verbindet die unten genannten Symbolinformationen.
                                 Sie ist als symbolische Reflexion zu lesen und ersetzt keine professionelle Beratung.
                               </p>
                            </div>

                            {/* Quellen: was tatsächlich in die Deutung eingeflossen ist */}
                            <div className="mt-6 space-y-4">
                              {state.question.trim() && (
                                <div className="flex flex-col gap-2">
                                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Deine Frage</span>
                                  <p className="text-base text-text font-serif leading-relaxed">{`„${state.question.trim()}“`}</p>
                                </div>
                              )}
                              <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Deine Karten</span>
                                <div className="flex flex-wrap gap-2">
                                  {state.cards.map((card) => (
                                    <SymbolChip key={card.id} variant="gold">
                                      {card.name.split("–")[0].trim()} · {card.position} · {card.upright ? "aufrecht" : "umgekehrt"}
                                    </SymbolChip>
                                  ))}
                                </div>
                              </div>
                              {state.chart ? (
                                <div className="flex flex-col gap-2">
                                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Dein Radix</span>
                                  <div className="flex flex-wrap gap-2">
                                    <SymbolChip variant="violet">
                                      Sonne {state.chart.planets.find(p => p.name === "Sonne")?.sign}
                                    </SymbolChip>
                                    <SymbolChip variant="violet">
                                      Mond {state.chart.planets.find(p => p.name === "Mond")?.sign}
                                    </SymbolChip>
                                    {state.chart.ascendant && (
                                      <SymbolChip variant="violet">Aszendent {state.chart.ascendant.sign}</SymbolChip>
                                    )}
                                  </div>
                                </div>
                              ) : state.geoWarning ? (
                                <p className="text-sm text-gold/90 leading-relaxed" role="status">
                                  {state.geoWarning}
                                </p>
                              ) : null}
                            </div>
                          </section>

                          {state.result ? (
                            <KineticBlueprint text={state.result.text} cards={state.cards} />
                          ) : (
                            <Panel className="border-danger-muted/30 py-12 text-center">
                               <p className="text-danger-muted font-serif text-lg mb-6">
                                 Die Deutung konnte gerade nicht erzeugt werden — deine Karten sind bewahrt.
                               </p>
                               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                 <Button onClick={generateAIReading} variant="secondary">Erneut versuchen</Button>
                                 <Button onClick={() => setState((s) => ({ ...s, step: "drawing" }))} variant="ghost">
                                   Zurück zu den Karten
                                 </Button>
                               </div>
                            </Panel>
                          )}

                          {/* Follow-up Chat Thread */}
                          {state.result && (
                            <div className="mt-6 pt-10 border-t border-gold/10">
                               <div className="flex items-center gap-3 mb-6">
                                  <MessageSquare className="w-4 h-4 text-gold/80" aria-hidden="true" />
                                  <h3 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">Tiefer blicken</h3>
                               </div>

                               <div className="space-y-6 mb-6">
                                 {state.followupMessages.map((msg, i) => (
                                   <motion.div
                                     key={i}
                                     initial={{ opacity: 0, y: 8 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     className={cn(
                                       "flex",
                                       msg.role === "user" ? "justify-end" : "justify-start"
                                     )}
                                   >
                                    <div className={cn(
                                        "max-w-[85%] px-6 py-4 rounded-2xl glass-bubble",
                                        msg.role === "user"
                                          ? "glass-bubble-user text-text"
                                          : "glass-bubble-ai text-text-secondary font-serif leading-[1.85]"
                                      )}>
                                       {msg.role === "assistant" ? (
                                         <div className="space-y-3">
                                           {msg.content.split("\n").map((line, li) => {
                                             const t = line.trim();
                                             if (!t) return null;
                                             return <p key={li}>{renderInline(t)}</p>;
                                           })}
                                         </div>
                                       ) : msg.content}
                                     </div>
                                   </motion.div>
                                 ))}
                                  {state.followupLoading && (
                                     <div className="flex justify-start">
                                       <div className="glass-bubble glass-bubble-ai px-6 py-4 rounded-2xl" role="status" aria-label="Antwort wird generiert">
                                         <CrystalSpinner className="scale-75" />
                                       </div>
                                     </div>
                                   )}
                               </div>

                                <div className="flex gap-4">
                                  <input
                                     type="text"
                                     value={state.followupQuestion}
                                     onChange={(e) => setState((s) => ({ ...s, followupQuestion: e.target.value, followupError: null }))}
                                     onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && state.followupQuestion.trim().length >= 3 && !state.followupLoading && submitFollowup()}
                                     placeholder="Stelle eine Nachfrage..."
                                     aria-label="Nachfrage zur Deutung"
                                     className="flex-1 glass-input rounded-2xl px-6 py-4 text-lg text-text"
                                   />
                                  <Button
                                    onClick={submitFollowup}
                                    disabled={state.followupQuestion.trim().length < 3 || state.followupLoading}
                                    className="px-8 h-auto"
                                  >
                                    {state.followupLoading ? <CrystalSpinner className="scale-75" /> : "Senden"}
                                  </Button>
                                </div>
                                {typeof state.followupsRemaining === "number" && (
                                  <p className="text-xs text-text-muted mt-3" aria-live="polite">
                                    Noch {state.followupsRemaining} {state.followupsRemaining === 1 ? "Nachfrage" : "Nachfragen"} heute.
                                  </p>
                                )}
                               {state.followupError && (
                                 <div className="mt-3 space-y-3">
                                   <p className="text-sm text-danger-muted" role="alert">{state.followupError}</p>
                                   {state.followupError.toLowerCase().includes("follow-up") && (
                                     <Link href="/pricing" className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-soft">
                                       Plus entdecken <ArrowRight className="w-3.5 h-3.5" />
                                     </Link>
                                   )}
                                 </div>
                               )}
                            </div>
                          )}

                          {/* Footer: Feedback eingeklappt, Siegel als Schlussakt */}
                          <div className="pt-16 border-t border-gold/20 flex flex-col items-center gap-12">
                             <div className="w-full max-w-2xl">
                                {feedbackOpen ? (
                                  <>
                                    <h3 className="text-xs font-mono text-gold/80 uppercase tracking-[0.3em] mb-8 text-center">Resonanz</h3>
                                    <Panel className="bg-surface-raised/20">
                                       <FeedbackForm readingId={state.readingId!} />
                                    </Panel>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setFeedbackOpen(true)}
                                    className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 text-sm text-text-muted hover:text-gold transition-colors"
                                  >
                                    <MessageSquare className="w-4 h-4" aria-hidden="true" />
                                    Resonanz hinterlassen — hat diese Deutung gepasst?
                                  </button>
                                )}
                             </div>

                             {/* Siegel-Moment: der letzte Akt — das Reading ist da,
                                 wo man es wiederfindet, die Konstellation der Wahl
                                 zeichnet sich als Signet */}
                             {state.result && (
                               <div className="w-full flex flex-col sm:flex-row sm:items-center gap-4 pt-8 border-t border-gold/10" role="status">
                                 <motion.div
                                   initial={{ opacity: 0, scale: 0.85 }}
                                   animate={{ opacity: 1, scale: 1 }}
                                   transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                                   className="shrink-0"
                                   aria-hidden="true"
                                 >
                                   <Constellation cardIds={state.cards.map((c) => c.id)} className="h-9" />
                                 </motion.div>
                                 <div className="flex-1">
                                   <p className="text-sm text-text">In deinem Grimoire vermerkt.</p>
                                   <p className="text-xs text-text-muted mt-0.5">
                                     {new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" }).format(new Date())}
                                     {" "}· automatisch in deinem Archiv gespeichert
                                   </p>
                                 </div>
                                 <Link
                                   href="/readings"
                                   className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-soft transition-colors py-2"
                                 >
                                   Im Archiv öffnen
                                   <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                 </Link>
                               </div>
                             )}

                             <div className="flex flex-col items-center gap-8 w-full max-w-sm">
                                {/* Secondary: das Reading ist gesichert — der Reset ist kein Verlust mehr */}
                                <Button onClick={resetRitual} variant="secondary" className="w-full h-14 text-base">
                                   Neues Ritual beginnen
                                </Button>

                                <div className="flex justify-center gap-12 w-full">
                                   <Link href="/" className="text-xs font-mono text-text-secondary hover:text-gold uppercase tracking-[0.2em] transition-colors py-2">Home</Link>
                                </div>
                             </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
