import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { Marker, PlayerSlot, Role, Side, Tactic, TacticStyle, Confidence } from '../types';
import { BASE_TACTICS, MAPS, OPERATORS, getMap, getOperator } from '../lib/queries';
import { useApp } from '../lib/store';
import { validateTactic } from '../lib/validate';
import OperatorIcon from '../components/OperatorIcon';
import { MARKER_KINDS } from '../lib/colors';

const ROLES_ATK: Role[] = ['Entry', 'Hard-Breach', 'Soft-Breach', 'Support', 'Intel', 'Flank-Watch', 'Vertical'];
const ROLES_DEF: Role[] = ['Anchor', 'Flex-Anchor', 'Roamer', 'Deep-Roamer', 'Support-Roamer', 'Utility-Support', 'Intel'];

const STYLES: TacticStyle[] = ['standard', 'aggressiv', 'defensiv', 'anti-ban'];

const toLines = (a: string[]) => a.join('\n');
const fromLines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);

function blankTactic(mapSlug: string, site: string, side: Side): Tactic {
  const map = getMap(mapSlug) ?? MAPS[0];
  const siteObj = map.bombSites.find((s) => s.id === site) ?? map.bombSites[0];
  const pool = OPERATORS.filter((o) => o.role === side);
  const roles = side === 'attack' ? ROLES_ATK : ROLES_DEF;
  const players: PlayerSlot[] = [1, 2, 3, 4, 5].map((slot) => ({
    slot,
    playerName: `Spieler ${slot}`,
    operator: pool[(slot - 1) % pool.length].slug,
    role: roles[(slot - 1) % roles.length],
    tagline: '',
    pickReason: '',
    keyAbility: '',
    loadout: { primary: '–', secondary: '–', gadget: '–' },
    objectives: side === 'attack' ? ['entry'] : ['anchor'],
    prep: ['Startposition und Utility noch im Editor festlegen.'],
    action: ['Action-Phase noch im Editor beschreiben.'],
    markers: [],
  }));
  return {
    id: `eigene-${map.slug}-${siteObj.id}-${side}-${Date.now().toString(36)}`,
    map: map.slug,
    site: siteObj.id,
    side,
    name: `${siteObj.short} – eigene Taktik`,
    style: 'standard',
    summary: 'Neue eigene Taktik – Zusammenfassung im Editor ergänzen.',
    confidence: 'eigene-analyse',
    updated: new Date().toISOString().slice(0, 10),
    ratings: { competitive: 3, difficulty: 'mittel', utilityDependency: 'mittel', coordination: 'mittel', strengths: [], weaknesses: [] },
    players,
    substitutes: [],
    notes: '',
  };
}

/** Taktik aus einer Vorlage klonen (für "Bearbeiten"/"Vorlage nutzen"). */
function cloneFrom(source: Tactic): Tactic {
  return {
    ...structuredClone(source),
    id: `${source.id}-eigene-${Date.now().toString(36)}`,
    name: `${source.name} (eigene)`,
    confidence: 'eigene-analyse',
    updated: new Date().toISOString().slice(0, 10),
    userCreated: true,
  };
}

