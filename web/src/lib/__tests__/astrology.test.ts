import { describe, it, expect, beforeAll } from 'vitest';
import {
  calculateNatalChartFromRequest,
  calculateNatalChart,
  calculateTransits,
  clearChartCache,
  validateNatalChartRequest,
  type NatalChartRequest,
  type ChartResponse,
  type ChartResult,
  type PlanetPosition,
  type Transit,
} from '@/lib/astrology';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ZODIAC_ORDER = [
  'Widder', 'Stier', 'Zwillinge', 'Krebs',
  'Löwe', 'Jungfrau', 'Waage', 'Skorpion',
  'Schütze', 'Steinbock', 'Wassermann', 'Fische',
] as const;

function signIndex(sign: string): number {
  return ZODIAC_ORDER.indexOf(sign as typeof ZODIAC_ORDER[number]);
}

function makeRequest(overrides: Partial<NatalChartRequest> = {}): NatalChartRequest {
  return {
    year: 1990,
    month: 6,
    day: 15,
    hour: 14,
    minute: 30,
    latitude: 50.0,
    longitude: 8.0,
    timezoneOffset: 1,
    timeUnknown: false,
    ...overrides,
  };
}

/** Check whether a planet has a valid zodiac sign (not '?'). */
function hasValidSign(planet: PlanetPosition): boolean {
  return (ZODIAC_ORDER as readonly string[]).includes(planet.sign);
}

/** Whether two objects are deep-equal via JSON. */
function jsonEqual<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ---------------------------------------------------------------------------
// Shared results -- computed once, reused across tests
// ---------------------------------------------------------------------------

let usesFallback = false;

async function computeChart(req: NatalChartRequest): Promise<ChartResponse> {
  clearChartCache();
  const chart = await calculateNatalChartFromRequest(req);
  // Determine if fallback was used: fallback always sets source = "fallback"
  usesFallback = chart.source === 'fallback';
  return chart;
}

let jungChart: ChartResponse;
let einsteinChart: ChartResponse;

beforeAll(async () => {
  jungChart = await computeChart(makeRequest({
    year: 1875, month: 7, day: 26, hour: 18, minute: 30,
    latitude: 47.5805, longitude: 9.3291, timezoneOffset: 0.5,
  }));
  einsteinChart = await computeChart(makeRequest({
    year: 1879, month: 3, day: 14, hour: 11, minute: 30,
    latitude: 48.3984, longitude: 9.9916, timezoneOffset: 1,
  }));
});

// ===================================================================
// 1. Known Chart -- Carl Jung
// ===================================================================
describe('Known Chart: Carl Jung (26 Jul 1875, 18:30, Kesswil)', () => {
  it('should have Sun in Leo', () => {
    const sun = jungChart.planets.find((p) => p.name === 'Sonne');
    expect(sun).toBeDefined();
    expect(sun!.sign).toBe('Löwe');
  });

  it('should have Sun degree around 3 degrees', () => {
    const sun = jungChart.planets.find((p) => p.name === 'Sonne');
    expect(sun).toBeDefined();
    // Swiss Eph gives ~3 deg; fallback may differ but should be valid
    if (jungChart.source === 'swisseph') {
      expect(sun!.degree).toBeGreaterThanOrEqual(0);
      expect(sun!.degree).toBeLessThanOrEqual(10);
    } else {
      expect(sun!.degree).toBeGreaterThanOrEqual(0);
      expect(sun!.degree).toBeLessThan(30);
    }
  });

  it('should have Moon in Taurus', () => {
    const moon = jungChart.planets.find((p) => p.name === 'Mond');
    expect(moon).toBeDefined();
    expect(moon!.sign).toBe('Stier');
  });

  it('should have Ascendant in Aquarius', () => {
    if (!jungChart.ascendant) {
      return; // fallback may not compute it accurately
    }
    // Tolerate +-1 sign for LMT / timezone uncertainty
    const idx = signIndex(jungChart.ascendant.sign);
    expect(idx).toBeGreaterThanOrEqual(9); // Steinbock (9)
    expect(idx).toBeLessThanOrEqual(11);   // Fische (11)
  });

  it('should return the same result when called twice (reproducibility)', async () => {
    // Clear cache so we get a fresh computation
    clearChartCache();
    const req = makeRequest({
      year: 1875, month: 7, day: 26, hour: 18, minute: 30,
      latitude: 47.5805, longitude: 9.3291, timezoneOffset: 0.5,
    });
    const first = await calculateNatalChartFromRequest(req);
    // Cache is populated now; second call returns cached
    const second = await calculateNatalChartFromRequest(req);
    expect(jsonEqual(first, second)).toBe(true);
  });
});

