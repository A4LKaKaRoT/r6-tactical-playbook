import { Link } from 'react-router-dom';
import { BASE_TACTICS, CORE_TACTICS, META, MAPS, getMap, getOperator, getSite } from '../lib/queries';
import { useTacticsVersion } from '../lib/useTactics';
import { useApp } from '../lib/store';
import { mapKeyartUrl } from '../lib/paths';
import MapTile from '../components/MapTile';

const sideLabel = (s: string) => (s === 'attack' ? 'Angriff' : 'Verteidigung');

function TacticRow({ id }: { id: string }) {
  const { userTactics } = useApp();
  const t = [...userTactics, ...BASE_TACTICS].find((x) => x.id === id); // tacticsVersion hält die Liste aktuell
  if (!t) return null;
  const map = getMap(t.map);
  const site = getSite(t.map, t.site);
  return (
    <Link className="recent-row" to={`/tactic/${t.id}`}>
      <span className={`chip ${t.side === 'attack' ? 'atk' : 'def'}`}>{sideLabel(t.side)}</span>
      <span className="recent-main">
        <b>{t.name}</b>
        <span className="recent-sub">
          {map?.name} · {site?.short} · {t.players.map((p) => getOperator(p.operator)?.name ?? p.operator).join(' · ')}
        </span>
      </span>
      <span className="recent-go">→</span>
    </Link>
  );
}

/** Drei Keyart-Teaser für die Module-Reihe (Ubisoft-Muster „Besuche die Welten"). */
function WideTease({ to, mapSlug, title, kicker, accent }: { to: string; mapSlug: string; title: string; kicker: string; accent: string }) {
  const map = getMap(mapSlug);
  if (!map) return null;
  return (
    <Link className="tile-wide" to={to} style={{ ['--acc' as string]: accent }}>
      <img src={mapKeyartUrl(map.slug)} alt={`${map.name} Keyart`} loading="lazy" />
      <span className="tile-wide-label">
        <span>
          <b>{title}</b>
          <span>{kicker}</span>
        </span>
        <span className="arrow">→</span>
      </span>
    </Link>
  );
}

