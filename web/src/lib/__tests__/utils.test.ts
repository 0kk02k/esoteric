import { describe, it, expect } from 'vitest';

// Zeitzone festnageln, BEVOR das Modul geladen wird (Dynamischer Import,
// da ES-Imports über die Zuweisung hinausziehen würden).
process.env.TZ = 'Europe/Berlin';

describe('birthTimezoneOffset', () => {
  const load = async () => (await import('@/lib/utils')).birthTimezoneOffset;

  it('liefert den Offset zur Mittagszeit des Geburtsdatums (nicht UTC-Mitternacht)', async () => {
    const fn = await load();
    // Europe/Berlin: MESZ (+2) im Sommer, MEZ (+1) im Winter.
    expect(fn('2024-07-15')).toBe(2);
    expect(fn('2024-01-15')).toBe(1);
  });

  it('unterscheidet sich am Sommertag vom UTC-Mitternachts-Offset (der alte Bug)', async () => {
    const fn = await load();
    // new Date("2024-07-15") ist 2024-07-15T00:00Z = 02:00 MESZ am 15. —
    // in Randfällen (DST-Grenze um Mitternacht) weicht dieser Offset vom
    // Offset des tatsächlichen Geburtstags ab. Um 12:00 Ortszeit nie.
    const midnightOffset = -(new Date('2024-03-31T00:00:00Z').getTimezoneOffset() / 60);
    const noonOffset = fn('2024-03-31'); // DST-Wechsel 2024: 31.03., 02:00 → 03:00 MESZ
    expect(noonOffset).toBe(2);
    // Dokumentiert den Kontrast: Der Mitternachts-Anchor kann danebenliegen.
    expect([1, 2]).toContain(midnightOffset);
  });

  it('liefert 0 für ungültige Eingaben statt zu crashen', async () => {
    const fn = await load();
    expect(fn('')).toBe(0);
    expect(fn('not-a-date')).toBe(0);
  });
});