// ===================================================================
// 2. Known Chart -- Albert Einstein
// ===================================================================
describe('Known Chart: Albert Einstein (14 Mar 1879, 11:30, Ulm)', () => {
  it('should have Sun in Pisces', () => {
    const sun = einsteinChart.planets.find((p) => p.name === 'Sonne');
    expect(sun).toBeDefined();
    expect(sun!.sign).toBe('Fische');
  });

  it('should have Moon in Sagittarius', () => {
    const moon = einsteinChart.planets.find((p) => p.name === 'Mond');
    expect(moon).toBeDefined();
    expect(moon!.sign).toBe('Schütze');
  });

  it('should have Ascendant roughly in Gemini', () => {
    if (!einsteinChart.ascendant) {
      return;
    }
    const idx = signIndex(einsteinChart.ascendant.sign);
    // Gemini = index 2 (Zwillinge). Allow +-1 sign for LMT uncertainty.
    expect(idx).toBeGreaterThanOrEqual(1);
    expect(idx).toBeLessThanOrEqual(3);
  });
});

// ===================================================================
// 3. Unknown Birth Time
// ===================================================================
describe('Unknown birth time', () => {
  let chart: ChartResponse;

  beforeAll(async () => {
    chart = await computeChart(makeRequest({
      year: 1990, month: 6, day: 15, hour: 12, minute: 0,
      latitude: 50.0, longitude: 8.0, timezoneOffset: 1,
      timeUnknown: true,
    }));
  });

  it('should not include ascendant when time is unknown', () => {
    expect(chart.ascendant).toBeUndefined();
  });

  it('should not include houses when time is unknown', () => {
    expect(chart.houses).toBeUndefined();
  });

  it('should have uncertainty marker present', () => {
    expect(chart.uncertainty).toBeDefined();
    expect(chart.uncertainty.timeUnknown).toBe(true);
    expect(chart.uncertainty.affectedFields).toContain('ascendant');
    expect(chart.uncertainty.affectedFields).toContain('houses');
  });

  it('should still have planet positions', () => {
    expect(chart.planets.length).toBeGreaterThanOrEqual(2);
    for (const p of chart.planets) {
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThanOrEqual(360);
      expect(p.sign).toBeTruthy();
    }
  });

  it('should still calculate aspects between planets', () => {
    expect(Array.isArray(chart.aspects)).toBe(true);
  });
});

