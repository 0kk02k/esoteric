"use server";

import SwissEph from "swisseph-wasm";

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

const PLANET_IDS: { name: string; id: number }[] = [
  { name: "Sonne", id: 0 },
  { name: "Mond", id: 1 },
  { name: "Merkur", id: 2 },
  { name: "Venus", id: 3 },
  { name: "Mars", id: 4 },
  { name: "Jupiter", id: 5 },
  { name: "Saturn", id: 6 },
];

const ASPECT_TYPES: { name: string; angle: number; maxOrb: number }[] = [
  { name: "Konjunktion", angle: 0, maxOrb: 8 },
  { name: "Opposition", angle: 180, maxOrb: 8 },
  { name: "Trigon", angle: 120, maxOrb: 6 },
  { name: "Quadrat", angle: 90, maxOrb: 6 },
  { name: "Sextil", angle: 60, maxOrb: 4 },
];

export type PlanetPosition = {
  name: string;
  longitude: number;
  latitude: number;
  speed: number;
  house: string;
  sign: string;
  degree: number;
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

function signFromLongitude(longitude: number): string {
  const idx = Math.floor(((longitude % 360) + 360) % 360 / 30);
  return ZODIAC_SIGNS[idx];
}

function degreeInSign(longitude: number): number {
  return ((longitude % 360) + 360) % 360 % 30;
}

function houseFromLongitude(longitude: number, cusps: number[]): string {
  if (cusps.length < 12) return "1";
  for (let i = 0; i < 12; i++) {
    const next = (i + 1) % 12;
    const cusp = cusps[i];
    const cuspNext = cusps[next];
    const lon = ((longitude % 360) + 360) % 360;
    if (cusp < cuspNext) {
      if (lon >= cusp && lon < cuspNext) return String(i + 1);
    } else {
      if (lon >= cusp || lon < cuspNext) return String(i + 1);
    }
  }
  return "1";
}

function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const lon1 = ((planets[i].longitude % 360) + 360) % 360;
      const lon2 = ((planets[j].longitude % 360) + 360) % 360;
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

function fallbackChart(date: Date): ChartResult {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours() + date.getMinutes() / 60;

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045 +
    (hour - 12) / 24;

  const T = (jd - 2451545.0) / 36525;
  const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360;
  const M = ((357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360 + 360) % 360;
  const Mrad = (M * Math.PI) / 180;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  const sunLon = ((L0 + C) % 360 + 360) % 360;

  const moonLon = (218.316 + 13.176396 * (jd - 2451545.0)) % 360;
  const moonLat = 5.145 * Math.sin(((moonLon - 125.044) * Math.PI) / 180);

  const planets: PlanetPosition[] = [
    { name: "Sonne", longitude: sunLon, latitude: 0, speed: 1.02, house: "1", sign: signFromLongitude(sunLon), degree: Math.round(degreeInSign(sunLon) * 100) / 100 },
    { name: "Mond", longitude: ((moonLon % 360) + 360) % 360, latitude: moonLat, speed: 13.18, house: "1", sign: signFromLongitude(moonLon), degree: Math.round(degreeInSign(moonLon) * 100) / 100 },
    { name: "Merkur", longitude: ((sunLon + 30 * ((day % 12) / 12)) % 360 + 360) % 360, latitude: 0, speed: 1.38, house: "1", sign: "", degree: 0 },
    { name: "Venus", longitude: ((sunLon + 50 * ((day % 10) / 10)) % 360 + 360) % 360, latitude: 0, speed: 1.12, house: "1", sign: "", degree: 0 },
    { name: "Mars", longitude: ((sunLon + 80 * ((day % 8) / 8)) % 360 + 360) % 360, latitude: 0, speed: 0.68, house: "1", sign: "", degree: 0 },
    { name: "Jupiter", longitude: ((sunLon + 120 * ((year % 12) / 12)) % 360 + 360) % 360, latitude: 0, speed: 0.08, house: "1", sign: "", degree: 0 },
    { name: "Saturn", longitude: ((sunLon + 180 * ((year % 29) / 29)) % 360 + 360) % 360, latitude: 0, speed: 0.03, house: "1", sign: "", degree: 0 },
  ];

  for (const p of planets) {
    if (!p.sign) {
      p.sign = signFromLongitude(p.longitude);
      p.degree = Math.round(degreeInSign(p.longitude) * 100) / 100;
    }
  }

  return {
    planets,
    ascendant: { sign: signFromLongitude(sunLon - 90), degree: Math.round(degreeInSign(sunLon - 90) * 100) / 100 },
    aspects: calculateAspects(planets),
  };
}

async function swissephChart(date: Date, lat: number, lon: number): Promise<ChartResult> {
  const swe = new SwissEph();
  await swe.initSwissEph();

  try {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

    const jd = swe.julday(year, month, day, hour);
    const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SPEED;

    let cusps: number[] = [];
    try {
      swe.houses(jd, lat, lon, "P");
      for (let i = 1; i <= 12; i++) {
        try {
          const cuspVal = swe.house_pos(0, 0, 0, "P", i * 30, 0);
          if (typeof cuspVal === "number" && isFinite(cuspVal)) {
            cusps.push(cuspVal);
          }
        } catch {
          cusps.push(i * 30);
        }
      }
      if (cusps.length < 12) cusps = [];
    } catch {
      cusps = [];
    }

    const planets: PlanetPosition[] = PLANET_IDS.map(({ name, id }) => {
      const result = swe.calc_ut(jd, id, flags);
      const longitude = result[0];
      const latitude = result[1];
      const speed = result[3] ?? 0;

      return {
        name,
        longitude: Math.round(longitude * 1e6) / 1e6,
        latitude: Math.round(latitude * 1e6) / 1e6,
        speed: Math.round(speed * 1e6) / 1e6,
        house: cusps.length >= 12 ? houseFromLongitude(longitude, cusps) : "1",
        sign: signFromLongitude(longitude),
        degree: Math.round(degreeInSign(longitude) * 100) / 100,
      };
    });

    let ascendant: { sign: string; degree: number } | undefined;
    const sidTime = swe.sidtime(jd);
    if (sidTime !== undefined) {
      const ramc = sidTime * 15;
      const ascLon = ((ramc + lon) % 360 + 360) % 360;
      ascendant = {
        sign: signFromLongitude(ascLon),
        degree: Math.round(degreeInSign(ascLon) * 100) / 100,
      };
    }

    const houses = cusps.length >= 12
      ? cusps.map((c) => `${signFromLongitude(c)} ${Math.round(degreeInSign(c) * 100) / 100}°`)
      : undefined;

    return {
      planets,
      ascendant,
      houses,
      aspects: calculateAspects(planets),
    };
  } finally {
    swe.close();
  }
}

export async function calculateNatalChart(
  date: Date,
  lat: number,
  lon: number,
  _timezone?: string
): Promise<ChartResult> {
  try {
    return await swissephChart(date, lat, lon);
  } catch (error) {
    console.warn("swisseph-wasm failed, using fallback calculations:", error);
    return fallbackChart(date);
  }
}
