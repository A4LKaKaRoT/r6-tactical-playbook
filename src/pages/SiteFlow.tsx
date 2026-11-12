import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Tactic } from '../types';
import { getMap, getOperator, getSite, tacticsFor } from '../lib/queries';
import { useApp } from '../lib/store';
import { useTacticsVersion } from '../lib/useTactics';
import { playerColor } from '../lib/colors';
import OperatorIcon from '../components/OperatorIcon';
import TacticMap from '../components/TacticMap';

const STYLE_LABEL: Record<string, string> = {
  standard: 'Standard', aggressiv: 'Aggressiv', defensiv: 'Defensiv', 'anti-ban': 'Ban-Alternative',
};

type StyleFilter = 'standard' | 'alle' | 'aggressiv' | 'defensiv' | 'anti-ban';

export default function SiteFlow() {
  const { mapSlug = '', side = 'defense', siteId = '' } = useParams();
  const sideTyped = side === 'attack' ? 'attack' : 'defense';
  const map = getMap(mapSlug);
  const site = getSite(mapSlug, siteId);
  const { userTactics, bans } = useApp();
  const [spawn, setSpawn] = useState<string>('alle');
  const [quick, setQuick] = useState(true);
  /** Standard = Basispläne, alle = inkl. Varianten, oder ein konkreter Stil. */
  const [styleFilter, setStyleFilter] = useState<StyleFilter>('standard');
  // Re-Render + Neuberechnung, sobald die Varianten aus dem eigenen Chunk nachgeladen sind.
  const tacticsVersion = useTacticsVersion();

  const tactics = useMemo(
    () => tacticsFor(mapSlug, siteId, sideTyped, userTactics),
    [mapSlug, siteId, sideTyped, userTactics, tacticsVersion],
  );

  const spawns = useMemo(() => {
    const set = new Set<string>();
    tactics.forEach((t) => t.attackPlan && set.add(t.attackPlan.spawn));
    map?.spawns.forEach((s) => set.add(s.name));
    return Array.from(set);
  }, [tactics, map]);

  const byStyle = useMemo(() => {
    if (styleFilter === 'alle') return tactics;
    if (styleFilter === 'standard') return tactics.filter((t) => !t.derivedFrom);
    return tactics.filter((t) => t.style === styleFilter);
  }, [tactics, styleFilter]);

  const visible = useMemo(
    () => (spawn === 'alle' ? byStyle : byStyle.filter((t) => t.attackPlan?.spawn === spawn)),
    [byStyle, spawn],
  );

  const counts = {
    standard: tactics.filter((t) => !t.derivedFrom).length,
    aggressiv: tactics.filter((t) => t.style === 'aggressiv').length,
    defensiv: tactics.filter((t) => t.style === 'defensiv').length,
    'anti-ban': tactics.filter((t) => t.style === 'anti-ban').length,
    alle: tactics.length,
  };

  if (!map || !site) {
    return (
      <div>
        <div className="badbox">
          Site nicht gefunden. <Link to="/maps">Zur Kartenliste</Link>
        </div>
      </div>
    );
  }

  const isAtk = sideTyped === 'attack';

  return (
    <div className={isAtk ? 's-attack' : 's-defense'}>
      <div className="breadcrumbs">
        <Link to="/">Start</Link><span className="sep">/</span>
        <Link to="/maps">Karten</Link><span className="sep">/</span>
        <Link to={`/map/${map.slug}`}>{map.name}</Link><span className="sep">/</span>
        <Link to={`/map/${map.slug}/${sideTyped}`}>{isAtk ? 'Angriff' : 'Verteidigung'}</Link>
        <span className="sep">/</span><span>{site.short}</span>
      </div>

      <div className="row" style={{ alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: '1 1 360px', minWidth: 0 }}>
          <div className="row-tight" style={{ marginBottom: 3 }}>
            <span className={`chip ${isAtk ? 'atk' : 'def'}`}>{isAtk ? 'Angriff' : 'Verteidigung'}</span>
            <span className="chip">{map.name}</span>
            <span className="chip">Etage {site.floors.map((f) => (f === 'B' ? 'KG' : f)).join(' / ')}</span>
          </div>
          <h1 style={{ marginBottom: 3 }}>{site.name}</h1>
          <p className="muted small" style={{ margin: 0, fontFamily: 'var(--mono)', fontSize: 11 }}>
            {counts.standard} Standard{counts.alle > counts.standard ? ` · ${counts.alle - counts.standard} Varianten` : ''}
            {` · ${counts.alle} gesamt`}
          </p>
        </div>
        <div className="row-tight">
          <Link className="btn btn-sm" to={`/map/${map.slug}/${isAtk ? 'defense' : 'attack'}`}>
            → {isAtk ? 'Verteidigung' : 'Angriff'}
          </Link>
          <Link className="btn btn-sm" to={`/editor/new?map=${map.slug}&site=${site.id}&side=${sideTyped}`}>+ Taktik</Link>
        </div>
      </div>

      <div className="toolbar">
        <span className="mono xsmall faint" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>Variante</span>
        <div className="pill-group">
          <button className={styleFilter === 'standard' ? 'on' : ''} onClick={() => setStyleFilter('standard')}>
            Standard <span className="mono faint">{counts.standard}</span>
          </button>
          <button className={styleFilter === 'aggressiv' ? 'on atk' : ''} onClick={() => setStyleFilter('aggressiv')}>
            Aggressiv <span className="mono faint">{counts.aggressiv}</span>
          </button>
          <button className={styleFilter === 'defensiv' ? 'on def' : ''} onClick={() => setStyleFilter('defensiv')}>
            Defensiv <span className="mono faint">{counts.defensiv}</span>
          </button>
          <button className={styleFilter === 'anti-ban' ? 'on' : ''} onClick={() => setStyleFilter('anti-ban')}>
            Ban-Alt. <span className="mono faint">{counts['anti-ban']}</span>
          </button>
          <button className={styleFilter === 'alle' ? 'on' : ''} onClick={() => setStyleFilter('alle')}>
            Alle <span className="mono faint">{counts.alle}</span>
          </button>
        </div>
        {isAtk && (
          <>
            <span className="mono xsmall faint" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', marginLeft: 8 }}>Spawn</span>
            <div className="pill-group">
              <button className={spawn === 'alle' ? 'on atk' : ''} onClick={() => setSpawn('alle')}>Alle</button>
              {spawns.map((s) => (
                <button key={s} className={spawn === s ? 'on atk' : ''} onClick={() => setSpawn(s)}>{s}</button>
              ))}
            </div>
          </>
        )}
        <span className="spacer" />
        <button className={`btn btn-sm${quick ? ' btn-blue' : ''}`} onClick={() => setQuick((v) => !v)}>
          {quick ? 'Karte eingeblendet' : 'Karte ausblenden'}
        </button>
      </div>

      {styleFilter !== 'standard' && (
        <div className="infobox xsmall" style={{ marginBottom: 12 }}>
          Varianten sind <b>eigene Analyse</b>, abgeleitet aus dem Standardplan – kein belegtes Pro-Setup.
          Sie ändern Lineup und Ablauf, nicht die Karte.
        </div>
      )}

      {visible.length === 0 && (
        <div className="warnbox">
          Für diese Auswahl ist keine Taktik hinterlegt.{' '}
          <Link to={`/editor/new?map=${map.slug}&site=${site.id}&side=${sideTyped}`}>Jetzt im Editor anlegen</Link>.
        </div>
      )}

      <div className="stack" style={{ gap: 18 }}>
        {visible.map((t) => <TacticBlock key={t.id} tactic={t} quick={quick} />)}
      </div>

      <div className="row-tight" style={{ marginTop: 18 }}>
        <span className="mono xsmall faint" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>Andere Site</span>
        {map.bombSites.filter((s) => s.id !== site.id).map((s) => (
          <Link key={s.id} className="btn btn-sm" to={`/map/${map.slug}/${sideTyped}/${s.id}`}>
            {s.short} →
          </Link>
        ))}
        {bans.length > 0 && (
          <span className="chip warn">{bans.length} Bans aktiv – Ersatzpicks in der Detailansicht</span>
        )}
      </div>
    </div>
  );
}