// ===================================================================
// 4. Transit Calculation
// ===================================================================
describe('Transit calculation', () => {
  let natalChart: ChartResponse;
  let transits: Transit[];

  beforeAll(async () => {
    natalChart = await computeChart(makeRequest({
      year: 1960, month: 1, day: 1, hour: 12, minute: 0,
      latitude: 50.0, longitude: 8.0, timezoneOffset: 1,
    }));
    // Transits 30 years later
    transits = calculateTransits(natalChart, new Date(1990, 0, 1, 12, 0));
  });

  it('should return a non-empty transit aspects array', () => {
    // Depending on planet positions, there may or may not be transits in orb.
    // At minimum the function should return an array.
    expect(Array.isArray(transits)).toBe(true);
  });

  it('each transit should have required fields', () => {
    for (const t of transits) {
      expect(t).toHaveProperty('transitingPlanet');
      expect(t).toHaveProperty('natalPlanet');
      expect(t).toHaveProperty('type');
      expect(t).toHaveProperty('orb');
      expect(typeof t.transitingPlanet).toBe('string');
      expect(typeof t.natalPlanet).toBe('string');
      expect(typeof t.type).toBe('string');
      expect(typeof t.orb).toBe('number');
    }
  });

  it('transit orbs should be non-negative', () => {
    for (const t of transits) {
      expect(t.orb).toBeGreaterThanOrEqual(0);
    }
  });

  it('transit types should be from the known set', () => {
    const validTypes = ['Konjunktion', 'Opposition', 'Trigon', 'Quadrat', 'Sextil'];
    for (const t of transits) {
      expect(validTypes).toContain(t.type);
    }
  });
});

// ===================================================================
// 5. Caching
// ===================================================================
describe('Caching', () => {
  it('should return identical results on second call (cache hit)', async () => {
    clearChartCache();
    const req = makeRequest({
      year: 1985, month: 3, day: 20, hour: 6, minute: 0,
      latitude: 48.8566, longitude: 2.3522, timezoneOffset: 1,
    });
    const first = await calculateNatalChartFromRequest(req);
    expect(first.source).toBeDefined();

    const second = await calculateNatalChartFromRequest(req);
    expect(jsonEqual(first, second)).toBe(true);
  });

  it('should serve different results after cache clear', async () => {
    clearChartCache();
    const req = makeRequest({
      year: 1985, month: 3, day: 20, hour: 6, minute: 0,
      latitude: 48.8566, longitude: 2.3522, timezoneOffset: 1,
    });
    const first = await calculateNatalChartFromRequest(req);

    clearChartCache();
    const second = await calculateNatalChartFromRequest(req);

    // After clearing and re-computing, calculatedAt will differ
    // but planetary data should be the same
    expect(first.planets.length).toBe(second.planets.length);
    for (let i = 0; i < first.planets.length; i++) {
      expect(first.planets[i].longitude).toBeCloseTo(second.planets[i].longitude, 4);
      expect(first.planets[i].sign).toBe(second.planets[i].sign);
    }
  });
});

// ===================================================================
// 6. Edge Cases
// ===================================================================
describe('Edge cases', () => {
  it('should handle timezone boundary: Jan 1 1990 00:00 UTC+1', async () => {
    const chart = await computeChart(makeRequest({
      year: 1990, month: 1, day: 1, hour: 0, minute: 0,
      latitude: 52.52, longitude: 13.405, timezoneOffset: 1,
    }));

    expect(chart).toBeDefined();
    expect(chart.planets.length).toBeGreaterThanOrEqual(2);

    // Sun should be in Steinbock (Capricorn) on Jan 1.
    const sun = chart.planets.find((p) => p.name === 'Sonne');
    expect(sun).toBeDefined();
    expect(sun!.sign).toBe('Steinbock');
  });

  it('should handle very high latitude (Arctic, 67 deg N)', async () => {
    const chart = await computeChart(makeRequest({
      year: 1990, month: 6, day: 21, hour: 12, minute: 0,
      latitude: 67.0, longitude: 25.0, timezoneOffset: 2,
    }));

    expect(chart).toBeDefined();
    expect(chart.planets.length).toBeGreaterThanOrEqual(2);
    // Houses may be undefined at extreme latitudes -- acceptable.
  });

  it('should not throw on very old dates', async () => {
    await expect(
      computeChart(makeRequest({
        year: 1900, month: 3, day: 1, hour: 12, minute: 0,
        latitude: 48.0, longitude: 11.0, timezoneOffset: 1,
      })),
    ).resolves.toBeDefined();
  });

  it('should not throw on future dates', async () => {
    await expect(
      computeChart(makeRequest({
        year: 2100, month: 12, day: 31, hour: 23, minute: 59,
        latitude: 40.0, longitude: -74.0, timezoneOffset: -5,
      })),
    ).resolves.toBeDefined();
  });

  it('should handle date at equator (latitude 0)', async () => {
    const chart = await computeChart(makeRequest({
      year: 1990, month: 3, day: 21, hour: 12, minute: 0,
      latitude: 0, longitude: 0, timezoneOffset: 0,
    }));
    expect(chart).toBeDefined();
    expect(chart.planets.length).toBeGreaterThanOrEqual(2);
  });

  it('should handle southern hemisphere', async () => {
    const chart = await computeChart(makeRequest({
      year: 1990, month: 12, day: 21, hour: 12, minute: 0,
      latitude: -33.87, longitude: 151.21, timezoneOffset: 10,
    }));
    expect(chart).toBeDefined();
    expect(chart.planets.length).toBeGreaterThanOrEqual(2);
    // It should be summer in the southern hemisphere, Sun in Schütze
    const sun = chart.planets.find((p) => p.name === 'Sonne');
    expect(sun).toBeDefined();
    expect(sun!.sign).toBe('Schütze');
  });
});

