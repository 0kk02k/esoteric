import { describe, expect, it } from 'vitest';
import { buildChatRequestBody, type ChatMessage } from '../ai';

const MESSAGES: ChatMessage[] = [{ role: 'user', content: 'Frage: test' }];

describe('buildChatRequestBody — Denkphase-Steuerung für Kimi K3', () => {
  it('schaltet die Denkphase bei deep:false über chat_template_kwargs ab', () => {
    const body = buildChatRequestBody(MESSAGES, { maxTokens: 1000, deep: false });
    expect(body.chat_template_kwargs).toEqual({ thinking: false });
    expect(body.max_tokens).toBe(1000);
    expect(body.model).toBe('moonshotai/Kimi-K3');
  });

  it('lässt bei deep:true die Denkphase an (kein Abschalt-Parameter)', () => {
    const body = buildChatRequestBody(MESSAGES, { maxTokens: 8192, deep: true });
    expect(body.chat_template_kwargs).toBeUndefined();
  });

  it('trägt die Nachrichten unverändert', () => {
    const body = buildChatRequestBody(MESSAGES, { maxTokens: 10, deep: true });
    expect(body.messages).toEqual(MESSAGES);
  });
});