export default function TacticEditor() {
  const { tacticId } = useParams();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { userTactics, saveTactic, deleteTactic } = useApp();

  const existing = tacticId ? userTactics.find((t) => t.id === tacticId) : undefined;
  const base = useMemo(() => {
    if (existing) return structuredClone(existing);
    const fromId = params.get('from') ?? tacticId;
    const fromBase = fromId ? BASE_TACTICS.find((t) => t.id === fromId) : undefined;
    if (fromBase) return cloneFrom(fromBase);
    const mapParam = params.get('map') || MAPS[0].slug;
    const sideParam: Side = params.get('side') === 'attack' ? 'attack' : 'defense';
    const map = getMap(mapParam) ?? MAPS[0];
    return blankTactic(map.slug, params.get('site') || map.bombSites[0].id, sideParam);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [draft, setDraft] = useState<Tactic>(base);
  const [msg, setMsg] = useState<string | null>(null);
  const [saveAsCopy, setSaveAsCopy] = useState(false);

  const map = getMap(draft.map) ?? MAPS[0];
  const roles = draft.side === 'attack' ? ROLES_ATK : ROLES_DEF;
  const pool = OPERATORS.filter((o) => o.role === draft.side).sort((a, b) => a.name.localeCompare(b.name, 'de'));

  const usedOps = draft.players.map((p) => p.operator).filter(Boolean);
  const { tactic: validated, issues } = useMemo(() => validateTactic(draft, 'editor'), [draft]);
  const errors = issues.filter((i) => i.severity === 'error');

  const patch = (p: Partial<Tactic>) => setDraft((d) => ({ ...d, ...p }));
  const patchPlayer = (slot: number, p: Partial<PlayerSlot>) =>
    setDraft((d) => ({ ...d, players: d.players.map((x) => (x.slot === slot ? { ...x, ...p } : x)) }));

  function toggleObjective(slot: number, key: string) {
    const p = draft.players.find((x) => x.slot === slot);
    if (!p) return;
    const has = p.objectives.includes(key as never);
    patchPlayer(slot, { objectives: (has ? p.objectives.filter((o) => o !== key) : [...p.objectives, key]) as PlayerSlot['objectives'] });
  }

  function addMarker(slot: number) {
    const p = draft.players.find((x) => x.slot === slot);
    if (!p) return;
    const marker: Marker = { floor: map.floors[0], x: 50, y: 50, kind: 'position', label: 'Neuer Marker' };
    patchPlayer(slot, { markers: [...p.markers, marker] });
  }
  function patchMarker(slot: number, index: number, patchM: Partial<Marker>) {
    const p = draft.players.find((x) => x.slot === slot);
    if (!p) return;
    patchPlayer(slot, { markers: p.markers.map((m, i) => (i === index ? { ...m, ...patchM } : m)) });
  }
  function removeMarker(slot: number, index: number) {
    const p = draft.players.find((x) => x.slot === slot);
    if (!p) return;
    patchPlayer(slot, { markers: p.markers.filter((_, i) => i !== index) });
  }

  function save() {
    if (errors.length) { setMsg('Bitte zuerst die markierten Fehler beheben.'); return; }
    const finalTactic: Tactic = {
      ...draft,
      updated: new Date().toISOString().slice(0, 10),
      userCreated: true,
      id: saveAsCopy ? `eigene-${draft.map}-${draft.site}-${draft.side}-${Date.now().toString(36)}` : draft.id,
    };
    saveTactic(finalTactic);
    setMsg('Gespeichert.');
    nav(`/tactic/${finalTactic.id}`);
  }

  function exportOne() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="breadcrumbs">
        <Link to="/">Start</Link><span className="sep">/</span>
        <Link to="/editor">Editor</Link><span className="sep">/</span>
        <span>{tacticId ?? 'Neu'}</span>
      </div>

      <div className="row" style={{ alignItems: 'flex-end', marginBottom: 12 }}>
        <div style={{ flex: '1 1 320px' }}>
          <h1>{tacticId ? 'Taktik bearbeiten' : 'Neue Taktik'}</h1>
          <p className="muted small" style={{ margin: 0 }}>
            Alle Felder sind frei editierbar. Speichern passiert lokal im Browser (kein Server).
          </p>
        </div>
        <div className="row-tight">
          <button className="btn btn-primary" onClick={save} disabled={errors.length > 0}>Speichern</button>
          <button className="btn" onClick={exportOne}>JSON exportieren</button>
          {existing && (
            <button
              className="btn btn-danger"
              onClick={() => { if (window.confirm('Diese eigene Taktik löschen?')) { deleteTactic(existing.id); nav('/editor'); } }}
            >
              Löschen
            </button>
          )}
        </div>
      </div>

      {msg && <div className={errors.length ? 'badbox' : 'okbox'} style={{ marginBottom: 12 }}>{msg}</div>}
      {errors.length > 0 && (
        <div className="badbox" style={{ marginBottom: 12 }}>
          <b>{errors.length} Fehler:</b>
          <ul className="steps" style={{ marginTop: 4 }}>
            {errors.slice(0, 8).map((e, i) => <li key={i}><span className="mono xsmall">{e.path}</span> – {e.message}</li>)}
          </ul>
        </div>
      )}

      {/* Grunddaten */}
      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="panel-title"><strong>Grunddaten</strong></div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(190px, 100%), 1fr))' }}>
          <label className="field">Name
            <input className="input" value={draft.name} onChange={(e) => patch({ name: e.target.value })} />
          </label>
          <label className="field">Karte
            <select className="select" value={draft.map} onChange={(e) => {
              const m = getMap(e.target.value)!;
              patch({ map: m.slug, site: m.bombSites[0].id });
            }}>
              {MAPS.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
            </select>
          </label>
          <label className="field">Bombsite
            <select className="select" value={draft.site} onChange={(e) => patch({ site: e.target.value })}>
              {map.bombSites.map((s) => <option key={s.id} value={s.id}>{s.short} – {s.name}</option>)}
            </select>
          </label>
          <label className="field">Seite
            <select className="select" value={draft.side} onChange={(e) => patch({ side: e.target.value as Side, players: draft.players.map((p, i) => ({ ...p, role: (e.target.value === 'attack' ? ROLES_ATK : ROLES_DEF)[i % 7] })) })}>
              <option value="defense">Verteidigung</option>
              <option value="attack">Angriff</option>
            </select>
          </label>
          <label className="field">Stil
            <select className="select" value={draft.style} onChange={(e) => patch({ style: e.target.value as TacticStyle })}>
              {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="field">Einstufung
            <select className="select" value={draft.confidence} onChange={(e) => patch({ confidence: e.target.value as Confidence })}>
              <option value="eigene-analyse">Eigene Analyse</option>
              <option value="verifiziert">Verifiziert (belegt)</option>
              <option value="community">Community (unbestätigt)</option>
            </select>
          </label>
          <label className="field">ID (eindeutig)
            <input className="input mono xsmall" value={draft.id} onChange={(e) => patch({ id: e.target.value })} />
          </label>
        </div>
        <label className="field" style={{ marginTop: 10 }}>Zusammenfassung
          <textarea className="textarea" value={draft.summary} onChange={(e) => patch({ summary: e.target.value })} />
        </label>
        <label className="field" style={{ marginTop: 8 }}>Hinweise / Datenlücken
          <textarea className="textarea" value={draft.notes ?? ''} onChange={(e) => patch({ notes: e.target.value })} />
        </label>
      </div>

      {/* Spieler */}
      {(draft.players ?? []).map((p) => (
        <div className="panel" style={{ marginBottom: 12, borderLeft: `3px solid var(--line)` }} key={p.slot}>
          <div className="panel-title">
            <strong>Slot {p.slot}</strong>
            <span className="row-tight">
              <OperatorIcon slug={p.operator} size="xs" />
              <span className="chip">{getOperator(p.operator)?.name ?? p.operator}</span>
            </span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))' }}>
            <label className="field">Operator
              <select className="select" value={p.operator} onChange={(e) => patchPlayer(p.slot, { operator: e.target.value })}>
                {pool.map((o) => (
                  <option key={o.slug} value={o.slug} disabled={usedOps.includes(o.slug) && o.slug !== p.operator}>
                    {o.name}{usedOps.includes(o.slug) && o.slug !== p.operator ? ' (vergeben)' : ''}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">Rolle
              <select className="select" value={p.role} onChange={(e) => patchPlayer(p.slot, { role: e.target.value as Role })}>
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <label className="field">Kurzauftrag
              <input className="input" value={p.tagline} onChange={(e) => patchPlayer(p.slot, { tagline: e.target.value })} />
            </label>
            <label className="field">Fähigkeit
              <input className="input" value={p.keyAbility} onChange={(e) => patchPlayer(p.slot, { keyAbility: e.target.value })} />
            </label>
            <label className="field">Primärwaffe
              <input className="input" value={p.loadout.primary} onChange={(e) => patchPlayer(p.slot, { loadout: { ...p.loadout, primary: e.target.value } })} />
            </label>
            <label className="field">Sekundärwaffe
              <input className="input" value={p.loadout.secondary} onChange={(e) => patchPlayer(p.slot, { loadout: { ...p.loadout, secondary: e.target.value } })} />
            </label>
            <label className="field">Gadget
              <input className="input" value={p.loadout.gadget} onChange={(e) => patchPlayer(p.slot, { loadout: { ...p.loadout, gadget: e.target.value } })} />
            </label>
          </div>
          <label className="field" style={{ marginTop: 8 }}>Warum dieser Pick
            <textarea className="textarea" value={p.pickReason} onChange={(e) => patchPlayer(p.slot, { pickReason: e.target.value })} />
          </label>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', marginTop: 8 }}>
            <label className="field">Prep-Phase (eine Zeile pro Schritt)
              <textarea className="textarea" style={{ minHeight: 92 }} value={toLines(p.prep)} onChange={(e) => patchPlayer(p.slot, { prep: fromLines(e.target.value) })} />
            </label>
            <label className="field">Action-Phase (eine Zeile pro Schritt)
              <textarea className="textarea" style={{ minHeight: 92 }} value={toLines(p.action)} onChange={(e) => patchPlayer(p.slot, { action: fromLines(e.target.value) })} />
            </label>
          </div>
          <div className="row-tight" style={{ marginTop: 8 }}>
            <span className="xsmall faint">Aufgaben:</span>
            {['anchor', 'roam', 'support', 'antiEntry', 'plantDenial', 'hardBreach', 'softBreach', 'intel', 'flankWatch', 'vertical', 'entry', 'retake', 'postPlant', 'utility', 'breach'].map((o) => (
              <button
                key={o}
                className={`chip${p.objectives.includes(o as never) ? ' intel' : ''}`}
                onClick={() => toggleObjective(p.slot, o)}
              >
                {o}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 10 }}>
            <div className="panel-title">
              <strong>Marker ({p.markers.length})</strong>
              <button className="btn btn-sm" onClick={() => addMarker(p.slot)}>+ Marker</button>
            </div>
            {p.markers.length > 0 && (
              <div className="scroll-x">
                <div className="table-scroll">
                <table className="table">
                  <thead><tr><th>Etage</th><th>X %</th><th>Y %</th><th>Typ</th><th>Label</th><th /></tr></thead>
                  <tbody>
                    {p.markers.map((m, i) => (
                      <tr key={i}>
                        <td>
                          <select className="select" value={m.floor} onChange={(e) => patchMarker(p.slot, i, { floor: e.target.value as Marker['floor'] })}>
                            {map.floors.map((f) => <option key={f} value={f}>{f === 'B' ? 'KG' : f}</option>)}
                          </select>
                        </td>
                        <td><input className="input" style={{ width: 68 }} type="number" min={0} max={100} value={m.x} onChange={(e) => patchMarker(p.slot, i, { x: Number(e.target.value) })} /></td>
                        <td><input className="input" style={{ width: 68 }} type="number" min={0} max={100} value={m.y} onChange={(e) => patchMarker(p.slot, i, { y: Number(e.target.value) })} /></td>
                        <td>
                          <select className="select" value={m.kind} onChange={(e) => patchMarker(p.slot, i, { kind: e.target.value as Marker['kind'] })}>
                            {MARKER_KINDS.map((k) => <option key={k.key} value={k.key}>{k.key}</option>)}
                          </select>
                        </td>
                        <td><input className="input" value={m.label} onChange={(e) => patchMarker(p.slot, i, { label: e.target.value })} /></td>
                        <td><button className="btn btn-sm btn-danger" onClick={() => removeMarker(p.slot, i)}>×</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Bewertung */}
      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="panel-title"><strong>Bewertung</strong></div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(170px, 100%), 1fr))' }}>
          <label className="field">Wettkampf-Eignung (1–5)
            <input className="input" type="number" min={1} max={5} value={draft.ratings.competitive}
              onChange={(e) => patch({ ratings: { ...draft.ratings, competitive: Math.min(5, Math.max(1, Number(e.target.value))) as 1 | 2 | 3 | 4 | 5 } })} />
          </label>
          {(['difficulty', 'utilityDependency', 'coordination'] as const).map((k) => (
            <label className="field" key={k}>
              {k === 'difficulty' ? 'Schwierigkeit' : k === 'utilityDependency' ? 'Utility-Abhängigkeit' : 'Koordination'}
              <select className="select" value={draft.ratings[k]} onChange={(e) => patch({ ratings: { ...draft.ratings, [k]: e.target.value as never } })}>
                <option value="niedrig">niedrig</option><option value="mittel">mittel</option><option value="hoch">hoch</option>
              </select>
            </label>
          ))}
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', marginTop: 8 }}>
          <label className="field">Stärken (eine pro Zeile)
            <textarea className="textarea" style={{ minHeight: 80 }} value={toLines(draft.ratings.strengths)} onChange={(e) => patch({ ratings: { ...draft.ratings, strengths: fromLines(e.target.value) } })} />
          </label>
          <label className="field">Schwächen (eine pro Zeile)
            <textarea className="textarea" style={{ minHeight: 80 }} value={toLines(draft.ratings.weaknesses)} onChange={(e) => patch({ ratings: { ...draft.ratings, weaknesses: fromLines(e.target.value) } })} />
          </label>
        </div>
      </div>

      {/* Ersatzpicks */}
      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="panel-title">
          <strong>Ersatzpicks ({draft.substitutes.length})</strong>
          <button
            className="btn btn-sm"
            onClick={() => patch({
              substitutes: [...draft.substitutes, {
                operator: pool[0].slug, for: draft.players[0].operator, role: draft.players[0].role,
                reason: '', takesOver: [], setupChange: '', weakness: '',
              }],
            })}
          >
            + Ersatzpick
          </button>
        </div>
        {draft.substitutes.map((s, i) => (
          <div className="panel tight" key={i} style={{ background: 'var(--bg-3)', marginBottom: 8 }}>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))' }}>
              <label className="field">Operator
                <select className="select" value={s.operator} onChange={(e) => {
                  const next = draft.substitutes.map((x, j) => (j === i ? { ...x, operator: e.target.value } : x));
                  patch({ substitutes: next });
                }}>
                  {pool.map((o) => <option key={o.slug} value={o.slug}>{o.name}</option>)}
                </select>
              </label>
              <label className="field">ersetzt
                <select className="select" value={s.for} onChange={(e) => {
                  const next = draft.substitutes.map((x, j) => (j === i ? { ...x, for: e.target.value } : x));
                  patch({ substitutes: next });
                }}>
                  {draft.players.map((p) => <option key={p.operator} value={p.operator}>{getOperator(p.operator)?.name ?? p.operator}</option>)}
                </select>
              </label>
              <label className="field">Rolle
                <select className="select" value={s.role} onChange={(e) => {
                  const next = draft.substitutes.map((x, j) => (j === i ? { ...x, role: e.target.value as Role } : x));
                  patch({ substitutes: next });
                }}>
                  {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(210px, 100%), 1fr))', marginTop: 6 }}>
              <label className="field">Begründung
                <input className="input" value={s.reason} onChange={(e) => {
                  const next = draft.substitutes.map((x, j) => (j === i ? { ...x, reason: e.target.value } : x));
                  patch({ substitutes: next });
                }} />
              </label>
              <label className="field">Was ändert sich
                <input className="input" value={s.setupChange} onChange={(e) => {
                  const next = draft.substitutes.map((x, j) => (j === i ? { ...x, setupChange: e.target.value } : x));
                  patch({ substitutes: next });
                }} />
              </label>
              <label className="field">Schwäche
                <input className="input" value={s.weakness} onChange={(e) => {
                  const next = draft.substitutes.map((x, j) => (j === i ? { ...x, weakness: e.target.value } : x));
                  patch({ substitutes: next });
                }} />
              </label>
            </div>
            <button
              className="btn btn-sm btn-danger"
              style={{ marginTop: 6 }}
              onClick={() => patch({ substitutes: draft.substitutes.filter((_, j) => j !== i) })}
            >
              Ersatzpick entfernen
            </button>
          </div>
        ))}
      </div>

      <div className="row">
        <button className="btn btn-primary" onClick={save} disabled={errors.length > 0}>Speichern</button>
        <label className="row-tight small">
          <input type="checkbox" checked={saveAsCopy} onChange={(e) => setSaveAsCopy(e.target.checked)} />
          als neue Kopie speichern
        </label>
        <span className="spacer" />
        <span className="xsmall faint">
          {validated ? 'Validierung: OK' : 'Validierung: Fehler'} · Taktiken: {draft.players.length} Spieler, {draft.substitutes.length} Ersatzpicks
        </span>
      </div>
    </div>
  );
}
