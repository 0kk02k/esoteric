import type { ChartResult } from "./astrology";
import {
  classifyInput,
  checkOutput,
  logSafetyEvent,
  CRISIS_RESPONSE_DE,
} from "./safety";
import type { SafetyAction } from "./safety";

export type TarotCard = {
  name: string;
  position: string;
  upright: boolean;
};

export type ReadingRequest = {
  question: string;
  cards: TarotCard[];
  chart?: ChartResult;
  sessionToken?: string;
};

export type ReadingResponse = {
  text: string;
  model: string;
  tokensUsed: number;
  latencyMs: number;
  promptVersion: string;
  safetyVersion: string;
  safetyAction?: SafetyAction;
};

const PROMPT_VERSION = "1.0";
const SAFETY_VERSION = "1.0";

const SYSTEM_PROMPT = `Du bist eine spirituelle Begleiterin, die Tarot-Legungen und astrologische Reflexionen auf Deutsch verfasst.

Deine Grundhaltung:
- Du schreibst poetisch, aber geerdet -- keine Esoterik-Floskeln, sondern sprachliche Klarheit mit Tiefe.
- Du synthetisierst Tarotsymbolik, astrologischen Kontext und die Frage des Fragenden zu einem stimmigen Ganzen.
- Du triffst KEINE deterministischen Vorhersagen. Alles ist "symbolische Reflexion" -- eine Einladung zur Selbsterkenntnis, kein Orakel.
- Du gibst KEINE medizinischen, rechtlichen oder finanziellen Ratschläge.
- Du sprichst in Bildern und Metaphern, die zum Nachdenken anregen.

Strukturiere deine Antwort in folgende Abschnitte:

**Einstieg** -- Eine atmosphärische Eröffnung, die die Stimmung der Legung einfängt.

**Kernthema** -- Ein bis zwei Sätze, die das zentrale Motiv der Frage und der gezogenen Karten auf den Punkt bringen.

**Tarot-Deutung** -- Deute jede gezogene Karte in ihrer Position. Verknüpfe die Symbolik der Karten miteinander und mit der Fragestellung. Ob aufrecht oder umgekehrt -- arbeite mit der Nuance, nicht mit festen Bedeutungslisten.

**Astrologischer Kontext** -- Wenn astrologische Daten vorliegen, spiegele die Planetenstellungen als zusätzliche Symbolschicht. Beschreibe die Qualität der Zeit, nicht das Schicksal.

**Reflexionsfragen** -- Drei bis fünf offene Fragen, die zum Weiterdenken anregen. Keine Ja/Nein-Fragen.

**Praktischer Impuls** -- Ein kleiner, konkreter Anstoß für den Alltag. Eine Handlung, eine Beobachtung, ein Ritual -- nichts Überwältigendes, aber etwas, das die Reflexion in die Praxis trägt.`;

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-2.0-flash-001";

function buildUserMessage(req: ReadingRequest): string {
  let msg = `Frage: ${req.question}\n\nGezogene Karten:\n`;

  for (const card of req.cards) {
    const orientation = card.upright ? "aufrecht" : "umgekehrt";
    msg += `- ${card.name} (${orientation}, Position: ${card.position})\n`;
  }

  if (req.chart) {
    msg += `\nAstrologische Daten (Natalchart):\n`;
    for (const planet of req.chart.planets) {
      msg += `- ${planet.name}: ${planet.sign} ${planet.degree}° (Haus ${planet.house})\n`;
    }
    if (req.chart.ascendant) {
      msg += `- Aszendent: ${req.chart.ascendant.sign} ${req.chart.ascendant.degree}°\n`;
    }
    if (req.chart.aspects.length > 0) {
      msg += `\nAspekte:\n`;
      for (const aspect of req.chart.aspects) {
        msg += `- ${aspect.planet1} ${aspect.type} ${aspect.planet2} (Orb: ${aspect.orb}°)\n`;
      }
    }
  }

  return msg;
}

const REDIRECT_DISCLAIMER =
  "\n\n[Hinweis: Diese Frage berührt einen Bereich, für den ich keine professionelle Beratung ersetzen kann. Die folgende Reflexion ist rein symbolisch und ersetzt keinen Fachexperten.]";

const DETERMINISTIC_ADJUSTMENT =
  "\n\n[Wichtiger Hinweis: Tarot und Astrologie bieten symbolische Reflexion, keine deterministischen Vorhersagen. Bitte forme deine Antwort dementsprechend -- als Einladung zur Selbsterkenntnis, nicht als Orakel.]";

export async function generateReading(req: ReadingRequest): Promise<ReadingResponse> {
  // --- Safety: classify input -------------------------------------------------
  const classification = classifyInput(req.question);

  // Crisis / block: return immediately with crisis resources
  if (classification.action === "crisis_response" || classification.action === "block") {
    void logSafetyEvent(classification, req.sessionToken, req.question);
    return {
      text: CRISIS_RESPONSE_DE,
      model: "safety-filter",
      tokensUsed: 0,
      latencyMs: 0,
      promptVersion: PROMPT_VERSION,
      safetyVersion: SAFETY_VERSION,
      safetyAction: classification.action,
    };
  }

  // Log non-normal events (redirect, etc.)
  if (classification.category !== "normal" || classification.severity !== "none") {
    void logSafetyEvent(classification, req.sessionToken, req.question);
  }

  // --- Build user message with optional safety disclaimers --------------------
  let userMessage = buildUserMessage(req);

  if (classification.action === "redirect") {
    userMessage += REDIRECT_DISCLAIMER;
  }

  if (classification.severity === "medium" && classification.action === "proceed") {
    userMessage += DETERMINISTIC_ADJUSTMENT;
  }

  // --- API call ---------------------------------------------------------------
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  const start = Date.now();

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.8,
      max_tokens: 2048,
    }),
  });

  const latencyMs = Date.now() - start;

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  const tokensUsed = (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0);

  // --- Safety: check output ---------------------------------------------------
  const outputCheck = checkOutput(text);
  if (!outputCheck.passed) {
    console.warn("[safety] Output check issues:", outputCheck.issues.join("; "));
  }

  return {
    text,
    model: data.model ?? DEFAULT_MODEL,
    tokensUsed,
    latencyMs,
    promptVersion: PROMPT_VERSION,
    safetyVersion: SAFETY_VERSION,
    safetyAction: classification.action === "redirect" ? "redirect" : "proceed",
  };
}
