import { describe, expect, it } from 'vitest';
import type { ChartResponse } from '../astrology';
import {
  buildDataLine,
  extractSymbols,
  makeTeaser,
  matchAspect,
  matchPlanet,
  parseSynthesisBlocks,
  preparePlaque,
  formatOrb,
} from '../astroPlaque';

const CHART: ChartResponse = {
  version: '3.0',
  source: 'swisseph',
  julianDay: 2447893.5,
  planets: [
    { name: 'Sonne', longitude: 130.2, latitude: 0, speed: 0.97, house: '5', sign: 'Löwe', degree: 10.2 },
    { name: 'Mond', longitude: 15.5, latitude: 0, speed: 13.1, house: '10', sign: 'Widder', degree: 15.5 },
    { name: 'Venus', longitude: 300.1, latitude: 0, speed: 1.1, house: '5', sign: 'Steinbock', degree: 0.1 },
    { name: 'Saturn', longitude: 302.0, latitude: 0, speed: 0.03, house: '6', sign: 'Steinbock', degree: 2.0 },
  ],
  ascendant: { sign: 'Krebs', degree: 12, longitude: 102 },
  houses: [],
  aspects: [
    { planet1: 'Venus', planet2: 'Saturn', type: 'Konjunktion', orb: 1.9 },
    { planet1: 'Sonne', planet2: 'Mond', type: 'Quadrat', orb: 5.3 },
  ],
  uncertainty: { timeUnknown: false, affectedFields: [] },
  calculatedAt: '2026-09-10T00:00:00.000Z',
};

const SYNTHESIS_BODY = `>> Sonne in Löwe

Dein Kern will gesehen werden. Nicht für das, was du leistest, sondern dafür, wer du bist. Das ist der Grundton deiner Frage nach Anerkennung.

>> Venus-Saturn-Konjunktion

Liebe braucht bei dir zuerst Beständigkeit. Verbindlichkeit ist deine Sprache der Zuneigung.`;

describe('parseSynthesisBlocks — Zerlegung des Synthese-Abschnitts', () => {
  it('zerlegt >>-Blöcke in Heading und Absätze', () => {
    const parsed = parseSynthesisBlocks(SYNTHESIS_BODY);
    expect(parsed.intro).toEqual([]);
    expect(parsed.blocks).toHaveLength(2);
    expect(parsed.blocks[0].heading).toBe('Sonne in Löwe');
    expect(parsed.blocks[0].paragraphs).toHaveLength(1);
    expect(parsed.blocks[0].paragraphs[0]).toContain('gesehen werden');
    expect(parsed.blocks[1].heading).toBe('Venus-Saturn-Konjunktion');
  });

  it('läuft mit mehreren Absätzen pro Block', () => {
    const parsed = parseSynthesisBlocks(
      '>> Mond in Widder\n\nErster Absatz.\n\nZweiter Absatz.',
    );
    expect(parsed.blocks[0].paragraphs).toEqual(['Erster Absatz.', 'Zweiter Absatz.']);
  });

  it('fasst Inhalt vor dem ersten >>-Block als intro', () => {
    const parsed = parseSynthesisBlocks(
      'Drei Linien zeichnen sich ab.\n\n>> Sonne in Löwe\n\nDein Kern will gesehen werden.',
    );
    expect(parsed.intro).toEqual(['Drei Linien zeichnen sich ab.']);
    expect(parsed.blocks).toHaveLength(1);
  });

  it('trimmt Heading und toleriert fehlendes Leerzeichen nach >>', () => {
    const parsed = parseSynthesisBlocks('>>Venus-Saturn-Konjunktion\n\nText.');
    expect(parsed.blocks[0].heading).toBe('Venus-Saturn-Konjunktion');
  });

  it('liefert bei Text ohne >>-Zeilen nur intro und keine Blöcke', () => {
    const parsed = parseSynthesisBlocks('Einfacher Absatz.\n\nNoch einer.');
    expect(parsed.intro).toEqual(['Einfacher Absatz.', 'Noch einer.']);
    expect(parsed.blocks).toEqual([]);
  });

  it('behandelt leeren Input als leeres Ergebnis', () => {
    expect(parseSynthesisBlocks('')).toEqual({ intro: [], blocks: [] });
  });
});