function TacticBlock({ tactic, quick }: { tactic: Tactic; quick: boolean }) {
  const { settings } = useApp();
  const [openPlayer, setOpenPlayer] = useState<number | null>(null);
  const nameFor = (slot: number) => settings.players.find((p) => p.slot === slot)?.name || `Spieler ${slot}`;
  const isAtk = tactic.side === 'attack';

  return (
    <article className="tac-block" style={{ ['--acc' as string]: isAtk ? 'var(--attack)' : 'var(--defense)' }}>
      <div className="tac-block-head">
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <div className="row-tight" style={{ marginBottom: 3 }}>
            <span className="chip">{STYLE_LABEL[tactic.style] ?? tactic.style}</span>
            <span className="chip mono">{tactic.ratings.competitive}/5</span>
            <span className={`chip ${tactic.confidence === 'verifiziert' ? 'intel' : 'warn'}`}>
              {tactic.confidence === 'verifiziert' ? 'verifiziert' : tactic.confidence === 'community' ? 'Community' : 'eigene Analyse'}
            </span>
            {tactic.userCreated && <span className="chip intel">eigene Taktik</span>}
            {tactic.derivedFrom && <span className="chip">Variante</span>}
          </div>
          <h2 style={{ marginBottom: 3, fontSize: 16 }}>{tactic.name}</h2>
          <p className="small muted" style={{ margin: 0, maxWidth: '78ch' }}>{tactic.summary}</p>
        </div>
        <Link className="btn btn-sm" to={`/tactic/${tactic.id}`}>Details &amp; Ban-Engine →</Link>
      </div>

      {/* Lineup: eine Zeile pro Spieler, Icon + Aufgabe. Kein Karten-Grid. */}
      <div className="mini-lineup">
        {tactic.players.map((p) => {
          const active = openPlayer === p.slot;
          return (
            <button
              key={p.slot}
              className={`mini-op${active ? ' open' : ''}`}
              onClick={() => setOpenPlayer(active ? null : p.slot)}
              style={{ ['--pc' as string]: playerColor(p.slot) }}
              aria-expanded={active}
            >
              <OperatorIcon slug={p.operator} size="xs" />
              <span className="mo-names">
                <b>{getOperator(p.operator)?.name ?? p.operator}</b>
                <span>P{p.slot} · {nameFor(p.slot)}</span>
              </span>
              <span className="mo-role">{p.role}</span>
            </button>
          );
        })}
      </div>

      {openPlayer !== null && (() => {
        const p = tactic.players.find((x) => x.slot === openPlayer);
        if (!p) return null;
        return (
          <div className="mini-expand">
            <div className="panel-title" style={{ marginBottom: 8 }}>
              <strong>P{p.slot} {nameFor(p.slot)} — {getOperator(p.operator)?.name}</strong>
              <span className="chip">{p.role}</span>
            </div>
            <p className="small" style={{ margin: '0 0 10px' }}><b>Auftrag:</b> {p.tagline} — {p.pickReason}</p>
            <div className="phases">
              <div className="phase">
                <div className="phase-head"><span className="ph">Prep</span></div>
                <ol className="steps">{p.prep.map((s, i) => <li key={i}>{s}</li>)}</ol>
              </div>
              <div className="phase">
                <div className="phase-head"><span className="ph act">Action</span></div>
                <ol className="steps">{p.action.map((s, i) => <li key={i}>{s}</li>)}</ol>
              </div>
            </div>
          </div>
        );
      })()}

      {quick && (
        <div className="mapwrap" style={{ marginTop: 12, alignItems: 'stretch' }}>
          <TacticMap tactic={tactic} compact />
          <div className="stack" style={{ gap: 8 }}>
            {tactic.attackPlan && (
              <div className="panel tight">
                <div className="panel-title" style={{ marginBottom: 6 }}>
                  <strong>Execute</strong><span className="chip atk">{tactic.attackPlan.spawn}</span>
                </div>
                <ol className="steps">{tactic.attackPlan.execute.map((s, i) => <li key={i}>{s}</li>)}</ol>
                <div className="infobox xsmall" style={{ marginTop: 8 }}>
                  Plant: {tactic.attackPlan.plant.spot}
                </div>
              </div>
            )}
            {tactic.defensePlan && (
              <div className="panel tight">
                <div className="panel-title" style={{ marginBottom: 6 }}>
                  <strong>Retake</strong><span className="chip def">Setup</span>
                </div>
                <ol className="steps">{tactic.defensePlan.retake.slice(0, 4).map((s, i) => <li key={i}>{s}</li>)}</ol>
              </div>
            )}
            <div className="panel tight">
              <div className="panel-title" style={{ marginBottom: 6 }}><strong>Kernpunkte</strong></div>
              <ul className="steps plain">
                {tactic.players.slice(0, 3).map((p) => (
                  <li key={p.slot}><b>{getOperator(p.operator)?.name}:</b> {p.action[0]}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
