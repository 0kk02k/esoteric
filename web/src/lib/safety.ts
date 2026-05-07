import prisma from "@/lib/db";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type InputCategory =
  | "normal"
  | "medical"
  | "legal"
  | "financial"
  | "crisis"
  | "relationship_intense"
  | "spiritual_emergency";

export type Severity = "none" | "low" | "medium" | "high" | "critical";

export type SafetyAction = "proceed" | "redirect" | "block" | "crisis_response";

export type InputClassification = {
  allowed: boolean;
  category: InputCategory;
  severity: Severity;
  action: SafetyAction;
  reason: string;
};

export type OutputCheck = {
  passed: boolean;
  issues: string[];
  sanitizedText?: string;
};

// ---------------------------------------------------------------------------
// Crisis response (German -- primary audience is DACH region)
// ---------------------------------------------------------------------------

export const CRISIS_RESPONSE_DE = `Es klingt, als wärst du gerade in einer sehr schwierigen Situation. Bitte wende dich an jemanden, der dir professionell helfen kann:

🇩🇪 Deutschland: Telefonseelsorge 0800/111 0 111 oder 0800/111 0 222 (kostenlos, 24/7)
🇦🇹 Österreich: Telefonseelsorge 142
🇨🇭 Schweiz: Die Dargebotene Hand 143

Du bist nicht allein. Es gibt Menschen, die dir zuhören wollen.`;

// ---------------------------------------------------------------------------
// Keyword sets (lowercase, for matching against lowercased input)
// ---------------------------------------------------------------------------

const CRISIS_KEYWORDS = [
  "suizid",
  "selbstmord",
  "töten",
  "umbringen",
  "sterben wollen",
  "nicht mehr leben",
  "selbstverletzung",
  "suicid",
  "kill myself",
  "end my life",
  "self harm",
  "overdose",
  "jump off",
  "slit",
  "vergewaltigung",
  "vergewaltigt",
  "rape",
  "missbrauch",
];

const MEDICAL_KEYWORDS = [
  "diagnose",
  "krankheit",
  "symptom",
  "schmerzen",
  "behandlung",
  "medikament",
  "therapie",
  "arztbesuch",
  "arzt aufsuchen",
  "krank",
  "diagnosed",
  "treatment",
  "medication",
  "doctor",
];

const LEGAL_KEYWORDS = [
  "klage",
  "anwalt",
  "gericht",
  "urteil",
  "rechtsanwalt",
  "erbrecht",
  "scheidung",
  "scheiden",
  "lawsuit",
  "attorney",
  "court",
  "legal advice",
];

const FINANCIAL_KEYWORDS = [
  "aktie",
  "investition",
  "krypto",
  "kredit",
  "steuer",
  "finanzberatung",
  "investment",
  "crypto",
  "stock",
  "tax advice",
  "financial advice",
];

const DETERMINISTIC_PATTERNS = [
  "wird er mich",
  "wird sie",
  "wann werde ich",
  "wie wird mein",
  "wann heirate ich",
  "werde ich reich",
  "exact prediction",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

// ---------------------------------------------------------------------------
// classifyInput
// ---------------------------------------------------------------------------

export function classifyInput(question: string): InputClassification {
  const lower = question.toLowerCase();

  // 1. Crisis (critical)
  if (containsAny(lower, CRISIS_KEYWORDS)) {
    return {
      allowed: false,
      category: "crisis",
      severity: "critical",
      action: "crisis_response",
      reason: "Input contains phrases indicating acute danger or abuse.",
    };
  }

  // 2. Medical (high)
  if (containsAny(lower, MEDICAL_KEYWORDS)) {
    return {
      allowed: true,
      category: "medical",
      severity: "high",
      action: "redirect",
      reason: "Input requests medical diagnosis or treatment advice.",
    };
  }

  // 3. Legal (high)
  if (containsAny(lower, LEGAL_KEYWORDS)) {
    return {
      allowed: true,
      category: "legal",
      severity: "high",
      action: "redirect",
      reason: "Input requests legal advice.",
    };
  }

  // 4. Financial (high)
  if (containsAny(lower, FINANCIAL_KEYWORDS)) {
    return {
      allowed: true,
      category: "financial",
      severity: "high",
      action: "redirect",
      reason: "Input requests financial or investment advice.",
    };
  }

  // 5. Deterministic prediction (medium)
  if (containsAny(lower, DETERMINISTIC_PATTERNS)) {
    return {
      allowed: true,
      category: "normal",
      severity: "medium",
      action: "proceed",
      reason: "Input asks for deterministic prediction; prompt will be adjusted.",
    };
  }

  // 6. Normal
  return {
    allowed: true,
    category: "normal",
    severity: "none",
    action: "proceed",
    reason: "Input is within normal scope.",
  };
}

// ---------------------------------------------------------------------------
// checkOutput
// ---------------------------------------------------------------------------

const OUTPUT_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  {
    pattern: /wirst (du|definitiv|sicherlich|unweigerlich)/i,
    label: "Deterministic prediction detected",
  },
  {
    pattern: /das universum will,? dass du/i,
    label: "Deterministic prediction detected",
  },
  {
    pattern: /du musst (jetzt|sofort)/i,
    label: "Deterministic prediction detected",
  },
  {
    pattern: /\b(heilt|behandelt|diagnose)\b/i,
    label: "Medical claim detected",
  },
  {
    pattern: /ich garantiere/i,
    label: "Authority claim detected",
  },
  {
    pattern: /das ist bewiesen/i,
    label: "Authority claim detected",
  },
];

export function checkOutput(text: string): OutputCheck {
  const issues: string[] = [];

  for (const { pattern, label } of OUTPUT_PATTERNS) {
    if (pattern.test(text)) {
      issues.push(label);
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    sanitizedText: issues.length > 0 ? text : undefined,
  };
}

// ---------------------------------------------------------------------------
// logSafetyEvent
// ---------------------------------------------------------------------------

export async function logSafetyEvent(
  classification: InputClassification,
  sessionToken?: string,
  question?: string,
): Promise<void> {
  const metadata = JSON.stringify({
    allowed: classification.allowed,
    category: classification.category,
    severity: classification.severity,
    action: classification.action,
    reason: classification.reason,
  });

  await prisma.safetyEvent.create({
    data: {
      eventType: classification.action,
      category: classification.category,
      severity: classification.severity,
      inputSnippet: question ? question.slice(0, 80) : null,
      actionTaken: classification.action,
      metadata,
      sessionToken: sessionToken ?? null,
    },
  });
}
