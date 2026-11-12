import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Tactic } from '../types';
import { adjustTacticForBans, getMap, getOperator, getSite, META } from '../lib/queries';
import { useApp } from '../lib/store';
import { playerColor } from '../lib/colors';
import OperatorIcon from './OperatorIcon';
import TacticMap from './TacticMap';
import BanPanel from './BanPanel';

const STYLE_LABEL: Record<string, string> = {
  standard: 'Standard',
  aggressiv: 'Aggressiv',
  defensiv: 'Defensiv',
  'anti-ban': 'Ban-Alternative',
};

const CONFIDENCE_LABEL: Record<string, { text: string; cls: string }> = {
  verifiziert: { text: 'Verifiziertes Pro-Setup', cls: 'chip intel' },
  community: { text: 'Community-Setup (unbestätigt)', cls: 'chip warn' },
  'eigene-analyse': { text: 'Eigene Analyse', cls: 'chip' },
};

const OBJECTIVE_LABEL: Record<string, string> = {
  anchor: 'Anker', roam: 'Roam', support: 'Support', antiEntry: 'Anti-Entry', plantDenial: 'Plant-Denial',
  hardBreach: 'Hard Breach', softBreach: 'Soft Breach', intel: 'Intel', flankWatch: 'Flank Watch',
  vertical: 'Vertikal', entry: 'Entry', retake: 'Retake', postPlant: 'Post-Plant', breach: 'Breach', utility: 'Utility',
};

const LEVEL: Record<string, number> = { niedrig: 2, mittel: 3, hoch: 5 };

/** Bewertungsbalken aus 5 Segmenten – liest sich wie eine Anzeige, nicht wie ein Verlauf. */
function Rating({ label, value }: { label: string; value: number }) {
  return (
    <div className="rating-row">
      <span className="lbl">{label}</span>
      <span className="bar" role="img" aria-label={`${label}: ${value} von 5`}>
        {[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= value ? 'on' : ''} />)}
      </span>
      <span className="num">{value}/5</span>
    </div>
  );
}

