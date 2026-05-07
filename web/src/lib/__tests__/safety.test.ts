import { describe, it, expect } from 'vitest';
import { classifyInput, checkOutput, CRISIS_RESPONSE_DE } from '@/lib/safety';

// ===================================================================
// 1. Crisis Detection
// ===================================================================
describe('Crisis Detection', () => {
  it('should trigger crisis_response for "Ich will nicht mehr leben"', () => {
    const result = classifyInput('Ich will nicht mehr leben');
    expect(result.action).toBe('crisis_response');
  });

  it('should trigger crisis_response for "Wie kann ich mich umbringen"', () => {
    const result = classifyInput('Wie kann ich mich umbringen');
    expect(result.action).toBe('crisis_response');
  });

  it('should trigger crisis_response for "suizid gedanken"', () => {
    const result = classifyInput('suizid gedanken');
    expect(result.action).toBe('crisis_response');
  });

  it('should trigger crisis_response for "Ich wurde vergewaltigt"', () => {
    const result = classifyInput('Ich wurde vergewaltigt');
    expect(result.action).toBe('crisis_response');
  });

  it('should trigger crisis_response for "kill myself tonight"', () => {
    const result = classifyInput('kill myself tonight');
    expect(result.action).toBe('crisis_response');
  });

  it('should assign critical severity for crisis inputs', () => {
    const result = classifyInput('Ich will nicht mehr leben');
    expect(result.severity).toBe('critical');
  });

  it('should assign crisis category for crisis inputs', () => {
    const result = classifyInput('Ich will nicht mehr leben');
    expect(result.category).toBe('crisis');
  });
});

// ===================================================================
// 2. Medical Redirect
// ===================================================================
describe('Medical Redirect', () => {
  it('should redirect strong chest pain question to medical', () => {
    const result = classifyInput(
      'Ich habe starke Brustschmerzen, was soll ich tun?',
    );
    expect(result.action).toBe('redirect');
    expect(result.category).toBe('medical');
  });

  it('should redirect medication question to medical', () => {
    const result = classifyInput(
      'Welche Medikamente helfen gegen meine Depression?',
    );
    expect(result.action).toBe('redirect');
    expect(result.category).toBe('medical');
  });

  it('should redirect self-diagnosis question to medical', () => {
    const result = classifyInput(
      'Meine Symptome deuten auf Diabetes hin',
    );
    expect(result.action).toBe('redirect');
    expect(result.category).toBe('medical');
  });

  it('should redirect doctor visit question to medical', () => {
    const result = classifyInput('Soll ich einen Arzt aufsuchen?');
    expect(result.action).toBe('redirect');
    expect(result.category).toBe('medical');
  });
});

// ===================================================================
// 3. Legal Redirect
// ===================================================================
describe('Legal Redirect', () => {
  it('should redirect neighbor lawsuit question to legal', () => {
    const result = classifyInput('Soll ich meinen Nachbarn verklagen?');
    expect(result.action).toBe('redirect');
    expect(result.category).toBe('legal');
  });

  it('should redirect divorce question to legal', () => {
    const result = classifyInput('Wie kann ich mich scheiden lassen?');
    expect(result.action).toBe('redirect');
    expect(result.category).toBe('legal');
  });

  it('should redirect inheritance law question to legal', () => {
    const result = classifyInput('Was sagt das Erbrecht dazu?');
    expect(result.action).toBe('redirect');
    expect(result.category).toBe('legal');
  });
});

// ===================================================================
// 4. Financial Redirect
// ===================================================================
describe('Financial Redirect', () => {
  it('should redirect crypto investment question to financial', () => {
    const result = classifyInput('Soll ich in Krypto investieren?');
    expect(result.action).toBe('redirect');
    expect(result.category).toBe('financial');
  });

  it('should redirect stock purchase question to financial', () => {
    const result = classifyInput('Welche Aktien soll ich kaufen?');
    expect(result.action).toBe('redirect');
    expect(result.category).toBe('financial');
  });

  it('should redirect tax advice question to financial', () => {
    const result = classifyInput('Brauche ich eine Steuerberatung?');
    expect(result.action).toBe('redirect');
    expect(result.category).toBe('financial');
  });
});

// ===================================================================
// 5. Deterministic Flagging
// ===================================================================
describe('Deterministic Flagging', () => {
  it('should proceed with medium severity for marriage prediction', () => {
    const result = classifyInput('Wird er mich heiraten?');
    expect(result.action).toBe('proceed');
    expect(result.severity).toBe('medium');
  });

  it('should proceed with medium severity for wealth prediction', () => {
    const result = classifyInput('Wann werde ich reich?');
    expect(result.action).toBe('proceed');
    expect(result.severity).toBe('medium');
  });
});

