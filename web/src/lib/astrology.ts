// ---------------------------------------------------------------------------
// ESO Astrology Service v3.0
// Production-grade natal chart, house, aspect, and transit calculations.
// Primary: swisseph-wasm.  Fallback: simplified astronomical formulas.
// ---------------------------------------------------------------------------

import SwissEph from "swisseph-wasm";

// ========================= Constants =========================================

export const CALCULATION_VERSION = "3.0";

const ZODIAC_SIGNS = [
  "Widder",
  "Stier",
  "Zwillinge",
  "Krebs",
  "Löwe",
  "Jungfrau",
  "Waage",
  "Skorpion",
  "Schütze",
  "Steinbock",
  "Wassermann",
  "Fische",
] as const;

type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

const PLANET_DEFS: { name: string; id: number; avgDailyMotion: number }[] = [
  { name: "Sonne", id: 0, avgDailyMotion: 0.98 },
  { name: "Mond", id: 1, avgDailyMotion: 13.18 },
  { name: "Merkur", id: 2, avgDailyMotion: 1.38 },
  { name: "Venus", id: 3, avgDailyMotion: 1.12 },
  { name: "Mars", id: 4, avgDailyMotion: 0.68 },
  { name: "Jupiter", id: 5, avgDailyMotion: 0.08 },
  { name: "Saturn", id: 6, avgDailyMotion: 0.03 },
];

const ASPECT_TYPES: { name: string; angle: number; maxOrb: number }[] = [
  { name: "Konjunktion", angle: 0, maxOrb: 8 },
  { name: "Opposition", angle: 180, maxOrb: 8 },
  { name: "Trigon", angle: 120, maxOrb: 6 },
  { name: "Quadrat", angle: 90, maxOrb: 6 },
  { name: "Sextil", angle: 60, maxOrb: 4 },
];

// Swiss Ephemeris flags
const SEFLG_SWIEPH = 2;
const SEFLG_SPEED = 256;

// ========================= Types ============================================

// --- Backward-compatible aliases (kept so existing callers compile) ---------

export type PlanetPosition = {
  name: string;
  longitude: number;
  latitude: number;
  speed: number;
  house: string;
  sign: string;
  degree: number;
  error?: boolean;
  errorMessage?: string;
};

export type Aspect = {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
};

export type ChartResult = {
  planets: PlanetPosition[];
  ascendant?: { sign: string; degree: number };
  houses?: string[];
  aspects: Aspect[];
};

// --- New v3 types -----------------------------------------------------------

export type NatalChartRequest = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezoneOffset: number; // hours from UTC, e.g. +1 for CET
  timeUnknown: boolean;
};

export type AscendantData = {
  longitude: number;
  sign: ZodiacSign;
  degree: number;
};

export type HouseData = {
  number: number;
  cuspLongitude: number;
  sign: ZodiacSign;
  degree: number;
};

export type UncertaintyInfo = {
  timeUnknown: boolean;
  affectedFields: string[];
  notes?: string;
};

export type ChartResponse = {
  version: string;
  source: "swisseph" | "fallback";
  julianDay: number;
  planets: PlanetPosition[];
  ascendant?: AscendantData;
  houses?: HouseData[];
  aspects: Aspect[];
  uncertainty: UncertaintyInfo;
  calculatedAt: string;
};

export type Transit = {
  transitingPlanet: string;
  natalPlanet: string;
  type: string;
  orb: number;
  exactAngle: number;
  applying: boolean;
};

// ========================= Utility helpers ==================================

/** Normalise any angle to [0, 360). */
function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function signFromLongitude(longitude: number): ZodiacSign {
  const idx = Math.floor(norm360(longitude) / 30);
  return ZODIAC_SIGNS[idx];
}

function degreeInSign(longitude: number): number {
  return norm360(longitude) % 30;
}

function houseFromLongitude(longitude: number, cusps: number[]): string {
  if (cusps.length < 12) return "1";
  for (let i = 0; i < 12; i++) {
    const next = (i + 1) % 12;
    const cusp = cusps[i];
    const cuspNext = cusps[next];
    const lon = norm360(longitude);
    if (cusp < cuspNext) {
      if (lon >= cusp && lon < cuspNext) return String(i + 1);
    } else {
      if (lon >= cusp || lon < cuspNext) return String(i + 1);
    }
  }
  return "1";
}