export default function Home() {
  // Re-Render, sobald die Varianten nachgeladen sind (Zähler unten).
  useTacticsVersion();
  const { favorites, recent, settings } = useApp();
  const ranked = MAPS.filter((m) => m.ranked);
  // Hero-Keyart: bewusst das schärfste 1920x1080-Artwork im Repo (nur Optik, keine Daten)
  const heroMap = getMap('consulate') ?? getMap('villa') ?? ranked[0];
  const cups = MAPS.filter((m) => m.siegeCup).slice(0, 3);

  return (
    <>
      {/* ---------- Hero: vollflächiges Keyart, Text unten links ---------- */}
      <section className="hero">
        <div className="hero-media">
          {heroMap && <img src={mapKeyartUrl(heroMap.slug)} alt="" aria-hidden="true" />}
        </div>
        <div className="hero-inner">
          <span className="hero-kicker">Einsatzbriefing · {META.seasonLabel} · {META.operation}</span>
          <h1>Tactical Playbook</h1>
          <p className="hero-lead">
            Karte, Seite, Bombsite, fertiges Lineup. Jede Site mit Standardplan plus drei Varianten —
            Rollen, Prep- und Action-Phase, Marker auf dem echten Blueprint und Ban-Engine.
          </p>
          <div className="hero-meta">
            <span className="chip intel">{META.game}</span>
            <span className="chip">Saison {META.seasonLabel}</span>
            <span className="chip">{ranked.length} Ranked-Karten</span>
            <span className="chip ok">offline nutzbar</span>
          </div>
          <div className="hero-actions">
            <Link to="/quick" className="btn btn-primary">Schnellmodus starten</Link>
            <Link to="/maps" className="btn">Karten ansehen</Link>
            <Link to="/favorites" className="btn btn-ghost">★ Favoriten ({favorites.length})</Link>
          </div>
          <div className="hero-figures">
            <div>
              <span className="k">Standardpläne</span>
              <span className="v">{CORE_TACTICS.length}</span>
            </div>
            <div>
              <span className="k">Taktiken gesamt</span>
              <span className="v">{BASE_TACTICS.length}</span>
            </div>
            <div>
              <span className="k">Karten</span>
              <span className="v">{MAPS.length}</span>
            </div>
            <div>
              <span className="k">Meta-Stand</span>
              <span className="v" style={{ fontSize: 15 }}>{new Date(META.lastUpdated).toLocaleDateString('de-DE')}</span>
            </div>
            <div>
              <span className="k">Roster</span>
              <span className="v" style={{ fontSize: 15 }}>{settings.teamName}</span>
            </div>
          </div>
        </div>
      </section>
      <div className="home-body">

        {/* ---------- Einstiegspfade ---------- */}
        <div className="section-head" style={{ marginTop: 0 }}>
          <h2>Direkt starten</h2>
          <span className="spacer" />
          <span className="xsmall faint">Karte → Seite → Site → Lineup</span>
        </div>
        <div className="paths">
          <Link to="/attack" className="path atk">
            <span className="idx">01</span>
            <span className="lbl"><i className="sq" />Angriff</span>
            <span className="desc">Spawn → Bombsite → Execute, Plant und Post-Plant mit fünf Angreifern</span>
            <span className="go">→</span>
          </Link>
          <Link to="/defense" className="path def">
            <span className="idx">02</span>
            <span className="lbl"><i className="sq" />Verteidigung</span>
            <span className="desc">Anker, Roamer, Utility-Support, Retake- und Rotationsplan</span>
            <span className="go">→</span>
          </Link>
          <Link to="/quick" className="path fav">
            <span className="idx">03</span>
            <span className="lbl"><i className="sq" />Schnellmodus</span>
            <span className="desc">Drei Klicks mitten im Match: Karte, Seite, Lineup</span>
            <span className="go">→</span>
          </Link>
          <Link to="/editor" className="path edit">
            <span className="idx">04</span>
            <span className="lbl"><i className="sq" />Editor</span>
            <span className="desc">Eigene Taktiken anlegen, kopieren, als JSON sichern</span>
            <span className="go">→</span>
          </Link>
        </div>

        {/* ---------- Modul-Reihe: Keyart-Teaser ---------- */}
        <div className="section-head">
          <h2>Schauplätze</h2>
          <span className="spacer" />
          <Link className="btn btn-sm" to="/maps">Alle Karten →</Link>
        </div>
        <div className="tiles-wide">
          <WideTease to="/attack" mapSlug="bank" title="Angriff" kicker="Spawn-Splits · Hard Breach · Post-Plant" accent="var(--attack)" />
          <WideTease to="/defense" mapSlug="oregon" title="Verteidigung" kicker="Anker · Roamer · Retake" accent="var(--defense)" />
          <WideTease to="/tactics" mapSlug="clubhouse" title="Alle Taktiken" kicker={`${BASE_TACTICS.length} Pläne durchsuchbar`} accent="var(--intel)" />
        </div>

        {recent.length > 0 && (
          <>
            <div className="section-head">
              <h2>Zuletzt geöffnet</h2>
              <span className="spacer" />
              <span className="xsmall faint">lokal im Browser gespeichert</span>
            </div>
            <div className="panel flush recent-list">
              {recent.slice(0, 5).map((id) => <TacticRow key={id} id={id} />)}
            </div>
          </>
        )}

        {/* ---------- Ranked-Pool ---------- */}
        <div className="section-head">
          <h2>Ranked-Pool {META.seasonLabel}</h2>
          <span className="spacer" />
          <span className="xsmall faint">Pool-Stand {new Date(META.rankedPoolUpdated).toLocaleDateString('de-DE')}</span>
        </div>
        <div className="maptiles">
          {ranked.map((m) => <MapTile key={m.slug} map={m} />)}
        </div>

        {/* ---------- Siege Cup ---------- */}
        <div className="section-head">
          <h2>Siege Cup</h2>
          <span className="spacer" />
          <Link className="btn btn-sm" to="/maps">Karten &amp; Archiv →</Link>
        </div>
        {cups.length > 0 && (
          <div className="tiles-wide" style={{ marginBottom: 'var(--s4)' }}>
            {cups.map((m) => (
              <Link key={m.slug} className="tile-wide" to={`/map/${m.slug}`} style={{ ['--acc' as string]: 'var(--defense)' }}>
                <img src={mapKeyartUrl(m.slug)} alt={`${m.name} Keyart`} loading="lazy" />
                <span className="tile-wide-label">
                  <span>
                    <b>{m.name}</b>
                    <span>{m.location}</span>
                  </span>
                  <span className="arrow">→</span>
                </span>
              </Link>
            ))}
          </div>
        )}
        <p className="small muted" style={{ maxWidth: '86ch' }}>
          <b style={{ color: 'var(--text)' }}>{META.siegeCup.rotationLabel}:</b> {META.siegeCup.note}
        </p>

        {/* ---------- Saison-Änderungen ---------- */}
        <div className="section-head">
          <h2>Saison-Änderungen</h2>
          <span className="spacer" />
          <Link className="btn btn-sm" to="/settings">Changelog &amp; Versionen →</Link>
        </div>
        <div className="table-scroll">
          <table className="table">
            <thead><tr><th style={{ width: 104 }}>Datum</th><th>Thema</th><th>Änderung</th></tr></thead>
            <tbody>
              {META.balanceHighlights.slice(0, 6).map((b, i) => (
                <tr key={i}>
                  <td className="mono xsmall faint">{new Date(b.date).toLocaleDateString('de-DE')}</td>
                  <td style={{ fontWeight: 600 }}>{b.topic}</td>
                  <td className="small muted">{b.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="xsmall faint" style={{ marginTop: 'var(--s7)', fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Roster {settings.teamName} · Namen in den Einstellungen anpassbar · Kein Konto, kein Server, alles lokal
        </p>
      </div>
    </>
  );
}
