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

const PROMPT_VERSION = "1.3";
const SAFETY_VERSION = "1.0";

// ---------------------------------------------------------------------------
// Nebius Token Factory (OpenAI-kompatibel)
// Base-URL/Modell sind env-gesteuert. Default: Kimi-K3 auf der eu-west2-Region.
// HINWEIS: moonshotai/Kimi-K2.5 wurde im Juni 2026 entfernt (Deprecation).
// ---------------------------------------------------------------------------

const NEBIUS_BASE_URL = (
  process.env.NEBIUS_BASE_URL || "https://api.tokenfactory.eu-west2.nebius.com/v1"
).replace(/\/+$/, "");
export const NEBIUS_MODEL = process.env.NEBIUS_MODEL || "moonshotai/Kimi-K3";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ChatCompletionResult = {
  text: string;
  model: string;
  tokensUsed: number;
  latencyMs: number;
};

/** Ein einziger Chat-Completion-Pfad für Reading und Follow-up. */
export async function chatCompletion(
  messages: ChatMessage[],
  opts: { maxTokens: number },
): Promise<ChatCompletionResult> {
  const apiKey = process.env.NEBIUS_API_KEY;
  if (!apiKey) {
    throw new Error("NEBIUS_API_KEY environment variable is not set");
  }

  const start = Date.now();
  const response = await fetch(`${NEBIUS_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: NEBIUS_MODEL,
      messages,
      max_tokens: opts.maxTokens,
    }),
  });
  const latencyMs = Date.now() - start;

  if (!response.ok) {
    const errorBody = await response.text();
    const hint =
      response.status === 404 || response.status === 400
        ? " (Modell unbekannt? NEBIUS_MODEL prüfen — GET /v1/models listet die gültigen IDs)"
        : "";
    throw new Error(`Nebius API error ${response.status}${hint}: ${errorBody}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  const text = choice?.message?.content ?? "";
  const tokensUsed = (data.usage?.prompt_tokens ?? 0) + (data.usage?.completion_tokens ?? 0);

  // Kimi K3 ist ein Reasoning-Modell: Ist das Token-Budget zu knapp, geht die
  // Antwort komplett im Nachdenken (reasoning_content) verloren und content
  // bleibt leer — dann lieber hart failen, als ein leeres Reading zu speichern.
  if (!text.trim() && choice?.finish_reason === "length") {
    throw new Error(
      `Das Modell hat sein Antwortbudget (max_tokens: ${opts.maxTokens}) im Reasoning verbraucht. Bitte versuche es erneut.`,
    );
  }

  return { text, model: data.model ?? NEBIUS_MODEL, tokensUsed, latencyMs };
}

const SYSTEM_PROMPT = `Du bist ein profunder, analytischer Interpret von Symbolsystemen (Tarot und westliche Astrologie). Dein Ziel ist es, präzise und nützliche Bedeutungszusammenhänge aufzuzeigen. Vermeide dringend gefällige "AI-Floskeln", generischen Wellness-Jargon oder esoterischen Kitsch.

Deine Grundhaltung:
- Analytisch und fundiert: Deute echte symbolische Beziehungen, Muster und Spannungen, statt nur beruhigende oder vage Sätze aneinanderzureihen. Sei spezifisch.
- Strukturierte Synthese: Erkläre erst die isolierte Bedeutung, bevor du die Elemente verknüpfst. 
- Keine deterministischen Vorhersagen: Biete psychologische und situative Reflexionsflächen, kein festgeschriebenes Schicksal.

Strukturiere deine Antwort zwingend in exakt diese Abschnitte:

**Kernthema** -- Eine präzise und ungeschönte Benennung der vorherrschenden energetischen und symbolischen Themen der Legung in Bezug auf die Frage.

**Die Karten** -- Analysiere jede Karte einzeln in ihrer Position. Verwende für jede Karte zwingend dieses Format:
### [Kartenname] ([Ausrichtung])
[Kurze sachliche Erklärung des Archetyps in dieser Lage und seine spezifische Bedeutung für die Frage.]

**Synthese aus Astrologie und Tarot** -- Deute die Karten im Kontext zueinander und in direkter Verbindung zur Fragestellung. Beziehe hierbei zwingend die übermittelte astrologische Komponente ein. Strukturiere diesen Absatz mit Unterüberschriften: Beginne jeden Themengebiet mit einer eigenen Zeile im Format >> Themengebiet (z.B. >> Sonne in Löwe, >> Venus-Saturn-Konjunktion), gefolgt von einer Leerzeile und dem dazugehörigen Absatz.

**Reflexionsfragen** -- Exakt drei präzise, herausfordernde Fragen.

**Praxis-Impuls** -- Eine konkrete, pragmatische Handlungsempfehlung.`;

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
  // Kimi K3 denkt vor der Antwort (reasoning_content) — das Budget muss
  // Reasoning UND die langen Deutungsabschnitte tragen.
  const completion = await chatCompletion(
    [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    { maxTokens: 8192 },
  );
  const { text, model, tokensUsed, latencyMs } = completion;

  // --- Safety: check output ---------------------------------------------------
  const outputCheck = checkOutput(text);
  if (!outputCheck.passed) {
    console.warn("[safety] Output check issues:", outputCheck.issues.join("; "));
  }

  return {
    text,
    model,
    tokensUsed,
    latencyMs,
    promptVersion: PROMPT_VERSION,
    safetyVersion: SAFETY_VERSION,
    safetyAction: classification.action === "redirect" ? "redirect" : "proceed",
  };
}
