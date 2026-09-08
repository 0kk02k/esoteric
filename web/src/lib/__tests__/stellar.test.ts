import { describe, expect, it } from 'vitest';
import {
  constellationSegments,
  drawFreeStar,
  generateStars,
  isConstellationComplete,
  minPairDistance,
  nearestStar,
  relaxStars,
  removeStar,
  toggleStar,
  type Star,
} from '../stellar';

const CARD_IDS = Array.from({ length: 78 }, (_, i) => `card-${String(i).padStart(2, '0')}`);

describe('generateStars', () => {
  it('erzeugt genau einen Stern je Karte, deterministisch', () => {
    const a = generateStars(CARD_IDS);
    const b = generateStars(CARD_IDS);
    expect(a).toHaveLength(78);
    expect(a).toEqual(b);
    expect(new Set(a.map((s) => s.id))).toEqual(new Set(CARD_IDS));
  });

  it('hält die Sterne im Feld (4–96 %)', () => {
    for (const s of generateStars(CARD_IDS)) {
      expect(s.x).toBeGreaterThanOrEqual(4);
      expect(s.x).toBeLessThanOrEqual(96);
      expect(s.y).toBeGreaterThanOrEqual(4);
      expect(s.y).toBeLessThanOrEqual(96);
    }
  });
});

describe('relaxStars', () => {
  it('hebt Kollisionen auf: Mindestabstand danach >= 7', () => {
    const relaxed = relaxStars(generateStars(CARD_IDS));
    expect(minPairDistance(relaxed)).toBeGreaterThanOrEqual(7 - 1e-6);
  });

  it('bleibt deterministisch und erhält Anzahl + IDs', () => {
    const a = relaxStars(generateStars(CARD_IDS));
    const b = relaxStars(generateStars(CARD_IDS));
    expect(a).toEqual(b);
    expect(new Set(a.map((s) => s.id))).toEqual(new Set(CARD_IDS));
  });
});

describe('nearestStar — px-Rechnung auf 4:5-Feld', () => {
  const DIMS = { width: 318, height: 397 };
  const stars: Star[] = [
    { id: 'a', x: 51, y: 57, size: 4, brightness: 0.5 },
    { id: 'b', x: 55.5, y: 54.5, size: 4, brightness: 0.5 },
  ];

  it('trifft den exakten Stern', () => {
    expect(nearestStar(stars, 51, 57, DIMS)?.id).toBe('a');
  });

  it('entscheidet nach Pixeln, nicht nach Prozenten', () => {
    // Tap (50,50): %-euklid läge knapp bei a (7,07 < 7,11), aber px-euklid
    // bei b (25,0 < 28,0) — Y dehnt sich auf dem 4:5-Feld stärker aus.
    expect(nearestStar(stars, 50, 50, DIMS)?.id).toBe('b');
  });

  it('liefert null außerhalb des Tapp-Radius', () => {
    expect(nearestStar(stars, 90, 10, DIMS)).toBeNull();
  });
});

describe('toggleStar / removeStar', () => {
  it('hängt in Wahl-Reihenfolge an und hält max 3', () => {
    let sel = toggleStar([], 'a');
    sel = toggleStar(sel, 'b');
    sel = toggleStar(sel, 'c');
    expect(sel).toEqual(['a', 'b', 'c']);
    expect(toggleStar(sel, 'd')).toEqual(['a', 'b', 'c']);
  });

  it('nimmt bei erneutem Tipp zurück', () => {
    expect(toggleStar(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('removeStar erhält die relative Reihenfolge (Neunummerierung)', () => {
    expect(removeStar(['a', 'b', 'c'], 'b')).toEqual(['a', 'c']);
  });

  it('erkennt die vollständige Konstellation', () => {
    expect(isConstellationComplete(['a', 'b'])).toBe(false);
    expect(isConstellationComplete(['a', 'b', 'c'])).toBe(true);
  });
});

describe('drawFreeStar (Blindwahl)', () => {
  const stars: Star[] = [
    { id: 'a', x: 10, y: 10, size: 4, brightness: 0.5 },
    { id: 'b', x: 50, y: 50, size: 4, brightness: 0.5 },
    { id: 'c', x: 90, y: 90, size: 4, brightness: 0.5 },
  ];

  it('zieht nie einen bereits gewählten Stern', () => {
    for (let i = 0; i < 20; i++) {
      expect(drawFreeStar(stars, ['a'], () => i / 20)?.id).not.toBe('a');
    }
  });

  it('respektiert den injizierten Zufall', () => {
    expect(drawFreeStar(stars, [], () => 0)?.id).toBe('a');
    expect(drawFreeStar(stars, [], () => 0.99)?.id).toBe('c');
  });

  it('liefert null, wenn alle Sterne gewählt sind', () => {
    expect(drawFreeStar(stars, ['a', 'b', 'c'])).toBeNull();
  });
});

describe('constellationSegments', () => {
  const stars: Star[] = [
    { id: 'a', x: 10, y: 10, size: 4, brightness: 0.5 },
    { id: 'b', x: 50, y: 30, size: 4, brightness: 0.5 },
    { id: 'c', x: 80, y: 70, size: 4, brightness: 0.5 },
    { id: 'd', x: 20, y: 90, size: 4, brightness: 0.5 },
  ];

  it('liefert keine Linie vor zwei Sternen', () => {
    expect(constellationSegments(stars, [])).toEqual([]);
    expect(constellationSegments(stars, ['a'])).toEqual([]);
  });

  it('zeichnet bei zwei Sternen eine Linie', () => {
    const segs = constellationSegments(stars, ['a', 'b']);
    expect(segs).toHaveLength(1);
    expect(segs[0]).toMatchObject({ from: { id: 'a' }, to: { id: 'b' }, closing: false });
  });

  it('schließt bei drei Sternen die Figur zum ersten Punkt', () => {
    const segs = constellationSegments(stars, ['a', 'b', 'c']);
    expect(segs).toHaveLength(3);
    expect(segs[0]).toMatchObject({ from: { id: 'a' }, to: { id: 'b' }, closing: false });
    expect(segs[1]).toMatchObject({ from: { id: 'b' }, to: { id: 'c' }, closing: false });
    expect(segs[2]).toMatchObject({ from: { id: 'c' }, to: { id: 'a' }, closing: true });
  });

  it('ignoriert gewählte IDs ohne Stern (staler Restore) — Rest zählt weiter', () => {
    const segs = constellationSegments(stars, ['a', 'gibts-nicht', 'c']);
    // Zwei reale Sterne = eine offene Linie; die dritte Wahl holt der Nutzer nach
    expect(segs).toHaveLength(1);
    expect(segs[0]).toMatchObject({ from: { id: 'a' }, to: { id: 'c' }, closing: false });
  });
});