export default function TacticView({ tactic }: { tactic: Tactic }) {
  const map = getMap(tactic.map);
  const site = getSite(tactic.map, tactic.site);
  const { bans, favorites, toggleFavorite, markRecent, settings } = useApp();
  const [openSlots, setOpenSlots] = useState<number[]>([1]);
  const [showSubs, setShowSubs] = useState(true);

  useEffect(() => { markRecent(tactic.id); }, [tactic.id, markRecent]);

  const adjustment = useMemo(() => adjustTacticForBans(tactic, bans), [tactic, bans]);
  const slots = adjustment.slots;
  const isFav = favorites.includes(tactic.id);
  const conf = CONFIDENCE_LABEL[tactic.confidence] ?? CONFIDENCE_LABEL['eigene-analyse'];
  const isAtk = tactic.side === 'attack';

  const playerName = (slot: number) =>
    settings.players.find((p) => p.slot === slot)?.name || `Spieler ${slot}`;

  const plan = tactic.attackPlan;
  const def = tactic.defensePlan;
  const replacedCount = slots.filter((s) => s.replaced).length;

  return (
    <div>
      <div className="breadcrumbs">
        <Link to="/maps">Karten</Link><span className="sep">/</span>
        <Link to={`/map/${tactic.map}`}>{map?.name ?? tactic.map}</Link><span className="sep">/</span>
        <Link to={`/map/${tactic.map}/${tactic.side}`}>{isAtk ? 'Angriff' : 'Verteidigung'}</Link>
        <span className="sep">/</span>
        <Link to={`/map/${tactic.map}/${tactic.side}/${tactic.site}`}>{site?.short ?? tactic.site}</Link>
        <span className="sep">/</span>
        <span>{STYLE_LABEL[tactic.style] ?? tactic.style}</span>
      </div>

      {/* ---------- Kopf: Briefing-Karte mit Metadatenleiste ---------- */}
      <header className={`tac-head ${isAtk ? 's-attack' : 's-defense'}`}>
        <div className="tac-head-top">
          <div style={{ flex: '1 1 420px', minWidth: 0 }}>
            <div className="row-tight" style={{ marginBottom: 4 }}>
              <span className={`chip ${isAtk ? 'atk' : 'def'}`}>{isAtk ? 'Angriff' : 'Verteidigung'}</span>
              <span className="chip">{STYLE_LABEL[tactic.style] ?? tactic.style}</span>
              {tactic.derivedFrom && <span className="chip">Variante</span>}
              {tactic.userCreated && <span className="chip intel">eigene Taktik</span>}
              <span className={conf.cls}>{conf.text}</span>
            </div>
            <h1>{tactic.name}</h1>
            <p className="summary">{tactic.summary}</p>
          </div>
          <div className="row-tight" style={{ flex: '0 0 auto' }}>
            <button className={`btn${isFav ? ' btn-blue' : ''}`} onClick={() => toggleFavorite(tactic.id)}>
              {isFav ? '★ Favorit' : '☆ Favorit'}
            </button>
            <Link className="btn" to={`/editor/${tactic.id}`}>Bearbeiten</Link>
            <button className="btn btn-ghost" onClick={() => window.print()} title="Drucken / als PDF sichern">Drucken</button>
          </div>
        </div>

        {/* Datenleiste: alles, was den Stand der Taktik betrifft, in einer Zeile */}
        <div className="tac-meta">
          <div>
            <span className="k">Karte</span>
            <span className="v">{map?.name ?? tactic.map}</span>
          </div>
          <div>
            <span className="k">Bombsite</span>
            <span className="v">{site?.name ?? tactic.site} <span className="mono faint">({site?.short})</span></span>
          </div>
          <div>
            <span className="k">Etage</span>
            <span className="v mono">{(site?.floors ?? []).map((f) => (f === 'B' ? 'KG' : f)).join(' / ') || '–'}</span>
          </div>
          <div>
            <span className="k">Stand</span>
            <span className="v mono">{new Date(tactic.updated).toLocaleDateString('de-DE')}</span>
          </div>
          <div>
            <span className="k">Datenbasis</span>
            <span className="v mono">T{tactic.ratings.competitive}/5 · {tactic.confidence === 'verifiziert' ? 'belegt' : 'Analyse'}</span>
          </div>
          {bans.length > 0 && (
            <div>
              <span className="k">Bans aktiv</span>
              <span className="v mono" style={{ color: 'var(--warn)' }}>{bans.length} · {replacedCount} ersetzt</span>
            </div>
          )}
        </div>
      </header>

      {tactic.notes && <div className="warnbox" style={{ marginBottom: 12 }}>{tactic.notes}</div>}

      <div className="tactic-grid">
        <div className="stack" style={{ gap: 16 }}>
          {/* ---------- Karte zuerst: das ist das Arbeitsmittel ---------- */}
          <TacticMap tactic={tactic} />

          {/* ---------- Lineup als geschlossene Einheit ---------- */}
          <section className="card flush">
            <div className="panel-title" style={{ padding: '10px 12px 8px', margin: 0 }}>
              <strong>Lineup — {isAtk ? 'Angreifer' : 'Verteidiger'} · 5 Slots</strong>
              <span className="row-tight">
                <button className="btn btn-sm" onClick={() => setOpenSlots(slots.map((s) => s.slot))}>alle öffnen</button>
                <button className="btn btn-sm" onClick={() => setOpenSlots([])}>alle schließen</button>
              </span>
            </div>
            <div className="lineup" style={{ border: 0, borderRadius: 0 }}>
              {slots.map((p) => {
                const open = openSlots.includes(p.slot);
                const op = getOperator(p.operator);
                return (
                  <div key={p.slot}>
                    <div
                      className="lineup-row"
                      style={{ ['--pc' as string]: playerColor(p.slot), cursor: 'pointer' }}
                      onClick={() => setOpenSlots((l) => (l.includes(p.slot) ? l.filter((x) => x !== p.slot) : [...l, p.slot]))}
                    >
                      <span className="slotbar" />
                      <div className="lineup-op">
                        <OperatorIcon slug={p.operator} size="lg" />
                        <span className="names">
                          <span className="opname">{op?.name ?? p.operator}</span>
                          <span className="slot">P{p.slot} · {playerName(p.slot)}</span>
                        </span>
                      </div>
                      <div className="lineup-role">
                        <span className="role">{p.role}</span>
                        <span className="task">
                          {p.tagline}
                          {p.replaced && (
                            <> — <b style={{ color: 'var(--warn)' }}>ersetzt {getOperator(p.replaced.banned)?.name}</b></>
                          )}
                          {p.warning && <> — <b style={{ color: 'var(--warn)' }}>Ban ohne Ersatz</b></>}
                        </span>
                      </div>
                      <div className="lineup-actions">
                        <span className="faint mono xsmall">{open ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    {open && (
                      <div className="lineup-expand">
                        <div className="lineup-detail">
                          <dl className="kv">
                            <dt>Warum</dt><dd>{p.pickReason}</dd>
                            <dt>Fähigkeit</dt><dd>{p.keyAbility}</dd>
                            <dt>Loadout</dt>
                            <dd className="mono" style={{ fontSize: 11.5 }}>
                              {p.loadout.primary} · {p.loadout.secondary} · {p.loadout.gadget}
                            </dd>
                            <dt>Rolle</dt>
                            <dd className="taglist">
                              {p.objectives.map((o) => <span className="chip" key={o}>{OBJECTIVE_LABEL[o] ?? o}</span>)}
                            </dd>
                          </dl>
                          <div className="phases">
                            <div className="phase">
                              <div className="phase-head">
                                <span className="ph">Prep</span>
                                <span className="xsmall faint">{isAtk ? 'Vorbereitung' : 'Setup'} · vor der Runde</span>
                              </div>
                              <ol className="steps">{p.prep.map((s, i) => <li key={i}>{s}</li>)}</ol>
                            </div>
                            <div className="phase">
                              <div className="phase-head">
                                <span className="ph act">Action</span>
                                <span className="xsmall faint">nach Rundenstart</span>
                              </div>
                              <ol className="steps">{p.action.map((s, i) => <li key={i}>{s}</li>)}</ol>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ---------- Ablaufpläne ---------- */}
          {plan && (
            <section className="card">
              <div className="panel-title acc s-attack">
                <strong>Angriffsplan</strong>
                <span className="chip atk">{plan.spawn}</span>
              </div>
              <div className="phases" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(210px, 100%), 1fr))' }}>
                <div className="phase">
                  <div className="phase-head"><span className="ph">01</span><span className="xsmall faint">Einstieg &amp; Route</span></div>
                  <ol className="steps">{plan.entryRoute.map((s, i) => <li key={i}>{s}</li>)}</ol>
                </div>
                <div className="phase">
                  <div className="phase-head"><span className="ph">02</span><span className="xsmall faint">Drohnen</span></div>
                  <ol className="steps">{plan.drones.map((s, i) => <li key={i}>{s}</li>)}</ol>
                </div>
                <div className="phase">
                  <div className="phase-head"><span className="ph">03</span><span className="xsmall faint">Execute</span></div>
                  <ol className="steps">{plan.execute.map((s, i) => <li key={i}>{s}</li>)}</ol>
                </div>
                <div className="phase">
                  <div className="phase-head"><span className="ph">04</span><span className="xsmall faint">Post-Plant</span></div>
                  <ol className="steps">{plan.postPlant.map((s, i) => <li key={i}>{s}</li>)}</ol>
                </div>
              </div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', marginTop: 12 }}>
                <div className="infobox">
                  <b>Plant:</b> {plan.plant.spot} · Etage {plan.plant.floor === 'B' ? 'KG' : plan.plant.floor} ·
                  <b> Deckung:</b> {plan.plant.cover}
                </div>
                <div className="warnbox">
                  <b>Alternative:</b> {plan.alt.spawn} – {plan.alt.why} {plan.alt.alternativePush}
                </div>
              </div>
            </section>
          )}

          {def && (
            <section className="card">
              <div className="panel-title acc s-defense">
                <strong>Verteidigungsplan</strong>
                <span className="chip def">Retake &amp; Roam</span>
              </div>
              <div className="phases" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))' }}>
                <div className="phase">
                  <div className="phase-head"><span className="ph">Retake</span><span className="xsmall faint">nach Pflanzung</span></div>
                  <ol className="steps">{def.retake.map((s, i) => <li key={i}>{s}</li>)}</ol>
                </div>
                <div className="phase">
                  <div className="phase-head"><span className="ph">Roam</span><span className="xsmall faint">Rundenaufbau</span></div>
                  <ol className="steps">{def.roamPlan.map((s, i) => <li key={i}>{s}</li>)}</ol>
                </div>
              </div>
            </section>
          )}

          {/* ---------- Ersatzpicks ---------- */}
          <section className="card">
            <div className="panel-title">
              <strong>Ersatzpicks · {tactic.substitutes.length}</strong>
              <button className="btn btn-sm" onClick={() => setShowSubs((v) => !v)}>{showSubs ? 'ausblenden' : 'anzeigen'}</button>
            </div>
            {showSubs && (
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Ersatz</th><th>für</th><th>Rolle</th><th>Begründung</th><th>Änderung</th><th>Schwäche</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tactic.substitutes.map((s) => (
                      <tr key={`${s.for}-${s.operator}`}>
                        <td>
                          <span className="row-tight">
                            <OperatorIcon slug={s.operator} size="xs" />
                            <b>{getOperator(s.operator)?.name ?? s.operator}</b>
                          </span>
                        </td>
                        <td className="muted">{getOperator(s.for)?.name ?? s.for}</td>
                        <td><span className="chip">{s.role}</span></td>
                        <td className="small">{s.reason}</td>
                        <td className="small">{s.setupChange}</td>
                        <td className="small muted">{s.weakness}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* ---------- Seitenspalte: Bewertung, Bans, Datenstand ---------- */}
        <aside className="sticky-side">
          <section className={`card s-${isAtk ? 'attack' : 'defense'}`}>
            <div className="panel-title">
              <strong>Bewertung</strong>
              <span className="mono xsmall faint">{tactic.ratings.competitive}/5</span>
            </div>
            <div className="rating-bars">
              <Rating label="Wettkampf" value={tactic.ratings.competitive} />
              <Rating label="Schwierigkeit" value={LEVEL[tactic.ratings.difficulty] ?? 3} />
              <Rating label="Utility-Abhängig" value={LEVEL[tactic.ratings.utilityDependency] ?? 3} />
              <Rating label="Koordination" value={LEVEL[tactic.ratings.coordination] ?? 3} />
            </div>

            <div className="split-lists">
              <div>
                <div className="mini-label ok">Stärken</div>
                <ul className="steps plain">{tactic.ratings.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
              <div>
                <div className="mini-label bad">Schwächen</div>
                <ul className="steps plain">{tactic.ratings.weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            </div>
          </section>

          <BanPanel tactic={tactic} />

          <section className="card tight">
            <div className="panel-title"><strong>Datenstand</strong></div>
            <div className="datalist" style={{ fontSize: 11.5 }}>
              <div><dt>Spiel</dt><dd>{META.game}</dd></div>
              <div><dt>Taktik-Stand</dt><dd className="mono">{tactic.updated}</dd></div>
              <div><dt>Daten-Version</dt><dd className="mono">{META.tacticVersion}</dd></div>
            </div>
            <p className="xsmall faint" style={{ margin: '8px 0 0', lineHeight: 1.45 }}>
              {tactic.confidence === 'verifiziert'
                ? 'Als verifiziert markiert: öffentlich dokumentiertes Pro-Setup.'
                : 'Eigene Analyse, kein belegtes Pro-Setup. Markerpositionen geschätzt (±3 %).'}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
