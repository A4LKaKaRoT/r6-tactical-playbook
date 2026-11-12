import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { adjustTacticForBans, fallbackOperators } from '../src/lib/queries';
import type { Tactic } from '../src/types';

const tactics: Tactic[] = JSON.parse(readFileSync(join(process.cwd(), 'src/data/tactics/tactics.json'), 'utf8'));
const bank = tactics.find((t) => t.id === 'bank-ceo-atk-alley')!;

describe('Ban-Engine', () => {
  it('lässt das Lineup ohne Bans unverändert', () => {
    const res = adjustTacticForBans(bank, []);
    expect(res.usedSubstitutes).toHaveLength(0);
    expect(res.slots.map((s) => s.operator)).toEqual(bank.players.map((p) => p.operator));
  });

  it('ersetzt einen gebannten Operator mit einem Ersatzpick derselben Taktik', () => {
    const res = adjustTacticForBans(bank, ['thermite']);
    const slot1 = res.slots.find((s) => s.slot === 1)!;
    expect(slot1.operator).not.toBe('thermite');
    expect(slot1.replaced?.banned).toBe('thermite');
    expect(bank.substitutes.some((s) => s.operator === slot1.operator)).toBe(true);
  });

  it('erzeugt niemals doppelte Operatoren', () => {
    const res = adjustTacticForBans(bank, ['thermite', 'thatcher', 'ash']);
    const ops = res.slots.map((s) => s.operator);
    expect(new Set(ops).size).toBe(ops.length);
    expect(res.overlaps).toHaveLength(0);
  });

  it('ersetzt nicht mit einem ebenfalls gebannten Operator', () => {
    const banned = bank.substitutes.map((s) => s.operator);
    const res = adjustTacticForBans(bank, ['thermite', ...banned]);
    const slot1 = res.slots.find((s) => s.slot === 1)!;
    if (slot1.replaced) expect(banned).not.toContain(slot1.operator);
  });

  it('meldet offen, wenn kein Ersatzpick verfügbar ist', () => {
    const allBanned = [
      'thermite',
      ...bank.substitutes.map((s) => s.operator),
    ];
    const res = adjustTacticForBans(bank, allBanned);
    expect(res.unresolved.length).toBeGreaterThan(0);
    const slot1 = res.slots.find((s) => s.slot === 1)!;
    expect(slot1.warning).toBeTruthy();
  });

  it('liefert Fallback-Vorschläge mit gleicher Rolle und ohne Duplikate', () => {
    const banned = ['thermite', ...bank.substitutes.map((s) => s.operator)];
    const res = adjustTacticForBans(bank, banned);
    expect(res.unresolved.length).toBeGreaterThan(0);
    const fallbacks = fallbackOperators(bank, banned);
    expect(fallbacks.length).toBeGreaterThan(0);
    const ops = fallbacks.map((f) => f.operator);
    expect(new Set(ops).size).toBe(ops.length);
    for (const op of ops) expect(banned).not.toContain(op);
  });

  it('funktioniert für alle Taktiken ohne Duplikate', () => {
    for (const t of tactics) {
      const first = t.players[0].operator;
      const res = adjustTacticForBans(t, [first, t.players[1].operator]);
      const ops = res.slots.map((s) => s.operator);
      expect(new Set(ops).size, `${t.id} Duplikat`).toBe(5);
    }
  });
});