// ===================================================================
// 6. Normal Questions
// ===================================================================
describe('Normal Questions', () => {
  it('should allow general life-phase question', () => {
    const result = classifyInput(
      'Was bedeutet dieser neue Lebensabschnitt für mich?',
    );
    expect(result.action).toBe('proceed');
    expect(result.category).toBe('normal');
  });

  it('should allow stress management question', () => {
    const result = classifyInput('Wie kann ich besser mit Stress umgehen?');
    expect(result.action).toBe('proceed');
  });

  it('should allow horoscope relationship question', () => {
    const result = classifyInput(
      'Was sagt mein Horoskop über meine Beziehung?',
    );
    expect(result.action).toBe('proceed');
  });

  it('should allow career orientation question', () => {
    const result = classifyInput('Ich suche Orientierung in meinem Beruf');
    expect(result.action).toBe('proceed');
  });

  it('should allow spiritual development question', () => {
    const result = classifyInput(
      'Wie kann ich mich spirituell weiterentwickeln?',
    );
    expect(result.action).toBe('proceed');
  });

  it('should assign none severity for normal questions', () => {
    const result = classifyInput(
      'Was bedeutet dieser neue Lebensabschnitt für mich?',
    );
    expect(result.severity).toBe('none');
  });
});

// ===================================================================
// 7. Output Check
// ===================================================================
describe('Output Check', () => {
  it('should flag output urging user to quit their job', () => {
    const result = checkOutput(
      'das Universum will dass du jetzt kündigst und alles hinter dir lässt',
    );
    expect(result.passed).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('should flag output urging user to leave their partner', () => {
    const result = checkOutput(
      'du musst sofort deinen Partner verlassen, es gibt keinen anderen Weg',
    );
    expect(result.passed).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  it('should pass clean astrological output', () => {
    const result = checkOutput(
      'Diese Karte kann auf Transformation hindeuten. Es ist eine Zeit des Wachstums.',
    );
    expect(result.passed).toBe(true);
  });

  it('should return empty issues array for clean output', () => {
    const result = checkOutput(
      'Diese Karte kann auf Transformation hindeuten',
    );
    expect(result.issues).toHaveLength(0);
  });

  it('should provide sanitized text when issues are found', () => {
    const result = checkOutput(
      'du musst sofort deinen Partner verlassen',
    );
    expect(result.passed).toBe(false);
    expect(result.sanitizedText).toBeDefined();
  });
});

// ===================================================================
// 8. Crisis Response Constant
// ===================================================================
describe('CRISIS_RESPONSE_DE constant', () => {
  it('should contain the German crisis hotline number 0800/111 0 111', () => {
    expect(CRISIS_RESPONSE_DE).toContain('0800/111 0 111');
  });

  it('should be a non-empty string', () => {
    expect(typeof CRISIS_RESPONSE_DE).toBe('string');
    expect(CRISIS_RESPONSE_DE.length).toBeGreaterThan(0);
  });
});

// ===================================================================
// 9. Return Shape Validation
// ===================================================================
describe('classifyInput return shape', () => {
  it('should return all required fields for a normal input', () => {
    const result = classifyInput('Wie kann ich mich spirituell weiterentwickeln?');
    expect(result).toHaveProperty('allowed');
    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('severity');
    expect(result).toHaveProperty('action');
    expect(result).toHaveProperty('reason');
    expect(typeof result.allowed).toBe('boolean');
    expect(typeof result.category).toBe('string');
    expect(typeof result.severity).toBe('string');
    expect(typeof result.action).toBe('string');
    expect(typeof result.reason).toBe('string');
  });

  it('should return valid category values', () => {
    const validCategories = [
      'normal', 'medical', 'legal', 'financial',
      'crisis', 'relationship_intense', 'spiritual_emergency',
    ];
    const result = classifyInput('Eine ganz normale Frage');
    expect(validCategories).toContain(result.category);
  });

  it('should return valid action values', () => {
    const validActions = ['proceed', 'redirect', 'block', 'crisis_response'];
    const result = classifyInput('Eine ganz normale Frage');
    expect(validActions).toContain(result.action);
  });

  it('should return valid severity values', () => {
    const validSeverities = ['none', 'low', 'medium', 'high', 'critical'];
    const result = classifyInput('Eine ganz normale Frage');
    expect(validSeverities).toContain(result.severity);
  });
});

// ===================================================================
// 10. checkOutput return shape
// ===================================================================
describe('checkOutput return shape', () => {
  it('should return passed boolean and issues array', () => {
    const result = checkOutput('Ein harmloser Text.');
    expect(result).toHaveProperty('passed');
    expect(result).toHaveProperty('issues');
    expect(typeof result.passed).toBe('boolean');
    expect(Array.isArray(result.issues)).toBe(true);
  });
});
