import { describe, expect, it } from 'vitest';
import { ASPECT_TYPES, PLANET_NAMES, ZODIAC_SIGNS } from '../astroPlaque';
import { aspectGlyph, planetGlyph, signGlyph } from '../astroGlyphs';

describe('astroGlyphs — Deckung mit den kanonischen Namen', () => {
  it('hat für jeden der sieben Planeten eine Glyphe', () => {
    for (const name of PLANET_NAMES) {
      expect(planetGlyph(name), `${name} braucht eine Glyphe`).not.toBe('');
    }
  });

  it('hat für jedes der zwölf Zeichen eine Glyphe', () => {
    for (const name of ZODIAC_SIGNS) {
      expect(signGlyph(name), `${name} braucht eine Glyphe`).not.toBe('');
    }
  });

  it('hat für jeden der fünf Aspekttypen eine Glyphe', () => {
    for (const name of ASPECT_TYPES) {
      expect(aspectGlyph(name), `${name} braucht eine Glyphe`).not.toBe('');
    }
  });

  it('liefert für unbekannte Namen einen leeren String (keine Ersatzzeichen)', () => {
    expect(planetGlyph('Chiron')).toBe('');
    expect(signGlyph('Schlangenträger')).toBe('');
    expect(aspectGlyph('Quincunx')).toBe('');
  });
});