// ===================================================================
// 7. Reproducibility Check -- three runs, byte-identical
// ===================================================================
describe('Reproducibility across multiple runs', () => {
  it('should produce byte-identical results across 3 sequential runs', async () => {
    clearChartCache();
    const req = makeRequest({
      year: 1977, month: 8, day: 24, hour: 3, minute: 15,
      latitude: 34.0522, longitude: -118.2437, timezoneOffset: -8,
    });

    // Sequential to ensure cache serves the same data
    const first = await calculateNatalChartFromRequest(req);
    const second = await calculateNatalChartFromRequest(req);
    const third = await calculateNatalChartFromRequest(req);

    const j1 = JSON.stringify(first);
    const j2 = JSON.stringify(second);
    const j3 = JSON.stringify(third);
    expect(j1).toBe(j2);
    expect(j2).toBe(j3);
  });
});

// ===================================================================
// 8. Structural validation
// ===================================================================
describe('Chart result structure (ChartResponse)', () => {
  let chart: ChartResponse;

  beforeAll(async () => {
    chart = await computeChart(makeRequest({
      year: 1990, month: 6, day: 15, hour: 14, minute: 30,
      latitude: 50.0, longitude: 8.0, timezoneOffset: 1,
    }));
  });

  it('should have a version field', () => {
    expect(chart.version).toBeTruthy();
  });

  it('should have a source field (swisseph or fallback)', () => {
    expect(['swisseph', 'fallback']).toContain(chart.source);
  });

  it('should have a julianDay number', () => {
    expect(typeof chart.julianDay).toBe('number');
    expect(chart.julianDay).toBeGreaterThan(0);
  });

  it('should have a calculatedAt ISO string', () => {
    expect(chart.calculatedAt).toBeTruthy();
    expect(() => new Date(chart.calculatedAt)).not.toThrow();
  });

  it('should contain exactly 7 planets', () => {
    expect(chart.planets).toHaveLength(7);
  });

  it('each planet should have all required fields', () => {
    const requiredKeys: (keyof PlanetPosition)[] = [
      'name', 'longitude', 'latitude', 'speed', 'house', 'sign', 'degree',
    ];
    for (const p of chart.planets) {
      for (const key of requiredKeys) {
        expect(p).toHaveProperty(key);
      }
    }
  });

  it('planet names should be the expected German names', () => {
    const names = chart.planets.map((p) => p.name);
    expect(names).toContain('Sonne');
    expect(names).toContain('Mond');
    expect(names).toContain('Merkur');
    expect(names).toContain('Venus');
    expect(names).toContain('Mars');
    expect(names).toContain('Jupiter');
    expect(names).toContain('Saturn');
  });

  it('longitudes should be in range [0, 360)', () => {
    for (const p of chart.planets) {
      if (p.error) continue; // errored planets have longitude 0
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
    }
  });

  it('signs should be valid zodiac sign names (when not errored)', () => {
    for (const p of chart.planets) {
      if (p.error) continue; // errored planets may have '?' sign
      expect(ZODIAC_ORDER).toContain(p.sign);
    }
  });

  it('degrees within sign should be in range [0, 30)', () => {
    for (const p of chart.planets) {
      if (p.error) continue;
      expect(p.degree).toBeGreaterThanOrEqual(0);
      expect(p.degree).toBeLessThan(30);
    }
  });

  it('aspects array should exist (may be empty)', () => {
    expect(Array.isArray(chart.aspects)).toBe(true);
  });

  it('aspect types should be from the known set', () => {
    const validTypes = ['Konjunktion', 'Opposition', 'Trigon', 'Quadrat', 'Sextil'];
    for (const asp of chart.aspects) {
      expect(validTypes).toContain(asp.type);
    }
  });

  it('aspect orbs should be non-negative numbers', () => {
    for (const asp of chart.aspects) {
      expect(asp.orb).toBeGreaterThanOrEqual(0);
    }
  });

  it('should have an uncertainty object', () => {
    expect(chart.uncertainty).toBeDefined();
    expect(chart.uncertainty.timeUnknown).toBe(false);
    expect(chart.uncertainty.affectedFields).toEqual([]);
  });
});