describe('makeTeaser — ersten Sätze als Teaser abspalten', () => {
  it('nimmt die ersten Sätze bis zur Grenze und legt den Rest ins Aufklappbare', () => {
    const lang = [
      'Erster Satz mit Aussage. Zweiter Satz mit mehr Kontext dazu. Dritter Satz, der noch Tiefe bringt. Vierter Satz mit Schlusspunkt.',
      'Folgender Absatz.',
    ];
    const { teaser, rest } = makeTeaser(lang);
    expect(teaser).toBe('Erster Satz mit Aussage. Zweiter Satz mit mehr Kontext dazu.');
    expect(rest[0]).toContain('Dritter Satz');
    expect(rest[1]).toBe('Folgender Absatz.');
  });

  it('nimmt einen kurzen ersten Absatz komplett und lässt Folgetherapie-Absätze im Rest', () => {
    const { teaser, rest } = makeTeaser(['Kurzer Satz.', 'Zweiter Absatz.']);
    expect(teaser).toBe('Kurzer Satz.');
    expect(rest).toEqual(['Zweiter Absatz.']);
  });

  it('bricht an der Satzgrenze und nicht mitten im Wort', () => {
    const { teaser } = makeTeaser(['Dies ist ein langer Satz. Noch ein langer Satz mit vielen Worten dahinter.']);
    expect(teaser.endsWith('.')).toBe(true);
    expect(teaser).toContain('langer Satz');
  });

  it('behandelt leere Eingabe als leeres Ergebnis', () => {
    expect(makeTeaser([])).toEqual({ teaser: '', rest: [] });
  });
});

describe('matchPlanet — Planet im Heading gegen das Chart matchen', () => {
  it('findet die Sonne mit Zeichen und Haus aus dem Chart', () => {
    const planet = matchPlanet('Sonne in Löwe', CHART);
    expect(planet?.name).toBe('Sonne');
    expect(planet?.sign).toBe('Löwe');
    expect(planet?.house).toBe('5');
  });

  it('matcht unabhängig von Groß-/Kleinschreibung', () => {
    expect(matchPlanet('sonne in löwe', CHART)?.name).toBe('Sonne');
  });

  it('matcht keine Teilwörter (Mondknoten ist nicht der Mond)', () => {
    expect(matchPlanet('Mondknoten im Widder', CHART)).toBeNull();
  });

  it('liefert null ohne Chart', () => {
    expect(matchPlanet('Sonne in Löwe', null)).toBeNull();
  });

  it('liefert null, wenn der Planet nicht im Chart steht', () => {
    const mini: ChartResponse = { ...CHART, planets: [] };
    expect(matchPlanet('Sonne in Löwe', mini)).toBeNull();
  });
});

describe('matchAspect — Aspekt im Heading gegen das Chart matchen', () => {
  it('findet Venus-Saturn-Konjunktion mit Orb', () => {
    const aspect = matchAspect('Venus-Saturn-Konjunktion', CHART);
    expect(aspect?.planet1).toBe('Venus');
    expect(aspect?.planet2).toBe('Saturn');
    expect(aspect?.orb).toBe(1.9);
  });

  it('matcht unabhängig von der Reihenfolge der Planeten', () => {
    expect(matchAspect('Saturn/Venus Konjunktion', CHART)?.orb).toBe(1.9);
  });

  it('liefert null, wenn der Aspekt nicht im Chart liegt', () => {
    expect(matchAspect('Venus-Mars-Sextil', CHART)).toBeNull();
  });

  it('liefert null ohne Chart', () => {
    expect(matchAspect('Venus-Saturn-Konjunktion', null)).toBeNull();
  });
});

