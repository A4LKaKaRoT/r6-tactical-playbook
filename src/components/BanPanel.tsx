import { useMemo, useState } from 'react';
import { OPERATORS, adjustTacticForBans, fallbackOperators, getOperator } from '../lib/queries';
import { useApp } from '../lib/store';
import OperatorIcon from './OperatorIcon';
import type { Tactic } from '../types';

interface Props {
  tactic: Tactic;
  onApply?: (info: { changes: number }) => void;
}

/**
 * Ban-System: gebannte Operatoren werden gespeichert und auf die aktuelle
 * Taktik angewendet. Ersatzpicks kommen aus dem Substitute-Pool der Taktik;
 * gibt es keinen, zeigt die App das offen an (und liefert einen Fallback
 * mit gleicher Rolle, klar als "ungeprüft" markiert).
 */
export default function BanPanel({ tactic, onApply }: Props) {
  const { bans, toggleBan } = useApp();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const side = tactic.side === 'attack' ? 'attack' : 'defense';
  const adjustment = useMemo(() => adjustTacticForBans(tactic, bans), [tactic, bans]);
  const fallbacks = useMemo(
    () => (adjustment.unresolved.length ? fallbackOperators(tactic, bans) : []),
    [adjustment.unresolved.length, tactic, bans],
  );

  const pool = OPERATORS
    .filter((o) => o.role === side)
    .filter((o) => !filter || o.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));

  const affected = adjustment.slots.filter((s) => s.replaced);

  return (
    <div className="card">
      <div className="panel-title">
        <strong>Ban-System</strong>
        <span className="chip">{bans.length} gebannt</span>
      </div>

      <p className="small muted" style={{ marginTop: 0 }}>
        Gebannte Operatoren werden automatisch ersetzt – Team-Duplikate sind ausgeschlossen.
      </p>

      {affected.length > 0 ? (
        <div className="stack" style={{ marginBottom: 10 }}>
          {affected.map((s) => (
            <div key={s.slot} className="okbox">
              <div className="row-tight">
                <b>P{s.slot}</b>
                <span style={{ textDecoration: 'line-through', opacity: 0.75 }}>
                  {getOperator(s.replaced!.banned)?.name ?? s.replaced!.banned}
                </span>
                <span>→</span>
                <b>{getOperator(s.replaced!.substitute.operator)?.name ?? s.replaced!.substitute.operator}</b>
                <span className="chip intel">{s.replaced!.substitute.role}</span>
              </div>
              <div className="xsmall" style={{ marginTop: 4 }}>
                {s.replaced!.substitute.setupChange} <b>Schwäche:</b> {s.replaced!.substitute.weakness}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="okbox" style={{ marginBottom: 10 }}>Keine der Picks ist aktuell gebannt – Lineup bleibt unverändert.</div>
      )}

      {adjustment.unresolved.length > 0 && (
        <div className="warnbox" style={{ marginBottom: 10 }}>
          <b>Kein Ersatzpick in dieser Taktik:</b>{' '}
          {adjustment.unresolved.map((u) => `${getOperator(u.operator)?.name ?? u.operator} (P${u.slot})`).join(', ')}.
          {fallbacks.length > 0 && (
            <ul className="steps" style={{ marginTop: 6 }}>
              {fallbacks.map((f) => (
                <li key={f.operator}>
                  <b>{getOperator(f.operator)?.name ?? f.operator}</b> – {f.reason}{' '}
                  <span className="chip warn">ungeprüfter Fallback</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {adjustment.overlaps.length > 0 && (
        <div className="badbox" style={{ marginBottom: 10 }}>
          Doppelter Operator im Lineup: {adjustment.overlaps.join(', ')} – bitte im Editor korrigieren.
        </div>
      )}

      <div className="row-tight">
        <button className="btn btn-sm" onClick={() => setOpen((v) => !v)}>
          {open ? 'Ban-Auswahl schließen' : 'Gegner-Bans eintragen'}
        </button>
        {bans.length > 0 && (
          <button className="btn btn-sm btn-danger" onClick={() => bans.slice().forEach((b) => toggleBan(b))}>
            Alle Bans löschen
          </button>
        )}
        {onApply && <button className="btn btn-sm" onClick={() => onApply({ changes: affected.length })}>Übernehmen</button>}
      </div>

      {open && (
        <div style={{ marginTop: 10 }}>
          <input
            className="input"
            style={{ width: '100%', marginBottom: 8 }}
            placeholder="Operator suchen …"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="op-picker">
            {pool.map((o) => {
              const isBanned = bans.includes(o.slug);
              const inTactic = tactic.players.some((p) => p.operator === o.slug);
              return (
                <button
                  key={o.slug}
                  className={`op-chip${isBanned ? ' banned' : ''}${inTactic ? ' inuse' : ''}`}
                  onClick={() => toggleBan(o.slug)}
                  title={inTactic ? `${o.name} ist in dieser Taktik gesetzt` : o.name}
                >
                  <OperatorIcon slug={o.slug} size="xs" />
                  {o.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