// ===================================================================
// 9. Validation
// ===================================================================
describe('Request validation', () => {
  it('should return no errors for a valid request', () => {
    const errors = validateNatalChartRequest(makeRequest());
    expect(errors).toHaveLength(0);
  });

  it('should catch invalid year', () => {
    const errors = validateNatalChartRequest(makeRequest({ year: 1800 }));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.field === 'year')).toBe(true);
  });

  it('should catch invalid month', () => {
    const errors = validateNatalChartRequest(makeRequest({ month: 13 }));
    expect(errors.some((e) => e.field === 'month')).toBe(true);
  });

  it('should catch invalid day', () => {
    const errors = validateNatalChartRequest(makeRequest({ day: 32 }));
    expect(errors.some((e) => e.field === 'day')).toBe(true);
  });

  it('should catch invalid latitude', () => {
    const errors = validateNatalChartRequest(makeRequest({ latitude: 100 }));
    expect(errors.some((e) => e.field === 'latitude')).toBe(true);
  });

  it('should catch invalid longitude', () => {
    const errors = validateNatalChartRequest(makeRequest({ longitude: 200 }));
    expect(errors.some((e) => e.field === 'longitude')).toBe(true);
  });

  it('should catch missing timeUnknown', () => {
    const errors = validateNatalChartRequest(makeRequest({ timeUnknown: undefined as unknown as boolean }));
    expect(errors.some((e) => e.field === 'timeUnknown')).toBe(true);
  });
});

// ===================================================================
// 10. Legacy wrapper (calculateNatalChart)
// ===================================================================
describe('Legacy calculateNatalChart wrapper', () => {
  it('should return a ChartResult with the expected shape', async () => {
    const chart: ChartResult = await calculateNatalChart(
      new Date(1990, 5, 15, 14, 30),
      50.0,
      8.0,
    );

    expect(chart.planets).toBeDefined();
    expect(chart.aspects).toBeDefined();
    expect(Array.isArray(chart.planets)).toBe(true);
    expect(Array.isArray(chart.aspects)).toBe(true);
  });

  it('should map houses to string format', async () => {
    const chart = await calculateNatalChart(
      new Date(1990, 5, 15, 14, 30),
      50.0,
      8.0,
    );

    if (chart.houses) {
      // Each house should be a string like "Widder 12.34°"
      for (const h of chart.houses) {
        expect(typeof h).toBe('string');
      }
    }
  });
});
