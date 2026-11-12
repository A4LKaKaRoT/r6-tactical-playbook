import { Link } from 'react-router-dom';
import { BASE_TACTICS, CORE_TACTICS, META, MAPS, getMap, getOperator, getSite } from '../lib/queries';
import { useTacticsVersion } from '../lib/useTactics';
import { useApp } from '../lib/store';
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

export default function Home() {
  // Re-Render, sobald die Varianten nachgeladen sind (Zähler unten).
  useTacticsVersion();
  const { favorites, recent, settings } = useApp();
  const ranked = MAPS.filter((m) => m.ranked);

  return (
    <div>
      {/* ---- Briefing-Kopf: Auftrag links, harte Kennzahlen rechts ---- */}
      <section className="brief">
        <div className="brief-main">
          <div className="brief-kicker">Einsatzbriefing · {META.seasonLabel} · {META.operation}</div>
          <h1>5-Stack-Playbook für Ranked und Siege Cup</h1>
          <p className="lead">
            Karte → Seite → Bombsite → fertiges Lineup mit Rollen, Prep- und Action-Phase,
            Markern auf dem echten Blueprint und Ban-Engine. Jede Site hat einen Standardplan
            plus drei Varianten: aggressiv, defensiv, Ban-Alternative.
          </p>
          <div className="brief-meta">
            <span className="chip intel">{META.game}</span>
            <span className="chip">Saison {META.seasonLabel}</span>
            <span className="chip">Meta-Stand {new Date(META.lastUpdated).toLocaleDateString('de-DE')}</span>
            <span className="chip">{ranked.length} Ranked-Karten</span>
            <span className="chip ok">offline nutzbar</span>
          </div>
          <div className="brief-actions">
            <Link to="/quick" className="btn btn-primary">Schnellmodus (Mid-Match)</Link>
            <Link to="/maps" className="btn">Alle Karten</Link>
            <Link to="/favorites" className="btn">Favoriten ({favorites.length})</Link>
          </div>
        </div>

        <div className="figures">
          <div className="figure">
            <span className="k">Standardpläne</span>
            <span className="v">{CORE_TACTICS.length}<span>DEF + ATK</span></span>
          </div>
          <div className="figure">
            <span className="k">Taktiken gesamt</span>
            <span className="v">{BASE_TACTICS.length}<span>inkl. Varianten</span></span>
          </div>
          <div className="figure">
            <span className="k">Karten im Pool</span>
            <span className="v">{ranked.length}<span>Ranked</span></span>
          </div>
          <div className="figure">
            <span className="k">Roster</span>
            <span className="v" style={{ fontSize: 15 }}>{settings.teamName}</span>
          </div>
        </div>
      </section>

      {/* ---- Einstiegspfade als Zeilen ---- */}
      <div className="paths">
        <Link to="/attack" className="path atk">
          <span className="idx">01</span>
          <span className="lbl"><i className="sq" />Angriff</span>
          <span className="desc">Karte → Spawn → Bombsite → Execute, Plant und Post-Plant</span>
          <span className="go">→</span>
        </Link>
        <Link to="/defense" className="path def">
          <span className="idx">02</span>
          <span className="lbl"><i className="sq" />Verteidigung</span>
          <span className="desc">Karte → Bombsite → Anker, Roamer, Utility, Retake</span>
          <span className="go">→</span>
        </Link>
        <Link to="/quick" className="path fav">
          <span className="idx">03</span>
          <span className="lbl"><i className="sq" />Schnellmodus</span>
          <span className="desc">Drei Klicks im Match: Karte, Site, Lineup</span>
          <span className="go">→</span>
        </Link>
        <Link to="/editor" className="path edit">
          <span className="idx">04</span>
          <span className="lbl"><i className="sq" />Editor</span>
          <span className="desc">Eigene Taktiken anlegen, kopieren, exportieren</span>
          <span className="go">→</span>
        </Link>
      </div>

      {recent.length > 0 && (
        <>
          <div className="section-head">
            <h2>Zuletzt geöffnet</h2>
            <span className="spacer" />
            <span className="xsmall faint">lokal im Browser gespeichert</span>
          </div>
          <div className="card flush recent-list">
            {recent.slice(0, 5).map((id) => <TacticRow key={id} id={id} />)}
          </div>
        </>
      )}

      <div className="section-head">
        <h2>Ranked-Pool {META.seasonLabel}</h2>
        <span className="spacer" />
        <span className="xsmall faint">Pool-Stand {new Date(META.rankedPoolUpdated).toLocaleDateString('de-DE')}</span>
      </div>
      <div className="maptiles">
        {ranked.map((m) => <MapTile key={m.slug} map={m} />)}
      </div>

      <div className="section-head">
        <h2>Siege Cup</h2>
        <span className="spacer" />
        <Link className="btn btn-sm" to="/maps">Alle Karten &amp; Archiv →</Link>
      </div>
      <div className="card">
        <p className="small muted" style={{ marginTop: 0 }}>
          <b>{META.siegeCup.rotationLabel}:</b> {META.siegeCup.note}
        </p>
        <div className="row-tight">
          {META.siegeCup.maps.map((slug) => {
            const m = getMap(slug);
            return m ? <Link key={slug} className="chip def" to={`/map/${slug}`}>{m.name}</Link> : null;
          })}
        </div>
      </div>

      <div className="section-head">
        <h2>Saison-Änderungen</h2>
        <span className="spacer" />
        <Link className="btn btn-sm" to="/settings">Changelog &amp; Versionen →</Link>
      </div>
      <div className="card">
        <div className="table-scroll">
          <table className="table">
            <thead><tr><th style={{ width: 96 }}>Datum</th><th>Thema</th><th>Änderung</th></tr></thead>
            <tbody>
              {META.balanceHighlights.slice(0, 6).map((b, i) => (
                <tr key={i}>
                  <td className="mono small faint">{new Date(b.date).toLocaleDateString('de-DE')}</td>
                  <td>{b.topic}</td>
                  <td className="small muted">{b.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="xsmall faint" style={{ marginTop: 24, fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>
        ROSTER {settings.teamName.toUpperCase()} · NAMEN IN DEN EINSTELLUNGEN ANPASSBAR · KEIN KONTO, KEIN SERVER, ALLES LOKAL
      </p>
    </div>
  );
}
