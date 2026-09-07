import { describe, expect, it } from 'vitest';
import { constellationPoints } from '@/components/Constellation';

describe('constellationPoints', () => {
  it('ist deterministisch: gleiche IDs, gleiche Konstellation', () => {
    const ids = ['card-1', 'card-42', 'card-78'];
    expect(constellationPoints(ids)).toEqual(constellationPoints(ids));
  });

  it('unterscheidet sich für verschiedene Legungen', () => {
    const a = constellationPoints(['a', 'b', 'c']);
    const b = constellationPoints(['d', 'e', 'f']);
    expect(a).not.toEqual(b);
  });

  it('liefert max. drei Punkte innerhalb der Bühne', () => {
    const points = constellationPoints(['a', 'b', 'c', 'd', 'e']);
    expect(points).toHaveLength(3);
    for (const p of points) {
      expect(p.x).toBeGreaterThanOrEqual(9);
      expect(p.x).toBeLessThanOrEqual(111);
      expect(p.y).toBeGreaterThanOrEqual(9);
      expect(p.y).toBeLessThanOrEqual(47);
    }
  });

  it('kommt mit zwei Karten und kürzeren Eingaben zurecht', () => {
    expect(constellationPoints(['a', 'b'])).toHaveLength(2);
    expect(constellationPoints([])).toHaveLength(0);
  });
});