describe('extractSymbols — beteiligte Symbole eines Headings', () => {
  it('liefert Planet und Zeichen bei einer Planetenposition', () => {
    expect(extractSymbols('Sonne in Löwe')).toEqual({ planets: ['Sonne'], sign: 'Löwe', aspectType: undefined });
  });

  it('liefert beide Planeten und den Aspekttyp bei einem Aspekt', () => {
    const symbols = extractSymbols('Venus-Saturn-Konjunktion');
    expect(symbols.planets).toEqual(['Venus', 'Saturn']);
    expect(symbols.aspectType).toBe('Konjunktion');
  });

  it('liefert leere Symbole bei unbekanntem Heading', () => {
    expect(extractSymbols('Thema ohne Bezug')).toEqual({ planets: [], sign: undefined, aspectType: undefined });
  });
});

describe('buildDataLine — exakte Datenzeile für die Plakette', () => {
  it('bildet Zeichen und Haus für einen Planeten ab', () => {
    expect(buildDataLine('Sonne in Löwe', CHART)).toBe('Löwe · Haus 5');
  });

  it('bildet den Orb für einen Aspekt ab', () => {
    expect(buildDataLine('Venus-Saturn-Konjunktion', CHART)).toBe('Orb 1,9°');
  });

  it('lässt das Haus weg, wenn das Chart keins liefert', () => {
    const mini: ChartResponse = {
      ...CHART,
      planets: [{ ...CHART.planets[0], house: '' }],
    };
    expect(buildDataLine('Sonne in Löwe', mini)).toBe('Löwe');
  });

  it('liefert null ohne Chart oder ohne Match', () => {
    expect(buildDataLine('Sonne in Löwe', null)).toBeNull();
    expect(buildDataLine('Thema ohne Bezug', CHART)).toBeNull();
  });
});

describe('formatOrb — Orb im deutschen Format', () => {
  it('formatiert mit Komma und einer Nachkommastelle', () => {
    expect(formatOrb(1.9)).toBe('Orb 1,9°');
    expect(formatOrb(5.34)).toBe('Orb 5,3°');
    expect(formatOrb(8)).toBe('Orb 8,0°');
  });
});

describe('preparePlaque — Aufbereitung eines >>-Blocks zur Plakette', () => {
  it('bereitet eine Planetenplakette mit Glyphe, Datenzeile und goldener Akzentfarbe auf', () => {
    const plaque = preparePlaque(
      { heading: 'Sonne in Löwe', paragraphs: ['Dein Kern will gesehen werden. Und zwar wirklich. Der Rest gehört hinter den Toggle.'] },
      CHART,
    );
    expect(plaque.glyph).toBe('☉');
    expect(plaque.dataLine).toBe('Löwe · Haus 5');
    expect(plaque.accent).toBe('gold');
    expect(plaque.symbols).toEqual(['Sonne', 'Löwe']);
    expect(plaque.teaser).toContain('gesehen werden');
    expect(plaque.rest.join(' ')).toContain('hinter den Toggle');
  });

  it('bereitet eine Aspektplakette mit kombinierter Glyphe und violetter Akzentfarbe auf', () => {
    const plaque = preparePlaque(
      { heading: 'Venus-Saturn-Konjunktion', paragraphs: ['Liebe braucht Beständigkeit. Das ist deine Sprache.'] },
      CHART,
    );
    expect(plaque.glyph).toBe('♀☌♄');
    expect(plaque.dataLine).toBe('Orb 1,9°');
    expect(plaque.accent).toBe('violet');
    expect(plaque.symbols).toEqual(['Venus', 'Saturn', 'Konjunktion']);
  });

  it('lässt Glyphe und Datenzeile weg, wenn nichts matcht (kein erfundener Inhalt)', () => {
    const plaque = preparePlaque(
      { heading: 'Thema ohne Bezug', paragraphs: ['Ein Satz. Noch einer.'] },
      CHART,
    );
    expect(plaque.glyph).toBeUndefined();
    expect(plaque.dataLine).toBeNull();
    expect(plaque.accent).toBe('gold');
    expect(plaque.symbols).toEqual([]);
  });

  it('degradiert ohne Chart auf Plakette ohne Datenzeile', () => {
    const plaque = preparePlaque(
      { heading: 'Sonne in Löwe', paragraphs: ['Dein Kern.'] },
      null,
    );
    expect(plaque.glyph).toBe('☉');
    expect(plaque.dataLine).toBeNull();
  });
});
