import { describe, expect, it } from 'vitest';
import {
  particlesOfZone,
  particlePosInZone,
  pickIgnitedParticle,
  zoneOfParticle,
  type Particle,
} from '@/components/StellarField';

// 78 Karten-IDs wie im Feld (gridCols = 9, wie in generateParticles)
const CARD_IDS = Array.from({ length: 78 }, (_, i) => `card-${i + 1}`);

function makeParticles(cardIds: string[]): Particle[] {
  const gridCols = 9;
  const gridRows = Math.ceil(cardIds.length / gridCols);
  return cardIds.map((id, i) => {
    const col = i % gridCols;
    const row = Math.floor(i / gridCols);
    const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return {
      id,
      x: Math.max(4, Math.min(96, ((col + 0.5) / gridCols) * 100 + ((hash % 37) - 18) * 0.8)),
      y: Math.max(4, Math.min(96, ((row + 0.5) / gridRows) * 100 + ((hash % 29) - 14) * 0.8)),
      size: 3 + (hash % 5) * 0.5,
      brightness: 0.3 + (hash % 40) / 100,
    };
  });
}

describe('Zonen-Logik des Resonanzfelds', () => {
  const particles = makeParticles(CARD_IDS);

  it.each([false, true])('partitioniert alle 78 Lichter disjunkt in 3 nicht-leere Zonen (wide=%s)', (wide) => {
    const zones = [0, 1, 2].map((z) => particlesOfZone(particles, z, wide));
    const total = zones.reduce((sum, z) => sum + z.length, 0);
    expect(total).toBe(CARD_IDS.length);
    for (const zone of zones) expect(zone.length).toBeGreaterThan(0);
    const ids = zones.flat().map((p) => p.id);
    expect(new Set(ids).size).toBe(CARD_IDS.length);
  });

  it.each([false, true])('ordnet jedes Licht gültigen Zonen zu (wide=%s)', (wide) => {
    for (const p of particles) {
      expect(zoneOfParticle(p, wide)).toBeGreaterThanOrEqual(0);
      expect(zoneOfParticle(p, wide)).toBeLessThanOrEqual(2);
    }
  });

  it('zählt bei Bändern nach Y, bei Spalten nach X', () => {
    const bottomLeft: Particle = { id: 'x', x: 5, y: 90, size: 4, brightness: 0.5 };
    expect(zoneOfParticle(bottomLeft, false)).toBe(2); // unten → Impuls-Band
    expect(zoneOfParticle(bottomLeft, true)).toBe(0); // links → Gegenwart-Spalte
  });

  it.each([false, true])('wählt das entzündete Licht deterministisch und innerhalb der Zone (wide=%s)', (wide) => {
    for (let zone = 0; zone < 3; zone++) {
      const a = pickIgnitedParticle(particles, zone, wide);
      const b = pickIgnitedParticle(particles, zone, wide);
      expect(a).not.toBeNull();
      expect(b).toEqual(a);
      const zoneIds = new Set(particlesOfZone(particles, zone, wide).map((p) => p.id));
      expect(zoneIds.has(a!.id)).toBe(true);
    }
  });

  it('entzündete Lichter verschiedener Zonen sind nie dieselbe Karte', () => {
    for (const wide of [false, true]) {
      const lit = [0, 1, 2].map((z) => pickIgnitedParticle(particles, z, wide)!.id);
      expect(new Set(lit).size).toBe(3);
    }
  });

  it('liefert null für eine leere Zone statt zu crashen', () => {
    expect(pickIgnitedParticle([], 0, false)).toBeNull();
  });

  it.each([false, true])('rendert Licht-Positionen innerhalb ihrer Zone (0-100, wide=%s)', (wide) => {
    for (let zone = 0; zone < 3; zone++) {
      for (const p of particlesOfZone(particles, zone, wide)) {
        const pos = particlePosInZone(p, zone, wide);
        expect(pos.left).toBeGreaterThanOrEqual(-0.01);
        expect(pos.left).toBeLessThanOrEqual(100.01);
        expect(pos.top).toBeGreaterThanOrEqual(-0.01);
        expect(pos.top).toBeLessThanOrEqual(100.01);
      }
    }
  });
});
