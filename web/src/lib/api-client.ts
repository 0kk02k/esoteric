/**
 * Client-Wrapper für Reading-Flow-API-Aufrufe: Netz- und HTTP-Fehler werden
 * zu sprechenden, deutschen ApiErrors mit Status und Payload — damit die UI
 * recovern kann (Retry, Limits) statt rohe Strings zu zeigen.
 */

export class ApiError extends Error {
  status: number;
  payload: Record<string, unknown>;
  constructor(message: string, status: number, payload: Record<string, unknown> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError("Keine Verbindung. Prüfe dein Netz und versuche es erneut.", 0);
  }
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new ApiError(
      typeof data.error === "string" ? data.error : `Serverfehler (${res.status})`,
      res.status,
      data,
    );
  }
  return data as T;
}

export type ErrorKind = "limit" | "followupLimit" | null;

/** Englische Serverfehler in ruhige, deutsche Sätze mit nächster Handlung übersetzen. */
export function toUserError(err: unknown): { message: string; kind: ErrorKind } {
  if (err instanceof ApiError) {
    if (err.status === 429) {
      if (typeof err.payload.followupsRemaining === "number") {
        return {
          message:
            "Dein Follow-up-Limit für heute ist erreicht. Plus schaltet bis zu fünf Nachfragen pro Reading frei.",
          kind: "followupLimit",
        };
      }
      return {
        message: "Dein Tageslimit ist erreicht — ab morgen stehen dir wieder Readings zur Verfügung.",
        kind: "limit",
      };
    }
    const m = err.message;
    if (m.includes("not found"))
      return { message: "Dieses Reading konnte nicht gefunden werden. Starte ein neues Ritual.", kind: null };
    if (m.includes("Unauthorized"))
      return { message: "Diese Sitzung gehört nicht zu dir. Starte ein neues Ritual.", kind: null };
    if (m.includes("API key") || m.includes("AI error") || m.includes("Nebius API error"))
      return { message: "Die Synthese ist an der KI-Schnittstelle gescheitert. Bitte versuche es gleich erneut.", kind: null };
    if (err.status === 0) return { message: m, kind: null };
    return { message: "Etwas ist schiefgelaufen. Bitte versuche es erneut.", kind: null };
  }
  return { message: "Etwas ist schiefgelaufen. Bitte versuche es erneut.", kind: null };
}
