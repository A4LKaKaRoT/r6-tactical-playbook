import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MAPS, getMap, getOperator, tacticsFor } from '../lib/queries';
import { useApp } from '../lib/store';
import { useTacticsVersion } from '../lib/useTactics';
import OperatorIcon from '../components/OperatorIcon';
import TacticMap from '../components/TacticMap';
import { playerColor } from '../lib/colors';

/**
 * Schnellmodus: in wenigen Klicks zu Karte → Site → 5 Operatoren → Aufgaben,
 * Key-Setup und Karte. Bewusst ohne Suche/Filter, große Touch-Targets.
 */
export default function QuickMode() {
  const { userTactics, settings, bans } = useApp();
  const [mapSlug, setMapSlug] = useState<string | null>(null);
  const [side, setSide] = useState<'defense' | 'attack'>('defense');
  const [siteId, setSiteId] = useState<string | null>(null);
  const tacticsVersion = useTacticsVersion();

  const map = mapSlug ? getMap(mapSlug) : undefined;
  const tactics = useMemo(
    () => (mapSlug && siteId ? tacticsFor(mapSlug, siteId, side, userTactics) : []),
    [mapSlug, siteId, side, userTactics, tacticsVersion],
  );
  const tactic = tactics[0];

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="row-tight" style={{ marginBottom: 3 }}>
            <span className="chip warn">Mid-Match</span>
            <span className="chip mono">{settings.teamName}</span>
          </div>
          <h1 style={{ marginBottom: 0 }}>Schnellmodus</h1>
        </div>
        <span className="head-figs">
          <span><b>1</b> Karte</span>
          <span><b>2</b> Seite</span>
          <span><b>3</b> Site</span>
        </span>
      </div>

      {/* Schritt 1 */}
      <div className="step-label"><span className="stepnum">01</span> Karte</div>
      <div className="quick-maps">
        {MAPS.slice().sort((a, b) => a.name.localeCompare(b.name, 'de')).map((m) => (
          <button
            key={m.slug}
            className={`qmap${mapSlug === m.slug ? ' on' : ''}`}
            onClick={() => { setMapSlug(m.slug); setSiteId(null); }}
          >
            {m.name}
          </button>
        ))}
      </div>

      {map && (
        <>
          <div className="step-label"><span className="stepnum">02</span> Seite</div>
          <div className="pill-group" style={{ marginBottom: 14 }}>
            <button className={side === 'defense' ? 'on def' : ''} onClick={() => { setSide('defense'); setSiteId(null); }}>Verteidigung</button>
            <button className={side === 'attack' ? 'on atk' : ''} onClick={() => { setSide('attack'); setSiteId(null); }}>Angriff</button>
          </div>

          <div className="step-label"><span className="stepnum">03</span> Bombsite</div>
          <div className="sitebar" style={{ marginBottom: 14 }}>
            {map.bombSites.map((s) => {
              const list = tacticsFor(map.slug, s.id, side, userTactics);
              return (
                <button key={s.id} className={`sitebtn${siteId === s.id ? ' active' : ''}`} onClick={() => setSiteId(s.id)}>
                  <strong>{s.short}</strong>
                  <span>{s.name}</span>
                  <span className="xsmall faint" style={{ display: 'block' }}>{list.length} Taktik(en)</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {tactic ? (
        <div className="stack" style={{ gap: 12 }}>
          <div className="card" style={{ borderLeft: `3px solid ${side === 'attack' ? 'var(--attack)' : 'var(--defense)'}` }}>
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 300px' }}>
                <h2 style={{ marginBottom: 2 }}>{tactic.name}</h2>
                <p className="small muted" style={{ margin: 0 }}>{tactic.summary}</p>
              </div>
              <Link className="btn btn-sm" to={`/tactic/${tactic.id}`}>Volle Ansicht →</Link>
            </div>
            {bans.length > 0 && <div className="warnbox" style={{ marginTop: 8 }}>{bans.length} Ban(s) aktiv – Ersatzpicks stehen in der vollen Ansicht.</div>}
          </div>

          <div className="ql-lineup">
            {tactic.players.map((p) => (
              <div key={p.slot} className="ql-op" style={{ ['--pc' as string]: playerColor(p.slot) }}>
                <OperatorIcon slug={p.operator} />
                <div style={{ minWidth: 0 }}>
                  <div className="ql-slot">P{p.slot} · {settings.players.find((x) => x.slot === p.slot)?.name ?? `Spieler ${p.slot}`}</div>
                  <b>{getOperator(p.operator)?.name ?? p.operator}</b>
                  <div className="ql-role">{p.role}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mapwrap">
            <TacticMap tactic={tactic} compact />
            <div className="stack" style={{ gap: 8 }}>
              <div className="card tight">
                <div className="panel-title"><strong>Aufgaben</strong></div>
                <ul className="steps">
                  {tactic.players.map((p) => (
                    <li key={p.slot}><b>{getOperator(p.operator)?.name}:</b> {p.tagline}</li>
                  ))}
                </ul>
              </div>
              <div className="card tight">
                <div className="panel-title"><strong>Key-Setup</strong></div>
                <ol className="steps">
                  {(tactic.attackPlan?.execute ?? tactic.defensePlan?.retake ?? []).slice(0, 5).map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
            </div>
          </div>
        </div>
      ) : (
        mapSlug && <div className="infobox">Wähle eine Bombsite.</div>
      )}

      {!mapSlug && (
        <div className="infobox">
          Tipp: Für den Match-Start reicht Karte + Site. Alles andere (Rollen, Prep, Execute, Post-Plant) steht direkt darunter.
        </div>
      )}
    </div>
  );
}