// ========================= Julian Day =======================================

function dateToJulianDay(
  year: number,
  month: number,
  day: number,
  utHour: number
): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045 +
    (utHour - 12) / 24
  );
}

// ========================= Aspect calculation ===============================

function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  for (let i = 0; i < planets.length; i++) {
    if (planets[i].error) continue;
    for (let j = i + 1; j < planets.length; j++) {
      if (planets[j].error) continue;
      const lon1 = norm360(planets[i].longitude);
      const lon2 = norm360(planets[j].longitude);
      let diff = Math.abs(lon1 - lon2);
      if (diff > 180) diff = 360 - diff;
      for (const at of ASPECT_TYPES) {
        const orb = Math.abs(diff - at.angle);
        if (orb <= at.maxOrb) {
          aspects.push({
            planet1: planets[i].name,
            planet2: planets[j].name,
            type: at.name,
            orb: Math.round(orb * 100) / 100,
          });
        }
      }
    }
  }
  return aspects;
}

// ========================= Transit calculation ==============================

export function calculateTransits(
  natalChart: ChartResponse,
  referenceDate: Date
): Transit[] {
  const transits: Transit[] = [];

  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth() + 1;
  const day = referenceDate.getDate();
  const utHour =
    referenceDate.getUTCHours() +
    referenceDate.getUTCMinutes() / 60 +
    referenceDate.getUTCSeconds() / 3600;
  const jd = dateToJulianDay(year, month, day, utHour);

  // Use fallback positions for transit planets (avoids async wasm in this fn)
  const transitPositions = fallbackPlanetPositions(jd);

  for (const tp of transitPositions) {
    for (const np of natalChart.planets) {
      if (np.error) continue;
      const diff = Math.abs(norm360(tp.longitude) - norm360(np.longitude));
      const shortestArc = diff > 180 ? 360 - diff : diff;

      for (const at of ASPECT_TYPES) {
        const orb = Math.abs(shortestArc - at.angle);
        if (orb <= at.maxOrb) {
          // Applying: transiting planet moves toward exact aspect
          const speedDiff = tp.speed - np.speed;
          const applying =
            speedDiff > 0
              ? shortestArc - at.angle > 0
                ? speedDiff > 0
                : speedDiff < 0
              : false;

          transits.push({
            transitingPlanet: tp.name,
            natalPlanet: np.name,
            type: at.name,
            orb: Math.round(orb * 100) / 100,
            exactAngle: at.angle,
            applying,
          });
        }
      }
    }
  }

  return transits;
}

// ========================= Fallback calculations ============================

function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = (M * Math.PI) / 180;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  return norm360(L0 + C);
}

function moonLongitude(jd: number): number {
  return norm360(218.316 + 13.176396 * (jd - 2451545.0));
}

function moonLatitude(jd: number): number {
  const lon = moonLongitude(jd);
  return 5.145 * Math.sin(((lon - 125.044) * Math.PI) / 180);
}

/** Returns approximate planetary positions for a given Julian Day. */
function fallbackPlanetPositions(
  jd: number
): { name: string; longitude: number; latitude: number; speed: number }[] {
  const T = (jd - 2451545.0) / 36525;
  const sun = sunLongitude(jd);
  const centuriesSinceJ2000 = (jd - 2451545.0) / 36525;

  // Approximate mean longitudes (in degrees) for the epoch, relative to Sun
  // These are simplified but produce reasonable zodiac sign placements
  const mercuryLon = norm360(sun + 25.0 * Math.sin(T * 365.25 * 0.085));
  const venusLon = norm360(sun + 50.0 * Math.sin(T * 365.25 * 0.062));
  const marsLon = norm360(sun + 80.0 * Math.sin(T * 365.25 * 0.046));
  const jupiterLon = norm360(34.35 + 3034.9057 * centuriesSinceJ2000);
  const saturnLon = norm360(49.94 + 1222.1138 * centuriesSinceJ2000);

  return [
    { name: "Sonne", longitude: sun, latitude: 0, speed: 0.98 },
    {
      name: "Mond",
      longitude: moonLongitude(jd),
      latitude: moonLatitude(jd),
      speed: 13.18,
    },
    { name: "Merkur", longitude: mercuryLon, latitude: 0, speed: 1.38 },
    { name: "Venus", longitude: venusLon, latitude: 0, speed: 1.12 },
    { name: "Mars", longitude: marsLon, latitude: 0, speed: 0.68 },
    { name: "Jupiter", longitude: jupiterLon, latitude: 0, speed: 0.08 },
    { name: "Saturn", longitude: saturnLon, latitude: 0, speed: 0.03 },
  ];
}

