import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateTactic, sanitizeMarker } from '../src/lib/validate';

const tactics = JSON.parse(readFileSync(join(process.cwd(), 'src/data/tactics/tactics.json'), 'utf8'));

const minimal = () => ({
  id: 'test-x',
  map: 'bank',
  site: 'ceo',
  side: 'defense',
  name: 'Test',
  style: 'standard',
  summary: 'Eine ausreichend lange Zusammenfassung für den Test.',
  confidence: 'eigene-analyse',
  updated: '2026-11-11',
  ratings: { competitive: 3, difficulty: 'mittel', utilityDependency: 'mittel', coordination: 'mittel', strengths: [], weaknesses: [] },
  players: [1, 2, 3, 4, 5].map((slot) => ({
    slot,
    playerName: `Spieler ${slot}`,
    operator: ['mira', 'smoke', 'castle', 'pulse', 'valkyrie'][slot - 1],
    role: ['Anchor', 'Anchor', 'Anchor', 'Roamer', 'Roamer'][slot - 1],
    tagline: '',
    pickReason: '',
    keyAbility: '',
    loadout: { primary: 'X', secondary: 'Y', gadget: 'Z' },
    objectives: ['anchor'],
    prep: ['x'],
    action: ['y'],
    markers: [],
  })),
  substitutes: [],
  defensePlan: { retake: ['a'], roamPlan: ['b'] },
});

describe('Schema-Validierung', () => {
  it('akzeptiert alle ausgelieferten Taktiken', () => {
    for (const t of tactics) {
      const { tactic, issues } = validateTactic(t, t.id);
      expect(issues.filter((i) => i.severity === 'error'), `${t.id}: ${JSON.stringify(issues)}`).toHaveLength(0);
      expect(tactic).not.toBeNull();
    }
  });

  it('akzeptiert eine minimal gültige Taktik', () => {
    const { tactic, issues } = validateTactic(minimal(), 'test');
    expect(issues.filter((i) => i.severity === 'error')).toHaveLength(0);
    expect(tactic?.id).toBe('test-x');
  });

  it('verwirft Nicht-Objekte ohne Crash', () => {
    expect(validateTactic(null, 'x').tactic).toBeNull();
    expect(validateTactic('hallo', 'x').tactic).toBeNull();
    expect(validateTactic([1, 2], 'x').tactic).toBeNull();
  });

  it('meldet fehlende Pflichtfelder isoliert pro Taktik', () => {
    const broken = { ...minimal(), name: '' };
    const { tactic, issues } = validateTactic(broken, 'test');
    expect(tactic).toBeNull();
    expect(issues.some((i) => i.path === 'name' && i.severity === 'error')).toBe(true);
  });

  it('erkennt doppelte Operatoren im Lineup', () => {
    const t = minimal();
    t.players[1].operator = t.players[0].operator;
    const { tactic, issues } = validateTactic(t, 'test');
    expect(tactic).toBeNull();
    expect(issues.some((i) => /doppelt/i.test(i.message))).toBe(true);
  });

  it('erkennt ungültige Anzahl Spieler', () => {
    const t = minimal();
    t.players.pop();
    const { tactic, issues } = validateTactic(t, 'test');
    expect(tactic).toBeNull();
    expect(issues.some((i) => i.path === 'players')).toBe(true);
  });

  it('erkennt ungültige Marker-Koordinaten', () => {
    const t = minimal();
    // @ts-expect-error bewusst ungültiger Marker für den Test
    t.players[0].markers = [{ floor: '2F', x: 140, y: 50, kind: 'position', label: 'x' }];
    const { tactic } = validateTactic(t, 'test');
    expect(tactic).toBeNull();
  });

  it('verlangt bei Angriffstaktiken einen vollständigen attackPlan', () => {
    const t = { ...minimal(), side: 'attack', attackPlan: undefined };
    const { tactic, issues } = validateTactic(t, 'test');
    expect(tactic).toBeNull();
    expect(issues.some((i) => i.path === 'attackPlan')).toBe(true);
  });

  it('Rotation-Marker ohne Ziel bekommen automatisch Zielkoordinaten', () => {
    const m = sanitizeMarker({ floor: '1F', x: 20, y: 30, kind: 'rotation', label: 'rot' });
    expect(m.toX).toBe(20);
    expect(m.toY).toBe(30);
  });
});
