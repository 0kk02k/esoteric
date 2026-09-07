import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, api, toUserError } from '@/lib/api-client';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('api()', () => {
  it('löst bei HTTP-Fehlern einen ApiError mit Status und Payload aus', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'Daily limit reached' }), { status: 429 }),
    ));

    await expect(api('/api/readings', { method: 'POST' })).rejects.toMatchObject({
      name: 'ApiError',
      status: 429,
      message: 'Daily limit reached',
      payload: { error: 'Daily limit reached' },
    });
  });

  it('löst bei Netzfehler einen ApiError mit deutscher Verbindungsmeldung aus', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));

    await expect(api('/api/tarot/shuffle')).rejects.toSatisfy((err: unknown) => {
      return err instanceof ApiError && err.status === 0 && err.message.includes('Keine Verbindung');
    });
  });

  it('reicht AbortError unverändert durch (Abbruch ist kein Fehlerfall für die UI)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(
      new DOMException('The operation was aborted.', 'AbortError'),
    ));

    await expect(api('/api/readings')).rejects.toSatisfy((err: unknown) => {
      return err instanceof DOMException && err.name === 'AbortError';
    });
  });

  it('liefert JSON bei Erfolg', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ cardIds: ['a', 'b'] }), { status: 200 }),
    ));

    await expect(api<{ cardIds: string[] }>('/api/tarot/shuffle')).resolves.toEqual({
      cardIds: ['a', 'b'],
    });
  });
});

describe('toUserError()', () => {
  it('ordnet 429 mit followupsRemaining dem Follow-up-Limit zu', () => {
    const { kind, message } = toUserError(
      new ApiError('Follow-up limit reached', 429, { followupsRemaining: 0 }),
    );
    expect(kind).toBe('followupLimit');
    expect(message).toContain('Follow-up-Limit');
  });

  it('ordnet 429 ohne followupsRemaining dem Tageslimit zu', () => {
    const { kind } = toUserError(new ApiError('Daily limit reached', 429, {}));
    expect(kind).toBe('limit');
  });

  it('ordnet 5xx unserer Seite zu und beruhigt ohne Falschversprechen', () => {
    const { kind, message } = toUserError(new ApiError('Reading error: 500', 500));
    expect(kind).toBeNull();
    expect(message).toBe('Auf unserer Seite ist etwas schiefgegangen. Deine Auswahl ist sicher — versuche es gleich erneut.');
  });

  it('bleibt bei unbekannten 4xx ruhig und handlungsorientiert', () => {
    const { kind, message } = toUserError(new ApiError('Unexpected', 418));
    expect(kind).toBeNull();
    expect(message).toBe('Das hat nicht geklappt. Versuche es gleich erneut.');
  });

  it('behandelt unbekannte Fehlerquellen wie Generalsätze', () => {
    const { kind } = toUserError(new Error('irgendwas'));
    expect(kind).toBeNull();
  });
});