function fallbackChartFull(
  jd: number,
  _lat: number,
  _lon: number,
  timeUnknown: boolean
): ChartResponse {
  const rawPlanets = fallbackPlanetPositions(jd);

  const planets: PlanetPosition[] = rawPlanets.map((p) => ({
    name: p.name,
    longitude: Math.round(p.longitude * 1e6) / 1e6,
    latitude: Math.round(p.latitude * 1e6) / 1e6,
    speed: Math.round(p.speed * 1e6) / 1e6,
    house: "1",
    sign: signFromLongitude(p.longitude),
    degree: Math.round(degreeInSign(p.longitude) * 100) / 100,
  }));

  // Fallback ascendant from Sun (very approximate: sunrise asc ~ sun - 90)
  let ascendant: AscendantData | undefined;
  if (!timeUnknown) {
    const ascLon = norm360(sunLongitude(jd) - 90);
    ascendant = {
      longitude: Math.round(ascLon * 1e6) / 1e6,
      sign: signFromLongitude(ascLon),
      degree: Math.round(degreeInSign(ascLon) * 100) / 100,
    };
  }

  const uncertainty: UncertaintyInfo = timeUnknown
    ? {
        timeUnknown: true,
        affectedFields: ["ascendant", "houses", "housePositions"],
        notes: "Geburtszeit unbekannt. Ascendant und Haeuser sind nicht verfuegbar. Mond bewegt sich ca. 13 Grad/Tag.",
      }
    : { timeUnknown: false, affectedFields: [] };

  return {
    version: CALCULATION_VERSION,
    source: "fallback",
    julianDay: jd,
    planets,
    ascendant,
    houses: undefined,
    aspects: calculateAspects(planets),
    uncertainty,
    calculatedAt: new Date().toISOString(),
  };
}

// ========================= Swiss Ephemeris ==================================

