import { describe, expect, it } from 'vitest';
import type { ChartResponse } from '../astrology';
import {
  aspectIsActive,
  circularGap,
  houseCuspsForWheel,
  isTensionAspect,
  longitudeToXY,
  normalizeLongitude,
  planetsForWheel,
  spreadOverlaps,
} from '../radixWheel';

const chart = (overrides: Partial<ChartResponse> = {}): ChartResponse => ({
  version: '3.0',
  source: 'swisseph',
  julianDay: 0,
  planets: [],
  aspects: [],
  uncertainty: { timeUnknown: false, affectedFields: [] },
  calculatedAt: '2026-09-10T00:00:00.000Z',
  ...overrides,
});

describe('normalizeLongitude — Winkel auf [0, 360)', () => {
  it('normalisiert Über- und Unterlauf', () => {
    expect(normalizeLongitude(450)).toBe(90);
    expect(normalizeLongitude(-90)).toBe(270);
    expect(normalizeLongitude(360)).toBe(0);
  });
});

describe('longitudeToXY — Ekliptik auf den Schirm (0° Widder links, gegen den Uhrzeigersinn)', () => {
  it('bildet die Kardinalpunkte korrekt ab', () => {
    expect(longitudeToXY(0, 50)).toEqual({ x: -50, y: 0 });
    expect(longitudeToXY(90, 50)).toEqual({ x: 0, y: 50 });
    expect(longitudeToXY(180, 50)).toEqual({ x: 50, y: 0 });
    expect(longitudeToXY(270, 50)).toEqual({ x: 0, y: -50 });
  });

  it('bleibt bei Winkeln über 360° auf dem Kreis', () => {
    expect(longitudeToXY(450, 50)).toEqual({ x: 0, y: 50 });
  });
});

describe('circularGap — Kreisdistanz', () => {
  it('misst über die 0°-Grenze hinweg', () => {
    expect(circularGap(350, 10)).toBe(20);
    expect(circularGap(10, 350)).toBe(20);
  });

  it('misst normale Abstände direkt', () => {
    expect(circularGap(100, 200)).toBe(100);
  });
});

describe('spreadOverlaps — enge Konjunktionen auseinanderziehen', () => {
  it('zieht zwei nahe Planeten symmetrisch auseinander', () => {
    const [a, b] = spreadOverlaps([300, 302], 8);
    expect(b! - a!).toBeGreaterThanOrEqual(7.99);
    expect((a! + b!) / 2).toBeCloseTo(301, 5);
  });

  it('lässt weit auseinanderliegende Planeten unverändert', () => {
    expect(spreadOverlaps([0, 180], 8)).toEqual([0, 180]);
  });

  it('hält den Mindestabstand auch im Cluster und zentriert symmetrisch', () => {
    const spread = spreadOverlaps([100, 102, 104], 8);
    for (let i = 1; i < spread.length; i++) {
      expect(spread[i]! - spread[i - 1]!).toBeGreaterThanOrEqual(7.5);
    }
    expect(spread[0]).toBeCloseTo(94, 1);
    expect(spread[2]).toBeCloseTo(110, 1);
  });

  it('behandelt die 0°-Grenze als Nachbarschaft', () => {
    const [a, b] = spreadOverlaps([355, 5], 12);
    expect(circularGap(a!, b!)).toBeGreaterThanOrEqual(11.99);
  });

  it('gibt leere und Ein-Element-Listen unverändert zurück', () => {
    expect(spreadOverlaps([], 8)).toEqual([]);
    expect(spreadOverlaps([42], 8)).toEqual([42]);
  });
});

describe('planetsForWheel — Planeten mit Glyphen und aufgelösten Überlappungen', () => {
  it('mappt die Chart-Planeten auf Glyphen und Anzeige-Längengrade', () => {
    const wheel = planetsForWheel(chart({
      planets: [
        { name: 'Sonne', longitude: 139.54, latitude: 0, speed: 1, house: '9', sign: 'Löwe', degree: 19.54 },
        { name: 'Venus', longitude: 300.1, latitude: 0, speed: 1, house: '5', sign: 'Steinbock', degree: 0.1 },
        { name: 'Saturn', longitude: 302.0, latitude: 0, speed: 1, house: '6', sign: 'Steinbock', degree: 2.0 },
      ],
    }));
    expect(wheel.map((p) => p.name)).toEqual(['Sonne', 'Venus', 'Saturn']);
    expect(wheel[0].glyph).toBe('☉');
    expect(wheel[0].displayLongitude).toBeCloseTo(139.54, 1);
    expect(circularGap(wheel[1].displayLongitude, wheel[2].displayLongitude)).toBeGreaterThanOrEqual(7.5);
  });

  it('liefert ohne Chart eine leere Liste', () => {
    expect(planetsForWheel(null)).toEqual([]);
  });
});

describe('houseCuspsForWheel — zwölf Häuserzeiger', () => {
  it('nutzt die berechneten Häuserspitzen, wenn vorhanden', () => {
    const cusps = houseCuspsForWheel(chart({
      houses: Array.from({ length: 12 }, (_, i) => ({
        number: i + 1,
        cuspLongitude: i * 30 + 15,
        sign: 'Widder',
        degree: 15,
      })),
    }));
    expect(cusps[0]).toBe(15);
    expect(cusps).toHaveLength(12);
  });

  it('fällt auf gleiche Sektoren ab dem Aszendenten zurück', () => {
    const cusps = houseCuspsForWheel(chart({
      ascendant: { sign: 'Krebs', degree: 12, longitude: 102 },
    }));
    expect(cusps[0]).toBe(102);
    expect(cusps[1]).toBe(132);
  });

  it('fällt ohne Häuser und Aszendenten auf 0° Widder zurück', () => {
    expect(houseCuspsForWheel(chart())[0]).toBe(0);
  });
});

describe('isTensionAspect — gold gegen violett', () => {
  it('markiert Quadrat und Opposition als Spannung', () => {
    expect(isTensionAspect('Quadrat')).toBe(true);
    expect(isTensionAspect('Opposition')).toBe(true);
  });

  it('lässt Konjunktion, Trigon und Sextil harmonisch', () => {
    expect(isTensionAspect('Konjunktion')).toBe(false);
    expect(isTensionAspect('Trigon')).toBe(false);
    expect(isTensionAspect('Sextil')).toBe(false);
  });
});

describe('aspectIsActive — Aspektlinie nur bei genannten Symbolen anzünden', () => {
  const aspect = { planet1: 'Venus', planet2: 'Saturn', type: 'Konjunktion', orb: 1.9 };

  it('zündet bei Typ plus beiden Planeten', () => {
    expect(aspectIsActive(aspect, ['Venus', 'Saturn', 'Konjunktion'])).toBe(true);
  });

  it('bleibt aus, wenn ein Beteiligter fehlt', () => {
    expect(aspectIsActive(aspect, ['Venus', 'Konjunktion'])).toBe(false);
    expect(aspectIsActive(aspect, ['Venus', 'Saturn'])).toBe(false);
  });
});
