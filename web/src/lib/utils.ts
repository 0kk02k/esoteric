import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * UTC-Offset (in Stunden) der Laufzeit-Zeitzone zu einem HISTORISCHEN Datum.
 *
 * `new Date("1965-03-04")` wird als UTC-Mitternacht geparst; `getTimezoneOffset()`
 * darauf kann an einem DST-Grenztag vom Offset des tatsächlichen Geburtstags
 * abweichen. Wir berechnen den Offset deshalb auf 12:00 Ortszeit des Geburts-
 * datums (DST-entscheidende Stunden liegen nie um Mittag).
 *
 * Bekannte Grenze: Die IANA-Zeitzone der Laufzeit wird verwendet — wer an einem
 * Ort in einer anderen Zone geboren ist, bekommt deren historische Regeln.
 * Der Birth-Screen weist dafür mit dem Geokoding-Hinweis darauf hin.
 */
export function birthTimezoneOffset(birthDate: string): number {
  const noonLocal = new Date(`${birthDate}T12:00:00`);
  if (Number.isNaN(noonLocal.getTime())) return 0;
  return -(noonLocal.getTimezoneOffset() / 60);
}