async function swissephChart(
  jd: number,
  lat: number,
  lon: number,
  timeUnknown: boolean
): Promise<ChartResponse> {
  let swe: InstanceType<typeof SwissEph> | null = null;
  try {
    swe = new SwissEph();
    await swe.initSwissEph();

    // --- Houses (Placidus) ---------------------------------------------------
    let cusps: number[] = [];
    let ascLongitude: number | undefined;
    let mcLongitude: number | undefined;

    if (!timeUnknown) {
      try {
        // The type declarations say houses() returns number, but at runtime
        // it returns { cusps: Float64Array, ascmc: Float64Array }.
        const houseResult = swe.houses(jd, lat, lon, "P") as unknown as {
          cusps: Float64Array;
          ascmc: Float64Array;
        };
        if (houseResult?.cusps) {
          // cusps[0] is a sentinel; cusps[1..12] are the 12 house cusps
          for (let i = 1; i <= 12; i++) {
            const val = houseResult.cusps[i];
            if (typeof val === "number" && isFinite(val)) {
              cusps.push(norm360(val));
            }
          }
        }
        if (houseResult?.ascmc) {
          ascLongitude = houseResult.ascmc[0]; // Ascendant
          mcLongitude = houseResult.ascmc[1]; // MC (Medium Coeli)
        }
      } catch (houseErr) {
        console.warn("House calculation failed:", houseErr);
        cusps = [];
      }
    }

    // --- Planets --------------------------------------------------------------
    const planets: PlanetPosition[] = PLANET_DEFS.map(({ name, id }) => {
      try {
        // calc_ut returns Float64Array: [longitude, latitude, distance, speedLong, speedLat, speedDist]
        const result = swe!.calc_ut(jd, id, SEFLG_SWIEPH | SEFLG_SPEED) as Float64Array;
        const longitude = result[0];
        const latitude = result[1];
        const speed = result[3] ?? 0;

        return {
          name,
          longitude: Math.round(longitude * 1e6) / 1e6,
          latitude: Math.round(latitude * 1e6) / 1e6,
          speed: Math.round(speed * 1e6) / 1e6,
          house:
            cusps.length >= 12
              ? houseFromLongitude(longitude, cusps)
              : "1",
          sign: signFromLongitude(longitude),
          degree: Math.round(degreeInSign(longitude) * 100) / 100,
        };
      } catch (planetErr) {
        const msg =
          planetErr instanceof Error ? planetErr.message : String(planetErr);
        console.warn(`Planet ${name} (id=${id}) failed:`, msg);
        return {
          name,
          longitude: 0,
          latitude: 0,
          speed: 0,
          house: "?",
          sign: "?" as ZodiacSign,
          degree: 0,
          error: true,
          errorMessage: `Berechnung fehlgeschlagen: ${msg}`,
        };
      }
    });

    // --- Ascendant ------------------------------------------------------------
    let ascendant: AscendantData | undefined;
    if (
      !timeUnknown &&
      typeof ascLongitude === "number" &&
      isFinite(ascLongitude)
    ) {
      ascendant = {
        longitude: Math.round(norm360(ascLongitude) * 1e6) / 1e6,
        sign: signFromLongitude(ascLongitude),
        degree: Math.round(degreeInSign(ascLongitude) * 100) / 100,
      };
    }

    // --- Houses ---------------------------------------------------------------
    let houses: HouseData[] | undefined;
    if (cusps.length >= 12) {
      houses = cusps.map((cuspLon, idx) => ({
        number: idx + 1,
        cuspLongitude: Math.round(cuspLon * 1e6) / 1e6,
        sign: signFromLongitude(cuspLon),
        degree: Math.round(degreeInSign(cuspLon) * 100) / 100,
      }));
    }

    const uncertainty: UncertaintyInfo = timeUnknown
      ? {
          timeUnknown: true,
          affectedFields: ["ascendant", "houses", "housePositions"],
          notes: "Geburtszeit unbekannt. Ascendant und Haeuser sind nicht verfuegbar. Mond bewegt sich ca. 13 Grad/Tag.",
        }
      : { timeUnknown: false, affectedFields: [] };

    return {
      version: CALCULATION_VERSION,
      source: "swisseph",
      julianDay: jd,
      planets,
      ascendant,
      houses,
      aspects: calculateAspects(planets),
      uncertainty,
      calculatedAt: new Date().toISOString(),
    };
  } finally {
    try {
      swe?.close();
    } catch {
      // ignore close errors
    }
  }
}

// ========================= Caching ==========================================

interface CacheEntry {
  response: ChartResponse;
  expiresAt: number; // epoch ms
}

const chartCache = new Map<string, CacheEntry>();
const CACHE_MAX_ENTRIES = 100;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function cacheKey(req: NatalChartRequest): string {
  return [
    req.year,
    req.month,
    req.day,
    req.hour,
    req.minute,
    req.latitude.toFixed(4),
    req.longitude.toFixed(4),
    req.timezoneOffset,
    req.timeUnknown ? 1 : 0,
  ].join("|");
}

function evictExpired(): void {
  const now = Date.now();
  for (const [k, v] of chartCache) {
    if (v.expiresAt <= now) {
      chartCache.delete(k);
    }
  }
}

function getFromCache(key: string): ChartResponse | undefined {
  const entry = chartCache.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    chartCache.delete(key);
    return undefined;
  }
  return entry.response;
}

function setCache(key: string, response: ChartResponse): void {
  evictExpired();
  if (chartCache.size >= CACHE_MAX_ENTRIES) {
    // Evict oldest entry (first inserted)
    const firstKey = chartCache.keys().next().value;
    if (firstKey !== undefined) chartCache.delete(firstKey);
  }
  chartCache.set(key, {
    response,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/** Clear the chart cache. Useful for testing. */
export function clearChartCache(): void {
  chartCache.clear();
}

// ========================= Validation =======================================

export type ValidationError = { field: string; message: string };

export function validateNatalChartRequest(
  req: Partial<NatalChartRequest>
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof req.year !== "number" || req.year < 1900 || req.year > 2100) {
    errors.push({
      field: "year",
      message: "Jahr muss zwischen 1900 und 2100 liegen.",
    });
  }
  if (typeof req.month !== "number" || req.month < 1 || req.month > 12) {
    errors.push({
      field: "month",
      message: "Monat muss zwischen 1 und 12 liegen.",
    });
  }
  if (typeof req.day !== "number" || req.day < 1 || req.day > 31) {
    errors.push({
      field: "day",
      message: "Tag muss zwischen 1 und 31 liegen.",
    });
  }
  if (typeof req.hour !== "number" || req.hour < 0 || req.hour > 23) {
    errors.push({
      field: "hour",
      message: "Stunde muss zwischen 0 und 23 liegen.",
    });
  }
  if (typeof req.minute !== "number" || req.minute < 0 || req.minute > 59) {
    errors.push({
      field: "minute",
      message: "Minute muss zwischen 0 und 59 liegen.",
    });
  }
  if (
    typeof req.latitude !== "number" ||
    req.latitude < -90 ||
    req.latitude > 90
  ) {
    errors.push({
      field: "latitude",
      message: "Breitengrad muss zwischen -90 und 90 liegen.",
    });
  }
  if (
    typeof req.longitude !== "number" ||
    req.longitude < -180 ||
    req.longitude > 180
  ) {
    errors.push({
      field: "longitude",
      message: "Laengengrad muss zwischen -180 und 180 liegen.",
    });
  }
  if (
    typeof req.timezoneOffset !== "number" ||
    req.timezoneOffset < -12 ||
    req.timezoneOffset > 14
  ) {
    errors.push({
      field: "timezoneOffset",
      message: "Zeitzonen-Offset muss zwischen -12 und +14 liegen.",
    });
  }
  if (typeof req.timeUnknown !== "boolean") {
    errors.push({
      field: "timeUnknown",
      message: "timeUnknown muss true oder false sein.",
    });
  }

  return errors;
}

// ========================= Main entry point =================================

/**
 * Calculate a full natal chart from a `NatalChartRequest`.
 * Uses swisseph-wasm when available, falls back to simplified formulas.
 * Results are cached in-memory for up to 1 hour (max 100 entries).
 */
export async function calculateNatalChartFromRequest(
  req: NatalChartRequest
): Promise<ChartResponse> {
  // Check cache
  const key = cacheKey(req);
  const cached = getFromCache(key);
  if (cached) return cached;

  // Convert local birth time to UTC using the offset
  const localHourDecimal = req.hour + req.minute / 60;
  const utcHourDecimal = localHourDecimal - req.timezoneOffset;

  // Determine the UTC date components (may cross day boundary)
  const utcDate = new Date(
    Date.UTC(req.year, req.month - 1, req.day, 0, 0, 0)
  );
  utcDate.setUTCHours(
    Math.floor(utcHourDecimal),
    Math.round((utcHourDecimal % 1) * 60)
  );

  const jd = dateToJulianDay(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth() + 1,
    utcDate.getUTCDate(),
    utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60
  );

  let response: ChartResponse;

  try {
    response = await swissephChart(
      jd,
      req.latitude,
      req.longitude,
      req.timeUnknown
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(
      `swisseph-wasm failed, using fallback calculations: ${msg}`
    );
    response = fallbackChartFull(
      jd,
      req.latitude,
      req.longitude,
      req.timeUnknown
    );
  }

  setCache(key, response);
  return response;
}

// ========================= Backward-compatible wrapper ======================

/**
 * Legacy wrapper kept for backward compatibility with existing callers.
 * Prefer `calculateNatalChartFromRequest` for new code.
 */
export async function calculateNatalChart(
  date: Date,
  lat: number,
  lon: number,
  _timezone?: string
): Promise<ChartResult> {
  const req: NatalChartRequest = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    latitude: lat,
    longitude: lon,
    timezoneOffset: -(date.getTimezoneOffset() / 60),
    timeUnknown: false,
  };

  const chart = await calculateNatalChartFromRequest(req);

  return {
    planets: chart.planets,
    ascendant: chart.ascendant
      ? { sign: chart.ascendant.sign, degree: chart.ascendant.degree }
      : undefined,
    houses: chart.houses?.map((h) => `${h.sign} ${h.degree}°`),
    aspects: chart.aspects,
  };
}
